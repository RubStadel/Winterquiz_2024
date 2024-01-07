"use strict";

let socket = io();                          // starting the socket connection using socket.io library
let playerName = "Anon";                    // placeholder // username given by the player
let ip;                                     // some sort of IPv6-address of the player
let playerCount;                            // PlayerCount (PC) (to differentiate between players)
let answerArr = [];                         // array of objects of the answers
let shuffledAnswers = [];                   // array of shuffled answers
let numSwap = [];                           // when answers are shuffled, this array keeps track
let pressedButtonId;
let isConcurrentQuestion = 0;
let flipToggle = true;
let flipTimes = 0;
let notAnsweredYet = true;

// access to CSS root variables

let root = document.querySelector(':root');
var rootStyle = getComputedStyle(root);

/// functions controlling game flow

// function to get temporary IPv6 address of the client

function initGame() {
    // because this function works asynchronously, the username input is opened first (to fill the time it takes to get the ip).

    startGame();

    getIPs().then(res => {
        // sorting array in order of length descending
        res.sort((a, b) => b.length - a.length);
        ip = res[0];
    });
}

// function to open username input form and reveal main page

function startGame() {
    let form = document.getElementById("usernameForm");
    let username = document.getElementById("username");

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        playerName = username.value;
        username.value = "";
        form.style.display = "none";

        document.getElementById("landingNav").style.top = "100%";

        // get first question and its answers from server and display them
        socket.emit("start", playerName, ip);
    });

    document.getElementById("gameInstructions").style.opacity = 0;
    document.getElementById("startButton").style.opacity = 0;
    form.style.opacity = 1;
    username.focus();
}


socket.on("receive_playernum", (PC) => {
    // directly after assigning the PC, the command to send the question is given
    playerCount = PC;
    socket.emit("get_question", playerCount);
});

socket.on("receive_question", (questStr, answerArray) => {
    // socket.emit("get_test",playerCount,"update");
    if (questStr) {
        // question as string and answers as array is given
        // each answer in the array is a string
        let currentQuestion = questStr;
        answerArr = answerArray;
        shuffleAnswers();

        document.getElementById("question").textContent = currentQuestion;
        document.getElementById("question").style.fontSize = rootStyle.getPropertyValue('--question-big');

        document.getElementById("continueButton").style.opacity = "0";

        for (let i = 0; i < 4; i++) {
            let tmpButton = document.getElementById(`answer${i}`);
            tmpButton.textContent = shuffledAnswers[i];
            tmpButton.style.backgroundColor = rootStyle.getPropertyValue('--weak-green');
            tmpButton.style.color = rootStyle.getPropertyValue('--dark-gray');

            tmpButton.style.fontSize = rootStyle.getPropertyValue('--answer-big');
            if (shuffledAnswers[i].length >= 20) {
                tmpButton.style.fontSize = rootStyle.getPropertyValue('--answer-small');
            }
        }
        notAnsweredYet = true;

        if (isConcurrentQuestion) {
            flipQuestionCard();
        }
        isConcurrentQuestion++;
    }
});

function checkAnswer(answerNumber) {
    if (notAnsweredYet) {
        pressedButtonId = `answer${answerNumber}`;
        notAnsweredYet = false;

        socket.emit("get_result", playerCount, numSwap[answerNumber]);
    }
}

socket.on("receive_result", (answerStatus, explanation) => {
    // answerStatus true or false, explanation is a string
    let answerStat = answerStatus;
    let currExplanation = explanation;

    let correctAnswer = numSwap.indexOf(0);
    document.getElementById(`answer${correctAnswer}`).style.backgroundColor = rootStyle.getPropertyValue('--correct-answer-green');
    document.getElementById(`answer${correctAnswer}`).style.color = "white";

    if (!answerStat) {
        document.getElementById(pressedButtonId).style.backgroundColor = rootStyle.getPropertyValue('--wrong-answer-red');
        document.getElementById(pressedButtonId).style.color = "white";
    }

    document.getElementById("question").textContent = currExplanation + "\r\n\r\n";
    document.getElementById("question").style.fontSize = rootStyle.getPropertyValue('--question-big');
    if (currExplanation.length >= 200) {
        document.getElementById("question").style.fontSize = rootStyle.getPropertyValue('--question-small');
    }

    document.getElementById("continueButton").onclick = flipQuestionCard;

    setTimeout(() => {
        document.getElementById("continueButton").style.opacity = "1";
    }, 400);
});

socket.on("receive_scores", (scores) => {                                                               // TODO: implement score diplay
    // returns array of objects with attributes "name" and "score"
    // sort by score descending    
    console.log(scores);
    scores.sort((a, b) => b.score - a.score);
    // following 2 lines is functional pseudocode
    let bestPlayer = scores[0].NAME;

    console.log(bestPlayer);
});

/// function to randomize answer order

function shuffleAnswers() {
    // this function shuffles and empties the answerArr 
    // and puts it in shuffledAnswers and keeps track
    // of it in numSwap
    let randNum;
    let tempArr = answerArr.slice(0, 4);
    for (let i = 0; i < 4; i++) {
        // pick a random number between 0 and (answerArr.length - 1)
        randNum = Math.floor(Math.random() * (answerArr.length));
        // pluck the randNumth answer out of answerArr and put it in shuffledAnswers
        shuffledAnswers[i] = answerArr.splice(randNum, 1)[0];
        // keep track with the numSwap array
        numSwap[i] = tempArr.indexOf(shuffledAnswers[i]);
    }
}

/// functions handling visual updates

function flipQuestionCard() {
    let card = document.getElementById("flip-card-inner");

    flipTimes++;
    card.style.transform = `rotateY(${flipTimes * 180}deg)`;

    if (flipToggle) {
        for (let i = 0; i < 4; i++) {
            document.getElementById(`answer${i}`).style.opacity = "0";
        }

        setTimeout(() => {
            socket.emit("get_question", playerCount);
        }, 700);
    } else {
        setTimeout(() => {
            for (let i = 0; i < 4; i++) {
                document.getElementById(`answer${i}`).style.opacity = "1";
            }
        }, 400);
    }
    flipToggle = !flipToggle;

    document.getElementById("continueButton").onclick = {};
}