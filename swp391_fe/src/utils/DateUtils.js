export const getTimePassed = (dateTime) => {
  const postDate = new Date(dateTime);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - postDate.getTime();
  const secondsPassed = Math.floor(timeDiff / 1000);
  const minutesPassed = Math.floor(secondsPassed / 60);
  const hoursPassed = Math.floor(minutesPassed / 60);
  const daysPassed = Math.floor(hoursPassed / 24);

  if (daysPassed > 0) {
    return `${daysPassed} day(s) ago`;
  } else if (hoursPassed > 0) {
    return `${hoursPassed} hour(s) ago`;
  } else if (minutesPassed > 0) {
    return `${minutesPassed} minute(s) ago`;
  } else {
    return `${secondsPassed} second(s) ago`;
  }
};

export const filterPostsByRecent = (posts) => {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.post.date);
    const dateB = new Date(b.post.date);
    return dateB - dateA;
  });

  const size = sortedPosts.length;
  return { sortedPosts, size };
};

export const convertDatetime = (datetimeStr) => {
  const dt = new Date(datetimeStr);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = dt.getDate();
  const monthIndex = dt.getMonth();
  const year = dt.getFullYear();
  const hours = dt.getHours();
  const minutes = dt.getMinutes();
  const formattedDatetime = `${day} ${monthNames[monthIndex]} ${year} ${hours}:${minutes}`;

  return formattedDatetime;
};
