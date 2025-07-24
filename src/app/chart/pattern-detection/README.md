# Enhanced Pattern Detection System

## Overview

This is an advanced stock chart pattern detection system that analyzes real-time market data to identify various technical analysis patterns including Double Bottom, Double Top, Head & Shoulders, and Triangle patterns.

## How It Works

### 1. **Data Acquisition**
- Fetches real-time OHLCV (Open, High, Low, Close, Volume) data from Motilal Oswal Research API
- Supports multiple timeframes: 1min, 5min, 15min, 30min, 1hr, 1day
- Automatically adjusts data range based on selected timeframe

### 2. **Swing Point Detection**
- Identifies significant price highs and lows using configurable depth parameters
- Uses sliding window analysis to detect local maxima and minima
- Depth varies by detection sensitivity (Strict: 3, Moderate: 2, Loose: 1)

### 3. **Pattern Recognition Algorithms**

#### Double Bottom Pattern
```
Price
  ^
  |     A     C (Neckline)     E (Breakout)
  |    / \   / \               /
  |   /   \ /   \             /
  |  /     B     \           /
  | /             D (Second Bottom)
  +-----------------------------------> Time
```

**Detection Logic:**
- Finds two swing lows with similar price levels (within tolerance)
- Identifies swing high (neckline) between the bottoms
- Confirms pattern with breakout above neckline
- Configurable price tolerance (2%-8% depending on sensitivity)

#### Double Top Pattern
```
Price
  ^
  |  A (First Top)   C (Second Top)
  | / \             / \
  |/   \           /   \
  |     \         /     \
  |      B (Neckline)    D (Breakdown)
  +-----------------------------------> Time
```

**Detection Logic:**
- Finds two swing highs with similar price levels
- Identifies swing low (neckline) between the tops
- Confirms pattern with breakdown below neckline

#### Head & Shoulders Pattern
```
Price
  ^
  |           B (Head)
  |          / \
  |    A    /   \    C
  |   / \  /     \  / \
  |  /   \/       \/   \
  | /     D       E     F (Breakdown)
  +-----------------------------------> Time
```

**Detection Logic:**
- Identifies three consecutive swing highs
- Head must be higher than both shoulders
- Shoulders should have similar heights (within tolerance)
- Confirms with breakdown below neckline

#### Triangle Pattern (Ascending)
```
Price
  ^
  |    •     •     • (Resistance)
  |   / \   / \   /
  |  /   \ /   \ /
  | /     •     •  
  |/       \   /
  •---------•-• (Support Trend)
  +-----------------------------------> Time
```

**Detection Logic:**
- Identifies series of higher lows (ascending support)
- Identifies relatively flat highs (horizontal resistance)
- Confirms with breakout above resistance level

### 4. **Configurable Parameters**

#### Detection Sensitivity
- **Strict**: High confidence patterns only (2% tolerance, 10+ candle separation)
- **Moderate**: Balanced detection (5% tolerance, 5+ candle separation)
- **Loose**: More patterns detected (8% tolerance, 3+ candle separation)

#### Timeframe Options
- **1 Minute**: Intraday scalping patterns
- **5-30 Minutes**: Short-term swing patterns  
- **1 Hour**: Medium-term patterns
- **1 Day**: Long-term investment patterns

### 5. **Pattern Validation**

Each detected pattern includes:
- **Entry Points**: Key price levels for pattern formation
- **Confirmation**: Breakout/breakdown validation
- **Timestamps**: Exact timing of pattern events
- **Price Levels**: Precise entry/exit points

### 6. **User Interface Features**

- **Real-time Search**: API-powered stock symbol lookup
- **Interactive Controls**: Pattern type, timeframe, and sensitivity selection
- **Visual Results**: Tabular display of pattern stages with timestamps and prices
- **TradingView Integration**: Live chart visualization
- **Responsive Design**: Full-width layout with mobile compatibility

### 7. **Technical Implementation**

#### Pattern Detection Flow:
1. User selects stock symbol and parameters
2. System fetches OHLCV data based on timeframe
3. Swing point detection algorithm runs
4. Pattern-specific detection algorithm executes
5. Results validated and filtered
6. UI displays detected patterns with details

#### Error Handling:
- API timeout and retry mechanisms
- Invalid data validation
- User-friendly error messages
- Graceful degradation for missing data

#### Performance Optimizations:
- Efficient swing point algorithms
- Configurable tolerance levels
- Minimal API calls with caching
- Progressive pattern detection

## Usage Examples

### Basic Usage:
1. Search and select a stock (e.g., "RELIANCE", "HINDZINC")
2. Choose pattern type (Double Bottom recommended for beginners)
3. Select timeframe (5 minutes for day trading, 1 day for swing trading)
4. Set sensitivity (Moderate for balanced results)
5. Click "Detect Pattern" to analyze

### Advanced Configuration:
- **Day Trading**: 1-5 minute timeframe, Loose sensitivity
- **Swing Trading**: 30 minute to 1 hour timeframe, Moderate sensitivity  
- **Position Trading**: 1 day timeframe, Strict sensitivity

## Pattern Reliability

### High Reliability Patterns:
- Double Bottom with volume confirmation
- Head & Shoulders with clear neckline break
- Triangle breakouts with strong momentum

### Factors Affecting Accuracy:
- Market volatility
- Volume confirmation
- Time of day (avoid low-volume periods)
- Overall market trend alignment

## Integration Points

- **Motilal Oswal API**: Real-time market data
- **TradingView Widget**: Interactive chart display
- **Next.js Framework**: Server-side rendering and optimization
- **TypeScript**: Type-safe pattern detection algorithms

## Future Enhancements

1. **Additional Patterns**: Cup & Handle, Flag, Pennant
2. **Volume Analysis**: Volume-based pattern validation
3. **AI Integration**: Machine learning pattern scoring
4. **Alert System**: Real-time pattern notifications
5. **Backtesting**: Historical pattern performance analysis

## API Dependencies

- Motilal Oswal Research API for equity search and chart data
- TradingView Charting Library for visualization
- Real-time data updates every minute during market hours
