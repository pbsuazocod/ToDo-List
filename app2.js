const express = require("express");
const mongoose = require('mongoose');
const app = express();
let ejs = require("ejs");
const path = require('path');
const pedro = require("./date");
const getDate = require("./date");
const date = require(__dirname + "/date.js");
// const newToDos = []
const newToDos2 = []
const listName = "Work";
const dateAndTime = getDate();

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname + '/public')));


//----------add your own db at fruitsDB-----------------
mongoose.connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



//--------------Create New Schema------------------------
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'specified name please']
    },
});

//-------------Create New Mongoose Model ---------------
const Item = mongoose.model('Item', itemsSchema);

//----------------------Using MOdel to create Objects------------------------
const item1 = new Item({
    name: "Clean the room"
});

const item2 = new Item({
    name: "do the homework"
});

const item3 = new Item({
    name: "play some games"
});

const defaultItems = [item1, item2, item3];

app.set('view engine', 'ejs');

app.post('/', (req, res) => {

    const itemName = req.body.toDo;
    console.log(itemName);

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");
    // if (req.body.button === listName) {
    //     newToDos2.push(newToDo);
    //     res.redirect("/work");

    // } else {

    //     newToDos.push(newToDo);
    //     res.redirect('/');
    // }
});


app.post('/delete', (req, res) => {
    console.log(req.body.checkbox);

});


app.get('/', (req, res) => {

    if (defaultItems === 0) {
        //----------------------Save that to database-----------
        Item.insertMany(defaultItems, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("succesfully add default items to data base");
            };
        });
        res.redirect('/');
    } else {

        Item.find({}, (err, foundItems) => {
            if (err) {
                console.log(err);
            } else {

                res.render('list', {
                    ToDoList: dateAndTime,
                    newListItems: foundItems
                });
            };
        });
    };
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