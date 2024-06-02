export const CalculateRemainingPoint = (membershipPoint) => {
  if (membershipPoint < 100) {
    return "Iron";
  } else if (membershipPoint < 200) {
    return "Bronze";
  } else if (membershipPoint < 300) {
    return "Silver";
  } else if (membershipPoint < 400) {
    return "Gold";
  }
};

export const GetMaxPoint = (membershipPoint) => {
  if (membershipPoint < 100) {
    return 100;
  } else if (membershipPoint < 200) {
    return 200;
  } else if (membershipPoint < 300) {
    return 300;
  } else if (membershipPoint < 400) {
    return 400;
  }
};
