from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from app.model import CwaModel

app = FastAPI(title="CWA Agent Prediction API")

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
