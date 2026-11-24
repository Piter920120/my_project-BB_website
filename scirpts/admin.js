document.addEventListener("DOMContentLoaded", () => {
    // Sprawdzamy, czy użytkownik jest zalogowany
    if (localStorage.getItem("isAdmin") === "true") {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";
        loadNews(); // Ładujemy dostępne newsy do formularza usuwania
    }

    // Obsługa logowania
    document.getElementById("login-button").addEventListener("click", () => {
        const password = document.getElementById("admin-password").value;
        if (password === "ojciecdyrektor") { // 🛑 Zmień na własne hasło!
            localStorage.setItem("isAdmin", "true");
            document.getElementById("login-form").style.display = "none";
            document.getElementById("admin-panel").style.display = "block";
            loadNews(); // Ładujemy dostępne newsy do formularza usuwania
        } else {
            document.getElementById("login-status").textContent = "Błędne hasło!";
        }
    });

    // 🔹 NOWA FUNKCJA WYLOGOWYWANIA
    document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.removeItem("isAdmin"); // Usunięcie sesji admina
        document.getElementById("admin-panel").style.display = "none";
        document.getElementById("login-form").style.display = "block";
    });

    // 🔹 OBSŁUGA FORMULARZA DODAWANIA NEWSA
    document.getElementById("newsForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", document.getElementById("title").value);
        formData.append("date", document.getElementById("date").value);
        formData.append("text", document.getElementById("text").value);

        // Obsługa tagów (wielokrotny wybór)
        const selectedTags = Array.from(document.getElementById("tags").selectedOptions).map(option => option.value);
        formData.append("tags", selectedTags.join(","));

        const imageFile = document.getElementById("image").files[0];
        if (imageFile) {
            // Walidacja pliku obrazu (możesz rozszerzyć o inne typy plików)
            if (!imageFile.type.startsWith("image/")) {
                alert("Proszę wybrać plik obrazu!");
                return;
            }
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch("/add-news", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert("News dodany!");
                document.getElementById("newsForm").reset();
                loadNews(); // Ponownie ładujemy listę newsów po dodaniu
            } else {
                alert("Błąd: " + result.error);
            }
        } catch (error) {
            alert("Błąd połączenia z serwerem.");
        }
    });

    // 🔹 OBSŁUGA FORMULARZA USUWANIA NEWSA
    document.getElementById("deleteNewsForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const newsId = document.getElementById("newsSelect").value;

        try {
            const response = await fetch(`/delete-news/${newsId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("News usunięty!");
                loadNews(); // Ponownie ładujemy listę newsów po usunięciu
            } else {
                alert("Błąd usuwania newsu.");
            }
        } catch (error) {
            alert("Błąd połączenia z serwerem.");
        }
    });

    // Funkcja do załadowania dostępnych newsów do formularza usuwania
    async function loadNews() {
        try {
            const response = await fetch("/news");
            const news = await response.json();
            const newsSelect = document.getElementById("newsSelect");
            newsSelect.innerHTML = ''; // Czyszczenie obecnych opcji

            // Dodanie każdej opcji do selecta
            news.forEach(newsItem => {
                const option = document.createElement("option");
                option.value = newsItem.id;
                option.textContent = newsItem.title;
                newsSelect.appendChild(option);
            });
        } catch (error) {
            alert("Błąd ładowania newsów.");
        }
    }

    // Funkcja generująca unikalne ID dla nowego newsa (jeśli konieczne)
    // Funkcja została usunięta, zakładając, że ID jest generowane po stronie serwera.
});
