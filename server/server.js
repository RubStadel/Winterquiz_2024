/// library inclusions and setup of socket
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const csv = require("csv-parser")				// "Package" csv-parser
const fs = require("fs");						// "Package" fs (Filestring)
// init csv-writer for answers.csv to log the anonymous answers with questions
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// create csv writer for the anonymous logging
const write_answers_anon = createCsvWriter({
    path: "answers.csv",
    header: [
        {id: "question", title: "QUESTION"},
        {id: "answer", title: "ANSWER"}
    ]
});
// create csv writer for the score
const write_score = createCsvWriter({
    path: "scores.csv",
    header: [
        {id: "name", title: "NAME"},
        {id: "score", title: "SCORE"}
    ]
});

let playercount = 0;	// counts the playerobjects
let playerarr = [];		// array to fill with playerobjects
// name of array is moderator because it contains all questions, answers and explanations
// id´s: question, answer0, answer1, answer2, answer3, explanation
const moderator = [];
let scores = [];		// array to fill with usernames and scores

// class, for each player one object
class Player {
    constructor(playername,IP) {
		this.playername = playername;
        this.IP = IP;
		// start the unused questions with 8 numbers 0-7
        this.unusedquestions = Array.from({length: 8}, (_, index) => index);
        this.currnum;   	// current number, refers to moderator
		this.points = 0;	// highscore points
	}
	// calculate new current number
	newcurrnum(){
        if (this.unusedquestions){
            // get random number of remaining unusedquestions array
            let randnum = Math.floor(Math.random() * this.unusedquestions.length);
            // delete the random number out of array and update array
            this.currnum = this.unusedquestions.splice(randnum, 1);
            return this.currnum;
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

	socket.on("start", (playername, IP) => {
		// fill playerarray with playerobjects
		// every playerobject has a playercount to differentiate
		playerarr[playercount] = new Player(playername, IP);
		playercount++;
		socket.emit("get_playernum", playercount);
	});

	// PC for playercount as argument
	// pc for playercount as id in object of playerarray
	socket.on("get_question", (PC) => {
		// temporary variable
		let t = playerarr[PC].newcurrnum();
		let answerarr = [        
			{a: moderator[t].answer0, n: 0},
        	{a: moderator[t].answer1, n: 1},
        	{a: moderator[t].answer2, n: 2},
        	{a: moderator[t].answer3, n: 3}
		];
		socket.emit("receive_question", 
			moderator[t].question,
			answerarr
		);
	});

	// ans(wer) must be in [0,1,2,3], 0 is the right answer
	socket.on("get_result", (PC, ans) => {
		// log anonymously
		const loganon = [{question: playerarr[PC].currnum, answer: ans}];
        
        write_answers_anon.writeRecords(loganon)       // returns a promise
        .then(() => {
            console.log("question and answer logged anonymously");
        });

		let tempbool = false;
		// if (answer==moderator[playerarr[PC].currnum].answer0){
		if (ans==0){
			playerarr[PC].points++;
			tempbool = true;
		}
		socket.emit("receive_result", 
			tempbool,
			moderator[playerarr[PC].currnum].explanation
		);
		if (!playerarr[PC].unusedquestions){
			const score_entry = [{
				name: playerarr[PC].playername, 
				score: playerarr[PC].score
			}];
        
        	csvWriter.writeRecords(score_entry)       // returns a promise
        	.then(() => {
            	console.log("score logged");
        	});
			scores = [];
			// Promise of the asynchronous file string
			let myPromise = new Promise(function(myResolve) {
				fs.createReadStream("scores.csv")
				.pipe(csv({separator: ","}))

				// This will push the object row into the array
				.on("data", function (row) {scores.push(row)})

				.on("end", function () {
					myResolve();
				});
			});
		}
	});
	myPromise.then(
		function() {
			socket.emit("receive_scores", scores);
		},
	);
});


/// start listening on the designated port
server.listen(3000, () => {											// start server and choose port (here: 3000)
	console.log("listening on *:3000");
});