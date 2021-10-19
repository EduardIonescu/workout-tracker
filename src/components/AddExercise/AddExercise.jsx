import React, { useState, createContext } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "../Navigation";
import AddExerciseModal from "./AddExerciseModal";
import AddSets from "./AddSets";

export const ModalContext = createContext(null);
/* 
    Component made to create Exercises or redirect user to log their lift
if they select existing exercise.
*/

export default function AddExercise() {
	const [showDelete, setShowDelete] = useState(false);
	const [exercises, setExercises] = useState([]);
	const [exerciseName, setExerciseName] = useState("");
	const [exerciseToDelete, setExerciseToDelete] = useState("");
	const [selectedExercise, setSelectedExercise] = useState(null);
	const handleShowDelete = () => setShowDelete(true);

	const addSets = (nameToPass) => {
		setSelectedExercise(nameToPass);
	};

	return (
		<div>
			<Navigation />
			{/* If the user hasn't clicked on any exercise yet, stay on the 
			page where he can create exerciseName; else show him the page
			where he can log sets/reps for the selected exercise. */}
			{!selectedExercise ? (
				<div>
					<h1>harambe</h1>
					{exercises.length ? (
						exercises.map((ex) => (
							<div key={ex.id}>
								<h2>
									<span
										onClick={() => {
											addSets(ex.text);
										}}
									>
										{ex.text}{" "}
									</span>
									<span
										className="close"
										onClick={() => {
											setExerciseToDelete(ex);
											handleShowDelete();
										}}
									>
										x
									</span>
								</h2>
							</div>
						))
					) : (
						<>Add new exercises.</>
					)}
					<ModalContext.Provider
						value={{
							value: [exerciseName, setExerciseName],
							value2: [exerciseToDelete],
							value3: [exercises, setExercises],
							value4: [showDelete, setShowDelete],
						}}
					>
						<AddExerciseModal />
					</ModalContext.Provider>
				</div>
			) : (
				<AddSets selectedExercise={selectedExercise} />
			)}
		</div>
	);
}
