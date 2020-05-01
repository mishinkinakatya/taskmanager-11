/* eslint-disable valid-jsdoc */
import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  NEW_TASK: `control__new-task`,
  STATISTIC: `control__statistic`,
  TASKS: `control__task`,
};

const createSiteMenuTemplate = () =>
  `<section class="control__btn-wrap">
    <input
      type="radio"
      name="control"
      id="control__new-task"
      class="control__input visually-hidden"
    />
    <label for="control__new-task" class="control__label control__label--new-task"
    >+ ADD NEW TASK</label
    >
    <input
      type="radio"
      name="control"
      id="control__task"
      class="control__input visually-hidden"
      checked
    />
    <label for="control__task" class="control__label">TASKS</label>
    <input
      type="radio"
      name="control"
      id="control__statistic"
      class="control__input visually-hidden"
    />
    <label for="control__statistic" class="control__label"
    >STATISTICS</label
    >
  </section>`;

/** Компонент: Меню */
export default class SiteMenu extends AbstractComponent {
  /** Метод, который возвращает разметку строки Меню */
  getTemplate() {
    return createSiteMenuTemplate();
  }

  /**
   * Метод, который делает пункт меню активным
   * @param {String} menuItem id пункта меню
   */
  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`#${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }

  /**
   * Метод, который устанавливает обработчик на изменение выбранного пункта меню
   * @param {*} handler Колбэк, который будет выполнен на выбранном пункте меню
   */
  setOnChange(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const menuItem = evt.target.id;

      handler(menuItem);
    });
  }
}
