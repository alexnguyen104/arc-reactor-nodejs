const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const http = require("http")
const server = http.createServer(app)

const {Server} = require("socket.io")

const io = new Server(server, {
    ccors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
    },
    allowEIO3: true,
})

let port = process.env.PORT || 6969


var webapp_nsp = io.of('/webapp')
var esp_nsp = io.of('/esp')	


app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

io.on("connection", (socket) => {
    console.log("socket connected")

    socket.emit('event', { message: 'Connected !!!!' });

//    socket.on("hello", (data) => {
//      console.log(data)
//    })

    //Khi webapp socket bị mất kết nối
	socket.on('disconnect', function() {
		console.log("Disconnect socket webapp")
	})
	
    socket.on("color-change", data => {
        console.log(data);
	io.emit('color-set', data);
    })

    socket.on("brightness-change", data => {
        console.log(data);
	io.emit("brightness-set", data);
    })

    socket.on("power-change", data => {
        console.log(data);
	io.emit("power-set", data);
        
    })
})


server.listen(port, () => {
    console.log("the server is listening at port " + port + " http://localhost:" + port)
})
