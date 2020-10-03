const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const PORT = process.env.PORT || 5000;
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/handshake", (req, res) => {
  res.send({ content: "World" });
});

app.get("/test", async (req, res) => {
  const url = "https://www.youtube.com/watch?v=7WZB2n6DV6I";

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title;

  info.formats.forEach((format) => {
    console.log(format.itag);
  });

  // console.log(js);

  res.json(info);
});

// app.get("/download", async (req, res) => {
//   const url = req.query.url;
//   const info = await ytdl.getInfo(url);
//   const title = cleanFileName(info.videoDetails.title);

//   let videoStream = ytdl.downloadFromInfo(info, {
//     quality: "highestvideo",
//     filter: (format) => format.container === "mp4",
//   });

//   let audioStream = ytdl.downloadFromInfo(info, {
//     quality: "highestaudio",
//     filter: (format) => format.container === "mp4",
//   });

//   streamToMP3(audioStream, "./temp/audio.mp3");

//   // const video = fs.createWriteStream("./temp/video.mp4");
//   // const audio = fs.createWriteStream("./temp/audio.mp4");

//   // videoStream.pipe(video);
//   // audioStream.pipe(audio);

//   // audioStream.on("end", () => {
//   //   extractToMP3("./temp/audio.mp4", "./temp/audio.mp3");
//   // });

//   // res.send({ content: "okay" });
// });

app.get("/download/video", async (req, res) => {
  const url = req.query.url;
  const info = await ytdl.getInfo(url);
  const title = cleanFileName(info.videoDetails.title);
  const options = {
    quality: "highestvideo",
  };
  const format = ytdl.chooseFormat(info.formats, options);
  res.header(
    "Content-Disposition",
    `attachment;filename="${title}.${format.container}"`
  );

  ytdl(url, options).pipe(res);
});

app.get("/download/audio", async (req, res) => {
  const url = req.query.url;
  const info = await ytdl.getInfo(url);
  const title = cleanFileName(info.videoDetails.title);
  const options = {
    quality: "highestaudio",
  };
  const format = ytdl.chooseFormat(info.formats, options);
  res.header(
    "Content-Disposition",
    `attachment;filename="${title}.${format.container}"`
  );

  ytdl.downloadFromInfo(info, options).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const cleanFileName = (filename) => {
  let cleanedFilename = filename.replace(/\s+/g, "_").toLowerCase();
  return cleanedFilename;
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
