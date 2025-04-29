interface Options {
  excludeToday?: boolean;
  excludeYesterday?: boolean;
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
    !options?.excludeToday &&
    day === currentDate.getDate() &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear()
  ) {
    return "Сегодня";
  }

  if (
    !options?.excludeYesterday &&
    currentDate.getDate() - day === 1 &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear()
  ) {
    return "Вчера";
  }

  const monthStringRU = MONTHS_RU[month];

  return year === currentDate.getFullYear()
    ? `${day} ${monthStringRU}`
    : `${day} ${monthStringRU} ${year} года`;
};
