import React, { useState, useContext, useEffect } from "react";
import { CredentialsContext } from "../App";
import { v4 as uuidv4 } from "uuid";

function Todos() {
	const [todos, setTodos] = useState([]);
	const [todoText, setTodoText] = useState("");
	const [filter, setFilter] = useState("uncompleted");
	const [credentials] = useContext(CredentialsContext);

	const persist = (newTodos) => {
		fetch(`http://localhost:4000/todos`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${credentials.username}:${credentials.password}`,
			},
			body: JSON.stringify(newTodos),
		}).then(() => {});
	};

	useEffect(() => {
		fetch(`http://localhost:4000/todos`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${credentials.username}:${credentials.password}`,
			},
		})
			.then((response) => response.json())
			.then((todos) => setTodos(todos));
	}, []);

	const addTodo = (e) => {
		e.preventDefault();
		if (!todoText) return;
		const newTodo = { id: uuidv4(), checked: false, text: todoText };
		const newTodos = [...todos, newTodo];
		setTodos(newTodos);
		setTodoText("");
		persist(newTodos);
	};

	const toggleTodo = (id) => {
		const newTodoList = [...todos];
		const todoItem = newTodoList.find((todo) => todo.id === id);
		todoItem.checked = !todoItem.checked;
		setTodos(newTodoList);
		persist(newTodoList);
	};

	const getTodos = () => {
		return todos.filter((todo) =>
			filter === "completed" ? todo.checked : !todo.checked
		);
	};

	const changeFilter = (newFilter) => {
		setFilter(newFilter);
	};

	return (
		<div>
			<select onChange={(e) => changeFilter(e.target.value)}>
				<option value="uncompleted">Uncompleted</option>
				<option value="completed">Completed</option>
			</select>
			{getTodos().map((todo) => (
				<div key={todo.id}>
					<input
						checked={todo.checked}
						onChange={() => toggleTodo(todo.id)}
						type="checkbox"
					/>
					<label>{todo.text}</label>
				</div>
			))}

			<br />
			<form onSubmit={addTodo}>
				<input
					value={todoText}
					type="text"
					onChange={(e) => setTodoText(e.target.value)}
				/>
				<button type="submit">Add</button>
			</form>
		</div>
	);
}

export default Todos;
