import React from "react";
import moment from "moment";
import { VictoryChart, VictoryAxis, VictoryLabel, VictoryLine } from "victory";
import _ from "lodash";

const NFTHistoricalRevenueChart = ({ nftCollection }) => {
  const datas = nftCollection?.historicalDatas?.stats?.ethRoyaltyRevenueDatas || [];
  const sortedDatas = _.sortBy(datas, "x");
  const lineDatas = sortedDatas.map(data => {
    return {
      x: moment(data.x, "YYYY-MM").format("MMM"),
      y: data.y,
    };
  });

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
      <h2 class="text-center">Historical Revenue</h2>
      <VictoryChart domainPadding={{ x: 50, y: 0 }}>
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
        <VictoryLine
          style={{
            data: { stroke: "#818CF8" },
          }}
          data={lineDatas}
        />
      </VictoryChart>
    </div>
  );
};

export default NFTHistoricalRevenueChart;
