"use strict";

///// library initializations and variable declarations

let socket = io();                                              // starting the socket connection using socket.io library

let playerName = "Test12";                                      // placeholder // username given by the player
let ip;                                                         // some sort of IPv6-address of the player
let playerCount;                                                // PlayerCount (PC) (to differentiate between players)
let answerArr = [];                                             // array of objects of the answers
let shuffledAnswers = [];                                       // array of shuffled answers
let numSwap = [];                                               // when answers are shuffled, this array keeps track
let pressedButtonId;
let isConcurrentQuestion = 0;
let flipToggle = true;
let flipTimes = 0;
let notAnsweredYet = true;

// access to CSS root variables

let root = document.querySelector(':root');
var rootStyle = getComputedStyle(root);


///// functions controlling game flow

// function that is immediately called when the page loads

function init() {
    getIPs().then(res => {
        // sorting array in order of length descending
        res.sort((a, b) => b.length - a.length);
        ip = res[0];
        socket.emit('init', ip);                                // send ip to server to check if this user has already finished playing
    });
}

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

// function to open username input form and reveal main page afterwards

function startGame() {
    let form = document.getElementById("usernameForm");
    let username = document.getElementById("username");

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (username.value) {
            playerName = username.value;
            username.value = "";
            form.style.display = "none";

            document.getElementById("landingNav").style.top = "100%";

            socket.emit("start", playerName, ip);               // get first question and its answers from server and display them
        }
    });

    document.getElementById("gameInstructions").style.opacity = 0;
    document.getElementById("startButton").style.opacity = 0;
    form.style.opacity = 1;
    username.focus();
}


///// event handlers for socket communication

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

socket.on("receive_result", (answerStatus, explanation, gameEnded) => {
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
    if (gameEnded) {
        document.getElementById("continueButton").onclick = () => {
            socket.emit("get_scores", playerCount);
        };
    }

    setTimeout(() => {
        document.getElementById("continueButton").style.opacity = "1";
    }, 400);
});

socket.on("receive_scores", (scores, name, points) => {
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("landingNav").style.top = "100%";
    document.getElementById("scoreNav").style.height = "100%";

    let scoresArr = scores;
    playerName = name;
    let playerPoints = points;

    let colors = ["gold", "lightGray", "peru"];
    let list = document.getElementById("scoreList");

    let tmpLength = scores.length;
    if (tmpLength > 8) {
        tmpLength = 8;
    }

    scores.sort((a, b) => b.SCORE - a.SCORE);

    let userIsVisible = false;
    let userRank = scoresArr.findIndex((entry) => entry.NAME == playerName && entry.SCORE == playerPoints);

    if (userRank <= 8) {
        userIsVisible = true;
    }

    for (let i = 0; i < tmpLength; i++) {
        let entry = document.createElement('li');
        let entryPosition = document.createElement('div');
        let entryName = document.createElement('div');
        let entryScore = document.createElement('div');

        if (i < 3) {
            entry.style.boxShadow = `0 0 3.5vh ${colors[i]}`;
            entry.style.outline = `0.5vh solid ${colors[i]}`;
            entry.style.backgroundColor = `${colors[i]}`;
        } else {
            entry.style.boxShadow = `0 0 1vh ${rootStyle.getPropertyValue('--dark-gray')}`;
            entry.style.outline = `0.25vh solid ${rootStyle.getPropertyValue('--dark-gray')}`;
        }

        entryPosition.textContent = `${[i + 1]}. `;
        entryName.textContent = `${scores[i].NAME}, `;
        entryScore.textContent = `${scores[i].SCORE} Punkte`;
        if (scores[i].NAME.length > 6) {
            entryScore.textContent = `${scores[i].SCORE} P.`;
        }

        if (i == userRank) {
            entry.id = "userScore";
            entry.style.outline = "0.5vh solid black";
            entryPosition.style.color = "black";
            entryName.style.color = "black";
            entryScore.style.color = "black";
        }

        entry.appendChild(entryPosition);
        entry.appendChild(entryName);
        entry.appendChild(entryScore);
        list.appendChild(entry);
    }

    if (!userIsVisible) {
        let dots = document.createElement('li');
        dots.id = "dots";
        dots.innerHTML = "&#x205D;";
        list.appendChild(dots);
    }

    if (scores.length > 8 && !userIsVisible) {
        let user = document.createElement('li');
        let userPosition = document.createElement('div');
        let userName = document.createElement('div');
        let userScore = document.createElement('div');

        user.id = "userScore";

        userPosition.textContent = `${userRank + 1}.`;
        userName.textContent = `${playerName}, `;
        userScore.textContent = `${scores[userRank].SCORE} Punkte`;
        if (playerName.length > 6) {
            userScore.textContent = `${scores[userRank].score} P.`;
        }

        user.appendChild(userPosition);
        user.appendChild(userName);
        user.appendChild(userScore);
        list.appendChild(user);
    }
});


///// additional functions for various tasks

// function to randomize answer order

function shuffleAnswers() {
    // this function shuffles and empties the answerArr 
    // and puts it in shuffledAnswers and keeps track of it in numSwap
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

// function that is called when one of the answer buttons is clicked
// checks if the answer was correct and tells the result to the server

function checkAnswer(answerNumber) {
    if (notAnsweredYet) {
        pressedButtonId = `answer${answerNumber}`;
        notAnsweredYet = false;

        socket.emit("get_result", playerCount, numSwap[answerNumber]);
    }
}

// function handling visual updates to the question card

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