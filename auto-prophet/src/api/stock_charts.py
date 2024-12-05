import yfinance as yf
import plotly.graph_objects as go
import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import pandas as pd
from PatternPy.tradingpatterns import tradingpatterns as tp
import warnings

# Suppress warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter(action='ignore', category=pd.errors.SettingWithCopyWarning)


# Stock selection options
stocks = [
    {'label': 'Apple (AAPL)', 'value': 'AAPL'},
    {'label': 'Tesla (TSLA)', 'value': 'TSLA'},
    {'label': 'Amazon (AMZN)', 'value': 'AMZN'},
    {'label': 'Microsoft (MSFT)', 'value': 'MSFT'},
    {'label': 'Alphabet (GOOGL)', 'value': 'GOOGL'},
    {'label': 'Meta Platforms (META)', 'value': 'META'},
    {'label': 'NVIDIA (NVDA)', 'value': 'NVDA'},
    {'label': 'Netflix (NFLX)', 'value': 'NFLX'}
]

# Chart type options
chart_types = [
    {'label': 'Bars', 'value': 'bars'},
    {'label': 'Candles', 'value': 'candlestick'},
    {'label': 'Hollow Candles', 'value': 'hollow_candlestick'},
    {'label': 'HLC Area', 'value': 'hlc_area'},
    {'label': 'High-Low', 'value': 'high_low'},
    {'label': 'Heikin Ashi', 'value': 'heikin_ashi'},
    {'label': 'Renko', 'value': 'renko'},
    {'label': 'Range', 'value': 'range'}
]

def fetch_stocks():
    data = {}
    for stock in stocks:
        data[stock['value']] = yf.download(stock['value'], start='2023-08-12', end='2024-10-12')
    return data

def apply_pattern_recognition(df):
    df = tp.detect_head_shoulder(df)
    df = tp.detect_multiple_tops_bottoms(df)
    df = tp.calculate_support_resistance(df)
    df = tp.detect_triangle_pattern(df)
    df = tp.detect_wedge(df)
    df = tp.detect_channel(df)
    df = tp.detect_double_top_bottom(df)
    df = tp.detect_trendline(df)
    df = tp.find_pivots(df)
    return df

# Initialize Dash app
app = dash.Dash(__name__)
data = fetch_stocks()

app.layout = html.Div([
    html.H1("Interactive Stock Chart"),
    dcc.Dropdown(
        id='stock-selector',
        options=stocks,
        value='AAPL',
        style={'width': '200px', 'margin-bottom': '20px'}
    ),
    dcc.Dropdown(
        id='chart-type-selector',
        options=chart_types,
        value='candlestick',
        style={'width': '200px', 'margin-bottom': '20px'}
    ),
    dcc.Graph(id='chart'),
    dcc.RangeSlider(
        id='date-range-slider',
        min=0,
        max=100,
        step=1,
        value=[0, 100],
        marks={},
        allowCross=False
    )
])

@app.callback(
    [Output('chart', 'figure'),
     Output('date-range-slider', 'max'),
     Output('date-range-slider', 'marks'),
     Output('date-range-slider', 'value')],
    [Input('stock-selector', 'value'),
     Input('chart-type-selector', 'value'),
     Input('date-range-slider', 'value')]
)
def update_chart(selected_stock, selected_chart_type, selected_range):
    df = data[selected_stock]
    slider_max = len(df) - 1
    slider_marks = {i: df.index[i].strftime('%Y-%m-%d') for i in range(0, len(df), max(1, len(df) // 10))}
    start_idx, end_idx = selected_range
    df_filtered = df.iloc[start_idx:end_idx + 1]
    df_filtered = apply_pattern_recognition(df_filtered)

    # Generate chart based on selected chart type
    if selected_chart_type == 'candlestick':
        trace = go.Candlestick(
            x=df_filtered.index, open=df_filtered['Open'],
            high=df_filtered['High'], low=df_filtered['Low'], close=df_filtered['Close'],
            name='candlestick'
        )
    elif selected_chart_type == 'bars':
        trace = go.Ohlc(
            x=df_filtered.index, open=df_filtered['Open'],
            high=df_filtered['High'], low=df_filtered['Low'], close=df_filtered['Close'],
            name='bars'
        )
    elif selected_chart_type == 'hollow_candlestick':
        trace = go.Candlestick(
            x=df_filtered.index, open=df_filtered['Open'],
            high=df_filtered['High'], low=df_filtered['Low'], close=df_filtered['Close'],
            increasing_line_color='black', decreasing_line_color='white',
            name='hollow_candlestick'
        )

    elif selected_chart_type == 'volume_candlestick':
        # Create the candlestick chart for prices
        candlestick = go.Candlestick(
            x=df_filtered.index,
            open=df_filtered['Open'],
            high=df_filtered['High'],
            low=df_filtered['Low'],
            close=df_filtered['Close'],
            name='Candlestick'
        )
        
        # Create a bar chart for volume
        volume_trace = go.Bar(
            x=df_filtered.index,
            y=df_filtered['Volume'],
            name='Volume',
            opacity=0.3,
            marker=dict(color='blue')
        )
        
        # Combine both traces into one figure
        fig = go.Figure(data=[candlestick, volume_trace])
    
    elif selected_chart_type == 'hlc_area':
        trace = go.Scatter(
            x=df_filtered.index, y=df_filtered['Close'],
            fill='tonexty', mode='lines',
            name='hlc_area'
        )
    elif selected_chart_type == 'high_low':
        trace = go.Scatter(
            x=df_filtered.index, y=df_filtered['High'], name='High', mode='lines'
        )
        trace2 = go.Scatter(
            x=df_filtered.index, y=df_filtered['Low'], name='Low', mode='lines'
        )
    elif selected_chart_type == 'heikin_ashi':
        trace = go.Candlestick(
            x=df_filtered.index,
            open=(df_filtered['Open'] + df_filtered['Close']) / 2,
            high=df_filtered[['Open', 'High', 'Close']].max(axis=1),
            low=df_filtered[['Open', 'Low', 'Close']].min(axis=1),
            close=(df_filtered['Open'] + df_filtered['High'] + df_filtered['Low'] + df_filtered['Close']) / 4,
            name='heikin_ashi'
        )
    elif selected_chart_type == 'renko':
        # Renko is complex; placeholder trace, real renko requires preprocessing
        trace = go.Scatter(
            x=df_filtered.index, y=df_filtered['Close'],
            mode='markers', marker=dict(symbol='square'),
            name='renko'
        )
    elif selected_chart_type == 'range':
        trace = go.Scatter(
            x=df_filtered.index, y=df_filtered['Close'],
            mode='lines', line_shape='hv',
            name='range'
        )

    # Add support and resistance
    fig = go.Figure(data=[trace])
    if 'trace2' in locals():
        fig.add_trace(trace2)

    # Add detected patterns to the chart
    patterns = [
        ('head_shoulder_pattern', 'Head and Shoulder', 'triangle-up-open', 'blue', 'Inverse Head and Shoulder', 'triangle-down-open', '#00FFFF'),
        ('multiple_top_bottom_pattern', 'Multiple Top', 'triangle-up', 'purple', 'Multiple Bottom', 'triangle-down', 'orange'),
        ('triangle_pattern', 'Triangle', 'circle', 'green'),
        ('wedge_pattern', 'Wedge', 'x', 'cyan'),
        ('channel_pattern', 'Channel', 'star', 'magenta'),
        ('double_top_bottom_pattern', 'Double Top', 'triangle-up-open', 'red', 'Double Bottom', 'triangle-down-open', 'green')
    ]

    for pattern in patterns:
        pattern_key = pattern[0]
        if pattern_key in df_filtered:
            if len(pattern) > 4:
                top_mask = df_filtered[pattern_key] == pattern[1]
                bottom_mask = df_filtered[pattern_key] == pattern[4]
                fig.add_trace(go.Scatter(
                    x=df_filtered.index[top_mask],
                    y=df_filtered['Close'][top_mask],
                    mode='markers',
                    name=pattern[1],
                    marker=dict(symbol=pattern[2], size=10, color=pattern[3])
                ))
                fig.add_trace(go.Scatter(
                    x=df_filtered.index[bottom_mask],
                    y=df_filtered['Close'][bottom_mask],
                    mode='markers',
                    name=pattern[4],
                    marker=dict(symbol=pattern[5], size=10, color=pattern[6])
                ))
            else:
                mask = df_filtered[pattern_key] == pattern[1]
                fig.add_trace(go.Scatter(
                    x=df_filtered.index[mask],
                    y=df_filtered['Close'][mask],
                    mode='markers',
                    name=pattern[1],
                    marker=dict(symbol=pattern[2], size=10, color=pattern[3])
                ))

    # Add support and resistance if they exist
    if 'support' in df_filtered and 'resistance' in df_filtered:
        fig.add_trace(go.Scatter(
            x=df_filtered.index, 
            y=df_filtered['support'], 
            mode='lines', 
            name='Support', 
            line=dict(color='green', dash='dash'),
            visible='legendonly'  # Make unselected by default
        ))
        fig.add_trace(go.Scatter(
            x=df_filtered.index, 
            y=df_filtered['resistance'], 
            mode='lines', 
            name='Resistance', 
            line=dict(color='red', dash='dash'),
            visible='legendonly'  # Make unselected by default
        ))

    fig.update_layout(
        title=f'{selected_stock} Stock Price - {selected_chart_type.capitalize()}',
        height=500,
        yaxis_title='Price',
        xaxis_rangeslider_visible=False
    )
    slider_value = [start_idx, min(end_idx, slider_max)]

    return fig, slider_max, slider_marks, slider_value

if __name__ == '__main__':
    app.run_server(debug=False, port=8080)