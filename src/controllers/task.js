import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";
import {render, replace, RenderPosition, remove} from "../utils/render.js";
import {COLORS} from "../const.js";

/** Режим карточки */
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

/** Пустая карточка задачи */
export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLORS.BLACK,
  isFavorite: false,
  isArchive: false,
};

/** Контроллер. Задача */
export default class TaskController {
  /**
   * Конструктор контроллера "Задача"
   * @param {*} container Компонент, внутри которого будет задача
   * @param {*} onDataChange
   * @param {*} onViewChange
   */
  constructor(container, onDataChange, onViewChange) {
    /** Свойство контроллера: Компонент, внутри которого будет текущая задача */
    this._container = container;

    /** Свойство контроллера: Метод изменения данных и перерисовки компонентов */
    this._onDataChange = onDataChange;
    /** Свойство контроллера: Метод изменения данных и перерисовки компонентов */
    this._onViewChange = onViewChange;
    /** Свойство контроллера: метод, который уведомляет все контроллеры задач, что они должны вернуться в дефолтный режим */
    this._mode = Mode.DEFAULT;

    /** Свойство контроллера: Текущий компонент карточки задачи */
    this._taskComponent = null;
    /** Свойство контроллера: Текущий компонент карточки редактирования задачи */
    this._taskEditComponent = null;

    /** Свойство контроллера: обработчик события нажатия на кнопку Esc в контексте текущего контроллера доски */
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  /**
   * Метод для рендеринга задачи
   * @param {Object} task Задача
   * @param {String} mode режим карточкиы
   */
  render(task, mode) {
    /** Старый компонент карточки задачи */
    const oldTaskComponent = this._taskComponent;
    /** Старый компонент карточки редактирования задачи */
    const oldEditTaskComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._onDataChange(this, task, data);
    });
    this._taskEditComponent.setDeleteButtonClockHandler(() => this._onDataChange(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldEditTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldEditTaskComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskComponent && oldEditTaskComponent) {
          remove(oldTaskComponent);
          remove(oldEditTaskComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  /** Метод, который описывает, как задача будет реагировать на изменение (возвращает карточку в исходное сотояние)*/
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  /** Метод, который визуально удаляет все контроллеры задач */
  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  /** Приватный метод для замены карточки задачи на карточку редактирования */
  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  /** Приватный метод для замены карточки редактирования на карточку задачи */
  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  /**
   * Приватный метод - обработчик события нажатия на кнопку Esc
   * @param {*} evt
   */
  _onEscKeyDown(evt) {
    /** Флаг: Нажата кнопка Esc? */
    const isEscKey = evt.key === `Esc` || evt.key === `Escape`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
