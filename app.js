//-----------Require Express--------------------------------------------------
const express = require("express");
const app = express();
//-----------Require Lodash--------------------------------------------------
//handle of lower and upper case text
const _ = require('lodash');

//-----------Require mongoose (Data base handler)-----------------------------
const mongoose = require('mongoose');

//-----------Require ejs (Embedded JavaScript templating)----------------------
let ejs = require("ejs");
app.set('view engine', 'ejs');

//------------Require path module (file and directory paths)------------------
const path = require('path');

//---------global const ------------------------------------------------------
const pedro = require("./date");
const getDate = require("./date");
const date = require(__dirname + "/date.js");
const newToDos2 = []
const listName = "Work";
const dateAndTime = getDate();


//---------bodyParser substitute (request and sending responses)--------------- 
app.use(express.urlencoded());

//---------create absolute path--------------- 
app.use(express.static(path.join(__dirname + '/public')));


//----------add your own db at fruitsDB-----------------
mongoose.connect('mongodb+srv://admin-pedro:michelle8266@cluster0.pgogv.mongodb.net/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//--------------Create New Schema-------------------------------------------
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'specified name please']
    },
});

const listSchema = {
    name: String,
    items: [itemsSchema]
};
//-------------Create New Mongoose Model ------------------------------------
const Item = mongoose.model('Item', itemsSchema);

const List = mongoose.model('List', listSchema);

//----------------------Using Model to create Objects------------------------
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


//---------Post request (handled incoming data)-----------------------------
app.post('/', (req, res) => {

    const itemName = req.body.toDo;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, (err, foundList) => {
            if (err) {
                console.log(err);
            } else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

//Delete data from the data base
app.post('/delete', (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove({
            _id: checkedItemId
        }, (err) => {
            if (!err) {
                console.log('Successfully deleted checked item');
            };
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkedItemId
                }
            }
        }, (err, foundList) => {
            if (!err) {
                res.redirect('/' + listName);
            }
        });
    }


});

//------------get requests -------------------------------------------------
app.get('/', (req, res) => {

    if (defaultItems === 0) {
        //----------------------Save that to database-----------
        Item.insertMany(defaultItems, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("successfully add default items to data base");
            };
        });
        res.redirect('/');
    } else {

        Item.find({}, (err, foundItems) => {
            if (err) {
                console.log(err);
            } else {

                res.render('list', {
                    ToDoList: "Today",
                    // ToDoList: dateAndTime,
                    newListItems: foundItems
                });
            };
        });
    };
});


app.get('/:customListName', (req, res) => {

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({
        name: customListName
    }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                //Show an existing list
                res.render('list', {
                    ToDoList: foundList.name,
                    newListItems: foundList.items
                });
            }
        }
    });

});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, function (res, req) {
    console.log("server started on port 3000");
});