// AdvancedChartPage: Displays candlestick chart using LightweightCharts
// Teaching comments included for clarity

'use client';
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

// Example input data (replace with API response in production)
const chartData = {
  o: [3455, 3487.2, 3430, 3408, 3418.3, 3405, 3410, 3380, 3299.9],
  h: [3446.3, 3425, 3442.1, 3450, 3451.4, 3466.4, 3464.9, 3485, 3489.9],
  l: [3413.5, 3420, 3397.6, 3390.1, 3408.4, 3393.4, 3367, 3356, 3261.1],
  c: [3429.7, 3423.3, 3400.8, 3419.8, 3411.7, 3406.2, 3383.8, 3382, 3266],
  t: [1751328000,1751414400,1751500800,1751587200,1751846400,1751932800,1752019200,1752105600,1752192000]
};

// Static sample data for demonstration (YYYY-MM-DD format)
const staticCandles = [
  { time: '2025-07-01', open: 3400, high: 3450, low: 3390, close: 3440 },
  { time: '2025-07-02', open: 3440, high: 3460, low: 3420, close: 3455 },
  { time: '2025-07-03', open: 3455, high: 3470, low: 3440, close: 3465 },
  { time: '2025-07-04', open: 3465, high: 3480, low: 3450, close: 3475 },
  { time: '2025-07-05', open: 3475, high: 3490, low: 3460, close: 3480 },
];

function formatChartData(data) {
  // Convert API data to LightweightCharts format
  return data.t.map((timestamp, i) => ({
    time: Math.floor(timestamp / 86400), // Convert Unix seconds to YYYY-MM-DD
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
  }));
}

const AdvancedChartPage = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: 600,
      height: 400,
      layout: { background: { color: '#fff' }, textColor: '#222' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
    });
    const candlestickSeries = chart.addCandlestickSeries();
    // Use staticCandles for demonstration. Replace with formatChartData(chartData) for API data.
    candlestickSeries.setData(staticCandles);
    return () => chart.remove();
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-bold mb-4">Advanced Candlestick Chart (LightweightCharts)</h2>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default AdvancedChartPage;
