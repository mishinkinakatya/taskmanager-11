/* eslint-disable valid-jsdoc */
import AbstractSmartComponent from "./abstract-smart-component.js";
import {COLORS, DAYS, MONTH_NAMES} from "../const.js";
import {formatTime, isRepeating, isOverdueDate} from "../utils/common.js";

const MIN_DESCRIPTION_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 140;

/**
 * Функция, которая проверяет, что длина description удолетворяет формату
 * @param {String} description description задачи
 */
const isAllowableDescriptionLength = (description) => {
  const length = description.length;

  return length >= MIN_DESCRIPTION_LENGTH && length < MAX_DESCRIPTION_LENGTH;
};

/**
 * Функция для созданя разметки блока с цветами
 * @param {Array} colors Массив доступных цветов
 * @param {String} currentColor Выбранный цвет
 */
const createColorsMarkup = (colors, currentColor) => {

  return colors.map((color, index) => {
    return (
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${currentColor === color ? `checked` : ``}
      />
      <label
        for="color-${color}--${index}"
        class="card__color card__color--${color}"
      >${color}</label
      >`
    );
  }).join(`\n`);
};

/**
 * Функция для создания разметки блока с днями недели
 * @param {Array} days Массив с днями недели
 * @param {*} repeatingDays Массив с днями, по которым задача повторяется
 */
const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    /** Флаг: День является повторяющимся? */
    const isChecked = repeatingDays[day];
    return (
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${isChecked ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}"
      >${day}</label
      >`
    );
  }).join(`\n`);
};

/**
 * Функция для создания разметки карточки редактирования
 * @param {*} task Объект, содержащий свойства карточки одной задачи
 * @param {*} options Опции карточки, которые влияют на перерисовку карточки
 */
const createTaskEditTemplate = (task, options = {}) => {
  const {dueDate} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays, activeColor, currenDescription: description} = options;

  /** Флаг: Срок задачи истек? */
  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, Date.now());
  /** Флаг: Кнопку Save блокировать? */
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays)) || !isAllowableDescriptionLength(description);

  /** Дата выполнения задачи */
  const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  /** Время выполнения задачи */
  const time = (isDateShowing && dueDate) ? formatTime(dueDate) : ``;

  /** Если задача повторяющаяся - добавляет в разметку соответствующий класс  */
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  /** Если срок задачи истек - добавляет в разметку соответствующий класс  */
  const deadlineClass = isExpired ? `card--deadline` : ``;

  /** Разметка блока с цветами */
  const colorsMarkup = createColorsMarkup(COLORS, activeColor);
  /** Разметка блока с днями недели */
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);

  return (
    `<article class="card card--edit card--${activeColor} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>
                ${isDateShowing ?
      `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${date} ${time}"
                    />
                  </label>
                </fieldset>`
      : ``}
                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>
                ${isRepeatingTask ?
      `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>`
      : ``}
              </div>


            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>
        </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

/**
 * Метод, который из разметки собирает данные и возвращает объект со свойствами карточки
 * @param {*} formData разметка одной карточки
 */
const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);

  return {
    description: formData.get(`text`),
    color: formData.get(`color`),
    dueDate: date ? new Date(date) : null,
    repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
  };
};

/** Компонент: Карточка редактирования */
export default class TaskEdit extends AbstractSmartComponent {
  /**
   * Конструктор карточки редактирования
   * @param {*} task Задача
   */
  constructor(task) {
    super();
    /** Свойство компонента: Текущая задача */
    this._task = task;
    /** Свойство компонента: Флаг: У задачи есть дедлайн? */
    this._isDateShowing = !!task.dueDate;
    /** Свойство компонента: Флаг: Задача повторяется? */
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    /** Свойство компонента: Объект, содержащий повторяющиеся дни */
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    /** Свойство компонента: Объект, содержащий текущий description */
    this._currentDescription = task.description;
    /** Свойство компонента: Цвет задачи */
    this._activeColor = task.color;
    /** Свойство компонента: Обработчик для кнопки Save */
    this._submitHandler = null;
    /** Свойство компонента: Обработчик для кнопки Delete */
    this._deleteButtonClickHandler = null;

    /** Свойство компонента: Метод для того, чтобы подписаться на кнопки Edit, Archive, Favorites */
    this._subscribeOnEvents();
  }

  /** Метод, который возвращает разметку карточки редактирования */
  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      activeColor: this._activeColor,
      currenDescription: this._currentDescription,
    });
  }

  /** Метод, который перенавешивает слушателей */
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  /** Сбросить изменения в карточке */
  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._activeColor = task.color;

    this.rerender();
  }

  /** Метод для получения данных из карточки */
  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  /**
   * Метод установки обработчика для кнопки Save
   * @param {*} handler Обработчик для кнопки Save
   */
  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  /**
   * Метод установки обработчика для кнопки Delete
   * @param {*} handler Обработчик для кнопки Delete
   */
  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  /** Приватный метод для того, чтобы подписаться на кнопки Edit, Archive, Favorites, изменение description и color */
  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;

      this.rerender();
    });

    element.querySelector(`.card__text`). addEventListener(`input`, (evt) => {
      this._currentDescription = evt.target.value;

      const saveButton = this.getElement().querySelector(`.card__save`);
      saveButton.disabled = !isAllowableDescriptionLength(this._currentDescription);
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;

      this.rerender();
    });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;

        this.rerender();
      });
    }

    element.querySelector(`.card__colors-wrap`).addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const taskColor = evt.target.innerHTML;
      if (this._activeColor === taskColor) {
        return;
      }

      this._activeColor = taskColor;

      this.rerender();
    });
  }
}
