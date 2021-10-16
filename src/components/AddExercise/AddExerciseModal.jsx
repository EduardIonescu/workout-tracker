import React, { useState, useContext, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

import { CredentialsContext } from "../../App";

import { ModalContext } from "./AddExercise";

export default function AddExerciseModal() {
	const [show, setShow] = useState(false);

	const [credentials] = useContext(CredentialsContext);
	const { value, value2, value3, value4 } = useContext(ModalContext);

	const [exerciseName, setExerciseName] = value;
	const [exerciseToDelete] = value2;
	const [exercises, setExercises] = value3;
	const [showDelete, setShowDelete] = value4;

	const handleClose = () => {
		setShow(false);
		setShowDelete(false);
	};
	const handleShow = () => setShow(true);

	const checkExerciseExistance = () => {
		let exerciseExists = false;
		// eslint-disable-next-line
		exercises.some((exercise) => {
			if (exerciseName.toLowerCase() === exercise.text.toLowerCase()) {
				exerciseExists = true;
			}
		});
		return exerciseExists;
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
			.then((exercises) => setExercises(exercises));
		// eslint-disable-next-line
	}, []);

	const fetchPostExercises = (newExercises) => {
		fetch("http://localhost:4000/exercises", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${credentials.username}:${credentials.password}`,
			},
			body: JSON.stringify(newExercises),
		}).then(() => {});
	};

	const addExercise = () => {
		handleClose();
		if (!exerciseName) return;

		// Checks if exerciseName already exists.
		if (checkExerciseExistance()) {
			alert(`'${exerciseName}' already exists.`);
			return;
		}

		// Save new exercise in the list.
		const newExercise = { id: uuidv4(), text: exerciseName };
		const newExercises = [...exercises, newExercise];
		setExercises(newExercises);
		setExerciseName("");

		fetchPostExercises(newExercises);
	};

	const deleteExercise = () => {
		// eslint-disable-next-line
		const newExercises = exercises.filter((exercise) => {
			if (exercise.id !== exerciseToDelete.id) {
				return exercise;
			}
		});
		setExercises(newExercises);
		fetchPostExercises(newExercises);
		handleClose();
	};

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				Add
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						Please enter a name for your new exercise.
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<label>Name: </label>
					<input
						type="text"
						onChange={(e) => setExerciseName(e.target.value)}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={addExercise}>
						Add Exercise
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showDelete} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete exercise</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to delete '{exerciseToDelete.text}'?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={deleteExercise}>
						Delete Exercise
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
