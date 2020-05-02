/* eslint-disable valid-jsdoc */
import {FilterType} from "../const.js";
import {isRepeating, isOverdueDate, isOneDay} from "./common.js";

/**
 * Функция для получения массива всех активных задач
 * @param {Array} tasks Массив задач
 */
const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

/**
 * Функция для получения массива архивных задач
 * @param {Array} tasks Массив задач
 */
const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

/**
 * Функция для получения массива избранных задач
 * @param {Array} tasks Массив задач
 */
const getFavoritesTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

/**
 * Функция для получения массива просроченных задач
 * @param {Array} tasks Массив задач
 */
const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

/**
 * Функция для получения массива повторяющихся задач
 * @param {Array} tasks Массив задач
 */
const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

/**
 * Функция для получения массива задач на текущий день
 * @param {Array} tasks Массив задач
 */
const getTasksInOneDay = (tasks, date) => {
  return tasks.filter((task) => isOneDay(task.dueDate, date));
};

/**
 * Функция для получения задач по выбранному фильтру
 * @param {Array} tasks Массив задач
 * @param {String} filterType Тип фильтра
 */
export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoritesTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }

  return tasks;
};
