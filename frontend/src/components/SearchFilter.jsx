const SearchFilter = ({ filter, setFilters }) => {
	const handleFilterChange = (event) => {
		setFilters(event.target.value);
	};

	return (
		<div>
			Filter :<input value={filter} onChange={handleFilterChange} />
		</div>
	);
};
export default SearchFilter;
