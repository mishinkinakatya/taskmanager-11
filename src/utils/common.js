/* eslint-disable valid-jsdoc */
import moment from "moment";

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
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

export {formatTime, formatDate, generateRandomArrayItem, getRandomIntegerNumber, isRepeating, isOverdueDate, isOneDay};
