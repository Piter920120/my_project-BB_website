const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;  // Ustawienie portu na localhost:3000

// 📌 Ustawienie folderu "BB_website" jako folder publiczny
app.use(express.static(path.join(__dirname, "BB_website")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Obsługa folderu obrazków
app.use("/img", express.static(path.join(__dirname, "BB_website/img")));

// 📌 Konfiguracja multer (przesyłanie plików)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "BB_website/img/"); // Folder na zdjęcia w BB_website/img
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Ustawienie nazwy pliku na unikalną
    }
});

const upload = multer({ storage: storage });

// 📌 Funkcja do generowania unikalnego ID
function generateUniqueId(newsArray) {
    const maxId = Math.max(...newsArray.map(news => parseInt(news.id) || 0), 0);
    return (maxId + 1).toString(); // Zwróć ID o jeden większe od największego
}

// 📌 1️⃣ Pobieranie newsów z `news.json`
app.get("/news", (req, res) => {
    fs.readFile("BB_website/news.json", "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Błąd odczytu pliku JSON" });
        res.json(JSON.parse(data));
    });
});

// 📌 2️⃣ Dodawanie nowego newsa
app.post("/add-news", upload.single("image"), (req, res) => {
    const { title, date, text, tags } = req.body;
    const imagePath = req.file ? `/img/${req.file.filename}` : "";

    if (!title || !date || !text || !tags) {
        return res.status(400).json({ error: "Wszystkie pola są wymagane!" });
    }

    fs.readFile("BB_website/news.json", "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Błąd odczytu pliku JSON" });

        const newsArray = JSON.parse(data);

        const newNews = {
            id: generateUniqueId(newsArray),
            title,
            date,
            text,
            image: imagePath,
            tags: tags.split(",")
        };

        newsArray.unshift(newNews);

        fs.writeFile("BB_website/news.json", JSON.stringify(newsArray, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Błąd zapisu do pliku JSON" });
            res.json({ message: "Dodano news!", news: newNews });
        });
    });
});

// 📌 3️⃣ Obsługa `admin.html`
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "BB_website", "admin.html"));
});

// 📌 Usuwanie newsa
app.delete("/delete-news/:id", (req, res) => {
    const { id } = req.params;

    fs.readFile("BB_website/news.json", "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Błąd odczytu pliku JSON" });

        const newsArray = JSON.parse(data);
        const updatedNews = newsArray.filter(news => news.id !== id);

        fs.writeFile("BB_website/news.json", JSON.stringify(updatedNews, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Błąd zapisu do pliku JSON" });
            res.json({ message: "News został usunięty." });
        });
    });
});

// 📌 Uruchomienie serwera na localhost:3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});