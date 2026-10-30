
const $ = (selector) => document.querySelector(selector);

const menuBtn = $("#menuBtn");
const panel = $("#filterPanel");
const overlay = $("#overlay");

function openFilters() {
    panel.classList.add("open");
    overlay.classList.add("show");
    menuBtn.setAttribute("aria-expanded", "true");
}

function closeFilters() {
    panel.classList.remove("open");
    overlay.classList.remove("show");
    menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
    panel.classList.contains("open") ? closeFilters() : openFilters();
});

$("#closeBtn").addEventListener("click", closeFilters);
overlay.addEventListener("click", closeFilters);
$("#heroFilterBtn").addEventListener("click", openFilters);
$("#emptyFilterBtn").addEventListener("click", openFilters);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeFilters();
        $("#authDialog").close();
    }
});

// COUNTRIES: ISO region codes, with localized country names.
const countryCodes = `
AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW
BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ
DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT
GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW
KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC
MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH
PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA
SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE
GB US UY UZ VU VA VE VN YE ZM ZW PS XK
`.trim().split(/\s+/);

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
const countrySelect = $("#country");

countryCodes
    .map(code => ({ code, name: displayNames.of(code) }))
    .filter(item => item.name && item.name !== item.code)
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(({ code, name }) => {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        countrySelect.appendChild(option);
    });

// YEARS: 1900 through the current year, newest first.
const yearSelect = $("#year");
const currentYear = new Date().getFullYear();

for (let year = currentYear; year >= 1900; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// GENRES: broad selection, including international film categories.
const genres = [
    "Action", "Adventure", "Animation", "Anime", "Biography",
    "Comedy", "Crime", "Documentary", "Drama", "Family",
    "Fantasy", "Film Noir", "History", "Horror", "Musical",
    "Mystery", "Romance", "Romantic Comedy", "Science Fiction",
    "Sci-Fi", "Sport", "Thriller", "War", "Western",
    "Psychological", "Supernatural", "Martial Arts", "Disaster",
    "Coming of Age", "Satire", "Political", "Historical",
    "Epic", "Music", "Concert", "Short Film", "Experimental",
    "Crime Thriller", "Dark Comedy", "Melodrama", "Legal Drama",
    "Medical Drama", "Spy", "Heist", "Survival", "Teen",
    "LGBTQ+", "Religious", "Road Movie", "Slasher", "Gothic",
    "Found Footage", "Cyberpunk", "Steampunk", "Parody",
    "Mockumentary", "Anthology", "Noir Thriller", "Family Drama"
];

const genreSelect = $("#genre");

genres.sort().forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
});

// COMMON MOVIE LANGUAGES
const languages = [
    ["en", "English"], ["uz", "Uzbek"], ["ru", "Russian"],
    ["ar", "Arabic"], ["bn", "Bengali"], ["zh", "Chinese"],
    ["cs", "Czech"], ["da", "Danish"], ["nl", "Dutch"],
    ["fi", "Finnish"], ["fr", "French"], ["de", "German"],
    ["el", "Greek"], ["he", "Hebrew"], ["hi", "Hindi"],
    ["hu", "Hungarian"], ["id", "Indonesian"], ["it", "Italian"],
    ["ja", "Japanese"], ["ko", "Korean"], ["ms", "Malay"],
    ["no", "Norwegian"], ["fa", "Persian"], ["pl", "Polish"],
    ["pt", "Portuguese"], ["pa", "Punjabi"], ["ro", "Romanian"],
    ["es", "Spanish"], ["sv", "Swedish"], ["ta", "Tamil"],
    ["te", "Telugu"], ["th", "Thai"], ["tr", "Turkish"],
    ["uk", "Ukrainian"], ["vi", "Vietnamese"], ["kk", "Kazakh"],
    ["ky", "Kyrgyz"], ["tg", "Tajik"], ["az", "Azerbaijani"],
    ["ps", "Pashto"], ["ur", "Urdu"], ["sr", "Serbian"],
    ["hr", "Croatian"], ["bg", "Bulgarian"], ["hy", "Armenian"],
    ["ka", "Georgian"], ["et", "Estonian"], ["lv", "Latvian"],
    ["lt", "Lithuanian"], ["sw", "Swahili"], ["am", "Amharic"],
    ["fil", "Filipino"], ["is", "Icelandic"], ["ne", "Nepali"],
    ["si", "Sinhala"], ["km", "Khmer"], ["lo", "Lao"],
    ["my", "Burmese"]
];

const movieLanguage = $("#movieLanguage");

languages.sort((a, b) => a[1].localeCompare(b[1])).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    movieLanguage.appendChild(option);
});

// FILTERS
const filterIds = [
    "searchInput", "country", "year", "genre",
    "movieLanguage", "rating", "sort"
];

function getFilters() {
    return Object.fromEntries(
        filterIds.map(id => [id, $("#" + id).value])
    );
}

function showActiveFilters(filters) {
    const tags = [];

    if (filters.searchInput) tags.push(`Search: ${filters.searchInput}`);

    if (filters.country) {
        const option = countrySelect.selectedOptions[0];
        tags.push(option.textContent);
    }

    if (filters.year) tags.push(filters.year);
    if (filters.genre) tags.push(filters.genre);

    if (filters.movieLanguage) {
        tags.push(movieLanguage.selectedOptions[0].textContent);
    }

    if (filters.rating) tags.push(`${filters.rating}+ rating`);

    $("#activeFilters").textContent = tags.length
        ? tags.join(" / ").toUpperCase()
        : "ALL MOVIES";

    // This event can be used to connect a real movie API later.
    document.dispatchEvent(new CustomEvent("maxfilm:filters", {
        detail: filters
    }));
}

$("#applyBtn").addEventListener("click", () => {
    showActiveFilters(getFilters());
    closeFilters();
    $("#results").scrollIntoView({ behavior: "smooth" });
});

$("#resetBtn").addEventListener("click", () => {
    filterIds.forEach(id => {
        $("#" + id).value = "";
    });

    $("#sort").value = "popular";
    showActiveFilters(getFilters());
});

$("#exploreBtn").addEventListener("click", () => {
    $("#results").scrollIntoView({ behavior: "smooth" });
});

// INTERFACE LANGUAGE
const translations = {
    en: {
        welcome: "WELCOME TO",
        description: "Enter a world of stories. Discover movies beyond imagination.",
        explore: "EXPLORE MOVIES ↗",
        filter: "⌘ FILTER MOVIES",
        search: "Search movie",
        country: "Country",
        year: "Release year",
        genre: "Genre",
        language: "Movie language",
        rating: "Minimum rating",
        sort: "Sort by",
        login: "Log In",
        signup: "Sign Up",
        filters: "Movie Filters",
        apply: "Apply Filters ↗",
        reset: "Reset",
        find: "Find your next",
        favorite: "favorite."
    },
    uz: {
        welcome: "MAX FILMGA",
        description: "Hikoyalar olamiga kir. Tasavvurdan tashqaridagi kinolarni kashf et.",
        explore: "KINOLARNI KO'RISH ↗",
        filter: "⌘ KINO FILTRLARI",
        search: "Kino qidirish",
        country: "Davlat",
        year: "Chiqqan yil",
        genre: "Janr",
        language: "Kino tili",
        rating: "Minimal reyting",
        sort: "Saralash",
        login: "Kirish",
        signup: "Ro'yxatdan o'tish",
        filters: "Kino filtrlari",
        apply: "Filtrlarni qo'llash ↗",
        reset: "Tozalash",
        find: "O'zingga yoqqan",
        favorite: "kinoni top."
    },
    ru: {
        welcome: "ДОБРО ПОЖАЛОВАТЬ В",
        description: "Погрузись в мир историй. Открой фильмы за пределами воображения.",
        explore: "СМОТРЕТЬ ФИЛЬМЫ ↗",
        filter: "⌘ ФИЛЬТРЫ ФИЛЬМОВ",
        search: "Поиск фильма",
        country: "Страна",
        year: "Год выпуска",
        genre: "Жанр",
        language: "Язык фильма",
        rating: "Минимальный рейтинг",
        sort: "Сортировка",
        login: "Войти",
        signup: "Регистрация",
        filters: "Фильтры фильмов",
        apply: "Применить фильтры ↗",
        reset: "Сбросить",
        find: "Найди свой",
        favorite: "любимый фильм."
    }
};

const originalLabels = {
    searchInput: "Search movie",
    country: "Country",
    year: "Release year",
    genre: "Genre",
    movieLanguage: "Movie language",
    rating: "Minimum rating",
    sort: "Sort by"
};

function setLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.documentElement.lang = lang;

    $("#welcomeTitle").innerHTML =
        `${t.welcome}<br><span>MAX FILM</span>`;

    $("#heroDescription").textContent = t.description;
    $("#exploreBtn").textContent = t.explore;
    $("#heroFilterBtn").textContent = t.filter;
    $("#emptyFilterBtn").textContent =
        lang === "uz" ? "FILTRLARNI OCHISH" :
        lang === "ru" ? "ОТКРЫТЬ ФИЛЬТРЫ" : "OPEN FILTERS";

    document.querySelectorAll('[data-auth="login"]').forEach(el => {
        el.textContent = t.login;
    });

    document.querySelectorAll('[data-auth="signup"]').forEach(el => {
        el.textContent = t.signup;
    });

    $("#applyBtn").textContent = t.apply;
    $("#resetBtn").textContent = t.reset;
    $(".panel-heading h2").textContent = t.filters;
    $(".results h2").innerHTML =
        `${t.find} <span class="yellow">${t.favorite}</span>`;

    Object.entries(originalLabels).forEach(([id, label]) => {
        const element = document.querySelector(`label[for="${id}"]`);
        if (element) {
            const map = {
                "Search movie": t.search,
                "Country": t.country,
                "Release year": t.year,
                "Genre": t.genre,
                "Movie language": t.language,
                "Minimum rating": t.rating,
                "Sort by": t.sort
            };
            element.textContent = map[label] || label;
        }
    });

    $("#searchInput").placeholder =
        lang === "uz" ? "Kino nomi..." :
        lang === "ru" ? "Название фильма..." : "Movie name...";

    $("#authTitle").innerHTML = lang === "uz"
        ? 'TIZIMGA <span class="yellow">KIRISH</span>'
        : lang === "ru"
        ? '<span class="yellow">ВОЙТИ</span> В АККАУНТ'
        : 'LOG <span class="yellow">IN</span>';

    $("#authSubmit").textContent = t.login.toUpperCase() + " ↗";
}

$("#language").addEventListener("change", event => {
    setLanguage(event.target.value);
});

setLanguage("en");
showActiveFilters(getFilters());

// LOGIN / SIGNUP DEMO
const authDialog = $("#authDialog");

document.querySelectorAll("[data-auth]").forEach(button => {
    button.addEventListener("click", () => {
        const signup = button.dataset.auth === "signup";
        const lang = $("#language").value;

        const titles = {
            en: signup ? 'SIGN <span class="yellow">UP</span>' : 'LOG <span class="yellow">IN</span>',
            uz: signup ? '<span class="yellow">RO‘YXATDAN</span> O‘TISH' : 'TIZIMGA <span class="yellow">KIRISH</span>',
            ru: signup ? '<span class="yellow">РЕГИСТРАЦИЯ</span>' : '<span class="yellow">ВОЙТИ</span> В АККАУНТ'
        };

        $("#authTitle").innerHTML = titles[lang];
        $("#authSubmit").textContent = (
            signup ? translations[lang].signup : translations[lang].login
        ).toUpperCase() + " ↗";

        $("#authMessage").textContent =
            "Demo interface — authentication is not connected yet.";

        $("#authForm").dataset.mode = signup ? "signup" : "login";
        authDialog.showModal();
    });
});

$("#authClose").addEventListener("click", () => authDialog.close());

$("#authForm").addEventListener("submit", event => {
    event.preventDefault();

    $("#authMessage").textContent =
        "Demo only: no account was created and no login was performed.";
});

const API_READ_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTA1NzczZGE0OGNlYWVjZjkzMWEwMDcwMTdiM2E5NCIsIm5iZiI6MTc5Mjc0NjA3MS4xMjMwMDAxLCJzdWIiOiI2YWRiMjI1NzNmYjllZDNjNWE1MTlkNWIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.IVs40XBUtgUCBduts5JfJioyuq3spsugKj7wYMGJdiA";

async function loadMovies() {
    const url = new URL(
        "https://api.themoviedb.org/3/discover/movie"
    );

    url.searchParams.set("sort_by", "popularity.desc");
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", "en-US");

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
            accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Kinolarni yuklashda xatolik yuz berdi");
    }

    const data = await response.json();
    return data.results;
}

loadMovies()
    .then(movies => {
        console.log("Kinolar:", movies);
        // Keyingi qadam: filmlarni HTML kartalariga chiqarish.
    })
    .catch(console.error);
