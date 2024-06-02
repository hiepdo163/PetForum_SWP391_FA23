export const getFirstObject = (array) => {
  return array[0];
};

export const getLastObject = (array) => {
  return array[array.length - 1];
};

export const getExceptLastObject = (array) => {
  return array.slice(0, array.length - 1);
};
