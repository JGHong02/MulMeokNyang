export const checkCanPress = (object: object) => {
  return Object.values(object).every((value) => value === true);
};
