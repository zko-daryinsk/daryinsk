window.app = {
    currentLang: localStorage.getItem("dar_lang") || "ru",
    activeCategory: "🚨 АВАРИЙНАЯ",
    activeLetter: "",
    activeVillage: "Дарьинское",
    allContacts: [],
    currentViewMode: localStorage.getItem("dar_view_node") || "tabs",
    isManualOpen: false,
    dict: {},
    categoryTranslations: {},
    searchTags: {},
    nameSynonyms: {},
    villageAreaCodes: {}
};

const adminPhone = "77058120376";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // АВТО-ОПРЕДЕЛЕНИЕ ПУТИ ГИТХАБА ДЛЯ ЗАЩИТЫ ОТ ТРОЕТОЧИЙ
        const basePath = window.location.pathname.includes('/daryinsk') ? '/daryinsk/' : './';
        const [langRes, dataRes] = await Promise.all([
            fetch(`${basePath}languages.json?v=${Date.now()}`).then(r => r.json()),
            fetch(`${basePath}baza_darinsk.txt?v=${Date.now()}`).then(r => r.text())
        ]);

        window.app.dict = langRes.Dict;
        window.app.categoryTranslations = langRes.categoryTranslations;
        window.app.searchTags = langRes.searchTags;
        window.app.nameSynonyms = langRes.nameSynonyms;
        window.app.villageAreaCodes = langRes.villageAreaCodes;

        // БРОНЕБОЙНЫЙ ПАРСЕР: Читает базу вопреки любым пробелам и лишним палочкам
        const lines = dataRes.split("\n");
        for (let line of lines) {
            const lineClean = line.strip ? line.strip() : line.trim();
            if (!lineClean || lineClean.startsWith("#") || !lineClean.includes("|")) continue;

            const cells = lineClean.split("|").map(c => c.trim().replace(/\r/g, ""));
            if (cells.length < 5) continue; // Защита от битых строк

            // Ватсап - всегда самая последняя ячейка, Посёлок - всегда предпоследняя
            const waStatus = cells[cells.length - 1] || "NO_WA";
            const address = cells[cells.length - 2] || "Дарьинское";
            const category = cells[0];
            const title = cells[1] || ".";
            const phone = cells[2] || ".";
            
            let name = "";
            let desc = "";
            
            if (category.toUpperCase() === "ЖИТЕЛИ") {
                name = title;
                desc = cells[4] === "." ? "" : (cells[4] || "");
            } else {
                name = cells[3] === "." ? "" : (cells[3] || "");
                desc = cells[4] === "." ? "" : (cells[4] || "");
            }

            window.app.allContacts.push({
                category, title, phone, name, desc, address, waStatus
            });
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
    const savedTheme = localStorage.getItem("dar_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("dar_theme", newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById("themeToggle");
    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleLanguage() {
    window.app.currentLang = window.app.currentLang === "ru" ? "kz" : "ru";
    localStorage.setItem("dar_lang", window.app.currentLang);
    setLang(window.app.currentLang);
}

function setLang(lang) {
    const dict = window.app.dict[lang] || {};
    
    // Перевод статических элементов интерфейса
    document.getElementById("siteTitle") ? document.getElementById("siteTitle").textContent = dict.title || "Справочник" : null;
    document.getElementById("searchInput") ? document.getElementById("searchInput").placeholder = dict.searchPlaceholder || "Поиск..." : null;
    document.getElementById("langToggle") ? document.getElementById("langToggle").textContent = lang === "ru" ? "KZ" : "RU" : null;
    
    // Названия поселков в выпадающем списке
    const select = document.getElementById("villageSelect");
    if (select) {
        const currentVal = select.value || window.app.activeVillage;
        select.innerHTML = `
            <option value="Дарьинское">${dict.v_daryinsk || "Дарьинское"}</option>
            <option value="Трёкино">${dict.v_trekin || "Трёкино"}</option>
            <option value="Рубежка">${dict.v_rubezh || "Рубежка"}</option>
            <option value="Озёрное">${dict.v_ozern || "Озёрное"}</option>
            <option value="Володарка">${dict.v_volodar || "Володарка"}</option>
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
    const dict = window.app.dict[window.app.currentLang] || {};

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

    if (window.app.activeCategory === "FAVORITES") {
        container.style.display = "none";
        return;
    }
    container.style.display = "flex";

    const currentLangContacts = window.app.allContacts.filter(c => c.category === window.app.activeCategory && c.address === window.app.activeVillage);
    const lettersSet = new Set();

    currentLangContacts.forEach(c => {
        const searchName = c.category.toUpperCase() === "ЖИТЕЛИ" ? c.title : c.title;
        if (searchName) {
            const firstLetter = searchName.trim().charAt(0).toUpperCase();
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

    let filtered = window.app.allContacts;

    if (window.app.activeCategory === "FAVORITES") {
        filtered = filtered.filter(c => favs.includes(c.phone));
    } else {
        filtered = filtered.filter(c => c.category === window.app.activeCategory && c.address === window.app.activeVillage);
        if (window.app.activeLetter) {
            filtered = filtered.filter(c => {
                const targetName = c.category.toUpperCase() === "ЖИТЕЛИ" ? c.title : c.title;
                return targetName && targetName.trim().charAt(0).toUpperCase() === window.app.activeLetter;
            });
        }
    }

    if (searchVal) {
        filtered = filtered.filter(c => {
            const inTitle = c.title.toLowerCase().includes(searchVal);
            const inName = c.name.toLowerCase().includes(searchVal);
            const inDesc = c.desc.toLowerCase().includes(searchVal);
            const inPhone = c.phone.includes(searchVal);

            let inSynonyms = false;
            const checkString = c.category.toUpperCase() === "ЖИТЕЛИ" ? c.title : c.name;
            if (checkString) {
                const words = checkString.toLowerCase().split(/[\s,]+/);
                for (let w of words) {
                    if (window.app.nameSynonyms[w] && window.app.nameSynonyms[w].toLowerCase().includes(searchVal)) {
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
                <button class="fav-star-btn" data-phone="${c.phone}">${isFav ? "⭐" : "☆"}</button>
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
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = this.value ? "block" : "none";
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
            <div class="info-step-block"><div class="info-step-title">🛡️ Шаг 3</div>Проект бесплатный. Чтобы добавить contact с графиком работы, нажмите "+ Добавить". Если нашли неточность — нажмите кнопку "⚠️ Ошибка".</div>
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
