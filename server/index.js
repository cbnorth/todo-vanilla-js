var express = require('express');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());
app.use("/", express.static('./client'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, application/json,");
  //res.header('Content-Type', 'application/json');
  next();
});

function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

var Todos = [
  {
    id: uid(),
    complete: true,
    text: 'Create Todo app API'
  },
  {
    id: uid(),
    complete: true,
    text:'There is an input box where a user can add a new to-do'
  },

  {
    id: uid(),
    complete: true,
    text:'The user can add the to-do in the input by clicking enter'
  },
  {
    id: uid(),
    complete: true,
    text:'To-dos are listed underneath the input box'
  },
  {
    id: uid(),
    complete: true,
    text:'Each to-do in the list has a button for deleting the to-do'
  },
  {
    id: uid(),
    complete: true,
    text:'Each to-do in the list has a button for marking it as complete'
  },
  {
    id: uid(),
    complete: true,
    text:'By default, the list shows both complete and incomplete to-dos. Complete to-dos are grayed out'
  },
  {
    id: uid(),
    complete: true,
    text:'There are buttons to filter the to-do list. One button limits the to-dos to complete to-dos, and another limits the the to-dos to incomplete to-dos.'
  },
  {
    id: uid(),
    complete: true,
    text:'Underneath the todos, there is a count of the remaining incomplete todos.'
  },
  {
    id: uid(),
    complete: true,
    text:'There is a button that deletes all the complete todos.'
  },
  {
    id: uid(),
    complete: false,
    text:'talk about next steps'
  }
];

function todoIndex(id) {
  return Todos.map(function(todo) { return todo.id; }).indexOf(id);
}

function isValid(todo) {
  return todo.complete != undefined && todo.text != undefined;
}

function DeleteTodo(id) {
  var index = todoIndex(id);
  if (index === -1) {
    return false;
  }
  else {
    Todos.splice(index, 1);
    return true;
  }
}

function ReplaceTodo(id, new_values) {
  console.log('replacing ' + id + ' with ' + JSON.stringify(new_values));

  for (i=0; i<= Todos.length; i++) {
    if (Todos[i].id === id && Todos[i].complete) {
      Todos[i].complete = false;
      return true;
    } else if (Todos[i].id === id && !Todos[i].complete) {
      Todos[i].complete = true;
      return true;
    }
  }
};

function AddTodo(todo) {
  todo.id = uid();
  Todos.push(todo);
}


app.get('/todos', function(req, res) {
  res.status(200).send(JSON.stringify(Todos)); 
});

app.post('/todos', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var todo = req.body;
  //res.send(req.body);
  if (!isValid(todo)) {
    res.status(422).send(JSON.stringify({
      message: 'invalid todo'
    }));
  }
  else {
    var addedTodo = AddTodo(todo);
    res.status(200).send(JSON.stringify(todo));
  }
});


app.put('/todos/:id', function(req, res) {
  var id = req.params.id;
  var newValues = req.body;
  var successfullyReplaced = ReplaceTodo(id, newValues);
  if (successfullyReplaced) {
    newValues.id = id;
    res.status(200).send(JSON.stringify(newValues));
  }
  else {
    res.status(404).send(JSON.stringify({
      message: 'todo not found',
      id: id
    }));
  }
});

app.delete('/todos/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  var successfullyDeleted = DeleteTodo(id);
  if (successfullyDeleted) {
    res.status(200).send(JSON.stringify({
      message: 'deleted todo',
      id: id
    }));
  }
  else {
    res.status(404).send(JSON.stringify({
      message: 'todo not found',
      id: id
    }));
  }
});

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT);
});
