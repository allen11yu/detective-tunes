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

app.get("/library/:user", async function (req, res) {
  try {
    let userId = req.params["user"];
    let libraryRes = await getLibrary(userId);
    res.send(libraryRes);
  } catch {
    res.type("text");
    res.status(500).send("Failed to obtain user library.");
  }
});

app.post("/add", async function (req, res) {
  try {
    let dbMusic = await getSong(req.body.musicId);
    if (dbMusic.length === 0) {
      await addSong(req.body.songData);
    }
    await addLibrary(req.body.userId, req.body.songData.musicId, new Date());
    res.send("Successfully added detected songs to the user library");
  } catch {
    res.type("text");
    res.status(500).send("Failed to add song to user library.");
  }
});

app.get("/user/:user", async function (req, res) {
  try {
    let userId = req.params["user"];
    let searchRes = await getUser(userId);
    res.json({
      sub: searchRes[0].user_id,
      picture: searchRes[0].pfp,
      name: searchRes[0].first_name,
    });
  } catch {
    res.type("text");
    res.status(500).send("Failed to obtain user data.");
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
      name: payload.given_name,
    });
  } catch {
    res.type("text");
    res.status(500).send("Failed to authenticate the JWT token.");
  }
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
    let dbMusic = await getSong(result.track.key);

    let songInfo = {};
    if (dbMusic.length === 0) {
      songInfo = await extractSongInfo(result);
      if (req.body.userId !== "") {
        await addSong(songInfo);
      }
    } else {
      songInfo = {
        musicId: dbMusic[0].music_id,
        title: dbMusic[0].title,
        artist: dbMusic[0].artist,
        cover: dbMusic[0].cover,
        youtube: dbMusic[0].youtube,
        shazam: dbMusic[0].shazam,
        itunes: dbMusic[0].itunes,
        spotify: dbMusic[0].spotify,
        preview: dbMusic[0].preview,
        deezer: dbMusic[0].deezer,
        album: dbMusic[0].album,
      };
    }

    if (req.body.userId !== "") {
      await addLibrary(req.body.userId, songInfo.musicId, new Date());
    }
    res.send(songInfo);
  } catch (error) {
    res.type("text");
    res.status(500).send("Failed to detect the song.");
  }
});

async function extractSongInfo(detectRes) {
  let youtube = "";
  for (let i = 0; i < detectRes.track.sections.length; i++) {
    if (detectRes.track.sections[i].type === "VIDEO") {
      youtube = detectRes.track.sections[i].youtubeurl.actions[0].uri;
    }
  }

  let spotify = detectRes.track.hub.providers[0].actions[0].uri;
  spotify = "https://open.spotify.com/search/" + spotify.split(":").pop();

  // take the first and last word of title and append to the full artist.\
  let artist = detectRes.track.subtitle;
  let title = detectRes.track.title;
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

  const deezerRes = await fetch(url, options).then((res) => res.json());
  return {
    musicId: detectRes.track.key,
    title: title,
    artist: artist,
    cover: detectRes.track.images.coverarthq,
    youtube: youtube,
    shazam: detectRes.track.url,
    itunes: detectRes.track.hub.options[1].actions[0].uri,
    spotify: spotify,
    preview: deezerRes.data[0].preview,
    deezer: deezerRes.data[0].link,
    album: deezerRes.data[0].album.title,
  };
}

async function addSong(songInfo) {
  let query =
    "INSERT INTO music (music_id, title, album, artist, cover, deezer, itunes, preview, shazam, spotify, youtube) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  let values = [
    songInfo.musicId,
    songInfo.title,
    songInfo.album,
    songInfo.artist,
    songInfo.cover,
    songInfo.deezer,
    songInfo.itunes,
    songInfo.preview,
    songInfo.shazam,
    songInfo.spotify,
    songInfo.youtube,
  ];
  await pool.query(query, values);
}

async function getSong(musicId) {
  let query = "SELECT * FROM music WHERE music_id = $1";
  let musicRes = await pool.query(query, [musicId]);
  return musicRes.rows;
}

async function getUser(userId) {
  let query = "SELECT * FROM dt_user WHERE user_id = $1";
  console.log("getting the user from DB");
  let searchRes = await pool.query(query, [userId]);
  return searchRes.rows;
}

async function newUser(user) {
  let query =
    "INSERT INTO dt_user (user_id, email, pfp, first_name, last_name) " +
    "VALUES ($1, $2, $3, $4, $5)";
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
    "UPDATE dt_user SET email = $2, pfp = $3, first_name = $4, last_name = $5 " +
    "WHERE user_id = $1";
  let values = [
    user.sub,
    user.email,
    user.picture,
    user.given_name,
    user.family_name,
  ];
  await pool.query(query, values);
}

// Link user to music
async function addLibrary(userId, musicId, currDate) {
  let query =
    "INSERT INTO detected (user_id, music_id, detected_date) " +
    "VALUES ($1, $2, $3)";
  let values = [userId, musicId, currDate];
  await pool.query(query, values);
}

// get user history
async function getLibrary(userId) {
  let query =
    "SELECT * FROM music " +
    "INNER JOIN (SELECT * " +
    "FROM detected " +
    "WHERE user_id = $1) AS linked " +
    "ON linked.music_id = music.music_id " +
    "ORDER BY detected_date DESC";
  let libraryRes = await pool.query(query, [userId]);
  return libraryRes.rows;
}

const PORT = process.env.PORT || 5000;

/** Listens on port 5000 for connection */
app.listen(PORT, () => console.log("Server started on port 5000"));
