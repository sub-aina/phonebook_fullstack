const PersonsForm = ({
	addPerson,
	newName,
	setNewName,
	newNumber,
	setNewNumber,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div>
				Name:{" "}
				<input value={newName} onChange={(e) => setNewName(e.target.value)} />
				<br></br>
			</div>
			<div>
				Number:{" "}
				<input
					value={newNumber}
					onChange={(e) => setNewNumber(e.target.value)}
				/>
			</div>
			<div>
				<button type="submit">Add</button>
			</div>
		</form>
	);
};

export default PersonsForm;
