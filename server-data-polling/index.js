var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser')


var EventEmitter = require('events').EventEmitter;
var messageBus = new EventEmitter();
messageBus.setMaxListeners(100);

var server = http.createServer(app);

app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/', (req, res) => {
    res.send({name: 'Hola client'});
});

app.get('/api', (req, res) => {
    var addMessageListener = function(res){
        messageBus.once('message', function(data){
            res.json(data)
        })
    }
    addMessageListener(res)
});

app.post('/api', (req, res) => {
    console.log(req.body);
    if(req.body.age == 25) {
        messageBus.emit('message', req.body);
        res.status(200).end()
    }
    res.status(200).end()
});

server.listen(4000, ()=> {
    console.log('Servidor corriendo');
});