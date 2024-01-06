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

/// functions controlling game flow

function startGame() {
    document.getElementById("landingNav").style.height = "0%";
    /// function to get temporary IPv6 address of the client
    // Achtung: Diese Funktion gibt drei IP-ADressen in 'res' zurück aber nur eine IPv6-Adresse. Diese ist die längste und wird über ihre Länge gesucht. 

    getIPs().then(res => {
        // sorting array in order of length descending
        res.sort((a, b) => b.length - a.length);
        ip = res[0];

        // get first question and its answers from server and display them
        socket.emit("start", playerName, ip);

        // console.log(ip);
        // document.getElementById("startButton").textContent = ip;
        // console.log(res.join('\n'));
        // document.getElementById("startButton").textContent = res;
    }); 
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
        document.getElementById("question").style.fontSize = "3.25vh";

        document.getElementById("continueButton").style.opacity = "0";

        for (let i = 0; i < 4; i++) {
            let tmpButton = document.getElementById(`answer${i}`);
            tmpButton.textContent = shuffledAnswers[i];
            tmpButton.style.backgroundColor = "#0f7a334e";
            tmpButton.style.color = "#585858";
        }
        notAnsweredYet = true;

        if (isConcurrentQuestion) {         
            flipQuestionCard();
        }
        isConcurrentQuestion++;
    } else {
        // if questStr==0, client must wait for the scores to be sent
        // score will be sent to socket "receive_scores"
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
    document.getElementById(`answer${correctAnswer}`).style.backgroundColor = "#0f7a33bf";
    document.getElementById(`answer${correctAnswer}`).style.color = "white";

    if (!answerStat) {
        document.getElementById(pressedButtonId).style.backgroundColor = "#d74b6ca3";
        document.getElementById(pressedButtonId).style.color = "white";
    }

    document.getElementById("question").textContent = currExplanation + "\r\n\r\n";
    // document.getElementById("question").textContent = currExplanation;
    document.getElementById("question").style.fontSize = "2vh";                                      // reicht für die längste Erklärung, aber für kurze ist es eig. zu klein
    // console.log("currExplanation.length: ", currExplanation.length);

    document.getElementById("continueButton").onclick = flipQuestionCard;

    setTimeout(() => {
        document.getElementById("continueButton").style.opacity = "1";
      }, 400);
});

socket.on("receive_scores", (scores) => {
    // returns array of objects with attributes "name" and "score"
    // sort by score descending    
    console.log(scores);
    scores.sort((a, b) => b.score - a.score);
    // following 2 lines is functional pseudocode
    let bestPlayer = scores[0].NAME;
    let scoreOfBestPlayer = scores[0].score;
    console.log(bestPlayer);
});

/// function to randomize answer order

function shuffleAnswers(){
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