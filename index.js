const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const ytdl = require("ytdl-core");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/handshake", (req, res) => {
  res.send({ content: "World" });
});

app.get("/download", (req, res) => {
  res.header("Content-Disposition", `attachment;filename="video.mp4"`);
  const url = req.query.url;
  ytdl(url, { format: "mp4" }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
