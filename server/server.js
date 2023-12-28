/// library inclusions and setup of socket

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const csv = require("csv-parser")				// "Package" csv-parser
const fs = require('fs');						// "Package" fs (Filestring)

// send frontend files to client when they open the website

app.use(express.static("../public"));

/// start listening on the designated port

server.listen(3000, () => {											// start server and choose port (here: 3000)
	console.log('listening on *:3000');
});