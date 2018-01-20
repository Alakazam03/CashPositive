'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var http = require('http');
var Promise = require("bluebird");
var request_1 = Promise.promisifyAll(require("request"));
var link ='https://5df6dda6.ngrok.io/'
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


//addvent by organiser
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
  addEvent(organiser,title,details,price,locaiton,date).then(fun=>{
    result=fun
    console.log('asasas'+result)
  })
  res.sendStatus(200);
})

//delete event by organiser
app.post('/deleteEvent',function(req,res){
  var request =req.query
  var eventName=request.eventName
  deleteEvent(eventName)
  res.sendStatus(200);
})


//event list
app.get('/eventName',function(req,res){
  var result;
  getEvent(operation).then(fun=>{
    result=JSON.stringify(func)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  })
})


//events discussion
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
  res.sendStatus(200)
})

//get sliced event list
app.get('/listNo',function(req,res){
  var result
  var listNo=req.query.no
  var eventName=req.query.eventName
  console.log(listNo+eventName)
/*  listNo(operation,listNo).then(fun=>{
    result=JSON.stringify(fun)
    res.setHeader('Content-Type', 'application/json')
    res.send(result)
  })*/
  res.sendStatus(200)
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

function addEvent(organiser,title,details,price,locaiton,date){
        var dict={}
        dict['organiser']=organisr
        dict['title']=title
        dict['details']=details
        dict['price']=price
        dict['location']=location
        dict['date']=date
        dict=JSON.stringify(dict)

        var operation=link+'addevents/' + dict
        console.log(redisCall(operation))
        return redisCall(operation)


   }

//to delete an event
function deleteEvent(eventName){
  operation=link+'/deleteEvent'+eventName
  return redisCall(operation)
}

//return list of all events
function eventName(){
  operation=link+'/eventName'
  return redisCall(operaiton)
}

//get details of event with comments
function geteventDisc(eventName){
  operation=link+'/eventName'+eventName
  return redisCall(operation)
}

//post comment on some event
function postComments(eventName,comment){
  var dict={}
  dict[eventName]=comment
  dict=JSON.stringify(dict)
  operation=link+'/postComments'+dict
  return redisCall(operation)
}

//filtered list of events based on title,organiser
function getList(listSpec){
  operation=link+ '/getList'+listSpec
  return redisCall(operation)
}

//return n top events
function listNo(listNo){
  operation=link+'/listNo'+listNo
}

//login, return passowrd from redis
function login(userName){
  operation=link+'/login'+userName
  return redisCall(operaiton)
}

//add new user
function addUser(userName,password){
  operation=link+'/addUser'+userName
  return redisCall(operation)
}


function redisCall(operation){
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
