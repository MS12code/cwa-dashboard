# augment_data.py (fixed)

import pandas as pd
import numpy as np
import random
from ast import literal_eval

df = pd.read_csv("cwa_dataset_clean.csv")
TARGET_PER_AGENT = 300   # adjust as needed

def parse_symptoms(s):
    if pd.isna(s): return []
    return [x.strip() for x in str(s).split(",") if x.strip()]

# build symptom pools per agent
symptom_pools = {}
for ag in df['agent'].unique():
    pool = set()
    for s in df[df['agent']==ag]['symptom_list']:
        if isinstance(s, str):
            try:
                items = literal_eval(s)
            except:
                items = []
        else:
            items = s if isinstance(s, list) else []
        for it in items:
            pool.add(it.strip())
    symptom_pools[ag] = list(pool)

numeric_cols = ["exposure_estimate","time_since_exposure_min","age","weight_kg",
                "heart_rate","respiratory","systolic_bp","oxygen","gcs"]
cat_cols = ["gender","comorbidity","exposure_route","severity","human_system"]

aug_rows = []
for agent in df['agent'].unique():
    sub = df[df['agent']==agent]

    # compute numeric stats with safe fallback
    stats = {}
    for c in numeric_cols:
        vals = pd.to_numeric(sub[c], errors='coerce').dropna()
        if len(vals) > 0:
            mu, sig = vals.mean(), vals.std()
            if np.isnan(mu) or np.isnan(sig) or sig == 0:
                mu, sig = float(vals.mean()), max(float(vals.std()), 1.0)
        else:
            # safe defaults
            mu, sig = 50.0, 10.0
        stats[c] = (mu, sig)

    for i in range(TARGET_PER_AGENT):
        row = {"agent": agent}
        # sample numerics safely
        for c,(mu,sig) in stats.items():
            samp = np.random.normal(mu, sig)
            if np.isnan(samp):   # fallback if still nan
                samp = mu
            if c in ("age","heart_rate","respiratory","systolic_bp","gcs"):
                samp = max(0, int(round(samp)))
            else:
                samp = float(round(samp,3))
            row[c] = samp

        # sample categoricals
        for c in cat_cols:
            vals = sub[c].dropna().values
            if len(vals) > 0:
                row[c] = random.choice(vals)
            else:
                row[c] = None

        # sample symptoms
        pool = symptom_pools.get(agent, [])
        if pool:
            k = min(len(pool), random.randint(1, min(6, len(pool))))
            row["symptom_list"] = random.sample(pool, k)
        else:
            row["symptom_list"] = []

        aug_rows.append(row)

aug_df = pd.DataFrame(aug_rows)

# combine with original
orig = df.copy()
if not isinstance(orig["symptom_list"].iloc[0], list):
    orig["symptom_list"] = orig["symptom_list"].apply(parse_symptoms)

combined = pd.concat([orig, aug_df], ignore_index=True)
combined.to_csv("cwa_dataset_augmented.csv", index=False)
print("Saved augmented dataset with", combined.shape)
