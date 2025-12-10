import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import todos from './src/resources/todo/todo.routes.js';
import users from './src/resources/users/user.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(todos);
app.use(users)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
