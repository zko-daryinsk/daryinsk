window.app = {
    allContacts: [],
    activeCategory: "🚨 АВАРИЙНАЯ",
    activeLetter: "",
    currentLang: "ru",
    currentViewMode: "tabs",
    villages: [],
    activeVillage: "Дарьинское"
};

const nameSynonyms = {
    "саня": ["александр", "санек", "александра"],
    "вова": ["владимир", "володя", "владимирович"],
    "паша": ["павел", "леша", "алексей"],
    "алеша": ["алексей", "петя", "петр"],
    "серик": ["серикбол", "али", "алихан"],
    "баха": ["бахтияр", "маха", "махамбет"]
};

const categoryTranslations = {
    "🚨 АВАРИЙНАЯ": { "ru": "🚨 АВАРИЙНАЯ", "kz": "🚨 АПАТТЫҚ ҚЫЗМЕТ" },
    "ПОЛИЦИЯ": { "ru": "🚨 ПОЛИЦИЯ", "kz": "🚨 ПОЛИЦИЯ" },
    "АВТОСЕРВИС": { "ru": "🛠️ АВТОСЕРВИС", "kz": "🛠️ АВТОСЕРВИС" },
    "АПТЕКИ": { "ru": "💊 АПТЕКИ", "kz": "💊 ДӘРІХАНАЛАР" },
    "БАНИ": { "ru": "🧼 БАНИ", "kz": "🧼 ТАНДАР" },
    "ГОССЛУЖБЫ": { "ru": "🏛️ СЛУЖБЫ", "kz": "🏛️ ҚЫЗМЕТТЕР" },
    "ГРУЗОПЕРЕВОЗКИ": { "ru": "🚛 ГРУЗОПЕРЕВОЗКИ", "kz": "🚛 ЖҮК ТАСЫМАЛЫ" },
    "ДОСТАВКА": { "ru": "📦 ДОСТАВКА", "kz": "📦 ЖЕТКІЗУ" },
    "ДРОВА": { "ru": "🪵 ДРОВА", "kz": "🪵 ОҚЫТАР" },
    "ЖИТЕЛИ": { "ru": "👥 ЖИТЕЛИ", "kz": "👥 ТҰРҒЫНДАР" },
    "ИНТЕРНЕТ": { "ru": "🌐 ИНТЕРНЕТ", "kz": "🌐 ИНТЕРНЕТ" },
    "КРАСОТА": { "ru": "💅 КРАСОТА", "kz": "💅 СҰЛУЛЫҚ" },
    "МАГАЗИНЫ": { "ru": "🛒 МАГАЗИНЫ", "kz": "🛒 ДҮКЕНДЕР" },
    "МЕДИЦИНА": { "ru": "🏥 МЕДИЦИНА", "kz": "🏥 МЕДИЦИНА" },
    "МАСТЕРА": { "ru": "👨‍🔧 МАСТЕРА", "kz": "👨‍🔧 ШЕБЕРЛЕР" },
    "МЕБЕЛЬ": { "ru": "🛏️ МЕБЕЛЬ", "kz": "🛏️ ЖИҺАЗ" },
    "НОТАРИУС": { "ru": "📜 НОТАРИУС", "kz": "📜 НОТАРИУС" },
    "ОТДЫХ": { "ru": "🏖️ ОТДЫХ", "kz": "🏖️ ДЕМ АЛЫС" },
    "ПРОДУКТЫ": { "ru": "🍏 ПРОДУКТЫ", "kz": "🍏 АЗЫҚ-ТҮЛІК" },
    "РЕМОНТ": { "ru": "🔨 РЕМОНТ", "kz": "🔨 ЖӨНДЕУ" },
    "РИТУАЛЬНЫЕ": { "ru": "⚰️ РИТУАЛЬНЫЕ", "kz": "⚰️ РИТУАЛДЫҚ" },
    "СВЯЗЬ": { "ru": "📞 СВЯЗЬ", "kz": "📞 БАЙЛАНЫС" },
    "СЕПТИКИ": { "ru": "🕳️ СЕПТИКИ", "kz": "🕳️ СЕПТИКТЕР" },
    "СКОТНЫЙ ДВОР": { "ru": "🐄 СКОТНЫЙ ДВОР", "kz": "🐄 МАЛ ҚОРЖЫНЫ" },
    "СТРОЙКА": { "ru": "🧱 СТРОЙКА", "kz": "🧱 ҚҰРЫЛЫС" },
    "СУШИ И ПИЦЦА": { "ru": "🍕 СУШИ И ПИЦЦА", "kz": "🍕 СУШИ ПИЦЦА" },
    "ТАКСИ": { "ru": "🚖 ТАКСИ", "kz": "🚖 ТАКСИ" },
    "УСЛУГИ": { "ru": "💼 УСЛУГИ", "kz": "💼 ҚЫЗМЕТТЕР" },
    "ХОЗТОВАРЫ": { "ru": "🧹 ХОЗТОВАРЫ", "kz": "🧹 ТҰРМЫСТЫҚ ТАУАРЛАР" }
};
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const r = await fetch("baza_darinsk.txt?v=" + Date.now());
        const dataRes = await r.text();

        loadContacts(dataRes);
        setupEventListeners();
        handleWelcomeCounter();
        setLang(window.app.currentLang);
        renderAlphabet();
        initTheme();
    } catch (err) {
        console.error("Ошибка загрузки базы данных округа:", err);
    }
});

function loadContacts(dataText) {
    window.app.allContacts = [];
    const lines = dataText.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const lineClean = lines[i].trim();
        if (!lineClean || lineClean.startsWith("#") || !lineClean.includes("|")) continue;

        const cells = lineClean.split("|").map(c => c.trim().replace(/\r/g, ""));
        if (cells.length < 5) continue;

        // Достраиваем хвост, если Питон где-то упустил палочку
        while (cells.length < 7) cells.push(".");

        // СТРОГАЯ ПОПРАВКА ПОД ШЕСТУЮ ГРАФУ НОВОЙ БАЗЫ
        const rawCat = cells[0] || "ЖИТЕЛИ";
        const title = cells[1] || ".";
        const phone = cells[2] || ".";
        const name = cells[3] === "." ? "" : (cells[3] || "");
        const desc = cells[4] === "." ? "" : (cells[4] || "");
        const address = cells[5] || "Дарьинское"; // 6 ячейка — русское название села
        const waStatus = cells[6] || "NO_WA";     // 7 ячейка — статус Ватсапа ($)

        window.app.allContacts.push({
            category: rawCat.toUpperCase(),
            title,
            phone,
            name,
            desc,
            address,
            waStatus
        });
    }
}
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
    const savedTheme = localStorage.getItem("dar_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const icon = document.getElementById("themeToggle");
    if (icon) icon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("dar_theme", newTheme);
    const icon = document.getElementById("themeToggle");
    if (icon) icon.textContent = newTheme === "dark" ? "☀️" : "🌙";
}

function toggleLanguage() {
    window.app.currentLang = window.app.currentLang === "ru" ? "kz" : "ru";
    localStorage.setItem("dar_lang", window.app.currentLang);
    setLang(window.app.currentLang);
}

function setLang(themeLang) {
    const isRu = window.app.currentLang === "ru";
    
    const titleEl = document.getElementById("siteTitle");
    if (titleEl) titleEl.textContent = isRu ? "Справочник посёлков" : "Анықтамалық";
    
    const inputEl = document.getElementById("searchInput");
    if (inputEl) inputEl.placeholder = isRu ? "Поиск..." : "Іздеу...";
    
    const langEl = document.getElementById("langToggle");
    if (langEl) langEl.textContent = isRu ? "KZ" : "RU";
    
    const select = document.getElementById("villageSelect");
    if (select) {
        const currentVal = select.value || window.app.activeVillage;
        select.innerHTML = `
            <option value="Дарьинское">${isRu ? "Дарьинское" : "Дарьинское"}</option>
            <option value="Трёкино">${isRu ? "Трёкино" : "Трёкино"}</option>
            <option value="Рубежка">${isRu ? "Рубежка" : "Рубежка"}</option>
            <option value="Озёрное">${isRu ? "Озёрное" : "Озёрное"}</option>
            <option value="Володарка">${isRu ? "Володарка" : "Володарка"}</option>
        `;
        select.value = currentVal;
    }
    renderCategories();
    renderContacts();
}

function toggleViewMode() {
    // Оригинальная заглушка для стабильности старой верстки
}

function renderCategories() {
    const labsContainer = document.getElementById("labsContainer");
    if (!labsContainer) return;
    labsContainer.innerHTML = "";
    
    // Создаем кнопки категорий строго по тем, что реально есть в базе
    const uniqueCats = new Set(window.app.allContacts.map(c => c.category));
    const categories = Array.from(uniqueCats);
    
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "lab-btn" + (cat === window.app.activeCategory ? " active" : "");
        
        const transBlock = categoryTranslations[cat] || {};
        btn.textContent = transBlock[window.app.currentLang] || cat;
        
        btn.addEventListener("click", () => {
            window.app.activeCategory = cat;
            window.app.activeLetter = "";
            renderAlphabet();
            renderCategories();
            renderContacts();
        });
        labsContainer.appendChild(btn);
    });
}

function handleVillageChange(e) {
    window.app.activeVillage = e.target.value;
    window.app.activeLetter = "";
    renderAlphabet();
    renderContacts();
}
function renderAlphabet() {
    const container = document.getElementById("alphabetContainer");
    if (!container) return;
    container.innerHTML = "";
    if (window.app.activeCategory === "FAVORITES") {
        container.style.display = "none";
        return;
    }
    container.style.display = "flex";
    
    const currentVillageLower = window.app.activeVillage.toLowerCase();
    
    const currentVillageContacts = window.app.allContacts.filter(c => {
        if (c.category !== window.app.activeCategory) return false;
        
        const dbAddress = (c.address || "").toLowerCase().trim();
        
        if (currentVillageLower === "дарьинское") return dbAddress.includes("дарьин");
        if (currentVillageLower === "трёкино" || currentVillageLower === "трекино") return dbAddress.includes("трек") || dbAddress.includes("байкон");
        if (currentVillageLower === "рубежка") return dbAddress.includes("рубеж");
        if (currentVillageLower === "озёрное" || currentVillageLower === "озерное") return dbAddress.includes("озер") || dbAddress.includes("озёр");
        if (currentVillageLower === "володарка") return dbAddress.includes("волод");
        
        return dbAddress === currentVillageLower;
    });
    
    const lettersSet = new Set();
    currentVillageContacts.forEach(c => {
        if (c.title) {
            const firstLetter = c.title.trim().charAt(0).toUpperCase();
            if (/[А-ЯЁA-Z]/.test(firstLetter)) lettersSet.add(firstLetter);
        }
    });
    
    const sortedLetters = Array.from(lettersSet).sort();
    if (sortedLetters.length === 0) {
        container.style.display = "none";
        return;
    }
    
    sortedLetters.forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "letter-btn" + (letter === window.app.activeLetter ? " active" : "");
        btn.textContent = letter;
        btn.addEventListener("click", () => {
            window.app.activeLetter = window.app.activeLetter === letter ? "" : letter;
            renderAlphabet();
            renderContacts();
        });
        container.appendChild(btn);
    });
}

function renderContacts() {
    const container = document.getElementById("contactsContainer");
    if (!container) return;
    container.innerHTML = "";
    const searchVal = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    const isRu = window.app.currentLang === "ru";
    const favs = JSON.parse(localStorage.getItem("dar_favs") || "[]");

    let filtered = window.app.allContacts;
    if (window.app.activeCategory === "FAVORITES") {
        filtered = filtered.filter(c => favs.includes(c.phone));
    } else {
        const currentVillageLower = window.app.activeVillage.toLowerCase();
        
        filtered = filtered.filter(c => {
            if (c.category !== window.app.activeCategory) return false;
            
            const dbAddress = (c.address || "").toLowerCase().trim();
            
            if (currentVillageLower === "дарьинское") return dbAddress.includes("дарьин");
            if (currentVillageLower === "трёкино" || currentVillageLower === "трекино") return dbAddress.includes("трек") || dbAddress.includes("байкон");
            if (currentVillageLower === "рубежка") return dbAddress.includes("рубеж");
            if (currentVillageLower === "озёрное" || currentVillageLower === "озерное") return dbAddress.includes("озер") || dbAddress.includes("озёр");
            if (currentVillageLower === "володарка") return dbAddress.includes("волод");
            
            return dbAddress === currentVillageLower;
        });

        if (window.app.activeLetter) {
            filtered = filtered.filter(c => c.title && c.title.trim().charAt(0).toUpperCase() === window.app.activeLetter);
        }
    }

    if (searchVal) {
        filtered = filtered.filter(c => {
            const inTitle = c.title.toLowerCase().includes(searchVal);
            const inName = c.name.toLowerCase().includes(searchVal);
            const inDesc = c.desc.toLowerCase().includes(searchVal);
            const inPhone = c.phone.includes(searchVal);
            
            let inSynonyms = false;
            const checkString = c.category === "ЖИТЕЛИ" ? c.title : c.name;
            if (checkString) {
                const words = checkString.toLowerCase().split(/\s+/);
                for (let w of words) {
                    const syn = nameSynonyms[w];
                    if (syn && syn.some(s => s.toLowerCase().includes(searchVal))) {
                        inSynonyms = true;
                        break;
                    }
                }
            }
            return inTitle || inName || inDesc || inPhone || inSynonyms;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">${isRu ? "Ничего не найдено" : "Ештеңе табылмады"}</div>`;
        return;
    }
    filtered.forEach(c => {
        const card = document.createElement("div");
        card.className = "contact-card";
        const isFav = favs.includes(c.phone);
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${c.title}</div>
                <button class="fav-star-btn">${isFav ? "⭐" : "☆"}</button>
            </div>
            ${c.name ? `<div class="card-meta">👤 ${c.name}</div>` : ""}
            ${c.desc ? `<div class="card-desc">${c.desc}</div>` : ""}
            <div class="card-actions">
                <button class="action-btn call-btn">📞 ${isRu ? "Позвонить" : "Қоңырау шалу"}</button>
                ${c.waStatus === "$" ? `<a href="https://wa.me{c.phone}" target="_blank" class="action-btn wa-btn">💬 WhatsApp</a>` : ""}
            </div>
        `;

        card.querySelector(".fav-star-btn").addEventListener("click", () => {
            toggleFavorite(c.phone);
            renderContacts();
        });

        // НАДЕЖНАЯ ЗАЩИТА КНОПКИ ЗВОНКА ОТ СЛУЧАЙНЫХ ТАПОВ В КАРМАНЕ
        card.querySelector(".call-btn").addEventListener("click", () => {
            const confirmMsg = window.app.currentLang === "kz" 
                ? `Нөміріне қоңырау шалуды растайсыз ба: ${c.phone}?` 
                : `Вы точно хотите позвонить по номеру: ${c.phone}?`;
            if (window.confirm(confirmMsg)) {
                window.location.href = `tel:${c.phone}`;
            }
        });

        container.appendChild(card);
    });
}

function toggleFavorite(phone) {
    let favs = JSON.parse(localStorage.getItem("dar_favs") || "[]");
    if (favs.includes(phone)) {
        favs = favs.filter(p => p !== phone);
    } else {
        favs.push(phone);
    }
    localStorage.setItem("dar_favs", JSON.stringify(favs));
}

function switchToFavoritesCategory() {
    window.app.activeCategory = "FAVORITES";
    window.app.activeLetter = "";
    renderAlphabet();
    renderCategories();
    renderContacts();
}

function handleSearchInput() {
    const val = this.value.toLowerCase().trim();
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = val ? "block" : "none";
    renderContacts();
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    this.style.display = "none";
    renderContacts();
}

function handleWelcomeCounter() {
    let counter = parseInt(localStorage.getItem("dar_welcome_counter") || "0");
    if (window.app.isManualOpen) {
        showWelcomeModal();
        return;
    }
    if (counter < 5) {
        showWelcomeModal();
        counter++;
        localStorage.setItem("dar_welcome_counter", counter.toString());
    }
}

function showWelcomeModal() {
    const modal = document.getElementById("welcomeModal");
    if (modal) modal.style.display = "flex";
    setWelcomeModalLang(window.app.currentLang);
}

function closeWelcomeModal() {
    const modal = document.getElementById("welcomeModal");
    if (modal) modal.style.display = "none";
    window.app.isManualOpen = false;
}

function openWelcomeModalManual() {
    window.app.isManualOpen = true;
    showWelcomeModal();
}

function setWelcomeModalLang(lang) {
    const modalTitle = document.getElementById("welcomeModalTitle");
    const modalText = document.getElementById("welcomeModalText");
    const modalAction = document.getElementById("btnWelcomeAction");
    if (!modalTitle || !modalText || !modalAction) return;

    if (lang === "kz") {
        modalTitle.textContent = "Анықтамалықты қалай пайдалану керек?";
        modalAction.textContent = "Түсінікті";
        modalText.innerHTML = `
            <div class="info-step-block"><div class="info-step-title">🔍 1-қадам</div>Экранның жоғарғы жағынан өз ауылыңызды таңдаңыз. Санаттар тізімін пайдаланыңыз.</div>
            <div class="info-step-block"><div class="info-step-title">⭐ 2-қадам</div>Жұлдызшаны басу арқылы шеберлерді Таңдаулыларға қосыңыз. Қоңырау шалу батырмасы кездейсоқ шақырулардан қорғау үшін растауды сұрайды.</div>
            <div class="info-step-block"><div class="info-step-title">🛡️ 3-қадам</div>Жұмыс кестесі бар контактіні қосу үшін "+ Қосу" батырмасын басыңыз. Қате тапсаңыз — "⚠️ Қате" батырмасын басыңыз.</div>
        `;
        document.getElementById("m-btn-kz").className = "modal-lang-btn active";
        document.getElementById("m-btn-ru").className = "modal-lang-btn";
    } else {
        modalTitle.textContent = "Как пользоваться справочником?";
        modalAction.textContent = "Понятно";
        modalText.innerHTML = `
            <div class="info-step-block"><div class="info-step-title">🔍 Шаг 1</div>Выбирайте свой посёлок вверху экрана. Используйте живой поиск или удобную ленту вкладок.</div>
            <div class="info-step-block"><div class="info-step-title">⭐ Шаг 2</div>Добавляйте мастеров в Избранное нажатием на звёздочку. Кнопка звонка попросит подтверждение для защиты от случайных вызовов в кармане.</div>
            <div class="info-step-block"><div class="info-step-title">🛡️ Шаг 3</div>Чтобы добавить контакт с графиком работы, нажмите "+ Добавить". Если нашли неточность — нажмите кнопку "⚠️ Ошибка".</div>
        `;
        document.getElementById("m-btn-ru").className = "modal-lang-btn active";
        document.getElementById("m-btn-kz").className = "modal-lang-btn";
    }
}

function openAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "flex";
}

function closeAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "none";
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("formName")?.value || "";
    const phone = document.getElementById("formPhone")?.value || "";
    const text = "Новая заявка: " + name + ", Tel: " + phone;
    window.open("https://wa.me" + adminPhone + "?text=" + encodeURIComponent(text), "_blank");
    closeAddModal();
}
