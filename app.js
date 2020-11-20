const app = require("express")();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv/config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const usersRouter = require('./controllers/UserController')

const datasRouter = require('./controllers/DataController')


app.use('/users',usersRouter)
app.use('/datas',datasRouter)


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
app.listen(process.env.PORT || 5000, () => {
  console.log("sunucu ayakta");
});

//mongodb+srv://admin:qvkLpBhEUigott1F@cluster.lf9ra.mongodb.net/passmas?retryWrites=true&w=majority
