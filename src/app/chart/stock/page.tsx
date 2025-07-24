"use client";
import React, { useEffect, useRef } from "react";
import {
  createChart,
  AreaSeries,
  UTCTimestamp,
} from "lightweight-charts";

// Your chart data
const chartData = [
  { time: 1752657540, value: 1478.7 },
  { time: 1752657840, value: 1479.8 },
  { time: 1752658140, value: 1477.9 },
  { time: 1752658440, value: 1479.9 },
  { time: 1752658740, value: 1480.1 },
  { time: 1752659040, value: 1479.5 },
  { time: 1752659340, value: 1480 },
  { time: 1752659640, value: 1479.5 },
  { time: 1752659940, value: 1477.7 },
  { time: 1752660240, value: 1476.4 },
  { time: 1752660540, value: 1475 },
  { time: 1752660840, value: 1475.7 },
  { time: 1752661140, value: 1475.8 },
  { time: 1752661440, value: 1476.1 },
  { time: 1752661740, value: 1478.9 },
  { time: 1752662040, value: 1479.4 },
  { time: 1752662340, value: 1479.4 },
  { time: 1752662640, value: 1479.7 },
  { time: 1752662940, value: 1479.7 },
  { time: 1752663240, value: 1479.7 },
  { time: 1752663540, value: 1480 },
  { time: 1752663840, value: 1480.3 },
  { time: 1752664140, value: 1479.5 },
  { time: 1752664440, value: 1479.9 },
  { time: 1752664740, value: 1476.8 },
  { time: 1752665040, value: 1477.6 },
  { time: 1752665340, value: 1477.7 },
  { time: 1752665640, value: 1476.7 },
  { time: 1752665940, value: 1477.7 },
  { time: 1752666240, value: 1479.4 },
  { time: 1752666540, value: 1479.9 },
  { time: 1752666840, value: 1480.5 },
  { time: 1752667140, value: 1480 },
  { time: 1752667440, value: 1480 },
  { time: 1752667740, value: 1481.9 },
  { time: 1752668040, value: 1483 },
  { time: 1752668340, value: 1482 },
  { time: 1752668640, value: 1480.5 },
  { time: 1752668940, value: 1481.4 },
  { time: 1752669240, value: 1483.9 },
  { time: 1752669540, value: 1482.4 },
  { time: 1752669840, value: 1481 },
  { time: 1752670140, value: 1482 },
  { time: 1752670440, value: 1481.6 },
  { time: 1752670740, value: 1481.2 },
  { time: 1752671040, value: 1480.5 },
  { time: 1752671340, value: 1480.3 },
  { time: 1752671640, value: 1480.7 },
  { time: 1752671940, value: 1480.6 },
  { time: 1752672240, value: 1480.5 },
  { time: 1752672540, value: 1481 },
  { time: 1752672840, value: 1479.9 },
  { time: 1752673140, value: 1480.1 },
  { time: 1752673440, value: 1480.6 },
  { time: 1752673740, value: 1480.2 },
  { time: 1752674040, value: 1480.3 },
  { time: 1752674340, value: 1480.2 },
  { time: 1752674640, value: 1483.2 },
  { time: 1752674940, value: 1483.4 },
  { time: 1752675240, value: 1485 },
  { time: 1752675540, value: 1488.6 },
  { time: 1752675840, value: 1487 },
  { time: 1752676140, value: 1486.2 },
  { time: 1752676440, value: 1486 },
  { time: 1752676740, value: 1485 },
  { time: 1752677040, value: 1486.2 },
  { time: 1752677340, value: 1485.2 },
  { time: 1752677640, value: 1484.6 }
];

const StockChartPage = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 300,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#000",
      },
      rightPriceScale: {
        visible: true,
      },
      timeScale: {
        timeVisible: true,
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: 'rgba(6, 195, 152, 0.5)',       // Green sky effect
      bottomColor: 'rgba(6, 195, 152, 0)',      // Fade to transparent
      lineColor: 'rgba(6, 195, 152, 1)',        // Line color
      lineWidth: 2,
    });

    areaSeries.setData(chartData as { time: UTCTimestamp; value: number }[]);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-bold mb-4">Stock Chart with Sky Fill</h2>
      <div ref={chartContainerRef} style={{ width: "100%", minHeight: 300 }} />
    </div>
  );
};

export default StockChartPage;
