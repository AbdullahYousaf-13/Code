// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const routes = require('./endpoints');

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
