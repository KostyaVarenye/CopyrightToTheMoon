export const formatPrice = (number) => {
  //formats the price with Intl.NumberFormat currency template
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number / 100);
};
//look for the data passed and type of the data and return all the unique values with no repetitions
export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  //if we have array , we will flatten the data
  if (type === "genre") {
    unique = unique.flat();
  }
  return ["all", ...new Set(unique)];
};

export const usdToEth = (usd) => {
  //get usd to wei price
  //return calculation
  return usd * 239928923580460;
};
