import AbstractComponent from "./abstract-component.js";

export default class AbstractSmartComponent extends AbstractComponent {
  /** Метод, который восстанавливает слушателей */
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  /** Метод, который заменяет старый элемент на новый и навешивает на него обработчики */
  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
