"use client";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const pieOptions = {
  chart: {
    type: "donut" as const, // Use 'donut' for a ring-style pie chart
    height: 280, // Chart height in pixels
  },
  title: {
    text: "Shares Offered", // Chart title
    align: "left" as const, // Align title to the left - fix TypeScript error
    style: { fontSize: "22px", fontWeight: "bold", color: "#222" }, // Title style
  },
  labels: ["QIB", "NIB", "Retail", "Employee", "Others"], // Labels for each slice
  legend: {
    show: true, // Show legend on the chart
    position: "right" as const, // Place legend on the right
    fontSize: "15px",
    fontWeight: 500,
    labels: { colors: ["#222"] }, // Legend text color
    // Custom legend formatter: show name, value (Indian format), and percent
    formatter: function (seriesName: string, opts: { seriesIndex: number; w: { config: { colors: string[] } } }) {
      const data = [2903910, 2217233, 5173543, 107142, 0];
      const percent = [27.92, 21.32, 49.74, 1.03, 0];
      const index = opts.seriesIndex;
      const xVal = data[index].toLocaleString("en-IN"); // Format with Indian commas
      // Suggestion: You can customize this to show more info or style
      return `<span style='color:${opts.w.config.colors[index]};font-weight:bold;'>${seriesName}</span><br><span>${xVal} (${percent[index].toFixed(2)}%)</span>`;
    },
    itemMargin: { vertical: 8 }, // Space between legend items
  },
  tooltip: {
    enabled: true, // Show tooltip on hover
    y: {
      // Custom tooltip: show label and percent
      formatter: function (val: number, opts: { dataPointIndex: number }) {
        const percent = [27.92, 21.32, 49.74, 1.03, 0];
        const index = opts.dataPointIndex;
        return `${pieOptions.labels[index]}: <b>${percent[index].toFixed(2)}%</b>`;
      },
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "70%", // Inner size of donut
      },
      dataLabels: {
        enabled: false, // Hide labels on slices
        offset: 0, // Fix for ApexCharts type error
      },
      expandOnClick: false, // Prevent expanding slice on click
    },
  },
  colors: ["#b9de38", "#efc574", "#76eeae", "#42a5ba", "#dfd42a"], // Slice colors
  dataLabels: { enabled: false }, // Hide global data labels
  stroke: { show: false }, // No border around slices
  grid: { show: false }, // Hide grid
};

// 3. Data for the chart: array of numbers, each value matches a label
// Suggestion: Keep data and percent arrays in sync with labels
const pieSeries = [2903910, 2217233, 5173543, 107142, 0];

const donut = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-2xl font-bold mb-6 text-blue-900">highcharts convert to appexchart</h1>
    <div className="w-full max-w-2xl bg-white rounded shadow p-6">
      {/* Render ApexChart with options and series */}
      <ApexChart options={pieOptions} series={pieSeries} type="donut" height={280} />
    </div>
    <Link href="/chart" className="mt-6 text-blue-600 underline">Back to Bar Chart</Link>
  </div>
);

export default donut;
