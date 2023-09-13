//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');
//const { ServerHeartbeatFailedEvent } = require('mongodb');
const app = express();
const _=require('lodash')

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//main().catch(err => console.log(err));

//async function main() {

//await 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Sherif:Shiko2000@cluster0.nwyzoh1.mongodb.net/todolistDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const itemsSchema = new mongoose.Schema ({
    name: String
  });
const Item= mongoose.model("Item",itemsSchema);
const item= new Item({
  name: "Welcome to your to-do list"
})
const item1= new Item({
  name: "Use CheckBox to delete stuff"
})
const item2= new Item({
  name: "Use plus at bottom to add stuff"
})
const defaultItems=[item,item1,item2];
const listSchema=new mongoose.Schema({
  name: String,
  items:[itemsSchema]
})
const List=mongoose.model("List",listSchema);
// Item.deleteMany({},function(err){
//   if(err){
//     console.log("Deletion error")
//   }
//   else{
//     console.log("Deletion success")
//   }
// })


 
app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
                  console.log(err);
                }
                else{
                  console.log("Successful Insertion");
                  //mongoose.connection.close();
                }
          })
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
    
    
    });
   


    
  })
  

//const day = date.getDate();
  
  

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  console.log(itemName)
  itemAdded= new Item({
    name: itemName
  })
  if(listName==="Today"){
    itemAdded.save();
    res.redirect("/")
  }
  else{
    List.findOne({name:listName},function(err,listfound){
      listfound.items.push(item);
      listfound.save()
      res.redirect("/"+listName)
    })
  }
 

});
app.post("/delete",function(req,res){
  const checkeditemID=req.body.checkBox;
  const listName=req.body.listName;
  if(listName=="Today"){
  Item.deleteOne({_id:checkeditemID},function(err){
    if(!err){
      console.log("Deleted Item")
      res.redirect("/")
    }
   
  })
}
else{
  List.findOneAndUpdate({name:listName},{$pull: {items:{_id:checkeditemID}}},function(err,foundList){
    if(!err){
      res.redirect("/"+listName)
    }
  })
}
})

app.get("/:customListName", function(req,res){
  const customListName=_.capitalize(req.params.customListName)
  List.findOne({name:customListName},function(err,listfound){
    if(!err){
      if(!listfound){
        //Create new list
        list=new List({
          name:customListName,
          items: defaultItems})
        list.save()
        res.redirect("/"+customListName)
        
      }
      else{
        //Show List
        
        res.render("list", {listTitle: listfound.name, newListItems: listfound.items});
    }
  
  }})

    
  
  
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
