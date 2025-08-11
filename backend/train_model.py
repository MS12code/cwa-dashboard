import pandas as pd
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

DATASET_PATH = "cwa_dataset.xlsx"
MODEL_SAVE_PATH = "models_cwa.pkl"

class Trainer:
    def __init__(self, dataset_path):
        self.dataset_path = dataset_path
        self.df = None
        self.medicine_columns = [
            'atropine_mg_initial', 'pralidoxime_mg_initial', 'diazepam_mg_initial',
            'hydroxocobalamin_g_initial', 'methylprednisolone_mg_initial',
            'albuterol_neb_mg_initial', 'dimercaprol_BAL_mg_initial'
        ]
        self.optional_features = ['age', 'systolic_bp', 'weight_kg', 'oxygen', 'respiratory', 'heart_rate']
        self.mandatory_features = ['gender', 'symptoms', 'human_system']
        self.features = self.mandatory_features + self.optional_features
        self.label_encoders = {}
        self.agent_models = {}
        self.agent_to_medicine = {}
        self.agents = []

    def load_and_prepare_data(self):
        self.df = pd.read_excel(self.dataset_path)
        self.df.fillna(0, inplace=True)

        # Map severity strings to numeric values
        severity_mapping = {
            "Mild": 1,
            "Moderate": 2,
            "Severe": 3
            # Add more if needed depending on your dataset
        }
        self.df['severity'] = self.df['severity'].map(severity_mapping).fillna(0).astype(float)

        # Encode categorical features
        for col in self.mandatory_features:
            le = LabelEncoder()
            self.df[col] = le.fit_transform(self.df[col].astype(str))
            self.label_encoders[col] = le

        self.agents = self.df['agent'].unique()

    def train_models(self):
        for agent in self.agents:
            df_agent = self.df[self.df['agent'] == agent]
            if len(df_agent) < 5:
                # Skip agents with less than 5 records to avoid poor models
                continue

            X = df_agent[self.features]
            y = df_agent['severity']

            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X, y)

            self.agent_models[agent] = model

            meds = df_agent[self.medicine_columns].mean().to_dict()
            self.agent_to_medicine[agent] = meds

    def save_models(self, path):
        with open(path, "wb") as f:
            pickle.dump({
                "agent_models": self.agent_models,
                "label_encoders": self.label_encoders,
                "agent_to_medicine": self.agent_to_medicine,
                "features": self.features,
                "agents": list(self.agents)
            }, f)
        print(f"Models saved to {path}")

if __name__ == "__main__":
    trainer = Trainer(DATASET_PATH)
    trainer.load_and_prepare_data()
    trainer.train_models()
    trainer.save_models(MODEL_SAVE_PATH)
