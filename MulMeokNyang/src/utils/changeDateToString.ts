export const changeDateToString = (date: Date, range: string) => {
  // '년'
  const year = date.getFullYear();
  if (range === "년") return `${year}`;

  // '월'은 0부터 시작하므로 1을 더하고 2자리로 맞추기
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  if (range === "달") return `${year}-${month}`;

  // '일' 2자리로 맞추기
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
