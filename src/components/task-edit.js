/* eslint-disable valid-jsdoc */
import AbstractSmartComponent from "./abstract-smart-component.js";
import {COLORS, DAYS, MONTH_NAMES} from "../const.js";
import {formatTime} from "../utils/common.js";

/**
 * Флаг: Выбран хотя бы один день для повторения?
 * @param {Array} repeatingDays Массив дней
 */
const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
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
  const {description, dueDate} = task;
  const {isDateShowing, isRepeatingTask, activeRepeatingDays, activeColor} = options;

  /** Флаг: Срок задачи истек? */
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  /** Флаг: Кнопку Save блокировать? */
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));

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
    /** Свойство компонента: Цвет задачи */
    this._activeColor = task.color;
    /** Свойство компонента: Обработчик для кнопки Save */
    this._submitHandler = null;

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
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
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

  /**
   * Метод установки обработчика для кнопки Save
   * @param {*} handler Обработчик для кнопки Save
   */
  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  /** Приватный метод для того, чтобы подписаться на кнопки Edit, Archive, Favorites */
  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;

      this.rerender();
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
