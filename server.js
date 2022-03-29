//const WebSocket =  require("ws")

//npm run devStart

const express = require("express")
const http = require("http")
const WebSocket = require("ws")

const app = express()
const server = http.createServer(app)

app.use(express.static("public"))

const wss = new WebSocket.Server({server})

//vars
let nameOfId = {}


//Functions
wss.getUniqueID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4();
};

wss.getUniqueColor = () => {
    return Math.floor(Math.random()*16777215).toString(16);
}

//connection
wss.on('connection', ws => {
    //assign id and color 
    ws.id = wss.getUniqueID()
    ws.color = wss.getUniqueColor()

    //message
    ws.on("message", payload => {
        var rPayload = JSON.parse(payload)
        var data = JSON.stringify({usr: rPayload.usr, msg: rPayload.msg, color: ws.color})
        nameOfId[ws.id] = rPayload.usr


        //broadcast exclude sender
        wss.clients.forEach(client=>{
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    })


    //close connection
    ws.on("close", ()=>{
        wss.clients.forEach(client=>{
            client.send(JSON.stringify({usr: nameOfId[ws.id], msg: `${nameOfId[ws.id]} left the party`, color: ws.color}));
        })
    })
});


server.listen(8080)