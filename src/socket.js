const { Server } = require("socket.io");

const users = []; // { username: string, id: string }[]
const onlineUsers = []; // string[]

const connectIoToServer = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.emit("online", onlineUsers.length);

    socket.on("user:new", (username) => {
      users.push({ username, id: socket.id });
      onlineUsers.push(socket.id);

      socket.emit("chat:connect");
      io.emit("online", onlineUsers.length);
    });

    socket.on("chat:message:new", ({ username, message }) => {
      console.log(username, message);

      socket.broadcast.emit("chat:message:new", { username, message });
    });

    socket.on("disconnect", () => {
      const foundIndex = users.findIndex((_) => _.id === socket.id);

      if (foundIndex !== -1) users.splice(foundIndex);

      const foundOnlineUserIndex = users.findIndex((_) => _ === socket.id);

      if (foundOnlineUserIndex !== -1) {
        onlineUsers.splice(foundOnlineUserIndex);

        io.emit("online", onlineUsers.length);
      }
    });
  });
};

module.exports = connectIoToServer;
