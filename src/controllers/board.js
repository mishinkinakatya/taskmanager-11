/* eslint-disable valid-jsdoc */

import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent, {SortType} from "../components/sort.js";
import TaskController from "./task.js";
import TasksComponent from "../components/tasks.js";
import {remove, render, RenderPosition} from "../utils/render.js";

/** Количество задач, которое по-умолчанию будет отображаться */
const SHOWING_TASKS_COUNT_ON_START = 8;

/** Количество задач, которое будет подгружаться по кнопке LoadMore */
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/**
 * Функция, которая рендерит задачи. Создает массив контроллеров всех показанных задач
 * @param {Element} taskListElement Элемент, куда будут добавляться задачи
 * @param {Array} tasks Массив задач, которые нужно отрисовать
 * @param {Function} onDataChange Метод, который будет вызван, при изменении данных
 * @param {Function} onViewChange Метод, который будет возвращать карточку в дефолтное состояние
 */
const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
};

/**
 * Функция, которая возвращает отсортированный массив задач
 * @param {Array} tasks Массив задач
 * @param {*} sortType Тип сортировки
 * @param {Number} from Индекс элемента, начиная с которого нужно возвращать задачи
 * @param {Number} to Индекс элемента, до которого нужно возвращать задачи
 */
const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

/** Контроллер для отрисовки доски */
export default class BoardController {
  /**
   * Конструктор контроллера доски
   * @param {*} container Компронент, внутри которого будет доска
   */
  constructor(container) {
    this._container = container;
    /** Свойство контроллера: Массив всех задач */
    this._tasks = [];
    /** Свойство контроллера: Массив контроллеров отображенных задач*/
    this._showedTaskControllers = [];
    /** Свойство контроллера: Количество отображаемых задач */
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    /** Свойство контроллера: Компонент доски без задач */
    this._noTasksComponent = new NoTasksComponent();
    /** Свойство контроллера: Компонент доски - Сортировка */
    this._sortComponent = new SortComponent();
    /** Свойство контроллера: Компонент доски - Блок со всеми задачами */
    this._tasksComponent = new TasksComponent();
    /** Свойство контроллера: Компонент доски LoadMore */
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    /** Свойство контроллера: метод изменения данных и перерисовки компонентов в контексте текущего контроллера доски */
    this._onDataChange = this._onDataChange.bind(this);
    /** Свойство контроллера: метод изменения типа сортировки в контексте текущего контроллера доски */
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    /** Свойство контроллера: метод, который уведомляет все контроллеры задач, что они должны вернуться в дефолтный режим в контексте текущего контроллера доски */
    this._onViewChange = this._onViewChange.bind(this);

    /** Добавление обработчика на изменение типа сортировки */
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  /**
   * Метод для рендеринга доски
   * @param {Array} tasks Массив задач
   */
  render(tasks) {
    this._tasks = tasks;
    /** Элемент, внутри которого будет рендериться доска */
    const container = this._container.getElement();
    /** Флаг для проверки того, что есть НЕ архивные задачи */
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    /** Элемент, внутри которого будут рендериться задачи */
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  /** Приватный метод, для отрисовки кнопки LoadMore*/
  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    /** Компронент, внутри которого будет кнопка LoadMore */
    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    /** Обработчик события клика по кнопке LoadMore */
    this._loadMoreButtonComponent.setClickHandler(() => {
      /** Количество показанных задач */
      const prevTasksCount = this._showingTasksCount;
      /** Элемент доски со всеми задачами */
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;
      /** Массив отсортированных задач, которые появятся при клике на LoadMore */
      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      /** Массив новых отрендеренных сортированных задач */
      const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);

      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  /**
   * Приватный метод, который изменяет данные и перерисовывает компонент
   * @param {*} taskController Контроллер задачи
   * @param {*} oldData Старые данные
   * @param {*} newData Новые данные
   */
  _onDataChange(taskController, oldData, newData) {
    /** Индекс задачи, в которой произошли изменения */
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  /** Приватный метод, который уведомляет все контроллеры задач, что они должны вернуться в дефолтный режим  */
  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  /**
   * Приватный метод, который перерисовывает задачи при изменении типа сортировки
   * @param {*} sortType Тип сортировки
   */
  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    /** Массив отсортированных задач */
    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);
    /** Элемент доски со всеми задачами */
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    /** Массив новых отрендеренных сортированных задач */
    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = newTasks;

    this._renderLoadMoreButton();
  }
}
