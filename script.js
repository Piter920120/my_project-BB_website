document.addEventListener("DOMContentLoaded", function () {

    // 🔹 ANIMACJA SCROLL
    const boxes = document.querySelectorAll(".news__box");

    const checkBoxes = () => {
        const triggerBottom = window.innerHeight * 0.8; 
        boxes.forEach((box) => {
            const boxTop = box.getBoundingClientRect().top;

            if (boxTop < triggerBottom) {
                box.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", checkBoxes);
    checkBoxes();


    // 🔹 BURGER MENU
    const burgerBtn = document.querySelector(".burger-btn");
    const navItems = document.querySelector(".nav__items");
    const navLinks = document.querySelectorAll(".nav__items a");

    if (burgerBtn) {
        burgerBtn.addEventListener("click", function () {
            navItems.classList.toggle("show");
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navItems.classList.remove("show");
        });
    });


    // 🔥 GŁÓWNE ŁADOWANIE NEWSÓW (NAPRAWIONE)
  fetch(`/news.json?v=${Date.now()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Załadowane newsy:", data);

            // 🔹 INDEX (2 newsy)
            const mainContainer = document.querySelector("#news-container");

            if (mainContainer) {
                const latestNews = data.slice(0, 2);

                latestNews.forEach(news => {
                    const newsBox = document.createElement("div");
                    newsBox.classList.add("news__box");

                    newsBox.innerHTML = `
                        <div class="news__box-img">
                            <img src="${news.image}" alt="news" class="news__img">
                        </div>
                        <div class="news__box-text">
                            <h3 class="news__title">${news.title}</h3>
                            <h4 class="news__date">${news.date}</h4>
                            <p class="news__tags">Tagi: ${news.tags.join(", ")}</p>
                            <p class="news__text">${news.text}</p>
                        </div>
                    `;

                    mainContainer.appendChild(newsBox);
                });
            }

            // 🔹 WSZYSTKIE NEWSY (np. w news.html)
            const fullContainer = document.querySelector(".news-container");

            if (fullContainer) {
                fullContainer.innerHTML = "";

                data.forEach(news => {
                    const newsBox = document.createElement("div");
                    newsBox.classList.add("news__box");

                    newsBox.innerHTML = `
                        <div class="news__box-img">
                            <img src="${news.image}" alt="news" class="news__img">
                        </div>
                        <div class="news__box-text">
                            <h3 class="news__title">${news.title}</h3>
                            <h4 class="news__date">${news.date}</h4>
                            <p class="news__tags">Tagi: ${news.tags.join(", ")}</p>
                            <p class="news__text">${news.text}</p>
                        </div>
                    `;

                    fullContainer.appendChild(newsBox);
                });
            }

            // 🔹 KATEGORIE
            const categories = [
                { tag: "junior", containerId: "junior-news" },
                { tag: "main", containerId: "main-news" },
                { tag: "extreme", containerId: "extreme-news" },
                { tag: "fit", containerId: "fit-news" },
                { tag: "graffiti", containerId: "graffiti-news" },
                { tag: "music", containerId: "music-news", emptyMessage: "Brak wydarzeń muzycznych na ten moment." },
                { tag: "party", containerId: "party-news" },
                { tag: "shop", containerId: "shop-news" },
                { tag: "tattoo", containerId: "tattoo-news" },
                { tag: "2k", containerId: "twokey-news" }
            ];

            categories.forEach(({ tag, containerId, emptyMessage }) => {
                renderNews(data, tag, containerId, emptyMessage);
            });

        })
        .catch(error => console.error("Błąd ładowania newsów:", error));


    // 🔹 COOKIES
    const cookiePopup = document.getElementById("cookiePopup");
    const acceptButton = document.getElementById("acceptCookies");

    if (cookiePopup && acceptButton) {
        if (!localStorage.getItem("cookiesAccepted")) {
            cookiePopup.classList.remove("hidden");
        }

        acceptButton.addEventListener("click", function() {
            localStorage.setItem("cookiesAccepted", "true");
            cookiePopup.classList.add("hidden");
        });
    }

});


// 🔹 FUNKCJA KATEGORII
function renderNews(data, tag, containerId, emptyMessage = null) {
    const filteredNews = data.filter(news => news.tags.includes(tag));
    const container = document.getElementById(containerId);

    if (!container) return;

    if (filteredNews.length === 0 && emptyMessage) {
        container.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    filteredNews.forEach(news => {
        const newsBox = document.createElement("div");
        newsBox.classList.add("news__box");

        newsBox.innerHTML = `
            <div class="news__box-img">
                <img src="${news.image}" alt="news" class="news__img">
            </div>
            <div class="news__box-text">
                <h3 class="news__title">${news.title}</h3>
                <h4 class="news__date">${news.date}</h4>
                <p class="news__text">${news.text}</p>
            </div>
        `;

        container.appendChild(newsBox);
    });
}
