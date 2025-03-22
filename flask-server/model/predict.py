from sklearn.preprocessing import StandardScaler
import pandas as pd
import joblib
import sys

USAGE_STRING = "Usage: py %s <model_name>" % sys.argv[0]

try:
    MODEL_NAME = sys.argv[1]
except:
    print(USAGE_STRING)
    sys.exit(1)

predictors = pd.DataFrame(columns=['uID','accXmean','accXstd','accXmin','accXmax','accYmean','accYstd','accYmin','accYmax','accZmean','accZstd','accZmin','accZmax','gyrXmean','gyrXstd','gyrXmin','gyrXmax','gyrYmean','gyrYstd','gyrYmin','gyrYmax','gyrZmean','gyrZstd','gyrZmin','gyrZmax'])

try:
    predictors.drop(columns=["uID"], inplace=True)
except:
    pass

scaler = StandardScaler()
predictors = scaler.fit_transform(predictors)

model = joblib.load(MODEL_NAME)

print(model.predict(predictors))
