/* eslint-disable valid-jsdoc */
import AbstractComponent from "./abstract-component.js";
import {formatTime} from "../utils/common.js";
import {MONTH_NAMES} from "../const.js";

/**
 * Функция создания разметки кнопок Edit, Archive, Favorite на карточке
 * @param {String} name Имя кнопки
 * @param {*} isActive Флаг: Кнопка выбрана?
 */
const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
      ${name}
    </button>`
  );
};

/**
 * Функция для создания разметки карточки
 * @param {Object} task Задача
 */
const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays, isArchive} = task;

  /** Флаг: Срок задачи истек? */
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  /** Флаг: Дата показана? */
  const isDateShowing = !!dueDate;

  /** Дата выполнения задачи */
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  /** Время выполнения задачи */
  const time = isDateShowing ? formatTime(dueDate) : ``;

  /** Разметка для кнопки Edit */
  const editButton = createButtonMarkup(`edit`);
  /** Разметка для кнопки Archive */
  const archiveButton = createButtonMarkup(`archive`, !isArchive);
  // const archiveButton = createButtonMarkup(`archive`, !task.isArchive);
  /** Разметка для кнопки Favorites */
  const favoritesButton = createButtonMarkup(`favorites`, !task.isFavorite);

  /** Если задача повторяющаяся - добавляет в разметку соответствующий класс  */
  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  /** Если срок задачи истек - добавляет в разметку соответствующий класс  */
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          ${editButton}
          ${archiveButton}
          ${favoritesButton}
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${description}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`
  );
};

/** Компонент: Карточка задачи */
export default class Task extends AbstractComponent {
  /**
   * Конструктор карточки задачи
   * @param {*} task Задача
   */
  constructor(task) {
    super();

    /** Свойство компонента: Текущая задача */
    this._task = task;
  }

  /** Метод, который возвращает разметку карточки задачи */
  getTemplate() {
    return createTaskTemplate(this._task);
  }

  /**
   * Метод установки обработчика клика по кнопке Edit
   * @param {*} handler Обработчик клика по кнопке Edit
   */
  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  /**
   * Метод установки обработчика клика по кнопке Archive
   * @param {*} handler Обработчик клика по кнопке Archive
   */
  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  /**
   * Метод установки обработчика клика по кнопке Favorites
   * @param {*} handler Обработчик клика по кнопке Favotites
   */
  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }
}
