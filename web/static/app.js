const chatBody = document.querySelector(".chat-body");
const TOCBody = document.querySelector(".toc-body");
const txtInput = document.querySelector("#txtInput");
const middle = document.querySelector("#middle");
const send = document.querySelector(".send");

send.addEventListener("click", () => renderUserMessage());

txtInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    renderUserMessage();
  }
});

const renderUserMessage = () => {
  const userInput = txtInput.value;
  renderMessageEle(userInput, "user");
  txtInput.value = "";
  setTimeout(() => {
    renderChatbotResponse(userInput);
  }, 200); //todo: make this have some latency over some random normal distribution
};

const renderChatbotResponse = (userInput) => {

  fetch(`/call_python_function/${userInput}`)
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
};


renderMessageEle("Hi you are going to be talking to a chatbot", "chatbot-message")

