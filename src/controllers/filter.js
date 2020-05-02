import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getTasksByFilter} from "../utils/fillter.js";

/** Контроллер: Фильтры */
export default class FilterController {
  /**
   * Конструктор контроллера "Фильтры"
   * @param {*} container Компонент, внутри которого будет блок с фильтрами
   * @param {*} taskModel Модель задач
   */
  constructor(container, taskModel) {
    /** Свойство контроллера: Компонент, внутри которого будет блок с фильтрами */
    this._container = container;
    /** Свойство контроллера: Модель задач */
    this._taskModel = taskModel;

    /** Свойство контроллера: Активный фильтр */
    this._activeFilterType = FilterType.ALL;
    /** Свойство контроллера: Компонент "Фильтр" */
    this._filterComponent = null;

    /** Свойство контроллера: метод изменения данных и перерисовки компонентов в контексте текущего контроллера фильтров */
    this._onDataChange = this._onDataChange.bind(this);
    /** Свойство контроллера: метод который перерисовывет задачи при изменении типа фильтарции в контексте текущего контроллера фильтров */
    this._onFilterChange = this._onFilterChange.bind(this);

    /** Добавление обработчика на изменение данных */
    this._taskModel.setDataChangeHandler(this._onDataChange);
  }

  /** Метод для рендеринга отфильтрованных задач */
  render() {
    /** Элемент, внутри которого будет рендериться блок с фильтрами */
    const container = this._container;
    /** Массив всех задач. полученный из модели */
    const allTasks = this._taskModel.getTasksAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }

  }

  /**
   * Приватный метод, который перерисовывает задачи при изменении типа фильтрации
   * @param {String} filterType Тип фильтрации
   */
  _onFilterChange(filterType) {
    this._taskModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  /** Приватный метод, который изменяет данные и перерисовывает компонент */
  _onDataChange() {
    this.render();
  }
}
