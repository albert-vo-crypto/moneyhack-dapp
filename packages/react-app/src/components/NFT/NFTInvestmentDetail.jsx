import React from "react";
import moment from "moment";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, Bar, VictoryLine } from "victory";

const NFTInvestmentDetail = ({ rev, bidAmount }) => {
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
          fill: "white",
        },
        labels: {
          fill: "white",
        },
      },
    },
  };

  return (
    <div class="w-full">
      <div class="grid grid-cols-4 place-items-center">
        <div class="col-span-2">
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
            <VictoryBar dataComponent={<Bar />} style={{ data: { fill: "#4F46E5" } }} data={barData} />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

export default NFTInvestmentDetail;
