import React from "react";
import moment from "moment";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel, Bar } from "victory";

const NFTInvestmentDetail = ({ rev, bidAmount }) => {
  const monthlyRev = rev / 12.0;
  const barData = [
    { x: moment().unix(), y: -bidAmount },
    { x: moment().add(1, "Month").unix(), y: -bidAmount },
    { x: moment().add(2, "Month").unix(), y: monthlyRev },
    { x: moment().add(3, "Month").unix(), y: monthlyRev },
    { x: moment().add(4, "Month").unix(), y: monthlyRev },
    { x: moment().add(5, "Month").unix(), y: monthlyRev },
    { x: moment().add(6, "Month").unix(), y: monthlyRev },
    { x: moment().add(7, "Month").unix(), y: monthlyRev },
    { x: moment().add(8, "Month").unix(), y: monthlyRev },
    { x: moment().add(9, "Month").unix(), y: monthlyRev },
    { x: moment().add(10, "Month").unix(), y: monthlyRev },
    { x: moment().add(11, "Month").unix(), y: monthlyRev },
    { x: moment().add(12, "Month").unix(), y: monthlyRev },
  ];

  return (
    <div class="w-full">
      <div class="grid grid-cols-5 place-items-center">
        <VictoryChart height={400} width={400} domainPadding={{ x: 50, y: [0, 20] }} scale={{ x: "time" }}>
          <VictoryBar
            dataComponent={<Bar />}
            //style={this.state.style}
            data={barData}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default NFTInvestmentDetail;
