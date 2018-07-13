var express = require('express');
var app = express();

const listen_port = 9001

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Let's keep the key of interest constant for now
// Generally probably would be a parameter of some sort
const key_of_interest = "Nm"

// Recursively traverse object, collect data of given key
function TraverseJSONAndFindValues(JsonObject, vals, key) 
{
    for (var JsonKey in JsonObject) 
    {
        if(key === JsonKey)
        {
            vals.push(JsonObject[JsonKey])
        }
        if (JsonObject[JsonKey] !== null && typeof(JsonObject[JsonKey]) == "object" ) 
        {
            TraverseJSONAndFindValues(JsonObject[JsonKey], vals, key);
        }
    }
}

// Is this how it's conventionally done? On one hand, convention says 
// GET is supposed to fetch data from a specific 
// server location and that's it, some testing tools don't even
// allow you to include a body with your GET request
app.get('/', 
function (req, res) 
{
    res.send('Greetings, stranger. POST your JSON here to get the answer you seek!');
});

// On the other hand, POST is supposed to insert new data, 
// changing the state of the server, whereas we simply throw a question
// at it and get a response
app.post('/', 
function(req, res)
{
    var req_body = req.body
    var found_vals = []

    // Find all values with relevant key in the object
    TraverseJSONAndFindValues(req_body, found_vals, key_of_interest)
    
    // When POST is used conventionally to insert data, the status is 201 Created
    // We create nothing server-side, and simply say 200 OK
    res.status = 200
    // Return array of values under key "result"
    res.send({"result" : found_vals})
});

app.use(function(err, req, res, next) 
{
    // If JSON is malformed or corrupt, we give error code Bad Request and
    // a message.
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err) 
    {
        res.status(400).send({"Error": "Incoming JSON appears to be corrupt"})
    }
});

app.listen(listen_port, function () 
{
    console.log('We are live on port ' + listen_port + '.');
});