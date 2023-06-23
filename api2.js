const express = require('express');
const axios = require('axios');
const app = express();

const auth = {
  clientId: "2",
  clientSecret: "Dfwt97R5f6amHx0CLv7Dm0dCAyRvnWu4",
  keycloakUrl: "http://localhost:8080",
  realmName: "b2b",
};

app.get(
  '/resource',
   (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "no auth header" });
    }
    const token = authHeader.match(/Bearer (.*)/)?.[1];
    if (!token) {
      return res.status(401).json({ error: "no token" });
    }
    const params = new URLSearchParams();
    params.append("token", token);
    params.append("client_id", auth.clientId);
    params.append("client_secret", auth.clientSecret);
    console.log(
      "token",
      token,
      "verifying...",
      // introspectionEndpoint
      `${auth.keycloakUrl}/realms/${auth.realmName}/protocol/openid-connect/token/introspect`,
      params,
    );
     axios.post(
      // introspectionEndpoint
      `${auth.keycloakUrl}/realms/${auth.realmName}/protocol/openid-connect/token/introspect`,
      params,
    ).then((response) => {
    console.log("got response", response.data);
    if (!response.data.active) {
      return res.status(401).json({ error: "invalid token" });
    }
    next();
  }).catch((err) => {
    console.log("got error", err);
    return res.status(500).json({ error: "internal error" });
  });
  },
  (req, res) => {
    const resource = { message: 'This is the protected resource from the second API' };
    res.json(resource);
  }
);

app.listen(5001, () => {
  console.log('Second API started on port 5001');
});
