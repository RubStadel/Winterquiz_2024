"use strict";

let socket = io();                          // starting the socket connection using socket.io library
let playerName;                             // username given by the player
let ip;                                     // some sort of IP-address of the player
let playerCount;                            // PlayerCount (PC) (to differentiate between players)
let currentQuestion;                        // current question as string
let answerArr = [];                         // array of objects of the answers
let shuffledAnswers = [];                   //array of shuffled answers
let numSwap = [];                           // when answers are shuffled, this array keeps track
let answerStat;                             // bool variable to determine right or wrong answers
let currExplanation;                        // string of the explanation to current question

/// functions controlling game flow

function startGame() {
    document.getElementById("landingNav").style.height = "0%";
    // get first question and its answers from server and display them
    // Pseudo: player has to enter a username and javascript has to get IP
    socket.emit("start", playerName, ip);
}

socket.on("receive_playernum", (PC) => {
    // directly after assigning the PC, the command to send the question is given
    playerCount = PC;
    socket.emit("get_question", playerCount);
});

socket.on("receive_question", (questStr, answerArray) => {
    // question as string and answers as array is given
    // each answer in the array has a string (a) and a number (n)
    currentQuestion = questStr;
    answerArr = answerArray;
    shuffleAnswers();

    document.getElementById("question").textContent = currentQuestion;

    for (let i = 0; i < 4; i++) {
        document.getElementById(`answer${i}`).textContent = shuffledAnswers[i];
    }
});

function checkAnswer(answerNumber) {
    // check answer
    // get a number by clicking on the available answer as answerNumber (0-3)
    socket.emit("get_result", numSwap[answerNumber]);
}

socket.on("receive_result", (answerStatus, explanation) => {
    // answerStatus true or false, explanation is a string
    answerStat = answerStatus;
    currExplanation = explanation;
    // now it has to be displayed
});

socket.on("receive_scores", (scores) => {
    // returns array of objects with attributes "name" and "score"

    // sort by score descending
    scores.sort((a, b) => b.score - a.score);
    // following 2 lines is functional pseudocode
    let bestPlayer = scores[0].name;
    let scoreOfBestPlayer = scores[0].score;
});

/// function to randomize answer order

function shuffleAnswers(){
    // this function shuffles and empties the answerArr 
    // and puts it in shuffledAnswers and keeps track
    // of it in numSwap
    let randNum;
    for (let i = 0; i < 4; i++) {
        // pick a random number between 0 and (answerArr.length - 1)
        randNum = Math.floor(Math.random() * (answerArr.length));
        // pluck the randNumth answer out of answerArr and put it in shuffledAnswers
        shuffledAnswers[i] = answerArr.splice(randNum, 1);
        // keep track with the numSwap array
        numSwap[i] = randNum;
    }
}

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