const todos = [
	{
		id: 131,
		text: "Task 1",
		state: "active"
	},
	{
		id: 132,
		text: "Task 2",
		state: "active"
	},
	{
		id: 133,
		text: "Task 3",
		state: "completed"
	},
	{
		id: 134,
		text: "Task 4",
		state: "active"
	},
	{
		id: 135,
		text: "Task 5",
		state: "active"
	}
];

const ENTER_KEY = 13;

const applicationState = {
	todos,
	filter: "all" // all active completed
};

function addNewTodo(todo) {
	applicationState.todos.push(todo);
	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function toggleTodo(id) {
	applicationState.todos.forEach(todo => {
		if (todo.id === id) {
			if (todo.state === "completed") {
				todo.state = "active";
			} else {
				todo.state = "completed";
			}
		}
	});
	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function toggleAllTodos() {
	const { todos } = applicationState;
	const isUncompleted = todos.some(todo => todo.state !== "completed");

	if (isUncompleted) {
		todos.forEach(todo => (todo.state = "completed"));
	} else {
		todos.forEach(todo => (todo.state = "active"));
	}

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

function removeTodo(id) {
	const { todos } = applicationState;

	const withoutTodo = todos.filter(todo => todo.id !== Number(id));
	applicationState.todos = withoutTodo;

	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function editTodo({ id, text }) {
	const { todos } = applicationState;

	todos.forEach(todo => {
		if (todo.id === Number(id)) {
			todo.text = text;
		}
	});

	renderApp({
		applicationState,
		target: document.querySelector(".todoapp")
	});
}

function renderTodo(todo) {
	const div = document.createElement("div");
	const CLASSES_MAP = {
		active: "",
		completed: "completed"
	};
	const todoTemplate = `
    <li data-id="${todo.id}" class="${CLASSES_MAP[todo.state]}">
      <div class="view">
        <input class="toggle" type="checkbox" ${
					todo.state === "completed" ? "checked" : ""
				}>
        <label>${todo.text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Create a TodoMVC template">
    </li>
  `;

	div.innerHTML = todoTemplate;
	const todoElem = div.querySelector("li");

	// if (todo.state !== "active") {
	// 	todoElem.classList.add(CLASSES_MAP[todo.state]);
	// }

	// if (todo.state === "completed") {
	// 	todoElem.querySelector(".toggle").checked = true;
	// }

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
			const li = target.closest("li");
			const id = parseInt(li.dataset.id, 10);
			toggleTodo(id);
			return;
		}

		if (target.classList.contains("destroy")) {
			const todoId = event.target.closest("li").dataset.id;
			removeTodo(todoId);
			return;
		}

		target = target.parentNode;
	}
}

function handleBlur(event) {
	const target = event.target;
	const li = target.closest("li");
	const id = li.dataset.id;
	const currentValue = target.value;
	const label = li.querySelector("label");

	if (currentValue === "") {
		removeTodo(id);
		return;
	}

	target.style.display = "none";
	li.classList.remove("editing");
	this.removeEventListener("blur", handleBlur);

	editTodo({ id, text: currentValue });
}

function handleTodoDblClick(event) {
	const li = event.target.closest("li");
	const label = li.querySelector("label");
	const editInput = li.querySelector("input.edit");

	li.classList.add("editing");
	editInput.value = label.textContent;
	editInput.style.display = "block";
	editInput.addEventListener("blur", handleBlur);
}

function handleNewTodo(event) {
	if (event.keyCode === ENTER_KEY) {
		addNewTodo({
			text: event.target.value,
			state: "active",
			id: Date.now()
		});
		event.target.value = "";
	}
}

function handleToggleAll(event) {
	toggleAllTodos();
}

function bindEvents(applicationState) {
	const filtersList = document.querySelector(".filters");
	const clearCompletedButton = document.querySelector(".clear-completed");
	const todoList = document.querySelector(".todo-list");
	const input = document.querySelector(".new-todo");
	const toggleAllButton = document.querySelector(".toggle-all");

	filtersList.addEventListener("click", handleFilterClick);
	todoList.addEventListener("dblclick", handleTodoDblClick);
	clearCompletedButton.addEventListener("click", handleClearClick);
	todoList.addEventListener("click", handleTodosClick);
	input.addEventListener("keyup", handleNewTodo);
	toggleAllButton.addEventListener("click", handleToggleAll);
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
