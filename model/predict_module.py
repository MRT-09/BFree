import joblib
import pandas as pd

def predict(model_file, predictor_str):
    model = joblib.load(model_file)
    predictors = pd.DataFrame([predictor_str.split(",")], columns=['accXmean','accXstd','accXmin','accXmax','accYmean','accYstd','accYmin','accYmax','accZmean','accZstd','accZmin','accZmax','gyrXmean','gyrXstd','gyrXmin','gyrXmax','gyrYmean','gyrYstd','gyrYmin','gyrYmax','gyrZmean','gyrZstd','gyrZmin','gyrZmax'])
    return model.predict(predictors.values)
