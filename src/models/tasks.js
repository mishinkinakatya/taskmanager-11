/* eslint-disable valid-jsdoc */
import {getTasksByFilter} from "../utils/fillter.js";
import {FilterType} from "../const.js";

/** Модель: Задачи */
export default class Tasks {
  /** Конструктор модели "Задача" */
  constructor() {
    /** Свойство модели: Массив всех задач */
    this._tasks = [];
    /** Свойство модели: Выбранный фильтр */
    this._activeFilterType = FilterType.ALL;

    /** Свойство модели: массив с наблюдателями */
    this._dataChangeHandlers = [];
    /** Свойство модели: массив с наблюдателями за изменениями фильтра */
    this._filterChangeHandlers = [];
  }

  /** Метод для получения отфильтрованных задач */
  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  /** Метод для получения всех задач */
  getTasksAll() {
    return this._tasks;
  }

  /**
   * Метод для заполнения задач
   * @param {Array} tasks Задачи
   */
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * Метод, который позволит подписываться на изменение фильтра
   * @param {String} FilterType Тип фильтра
   */
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
   * Метод для удаления одной задачи из модели
   * @param {String} id id задачи
   */
  removeTask(id) {
    /** Индекс задачи, которую нужно удалить */
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }


  /**
   * Метод для обновления одной задачи в модели
   * @param {String} id id "старой задачи"
   * @param {Object} task новая задача
   */
  updateTask(id, task) {
    /** Индекс задачи, в которой произошли изменения */
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /**
 * Метод для добавления одной задачи в модель
 * @param {String} task задача
 */
  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * Метод добавляющий колбэки, которые будут вызывать модель, если изменился фильтр
   * @param {*} handler Колбэк
   */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /**
   * Метод добавляющий колбэки, которые будут вызывать модель, если она изменилась
   * @param {*} handler Колбэк
   */
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  /**
   * Приватный метод,который вызывает колбэки
   * @param {Array} handlers Массив колбэков
   */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
