import React from "react";
import moment from "moment";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, Bar } from "victory";

const NFTRevenueScheduleChart = ({ rev, bidAmount }) => {
  const monthlyRev = rev / 12.0;
  const barData = [
    { x: moment().format("MMM"), y: -bidAmount },
    { x: moment().add(1, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(2, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(3, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(4, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(5, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(6, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(7, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(8, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(9, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(10, "Month").format("MMM"), y: monthlyRev },
    { x: moment().add(11, "Month").format("MMM"), y: monthlyRev },
  ];

  const chartTheme = {
    axis: {
      style: {
        tickLabels: {
          fill: "#f4f5f5",
        },
        labels: {
          fill: "#f4f5f5",
        },
      },
    },
  };

  return (
    <div class="w-full">
      <h2 class="text-center">Revenue Schedule</h2>
      <VictoryChart theme={chartTheme} domainPadding={{ x: 50, y: 0 }}>
        <VictoryAxis
          label=""
          style={{
            grid: { stroke: "#F4F5F7", strokeWidth: 0 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label=""
          style={{
            grid: { stroke: "#F4F5F7", strokeWidth: 0 },
          }}
        />
        <VictoryBar dataComponent={<Bar />} style={{ data: { fill: "#818CF8" } }} data={barData} />
      </VictoryChart>
    </div>
  );
};

export default NFTRevenueScheduleChart;
