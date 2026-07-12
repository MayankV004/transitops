"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getDetailedReportData, ExportData } from "@/actions/export.actions";

export function ExportPDFButton() {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<"month" | "year" | "all">("month");

  const handleExport = async () => {
    try {
      setLoading(true);
      const data = await getDetailedReportData(timeRange);
      generatePDF(data);
    } catch (error) {
      console.error("Failed to export PDF", error);
      alert("Failed to export PDF");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (data: ExportData) => {
    const doc = new jsPDF();
    const { summary, vehicles } = data;

    // Title
    doc.setFontSize(20);
    doc.text("TransitOps - Detailed Analytics Report", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Time Range: ${data.timeRange.toUpperCase()}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Executive Summary", 14, 50);

    const fuelEfficiency = summary.totalFuelLiters > 0 ? (summary.totalDistance / summary.totalFuelLiters).toFixed(2) : "0.00";
    const fleetUtilization = summary.totalVehiclesCount > 0 ? Math.round((summary.activeTripsCount / summary.totalVehiclesCount) * 100) : 0;
    const operationalCost = summary.totalFuelCost + summary.totalMaintenanceCost + summary.totalExpenses;
    const vehicleROI = summary.totalAcquisitionCost > 0 
      ? (((summary.totalRevenue - operationalCost) / summary.totalAcquisitionCost) * 100).toFixed(2)
      : "0.00";

    const summaryBody = [
      ["Fuel Efficiency", `${fuelEfficiency} km/l`],
      ["Fleet Utilization", `${fleetUtilization}%`],
      ["Operational Cost", `$${operationalCost.toLocaleString()}`],
      ["Vehicle ROI", `${vehicleROI}%`],
      ["Total Distance", `${summary.totalDistance.toLocaleString()} km`],
      ["Total Revenue (Est.)", `$${summary.totalRevenue.toLocaleString()}`],
      ["Total Fuel Consumed", `${summary.totalFuelLiters.toLocaleString()} L`],
    ];

    autoTable(doc, {
      startY: 55,
      head: [["Metric", "Value"]],
      body: summaryBody,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Detailed Trips
    let finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 55;
    
    doc.setFontSize(14);
    doc.text("Detailed Trips", 14, finalY + 15);

    const tripsBody = vehicles.flatMap(v => v.trips.map((t) => [
      `TR${t.id.substring(t.id.length - 4).toUpperCase()}`,
      new Date(t.createdAt).toLocaleDateString(),
      v.regNumber,
      t.driver?.name || "N/A",
      t.status,
      `${t.actualDistance || t.plannedDistance || 0} km`
    ]));

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Trip ID", "Date", "Vehicle", "Driver", "Status", "Distance"]],
      body: tripsBody.length > 0 ? tripsBody : [["No trips found", "-", "-", "-", "-", "-"]],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Detailed Expenses
    finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 55;
    if (finalY > 250) {
      doc.addPage();
      finalY = 10;
    }

    doc.setFontSize(14);
    doc.text("Detailed Expenses & Maintenance", 14, finalY + 15);

    const expensesBody: Array<string[]> = [];
    
    vehicles.forEach(v => {
      v.expenses.forEach((e) => {
        expensesBody.push([
          new Date(e.date).toLocaleDateString(),
          v.regNumber,
          "Expense",
          e.type,
          `$${e.amount.toLocaleString()}`
        ]);
      });
      v.maintenance.forEach((m) => {
        expensesBody.push([
          new Date(m.date).toLocaleDateString(),
          v.regNumber,
          "Maintenance",
          m.serviceType,
          `$${m.cost.toLocaleString()}`
        ]);
      });
      v.fuelLogs.forEach((f) => {
        expensesBody.push([
          new Date(f.date).toLocaleDateString(),
          v.regNumber,
          "Fuel",
          `${f.liters} L`,
          `$${f.cost.toLocaleString()}`
        ]);
      });
    });

    expensesBody.sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Date", "Vehicle", "Category", "Description", "Cost"]],
      body: expensesBody.length > 0 ? expensesBody : [["No records found", "-", "-", "-", "-"]],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`TransitOps_Report_${data.timeRange}.pdf`);
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value as "month" | "year" | "all")}
        className="bg-[#121212] border border-gray-800 text-gray-300 text-sm rounded px-3 py-2 focus:outline-none focus:border-gray-600 appearance-none min-w-[120px]"
        disabled={loading}
      >
        <option value="month">Past Month</option>
        <option value="year">Past Year</option>
        <option value="all">All Time</option>
      </select>
      
      <button
        onClick={handleExport}
        disabled={loading}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export PDF
      </button>
    </div>
  );
}
