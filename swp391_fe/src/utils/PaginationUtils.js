export const calculatePageRange = (page, postsPerPage) => {
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return { startIndex, endIndex };
};
