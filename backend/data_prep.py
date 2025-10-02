# data_prep.py
import pandas as pd

df = pd.read_excel("cwa_dataset.xlsx")
med_cols = [c for c in df.columns if c.endswith("_initial")]
df_clean = df.drop(columns=med_cols)

def parse_symptom_str(s):
    if pd.isna(s): return []
    return [x.strip() for x in str(s).split(",") if x.strip()]

df_clean["symptom_list"] = df_clean["symptoms"].apply(parse_symptom_str)
# keep columns we want for training (example)
cols_to_keep = [c for c in df_clean.columns if c not in ("symptoms",)]  # adjust if you want
df_clean = df_clean[cols_to_keep]
df_clean.to_csv("cwa_dataset_clean.csv", index=False)
print("Saved cwa_dataset_clean.csv with", df_clean.shape)
