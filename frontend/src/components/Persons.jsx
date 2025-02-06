import Person from "./Person";

const Persons = ({ persons, deletePerson }) => {
	console.log("Persons list:", persons);
	return (
		<ul>
			{persons.map((person) => (
				<li key={person._id}>
					<Person person={person} />

					<button
						onClick={() => {
							console.log("Clicked delete for ID:", person._id);
							deletePerson(person._id);
						}}
					>
						delete
					</button>
				</li>
			))}
		</ul>
	);
};

export default Persons;
