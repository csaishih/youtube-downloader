const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ffmpeg = require("fluent-ffmpeg");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const searchLimit = 20;
  ytsr
    .getFilters(keyword)
    .then((filters) => {
      const filter = filters.get("Type").find((o) => {
        return o.label === "Video";
      });
      ytsr(filter.query, { limit: searchLimit })
        .then((result) => {
          console.log("sending", result.items.length);
          res.send({ content: result });
        })
        .catch((error) => {
          console.log("There is an error with fetching video");
          console.error(error);
        });
    })
    .catch((error) => {
      console.log("There is an error with filters");
      console.error(error);
    });
});

app.get("/download", (req, res) => {
  const url = req.query.url;
  ytdl
    .getInfo(url)
    .then((info) => {
      const title = cleanFileName(info.videoDetails.title);
      res.header("Content-Disposition", `attachment;filename="${title}.mp3"`);

      let audio = ytdl.downloadFromInfo(info, {
        quality: "highestaudio",
      });

      ffmpeg(audio).format("mp3").audioCodec("libmp3lame").pipe(res);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const cleanFileName = (filename) => {
  // [\W_] is the shorthand for [^a-zA-Z0-9]
  return filename.replace(/[\W_]+/g, "_");
};
