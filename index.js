
// Graphics and UI
const playArea = document.getElementsByTagName("main")[0]; // the primary container in the body
const instructions = document.getElementById("instructions");
const catImages = [];
const frownEmoji = "\uD83D\uDE41";
const heartEmoji = "\u2764\uFE0F";
let emojiCounter = 0;
const maxEmojis = 4000;
const interval = 150; // Adjust the interval (in milliseconds) for adding emojis to the window at the end

const fadeIn = "fadeIn 0.5s ease-in forwards";
const fadeOut = "fadeOut 0.5s ease-out forwards";
const fadeInOut = "fadeInOut 2s ease-in-out forwards";
const fadeInOut4s = "fadeInOut 4s ease-in-out forwards";

// Statistics
let clickCounter = 0;
let timer = 90;
// let timer = 9999;
// let timer = 3;
let catsFound = 0;
let totalCats = 3;

// Areas
let clickedAreas = [];
let catLocations = [];
let allAreaNodes = [];
let arrayFromClickables = Array.from(allAreaNodes); // Convert NodeList to Array (for easier manipulation)
let areaNames = [
    "that cupboard",
    "that drawer",
    "the sink",
    "the curtain",
    "the closet",
];

// Interactables
let goToBedroomButton =
    document.getElementById("goToBedroomButton");
let goToKitchenButton =
    document.getElementById("goToKitchenButton");

// When DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    let allAreaNodes = document.querySelectorAll('[id^="area_"]'); // Into allAreaNodes NodeList, place all elements with id starting with "area_"
    arrayFromClickables = Array.from(allAreaNodes); // Convert NodeList to Array (for easier manipulation)

    allAreaNodes.forEach((e) => {
        e.addEventListener("click", addAreaToClickedAreas);
    });
});

function addAreaToClickedAreas(e) {
    if (!clickedAreas.includes(e.target.id)) {
        clickedAreas.push(e.target.id);
        checkForCat(e);
    } else {
        checkForCat(e);
    }
}

// Checks if the area clicked is one of the randomized cat locations
// Triggers visuals if an unfound cat was found or visually notifies if it was not
function checkForCat(hidingPlace) {
    if (catLocations.includes(hidingPlace.target.id)) {
        catsFound++;
        document.getElementById("foundCounterValue").innerHTML =
            catsFound;
        hidingPlace.target.children[0].style.animation = fadeIn;
        showNotification(
            "❤️",
            hidingPlace.clientX,
            hidingPlace.clientY
        );
    } else {
        showNotification(
            "Darn, no cat here... 😟",
            hidingPlace.clientX,
            hidingPlace.clientY,
            "catNotFound"
        );
    }

    if (catsFound >= totalCats) {
        gameOver(true);
    }
}

function startGame() {
    placeCatsRandomly();

    setTimeout(function () {
        goToBedroomButton.style.display = "block";
        goToBedroomButton.style.opacity = 1;
    }, 500);

    document.getElementById("playArea").style.animation = fadeIn;
    document.getElementById("playArea").style.display = "flex";

    goToKitchenButton.style.display = "none";

    document.getElementById("splashPage").remove();

    runTimer();
}

// Randomizes the available clickable areas and adds the first 3 from the
// randomized array into the catLocations var
function placeCatsRandomly() {
    const shuffledArray = arrayFromClickables.sort(
        () => Math.random() - 0.5
    );
    const selectedAreas = shuffledArray.slice(0, totalCats);
    console.log(selectedAreas);
    selectedAreas.forEach((area, index, array) => {
        catLocations.push(area.id);
        var container = document.getElementById(area.id);
        container.innerHTML = `<img class='catGif' id='cat${index}' src='./img/cat${index}.gif'>`;
    });
}

// Shows a notification modal at the specified coordinates
function showNotification(message, x, y, type) {
    const notificationModal = document.createElement("div");
    notificationModal.className = "notificationModal";
    if (type === "catNotFound") {
        notificationModal.classList.add("catNotFoundDialog");
    }
    notificationModal.style.top = y + "px";
    notificationModal.style.left = x + "px";
    notificationModal.style.zIndex = 7;
    notificationModal.innerHTML = message;

    document.body.appendChild(notificationModal);

    // Triggers the fadeInOut animation after a short delay
    setTimeout(() => {
        notificationModal.style.animation = fadeInOut;
        notificationModal.style.position = "fixed"; // Ensure the modal stays fixed relative to the viewport
        notificationModal.style.width = "auto";
        notificationModal.style.padding = "10px";
        notificationModal.style.transform =
            "translate(-50%, -50%) scale(1.5)"; // Center the modal
        // Removes the modal after the fade-out animation completes
        setTimeout(() => {
            notificationModal.remove();
        }, 2200);
    }, 10);
}

// Changes the 'location' the user is in, including animated crossfade and
// updating the clickable areas to match the new background room image.
function goToLocation(location) {
    playArea.style.animation = fadeOut;
    if (location === "bedroom") {
        goToBedroom();

        setTimeout(function () {
            document.getElementById("locationImage").src =
                "./img/bedroom.jpg";
            playArea.style.animation = fadeIn;
        }, 10);
    } else if (location === "kitchen") {
        goToKitchen();
    } else {
        console.error(
            "Failed to goToLocation() with an invalid parameter."
        );
    }
}

function goToKitchen() {
    goToKitchenButton.style.display = "none";

    // Hide the existing Bedroom rows
    document.querySelector(".bedroom").classList.add("hidden");
    // Show the Kitchen rows
    document.querySelector(".kitchen").classList.remove("hidden");

    goToBedroomButton.style.display = "block";

    // Change the image source after a delay to synchronize with the fade-out animation
    setTimeout(function () {
        // Change the image source after fade-out is complete
        changeImage("kitchen");

        // Apply fade-in animation to the image container
        playArea.style.animation = fadeIn;
    }, 10);
}

function goToBedroom() {
    // Hide the existing goToKitchenButton
    goToBedroomButton.style.display = "none";

    // Hide the existing Kitchen rows
    document.querySelector(".kitchen").classList.add("hidden");
    //Show the Bedroom rows
    document.querySelector(".bedroom").classList.remove("hidden");

    goToKitchenButton.style.display = "block";

    // Change the image source after a delay to synchronize with the fade-out animation
    setTimeout(function () {
        changeImage("bedroom");

        // Apply fade-in animation to the image container
        playArea.style.animation = fadeIn;
    }, 10);
}

function changeImage(location) {
    if (location == "bedroom") {
        document.getElementById("locationImage").src =
            "./img/bedroom.jpg";
    } else if (location == "kitchen") {
        document.getElementById("locationImage").src =
            "./img/kitchen.jpg";
    }
}

function showInstructions() {
    instructions.style.display = "block";
    let letsGoButton = document.getElementById("letsGoButton");
    letsGoButton.remove();
    if (
        Math.max(
            document.documentElement.clientWidth || 0,
            window.innerWidth || 0
        ) <= 500
    ) {
        splashTitle.remove();
    }
}

//
function addEmojiRandomly(message, x, y) {
    const emojiModal = document.createElement("div");
    emojiModal.className = "emojiModal";
    emojiModal.style.top = y + "px";
    emojiModal.style.left = x + "px";
    emojiModal.innerHTML = message;

    document.getElementById("playArea").appendChild(emojiModal);

    setTimeout(() => {
        setTimeout(() => {
            emojiModal.remove();
        }, 40000);
    }, 10);
}

function addEmojiRandomLocation(emoji) {
    const emojiWidth = 50;
    const emojiHeight = 50;

    const playAreaWidth = playArea.offsetWidth - emojiWidth;
    const playAreaHeight = playArea.offsetHeight - emojiHeight;

    let randomX = Math.floor(Math.random() * playAreaWidth);
    let randomY = Math.floor(Math.random() * (playAreaHeight - 20));

    emojiCounter++;

    if (emojiCounter >= maxEmojis) {
        clearInterval(emojiInterval);
    }

    addEmojiRandomly(emoji, randomX, randomY);
}

// Begins the timer countdown and directs the game to the appropriate end state
function runTimer() {
    var interval = window.setInterval(function () {
        if (timer <= 0) {
            clearInterval(interval);
            gameOver(false);
        } else if (catsFound >= totalCats) {
            clearInterval(interval);
        } else {
            timer--;
            document.getElementById("timerValue").innerHTML = timer;
        }
    }, 1000);
}

function successful() {
    var successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";
    console.log("Won at the game");

    // TODO: Make emojis slowly float up
    // Adds a heart emoji at a random location
    const emojiInterval = setInterval(() => {
        addEmojiRandomLocation(heartEmoji);
    }, interval);
}

function failure() {
    var failureMessage = document.getElementById("failureMessage");
    failureMessage.style.display = "block";

    const emojiInterval = setInterval(() => {
        addEmojiRandomLocation(frownEmoji);
    }, interval);
}

// Removes all clickable areas from the the screen on fail state, then displays the appropriate modal
function gameOver(outcome) {
    let goToLocationButtons = Array.from(
        document.getElementsByClassName("goToLocationButton")
    );
    goToLocationButtons.forEach((e) => {
        e.style.display = "none";
    });

    arrayFromClickables.forEach((e) => {
        e.style.display = "none";
    });

    if (outcome) {
        successful();
    } else {
        failure();
    }
}