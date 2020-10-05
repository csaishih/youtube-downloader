const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const readline = require("readline");

const PORT = process.env.PORT || 5000;
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/download", async (req, res) => {
  const url = req.query.url;
  const info = await ytdl.getInfo(url);
  const title = cleanFileName(info.videoDetails.title);

  const options = {
    quality: "highestaudio",
  };

  const format = ytdl.chooseFormat(info.formats, options);

  // res.header(
  //   "Content-Disposition",
  //   `attachment;filename="${title}.${format.container}"`
  // );

  res.header("Content-Disposition", `attachment;filename="${title}.mp3"`);

  let audio = ytdl
    .downloadFromInfo(info, options)
    .on("progress", (_, downloaded, total) => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(
        `Downloaded: ${((downloaded / total) * 100).toFixed(2)}%`
      );
    });
  // .pipe(res);

  ffmpeg(audio).format("mp3").audioCodec("libmp3lame").pipe(res);

  // streamToMP3(audio, "./temp/out.mp3");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const cleanFileName = (filename) => {
  // [\W_] is the shorthand for [^a-zA-Z0-9]
  return filename.replace(/[\W_]+/g, "_");
};

const streamToMP3 = (stream, output) => {
  ffmpeg(stream)
    .save(output)
    .on("progress", (p) => {
      console.log(p);
      console.log(`${p} kb downloaded`);
    })
    .on("end", () => {
      console.log(`Done`);
    });
};
