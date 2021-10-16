import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function LogExercise() {
	const [startDate, setStartDate] = useState(new Date());
	//	const [exerciseName, setExerciseName] = useState("");

	const submit = () => {};

	const addCompletedSet = () => {};

	return (
		<div className="container">
			<h1>Log Exercise</h1>
			<form onSubmit={submit}>
				<h2>Date</h2>
				<hr className="log-exercise-hr" />
				<DatePicker
					dateFormat="dd/MM/yy"
					selected={startDate}
					onChange={(date) => setStartDate(date)}
				/>

				<h1>Exercise</h1>
				<div>
					<input
						required
						type="text"
						className="exercise-name"
						autoComplete="off"
						placeholder="Exercise"
					/>
				</div>

				<h1>Set</h1>
				<div className="sets-container">
					<input type="number" id="reps" placeholder="Reps" />
					<div>reps @</div>
					<input type="number" id="weight" placeholder="Weight" />
					<button onClick={addCompletedSet}>Add set</button>
				</div>

				{}
				<div id="completedTitle"></div>
				<div id="completedSets"></div>
			</form>
		</div>
	);
}
