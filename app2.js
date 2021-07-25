const express = require("express");
const app = express();
let ejs = require("ejs");
const path = require('path');
const newToDos = []

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

const date = event.toLocaleDateString(undefined, options);
console.log(date);


app.post('/', (req, res) => {

    const newToDo = req.body.toDo;
    // console.log(newToDo);

    newToDos.push(newToDo);
    console.log(newToDos);

    res.redirect('/');
});


app.get('/', (req, res) => {

    res.render('list', {
        currentDate: date,
        newListItems: newToDos
    });
});


app.listen(3000, function (res, req) {
    console.log("server started on port 3000");
});