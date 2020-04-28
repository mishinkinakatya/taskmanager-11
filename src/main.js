import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import TasksModel from "./models/tasks.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";

/** Общее количество задач */
const TASK_COUNT = 22;

/** Элемент, внутри которого будет рендериться вся страница */
const siteMainElement = document.querySelector(`.main`);

/** Меню сайта */
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

/** Все задачи, которые генерируем (потом будут приходить с сервера) */
const tasks = generateTasks(TASK_COUNT);
/** Инстанс модели "Задачи" */
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

/** Все фильтры, которые генерируем (потом будут приходить с сервера) */
const filters = generateFilters();

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

/** Компонент, внутри которого будет рендериться доска (container) */
const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

/** Контроллер доски */
const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);
