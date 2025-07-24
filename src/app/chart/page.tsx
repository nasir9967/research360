"use client";
import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

function numFormatter(num: string | number) {
  num = typeof num === "string" ? parseFloat(num) : num;
  if (num < 99999) {
    return (num / 1000).toFixed(2) + "K";
  } else if (num >= 100000 && num <= 9999999) {
    return (num / 100000).toFixed(2) + "L";
  } else {
    return (num / 10000000).toFixed(2) + "Cr";
  }
}

const chartOptions = {
  chart: {
    type: "bar" as const,
    height: 267,
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: "easein",
      speed: 800,
      animateGradually: { enabled: true, delay: 350 },
      dynamicAnimation: { enabled: true, speed: 350 },
    },
  },
  colors: ["#b9de38", "#efc574", "#76eeae"],
  legend: {
    horizontalAlign: "left" as const,
    itemMargin: { horizontal: 5, vertical: 5 },
    formatter: (seriesName: string, opts: any) => {
      const series = opts.w.config.series[opts.seriesIndex];
      let legend_html = `<div class='row'><div class='col'>${seriesName}</div>`;
      for (let i = 0; i < series.per_changes.length; ++i) {
        const text_color = parseFloat(series.per_changes[i]) > 0 ? "text-success" : "text-danger";
        legend_html += `<div class='col ${text_color}'>${series.per_changes[i]}</div>`;
      }
      legend_html += "<div>";
      return legend_html;
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
      dataLabels: { position: "top" },
    },
  },
  // if you want to show data labels on top of the bars update dataLabels to true
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: { fontSize: "11px", colors: ["#304758"] },
    formatter: (val: number) => numFormatter(val),
  },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: {
    categories: ["Mar-2023", "Mar-2024", "Mar-2025"],
  },
  yaxis: { show: false },
  grid: { show: false },
  fill: { opacity: 1 },
  states: { hover: { filter: { type: "none" } } },
  tooltip: {
    y: {
      formatter: (val: number) => numFormatter(val),
    },
  },
};

const chartSeries = [
  {
    name: "Revenue",
    data: ["711.3900", "1039.3600", "1374.0600"],
    per_changes: ["711.39", "1,039.36", "1,374.06"],
  },
  {
    name: "Gross Profit",
    data: ["556.5400", "405.1000", "220.0200"],
    per_changes: ["556.54", "405.10", "220.02"],
  },
  {
    name: "Net Income",
    data: ["-63.1800", "-49.9600", "-101.0500"],
    per_changes: ["-63.18", "-49.96", "-101.05"],
  },
];

const ChartPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="flex gap-6 mb-6 mt-2">
      <Link href="/chart/donut" className="text-blue-600 underline">View Donut chart of ipo detail</Link>
      <Link href="/chart/stock" className="text-blue-600 underline">View Stock chart</Link>
      <Link href="/chart/advance" className="text-blue-600 underline">Advance chart</Link>
      <Link href="/chart/pattern-detection" className="text-blue-600 underline">Pattern Detection</Link>
    </div>
    <h1 className="text-2xl font-bold mb-6 text-blue-900">Balance Sheet Chart of IPO Detail page</h1>
    <div className="w-full max-w-2xl bg-white rounded shadow p-6">
      <ApexChart options={chartOptions} series={chartSeries} type="bar" height={267} />
    </div>
  </div>
);

export default ChartPage;
