import pandas as pd

def calculate_ema(series: pd.Series, span: int = 5) -> pd.Series:
    """
    Helper function to calculate the Exponential Moving Average (EMA).
    Useful for smoothing out liquidity demand over time instead of looking at raw burn rates.
    """
    if series.empty:
        return series
    return series.ewm(span=span, adjust=False).mean()

def detect_outliers_iqr(series: pd.Series) -> pd.Series:
    """
    Helper function to detect outliers using the Interquartile Range (IQR) method.
    Could be used as an alternative to Z-Score for non-normal distributions.
    """
    if series.empty:
        return series
    
    Q1 = series.quantile(0.25)
    Q3 = series.quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    return (series < lower_bound) | (series > upper_bound)
