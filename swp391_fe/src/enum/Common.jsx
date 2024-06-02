export const ROLE_ENUM = {
  Admin: "Admin",
  Staff: "Staff",
  Member: "Member",
};

export const RANK_ENUM = {
  GOLD: 0,
  SILVER: 1,
  BRONZE: 2,
  IRON: 3,
};

export const PET_AGE = {
  LOWER_THAN_THREE_MONTH: 0,
  LOWER_THAN_ONE_YEAR: 1,
  GREATER_THAN_ONE_YEAR: 2,
  OTHER: 3,
};

export const MEMBERSHIP_PAYMENT_TYPE = {
  UPLOAD_AMOUNT_10: 30000,
  UPLOAD_AMOUNT_30: 50000,
  UPLOAD_AMOUNT_60: 90000,
};

export const MEMBERSHIP_SCORE_WITH_PAYMENT_TYPE = {
  UPLOAD_AMOUNT_10: 10,
  UPLOAD_AMOUNT_30: 50,
  UPLOAD_AMOUNT_60: 90,
};

export const MEMBERSHIP_UPLOAD_TURN = {
  UPLOAD_AMOUNT_10: 10,
  UPLOAD_AMOUNT_30: 30,
  UPLOAD_AMOUNT_60: 60,
};

export const ELEMENT_PER_PAGE = 10;

export const TIME_FILTERS = {
  TODAY: "Today",
  THIS_WEEK: "This Week",
  THIS_MONTH: "This Month",
  LAST_MONTH: "Last Month",
};

export const PROCESSING_STATUS = {
  ACCEPTED: 1,
  REJECTED: 0,
  PENDING: -1,
};

export const CATEGORYIMAGE = {
  Reptile:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-egor-kamelev-927497.jpg?alt=media&token=a67769c5-46ed-457b-a737-18ce3172292b&_gl=1*bnql1e*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTMzMS42MC4wLjA.",
  Fish: "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-ben-phillips-4781926.jpg?alt=media&token=1f0b8111-e139-49f3-b5fd-fe5e0836b07e&_gl=1*1ds7jts*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTI4My40NS4wLjA.",
  Dog: "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-viridiana-rivera-16623449.jpg?alt=media&token=c6b3e11b-8cef-41b3-be36-91bc9021ec8f&_gl=1*1xjqid9*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTQxNy4zOC4wLjA.",
  "Small Mammal":
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-monicore-134061.jpg?alt=media&token=ac36f19a-1fa8-4449-b73d-865ff54ecb8e&_gl=1*1fduake*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTM3OC4xMy4wLjA.",
  Bird: "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-tina-nord-792416.jpg?alt=media&token=8f46a72d-852a-4785-89e6-10935d4f3784&_gl=1*tqd5vm*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTM5NS42MC4wLjA.",
  Cat: "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-cong-h-1404819.jpg?alt=media&token=1d354f3b-6a4e-425d-8eeb-140a01971efc&_gl=1*xyp3jw*_ga*NTc2Mzk1NDIuMTY5Nzk4NTA1Mg..*_ga_CW55HF8NVT*MTY5Nzk4NTA1Mi4xLjEuMTY5Nzk4NTMxNS4xMy4wLjA.",
  Gorilla:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-glenn-saunders-18262681.jpg?alt=media&token=fdc2b632-bb56-4bce-a201-0d5edf494a96&_gl=1*1af2dg6*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQxNjIuNDQuMC4w",
  Dolphin:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-jess-loiterton-5008377.jpg?alt=media&token=677f2e43-a62d-40a2-8c4e-1ccc69a17147&_gl=1*19pe0w0*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQyMjguNjAuMC4w",
  Elephant:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-elina-sazonova-1907075.jpg?alt=media&token=a0ba0b91-9a78-4a07-9311-031674247eea&_gl=1*gj3h87*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQyNjQuMjQuMC4w",
  Giraffe:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-haugenzhays-zhang-1435495.jpg?alt=media&token=5af39e5e-b46c-44c5-8f0b-b57c46be3072&_gl=1*kyvu22*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQyOTcuNjAuMC4w",
  Tiger:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-lucas-pezeta-1926338.jpg?alt=media&token=9974d266-a298-463e-ab1f-27ad2c5ed242&_gl=1*i30ig8*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQzMjguMjkuMC4w",
  "Polar Bear":
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-pixabay-48153.jpg?alt=media&token=4287cd9a-7dbb-4e53-9bab-730d5bd4e45d&_gl=1*c38tfd*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQzNTYuMS4wLjA.",
  Lion: "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-bisakha-datta-5598439.jpg?alt=media&token=24f653df-ff19-4219-a772-e8d13c66979a&_gl=1*15gd2r3*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQzOTIuMjguMC4w",
  Kangaroo:
    "https://firebasestorage.googleapis.com/v0/b/swp391-402306.appspot.com/o/images%2Fpexels-ethan-brooke-2122423.jpg?alt=media&token=b750fc18-f8f6-4884-ad60-e71fd96448a0&_gl=1*ndac84*_ga*MTA0MjIxNDY5OS4xNjk3NTI3NzUx*_ga_CW55HF8NVT*MTY5ODA0NDAzNS4xMS4xLjE2OTgwNDQ0MTUuNS4wLjA.",
};
