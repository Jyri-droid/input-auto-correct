let totalStock = 120;
let stockPrice = 50;
let steps = 6;
let stepLeap = totalStock / steps;
let notificationElement = document.getElementById("notification");
let inputElement = document.getElementById("numberInput");

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
    if (inputValue > totalStock) {
        console.log("Number is too high");
        inputElement.value = totalStock;
        countStats(totalStock);
        showNotification("You can buy maximum " + totalStock + " items");
        return;
    }

    // Correct number if it's too low
    if (inputValue < stepLeap / 2 && inputValue !=="") {
        console.log("Number is too low");
        inputElement.value = stepLeap;
        countStats(stepLeap);
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
                    countStats(stepLeap * (i + 1));
                } else {
                    inputElement.value = stepLeap * i;
                    countStats(stepLeap * i);
                }  
            }
        }
        return;
    }

    // Hide notification and stop function if input is cleared
    if (inputValue == "") {
        console.log("Input is cleared");
        hideNotification();
        countStats(0);
        return;
    }

    // Number is good but notification is showing, hide it
    if (notificationElement.style.opacity !== 0) {
        console.log("Notification was showing but now it's hidden");
        hideNotification();
    }

    countStats(inputValue);
}

function showNotification(text) {
    console.log("Notification is shown");
    if (notificationElement.style.opacity == 0) {
        console.log("Previous notification was hidden");
        document.getElementById("notificationText").innerHTML = text;
        notificationElement.style.opacity = 1;
    } else {
        console.log("Previous notification was shown");
        notificationElement.style.opacity = .5;
        setTimeout(function() {
            document.getElementById("notificationText").innerHTML = text;
            notificationElement.style.opacity = 1;
        }, 200);
    }

}

function hideNotification() {
    console.log("Notification is hidden");
    notificationElement.style.opacity = 0;
}

function countStats(value) {
    document.getElementById("stockLeft").innerHTML = totalStock - value;
    document.getElementById("totalPrice").innerHTML = value * stockPrice + " &euro;";
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