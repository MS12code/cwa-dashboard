from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from app.model import CwaModel

app = FastAPI(title="CWA Agent Prediction API")

# Add this before defining your routes:
origins = [
    "http://localhost",
    "http://localhost:3001",
    "https://cwa-dashboard.onrender.com/",
    "https://cwa-dashboard.onrender.com",
    "cwa-dashboard.onrender.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Allows only these origins to access
    allow_credentials=True,
    allow_methods=["*"],          # Allows all HTTP methods (GET, POST, etc)
    allow_headers=["*"],          # Allows all headers
)

model = CwaModel(model_path="models_cwa.pkl", dataset_path="cwa_dataset.xlsx")

class PredictInput(BaseModel):
    gender: str = Field(..., example="male")
    symptoms: str = Field(..., example="cough, headache")
    human_system: str = Field(..., example="Respiratory")
    age: Optional[float] = Field(0, example=45)
    systolic_bp: Optional[float] = Field(0, example=120)
    weight_kg: Optional[float] = Field(0, example=70)
    oxygen: Optional[float] = Field(0, example=95)
    respiratory: Optional[float] = Field(0, example=18)
    heart_rate: Optional[float] = Field(0, example=80)

@app.get("/get_all_symptoms")
def get_all_symptoms():
    all_symptoms_encoded = set(model.df['symptoms'].unique())
    
    le = model.label_encoders.get('symptoms')
    if le is None:
        # fallback: just return as strings (could be numbers)
        return sorted([str(s) for s in all_symptoms_encoded])
    
    # Decode numeric labels back to original symptom strings
    all_symptoms = set()
    for encoded_sym in all_symptoms_encoded:
        try:
            decoded = le.inverse_transform([encoded_sym])[0]
            # Symptoms might still be comma separated strings, so split:
            split_syms = [s.strip() for s in decoded.split(',')]
            all_symptoms.update(split_syms)
        except Exception:
            pass
    
    return sorted(all_symptoms)

@app.get("/get_all_agents", response_model=List[str])
async def get_all_agents():
    return model.agents

@app.post("/predict_agent")
async def predict_agent(data: PredictInput):
    try:
        prediction = model.predict(data.dict())
        return prediction
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/get_symptoms_by_system")
def get_symptoms_by_system(human_system: str = Query(..., example="Respiratory")):
    le_hs = model.label_encoders.get('human_system')
    le_symptoms = model.label_encoders.get('symptoms')
    if le_hs is None or le_symptoms is None:
        raise HTTPException(status_code=500, detail="Label encoders not found")

    # Encode the input human_system string to its numeric form
    try:
        encoded_hs = le_hs.transform([human_system.lower() if human_system.islower() else human_system])[0]
    except Exception:
        raise HTTPException(status_code=404, detail=f"Human system '{human_system}' not found")

    # Filter df rows with matching human_system
    df_filtered = model.df[model.df['human_system'] == encoded_hs]

    symptoms_set = set()
    for encoded_sym in df_filtered['symptoms'].unique():
        try:
            decoded = le_symptoms.inverse_transform([encoded_sym])[0]
            split_syms = [s.strip() for s in decoded.split(',')]
            symptoms_set.update(split_syms)
        except Exception:
            continue

    return sorted(symptoms_set)

@app.get("/get_agent_details")
def get_agent_details(agent_name: str = Query(..., example="Chlorine")):
    if "agent" not in model.df.columns:
        raise HTTPException(status_code=500, detail="Dataset missing 'agent' column")

    # Normalize agent name input
    agent_name_norm = agent_name.strip().lower()

    # Normalize agent names in df (create normalized column if not exists)
    if 'agent_norm' not in model.df.columns:
        model.df['agent_norm'] = model.df['agent'].str.strip().str.lower()

    df_filtered = model.df[model.df['agent_norm'] == agent_name_norm]

    if df_filtered.empty:
        raise HTTPException(status_code=404, detail=f"No data found for agent '{agent_name}'")

    return df_filtered.to_dict(orient="records")
