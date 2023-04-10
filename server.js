const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path = require("path");

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

const fs = require("fs");

app.get("/api/notes", (req, res) => {
  fs.readFile("./public/assets/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

const { v4: uuidv4 } = require("uuid");

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuidv4() };
  fs.readFile("./public/assets/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    console.log("notes", notes);
    fs.writeFile("./public/assets/db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        throw err;
      };
      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
