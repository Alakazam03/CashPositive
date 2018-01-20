from gevent import monkey; monkey.patch_all()
#import pdb; pdb.set_trace()

from bottle import route, run, response
import pandas as pd
import bottle
import commands
import operator
import json
import razorpay
import googlemaps
from datetime import datetime
import random
import requests
from pprint import pprint
app = bottle.app()

class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors
#event title, organiser , details,location,ticket price, date,comments

@app.route('/addUser/<user>/<password>')
def addUsers(user,password):
    command = "redis-cli hset Users " + user + " " + password
    if(commands.getoutput(command)):
        return "Successfully added user"
    else:
        return "Failed adding user"

@app.route('updatepassword/<user>/<newpassword>')
def updatepassword(user,newpassword):
    command = "redis-cli hset Users " + user + " " + newpassword
    if(commands.getoutput(command)):
        return "Successfully updated password"
    else:
        return "Failed updating password"

@app.route('/login/<user>/<givenpassword>')
def checklogin(user,givenpassword):
    command = "redis-cli hget Users " + user
    if(givenpassword == commands.getoutput(command)):
        return "Login Success"
    else:
        return "Login Failure"

@app.route('/addevents/<event>')
def addevent(event):
    event = json.loads(event)
    com = "redis-cli lrange events 0 -1"
    res = (commands.getoutput(com)).split('\n')
    if event["title"] not in res:
        command = "redis-cli lpush events" + " " + event["title"]
        key = "event:"+ event["title"]
        command1 = "redis-cli hmset " + key + " organiser " + event["organiser"] + " details " + event["details"].replace(" ","-") + " location " + event["location"] + " ticket-price " + event["price"] + " date " + event["date"]
        if(commands.getoutput(command) and commands.getoutput(command1)):
            return "Success"
        else:
            return "Failure"
    else:
        return "Failure"

@app.route('/deleteEvent/<event>')
def deleteEvent(event):
    command = "redis-cli hkeys event:" + event
    fields = commands.getoutput(command)
    fields = fields.split('\n')
    command = "redis-cli hdel event:" + event + " "
    for fie in fields:
        command += fie + " "
    if(commands.getoutput(command)):
        command = "redis-cli llen events"
        lis = commands.getoutput(command)
        command = "redis-cli lrem events " + str(lis) + " " + event
        if(commands.getoutput(command)):
            return "Success"
    else:
        return "Failure"

def get_hash(key):
	command = "redis-cli  "
	command = command + "HGETALL " + key
	d = commands.getoutput(command)
	result = {}
	if(d!=''):
		d = d.split('\n')
		keys = d[::2]
		result = {}
		for i in keys:
			result[i] = d[ ( d.index(i) + 1 ) ]
		return result
	else:
		return result

@app.route('/getList/<tag>/<value>')
def geteventlist(tag,value):
    command = "redis-cli lrange events 0 -1"
    events = commands.getoutput(command)
    events = events.split('\n')
    lis = []
    for eve in events:
        command = "redis-cli hget event:" + eve + " " + tag
        val = commands.getoutput(command)
        if(val == value):
            lis.append(eve)
    result = {}
    for event in lis:
        result[event] = get_hash("event:"+event)
    return result

@app.route('/getEvent')
def eventlist():
    command = "redis-cli lrange events 0 -1"
    events = commands.getoutput(command)
    events = events.split('\n')
    return json.dumps(events)

@app.route('/geteventDisc/<event>')
def getdisc(event):
    command = "redis-cli lrange " + event + ":disc:users 0 -1"
    users = commands.getoutput(command)
    users = users.split('\n')
    command = "redis-cli lrange " + event + ":disc:comment 0 -1"
    comments = commands.getoutput(command)
    comments = comments.split('\n')
    comments = [w.replace("%20"," ") for w in comments]
    result = [json.dumps(users),json.dumps(comments)]
    return result


@app.route('/postcomments/<event>/<disc>')
def postcomments(event,disc):
    disc = json.loads(disc)
    command = "redis-cli lrange events 0 -1"
    res = commands.getoutput(command)
    res = res.split('\n')
    if event not in res:
        return "Failure event not present"
    else:
        command = "redis-cli rpush " + event + ":disc:users " + disc["user"]
        if(commands.getoutput(command)):
            command = "redis-cli rpush " + event + ":disc:comment " + disc["comment"].replace(" ","%20")
            if(commands.getoutput(command)):
                return "Success"
            else:
                return "Failure"
        else:
            return "Failure"


app.install(EnableCors())
app.run(host='0.0.0.0', port=5000, debug=True,server='gevent')
