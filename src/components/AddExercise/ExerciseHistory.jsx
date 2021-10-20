import React, { useEffect, useState, useContext } from "react";
import { CredentialsContext } from "../../App";

// clean this up
export default function ExerciseHistory({ selectedExercise }) {
	return (
		<div>
			<DisplayHistory selectedExercise={selectedExercise} />
		</div>
	);
}

function DisplayHistory({ selectedExercise }) {
	const [credentials] = useContext(CredentialsContext);
	const [history, setHistory] = useState();
	const [loading, setLoading] = useState(true);
	const [refreshDelete, setRefreshDelete] = useState(false);

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
	}, [refreshDelete]);
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

	const deleteSet = async (id) => {
		console.log("we here");
		try {
			await fetch(
				`http://localhost:4000/exercises/${selectedExercise}/delete`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Basic ${credentials.username}:${credentials.password}`,
					},
					body: JSON.stringify({ id: id, name: selectedExercise }),
				}
			);

			setRefreshDelete(!refreshDelete);
			alert("Set deleted!");
		} catch (err) {
			alert("An error occured, refresh the page.");
		}
	};

	return (
		<div>
			{loading ? (
				<>Loading...</>
			) : !history || history.length === 0 ? (
				<>You have no exercise history for this exercise.</>
			) : (
				history.sort(sortByDate).map((entry) => {
					return (
						<div key={entry._id}>
							<h3>
								{dateFormat(entry.date)}{" "}
								<span onClick={() => deleteSet(entry._id)}>
									X
								</span>
							</h3>
							<ul>
								{entry.sets.map((set, index) => {
									return (
										<li key={index}>
											<span>SET {index + 1}:</span>{" "}
											{set.reps} reps @ {set.weight} kg
										</li>
									);
								})}
								{entry.note.length > 0 ? (
									<li>
										<span>NOTES:</span> {entry.note}
									</li>
								) : (
									<></>
								)}
							</ul>
						</div>
					);
				})
			)}
		</div>
	);
}
