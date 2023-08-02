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

//
app.get("/user/:user", async function (req, res) {
  try {
    let userId = req.params["user"];
    let searchRes = await getUser(userId);
    console.log(searchRes);

    res.json({
      sub: searchRes[0].user_id,
      picture: searchRes[0].pfp,
    });
  } catch {
    res.type("text");
    res.status(500).send("Failed to obtain user data");
  }
});

app.post("/verify", async function (req, res) {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await getUser(payload.sub);
    if (user.length === 0) {
      console.log("user " + payload.sub + " not found, creating a new entry.");
      await newUser(payload);
    } else {
      console.log("updating user info");
      await updateUser(payload);
    }
    res.json({
      sub: payload.sub,
      picture: payload.picture,
    });
  } catch {
    res.type("text");
    res.status(500).send("Failed to authenticate the JWT token.");
  }
});

//test
app.post("/test", async function (req, res) {
  try {
    let searchUserQuery = "SELECT * FROM dt_user";
    console.log("searching");
    let search = await pool.query(searchUserQuery);
    console.log(search);
    res.send({
      test: "testing",
    });
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
  let musicId = detectRes.track.key;
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


  /// add to data base

  return JSON.stringify({
    musicId,
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

async function getUser(userId) {
  let query = "SELECT * FROM dt_user WHERE user_id = $1";
  console.log("getting the user from DB");
  let searchRes = await pool.query(query, [userId]);
  return searchRes.rows;
}

async function newUser(user) {
  let query =
    "INSERT INTO dt_user (user_id, email, pfp, first_name, last_name) VALUES ($1, $2, $3, $4, $5);";
  let values = [
    user.sub,
    user.email,
    user.picture,
    user.given_name,
    user.family_name,
  ];
  await pool.query(query, values);
}

async function updateUser(user) {
  let query =
    "UPDATE dt_user SET email = $2, pfp = $3, first_name = $4, last_name = $5 WHERE user_id = $1;";
  let values = [
    user.sub,
    user.email,
    user.picture,
    user.given_name,
    user.family_name,
  ];
  await pool.query(query, values);
}

// when detected, check if music exist in table, if not add music entry
// get user info
// when user login, check if user exist in table, if not add user entry
// get user history

const PORT = process.env.PORT || 5000;

/** Listens on port 5000 for connection */
app.listen(PORT, () => console.log("Server started on port 5000"));
