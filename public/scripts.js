"use strict";

/// functions controlling game flow

function startGame() {
    document.getElementById("landingNav").style.height = "0%";
    // get first question and its answers from server and display them
}

function checkAnswer() {
    // check answer
    // get and display next question
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