import Person from "./Person";
const Persons = ({ persons, deletePerson }) => {
	return (
		<ul>
			{persons.map((person) => (
				<>
					<Person key={person.id} person={person} />
					<button onClick={() => deletePerson(person.id)}>delete</button>
				</>
			))}
		</ul>
	);
};
export default Persons;
