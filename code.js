let catID = 1
let catTitle = ""
let currentScore = 0
let totalScore = 0

const introElement = document.getElementById("intro")
const playerScoreElement = document.getElementById("player-score")
const totalScoreElement = document.getElementById("total-score")
const gameBoardElement = document.getElementById("categories")
const gameStartButton = document.getElementById("game-start")

function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getCluesFromCategory() {
    catID = getRandomNumber(1, 40950)
    fetch(`https://jservice.kenzie.academy/api/clues?category=${catID}`)
        .then((data) => data.json())
        .then((response) => (response.clues))
        .then(populateCategory)
}



{/* 
<article id="cat1" class="category"></article>
<article id="cat2" class="category"></article>
<article id="cat3" class="category"></article>
<article id="cat4" class="category"></article>
<article id="cat5" class="category"></article>
<article id="cat6" class="category"></article> 
*/}



function populateCategory(clues){
    const cluesArray = clues
    const clueRange = Math.floor((cluesArray.length / 5) - 1)//allows targeting of a group of 5 other than the first for categories that have been used multiple times.
    const start = getRandomNumber(0, clueRange)
    
    if(cluesArray.length < 5){
        return getCluesFromCategory() //reset catch if the category doesn't have enough questions.
    }    

    const categoryElement = document.createElement("article")
    categoryElement.classList = "category"

    const categoryTitleElement = document.createElement("article")
    categoryTitleElement.classList = "title"
    categoryTitleElement.textContent = clues[0].category.title
    categoryElement.append(categoryTitleElement)

    for (let index = (start * 5); index <= 4 + (start * 5); index++) {
        
        const currentClue = cluesArray[index]

        const clueObjectElement = document.createElement("article")
        clueObjectElement.classList = "clue"
        clueObjectElement.dataset.answer = currentClue.answer

        const valueObject = document.createElement("div")//Value set like this to deal with the 0 that's left due to daily double.
        if (currentClue.value === 0) {
            if (currentClue === cluesArray[(start * 5)]) {
                valueObject.textContent = cluesArray[(start * 5) + 1].value * 2
                clueObjectElement.dataset.value = valueObject.textContent
            } else {    
                valueObject.textContent = cluesArray[(start * 5)].value * (index-(start * 5)+1)
                clueObjectElement.dataset.value = valueObject.textContent
            }
        } else {
            valueObject.textContent = currentClue.value
        }

        valueObject.classList = ("value")

        const questionObject = document.createElement("div")
        const submitObject = createSubmit(clueObjectElement)
        const correctObject = document.createElement("div")

        questionObject.classList.add("notVisable")
        submitObject.classList.add("notVisable")
        correctObject.classList.add("notVisable")
        correctObject.classList.add("correct")

        const submitButton = submitObject.querySelector("button")
        const textInput = submitObject.querySelector("input")

        questionObject.append(currentClue.question)
        correctObject.textContent = "Correct"

        submitButton.addEventListener("click", function(){
            const children = clueObjectElement.querySelectorAll("div")
            let clueAnswer = clueObjectElement.dataset.answer.toLowerCase()
            let questionInput = textInput.value.toString().toLowerCase()
            
            if (clueAnswer === questionInput) {
                currentScore += 1
                totalScore += 1

                playerScoreElement.textContent = currentScore
                totalScoreElement.textContent = totalScore

                children[1].classList.add("notVisable")
                children[2].classList.add("notVisable")
                children[3].classList.remove("notVisable")
            } else if (clueAnswer.includes(questionInput) && questionInput.length >= 4) {
                currentScore += 1
                totalScore += 1

                playerScoreElement.textContent = currentScore
                totalScoreElement.textContent = totalScore

                children[1].classList.add("notVisable")
                children[2].classList.add("notVisable")
                children[3].classList.remove("notVisable")
            } else if (textInput.value === ""){
                children[0].classList.remove("notVisable")
                children[1].classList.add("notVisable")
                children[2].classList.add("notVisable")
            } else {
                currentScore = 0
                playerScoreElement.textContent = currentScore    

                textInput.value = ""
                textInput.placeholder = "Try again..."
            }
        })

        clueObjectElement.append(valueObject)
        clueObjectElement.append(questionObject)
        clueObjectElement.append(submitObject)
        clueObjectElement.append(correctObject)

        valueObject.addEventListener("click", function(){
            valueObject.classList.toggle("notVisable")
            questionObject.classList.toggle("notVisable")
            submitObject.classList.toggle("notVisable")
        })

        categoryElement.append(clueObjectElement)
    }

    gameStartButton.textContent = "Refresh"
    gameBoardElement.append(categoryElement)
}

function createSubmit(clueObject){
    const submitObjectModel = document.createElement("div")
    const breakLineElement = document.createElement("br")
    const submitTextInput = document.createElement("input")
    const submitModelButton = document.createElement("button")

    submitTextInput.setAttribute("type", "text")
    submitTextInput.setAttribute("name", "answer")
    submitTextInput.setAttribute("placeholder", "Who/What is?")

    submitModelButton.textContent = "?"

    submitObjectModel.append(breakLineElement)
    submitObjectModel.append(submitTextInput)
    submitObjectModel.append(submitModelButton)

    return submitObjectModel
}

function gameStart(){
    gameBoardElement.innerHTML = ""
    introElement.innerHTML = ""
    playerScoreElement.textContent = currentScore
    totalScoreElement.textContent = totalScore

    for (let index = 0; index <= 5; index++) {
        getCluesFromCategory()
    }
}

gameStartButton.addEventListener("click", gameStart)