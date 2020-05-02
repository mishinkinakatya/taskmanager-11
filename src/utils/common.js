/* eslint-disable valid-jsdoc */
const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 24);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const generateRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

/**
 * Флаг: Выбран хотя бы один день для повторения?
 * @param {Array} repeatingDays Массив дней
 */
const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

const isOneDay = (dateA, dateB) => {
  const a = Date.parse(dateA);
  const b = Date.parse(dateB);

  const diff = b - a;

  return diff === 0 && dateA.getDate() === dateB.getDate();
};

export {formatTime, generateRandomArrayItem, getRandomIntegerNumber, isRepeating, isOverdueDate, isOneDay};
