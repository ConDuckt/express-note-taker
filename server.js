const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

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

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = { title, text };
  fs.readFile("./public/assets/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile("./public/assets/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(notes);
    });
  });
});
