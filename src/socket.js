const { Server } = require("socket.io");

const users = []; // { username: string, id: string }[]

const connectIoToServer = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.emit("online", users.length);

    socket.on("user:new", (username) => {
      users.push({ username, id: socket.id });

      console.log(users);

      socket.emit("chat:connect");
      io.emit("online", users.length);
    });

    socket.on("chat:message:new", ({ username, message }) => {
      console.log(username, message);

      socket.broadcast.emit("chat:message:new", { username, message });
    });

    socket.on("disconnect", () => {
      const foundIndex = users.findIndex((_) => _.id === socket.id);

      if (foundIndex !== -1) {
        users.splice(foundIndex, 1);
        io.emit("online", users.length);
      }
    });
  });
};

module.exports = connectIoToServer;
