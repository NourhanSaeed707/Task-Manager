const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { redirect } = require("express/lib/response");

app.listen(3000,function(){
    console.log("listening to 3000 port");
});

//mongoose connection
mongoose.connect("mongodb://localhost:27017/todoList");
//create schema so we can build the structure of collection.
const itemSchema = {
    name:String,
};
//create a model so we can create document inside collection (todoList).
const Item = mongoose.model("Item",itemSchema);
//create instance of model.
const item = new Item();
const item1 = new Item({name: "Welcome to ITbelse"});
const item2 = new Item({name: "Like, Share and subscribe"});
const item3 = new Item({name: "Enjoy learning"});
const d = [item1,item2,item3];


//view engine so we can use ejs.
app.set("view engine","ejs");
//so we can access public folder.
app.use(express.static('public'));
//body parser that handel http request and so we can get body.
app.use(bodyParser.urlencoded( {extended: true } ));
//get the home page of todo list.
app.get('/',function (req,res){
    Item.find({}, function(err,f){
        if(f.length === 0){
            Item.insertMany(d,function(err){
                if(err)
                console.log("err: ",err);
                else
                console.log("Successfully saved to todolist");
            });
            res.redirect("/");
        }
        else{
            res.render("list",{newListItem: f});
            //console.log(f);
        }
   });
  
});
//add new todo item in todo list.
app.post('/' , function(req,res){
    const newList = req.body.newTodo;
    const item = new Item({
        name: newList
    });
    item.save();
    res.redirect("/");
});
//delete method to delete tolist.
app.post('/delete' , function(req,res){
    console.log(req.body.checkbox);
    Item.findByIdAndDelete(req.body.checkbox, function(err){
     if(!err)
        console.log("successfully deleted");
        res.redirect("/");
    });
});