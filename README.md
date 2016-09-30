# Todo

## Getting started

Make sure you have node and npm installed. Refer here: [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/)

One you have node and npm, ```npm install``` to download dependencies.

To serve the app, run ``` ./serve ``` in the project directory.

The server is at ```server/index.js```. The server also serves static files out of ```client/```. Put your code there. By default the server uses port 3000, but you can override that with an environment variable like ```PORT=9090 ./run```.

The server is in-memory only — when you you restart the server, you'll lose any saved todos. The server starts with two initial todos.

## The HTTP API

The http api works with todo objects that look like this:
```{
  id: [uuid],
  text: [string],
  complete: [boolean]
}```

There are four api endpoints.

### ```GET /todos```
Returns an array of todo objects as json.

### ```POST /todos```
Takes a todo object, assigns it an id, adds it to the todo store, and returns the todo (with the assigned id) as json. If you send a todo that's missing the ```text``` field or ```completed``` field, you'll get a ```422``` response.

### ```PUT /todos/:id```
Takes a todo object, and updates the existing todo with the id from the url with the new todo object. If no todo exists with that id, you'll get a ```404``` response.

### ```DELETE /todos/:id```
Deletes the todo with the id from the url. If no todo exists with that id, you'll get a ```404``` response.

## Front-end Spec
This app is based on the TodoMVC project. You can see examples of the TodoMVC app built using different frameworks here: [http://todomvc.com/](http://todomvc.com/). Please implement the app without using a framework like React, Angular, . 

For this project, please use the example TodoMVC apps at the link above as a guide as you implement the specification below. Styling and appearance is a lower priority than behavior, but if you do have time to work on styling, you can use the css here: [https://github.com/tastejs/todomvc-app-css/blob/master/index.css](https://github.com/tastejs/todomvc-app-css/blob/master/index.css).

Specification:
  1. The app is a simple to-do list. The app uses the HTTP api defined above to retrieve and save todo items.
  2. There is an input box where a user can add a new to-do.
  3. The user can add the to-do in the input by clicking enter.
  4. To-dos are listed underneath the input box.
  5. Each to-do in the list has a button for deleting the to-do.
  6. Each to-do in the list has a button for marking it as complete.
  7. By default, the list shows both complete and incomplete to-dos. Complete to-dos are grayed out.
  8. There are buttons to filter the to-do list. One button limits the to-dos to complete to-dos, and another limits the the to-dos to incomplete to-dos.
  9. Underneath the todos, there is a count of the remaining incomplete todos.
  10. There is a button that deletes all the complete todos.


