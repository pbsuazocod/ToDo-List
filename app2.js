const express = require("express");
const app = express();
let ejs = require("ejs");
const path = require('path');
const date = require(__dirname + "/date.js");
const newToDos = []
const newToDos2 = []
const listName = "Work";

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname + '/public')));


app.set('view engine', 'ejs');

const event = new Date();

const options = {
    weekday: "long",
    year: "numeric",
    month: 'long',
    day: 'numeric'
};

const dateAndTime = event.toLocaleDateString(undefined, options);
// console.log(dateAndTime);

const test = getDate();

app.post('/', (req, res) => {

    const newToDo = req.body.toDo;

    if (req.body.button === listName) {
        newToDos2.push(newToDo);
        res.redirect("/work");

    } else {

        newToDos.push(newToDo);
        res.redirect('/');
    }
});


app.get('/', (req, res) => {

    res.render('list', {
        ToDoList: date,
        newListItems: newToDos
    });
});


app.get("/work", (req, res) => {

    res.render('list', {
        ToDoList: listName,
        newListItems: newToDos2,
    });
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function (res, req) {
    console.log("server started on port 3000");
});