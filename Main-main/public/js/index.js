// Load chat history from local storage if available
let chatHistory = [];
if (localStorage.getItem('chatHistory')) {
    chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
}

const chatWindow = new Bubbles(document.getElementById("chat"), "chatWindow", {
    // Send user's question to API.
    inputCallbackFn: function (chatObject) {
        const miss = function () {
            chatWindow.think(); // Show user typing/thinking bubble.
            const xhr = new XMLHttpRequest();
            const url = window.location.origin + "/api/query";

            const input = chatObject.input;

            var reqBody = {
                input: input
            };

            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    chatWindow.stop();
                    response = JSON.parse(xhr.responseText);

                    // Store chat history in local storage
                    chatHistory.push({
                        input: input,
                        response: response['message']
                    });
                    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

                    chatWindow.talk(
                        {
                            talk: {
                                says: [response['message']]
                            },
                        },
                        "talk"
                    );
                }
            };

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(reqBody));
        };

        miss();
    }
});

// Introductory message from the bot.
var convo = {
    intro: {
        says: ["Hi! I'm Athena, your personal AI assistant. How can I help?"],
    },
};

chatWindow.talk(convo);


//User feedback
const thumbsUpButton = document.getElementById('thumbs-up'); // Get the thumbs up button
const thumbsDownButton = document.getElementById('thumbs-down'); // Get the thumbs down button
const feedbackButton = document.querySelectorAll('.feedback-button');

let feedbackValue = 0;

thumbsUpButton.addEventListener('click', function() {
    feedbackValue = '1';
});
  
thumbsDownButton.addEventListener('click', function() {
    feedbackValue = '-1';
});

let isSubmitting = false;
const submitButton = document.getElementById('submit-button'); // Get the submit button
let feedbackMessage = document.getElementById('feedback-message'); // Get the feedback message element

submitButton.addEventListener('click', function() {
    if (feedbackValue !== null && !isSubmitting) {
        isSubmitting = true;

        if (feedbackValue === '1') {
            feedbackMessage.textContent = "Thanks for your feedback!";
            fetch(window.location.origin + '/userFeedBackScoreIncrease');
        }

        if (feedbackValue === '-1') {
            feedbackMessage.textContent = "Thanks for your feedback!";
            fetch(window.location.origin + '/userFeedBackScoreDecrease');
        }

        // Set a timeout of 5 seconds before allowing another submission
        setTimeout(function() {
            isSubmitting = false;
        }, 5000);

    } else if (isSubmitting) { // Check if isSubmitting is true
        feedbackMessage.textContent = "Please wait before submitting again"; // Set feedback message to please wait before submitting again
    } else {
        feedbackMessage.textContent = "Please select thumbs up or thumbs down before submitting your feedback"; // else set feedback message to please select thumbs up or thumbs down before submitting your feedback
    }
});
