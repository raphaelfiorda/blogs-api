const express = require('express');
require('express-async-errors');
const authRouter = require('./routes/authRouter');

// ...

const app = express();

app.use(express.json());

app.use('/login', authRouter);

app.use((err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
    case 'ValidationError':
      res.status(400).json({ message }); break;
    default: res.status(500).json({ message });
  }
});

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
