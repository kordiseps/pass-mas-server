const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");
const path = require("path");
const socketio = require("socket.io");

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersRouter = require("./controllers/UserController");

const datasRouter = require("./controllers/DataController");

app.use("/users", usersRouter);
app.use("/datas", datasRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send(200, { message: "apiye hoşgeldin" });
});

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
  process.env.CONNECTION_STRING,
  { useNewUrlParser: true },
  () => {
    console.log("connected db");
  }
);
server.listen(process.env.PORT || 5000, () => {
  console.log("sunucu ayakta");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("send", (obj) => {
    io.to(obj.room).emit("copy", obj.msg);
  });
});
