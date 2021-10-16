import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { CredentialsContext } from "../App";

const handleErrors = async (response) => {
	if (!response.ok) {
		const { message } = await response.json();
		throw Error(message);
	}
	return response.json();
};

export default function Register() {
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [error, setError] = useState("");
	const [, setCredentials] = useContext(CredentialsContext);
	const history = useHistory();

	const register = (e) => {
		e.preventDefault();
		fetch("http://localhost:4000/users/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		}) //Login
			.then(handleErrors)
			.then(() => {
				setCredentials({
					username,
					password,
				});
				history.push("/");
			})
			.catch((error) => {
				setError(error.message);
			});
	};

	return (
		<div>
			<h1>Register</h1>
			{error}
			<form onSubmit={register}>
				<input
					onChange={(e) => setUsername(e.target.value)}
					placeholder="username"
					required
				/>
				<br />
				<input
					type="password"
					onChange={(e) => setPassword(e.target.value)}
					placeholder="password"
					required
				/>
				<br />
				<button type="submit">Register</button>
			</form>
		</div>
	);
}
