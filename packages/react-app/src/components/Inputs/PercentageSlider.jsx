import React from "react";
import { Slider } from "antd";

import {
  DEFAULT_BID_SLIDER_PERCENTAGE,
  BID_SLIDER_MIN_PERCENTAGE,
  BID_SLIDER_MAX_PERCENTAGE,
  COLOR_WHITE,
} from "../../constants";

const PercentageSlider = ({
  min = BID_SLIDER_MIN_PERCENTAGE,
  max = BID_SLIDER_MAX_PERCENTAGE,
  defaultValue = DEFAULT_BID_SLIDER_PERCENTAGE,
  onChange,
}) => {
  const sliderValueFormatter = value => {
    return `${value}%`;
  };

  return (
    <Slider
      trackStyle={{ backgroundColor: COLOR_WHITE }}
      handleStyle={{ borderColor: COLOR_WHITE }}
      min={min}
      max={max}
      tipFormatter={null}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

export default PercentageSlider;
