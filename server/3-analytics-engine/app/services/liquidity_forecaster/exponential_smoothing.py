import pandas as pd

def apply_exponential_smoothing(series: pd.Series, span: int = 5) -> pd.Series:
    """
    Applies Exponential Smoothing to a time series to predict future liquidity demand.
    This helps in smoothing out spiky transaction volumes.
    """
    if series.empty:
        return series
    return series.ewm(span=span, adjust=False).mean()
