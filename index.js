const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const ffmpegstatic = require("ffmpeg-static");
const cp = require("child_process");
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

  const videoOptions = {
    quality: "highestvideo",
  };

  const audioOptions = {
    quality: "highestaudio",
  };

  let tracker = {
    start: Date.now(),
    audio: { downloaded: 0, total: Infinity },
    video: { downloaded: 0, total: Infinity },
    merged: { frame: 0, speed: "0x", fps: 0 },
  };

  let videoStream = ytdl
    .downloadFromInfo(info, videoOptions)
    .on("progress", (_, downloaded, total) => {
      tracker.video = { downloaded, total };
    });
  let audioStream = ytdl
    .downloadFromInfo(info, audioOptions)
    .on("progress", (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });

  const videoFormat = ytdl.chooseFormat(info.formats, videoOptions);
  const audioFormat = ytdl.chooseFormat(info.formats, audioOptions);

  const videoFilename = `./temp/video_${title}.${videoFormat.container}`;
  const audioFilename = `./temp/audio_${title}.${audioFormat.container}`;

  // videoStream.pipe(fs.createWriteStream(videoFilename));
  // audioStream.pipe(fs.createWriteStream(audioFilename));

  // Get the progress bar going
  const progressbar = setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    const toMB = (i) => (i / 1024 / 1024).toFixed(2);

    process.stdout.write(
      `Audio  | ${(
        (tracker.audio.downloaded / tracker.audio.total) *
        100
      ).toFixed(2)}% processed `
    );
    process.stdout.write(
      `(${toMB(tracker.audio.downloaded)}MB of ${toMB(
        tracker.audio.total
      )}MB).${" ".repeat(10)}\n`
    );

    process.stdout.write(
      `Video  | ${(
        (tracker.video.downloaded / tracker.video.total) *
        100
      ).toFixed(2)}% processed `
    );
    process.stdout.write(
      `(${toMB(tracker.video.downloaded)}MB of ${toMB(
        tracker.video.total
      )}MB).${" ".repeat(10)}\n`
    );

    process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
    process.stdout.write(
      `(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${" ".repeat(
        10
      )}\n`
    );

    process.stdout.write(
      `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(
        2
      )} Minutes.`
    );
    readline.moveCursor(process.stdout, 0, -3);
  }, 1000);

  const ffmpegProcess = cp.spawn(
    ffmpegstatic,
    [
      // Remove ffmpeg's console spamming
      "-loglevel",
      "0",
      "-hide_banner",
      "-progress",
      "pipe:3",
      "-i",
      "pipe:4",
      "-i",
      "pipe:5",
      // Choose some fancy codes
      // "-c:v",
      // "libx265",
      // "-x265-params",
      // "log-level=0",
      // "-c:a",
      // "flac",
      // Define output container
      "-f",
      "matroska",
      "pipe:6",
    ],
    {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        "inherit",
        "inherit",
        "inherit",
        /* Custom: pipe:3, pipe:4, pipe:5, pipe:6 */
        "pipe",
        "pipe",
        "pipe",
        "pipe",
      ],
    }
  );

  ffmpegProcess.on("close", () => {
    console.log("done");
    clearInterval(progressbar);
  });

  ffmpegProcess.stdio[3].on("data", (chunk) => {
    // Parse the param=value list returned by ffmpeg
    const lines = chunk.toString().trim().split("\n");
    const args = {};
    for (const l of lines) {
      const [key, value] = l.trim().split("=");
      args[key] = value;
    }
    tracker.merged = args;
  });

  audioStream.pipe(ffmpegProcess.stdio[4]);
  videoStream.pipe(ffmpegProcess.stdio[5]);

  res.header("Content-Disposition", `attachment;filename="${title}.mkv"`);

  ffmpegProcess.stdio[6].pipe(res);

  // let videoDone = false;
  // let audioDone = false;

  // const mergeVideoAudio = () => {
  //   const outputFilename = `./temp/out.mp4`;
  //   const stream = fs.createWriteStream(outputFilename);

  //   ffmpeg(videoFilename)
  //     .format("mp4")
  //     .addInput(audioFilename)
  //     .output(stream, { end: true })
  //     .on("start", () => {
  //       console.log("Started yo");
  //     })
  //     .on("error", (err) => {
  //       console.log("An error occurred: " + err.message);
  //     })
  //     .on("progress", (p) => {
  //       console.log(p);
  //     })
  //     .on("end", () => {
  //       console.log("Processing finished !");
  //     });
  //   // .saveToFile(outputFilename);
  // };

  // videoStream.on("end", () => {
  //   videoDone = true;
  //   if (videoDone && audioDone) {
  //     mergeVideoAudio();
  //   }
  // });

  // audioStream.on("end", () => {
  //   audioDone = true;
  //   if (videoDone && audioDone) {
  //     mergeVideoAudio();
  //   }
  // });
});

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
