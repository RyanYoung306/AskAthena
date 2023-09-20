function updateChatHistory() {
    const chatHistoryDiv = document.getElementById("chatHistory");
    chatHistoryDiv.innerHTML = ""; // Clear the chat history div before re-populating it
    let chatHistory = [];

    // Load chat history from local storage if available
    if (localStorage.getItem('chatHistory')) {
      chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    }


    /*
    chatHistory.forEach((item) => {
      //remove unwanted tags
      item.response = item.response
      .replace(/<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2") // Remove tags
      .replace(/<\/?[^>]+>/gi, ""); // Remove other HTML tags

      const inputDiv = document.createElement("div");
      inputDiv.innerText = "User: " + item.input;
      chatHistoryDiv.appendChild(inputDiv);

      // const responseDiv = document.createElement("div");
      // responseDiv.innerText = "Bot: " + item.response + "\n\n";
      // chatHistoryDiv.appendChild(responseDiv);

      const responseLink = document.createElement("a");
      responseLink.href = item.response;
      responseLink.innerText = "Bot: " + item.response + "\n\n";
      chatHistoryDiv.appendChild(responseLink);

      const br = document.createElement("br");
      chatHistoryDiv.appendChild(br);
    });*/

    chatHistory.forEach((item) => {
      //remove unwanted tags
      const plainResponse = item.response
        .replace(/<a\s[^>]*href=['"]([^'"]*)['"][^>]*>(.*?)<\/a>/gi, "$1") // Extract link
        .replace(/<\/?[^>]+>/gi, ""); // Remove other HTML tags
    
      const inputDiv = document.createElement("div");
      inputDiv.innerText = "User: " + item.input;
      chatHistoryDiv.appendChild(inputDiv);
    
      const responseDiv = document.createElement("div");
      responseDiv.innerText = "Bot: ";
      chatHistoryDiv.appendChild(responseDiv);
    
      const responseLinks = plainResponse.match(/(https?:\/\/[^\s]+)/gi);
      if (responseLinks) {
        responseLinks.forEach((link) => {
          const responseLink = document.createElement("a");
          responseLink.href = link;
          responseLink.target = "_blank";
          responseLink.rel = "noopener noreferrer"; //stop malicious activities
          responseLink.innerHTML = link;
          chatHistoryDiv.appendChild(responseLink);
          chatHistoryDiv.appendChild(document.createElement("br"));
        });
      } else {
        const responseText = document.createElement("span");
        responseText.innerText = plainResponse;
        chatHistoryDiv.appendChild(responseText);
        chatHistoryDiv.appendChild(document.createElement("br"));
      }
    });
    
  }

  // Update the chat history every 0.5 seconds
  // setInterval(updateChatHistory, 500);

  // Load the initial chat history
  updateChatHistory();

  // Remove chat history from local storage and clear list on button click
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  clearHistoryBtn.addEventListener('click', () => {
    location.reload();//reload page
    localStorage.removeItem('chatHistory');
    chatHistory = [];
    historyList.innerHTML = '';
  });
