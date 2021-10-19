import React, { useEffect, useState, useContext } from "react";
import { CredentialsContext } from "../../App";

export default function ExerciseHistory({ selectedExercise }) {
	const [history, setHistory] = useState();
	const [loading, setLoading] = useState(true);

	const [credentials] = useContext(CredentialsContext);

	useEffect(() => {
		const fetchHistory = async () => {
			await fetch(`http://localhost:4000/exercises/`, {
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
				.then((exercise) => setHistory(exercise[0].history));
		};
		fetchHistory();
		setLoading(false);
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			{loading ? (
				<>Loading...</>
			) : !history || history.length === 0 ? (
				<>You have no exercise history for this exercise.</>
			) : (
				<DisplayHistory history={history} />
			)}
		</div>
	);
}

function DisplayHistory({ history }) {
	const dateFormat = (date) => {
		const options = {
			weekday: "long",
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return new Date(date).toLocaleDateString("en-GB", options);
	};

	// Sorts the dates to show the most recent first.
	const sortByDate = (date_1, date_2) => {
		return new Date(date_2.date) - new Date(date_1.date);
	};

	const deleteSet = (id) => {
		console.log(id);
	};

	return (
		<div>
			{history.sort(sortByDate).map((entry) => {
				return (
					<div key={entry._id}>
						<h3>
							{dateFormat(entry.date)}{" "}
							<span onClick={() => deleteSet(entry._id)}>X</span>
						</h3>
						<ul>
							{entry.sets.map((set, index) => {
								return (
									<li key={index}>
										<span>SET {index}:</span> {set.reps}{" "}
										reps @ {set.weight} kg
									</li>
								);
							})}
							<li>
								<span>NOTES:</span> {entry.note}
							</li>
						</ul>
					</div>
				);
			})}
		</div>
	);
}
