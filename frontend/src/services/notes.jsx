import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;
const getAll = () => {
	const request = axios.get(`${baseUrl}`);
	return request.then((response) => response.data);
};

const create = (newObject) => {
	const request = axios.post(`${baseUrl}`, newObject);

	return request.then((response) => response.data);
};

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject);
	return request.then((response) => response.data);
};

const deletePerson = (id) => {
	// console.log("hahahaha", id);
	const request = axios.delete(`${baseUrl}/${id}`);
	return request
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			throw error;
		});
};

export default { getAll, create, update, deletePerson };
