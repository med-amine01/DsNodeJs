const express = require('express');
require('./db/connect');

const etudiant_router = require('./routers/etudiants');

const app = express();
const port = 3000;


app.use(express.json());
app.use("/api/etudiants", etudiant_router);


app.listen(port, () => console.log(`Etudiant app listening on port ${port}!`))