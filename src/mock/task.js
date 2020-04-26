/* eslint-disable valid-jsdoc */
import {COLORS} from "../const.js";
import {generateRandomArrayItem, getRandomIntegerNumber} from "../utils/common.js";

const DESCRIPTION_ITEMS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

/** Функция для генерации случайной даты в диапазоне +/- 7 дней */
const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

/** Функция для генерации объекта с днями, по которым повторяется задача */
const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {"mo": Math.random() > 0.5});
};

/** Функция для создания объекта, описывающего задачу */
const generateTask = () => {
  /** Дедлайн: дата и время */
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    /** Описание задачи */
    description: generateRandomArrayItem(DESCRIPTION_ITEMS),
    /** Дедлайн: дата и время */
    dueDate,
    /** Массив с повторяющимися днями */
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    /** Цвет задачи */
    color: generateRandomArrayItem(COLORS),
    /** Статус задачи: В архиве или нет */
    isArchive: Math.random() > 0.5,
    /** Статус задачи: В избранном или нет */
    isFavorite: Math.random() > 0.5,
  };
};

/**
 * Функция для генерации массива объектов всех карточек
 * @param {Number} count Количество карточек
 */
const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};

export {generateTasks};
