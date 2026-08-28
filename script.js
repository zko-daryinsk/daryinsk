window.app = {
    currentLang: localStorage.getItem("dar_lang") || "ru",
    activeCategory: "🚨 АВАРИЙНАЯ",
    activeLetter: "",
    activeVillage: "Дарьинское",
    allContacts: [],
    corruptedLines: [],
    currentViewMode: localStorage.getItem("dar_view_node") || "tabs",
    isManualOpen: false,
    dict: {
        ru: { title: "Справочник", searchPlaceholder: "Поиск...", btnCall: "Позвонить", noResults: "Ничего не найдено" },
        kz: { title: "Анықтамалық", searchPlaceholder: "Іздеу...", btnCall: "Қоңырау шалу", noResults: "Ничего не найдено" }
    },
    categoryTranslations: {},
    searchTags: {},
    nameSynonyms: {},
    villageAreaCodes: {}
};

const adminPhone = "77058120376";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let langRes = {}, dataRes = "";

        // Скачиваем языковой файл с жесткой очисткой скрытого мусора BOM
        try {
            const r = await fetch("languages.json?v=" + Date.now());
            const text = await r.text();
            const cleanText = text.trim().replace(/^\uFEFF/, "");
            langRes = JSON.parse(cleanText);
            
            // Защита от регистра: читаем и с большой, и с маленькой буквы
            const rawDict = langRes.Dict || langRes.dict || {};
            if (rawDict.ru || rawDict.kz) window.app.dict = rawDict;
            
            window.app.categoryTranslations = langRes.categoryTranslations || langRes.CategoryTranslations || {};
            window.app.searchTags = langRes.searchTags || langRes.SearchTags || {};
            window.app.nameSynonyms = langRes.nameSynonyms || langRes.NameSynonyms || {};
            window.app.villageAreaCodes = langRes.villageAreaCodes || langRes.VillageAreaCodes || {};
        } catch (e) {
            console.error("Аварийная защита: словарь сломан, работаем на встроенной памяти", e);
        }

        try {
            const r = await fetch("baza_darinsk.txt?v=" + Date.now());
            dataRes = await r.text();
        } catch (e) {
            console.error("Не удалось загрузить базу контактов", e);
        }
        const lines = dataRes.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const lineClean = lines[i].trim();
            if (!lineClean || lineClean.startsWith("#")) continue;

            if (!lineClean.includes("|")) {
                window.app.corruptedLines.push({ lineNum: i + 1, raw: lineClean, reason: "Нет палочек |" });
                continue;
            }

            const cells = lineClean.split("|").map(c => c.trim().replace(/\r/g, ""));
            if (cells.length < 5) {
                window.app.corruptedLines.push({ lineNum: i + 1, raw: lineClean, reason: "Критически мало граф" });
                continue;
            }

            while (cells.length < 7) cells.push(".");

            const waStatus = cells[cells.length - 1] || "NO_WA";
            const address = cells[cells.length - 2] || "Дарьинское";
            const rawCat = cells || "ЖИТЕЛИ";
            const title = cells || ".";
            const phone = cells || ".";
            const name = cells === "." ? "" : (cells || "");
            const desc = cells === "." ? "" : (cells || "");

            window.app.allContacts.push({
                category: rawCat.toUpperCase(), title, phone, name, desc, address, waStatus, originalLineNum: i + 1
            });
        }

        setupEventListeners();
        handleWelcomeCounter();
        setLang(window.app.currentLang);
        renderAlphabet();
        initTheme();
    } catch (err) {
        console.error("Критический сбой инициализации:", err);
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
    const dict = window.app.dict[window.app.currentLang] || {};
    const titleEl = document.getElementById("siteTitle");
    if (titleEl) titleEl.textContent = dict.title || "Справочник";
    const inputEl = document.getElementById("searchInput");
    if (inputEl) inputEl.placeholder = dict.searchPlaceholder || "Поиск...";
    const langEl = document.getElementById("langToggle");
    if (langEl) langEl.textContent = window.app.currentLang === "ru" ? "KZ" : "RU";
    
    const select = document.getElementById("villageSelect");
    if (select) {
        const currentVal = select.value || window.app.activeVillage;
        select.innerHTML = `
            <option value="Дарьинское">${dict.v_daryinsk || "Дарьинское"}</option>
            <option value="Трёкино">${dict.v_trekin || "Трёкино"}</option>
            <option value="Рубежка">${dict.v_rubezh || "Рубежка"}</option>
            <option value="Озёрное">${dict.v_ozern || "Озёрное"}</option>
            <option value="Володарка">${dict.v_volobar || "Володарка"}</option>
        `;
        select.value = currentVal;
    }
    updateViewModeToggleButton();
    renderCategories();
    renderContacts();
}

function toggleViewMode() {
    window.app.currentViewMode = window.app.currentViewMode === "tabs" ? "select" : "tabs";
    localStorage.setItem("dar_view_node", window.app.currentViewMode);
    updateViewModeToggleButton();
    renderCategories();
}

function updateViewModeToggleButton() {
    const btn = document.getElementById("viewModeToggle");
    if (!btn) return;
    const dict = window.app.dict[window.app.currentLang] || {};
    if (window.app.currentViewMode === "tabs") {
        btn.textContent = "📱";
        btn.title = dict.modeSelect || "Переключить на список";
    } else {
        btn.textContent = "📋";
        btn.title = dict.modeTabs || "Переключить на вкладки";
    }
}
function renderCategories() {
    const labsContainer = document.getElementById("labsContainer");
    if (!labsContainer) return;
    labsContainer.innerHTML = "";
    const categories = Object.keys(window.app.categoryTranslations || {});
    
    if (window.app.currentViewMode === "select") {
        labsContainer.style.display = "flex";
        const wrapper = document.createElement("div");
        wrapper.className = "category-select-wrapper";
        const select = document.createElement("select");
        select.className = "category-mobile-select";
        
        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = window.app.categoryTranslations[cat]?.[window.app.currentLang] || cat;
            if (cat === window.app.activeCategory) opt.selected = true;
            select.appendChild(opt);
        });
        select.addEventListener("change", (e) => {
            window.app.activeCategory = e.target.value;
            window.app.activeLetter = "";
            renderAlphabet();
            renderContacts();
        });
        wrapper.appendChild(select);
        labsContainer.appendChild(wrapper);
    } else {
        labsContainer.style.display = "flex";
        categories.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = "lab-btn" + (cat === window.app.activeCategory ? " active" : "");
            btn.textContent = window.app.categoryTranslations[cat]?.[window.app.currentLang] || cat;
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
}

function handleVillageChange(e) {
    window.app.activeVillage = e.target.value;
    renderContacts();
}

function renderAlphabet() {
    const container = document.getElementById("alphabetContainer");
    if (!container) return;
    container.innerHTML = "";
    if (window.app.activeCategory === "FAVORITES" || window.app.activeCategory === "ADMIN_ERRORS") {
        container.style.display = "none";
        return;
    }
    container.style.display = "flex";
    const currentLangContacts = window.app.allContacts.filter(c => c.category === window.app.activeCategory && c.address === window.app.activeVillage);
    const lettersSet = new Set();
    currentLangContacts.forEach(c => {
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
    const dict = window.app.dict[window.app.currentLang] || {};
    const favs = JSON.parse(localStorage.getItem("dar_favs") || "[]");

    if (window.app.activeCategory === "ADMIN_ERRORS") {
        renderAdminErrors(container, dict);
        return;
    }

    let filtered = window.app.allContacts;
    if (window.app.activeCategory === "FAVORITES") {
        filtered = filtered.filter(c => favs.includes(c.phone));
    } else {
        filtered = filtered.filter(c => c.category === window.app.activeCategory && c.address === window.app.activeVillage);
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
                    const syn = window.app.nameSynonyms[w];
                    if (syn && typeof syn === "string" && syn.toLowerCase().includes(searchVal)) {
                        inSynonyms = true;
                        break;
                    }
                }
            }
            let inTags = false;
            if (window.app.searchTags[window.app.activeCategory]) {
                const tags = window.app.searchTags[window.app.activeCategory][window.app.currentLang] || [];
                inTags = tags.some(t => t.toLowerCase().includes(searchVal));
            }
            return inTitle || inName || inDesc || inPhone || inSynonyms || inTags;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">${dict.noResults || "Ничего не найдено"}</div>`;
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
                <a href="tel:${c.phone}" class="action-btn call-btn">📞 ${dict.btnCall || "Позвонить"}</a>
                ${c.waStatus === "$" ? `<a href="https://wa.me{c.phone}" target="_blank" class="action-btn wa-btn">💬 WhatsApp</a>` : ""}
            </div>
        `;
        card.querySelector(".fav-star-btn").addEventListener("click", () => {
            toggleFavorite(c.phone);
            renderContacts();
        });
        container.appendChild(card);
    });
}

function renderAdminErrors(container, dict) {
    if (window.app.corruptedLines.length === 0) {
        container.innerHTML = `
            <div class="contact-card" style="border-left: 5px solid #28a745; background: #e2f0d9;">
                <div class="card-title" style="color: #28a745;">🏆 База идеальна!</div>
                <div class="card-desc" style="margin-top: 8px; color: #333;">В файле базы данных из ${window.app.allContacts.length} строк не найдено ни одной системной ошибки. Все палочки на месте!</div>
            </div>`;
        return;
    }
    window.app.corruptedLines.forEach(err => {
        const card = document.createElement("div");
        card.className = "contact-card";
        card.style.borderLeft = "5px solid #dc3545";
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title" style="color: #dc3545;">⚠️ Ошибка структуры</div>
                <div style="font-weight: bold; color: #666;">Строка: ${err.lineNum}</div>
            </div>
            <div class="card-meta" style="color: #dc3545;">Причина: ${err.reason}</div>
            <div class="card-desc" style="background: #f8d7da; padding: 6px; border-radius: 4px; font-family: monospace; margin-top: 8px;">${err.raw}</div>
        `;
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
    
    if (val === "админ-брак" || val === "ошибки-базы") {
        window.app.activeCategory = "ADMIN_ERRORS";
        window.app.activeLetter = "";
        renderAlphabet();
        renderCategories();
        renderContacts();
        return;
    } else if (window.app.activeCategory === "ADMIN_ERRORS") {
        window.app.activeCategory = "🚨 АВАРИЙНАЯ";
        renderCategories();
    }
    renderContacts();
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    this.style.display = "none";
    if (window.app.activeCategory === "ADMIN_ERRORS") {
        window.app.activeCategory = "🚨 АВАРИЙНАЯ";
        renderCategories();
    }
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
            <div class="info-step-block"><div class="info-step-title">🔍 1-қадам</div>Экранның жоғарғы жағынан өз ауылыңызды таңдаңыз. Тұрмыстық сөздер бойынша іздеуді (нан, донер, жөндеу) немесе санаттар тізімін пайдаланыңыз.</div>
            <div class="info-step-block"><div class="info-step-title">⭐ 2-қадам</div>Жұлдызшаны басу арқылы шеберлерді Таңдаулыларға қосыңыз. Қоңырау шалу батырмасы кездейсоқ шақырулардан қорғау үшін растауды сұрайды.</div>
            <div class="info-step-block"><div class="info-step-title">🛡️ 3-қадам</div>Жоба тегін. Жұмыс кестесі бар контактіні қосу үшін "+ Қосу" батырмасын басыңыз. Қате тапсаңыз — "⚠️ Қате" батырмасын басыңыз.</div>
        `;
        document.getElementById("m-btn-kz").className = "modal-lang-btn active";
        document.getElementById("m-btn-ru").className = "modal-lang-btn";
    } else {
        modalTitle.textContent = "Как пользоваться справочником?";
        modalAction.textContent = "Понятно";
        modalText.innerHTML = `
            <div class="info-step-block"><div class="info-step-title">🔍 Шаг 1</div>Выбирайте свой посёлок вверху экрана. Используйте живой поиск по бытовым словам (хлеб, донер, ремонт) или ленту вкладок.</div>
            <div class="info-step-block"><div class="info-step-title">⭐ Шаг 2</div>Добавляйте мастеров в Избранное нажатием на звёздочку. Кнопка звонка попросит подтверждение для защиты от случайных вызовов в кармане.</div>
            <div class="info-step-block"><div class="info-step-title">🛡️ Шаг 3</div>Проект бесплатный. Чтобы добавить контакт с графиком работы, нажмите "+ Добавить". Если нашли неточность — нажмите кнопку "⚠️ Ошибка".</div>
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
    const text = "Новая заявка: " + name + ", Тел: " + phone;
    window.open("https://wa.me" + adminPhone + "?text=" + encodeURIComponent(text), "_blank");
    closeAddModal();
}
