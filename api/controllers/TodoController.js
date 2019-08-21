/**
 * TodoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  homepage: async function (req, res, next) {
    Todo.find({}).then(todos => {
      res.view("pages/homepage", { todos: todos });
    });
  },

  create: async function (req, res, next) {
    let newTodo = req.body;
    newTodo.completed = false;

    sails.log("newTodo", newTodo);

    //in order to create, must have a todo
    if (newTodo.todo == "" || newTodo.todo === undefined) {
      res.redirect("/");
    } else {
      Todo.create(newTodo).then(() => {
        res.redirect("/");
      });
    }
  },

  updateTodo: async function (req, res, next) {

    sails.log.silly('updateTodo', req.body)
    let toggle = false; //if single or all
    let query = {};

    if (req.params.id) {
      query.id = req.params.id;
      toggle = true; //if updating one
    }

    //complete all or undo complete all
    if(req.query.amount == 'all')
    {
      toggle = true;
    }

    sails.log('req.query', req.query)
    if (req.query.completed == "true") {
      req.body.completed = true;
    } else if (req.query.completed == "false") {
      req.body.completed = false;
    }
    else {
      //error - not setting
      toggle = false;
    }

    if ((!toggle) && (req.body.todo == "" || req.body.todo === undefined)) {
      res.redirect("/");
    } else {

      Todo.update(query, req.body).then(() => {
        //this route pulls the todoList
        res.redirect("/");
      });

    }
  },

  deleteTodo: async function (req, res, next) {

    let query = {};
    if (req.params.id) {
      sails.log("destroying", req.params.id);
      query.id = req.params.id;
    }

    if (req.query.completed == "true") {
      query.completed = true;
    }

    Todo.destroy(query).then(() => {
      //this route pulls the todoList
      res.redirect("/");
    });
  }
};
