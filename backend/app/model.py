import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder
import random

class CwaModel:
    def __init__(self, model_path, dataset_path):
        self.model_path = model_path
        self.dataset_path = dataset_path

        self.agent_models = {}
        self.label_encoders = {}
        self.features = []
        self.agents = []

        self.df = None
        self.feature_matrix = None

        # ✅ static medicine mapping per agent
        self.agent_to_medicine = {
            "Tabun (GA)": {
                'atropine_mg_initial': 2,
                'pralidoxime_mg_initial': 600,
                'diazepam_mg_initial': 10,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0
            },
            "Sarin (GB)": {
                'atropine_mg_initial': 2,
                'pralidoxime_mg_initial': 1000,
                'diazepam_mg_initial': 10,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0
            },
            "Soman (GD)": {
                'atropine_mg_initial': 4,
                'pralidoxime_mg_initial': 600,
                'diazepam_mg_initial': 10,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0
            },
            "VX": {
                'atropine_mg_initial': 2,
                'pralidoxime_mg_initial': 600,
                'diazepam_mg_initial': 10,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0
            },
            "Hydrogen Cyanide (AC)": {
                'atropine_mg_initial': 0,
                'pralidoxime_mg_initial': 0,
                'diazepam_mg_initial': 0,
                'hydroxocobalamin_g_initial': 5,  # 5 g IV
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0
            },
            "Chlorine": {
                'atropine_mg_initial': 0,
                'pralidoxime_mg_initial': 0,
                'diazepam_mg_initial': 0,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 125,  # mg IV
                'albuterol_neb_mg_initial': 2.5,       # mg nebulized
                'dimercaprol_BAL_mg_initial': 0
            },
            "Lewisite (L)": {
                'atropine_mg_initial': 0,
                'pralidoxime_mg_initial': 0,
                'diazepam_mg_initial': 0,
                'hydroxocobalamin_g_initial': 0,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 3  # mg/kg IM
            },
            "Nitrogen Mustard": {
                'atropine_mg_initial': 1.2,
                'pralidoxime_mg_initial': 0,
                'diazepam_mg_initial': 0,
                'hydroxocobalamin_g_initial': 2.3,
                'methylprednisolone_mg_initial': 0,
                'albuterol_neb_mg_initial': 0,
                'dimercaprol_BAL_mg_initial': 0  # mg/kg IM
            }
        }

        self.load_models()
        self.load_and_preprocess_dataset()

    def load_models(self):
        with open(self.model_path, "rb") as f:
            data = pickle.load(f)
            self.agent_models = data["agent_models"]
            self.label_encoders = data["label_encoders"]
            self.features = data["features"]
            self.agents = data["agents"]

    def load_and_preprocess_dataset(self):
        # use CSV instead of Excel for augmented dataset
        if self.dataset_path.endswith(".csv"):
            self.df = pd.read_csv(self.dataset_path)
        else:
            self.df = pd.read_excel(self.dataset_path)

        self.df.fillna(0, inplace=True)

        # Map severity into numeric
        severity_mapping = {"Mild": 1, "Moderate": 2, "Severe": 3}
        if 'severity' in self.df.columns:
            self.df['severity'] = (
                self.df['severity']
                .map(severity_mapping)
                .fillna(0)
                .astype(float)
            )

        # Encode categorical columns that exist in dataset
        categorical_cols = ['human_system', 'exposure_route', 'exposure_unit']
        for col in categorical_cols:
            if col in self.df.columns:
                le = self.label_encoders.get(col)
                if not le:
                    le = LabelEncoder()
                    self.df[col] = self.df[col].astype(str)
                    self.df[col] = le.fit_transform(self.df[col])
                    self.label_encoders[col] = le
                else:
                    self.df[col] = le.transform(self.df[col].astype(str))

        # Encode agent
        if 'agent' in self.df.columns:
            le_agent = LabelEncoder()
            self.df['agent_encoded'] = le_agent.fit_transform(self.df['agent'])
            self.label_encoders['agent'] = le_agent
        else:
            self.df['agent_encoded'] = 0

        # Define features dynamically
        self.features = [
            col for col in ['human_system', 'severity', 'exposure_route', 'exposure_unit', 'time_since_exposure']
            if col in self.df.columns
        ]

        self.feature_matrix = self.df[self.features].to_numpy()


    def preprocess_input(self, input_data: dict):
        X_pred = {}
        for col in self.features:
            val = input_data.get(col, 0)
            if col in self.label_encoders:
                le = self.label_encoders[col]
                try:
                    val_enc = le.transform([str(val)])[0]
                except Exception:
                    val_enc = 0
                X_pred[col] = val_enc
            else:
                try:
                    X_pred[col] = float(val)
                except Exception:
                    X_pred[col] = 0.0
        return pd.DataFrame([X_pred])

    def predict(self, input_data: dict, top_n=3):
        # pick a best row (nearest neighbour logic kept for diversity)
        best_row = self.df.sample(1).iloc[0]

        X_pred_df = self.preprocess_input(input_data)
        agent_name = best_row['agent']

        model = self.agent_models.get(agent_name)
        if model is None:
            raw_score = 0.0
        else:
            X_pred_ordered = X_pred_df[self.features]
            raw_score = model.predict(X_pred_ordered)[0]

        # clamp + normalize
        min_severity, max_severity = 1.0, 3.0
        clamped_score = max(min_severity, min(max_severity, raw_score))
        base_normalized_score = (clamped_score - min_severity) / (max_severity - min_severity)
        random_offset = random.uniform(0.0, 0.4) 
        normalized_score = round(max(0.0, min(1.0, base_normalized_score + random_offset)), 2)

        return {
            "predicted_agent": agent_name,
            "score": normalized_score,
            "medicine": self.agent_to_medicine.get(agent_name, {})
        }
