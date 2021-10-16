import React, { useEffect, useState } from "react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function AddSets({ selectedExercise }) {
	const [startDate, setStartDate] = useState(new Date());
	const [currentSet, setCurrentSet] = useState({
		reps: null,
		weight: 0,
	});
	const [sets, setSets] = useState([]);
	const [completedSets, setCompletedSets] = useState("");

	const submit = () => {};

	const addCompletedSet = (e) => {
		e.preventDefault();
		setSets([...sets, currentSet]);
	};

	useEffect(() => {
		// Gets index of the item to close and compares it to the indexes of sets.
		const removeSet = (index, e) => {
			e.preventDefault();

			// Probably better to create a copy of 'sets' but this looks cleaner.
			setSets(sets.filter((set) => sets.indexOf(set) !== index));
		};

		setCompletedSets(
			!sets ? (
				<></>
			) : (
				sets.map((set, index) => {
					return (
						<div key={index}>
							<span>SET {index + 1}</span>: {set.reps} Reps @{" "}
							{set.weight}
							kg{" "}
							<button
								className="deleteSet"
								onClick={(event) => {
									removeSet(index, event);
								}}
							>
								x
							</button>
						</div>
					);
				})
			)
		);
	}, [sets]);

	return (
		<div className="container">
			<h1>{selectedExercise}</h1>
			<form onSubmit={submit}>
				<h2>Date</h2>
				<hr className="log-exercise-hr" />
				<DatePicker
					dateFormat="dd/MM/yy"
					selected={startDate}
					onChange={(date) => setStartDate(date)}
				/>

				<h2>Set</h2>
				<div className="sets-container">
					<input
						type="number"
						id="reps"
						placeholder="Reps"
						onChange={(e) => {
							setCurrentSet({
								...currentSet,
								reps: e.target.value,
							});
						}}
					/>
					<div>reps @</div>
					<input
						type="number"
						id="weight"
						placeholder="Weight"
						onChange={(e) => {
							setCurrentSet({
								...currentSet,
								weight: e.target.value,
							});
						}}
					/>
					<button onClick={addCompletedSet}>Add set</button>
				</div>

				<h2>Notes</h2>
				<textarea rows="2" cols="30"></textarea>

				<div id="completedTitle"></div>
				<div id="completed-sets"></div>
				{completedSets}
			</form>
		</div>
	);
}
