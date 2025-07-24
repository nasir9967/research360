"use client";

import { useState } from 'react';
import TradingViewChart from './TradingViewChart';

const shares = [
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc ' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd' },
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
];

type Share = {
  symbol: string;
  name: string;
};

export default function Home() {
  const [showList, setShowList] = useState(false);
  const [selectedShare, setSelectedShare] = useState<Share | null>(null);
  const [search, setSearch] = useState('');
  const [apiShares, setApiShares] = useState<Share[]>([]);
  const [doubleBottoms, setDoubleBottoms] = useState<{ time: string; price: number; label: string }[] | null>(null);
  const [loadingDoubleBottom, setLoadingDoubleBottom] = useState(false);
  const [patternType, setPatternType] = useState<'double-bottom' | 'double-top' | 'head-shoulders' | 'triangle'>('double-bottom');
  const [timeframe, setTimeframe] = useState<'1' | '5' | '15' | '30' | '60' | '1D'>('1');
  const [patternStrength, setPatternStrength] = useState<'strict' | 'moderate' | 'loose'>('moderate');

  async function fetchEquitySearch(keyword: string) {
    if (!keyword || keyword.length < 3) {
      setApiShares([]);
      return;
    }
    try {
      const response = await fetch('https://research360api.motilaloswal.com/api/getdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_name: 'EQUITY_SEARCH_MASTER',
          parameters: { keyword },
        }),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      // Assume data.data is an array of results with symbol and name
      if (data && Array.isArray(data.data)) {
        setApiShares(
          data.data.map((item: { SYMBOL?: string; symbol?: string; LNAME?: string; SCRIP_NAME?: string; name?: string }) => ({
            symbol: item.SYMBOL || item.symbol || '',
            name: item.LNAME || item.SCRIP_NAME || item.name || '',
          }))
        );
      } else {
        setApiShares([]);
      }
    } catch (err) {
      setApiShares([]);
      console.error('API call failed:', err);
    }
  }

  // Enhanced pattern detection with configurable strength
  function getPatternTolerances(strength: 'strict' | 'moderate' | 'loose') {
    const tolerances = {
      strict: { priceTolerance: 0.02, minSeparation: 10, necklineOffset: 0.001 },
      moderate: { priceTolerance: 0.05, minSeparation: 5, necklineOffset: 0.003 },
      loose: { priceTolerance: 0.08, minSeparation: 3, necklineOffset: 0.005 }
    };
    return tolerances[strength];
  }

  // Head and Shoulders pattern detection
  function detectHeadShouldersPattern(ohlcv: { t: number[]; o: number[]; h: number[]; l: number[]; c: number[]; v?: number[] }) {
    const { t, h, l, c } = ohlcv;
    if (!t || !h || t.length < 30) return [];
    
    const tolerances = getPatternTolerances(patternStrength);
    const swingHighs: number[] = [];
    const depth = 3;
    
    for (let i = depth; i < h.length - depth; i++) {
      let isHigh = true;
      for (let d = 1; d <= depth; d++) {
        if (h[i] < h[i - d] || h[i] < h[i + d]) isHigh = false;
      }
      if (isHigh) swingHighs.push(i);
    }
    
    const results: { time: string; price: number; label: string }[] = [];
    
    // Look for Head and Shoulders: Left Shoulder, Head, Right Shoulder
    for (let i = 0; i < swingHighs.length - 2; i++) {
      const leftShoulder = swingHighs[i];
      const head = swingHighs[i + 1];
      const rightShoulder = swingHighs[i + 2];
      
      const leftPrice = h[leftShoulder];
      const headPrice = h[head];
      const rightPrice = h[rightShoulder];
      
      // Head should be higher than both shoulders
      if (headPrice <= leftPrice || headPrice <= rightPrice) continue;
      
      // Shoulders should be approximately equal
      const shoulderDiff = Math.abs(leftPrice - rightPrice) / ((leftPrice + rightPrice) / 2);
      if (shoulderDiff > tolerances.priceTolerance) continue;
      
      // Find neckline (lowest point between shoulders)
      let necklineIdx = leftShoulder;
      let necklinePrice = l[leftShoulder];
      for (let j = leftShoulder; j <= rightShoulder; j++) {
        if (l[j] < necklinePrice) {
          necklinePrice = l[j];
          necklineIdx = j;
        }
      }
      
      // Check for breakdown below neckline
      let breakdownIdx = -1;
      for (let k = rightShoulder + 1; k < h.length; k++) {
        if (c[k] < necklinePrice) {
          breakdownIdx = k;
          break;
        }
      }
      
      if (breakdownIdx !== -1) {
        console.log('Head and Shoulders Pattern:', {
          leftShoulder: { idx: leftShoulder, price: leftPrice },
          head: { idx: head, price: headPrice },
          rightShoulder: { idx: rightShoulder, price: rightPrice },
          neckline: { idx: necklineIdx, price: necklinePrice },
          breakdown: { idx: breakdownIdx, price: c[breakdownIdx] }
        });
        
        results.push(
          { time: new Date(t[leftShoulder] * 1000).toLocaleString(), price: leftPrice, label: 'Left Shoulder' },
          { time: new Date(t[head] * 1000).toLocaleString(), price: headPrice, label: 'Head' },
          { time: new Date(t[rightShoulder] * 1000).toLocaleString(), price: rightPrice, label: 'Right Shoulder' },
          { time: new Date(t[necklineIdx] * 1000).toLocaleString(), price: necklinePrice, label: 'Neckline' },
          { time: new Date(t[breakdownIdx] * 1000).toLocaleString(), price: c[breakdownIdx], label: 'Breakdown' }
        );
        break;
      }
    }
    
    return results;
  }

  // Triangle pattern detection (ascending/descending)
  function detectTrianglePattern(ohlcv: { t: number[]; o: number[]; h: number[]; l: number[]; c: number[]; v?: number[] }) {
    const { t, h, l, c } = ohlcv;
    if (!t || !h || t.length < 20) return [];
    
    const tolerances = getPatternTolerances(patternStrength);
    const swingHighs: number[] = [];
    const swingLows: number[] = [];
    const depth = 2;
    
    for (let i = depth; i < h.length - depth; i++) {
      let isHigh = true, isLow = true;
      for (let d = 1; d <= depth; d++) {
        if (h[i] < h[i - d] || h[i] < h[i + d]) isHigh = false;
        if (l[i] > l[i - d] || l[i] > l[i + d]) isLow = false;
      }
      if (isHigh) swingHighs.push(i);
      if (isLow) swingLows.push(i);
    }
    
    const results: { time: string; price: number; label: string }[] = [];
    
    // Check for ascending triangle (higher lows, resistance level)
    if (swingLows.length >= 2 && swingHighs.length >= 2) {
      const recentLows = swingLows.slice(-3);
      const recentHighs = swingHighs.slice(-3);
      
      // Check if lows are ascending
      let isAscending = true;
      for (let i = 1; i < recentLows.length; i++) {
        if (l[recentLows[i]] <= l[recentLows[i-1]]) {
          isAscending = false;
          break;
        }
      }
      
      // Check if highs are relatively flat (resistance)
      let isFlat = true;
      if (recentHighs.length >= 2) {
        const firstHigh = h[recentHighs[0]];
        const lastHigh = h[recentHighs[recentHighs.length - 1]];
        const flatDiff = Math.abs(firstHigh - lastHigh) / ((firstHigh + lastHigh) / 2);
        if (flatDiff > tolerances.priceTolerance) isFlat = false;
      }
      
      if (isAscending && isFlat && recentHighs.length > 0) {
        const resistanceLevel = h[recentHighs[recentHighs.length - 1]];
        
        // Look for breakout above resistance
        let breakoutIdx = -1;
        for (let k = Math.max(...recentHighs) + 1; k < h.length; k++) {
          if (c[k] > resistanceLevel * (1 + tolerances.necklineOffset)) {
            breakoutIdx = k;
            break;
          }
        }
        
        if (breakoutIdx !== -1) {
          console.log('Ascending Triangle Pattern:', {
            lows: recentLows.map(idx => ({ idx, price: l[idx] })),
            resistance: resistanceLevel,
            breakout: { idx: breakoutIdx, price: c[breakoutIdx] }
          });
          
          results.push(
            ...recentLows.map(idx => ({ 
              time: new Date(t[idx] * 1000).toLocaleString(), 
              price: l[idx], 
              label: 'Support Low' 
            })),
            ...recentHighs.map(idx => ({ 
              time: new Date(t[idx] * 1000).toLocaleString(), 
              price: h[idx], 
              label: 'Resistance High' 
            })),
            { time: new Date(t[breakoutIdx] * 1000).toLocaleString(), price: c[breakoutIdx], label: 'Breakout' }
          );
        }
      }
    }
    
    return results;
  }

  // Improved double bottom detection logic: more tolerant, finds all patterns, and works for intraday data
  function detectDoubleBottomUniversal(ohlcv: { t: number[]; o: number[]; h: number[]; l: number[]; c: number[]; v?: number[] }) {
    const { t, l, h, c } = ohlcv;
    if (!t || !l || t.length < 20) return [];
    
    const tolerances = getPatternTolerances(patternStrength);
    const swingLows: number[] = [];
    const swingHighs: number[] = [];
    const depth = patternStrength === 'strict' ? 3 : patternStrength === 'moderate' ? 2 : 1;
    
    for (let i = depth; i < l.length - depth; i++) {
      let isLow = true, isHigh = true;
      for (let d = 1; d <= depth; d++) {
        if (l[i] > l[i - d] || l[i] > l[i + d]) isLow = false;
        if (h[i] < h[i - d] || h[i] < h[i + d]) isHigh = false;
      }
      if (isLow) swingLows.push(i);
      if (isHigh) swingHighs.push(i);
    }
    console.log('Swing Lows:', swingLows.map(idx => ({ idx, price: l[idx], time: new Date(t[idx]*1000).toLocaleTimeString() })));
    console.log('Swing Highs:', swingHighs.map(idx => ({ idx, price: h[idx], time: new Date(t[idx]*1000).toLocaleTimeString() })));
    const results: { time: string; price: number; label: string }[] = [];
    for (let i = 0; i < swingLows.length - 1; i++) {
      for (let j = i + 1; j < swingLows.length; j++) {
        const idx1 = swingLows[i];
        const idx2 = swingLows[j];
        if (idx2 - idx1 < tolerances.minSeparation) continue; // configurable separation
        const price1 = l[idx1];
        const price2 = l[idx2];
        const priceDiff = Math.abs(price1 - price2) / ((price1 + price2) / 2);
        if (priceDiff > tolerances.priceTolerance) continue; // configurable tolerance
        // Find swing high (neckline) between the two bottoms, use high price for neckline
        const peaksBetween = swingHighs.filter(idx => idx > idx1 && idx < idx2);
        if (peaksBetween.length === 0) continue;
        let maxIdx = peaksBetween[0];
        for (const idx of peaksBetween) {
          if (h[idx] > h[maxIdx]) maxIdx = idx;
        }
        const neckline = h[maxIdx];
        if (neckline < Math.max(price1, price2) * (1 + tolerances.necklineOffset)) continue; // configurable neckline offset
        // Confirm breakout: price closes above neckline after second bottom
        let breakoutIdx = -1;
        for (let m = idx2 + 1; m < l.length; m++) {
          if (c[m] > neckline) {
            breakoutIdx = m;
            break;
          }
        }
        if (breakoutIdx !== -1) {
          console.log('Double Bottom Candidate:', {
            firstBottom: { idx: idx1, price: price1, time: new Date(t[idx1]*1000).toLocaleTimeString() },
            neckline: { idx: maxIdx, price: neckline, time: new Date(t[maxIdx]*1000).toLocaleTimeString() },
            secondBottom: { idx: idx2, price: price2, time: new Date(t[idx2]*1000).toLocaleTimeString() },
            breakout: { idx: breakoutIdx, price: c[breakoutIdx], time: new Date(t[breakoutIdx]*1000).toLocaleTimeString() }
          });
          results.push(
            { time: new Date(t[idx1] * 1000).toLocaleString(), price: price1, label: 'First Bottom' },
            { time: new Date(t[maxIdx] * 1000).toLocaleString(), price: neckline, label: 'Neckline' },
            { time: new Date(t[idx2] * 1000).toLocaleString(), price: price2, label: 'Second Bottom' },
            { time: new Date(t[breakoutIdx] * 1000).toLocaleString(), price: c[breakoutIdx], label: 'Breakout' }
          );
          // Do not skip ahead, allow overlapping patterns for now
          break;
        }
      }
    }
    return results;
  }

  // --- Double Top Detection Logic ---
  function detectDoubleTopUniversal(ohlcv: { t: number[]; o: number[]; h: number[]; l: number[]; c: number[]; v?: number[] }) {
    const { t, h, l, c } = ohlcv;
    if (!t || !h || t.length < 20) return [];
    
    const tolerances = getPatternTolerances(patternStrength);
    const swingHighs: number[] = [];
    const swingLows: number[] = [];
    const depth = patternStrength === 'strict' ? 3 : patternStrength === 'moderate' ? 2 : 1;
    for (let i = depth; i < h.length - depth; i++) {
      let isHigh = true, isLow = true;
      for (let d = 1; d <= depth; d++) {
        if (h[i] < h[i - d] || h[i] < h[i + d]) isHigh = false;
        if (l[i] > l[i - d] || l[i] > l[i + d]) isLow = false;
      }
      if (isHigh) swingHighs.push(i);
      if (isLow) swingLows.push(i);
    }
    console.log('Swing Highs:', swingHighs.map(idx => ({ idx, price: h[idx], time: new Date(t[idx]*1000).toLocaleTimeString() })));
    console.log('Swing Lows:', swingLows.map(idx => ({ idx, price: l[idx], time: new Date(t[idx]*1000).toLocaleTimeString() })));
    const results: { time: string; price: number; label: string }[] = [];
    for (let i = 0; i < swingHighs.length - 1; i++) {
      for (let j = i + 1; j < swingHighs.length; j++) {
        const idx1 = swingHighs[i];
        const idx2 = swingHighs[j];
        if (idx2 - idx1 < tolerances.minSeparation) continue;
        const price1 = h[idx1];
        const price2 = h[idx2];
        const priceDiff = Math.abs(price1 - price2) / ((price1 + price2) / 2);
        if (priceDiff > tolerances.priceTolerance) continue;
        // Find swing low (neckline) between the two tops, use low price for neckline
        const troughsBetween = swingLows.filter(idx => idx > idx1 && idx < idx2);
        if (troughsBetween.length === 0) continue;
        let minIdx = troughsBetween[0];
        for (const idx of troughsBetween) {
          if (l[idx] < l[minIdx]) minIdx = idx;
        }
        const neckline = l[minIdx];
        if (neckline > Math.min(price1, price2) * (1 - tolerances.necklineOffset)) continue; // configurable neckline offset
        // Confirm breakdown: price closes below neckline after second top
        let breakdownIdx = -1;
        for (let m = idx2 + 1; m < h.length; m++) {
          if (c[m] < neckline) {
            breakdownIdx = m;
            break;
          }
        }
        if (breakdownIdx !== -1) {
          console.log('Double Top Candidate:', {
            firstTop: { idx: idx1, price: price1, time: new Date(t[idx1]*1000).toLocaleTimeString() },
            neckline: { idx: minIdx, price: neckline, time: new Date(t[minIdx]*1000).toLocaleTimeString() },
            secondTop: { idx: idx2, price: price2, time: new Date(t[idx2]*1000).toLocaleTimeString() },
            breakdown: { idx: breakdownIdx, price: c[breakdownIdx], time: new Date(t[breakdownIdx]*1000).toLocaleTimeString() }
          });
          results.push(
            { time: new Date(t[idx1] * 1000).toLocaleString(), price: price1, label: 'First Top' },
            { time: new Date(t[minIdx] * 1000).toLocaleString(), price: neckline, label: 'Neckline' },
            { time: new Date(t[idx2] * 1000).toLocaleString(), price: price2, label: 'Second Top' },
            { time: new Date(t[breakdownIdx] * 1000).toLocaleString(), price: c[breakdownIdx], label: 'Breakdown' }
          );
          // Do not skip ahead, allow overlapping patterns for now
          break;
        }
      }
    }
    return results;
  }

  // Universal pattern detection function
  async function detectPattern() {
    if (!selectedShare) return;
    setLoadingDoubleBottom(true);
    setDoubleBottoms(null);
    
    try {
      const now = new Date();
      let from: number, to: number;
      
      // Calculate time range based on timeframe
      if (timeframe === '1D') {
        from = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60); // 1 year
        to = Math.floor(Date.now() / 1000);
      } else {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        from = Math.floor(startOfDay.getTime() / 1000);
        to = Math.floor(now.getTime() / 1000);
      }
      
      const response = await fetch('https://research360api.motilaloswal.com/api/getcharts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_name: 'EQUITY_CHART',
          parameters: {
            symbol: selectedShare.symbol,
            exchange: 'NSE',
            resolution: timeframe,
            from,
            to,
          },
        }),
      });
      
      if (!response.ok) throw new Error('Chart API error');
      const data = await response.json();
      if (!data || !data.t || !data.c) throw new Error('No chart data');
      
      let detected: { time: string; price: number; label: string }[] = [];
      
      switch (patternType) {
        case 'double-bottom':
          detected = detectDoubleBottomUniversal(data);
          break;
        case 'double-top':
          detected = detectDoubleTopUniversal(data);
          break;
        case 'head-shoulders':
          detected = detectHeadShouldersPattern(data);
          break;
        case 'triangle':
          detected = detectTrianglePattern(data);
          break;
        default:
          detected = detectDoubleBottomUniversal(data);
      }
      
      setDoubleBottoms(detected);
    } catch (err) {
      setDoubleBottoms([]);
      console.error('Pattern detection failed:', err);
    } finally {
      setLoadingDoubleBottom(false);
    }
  }

  const filteredShares = search && apiShares.length > 0 ? apiShares : shares.filter(
    (share) =>
      share.name.toLowerCase().includes(search.toLowerCase()) ||
      share.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ backgroundColor: 'cyan', color: 'black' }}>Chart Detection</h1>

      {/* Search Bar */}
      <div style={{ margin: '24px 0', position: 'relative', width: '100%', maxWidth: 500 }}>
        <input
          type="text"
          placeholder="Search share..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchEquitySearch(e.target.value);
          }}
          onClick={() => setShowList(true)}
          style={{ width: '100%', padding: '8px', borderRadius: 4, border: '1px solid #ccc', color: '#111', fontWeight: 'bold' }}
        />
        {showList && (
          <div
            style={{
              position: 'absolute',
              top: 38,
              left: 0,
              width: '100%',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: 4,
              zIndex: 10,
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            {filteredShares.length === 0 && (
              <div style={{ padding: 8, color: '#888' }}>No shares found</div>
            )}
            {filteredShares.map((share, idx) => (
              <div
                key={share.symbol + '-' + idx}
                style={{
                  padding: 8,
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  background: selectedShare?.symbol === share.symbol ? '#f0f8ff' : '#fff',
                  color: '#111',
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  setSelectedShare(share);
                  setShowList(false);
                }}
              >
                {share.name} ({share.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Rectangle Window */}
      {selectedShare && (
        <>
          {/* Controls Panel */}
          <div style={{ width: '100%', maxWidth: 800, margin: '16px 0', padding: '16px', background: '#f8f9fa', borderRadius: 8, border: '1px solid #dee2e6' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>Pattern Detection Controls</h3>
            
            {/* Pattern Type Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Pattern Type:</label>
              <select 
                value={patternType} 
                onChange={(e) => setPatternType(e.target.value as 'double-bottom' | 'double-top' | 'head-shoulders' | 'triangle')}
                style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', color: '#333', minWidth: 200 }}
              >
                <option value="double-bottom">Double Bottom</option>
                <option value="double-top">Double Top</option>
                <option value="head-shoulders">Head & Shoulders</option>
                <option value="triangle">Triangle (Ascending)</option>
              </select>
            </div>
            
            {/* Timeframe Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Timeframe:</label>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value as '1' | '5' | '15' | '30' | '60' | '1D')}
                style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', color: '#333', minWidth: 200 }}
              >
                <option value="1">1 Minute</option>
                <option value="5">5 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="1D">1 Day</option>
              </select>
            </div>
            
            {/* Pattern Strength */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Detection Sensitivity:</label>
              <select 
                value={patternStrength} 
                onChange={(e) => setPatternStrength(e.target.value as 'strict' | 'moderate' | 'loose')}
                style={{ padding: '8px 12px', borderRadius: 4, border: '1px solid #ccc', background: '#fff', color: '#333', minWidth: 200 }}
              >
                <option value="strict">Strict (High Confidence)</option>
                <option value="moderate">Moderate (Balanced)</option>
                <option value="loose">Loose (More Patterns)</option>
              </select>
            </div>
            
            {/* Detect Button */}
            <button
              onClick={detectPattern}
              disabled={loadingDoubleBottom}
              style={{ 
                padding: '12px 24px', 
                borderRadius: 6, 
                background: loadingDoubleBottom ? '#ccc' : '#0070f3', 
                color: '#fff', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: loadingDoubleBottom ? 'not-allowed' : 'pointer', 
                fontSize: 16 
              }}
            >
              {loadingDoubleBottom ? 'Detecting...' : `Detect ${patternType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Pattern`}
            </button>
          </div>

          <div
            style={{
              width: '100%',
              minHeight: 350,
              border: '2px solid #333',
              borderRadius: 12,
              margin: '24px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafbfc',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h2>
              {selectedShare.name} ({selectedShare.symbol}) Chart
            </h2>
            {/* TradingView Chart */}
            <TradingViewChart symbol={selectedShare.symbol} exchange={selectedShare.symbol === 'RELIANCE' ? 'NSE' : 'NSE'} />
          </div>
          
          {/* Pattern Detection Results */}
          {doubleBottoms && (
            doubleBottoms.length > 0 ? (
              <div style={{ width: '100%', maxWidth: 800 }}>
                <h3 style={{ margin: '16px 0 8px 0', color: '#333' }}>
                  {patternType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Pattern Detected for {selectedShare.symbol}
                </h3>
                <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: 14 }}>
                  Timeframe: {timeframe === '1D' ? '1 Day' : `${timeframe} Minute${timeframe !== '1' ? 's' : ''}`} | 
                  Sensitivity: {patternStrength.charAt(0).toUpperCase() + patternStrength.slice(1)}
                </p>
                <table style={{ width: '100%', maxWidth: 800, margin: '16px 0', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <thead>
                    <tr style={{ background: '#f0f8ff' }}>
                      <th style={{ padding: 8, border: '1px solid #ccc', textAlign: 'left' }}>Pattern Stage</th>
                      <th style={{ padding: 8, border: '1px solid #ccc', textAlign: 'left' }}>Date & Time</th>
                      <th style={{ padding: 8, border: '1px solid #ccc', textAlign: 'left' }}>Price Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doubleBottoms.map((item, idx) => (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                        <td style={{ padding: 8, border: '1px solid #ccc', fontWeight: 'bold' }}>{item.label}</td>
                        <td style={{ padding: 8, border: '1px solid #ccc' }}>{item.time}</td>
                        <td style={{ padding: 8, border: '1px solid #ccc', fontFamily: 'monospace' }}>₹{item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ margin: '16px 0', color: '#c00', fontWeight: 'bold', textAlign: 'center' }}>
                No {patternType.replace('-', ' ')} pattern found for {selectedShare.symbol} in the selected timeframe.
                <br />
                <span style={{ fontSize: 14, color: '#666' }}>Try adjusting the sensitivity or timeframe settings.</span>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
