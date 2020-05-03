/* eslint-disable valid-jsdoc */
import AbstractComponent from "./abstract-component.js";

const FILTER_ID_PREFIX = `filter__`;

/**
 * Функция для получения имени фильтра по его id
 * @param {String} id id фильтра
 */
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

/**
 * Функция для создания разметки одного фильтра
 * @param {String} filter Название фильтра
 * @param {Boolean} isChecked Флаг: Фильтр выбран?
 */
const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  const isTasksExists = count === 0 ? `disabled` : ``;
  return `<input
    type="radio"
    id="filter__${name}"
    class="filter__input visually-hidden"
    name="filter"
    ${isChecked ? `checked` : isTasksExists}
  />
  <label for="filter__${name}" class="filter__label">
    ${name} <span class="filter__${name}-count">${count}</span></label
  >`;
};

/**
 * Функция для создания разметки блока с фильтрами
 * @param {Array} filters Массив фильтров
 */
const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.isChecked)).join(`\n`);

  return `<section class="main__filter filter container">
    ${filtersMarkup}
  </section>`;
};

/** Компонент: Блок фильтров */
export default class Filter extends AbstractComponent {
  /**
   * Конструктор компонента "Блок фильтров"
   * @param {*} filters Массив фильтров
   */
  constructor(filters) {
    super();

    /** Свойство компонента: Текущий массив фильтров */
    this._filters = filters;
  }

  /** Метод, который возвращает разметку блока с фильтрами */
  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  /**
   * Метод для установки обработчика событий на клик по типу фильтра
   * @param {*} handler Функция, которая будет вызвана при изменении типа фильтра
   */
  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      handler(getFilterNameById(evt.target.id));
    });
  }
}
