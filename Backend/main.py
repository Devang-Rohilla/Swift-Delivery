import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal

model = joblib.load('delivery_time_xgb_pipeline.joblib')

app = FastAPI(title="Delivery Time Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeliveryData(BaseModel):
    # Removed trailing commas
    Restaurant_latitude: float = Field(..., ge=-90.0, le=90.0)
    Restaurant_longitude: float = Field(..., ge=-180.0, le=180.0)
    Delivery_location_latitude: float = Field(..., ge=-90.0, le=90.0)
    Delivery_location_longitude: float = Field(..., ge=-180.0, le=180.0)
    Weatherconditions: Literal['Sunny', 'Stormy', 'Sandstorms', 'Cloudy', 'Fog', 'Windy']
    Road_traffic_density: Literal['High', 'Jam', 'Low', 'Medium']
    Vehicle_condition: Literal[0, 1, 2, 3]
    Type_of_order: Literal['Snack ', 'Drinks ', 'Buffet ', 'Meal ']
    Type_of_vehicle: Literal['motorcycle ', 'scooter ', 'electric_scooter ', 'bicycle ']
    multiple_deliveries: Literal[0, 1, 2, 3]
    Festival: Literal['Yes', 'No']
    City: Literal['Urban', 'Metropolitian', 'Semi-Urban']
    distance_km: float = Field(..., ge=0.0, le=50.0)


class PredictionResponse(BaseModel):
    predicted_delivery_time: float


@app.get("/")
def greet():
    return {"message": "Food delivery time prediction API is live"}


@app.post("/predict", response_model=PredictionResponse)
def predict(data: DeliveryData):
    # Matches the exact column names used in model training:
    # feature_col = skewed_col + numeric_cols + ordinal_col + alpha_col
    input_row = pd.DataFrame([{
        'distance_km': data.distance_km,
        'Restaurant_latitude': data.Restaurant_latitude,
        'Restaurant_longitude': data.Restaurant_longitude,
        'Delivery_location_latitude': data.Delivery_location_latitude,
        'Delivery_location_longitude': data.Delivery_location_longitude,  # Fixed typo
        'Vehicle_condition': data.Vehicle_condition,
        'multiple_deliveries': data.multiple_deliveries,                  # Fixed casing
        'Road_traffic_density': data.Road_traffic_density,
        'Weatherconditions': data.Weatherconditions,
        'Type_of_order': data.Type_of_order,
        'Type_of_vehicle': data.Type_of_vehicle,
        'Festival': data.Festival,
        'City': data.City
    }])

    prediction = model.predict(input_row)[0]
    
    return PredictionResponse(
        predicted_delivery_time=round(float(prediction), 2)
    )