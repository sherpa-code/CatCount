<script>
            // Graphics and UI
            const playArea = document.getElementsByTagName("main")[0]; // the primary container in the body
            const instructions = document.getElementById("instructions");
            const catImages = [];
            const frownEmoji = '\uD83D\uDE41';
            const heartEmoji = '\u2764\uFE0F';
            let emojiCounter = 0;
            const maxEmojis = 10000;
            const interval = 150; // Adjust the interval (in milliseconds) for adding emojis to the window at the end

            const fadeIn = "fadeIn 0.5s ease-in forwards";
            const fadeOut = "fadeOut 0.5s ease-out forwards";
            const fadeInOut = 'fadeInOut 2s ease-in-out forwards';
            
            // Statistics
            let clickCounter = 0;
            // let timer = 90;
            let timer = 9999;
            var catsFound = 0;
            let totalCats = 3;
            
            // Areas
            var clickedAreas = [];
            var catLocations = [];
            var allAreaNodes = [];
            var arrayFromClickables = Array.from(allAreaNodes); // Convert NodeList to Array (for easier manipulation)
            var areaNames = ["that cupboard", "that drawer", "the sink", "the curtain", "the closet"];
            
            // Interactables
            var goToBedroomButton = document.getElementById("goToBedroomButton");
            var goToKitchenButton = document.getElementById("goToKitchenButton");
            
            // When DOM is fully loaded
            document.addEventListener("DOMContentLoaded", function () {
                let allAreaNodes = document.querySelectorAll('[id^="area_"]'); // Into allAreaNodes NodeList, place all elements with id starting with "area_"
                console.log('%c%s', 'background-color:grey; color:orange', 'allAreaNodes = ' + allAreaNodes);
                arrayFromClickables = Array.from(allAreaNodes); // Convert NodeList to Array (for better manipulation)
                // console.log("%c%s", "background-color:grey; color:orange",
                // 'Elements with id beginning "area_" converted from NodeList to an array are: ' + arrayFromClickables);
                
                allAreaNodes.forEach((e) => {
                    e.addEventListener("click", checkAddClickedAreaToArray);
                });
            });
            
            // 
            function checkAddClickedAreaToArray(e) {
                addAreaToClickedAreas(e);
            }
            
            function addAreaToClickedAreas(e) {
                if (!clickedAreas.includes(e.target.id)) {
                    // if (!clickedAreas.includes(e.target.id) && (e.target.id != '')) {
                        clickedAreas.push(e.target.id);
                        console.log(clickedAreas);
                        checkForCat(e);
                    } else {
                        checkForCat(e);
                }
            }
        
            function startGame() {
                placeCatsRandomly();

                setTimeout(function () {
                    // instructions.style.display = "none";
                    // playArea.style.display = "flex";
                    // playArea.style.opacity = 1;
                    goToBedroomButton.style.display = "block";
                    goToBedroomButton.style.opacity = 1;
                }, 500); // Set the duration of the transition
                document.getElementById("splashPage").style.animation = fadeOut;
                document.getElementById("splashPage").style.display = "none";

                // goToLocation("kitchen");
                document.getElementById("playArea").style.animation = fadeIn;
                document.getElementById("playArea").style.display = "flex";

                goToKitchenButton.style.display = "none";

                const splashPage = document.getElementById("splashPage");
                splashPage.remove();
                
                runTimer();
            }
                    
            // Randomizes the available clickable areas and adds the first 3 from the
            // randomized array into the catLocations var
            function placeCatsRandomly() {
                const shuffledArray = arrayFromClickables.sort(() => Math.random() - 0.5);
                const selectedAreas = shuffledArray.slice(0, totalCats);
                console.log(selectedAreas);
                // selectedAreas.forEach(area => {
                selectedAreas.forEach((area, index, array) => {
                    catLocations.push(area.id);
                    var container = document.getElementById(area.id);
                    // console.log(container);
                    // container.innerHTML = "<img src='/img/cat1.gif'>";
                    // container.innerHTML = `<img src='/img/cat${index}.gif'>`; // uses string interpolation // change cat image names starting at cat 0
                    container.innerHTML = `<img class='catGif' id='cat${index}' src='/img/cat${index}.gif'>`;
                });

                // console.log('cat 0 id = ' + document.getElementById(0).id);
                console.log("Placed cats in the following areas: ", catLocations);
            }

            // Checks if the area clicked is one of the randomized cat locations
            // Triggers visuals if an unfound cat was found or visually notifies if it was not
            function checkForCat(hidingPlace) {
                if (catLocations.includes(hidingPlace.target.id)) {
                    catsFound++;
                    catsFound++; // TODO: disable, debug only
                    catsFound++; // TODO: disable, debug only
                    document.getElementById("foundCounterValue").innerHTML = catsFound;
                    hidingPlace.target.children[0].style.animation = 'fadeInOut 4s ease-in-out forwards';
                    console.log(`Children of this hidingPlace element: `, hidingPlace.target.children);
                    // document.getElementById(hidingPlace.target.id).style.display = 'none';
                    // document.getElementById(hidingPlace.target.id).style.display = 'block';
                    showNotification("❤️", hidingPlace.clientX, hidingPlace.clientY);
                } else {
                    showNotification("Darn, no cat here... 😟", hidingPlace.clientX, hidingPlace.clientY);
                }

                if (catsFound >= totalCats) {
                    // gameOver(true); // right now this is handled by the runTimer()
                }
            }

            
            
            // Function to show a notification modal at the specified coordinates // TODO: create another for showEmoji
            function showNotification(message, x, y) {
                const notificationModal = document.createElement("div");
                notificationModal.className = "notificationModal";
                notificationModal.style.top = y + "px";
                notificationModal.style.left = x + "px";
                notificationModal.style.zIndex = 7;
                // notificationModal.textContent = message;
                notificationModal.innerHTML = message;

                document.body.appendChild(notificationModal);

                // Triggering the fadeInOut animation after a short delay
                setTimeout(() => {
                    notificationModal.style.animation = fadeInOut;
                    notificationModal.style.position = "fixed"; // Ensure the modal stays fixed relative to the viewport
                    notificationModal.style.width = "auto";
                    notificationModal.style.padding = "10px";
                    notificationModal.style.transform = "translate(-50%, -50%) scale(1.5)"; // Center the modal
                    // Removing the modal after the fade-out animation completes
                    setTimeout(() => {
                        notificationModal.remove();
                    }, 40000); // Adjust the duration based on your fadeInOut animation
                }, 10);
            }

            // Changes the 'location' the user is in, including animated crossfade and
            // updating the clickable areas to match the new background room image.
            function goToLocation(location) {
                console.log("goToLocation fired: " + location);
                
                // Apply fade-out animation to the image container
                playArea.style.animation = fadeOut;
                if (location === "bedroom") {
                    goToBedroom();
                    goToBedroomButton.style.display = "none"; // Hides the goToBedroomButton
                    goToKitchenButton.style.animation = fadeIn ;

                    // Change the image source after a delay to synchronize with the fade-out animation
                    setTimeout(function () {
                        document.getElementById("locationImage").src = "img/bedroom.jpg"; // Change the image source after fade-out is complete
                        playArea.style.animation = fadeIn;
                    }, 10);
                    updateClickableAreas("bedroom");
                } else if (location === "kitchen") {
                    goToKitchen();
                    updateClickableAreas("kitchen");
                    goToBedroomButton.style.animation = fadeIn;
                } else {
                    alert("Failed to goToLocation() with an invalid value.");
                }
            }

            function goToKitchen() {
                // Hide the existing goToBedroomButton
                goToKitchenButton.style.display = "none";

                //Hide the existing Bedroom rows
                document.querySelector(".bedroom").style.display = "none";
                //Show the Kitchen rows
                document.querySelector(".kitchen").style.display = "flex";

                // Show the goToKitchenButton after a delay
                setTimeout(function () {
                    goToBedroomButton.style.display = "block";
                }, 500);

                // Change the image source after a delay to synchronize with the fade-out animation
                setTimeout(function () {
                    // Change the image source after fade-out is complete
                    document.getElementById("locationImage").src = "img/kitchen.jpg";
                    
                    // Apply fade-in animation to the image container
                    playArea.style.animation = fadeIn;
                }, 10);

                updateClickableAreas("kitchen");
            }

            function goToBedroom() {
                // Hide the existing goToKitchenButton
                goToBedroomButton.style.display = "none";

                //Hide the existing Kitchen rows
                document.querySelector(".kitchen").style.display = "none";
                //Show the Bedroom rows
                document.querySelector(".bedroom").style.display = "flex";

                // Show the goToKitchenButton after a delay
                setTimeout(function () {
                    goToKitchenButton.style.display = "block";
                }, 500);

                // Change the image source after a delay to synchronize with the fade-out animation
                setTimeout(function () {
                    // Change the image source after fade-out is complete
                    document.getElementById("locationImage").src = "img/bedroom.jpg";

                    // Apply fade-in animation to the image container
                    playArea.style.animation = fadeIn;
                }, 10);

                updateClickableAreas("bedroom");
            }

            // Add functionality to swap the clickable areas of the image.
            function changeImage(location) {
                if (location == "bedroom") {
                    document.getElementById("locationImage").src = "img/bedroom.jpg";
                } else if (location == "kitchen") {
                    document.getElementById("bedroomImage").src = "img/kitchen.jpg";
                }
            }
            
            // Modifies the displayed clickable areas when the location has been updated.
            // TODO: complete this function by replacing the relevant rows and their contents
            function updateClickableAreas(location) {
                if (location === "bedroom") {
                    
                } else if (location === "kitchen") {

                } else {
                    alert("Failed to update ClickableAreas to an invalid location.")
                }
            }
            
            function hideClickableAreas() {
                const areas = document.querySelectorAll(".area--clickable");
                console.log(areas);
                areas.forEach(areas => areas.remove());
            }

            function showInstructions() {
                instructions.style.animation = fadeIn;
                instructions.style.display = "block";
                // document.getElementById("instructions").style.display = "block";
                let letsGoButton = document.getElementById("letsGoButton");
                letsGoButton.style.animation = fadeOut;
                document.getElementById("startGameContainer").style.animation = fadeIn;
                letsGoButton.remove();
            }

            // Function to show a notification modal at the specified coordinates
            function addEmojiRandomly(message, x, y) {
                const emojiModal = document.createElement("div");
                emojiModal.className = "emojiModal";
                emojiModal.style.top = y + "px";
                emojiModal.style.left = x + "px";
                emojiModal.style.zIndex = 7;
                emojiModal.style.opacity = 0;
                emojiModal.style.display = "none";
                emojiModal.innerHTML = message;

                // document.body.appendChild(emojiModal);
                document.getElementById("playArea").appendChild(emojiModal);

                // Triggering the fadeInOut animation after a short delay
                setTimeout(() => {
                    emojiModal.style.animation = fadeInOut;
                    // emojiModal.style.position = "fixed"; // Ensure the modal stays fixed relative to the viewport
                    emojiModal.style.position = "absolute"; // Ensure the modal stays fixed relative to the viewport
                    emojiModal.style.width = "auto";
                    emojiModal.style.padding = "10px";
                    emojiModal.style.transform = "translate(-50%, -50%) scale(2)";
                    emojiModal.style.display = "block";
                    // Removing the modal after the fade-out animation completes
                    setTimeout(() => {
                        emojiModal.remove();
                    }, 40000); // Adjust the duration based on your fadeInOut animation
                }, 10);
            }

            function addEmojiRandomLocation(emoji) {
                // const viewportWidth = window.innerWidth;
                // const viewportHeight = window.innerHeight;

                // let randomX = Math.floor(Math.random() * viewportWidth);
                // if (randomX > randomX*1.2) {
                //     randomX = randomX*1.2;
                // } else if (randomX < randomX*0.8) {
                //     randomX = randomX*0.8;
                // }
                // let randomY = Math.floor(Math.random() * viewportHeight);
                // if (randomY > randomY*1.2) {
                //     randomY = randomY*1.2;
                // } else if (randomY < randomY*0.8) {
                //     randomY = randomY*0.8;
                // }

                const playAreaWidth = playArea.offsetWidth;
                const playAreaHeight = playArea.offsetHeight;
                console.log(playAreaWidth);
                console.log(playAreaHeight);

                let randomX = Math.floor(Math.random() * playAreaWidth);
                if (randomX < randomX*1.2) {
                    randomX = randomX*1.2;
                } else if (randomX < randomX*0.8) {
                    randomX = randomX*0.8;
                }
                let randomY = Math.floor(Math.random() * playAreaHeight);
                if (randomY > randomY*1.2) {
                    randomY = randomY*1.2;
                } else if (randomY < randomY*0.8) {
                    randomY = randomY*0.8;
                }

                // let randomX = Math.floor(Math.random() * playAreaWidth);
                // if (randomX < randomX*1.2) {
                //     randomX = randomX*1.2;
                // } else if (randomX > randomX*0.8) {
                //     randomX = randomX*0.8;
                // }
                // let randomY = Math.floor(Math.random() * playAreaHeight);
                // if (randomY < randomY*1.2) {
                //     randomY = randomY*1.2;
                // } else if (randomY > randomY*0.8) {
                //     randomY = randomY*0.8;
                //}
                

                emojiCounter++;

                if (emojiCounter >= maxEmojis) {
                    clearInterval(emojiInterval); // Stop the interval after reaching the desired number of hearts
                }
                
                addEmojiRandomly(emoji, randomX, randomY);
            }

            
            // TODO: move the catsFound >= totalCats check to checkForCat()
            function runTimer() {
                var interval = window.setInterval(function(){
                    if ((timer <= 0) && (catsFound < totalCats)) {
                        clearInterval(interval);
                        gameOver(false);
                    } else if (catsFound >= totalCats) {
                        // } else if ((timer <= 0) && (catsFound >= totalCats)) {
                        clearInterval(interval);
                        gameOver(true);
                    } else {
                        timer--;
                        document.getElementById("timerValue").innerHTML = timer;
                    };
                }, 1000);
            }
            
            // Removes all clickable areas from the the screen on fail state, then displays the appropriate modal.
            function gameOver(outcome) {
                hideClickableAreas();
                if (outcome === true) {
                    successful();
                } else {
                    failure();
                }
            }
            
            // TODO: Change background image to a success image when all cats found
            function successful() {
                var successMessage = document.getElementById("successMessage");
                successMessage.style.display = "block";
                // document.getElementsByClassName.src="img/bedroom.jpg"; // TODO: make it so the background image fades slowly into a full-window real life cat picture
                // document.getElementsByClassName.img = src="img/bedroom.jpg"; // TODO: make it so the background image fades slowly into a full-window real life cat picture
                
                // TODO: Make emojis slowly float up
                // Adds a heart emoji at a random location
                const emojiInterval = setInterval(() => {
                    addEmojiRandomLocation(heartEmoji);
                },  interval);
            }
            
            // TODO: Show the cats in the unfound places they were hiding
            function failure() {
                var failureMessage = document.getElementById("failureMessage");
                failureMessage.style.display = "block";
                console.log("Failed at the game");
                const emojiInterval = setInterval(() => {
                    addEmojiRandomLocation(frownEmoji);
                },  interval);
            }
        </script>