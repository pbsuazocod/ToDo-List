//-----------Imports--------------------------------------------------
import express from "express";
import mongoose from 'mongoose';
import _ from 'lodash'; //handle text
import ejs from 'ejs'; // Embedded JavaScrip Template
import path from 'path'; //handle path for modules
import getDate from './date.js';
import connectDB from './config/db.js' // Data base connection
import List from "./model/ListModel.js";
import Item from "./model/ItemModel.js";
import defaultItems from "./constants.js";

const app = express();
app.set('view engine', 'ejs');

//---------global const ------------------------------------------------------
const dateAndTime = getDate();

mongoose.set('useFindAndModify', false);
app.use(express.urlencoded({ //bodyParser substitute
    extended: true
}));

//---------create absolute path--------------- 
import {
    dirname
} from "path";
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + '/public')));

connectDB();

app.post('/', async (req, res) => {

    const itemName = req.body.toDo;
    const listName = req.body.list;
    const newProject = _.capitalize(req.body.newProject);
    console.log(newProject);
    console.log(listName);

    if (listName === undefined) {

        const project = new List({
            name: newProject,
            items: defaultItems
        });
        project.save();
        res.redirect('/' + newProject);
    } else {
        const item = new Item({
            name: itemName
        });

        if (listName === "To Do List") {
            item.save();
            res.redirect("/");
        } else {
            const foundList = await List.findOne({
                name: listName
            });
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        }
    }

});

app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    console.log(checkedItemId);
    const listName = req.body.listName;
    console.log(listName);

    if (listName === "To Do List") {
        await Item.findByIdAndDelete({
            _id: checkedItemId
        });

        res.redirect("/");
    } else {
        await List.findOneAndUpdate({
            name: listName,
        }, {
            $pull: {
                items: {
                    _id: checkedItemId,
                },
            },
        });
        res.redirect("/" + listName);
    }
});


app.get('/', async (req, res) => {
    const lists = await List.find({});
    // console.log(lists);

    const listOfProjects = lists.map((list) => {
        return list.name;
    });

    // console.log(listOfProjects);

    const items = await Item.find({});

    res.render('list', {
        ToDoList: "To Do List",
        dateAndTime,
        newListItems: items,
        listOfProjects
    });
});

app.get('/:customListName', async (req, res) => {

    const customListName = _.capitalize(req.params.customListName);

    let foundList = await List.findOne({
        name: customListName
    });

    if (!foundList) {
        foundList = new List({
            name: customListName,
            items: defaultItems
        });
    }
    foundList.save();

    const lists = await List.find({});
    const listOfProjects = [];
    lists.forEach((list) => {
        listOfProjects.push(list.name);
    });

    res.render('list', {
        ToDoList: foundList.name,
        newListItems: foundList.items,
        dateAndTime,
        listOfProjects
    });

});

app.get("/about", (req, res) => {
    res.render("about");
});

let port = process.env.PORT || 3000;

app.listen(port, function (res, req) {
    console.log(`server started in port ${port}`);
});