const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json({ limit: "1mb" }));
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");
const fetch = require("node-fetch");
const { OAuth2Client } = require("google-auth-library");

// built-in middleware
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

app.post("/user", async function (req, res) {
  try {
    test = {
      picture:
        "https://lh3.googleusercontent.com/a/AAcHTtdaQ2YJTuxFFRGvF_ERvilqfjnSumsYnfd71iO7PXo5=s96-c",
      sub: "106858174925066300006",
    };
    res.send(test);
  } catch {
    res.type("text");
    res.status(500).send("Failed to obtain user data");
  }
});

app.post("/verify", async function (req, res) {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Call the verifyIdToken to
    // verify and decode it
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get the JSON with all the user info
    const payload = ticket.getPayload();

    // This is a JSON object that contains
    // all the user info
    console.log("Successfully authenticate the JWT token.");
    res.send(payload);
  } catch {
    res.type("text");
    res.status(500).send("Failed to authenticate the JWT token.");
  }
});

//test
app.get("/test", async function (req, res) {
  try {
    console.log(process.env.TEST);
    res.type("text");
    res.send("hello");
  } catch {}
});

// detect music endpoint
app.post("/detect", async function (req, res) {
  const url = "https://shazam.p.rapidapi.com/songs/detect";
  const options = {
    method: "POST",
    headers: {
      "content-type": "text/plain",
      "X-RapidAPI-Key": process.env.SHAZAM_API_KEY,
      "X-RapidAPI-Host": process.env.SHAZAM_API_HOST,
    },
    body: req.body.audioBase64,
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    let songInfo = await extractSongInfo(result);
    res.send(songInfo);
  } catch (error) {
    res.type("text");
    res.status(500).send("An error occurred on the server. Try again later.");
  }
});

async function extractSongInfo(detectRes) {
  let title = detectRes.track.title;
  let artist = detectRes.track.subtitle;
  let cover = detectRes.track.images.coverarthq;
  let youtubeLink = "";
  for (let i = 0; i < detectRes.track.sections.length; i++) {
    if (detectRes.track.sections[i].type === "VIDEO") {
      youtubeLink = detectRes.track.sections[i].youtubeurl.actions[0].uri;
    }
  }

  let shazamLink = detectRes.track.url;
  let itunesLink = detectRes.track.hub.options[1].actions[0].uri;
  let spotifyLink = detectRes.track.hub.providers[0].actions[0].uri;
  spotifyLink =
    "https://open.spotify.com/search/" + spotifyLink.split(":").pop();
  let previewLink = "";
  let deezerLink = "";
  let album = "";

  // take the first and last word of title and append to the full artist.
  let titleArr = title.replace(/[\])}[{(]/g, "").split(" ");
  let fullName =
    titleArr[0] +
    "%20" +
    titleArr.pop() +
    "%20" +
    artist.replaceAll(" ", "%20");

  const url = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + fullName;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.DEEZER_API_KEY,
      "X-RapidAPI-Host": process.env.DEEZER_API_HOST,
    },
  };

  const response = await fetch(url, options).then((res) => res.json());
  previewLink = response.data[0].preview;
  deezerLink = response.data[0].link;
  album = response.data[0].album.title;

  return JSON.stringify({
    title,
    artist,
    cover,
    youtubeLink,
    shazamLink,
    itunesLink,
    spotifyLink,
    previewLink,
    deezerLink,
    album,
  });
}

// save user

// get user history

// save music

const PORT = process.env.PORT || 5000;

/** Listens on port 5000 for connection */
app.listen(PORT, () => console.log("Server started on port 5000"));
