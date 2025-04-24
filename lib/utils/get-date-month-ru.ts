interface Options {
  includeToday?: boolean;
}

const MONTHS_RU = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
] as const;

export const getDateMonthRu = (timestamp?: number, options?: Options) => {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const currentDate = new Date();

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (
    day === currentDate.getDate() &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear()
  ) {
    return "Сегодня";
  }

  const monthStringRU = MONTHS_RU[month];

  return year === currentDate.getFullYear()
    ? `${day} ${monthStringRU}`
    : `${day} ${monthStringRU} ${year} года`;
};
