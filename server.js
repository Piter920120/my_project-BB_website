require("dotenv").config();

const express = require("express");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

/*
=====================================
Middleware
=====================================
*/

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);

/*
=====================================
Folder strony
=====================================
*/

const websitePath = path.join(__dirname);

app.use(express.static(websitePath));

app.use(
    "/img",
    express.static(
        path.join(websitePath, "img")
    )
);

/*
=====================================
Auth
=====================================
*/

function requireLogin(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect(
            "/admin-login.html"
        );
    }

    next();
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD
    ) {
        req.session.loggedIn = true;

        return res.redirect("/admin");
    }

    res.status(401).send(
        "Nieprawidłowy login lub hasło."
    );
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect(
            "/admin-login.html"
        );
    });
});

/*
=====================================
Strony
=====================================
*/

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            websitePath,
            "index.html"
        )
    );
});

app.get(
    "/admin",
    requireLogin,
    (req, res) => {
        res.sendFile(
            path.join(
                websitePath,
                "admin.html"
            )
        );
    }
);

app.get("/junior", (req, res) => {
    res.sendFile(
        path.join(
            websitePath,
            "components",
            "junior.html"
        )
    );
});

app.get("/senior", (req, res) => {
    res.sendFile(
        path.join(
            websitePath,
            "components",
            "senior.html"
        )
    );
});

/*
=====================================
Multer
=====================================
*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            path.join(
                websitePath,
                "img"
            )
        );
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
                path.extname(
                    file.originalname
                )
        );
    }
});

const upload = multer({
    storage
});

/*
=====================================
News
=====================================
*/

const newsFilePath = path.join(
    websitePath,
    "news.json"
);

function generateUniqueId(newsArray) {
    const maxId = Math.max(
        ...newsArray.map(
            news =>
                parseInt(news.id) || 0
        ),
        0
    );

    return (
        maxId + 1
    ).toString();
}

/*
=====================================
Pobieranie newsów
=====================================
*/

app.get("/news", (req, res) => {
    fs.readFile(
        newsFilePath,
        "utf8",
        (err, data) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        error: "Błąd odczytu pliku JSON"
                    });
            }

            res.json(
                JSON.parse(data)
            );
        }
    );
});

/*
=====================================
Dodawanie newsa
=====================================
*/

app.post(
    "/add-news",
    requireLogin,
    upload.single("image"),
    (req, res) => {
     const {
    title,
    date,
    text,
    tags,
    type,
    instagramUrl
} = req.body;

        const imagePath = req.file
            ? `/img/${req.file.filename}`
            : "";

        if (
           !title ||
    !date ||
    !tags
        ) {
            return res
                .status(400)
                .json({
                    error:
                        "Wszystkie pola są wymagane!"
                });
        }

        fs.readFile(
            newsFilePath,
            "utf8",
            (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            error:
                                "Błąd odczytu pliku JSON"
                        });
                }

                const newsArray =
                    JSON.parse(data);

              const newNews = {

    id: generateUniqueId(
        newsArray
    ),

    type:
        type ||
        "article",

    title,

    date,

    text:
        text || "",

    image:
        imagePath,

    instagramUrl:
        instagramUrl || "",

    tags:
        tags.split(",")
};

                newsArray.unshift(
                    newNews
                );

                fs.writeFile(
                    newsFilePath,
                    JSON.stringify(
                        newsArray,
                        null,
                        2
                    ),
                    err => {
                        if (err) {
                            return res
                                .status(
                                    500
                                )
                                .json({
                                    error:
                                        "Błąd zapisu do pliku JSON"
                                });
                        }

                        res.json({
                            message:
                                "Dodano news!",
                            news: newNews
                        });
                    }
                );
            }
        );
    }
);

/*
=====================================
Usuwanie newsa
=====================================
*/

app.delete(
    "/delete-news/:id",
    requireLogin,
    (req, res) => {
        const { id } = req.params;

        fs.readFile(
            newsFilePath,
            "utf8",
            (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .json({
                            error:
                                "Błąd odczytu pliku JSON"
                        });
                }

                let newsArray =
                    JSON.parse(data);

                const updatedNews =
                    newsArray.filter(
                        news =>
                            news.id !==
                            id
                    );

                fs.writeFile(
                    newsFilePath,
                    JSON.stringify(
                        updatedNews,
                        null,
                        2
                    ),
                    err => {
                        if (err) {
                            return res
                                .status(
                                    500
                                )
                                .json({
                                    error:
                                        "Błąd zapisu do pliku JSON"
                                });
                        }

                        res.json({
                            message:
                                "News został usunięty."
                        });
                    }
                );
            }
        );
    }
);

/*
=====================================
Start
=====================================
*/

app.listen(PORT, () => {
    console.log(
        `✅ Serwer działa na: http://localhost:${PORT}`
    );
});