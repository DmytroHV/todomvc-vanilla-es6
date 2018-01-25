const todos = [
	{
		text: "Task 1",
		state: "active"
	},
	{
		text: "Task 2",
		state: "active"
	},
	{
		text: "Task 3",
		state: "completed"
	},
	{
		text: "Task 4",
		state: "active"
	},
	{
		text: "Task 5",
		state: "active"
	}
];

const applicationState = {
	todos,
	filter: "all" // all active completed
};

function addNewTodo(text) {
	const todo = {
		text,
		state: "active"
	};
	applicationState.todos.push(todo);
	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function changeFilter(filter) {
	applicationState.filter = filter;
	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function removeCompleted() {
	const { todos } = applicationState;

	const withoutCompleted = todos.filter(todo => todo.state !== "completed");
	applicationState.todos = withoutCompleted;

	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function renderTodo(todo) {
	const div = document.createElement("div");
	const todoTemplate = `
    <li>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${todo.text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Create a TodoMVC template">
    </li>
  `;

	div.innerHTML = todoTemplate;
	const todoElem = div.querySelector("li");
	const CLASSES_MAP = {
		active: "",
		completed: "completed"
	};

	if (todo.state !== "active") {
		todoElem.classList.add(CLASSES_MAP[todo.state]);
	}

	if (todo.state === "completed") {
		todoElem.querySelector(".toggle").checked = true;
	}

	return todoElem;
}

function renderTodos({ target, todos }) {
	target.innerHTML = "";
	todos.forEach(todo => {
		target.appendChild(renderTodo(todo));
	});
}

function renderClearButton({ target, isCompletedTasks }) {
	const clearButton = target.querySelector(".clear-completed");

	if (!isCompletedTasks) {
		clearButton.style.display = "none";
	} else {
		clearButton.style.display = "block";
	}
}

function renderCounter({ target, count }) {
	target.innerHTML = "";
	const container = document.createElement("div");
	const counterTemplate = `<span><strong>${count}</strong> ${
		count === 1 ? "item" : "items"
	} left </span>`;
	container.innerHTML = counterTemplate;
	const counterElem = container.querySelector("span");

	target.appendChild(counterElem);
}

function renderFilters({ target, filter }) {
	const MAPPING = {
		all: ".all",
		active: ".active",
		completed: ".completed"
	};

	const filterElems = Array.from(target.querySelectorAll("a"));
	filterElems.forEach(elem => {
		elem.classList.remove("selected");
	});

	const currentFilter = target.querySelector(MAPPING[filter]);
	currentFilter.classList.add("selected");
}

function handleFilterClick(event) {
	event.preventDefault();
	let target = event.target;
	const { todos } = applicationState;

	while (target !== this) {
		if (target.classList.contains("all")) {
			changeFilter("all");
		}

		if (target.classList.contains("active")) {
			changeFilter("active");
		}

		if (target.classList.contains("completed")) {
			changeFilter("completed");
		}

		target = target.parentNode;
	}
}

function handleClearClick(event) {
	removeCompleted();
}

function handleTodosClick(event) {
	event.preventDefault();
	let target = event.target;

	while (target !== this) {
		if (target.classList.contains("toggle")) {
		}

		if (target.classList.contains("destroy")) {
		}

		target = target.parentNode;
	}
}

function handleNewTodo(event) {
	if (event.keyCode === 13) {
		addNewTodo(event.target.value);
		event.target.value = "";
	}
}

function bindEvents(applicationState) {
	const filtersList = document.querySelector(".filters");
	const clearCompletedButton = document.querySelector(".clear-completed");
	const todoList = document.querySelector(".todo-list");
	const input = document.querySelector(".new-todo");

	filtersList.addEventListener("click", handleFilterClick);
	clearCompletedButton.addEventListener("click", handleClearClick);
	todoList.addEventListener("click", handleTodosClick);
	input.addEventListener("keyup", handleNewTodo);
}

function renderApp({ target, applicationState }) {
	let { todos, filter } = applicationState;

	if (filter === "active") {
		todos = todos.filter(todo => todo.state === "active");
	}

	if (filter === "completed") {
		todos = todos.filter(todo => todo.state === "completed");
	}

	renderTodos({
		todos,
		target: document.querySelector(".todo-list")
	});
	renderCounter({
		target: target.querySelector(".todo-count"),
		count: todos.filter(todo => todo.state === "active").length
	});
	renderClearButton({
		target,
		isCompletedTasks: todos.some(todo => todo.state === "completed")
	});
	renderFilters({
		target: target.querySelector(".filters"),
		filter: filter
	});
}

renderApp({
	applicationState,
	target: document.querySelector(".todoapp")
});

bindEvents();
