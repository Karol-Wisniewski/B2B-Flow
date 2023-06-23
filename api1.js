const express = require('express');

const app = express();

app.use(express.json());

const axios = require('axios');
const API_2_BASE_URL = 'http://localhost:5001'

const auth = {
  api2ClientId: "2",
  api2ClientSecret: "Dfwt97R5f6amHx0CLv7Dm0dCAyRvnWu4",
  keycloakUrl: "http://localhost:8080",
  realmName: "b2b",
};

const createGetBackendAccessTokenRequestSearchParams = (auth) => {
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	params.append("client_id", auth.api2ClientId);
	params.append("client_secret", auth.api2ClientSecret);
	return params;
};

const getBackendAccessTokenData = async (auth) => (axios.post(
	`${auth.keycloakUrl}/realms/${auth.realmName}/protocol/openid-connect/token`,
	createGetBackendAccessTokenRequestSearchParams(auth),
).then(({data}) => (data)));

app.get('/hello', async (req, res) => {
  try {
    const {access_token: accessToken, expires_in: expiresIn} = await getBackendAccessTokenData(auth);
    // TODO: Store the token until it expires
    console.log(accessToken);
    const response = await axios.get(`${API_2_BASE_URL}/resource`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});