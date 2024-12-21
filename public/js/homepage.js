const socket = io();

const chatButton = document.getElementById("chat-button");
const usernameInput = document.getElementById("username-input");
const sendMessageBtn = document.getElementById("send-message-btn");
const onlineCountSpan = document.getElementById("online-count");

let username = "";

chatButton.addEventListener("click", (e) => {
  e.preventDefault();

  username = usernameInput.value;

  socket.emit("user:new", username);
});

sendMessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

const openChatScreen = () => {
  const mainContainer = document.querySelector(".container");
  const chatContainer = document.querySelector(".chat-container");

  mainContainer.style.display = "none";
  chatContainer.style.display = "flex";
};

const handleNewMessage = ({ username, message }) => {
  const newMessageElement = document.createElement("div");
  newMessageElement.className = "message other";
  newMessageElement.innerHTML = `<span class="username">${username}:</span>${message}`;
  chatBox.appendChild(newMessageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const sendMessage = () => {
  const chatBox = document.getElementById("chatBox");
  const messageInput = document.getElementById("messageInput");
  const userMessage = messageInput.value.trim();

  if (username && userMessage) {
    socket.emit("chat:message:new", { username, message: userMessage });

    // Append user message
    const userMessageElement = document.createElement("div");
    userMessageElement.className = "message user";
    userMessageElement.innerHTML = `<span class="username">${username}:</span>${userMessage}`;
    chatBox.appendChild(userMessageElement);

    // Clear message input
    messageInput.value = "";

    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

const handleOnlineCount = (count) => {
  onlineCountSpan.innerHTML = `(Online: ${count})`;
};

socket.on("chat:connect", () => {
  openChatScreen();
});

socket.on("chat:message:new", handleNewMessage);

socket.on("online", handleOnlineCount);
