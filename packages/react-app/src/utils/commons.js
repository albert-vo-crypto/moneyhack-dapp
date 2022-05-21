export const log = (...args) => {
  console.log("revefin", ...args);
};

export const logErr = (...args) => {
  console.error("revefin", ...args);
};

export const getFormatedCurrencyValue = (value, maximumFractionDigits = 2) => {
  /*
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(value);
  */
  if (value > 999 && value < 1000000) {
    return (value / 1000).toFixed(maximumFractionDigits) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(maximumFractionDigits) + "M"; // convert to M for number from > 1 million
  } else {
    return value > 0.0001 ? value.toFixed(maximumFractionDigits) : value; // if value < 1000, nothing to do
  }
};
