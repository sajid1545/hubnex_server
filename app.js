require("dotenv").config();
const fs = require('fs');
const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const pageRouter = require("./routes/page");
const qureyPage = require("./routes/qurey");
const adminRoutes = require("./routes/admin");
const usersRoutes = require("./routes/users");
const companyRoutes = require("./routes/company");
const recruiterRoutes = require("./routes/recruiter");
const connection = require("./db");
const Grid = require("gridfs-stream");
// const helmet = require('helmet');
const compression = require('compression');
// const morgan = require('morgan');

const app = express();

let gfs, gridFsBucket;
connection();
const conn = mongoose.connection;
conn.once("open", function () {
  // Add this line in the code
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "documents",
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("documents");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const cors = require("cors");

// const corsOptions = {
//   origin: ["http://localhost:5000", "http://localhost:3000","https://rework-873d1.web.app/"],
//   optionsSuccessStatus: 200, // For legacy browser support
//   methods: "GET, PUT,POST,DELETE ",
// };

app.use(cors());

// const accessLogStream = fs.createWriteStream(path.join(__dirname,'accessLog'),{flags:'a'});

// app.use(helmet());
app.use(compression());
// app.use(morgan('combined',{stream: accessLogStream}));

app.use("/admin", pageRouter);
app.use("/recruiter", recruiterRoutes);
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/admin", qureyPage);


app.use((error, req, res, next) => {
  console.log(error.message);
  const status = error.statusCode || 500;
  if (error.statusCode === 500) {
    error.message = "Internal Server Error.";
  }
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

dburl = process.env.MONGODB_URL;
mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongodb connection error found: "));
db.once("open", () => {
  console.log(`mongoose is running.`);
  app.listen(process.env.PORT || 5000, () => {
    console.log(`server is running.`);
  });
});
