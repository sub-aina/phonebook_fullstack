import { useEffect, useState } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import SearchFilter from "./components/SearchFilter";
import PersonForm from "./components/PersonsForm";
import noteService from "./services/notes";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilters] = useState("");

	useEffect(() => {
		noteService
			.getAll()
			.then((initialNotes) => {
				console.log("Fetched data:", initialNotes);
				if (Array.isArray(initialNotes)) {
					setPersons(initialNotes);
				} else {
					setPersons([]);
				}
			})
			.catch((error) => {
				console.error("Error fetching notes:", error);
				setPersons([]);
			});
	}, []);

	const addPerson = (event) => {
		event.preventDefault();

		const existingPerson = persons.find(
			(person) =>
				person.name && person.name.toLowerCase() === newName.toLowerCase()
		);

		if (existingPerson) {
			if (
				window.confirm(
					`${newName} is already added to the phonebook. Replace the old number with the new one?`
				)
			) {
				const updatedPerson = { ...existingPerson, number: newNumber };

				noteService
					.update(existingPerson.id, updatedPerson)
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id !== existingPerson.id ? person : returnedPerson
							)
						);
						setNewName("");
						setNewNumber("");
					})
					.catch((error) => {
						alert(
							`Failed to update ${existingPerson.name}. They may have been removed from the server.`
						);
					});
			}
		} else {
			const personObject = {
				name: newName,
				number: newNumber,
				id: persons.length + 1,
			};

			noteService.create(personObject).then((returnedPerson) => {
				setPersons(persons.concat(returnedPerson));
				setNewName("");
				setNewNumber("");
			});
		}
	};

	const filteredPersons = persons.filter(
		(person) =>
			person.name && person.name.toLowerCase().includes(filter.toLowerCase())
	);

	const deleteperson = (id) => {
		const person = persons.find((person) => person.id === id);
		if (person && window.confirm(`Delete ${person.name}?`)) {
			noteService
				.deletePerson(id)
				.then(() => {
					setPersons(persons.filter((person) => person.id !== id));
				})
				.catch((error) => {
					alert(
						`The person '${person.name}' was already deleted from the server.`
					);
				});
		}
	};

	useEffect(() => {
		const shapes = [
			"shape-15",
			"shape-16",
			"shape-17",
			"shape-18",
			"shape-19",
			"shape-20",
			"shape-21",
			"shape-22",
			"shape-23",
			"shape-24",
		];

		shapes.forEach((shape) => {
			const div = document.createElement("div");
			div.className = shape;
			document.body.appendChild(div);
		});

		return () => {
			shapes.forEach((shape) => {
				const div = document.querySelector(`.${shape}`);
				if (div) div.remove();
			});
		};
	}, []);

	return (
		<div>
			<h2>Phonebook</h2>

			<SearchFilter value={filter} setFilters={setFilters} />

			<h2>Add new person </h2>
			<PersonForm
				addPerson={addPerson}
				newName={newName}
				setNewName={setNewName}
				newNumber={newNumber}
				setNewNumber={setNewNumber}
			/>
			<h2>Info</h2>

			<Persons persons={filteredPersons} deletePerson={deleteperson} />
		</div>
	);
};

export default App;
