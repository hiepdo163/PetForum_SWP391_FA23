export function splitingList(name, inputArray) {
  return inputArray.some((data) => data.name === name);
}

export function processUserData(
  userData,
  postData,
  transactionData,
  reportData,
  membershipData
) {
  return userData.map((user) => {
    const matchingPost = postData.find((obj) => obj.name === user.name);
    const matchingTransaction = transactionData.find(
      (obj) => obj.name === user.name
    );
    const matchingReport = reportData.find((obj) => obj.name === user.name);
    const matchingMembership = membershipData.find(
      (obj) => obj.name === user.name
    );

    return {
      name: user.name,
      users: user.users,
      posts: matchingPost ? matchingPost.posts : 0,
      transactions: matchingTransaction ? matchingTransaction.transactions : 0,
      reports: matchingReport ? matchingReport.reports : 0,
      membership: matchingMembership ? matchingMembership.membership : 0,
    };
  });
}

export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
