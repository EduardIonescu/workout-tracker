import React, { useEffect, useState, useContext } from "react";
import { CredentialsContext } from "../../App";
import ExerciseHistory from "./ExerciseHistory";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function AddSets({ selectedExercise }) {
	const [startDate, setStartDate] = useState(new Date());
	const [notes, setNotes] = useState("");
	const [currentSet, setCurrentSet] = useState({
		id: null,
		reps: null,
		weight: 0,
	});
	const [sets, setSets] = useState([]);
	const [completedSets, setCompletedSets] = useState("");
	const [exercise, setExercise] = useState({});

	const [historyPage, setHistoryPage] = useState(false);

	const [credentials] = useContext(CredentialsContext);

	const resetInputs = () => {
		setSets([]);
		setNotes("");
		setCurrentSet({
			id: null,
			reps: null,
			weight: 0,
		});
		document.getElementById("reps").value = "";
		document.getElementById("weight").value = "";
		document.getElementById("notes").value = "";
	};

	useEffect(() => {
		fetch(`http://localhost:4000/exercises`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${credentials.username}:${credentials.password}`,
			},
		})
			.then((response) => response.json())
			.then((exercises) =>
				exercises.filter(
					(exercise) => exercise.text === selectedExercise
				)
			)
			.then((exercise) => setExercise(exercise));
		// eslint-disable-next-line
	}, []);

	const submit = (e) => {
		e.preventDefault();

		if (sets.length !== 0) {
			const tempSets = sets.map((set) => {
				return { reps: set.reps, weight: set.weight };
			});
			const logToSend = { date: startDate, sets: tempSets, note: notes };
			fetch(`http://localhost:4000/exercises/${selectedExercise}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Basic ${credentials.username}:${credentials.password}`,
				},
				body: JSON.stringify(logToSend),
			}).then(() => {});

			resetInputs();

			alert("Set submitted successfully!");
		} else {
			alert("Add sets");
		}
	};

	const addCompletedSet = (e) => {
		e.preventDefault();
		if (currentSet.reps) {
			setSets([
				...sets,
				{
					id: sets.length,
					reps: currentSet.reps,
					weight: currentSet.weight,
				},
			]);
		} else alert("Add reps to the set.");
	};

	useEffect(() => {
		// Gets index of the item to close and compares it to the indexes of sets.
		const removeSet = (index, e) => {
			e.preventDefault();

			// Probably better to create a copy of 'sets' but this looks cleaner.
			setSets(sets.filter((set) => set.id !== index));
		};

		/* Setting an id for each set to make deleting them easier and smoother.
		 * Probably worth optimizing later.*/
		// eslint-disable-next-line
		sets.map((set, index) => {
			set.id = index;
		});
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
			<nav className="setsNavigation">
				{/*Make the navbar better later */}
				<h2>
					<span
						onClick={() => {
							setHistoryPage(false);
						}}
					>
						Add sets
					</span>{" "}
					<span
						onClick={() => {
							setHistoryPage(true);
						}}
					>
						History
					</span>
				</h2>
			</nav>
			{!historyPage ? (
				<div>
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
						<textarea
							rows="2"
							cols="30"
							id="notes"
							onChange={(e) => setNotes(e.target.value)}
						></textarea>

						{completedSets}
						<button type="submit">Submit</button>
					</form>
				</div>
			) : (
				<ExerciseHistory
					selectedExercise={selectedExercise}
				></ExerciseHistory>
			)}
		</div>
	);
}
