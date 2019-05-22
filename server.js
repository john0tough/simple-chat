var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { dbName, dbPass, port } = require('./envConfig');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dbUrl = `mongodb+srv://${dbName}:${dbPass}@cluster0-e5mtg.gcp.mongodb.net/test?retryWrites=true`;
var Message = mongoose.model('Message',{ name : String, message : String})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
})
  
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err){
            res.sendStatus(500);
        }

        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

mongoose.connect(dbUrl , (err) => {    
    console.log('mongodb connected',err);
});

io.on('connection', () =>{
    console.log('a user is connected');
});

var server = http.listen(port, () => {
    console.log('server is running on port', server.address().port);    
});