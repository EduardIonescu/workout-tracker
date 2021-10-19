import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import LogExercise from "./components/LogExercise";
import AddExercise from "./components/AddExercise/AddExercise";

export const CredentialsContext = React.createContext(null);

function App() {
	// Logs the user as Guest
	const credentialsState = useState({
		username: "Guest",
		password: "123456",
	});

	return (
		<div className="App">
			<CredentialsContext.Provider value={credentialsState}>
				<Router>
					<Switch>
						<Route exact path="/" component={Welcome} />

						<Route path="/register" component={Register} />

						<Route path="/login" component={Login} />

						<Route path="/create" component={LogExercise} />

						<Route path="/add" component={AddExercise} />
					</Switch>
				</Router>
			</CredentialsContext.Provider>
		</div>
	);
}

export default App;
