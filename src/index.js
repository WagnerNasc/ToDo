const express = require('express');
// const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

// app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username );

  if(!user) {
    return response.status(400).json({error: "Username not found!"})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  userAlreadyExists = users.some((user) => {
    return user.username === username;
  })

  if (userAlreadyExists) {
    return response.status(400).json({error: "User Already exists!"})
  }

  users.push({ 
    id: uuidv4(),
    name: name, 
    username: username, 
    todos: []
  });

  return response.status(201).json({message: "User Created!"});
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline }  = request.body;

  const todo = { 
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date() 
  }

  user.todos.push(todo);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;
  const { title, deadline }  = request.body;

  const todos = user.todos.map(todo => {
    if(id === todo.id) {
      todo.title = title;
      todo.deadline = deadline;
    }
  })

  console.log(todos)

  response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos.map(todo => {
    if(id === todo.id) {
      todo.done ? todo.done = false : todo.done = true;
    }
  })

  return response.status(201).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todosIndex = user.todos.findIndex((todo) => todo.id === id)

  if (todosIndex < 0) {
    return response.status(400).json({ error: "ToDo Not found" });
  }

  user.todos.splice(todosIndex, 1);

  return response.status(200).json({ message: `ToDo ${id} deleted`});
});

app.listen(3332);