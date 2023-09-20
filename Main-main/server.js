const express = require('express');
const app = express();
const routes = require('./routes/routes');
require('dotenv').config('.env');

app.use(express.static('public'));
app.use(express.json());
app.use(routes);

const port = process.env.AA_PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
