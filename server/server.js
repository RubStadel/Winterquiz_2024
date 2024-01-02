/// library inclusions and setup of socket
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const csv = require("csv-parser")				// Package csv-parser
const fs = require("fs");						// Package fs (Filestring)


// init csv-writer to log into csv
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// create csv writer for the anonymous logging
const writeAnswersAnon = createCsvWriter({
    path: "answers.csv",
    header: [
        {id: "question", title: "QUESTION"},
        {id: "answer", title: "ANSWER"}
    ]
});

// create csv writer for the score
const writeScore = createCsvWriter({
    path: "scores.csv",
    header: [
        {id: "name", title: "NAME"},
        {id: "score", title: "SCORE"}
    ]
});

let playerCount = 0;	// counts the playerobjects
let playerArr = [];		// array to fill with playerobjects
// name of array is moderator because it contains all questions, answers and explanations
// id´s: question, answer0, answer1, answer2, answer3, explanation
const moderator = [];
let scores = [];		// array to fill with usernames and scores
// array to keep track of used IPs
// name? usedIParr, usedIpArr?
const usedIPs = [];

// class, for each player one object
class Player {
    constructor(playerName, IP) {
		this.playerName = playerName;
        this.IP = IP;
		// start the unused questions with 8 numbers 0-7
        this.unusedQuestions = Array.from({length: 8}, (_, index) => index);
        this.currNum;   	// current number, refers to moderator
		this.points = 0;	// highscore points
	}
	// calculate new current number
	newCurrNum(){
        if (this.unusedQuestions){
            // get random number of remaining unusedQuestions array
            let randNum = Math.floor(Math.random() * this.unusedQuestions.length);
            // delete the random number out of array and update array
            this.currNum = this.unusedQuestions.splice(randNum, 1);
            return this.currNum;
        }
        else return 8;	// 8 is impossible to get as a current number (0-7)
    }
}

// read the csv and fill moderator (fs is always async)
fs.createReadStream("moderator.csv")
	.pipe(csv({separator: ";"}))

	// This will push the object row into the array
	.on("data", function (row) {moderator.push(row)})

	.on("end", function () {console.log("moderator full")});



// send frontend files to client when they open the website
app.use(express.static("../public"));

/// eventHandlers that are active as long as a client is connected
io.on("connection", (socket) => {

	socket.on("start", (playerName, IP) => {
		// fill playerArray with playerobjects
		// every playerobject has a playerCount to differentiate
		if (!usedIPs.includes(IP)){
			playerArr[playerCount] = new Player(playerName, IP);
			socket.emit("receive_playernum", playerCount);
			usedIPs[playerCount] = IP;
			playerCount++;
		}
		else {
			// if IP of object exists, find index in playerArr
			// because index equals value of playerArr, the index is enough
			const searchIP = (obj) => obj.IP == IP;
			socket.emit("receive_playernum", playerArr.findIndex(searchIP))
		}
	});

	// PC for playerCount as argument
	// pc for playerCount as id in object of playerArray
	socket.on("get_question", (PC) => {
		// temporary variable
		let t = playerArr[PC].newCurrNum();
		if (t!=8){
			let answerArr = [        
				moderator[t].answer0,
				moderator[t].answer1,
				moderator[t].answer2,
				moderator[t].answer3
			];
			socket.emit("receive_question", 
				moderator[t].question,
				answerArr
			);
		}
		else{
			socket.emit("receive_question", 
				0,
				0
			);
		};
	});

	// ans(wer) must be in [0,1,2,3], 0 is the right answer
	socket.on("get_result", (PC, ans) => {
		// log anonymously
		const logAnon = [{question: playerArr[PC].currNum, answer: ans}];
        
        writeAnswersAnon.writeRecords(logAnon)       // returns a promise
        .then(() => {
            console.log("question and answer logged anonymously");
        });

		let tempBool = false;
		if (ans == 0){
			playerArr[PC].points++;
			tempBool = true;
		}
		socket.emit("receive_result", 
			tempBool,
			moderator[playerArr[PC].currNum].explanation
		);
		if (!playerArr[PC].unusedQuestions){
			updateScore();
		}
	});
	
});
function updateScore(){
	const score_entry = [{
		name: playerArr[PC].playerName, 
		score: playerArr[PC].score
	}];

	let updatePromise = new Promise(function(myResolve) {
		csvWriter.writeRecords(score_entry)       // returns a promise
		.pipe(csv({separator: ","}))

		// This will push the object row into the array
		.on("data", function (row) {scores.push(row)})

		.on("end", function () {
			myResolve();
		});
	})
};
updatePromise.then(
	function() {
		console.log("score.csv updated");
	},
);

function loadScore(){
	// Promise of the asynchronous file string
	scores = [];
	let loadPromise = new Promise(function(myResolve) {
		fs.createReadStream("scores.csv")
		.pipe(csv({separator: ","}))

		// This will push the object row into the array
		.on("data", function (row) {scores.push(row)})

		.on("end", function () {
			myResolve();
		});
	})
};
loadPromise.then(
	function() {
		socket.emit("receive_scores", scores);
	},
);


/// start listening on the designated port
server.listen(3000, () => {											// start server and choose port (here: 3000)
	console.log("listening on *:3000");
});