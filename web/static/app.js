const chatBody = document.querySelector(".chat-body");
const txtInput = document.querySelector("#txtInput");
const send = document.querySelector(".send");

send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    renderUserMessage();
  }
});

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

const renderUserMessage = () => {
  var userInput = txtInput.value;
  renderMessageEle(userInput, "user");
  txtInput.value = "";

  // grab history of conversation
  var history = replaceAll(chatBody.innerHTML, "</div>", "\n");
  var history = replaceAll(history, "<div class=\"user-message\">", "User: ")
  var history = replaceAll(history, "<div class=\"chatbot-message\">", "You: ")

  // remove all question marks in query to prevent flask error
  history = replaceAll(history, "?", "");
  userInput = replaceAll(userInput, "?", "");
  alert(history);
  
  setTimeout(() => {
    renderChatbotResponse(userInput, history);
  }, 200); //todo: make this have some latency over some random normal distribution
};

const renderChatbotResponse = (userInput, history) => {

  fetch(`/ai_response/${userInput}/${history}`)
  .then(response => response.json())
  .then(data => {
    // Output the string and array using console.log
    renderMessageEle(data, "chatbot-message");
    
  });

};

const renderMessageEle = (txt, type) => {
  if (txt.length == 0) {
    return;
  }
  let className = "user-message";
  if (type !== "user") {
    className = "chatbot-message";
  }
  const messageEle = document.createElement("div");
  messageEle.innerHTML = txt;
  // const txtNode = document.createTextNode(txt);
  messageEle.classList.add(className);
  // messageEle.append(txtNode);
  chatBody.append(messageEle);
  chatBody.scrollTop = chatBody.scrollHeight;
};


// renderMessageEle("Hi you are going to be talking to a chatbot", "chatbot-message")

