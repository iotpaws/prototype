var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var io = require('socket.io')
var bodyParser = require('body-parser')
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


//Recibo POST de la rapi y se lo muestro a los clients que estén conectados
app.post('/api/status', function(req, res) {
  console.log(req.body);

  var status = {
     waterLevel: req.body.waterLevel, 
     petId: req.body.petId, 
  };

  if(status.waterLevel && status.petId){

    //TODO: implementar función de save en DB
    //saveData(m);
    
    //sent to clients the sensed water level
    broadcastData(status);

    res.json('OK');

  }
  else{
    res.json("ERROR on Data");
  }

});


function broadcastData(status, p) {
  
    var i = 0;
    //var socket = sockets[i];
    //socket.emit('waterLevel', {'waterLevel': status.waterLevel});
    io.sockets.emit('waterLevel', {'waterLevel': status.waterLevel});
}



//SERVER

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

//Manejo de socketIO
io = io.listen(server)

var sockets = []
io.sockets.on('connection', function(socket){
    console.log("connnect"); 

    sockets.push(socket);

    //some web-client disconnects
    socket.on('disconnect', function (socket) {
        console.log("disconnect");
    });
});
