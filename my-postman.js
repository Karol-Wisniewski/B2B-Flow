const axios = require('axios');
const API_1_BASE_URL = 'http://localhost:5000'


axios.get(`${API_1_BASE_URL}/hello`).then((response) => {
	console.log(response.data);
}).catch((error) => {
	console.log(error);
})