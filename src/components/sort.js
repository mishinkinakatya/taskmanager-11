/* eslint-disable valid-jsdoc */
import AbstractComponent from "./abstract-component.js";

/** Тип сортировки */
export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

/** Функция для создания разметки блока с сортировкой */
const createSortTemplate = () =>
  `<div class="board__filter-list">
    <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
    <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
  </div>`;

/** Контроллер для отрисовки блока с сортировкой */
export default class Sort extends AbstractComponent {
  constructor() {
    super();

    /** Свойство контроллера: Текущий тип сортировки */
    this._currentSortType = SortType.DEFAULT;
  }

  /** Метод, который возвращает разметку блока с сортировкой */
  getTemplate() {
    return createSortTemplate();
  }

  /** Метод, который возвращает тип сортировки */
  getSortType() {
    return this._currentSortType;
  }

  /**
   * Метод для установки обработчика событий на клик по типу сортировки
   * @param {*} handler Функция, которая будет вызвана при изменении типа сортировки
   */
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });

  }
}
