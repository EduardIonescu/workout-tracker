import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CredentialsContext } from "../App";
import Navigation from "../components/Navigation";

export default function Welcome() {
	const [credentials, setCredentials] = useContext(CredentialsContext);
	const logout = () => {
		setCredentials(null);
	};
	return (
		<div>
			{credentials && <Navigation />}
			{credentials && <button onClick={logout}>Logout</button>}
			<h1>Welcome {credentials && credentials.username}</h1>
			{!credentials && <Link to="/register">Register</Link>}
			<br />
			{!credentials && <Link to="/login">Login</Link>}
		</div>
	);
}
