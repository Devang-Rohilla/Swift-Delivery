# Road_traffic_density, NaN
# column_nameconditions NaN
# multiple_deliveries, NaN
# Festival, NaN
# City, NaN
# import pandas as pd
# import numpy as np

# def fix_Weather(df, column_name):
# # Removes the exact string 'conditions ' from all rows in the column
#     df[column_name] = df[column_name].str.replace('conditions ', '', regex=False)

#     # If there are trailing or leading spaces left over, it's a good idea to strip them
#     df[column_name] = df[column_name].str.strip()
#     return df

# # 1 & 5. Function for replacing a string null with the Mode (Most Frequent)
# # This handles both Road_traffic_density and City

# # 1. Updated Mode Function (Now handles string casting safely)
# def fill_with_mode(df, *column_names, null_string='NaN'):
#     for column in column_names:
#         # Added .astype(str) to prevent crashes on mixed/float columns
#         df[column] = df[column].astype(str).str.strip() 
#         df[column] = df[column].replace(null_string, np.nan)
        
#         # Calculate mode and fill
#         mode_val = df[column].mode()[0]
#         df[column].fillna(mode_val, inplace=True)
        
#     return df

# # 2. Specific Function to Convert to Integer
# def convert_deliveries_to_int(df, column_name):
#     # Convert string numbers to numeric (turns hidden junk text into NaN)
#     df[column_name] = pd.to_numeric(df[column_name], errors='coerce')
    
#     # Safely convert to integer, allowing NaNs to exist without crashing
#     df[column_name] = df[column_name].astype('Int64')
    
#     return df
# # 3. Function for replacing a string null with a specific hardcoded value
# # This handles the Festival column
# def fix_festival(df, column_name, null_string='NaN', fill_value='No'):
#     df[column_name] = df[column_name].str.strip()
#     df[column_name] = df[column_name].replace(null_string, fill_value)
#     return df


# def fill_numeric_with_mode(df, *column_names):
#     for column in column_names:
#         # Force the column to numeric first to ensure any hidden text becomes a proper NaN
#         df[column] = pd.to_numeric(df[column], errors='coerce')
        
#         # Calculate the mode. [0] ensures we grab the first value in case of a tie
#         mode_val = df[column].mode()[0]
        
#         # Fill the NaNs with the calculated mode
#         df[column].fillna(mode_val, inplace=True)
        
#     return df
import numpy as np
import pandas as pd


def fix_weather(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Removes the prefix 'conditions ' and trims surrounding whitespace."""
    df = df.copy(deep=False)
    if column_name in df.columns:
        df[column_name] = (df[column_name].astype(str).str.replace(r"^conditions\s*", "", regex=True).str.strip().replace(["nan", "NaN"], np.nan))
    return df


def fill_with_mode(df: pd.DataFrame, *column_names: str, null_strings=("NaN", "nan", "")) -> pd.DataFrame:
    """Safely normalizes whitespace, maps string nulls to np.nan, and imputes the mode."""
    df = df.copy(deep=False)
    for col in column_names:
        if col not in df.columns:
            continue
# Clean string representation without corrupting true NaNs
        s = df[col].astype("string").str.strip()
        s = s.replace(list(null_strings), np.nan)
        modes = s.mode(dropna=True)
        if not modes.empty:
            s = s.fillna(modes.iloc[0])
        df[col] = s
    return df


def convert_deliveries_to_int(df: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Coerces column to numeric, then casts to nullable integer 'Int64'."""
    df = df.copy(deep=False)
    if column_name in df.columns:
        numeric_series = pd.to_numeric(df[column_name], errors="coerce")
        df[column_name] = numeric_series.astype("Int64")
    return df

def fix_festival(df: pd.DataFrame,column_name: str,null_strings=("NaN", "nan", ""),fill_value: str = "No",) -> pd.DataFrame:
    """Strips whitespace and fills null/missing values with a designated default (default 'No')."""
    df = df.copy(deep=False)
    if column_name in df.columns:
        s = df[column_name].astype("string").str.strip()
        s = s.replace(list(null_strings), np.nan).fillna(fill_value)
        df[column_name] = s
    return df


def fill_numeric_with_mode(df: pd.DataFrame, *column_names: str, as_int: bool = True) -> pd.DataFrame:
    """Coerces columns to numeric, computes mode, and fills NaNs without inplace warnings."""
    df = df.copy(deep=False)
    for col in column_names:
        if col not in df.columns:
            continue
        s = pd.to_numeric(df[col], errors="coerce")
        modes = s.mode(dropna=True)
        if not modes.empty:
            s = s.fillna(modes.iloc[0])
        if as_int:
            s = s.astype("Int64")
        df[col] = s
    return df
def clean_and_impute_time(df: pd.DataFrame,column_name: str,round_median: bool = True,) -> pd.DataFrame:
    df = df.copy(deep=False)

    # 1. Extract digits and convert safely to float first (to allow median calculation)
    extracted = df[column_name].astype(str).str.extract(r"(\d+)", expand=False)
    numeric_series = pd.to_numeric(extracted, errors="coerce")

    # 2. Calculate the median of non-null values
    median_val = numeric_series.median()

    # Round median to nearest whole number if it produces a fraction (e.g. 24.5 -> 25)
    if round_median:
        median_val = round(median_val)

    # 3. Fill missing values with the median and cast directly to standard integer
    df[column_name] = numeric_series.fillna(median_val).astype(int)

    return df

from typing import Sequence
def clean_zero_coordinates_float(df: pd.DataFrame,coord_cols: Sequence[str] = ("Restaurant_latitude","Restaurant_longitude","Delivery_location_latitude","Delivery_location_longitude")
        ,city_col: str = "City",zero_threshold: float = 1.0,) -> pd.DataFrame:
    df = df.copy(deep=False)
    for col in coord_cols:
        if col not in df.columns:
            continue
        # 1. Flip negative signs in float column
        s = df[col].abs()
        # 2. Convert zeros or values near 0.0 to NaN
        s = s.mask(s < zero_threshold, np.nan)
        # 3. Impute using median per City
        if city_col in df.columns:
            city_median = df.groupby(city_col)[col].transform("median")
            s = s.fillna(city_median)
        # 4. Fallback for any remaining NaNs
        s = s.fillna(s.median())
        df[col] = s
    return df