const express = require("express");
const app = express();


const PORT = process.env.PORT || 8000;

/** Listens on port 8000 for connection */
app.listen(PORT, () => console.log("Server started on port 8000"));