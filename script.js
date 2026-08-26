// Глобальное состояние приложения (Все тексты вынесены во внешний languages.json)
window.app = {
    currentLang: localStorage.getItem("dar_lang") || "ru",
    activeCategory: "🚨 АВАРИЙНАЯ",
    activeLetter: "",
    activeVillage: "Дарьинское",
    allContacts: [],
    currentViewMode: localStorage.getItem("dar_view_mode") || "tabs",
    isManualOpen: false,
    dict: {},
    categoryTranslations: {},
    searchTags: {},
    nameSynonyms: {},
    villageAreaCodes: {}
};

// ХОСТ-НОМЕР АДМИНИСТРАТОРА ДЛЯ АНКЕТ И ЖАЛОБ
const adminPhone = "77058120376";

// Инициализация при полной загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // АСИНХРОННЫЙ МОТОР: Параллельное скачивание базы контактов и языкового JSON
        const [langRes, dataRes] = await Promise.all([
            fetch(`languages.json?v=${Date.now()}`).then(r => r.json()),
            fetch(`baza_darinsk.txt?v=${Date.now()}`).then(r => r.text())
        ]);

        window.app.dict = langRes.dict;
        window.app.categoryTranslations = langRes.categoryTranslations;
        window.app.searchTags = langRes.searchTags;
        window.app.nameSynonyms = langRes.nameSynonyms;
        window.app.villageAreaCodes = langRes.villageAreaCodes;

        // ПАРСЕР БЛОКА №31: Чтение базы контактов с иммунитетом к пустоте
        const lines = dataRes.split("\n");
        for (let line of lines) {
            const lineClean = line.trim();
            if (!lineClean || lineClean.startsWith("#") || !lineClean.includes("|")) continue;

            const cells = lineClean.split("|").map(c => c.trim());
            if (cells.length === 7) {
                window.app.allContacts.push({
                    category: cells,
                    title: cells,
                    phone: cells,
                    name: cells === "." ? "" : cells,
                    desc: cells === "." ? "" : cells,
                    address: cells === "." ? "" : cells,
                    waStatus: cells
                });
            }
        }

        setupEventListeners();
        handleWelcomeCounter();
        setLang(window.app.currentLang);
        renderAlphabet();
        initTheme();
    } catch (err) {
        console.error("Ошибка запуска конвейера сайта:", err);
    }
});

function setupEventListeners() {
    document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
    document.getElementById("langToggle")?.addEventListener("click", toggleLanguage);
    document.getElementById("searchInput")?.addEventListener("input", handleSearchInput);
    document.getElementById("clearSearch")?.addEventListener("click", clearSearch);
    document.getElementById("villageSelect")?.addEventListener("change", handleVillageChange);
    document.getElementById("favTabBtn")?.addEventListener("click", switchToFavoritesCategory);
    document.getElementById("addContactBtn")?.addEventListener("click", openAddModal);
    document.getElementById("closeModal")?.addEventListener("click", closeAddModal);
    document.getElementById("contactForm")?.addEventListener("submit", handleFormSubmit);
    document.getElementById("viewModeToggle")?.addEventListener("click", toggleViewMode);
    
    document.getElementById("btnInfo")?.addEventListener("click", openWelcomeModalManual);
    document.getElementById("btnWelcomeAction")?.addEventListener("click", closeWelcomeModal);
    document.getElementById("m-btn-ru")?.addEventListener("click", () => setWelcomeModalLang("ru"));
    document.getElementById("m-btn-kz")?.addEventListener("click", () => setWelcomeModalLang("kz"));
}

function initTheme() {
    const isDark = localStorage.getItem("dar_theme") === "dark";
    const btn = document.getElementById("themeToggle");
    if (isDark) {
        document.body.setAttribute("data-theme", "dark");
        document.body.classList.add("dark-mode");
    }
    if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}

function toggleTheme() {
    const isDark = !document.body.classList.contains("dark-mode");
    const btn = document.getElementById("themeToggle");
    
    if (isDark) {
        document.body.setAttribute("data-theme", "dark");
        document.body.classList.add("dark-mode");
        localStorage.setItem("dar_theme", "dark");
    } else {
        document.body.removeAttribute("data-theme");
        document.body.classList.remove("dark-mode");
        localStorage.setItem("dar_theme", "light");
    }
    if (btn) btn.textContent = isDark ? "☀️" : "🌙";
}
function handleWelcomeCounter() {
    let visits = parseInt(localStorage.getItem("dar_visit_count") || "0");
    visits += 1;
    localStorage.setItem("dar_visit_count", visits);

    const modal = document.getElementById("welcomeModal");
    if (!modal) return;

    if (visits === 1 || visits % 20 === 0) {
        window.app.isManualOpen = false;
        modal.style.display = "flex";
        setWelcomeModalLang(window.app.currentLang);
    } else {
        modal.style.display = "none";
    }
}

function openWelcomeModalManual() {
    const modal = document.getElementById("welcomeModal");
    if (modal) {
        window.app.isManualOpen = true;
        modal.style.display = "flex";
        setWelcomeModalLang(window.app.currentLang);
    }
}

function closeWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "none";
}

function setWelcomeModalLang(lang) {
    document.getElementById("m-btn-ru")?.classList.toggle("lang-btn-active", lang === "ru");
    document.getElementById("m-btn-kz")?.classList.toggle("lang-btn-active", lang === "kz");
    
    const title = document.getElementById("welcomeModalTitle");
    const body = document.getElementById("welcomeModalText");
    const btn = document.getElementById("btnWelcomeAction");
    const inst = window.app.dict[lang];

    if (title && inst) {
        title.textContent = window.app.isManualOpen ? inst.infoHowTo : inst.infoWelcome;
    }
    
    if (body) {
        body.innerHTML = `
            <div class="info-step-block"><div class="info-step-title">🔍 Шаг 1</div><div class="info-step-text">Выбирайте свой посёлок вверху экрана. Используйте живой поиск по бытовым словам (хлеб, донер, ремонт) или ленту вкладок.</div></div>
            <div class="info-step-block"><div class="info-step-title">⭐ Шаг 2</div><div class="info-step-text">Добавляйте мастеров в Избранное нажатием на звёздочку. Кнопка звонка попросит подтверждение для защиты от случайных вызовов в кармане.</div></div>
            <div class="info-step-block"><div class="info-step-title">🛡️ Шаг 3</div><div class="info-step-text">Проект бесплатный. Чтобы добавить контакт с графиком работы, нажмите "+ Добавить". Если нашли неточность — нажмите кнопку "⚠️ Ошибка".</div></div>
        `;
    }
    
    if (btn && inst) {
        btn.textContent = window.app.isManualOpen ? inst.infoCloseBtn : inst.infoOpenBtn;
    }
}

function toggleLanguage() {
    window.app.currentLang = window.app.currentLang === "ru" ? "kz" : "ru";
    localStorage.setItem("dar_lang", window.app.currentLang);
    setLang(window.app.currentLang);
    const modal = document.getElementById("welcomeModal");
    if (modal && modal.style.display === "flex") {
        setWelcomeModalLang(window.app.currentLang);
    }
}

function toggleViewMode() {
    window.app.currentViewMode = window.app.currentViewMode === "tabs" ? "select" : "tabs";
    localStorage.setItem("dar_view_mode", window.app.currentViewMode);
    renderTabs();
}

function renderTabs() {
    const tabsContainer = document.getElementById("tabsContainer");
    const selectContainer = document.getElementById("selectContainer");
    const toggleBtn = document.getElementById("viewModeToggle");
    const categories = Object.keys(window.app.categoryTranslations || {});
    
    if (!tabsContainer || !selectContainer || categories.length === 0) return;

    if (window.app.currentViewMode === "tabs") {
        tabsContainer.style.display = "flex";
        selectContainer.style.display = "none";
        if (toggleBtn) toggleBtn.textContent = "📱";
        
        tabsContainer.innerHTML = categories.map(cat => {
            const label = window.app.categoryTranslations[cat]?.[window.app.currentLang] || cat;
            const activeClass = window.app.activeCategory === cat ? "active" : "";
            return `<button class="tab ${activeClass}" onclick="selectCategory('${cat}')">${label}</button>`;
        }).join("");
        
        setTimeout(() => {
            const activeTab = tabsContainer.querySelector(".tab.active");
            if (activeTab) {
                tabsContainer.scrollLeft = activeTab.offsetLeft - (tabsContainer.clientWidth / 2) + (activeTab.clientWidth / 2);
            }
        }, 30);
    } else {
        tabsContainer.style.display = "none";
        selectContainer.style.display = "block";
        if (toggleBtn) toggleBtn.textContent = "📋";
        
        selectContainer.innerHTML = `
            <select class="nav-select" onchange="selectCategory(this.value)">
                ${categories.map(cat => {
                    const label = window.app.categoryTranslations[cat]?.[window.app.currentLang] || cat;
                    const selected = window.app.activeCategory === cat ? "selected" : "";
                    return `<option value="${cat}" ${selected}>${label}</option>`;
                }).join("")}
            </select>
        `;
    }
}

function selectCategory(cat) {
    window.app.activeCategory = cat;
    window.app.activeLetter = "";
    document.getElementById("favTabBtn")?.classList.remove("active-btn");
    renderTabs();
    renderCards();
}

function switchToFavoritesCategory() {
    window.app.activeCategory = "FAVORITES";
    window.app.activeLetter = "";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById("favTabBtn")?.classList.add("active-btn");
    renderCards();
}

function renderAlphabet() {
    const container = document.getElementById("alphabetContainer");
    if (!container) return;
    const letters = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ".split("");
    container.innerHTML = letters.map(l => {
        const activeClass = window.app.activeLetter === l ? "active" : "";
        return `<button class="letter-btn ${activeClass}" onclick="selectLetter('${l}')">${l}</button>`;
    }).join("");
}

function selectLetter(letter) {
    window.app.activeLetter = window.app.activeLetter === letter ? "" : letter;
    document.getElementById("searchInput").value = "";
    renderAlphabet();
    renderCards();
}

function handleSearchInput() {
    window.app.activeLetter = "";
    renderAlphabet();
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    // УМНЫЙ ПОИСК ПО СКРЫТЫМ БЫТОВЫМ ТЕГАМ ИЗ JSON
    if (window.app.searchTags && window.app.searchTags[query]) {
        window.app.activeCategory = window.app.searchTags[query];
        renderTabs();
    }
    renderCards();
}

// Окончание следует...
    
