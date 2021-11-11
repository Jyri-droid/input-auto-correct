let stock = 1200;
let price = 50;
let batch = 6;
let steps = stock / batch;
let stepLeap = stock / steps;
let notificationElement = document.getElementById("inputNotification");
let inputElement = document.getElementById("numberInput");

// Render initial values
document.getElementById("stockLeft").innerHTML = stock;
document.getElementById("batchSize").innerHTML = batch;
document.getElementById("batchButtonPlusText").innerHTML = batch;
document.getElementById("batchButtonMinusText").innerHTML = batch;

inputElement.addEventListener("keydown", function onEvent(event) {
    if (event.key === "Enter") {
        console.log("Enter pressed on input");
        event.preventDefault();
        refreshStats();
        return false;
    }
});

inputElement.addEventListener("focusout", function() {
    console.log("Input has been focused out");
    refreshStats();
});


function refreshStats() {
    let inputValue = inputElement.value;

    // Correct number if it's too high
    if (inputValue > stock) {
        console.log("Number is too high");
        inputElement.value = stock;
        updateStats(stock);
        showNotification("You can buy maximum " + stock + " items");
        return;
    }

    // Correct number if it's too low
    if (inputValue < stepLeap / 2 && inputValue !=="") {
        console.log("Number is too low");
        inputElement.value = stepLeap;
        updateStats(stepLeap);
        showNotification("The amount has been corrected to the minimum batch");
        return;
    }

    // Correct number if it doesn't match steps
    if (checkIfValueDoesNotMatchStep(inputValue) && inputValue !== "") {
        console.log("Number does not match steps");
        showNotification("Items are sold in batches of " + stepLeap + ". The amount has been corrected to the nearest batch size.");
        // Loop through steps
        for (let i = 0; i < steps; i++) {
            // Catch the first step the input value exceeds
            if (inputValue > stepLeap * i) {
                // Count the middle of a step
                let middleOfStep = ((stepLeap * i) + (stepLeap * (i + 1))) / 2;
                // Check if input value is bigger than middle of step
                if (inputValue >= middleOfStep) {
                    inputElement.value = stepLeap * (i + 1);
                    updateStats(stepLeap * (i + 1));
                } else {
                    inputElement.value = stepLeap * i;
                    updateStats(stepLeap * i);
                }  
            }
        }
        return;
    }

    // Hide notification and stop function if input is cleared
    if (inputValue == "") {
        console.log("Input is cleared");
        hideNotification();
        updateStats(0);
        return;
    }

    // Number is good but notification is showing, hide it
    if (notificationElement.classList.contains("visible")) {
        console.log("Notification was showing but now it's hidden");
        hideNotification();
    }

    updateStats(inputValue);
}

function showNotification(text) {
    console.log("Notification is shown...");
    if (notificationElement.classList.contains("hidden")) {
        console.log("...and previous notification was hidden");
        document.getElementById("notificationText").innerHTML = text;
        notificationElement.classList.replace("hidden", "visible");
    } else {
        console.log("...and previous notification was shown");
        notificationElement.classList.replace("visible", "hidden");
        setTimeout(function() {
            document.getElementById("notificationText").innerHTML = text;
            notificationElement.classList.replace("hidden", "visible");
        }, 200);
    }
}

function hideNotification() {
    console.log("Notification is hidden");
    notificationElement.classList.replace("visible", "hidden");
}

function updateStats(value) {
    document.getElementById("stockLeft").innerHTML = stock - value;
    document.getElementById("totalPrice").innerHTML = value * price;
}

function checkIfValueDoesNotMatchStep(value) {
    for (let j = 0; j < steps + 1; j++) {
        if (stepLeap * j == value) {
            console.log("Correct step!");
            return false;
        }
    }
    return true;
}

// Batch steppers
document.getElementById("batchButtonPlus").addEventListener("click", function() {
    console.log("Batch added")
    let inputValue2 = inputElement.value;
    if (inputValue2 < stock) {
        inputElement.value = Math.floor(inputValue2) + batch;
        hideNotification();
        updateStats(inputElement.value);
    }
});

document.getElementById("batchButtonMinus").addEventListener("click", function() {
    console.log("Batch added")
    let inputValue2 = inputElement.value;
    if (inputValue2 > 0) {
        inputElement.value = Math.floor(inputValue2) - batch;
        hideNotification();
        updateStats(inputElement.value);
    }
});



// Send order button

let modalElement = document.getElementById("modalContainer");
let cancelButtonElement = document.getElementById("cancelButton");
let modalSendButtonElement = document.getElementById("modalSendButton");

document.getElementById("orderButton").addEventListener("click", function() {
    console.log("Send order button pressed");
    if (inputElement.value == "") {
        console.log("Can't send order, input is empty");
        showNotification("Please enter amount of items first.");
    } else {
        console.log("Modal opened");
        modalElement.style.display = "flex";
        document.getElementById("order").innerHTML = "Items: " + inputElement.value 
        document.getElementById("modalTotalPrice").innerHTML = "Total price: " + inputElement.value * price + " &euro;";
    }
});

// Confirmation modal

// Hide modal upon cancel
cancelButtonElement.addEventListener("click", function() {
    console.log("Modal cancel button pressed");
    modalElement.style.display = "none";
});

// Send button pressed after check
modalSendButtonElement.addEventListener("click", function() {
    console.log("Modal send button pressed...");
    modalElement.style.display = "none";
    document.getElementById("orderSentNotification").classList.replace("hidden", "visible");
    // Disable send button and input
    let allButtons = document.getElementsByTagName("button");
    for (let j of allButtons) {
        j.disabled = true;
    }
    inputElement.disabled = true;
    // Show restart button
    document.getElementById("restartButton").hidden = false;
});