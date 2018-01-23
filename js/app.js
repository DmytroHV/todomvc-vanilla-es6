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
		state: "completed"
	}
];

const applicationState = {
	todos,
	filter: "all" // active completed
};

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

function renderCounter({ target, count }) {}

function renderApp({ target, applicationState }) {
	const { todos } = applicationState;

	renderTodos({
		todos,
		target: document.querySelector(".todo-list")
	});
	renderCounter({
		target: target.querySelector(".todo-count"),
		count: todos.filter(todo => todo.state === "active").length
	});
}

renderApp({
	applicationState
});
