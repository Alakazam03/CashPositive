'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var http = require('http');
var Promise = require("bluebird");
var request_1 = Promise.promisifyAll(require("request"));
var link ='https://f8eb8da3.ngrok.io/'
var operation=''

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.post('/addEvent',function(req, res){
  var request=req.query
  var organiser= request.organiser
  var title=request.title
  var details=request.details
  var price=request.price
  var location=request.location
  var date=request.date
  operation=link+'/addEvent'
  console.log(organiser+title+details+price+location+date)
  var result
  addEvent(operation,organiser,title,details,price,location,date).then(fun=>{
    result=fun
    console.log(result)
  })
  res.sendStatus(200);
})

app.post('/deleteEvent',function(req,res){
  var request =req.query
  var eventName=request.eventName
  operation=link+'/deleteEvent'+eventName
  deleteEvent(operation)
  res.sendStatus(200);
})

app.get('/eventName',function(req,res){
  var result;
  getEvent(operation).then(fun=>{
    result=JSON.stringify(func)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  })
})

app.get('/eventDisc',function(req,res){
  var result;
  geteventDisc(operation,eventName).then(fun=>{
    result=JSON.stringify(fun)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  })
})

//post comments
app.post('/postComments',function(req,res){
  var request=req.query
  var eventName=request.eventName
  var comment=request.comment
  postComment(operation,eventName,comment)
  res.sendStatus(200);
})

//get list of events filter
app.get('/list',function(req,res){
  var result
  getList(operation,listSpec).then(fun=>{
    result=JSON.stringify(fun)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)

  })
})

//add userId
app.post('/addUser',function(req,res){
  var request=req.query
  addUser(operation,userName,password)
})

app.get('login',function(req,res){
  var request=req.query
  var userName=request.userName
  login(operation,userName).then(fun=>{
    result=JSON.stringify(fun)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  })
})
app.get('/', function(req, res){
  var result;
  var resultDictionary={}
  number_max().then(fun => {
  result = fun
  //result=JSON.stringify(result);
  console.log('r'+result)

  resu['body']=result;
  console.log(resu)
  var final=JSON.stringify(resu)
  console.log(final)
  res.setHeader('Content-Type', 'application/json');

  res.send(final);
})


})

function addEvent(organiser,title,details,price,location,date){
        var dict={}
        dict['organiser']='vaibhav'
        dict['title']='plays'
        dict['details']='tiugkbkb'
        dict['price']='70'
        dict['location']='pl'
        dict['date']='hkhjkhkjh'
        dict=JSON.stringify(dict)

        var operation=link+'addevents/' + dict
        console.log(operation)
        return request_1.getAsync({
                url:operation,
                method: 'GET'
        }).then(function(response,err){
          return response.body

        });

   }


   var server = app.listen(process.env.PORT || 3000, function () {
           console.log("Listening on port %s", server.address().port);
   });
