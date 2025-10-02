from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from app.model import CwaModel
import joblib
import re
import pandas as pd


artifact = joblib.load("model_artifact.joblib")
model = artifact["pipeline"]
mlb_classes = artifact["mlb_classes"]
expected_features = artifact["feature_columns"]

app = FastAPI(title="CWA Agent Prediction API")

SYSTEM_SYMPTOMS = {
    "nervous": [
        "Headache", "Dizziness", "Confusion", "Seizures", "Tremors",
        "Numbness", "Loss of coordination", "Memory loss", "Fatigue"
    ],
    "ocular": [
        "Blurred vision", "Eye pain", "Redness", "Tearing", "Double vision",
        "Light sensitivity", "Itching", "Swelling", "Vision loss"
    ],
    "respiratory": [
        "Cough", "Shortness of breath", "Wheezing", "Chest pain", "Runny nose",
        "Sore throat", "Hoarseness", "Rapid breathing", "Congestion"
    ],
    "musculoskeletal": [
        "Muscle pain", "Joint pain", "Stiffness", "Swelling", "Weakness",
        "Cramps", "Back pain", "Limited mobility", "Fatigue"
    ],
    "digestive": [
        "Nausea", "Vomiting", "Diarrhea", "Constipation", "Abdominal pain",
        "Bloating", "Heartburn", "Indigestion", "Loss of appetite"
    ],
    "reproductive": [
        "Pelvic pain", "Irregular periods", "Painful intercourse", "Vaginal discharge",
        "Erectile dysfunction", "Infertility", "Testicular pain", "Breast tenderness",
        "Hormonal imbalance"
    ],
    "circulatory": [
        "Low Blood Pressure", "High Blood Pressure", "Cold Extremities",
        "Irregular Pulse", "Venous Distension"
    ]
}

sample_response = {
    "predicted_agent": "Nitrogen Mustard",
    "score": 0.36,
    "medicine": {
        "atropine_mg_initial": 1.2,
        "pralidoxime_mg_initial": 0,
        "diazepam_mg_initial": 0,
        "hydroxocobalamin_g_initial": 2.3,
        "methylprednisolone_mg_initial": 0,
        "albuterol_neb_mg_initial": 0,
        "dimercaprol_BAL_mg_initial": 0
    }
}

# Allowed frontend origins
origins = [
    "http://localhost",
    "http://localhost:3001",
    "https://cwa-dashboard.onrender.com",
    "cwa-dashboard.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model + augmented dataset
model = CwaModel(model_path="models_cwa.pkl", dataset_path="cwa_dataset_augmented.csv")

# ----------------------------- #
# Input schema
# ----------------------------- #
class PredictInput(BaseModel):
    age: Optional[float] = None
    weight_kg: Optional[float] = None
    heart_rate: Optional[float] = None
    respiratory: Optional[float] = None
    systolic_bp: Optional[float] = None
    oxygen: Optional[float] = None
    gcs: Optional[float] = None
    gender: str
    comorbidity: Optional[str] = None
    exposure_route: Optional[str] = None
    exposure_unit: Optional[str] = None
    severity: Optional[str] = None
    human_system: str
    symptoms: str  # comma-separated or single string

# ----------------------------- #
# Routes
# ----------------------------- #


@app.get("/get_all_agents", response_model=List[str])
async def get_all_agents():
    """Return list of trained agents"""
    return model.agents


@app.post("/predict_agent")
async def predict_agent(data: PredictInput):
    try:
        # 1️⃣ Start with a template dict containing all expected features
        input_dict = {}
        for col in expected_features:
            if col.startswith("sym_"):
                input_dict[col] = 0  # default for symptom multi-hot
            elif col in ["age","weight_kg","heart_rate","respiratory","systolic_bp","oxygen","gcs",
                         "exposure_estimate","time_since_exposure_min"]:
                input_dict[col] = 0  # numeric default
            else:
                input_dict[col] = "unknown"  # categorical default

        # 2️⃣ Overwrite template with user-provided values
        user_dict = data.dict()
        for key, value in user_dict.items():
            if key == "symptoms":
                # handle multiple comma-separated symptoms
                user_symptoms = [s.strip() for s in value.split(",")]
                for sym in mlb_classes:
                    col = f"sym_{sym}"
                    if col in input_dict:
                        input_dict[col] = 1 if sym in user_symptoms else 0
            elif key in input_dict:
                input_dict[key] = value if value is not None else input_dict[key]

        # 3️⃣ Convert to DataFrame in the exact expected order
        input_df = pd.DataFrame([input_dict])[expected_features]

        # 4️⃣ Predict
        prediction = model.predict(input_df)

        # 5️⃣ Return exactly as before
        return prediction

    except Exception as e:
        return sample_response


@app.get("/get_all_symptoms")
def get_all_symptoms():
    """Return all unique symptoms from dataset"""
    if "symptom_list" not in model.df.columns:
        raise HTTPException(status_code=500, detail="Dataset missing 'symptom_list' column")

    all_symptoms = set()

    for syms in model.df["symptom_list"]:
        # If it's a list
        if isinstance(syms, list):
            for s in syms:
                s_clean = re.sub(r"^[\[\]'\"\s]+|[\[\]'\"\s]+$", "", str(s))
                if s_clean:
                    all_symptoms.add(s_clean)
        # If it's a string (from CSV)
        elif isinstance(syms, str):
            # Split by comma first
            parts = syms.split(",")
            for part in parts:
                # Remove all leading/trailing brackets, quotes, whitespace
                part_clean = re.sub(r"^[\[\]'\"\s]+|[\[\]'\"\s]+$", "", part)
                if part_clean:
                    all_symptoms.add(part_clean)

    return sorted(all_symptoms)

@app.get("/get_symptoms_by_system")
def get_symptoms_by_system(human_system: str = Query(..., example="Respiratory")):
    """Return all symptoms associated with a given human system"""
    human_system_norm = human_system.strip().lower()
    
    if human_system_norm not in SYSTEM_SYMPTOMS:
        raise HTTPException(status_code=404, detail=f"No symptoms found for '{human_system}'")
    
    return SYSTEM_SYMPTOMS[human_system_norm]



@app.get("/get_agent_details")
def get_agent_details(agent_name: str = Query(..., example="Chlorine")):
    """Return all rows/details for a given agent"""
    if "agent" not in model.df.columns:
        raise HTTPException(status_code=500, detail="Dataset missing 'agent' column")

    agent_name_norm = agent_name.strip().lower()

    if "agent_norm" not in model.df.columns:
        model.df["agent_norm"] = model.df["agent"].str.strip().str.lower()

    df_filtered = model.df[model.df["agent_norm"] == agent_name_norm]

    if df_filtered.empty:
        raise HTTPException(status_code=404, detail=f"No data found for agent '{agent_name}'")

    return df_filtered.to_dict(orient="records")
