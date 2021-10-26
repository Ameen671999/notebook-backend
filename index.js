const express = require('express')
const app = express();
const connectToMongo = require ('./db');
const port = 3200

app.use(express.json());

connectToMongo();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`notebook app listening at http://localhost:${port}`)
})