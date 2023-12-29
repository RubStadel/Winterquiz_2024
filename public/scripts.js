"use strict";
src="/socket.io/socket.io.js"; // include the socket.io library ?

var socket = io();  // starting the socket connection using socket.io library
let playername;     // username given by the player
let ip;             // some sort of IP-address of the player
var playercount;    // PlayerCount (PC) (to differentiate between players)
var currentquestion;// current question as string
var answerarr = []; // array of objects of the answers
var shuffledanswers = [];   //array of shuffled answers
var numswap = [];   // when answers are shuffled, this array keeps track
var answerstat;     // bool variable to determine right or wrong answers
var currexplanation;// string of the explanation to current question

/// functions controlling game flow

function startGame() {
    document.getElementById("landingNav").style.height = "0%";
    // get first question and its answers from server and display them
    // Pseudo: player has to enter a username and javascript has to get IP
    socket.emit("start", playername, ip);
}

socket.on("receive_playernum", (PC) => {
    // directly after assigning the PC, the command to send the question is given
    playercount = PC;
    socket.emit("get_question", playercount);
});
socket.on("receive_question", (queststr, answerarray) => {
    // question as string and answers as array is given
    // each answer in the array has a string (a) and a number (n)
    currentquestion = queststr;
    answerarr = answerarray;
    shuffleanswers();
    // display the question like: 
    // 1. answer = shuffledanswer[0], 2. answer = shuffledanswer[1] ...
});

function shuffleanswers(){
    // this function shuffles and empties the answerarr 
    // and puts it in shuffledanswers and keeps track
    // of it in numswap
    let randnums = [0,1,2,3]; // good ol´ hardcode
    let randnum;
    for (let i; i<4; i++){
        // pick a random number out of randnums
        randnum = Math.floor(Math.random() * randnums.length);
        // pluck the randnumth answers out of answerarr and put it in shuffledanswers
        shuffledanswers[i] = answerarr.splice(randnum,1);
        // keep track with the numswap array
        numswap[i] = randnum;
    }
}

function checkAnswer(ansnum) {
    // check answer
    // get a number by clicking on the available answer as ansnum (?) (number 0-3)
    socket.emit("get_result", numswap[ansnum]);
    // get and display next question
}

socket.on("receive_result", (answerstatus, explanation) => {
    // answerstatus true or false, explanation is a string
    answerstat = answerstatus;
    currexplanation = explanation;
    // now it has to be displayed
});

socket.on("receive_scores", (scores) => {
    // returns array of objects with attributes "name" and "score"

    // sort by score descending
    scores.sort((a, b) => b.score - a.score);
    // following 2 lines is functional pseudocode
    let bestplayer = scores[0].name;
    let scoreofbestplayer = scores[0].score;
});

/// functions handling visual updates

function flipQuestionCard() {
    let card = document.getElementById("flip-card-inner");

    // only back and forth:
    // if (card.style.transform == "" || card.style.transform == "rotateY(0deg)") {
    //     card.style.transform = "rotateY(180deg)";
    // } else {
    //     card.style.transform = "rotateY(0deg)";
    // }
    
    // continuous:
    card.style.transform = `rotateY(${+card.style.transform.slice(8, -4) + 180}deg)`;
}