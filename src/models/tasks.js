/* eslint-disable valid-jsdoc */
/** Модель: Задачи */
export default class Tasks {
  /** Конструктор модели "Задача" */
  constructor() {
    /** Свойство модели: Массив всех задач */
    this._tasks = [];

    /** Свойство модели: массив с наблюдателями */
    this._dataChangeHandlers = [];
  }

  /** Метод для получения всех задач */
  getTasks() {
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
