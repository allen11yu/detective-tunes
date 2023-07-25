const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config/process.env" });
const { Pool } = require("pg");
const fetch = require("node-fetch");

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

console.log(process.env.API_HOST);

// detect music endpoint
app.post("/detect", async function (req, res) {
  const url = "https://shazam.p.rapidapi.com/songs/detect";
  const options = {
    method: "POST",
    headers: {
      "content-type": "text/plain",
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": process.env.API_HOST,
    },
    body: req.body.audioBase64,
  };

  try {
    const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
    res.send(result);
  } catch (error) {
    res.type("text");
    res.status(500).send("An error occurred on the server. Try again later.");
  }
});

// save user

// get user history

// save music

//

const PORT = process.env.PORT || 5000;

/** Listens on port 5000 for connection */
app.listen(PORT, () => console.log("Server started on port 5000"));
