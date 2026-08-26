// Глобальное состояние приложения
window.app = {
    currentLang: localStorage.getItem("dar_lang") || "ru",
    activeCategory: "🚨 АВАРИЙНАЯ",
    activeLetter: "",
    activeVillage: "Дарьинское",
    allContacts: [],
    currentViewMode: localStorage.getItem("dar_view_mode") || "tabs",
    isManualOpen: false // Флаг для умной смены текста на кнопке модалки
};

const adminPhone = "77058120376";

// Словарь синонимов для живого поиска
const nameSynonyms = {
    "саня": "александр", "санек": "александр",
    "вовчик": "владимир", "володя": "владимир",
    "паша": "павел", "леха": "алексей",
    "алеша": "алексей", "петя": "петр",
    "серик": "серикбол", "али": "алихан",
    "баха": "бахтияр", "маха": "махамбет"
};

// Переводы категорий для синей ленты
const categoryTranslations = {
    '🚨 АВАРИЙНАЯ': { "ru": "🚨 АВАРИЙНАЯ", "kz": "🚨 АПАТТЫҚ" },
    'ПОЛИЦИЯ': { "ru": "👮 ПОЛИЦИЯ", "kz": "👮 ПОЛИЦИЯ" },
    'АВТОСЕРВИС': { "ru": "🔧 АВТОСЕРВИС", "kz": "🔧 АВТОСЕРВИС" },
    'АПТЕКИ': { "ru": "💊 АПТЕКИ", "kz": "💊 ДӘРІХАНАЛАР" },
    'БАНИ': { "ru": "🧖 БАНИ / МАССАЖ", "kz": "🧖 МОНША / МАССАЖ" },
    'ГОССЛУЖБЫ': { "ru": "🏛️ СЛУЖБЫ", "kz": "🏛️ МЕМ. ҚЫЗМЕТТЕР" },
    'ГРУЗОПЕРЕВОЗКИ': { "ru": "🚚 ГРУЗОПЕРЕВОЗКИ", "kz": "🚚 ЖҮК ТАСЫМАЛЫ" },
    'ДОСТАВКА': { "ru": "📦 ДОСТАВКА", "kz": "📦 ЖЕТКІЗУ" },
    'ДРОВА': { "ru": "🪵 ДРОВА / ОКОП", "kz": "🪵 ОТЫН" },
    'ЖИТЕЛИ': { "ru": "👥 ТУРҒЫНДАР", "kz": "👥 ТҰРҒЫНДАР" },
    'ИНТЕРНЕТ': { "ru": "🌐 ИНТЕРНЕТ", "kz": "🌐 ИНТЕРНЕТ" },
    'КРАСОТА': { "ru": "💅 КРАСОТА", "kz": "💅 СҰЛУЛЫҚ" },
    'МАГАЗИНЫ': { "ru": "🛒 МАГАЗИНЫ", "kz": "🛒 ДҮКЕНДЕР" },
    'МЕДИЦИНА': { "ru": "🩺 МЕДИЦИНА", "kz": "🩺 МЕДИЦИНА" },
    'МАСТЕРА': { "ru": "🛠️ МАСТЕРА", "kz": "🛠️ ШЕБЕРЛЕР" },
    'МЕБЕЛЬ': { "ru": "🛋️ МЕБЕЛЬ", "kz": "🛋️ ЖИҺАЗ" },
    'НОТАРИУС': { "ru": "📜 НОТАРИУС", "kz": "📜 НОТАРИУС" },
    'ОТДЫХ': { "ru": "🏖️ ОТДЫХ", "kz": "🏖️ ДЕМ АЛЫС" },
    'ПРОДУКТЫ': { "ru": "🍞 ПРОДУКТЫ", "kz": "🍞 АЗЫҚ-ТҮЛІК" },
    'РЕМОНТ': { "ru": "🛠️ РЕМОНТ", "kz": "🛠️ ЖӨНДЕУ" },
    'РИТУАЛ': { "ru": "⚰️ РИТУАЛ", "kz": "⚰️ РИТУАЛ" },
    'СЕПТИКИ': { "ru": "🛢️ СЕПТИКИ", "kz": "🛢️ СЕПТИК" },
    'ТАКСИ': { "ru": "🚖 ТАКСИ", "kz": "🚖 ТАКСИ" },
    'УСЛУГИ': { "ru": "📋 УСЛУГИ", "kz": "📋 ҚЫЗМЕТТЕР" },
    'ШКОЛА': { "ru": "🏫 ШКОЛА", "kz": "🏫 МЕКТЕП" },
    'ЭЛЕКТРИКИ': { "ru": "⚡ ЭЛЕКТРИКИ", "kz": "⚡ ЭЛЕКТРИКТЕР" },
    'СВАРЩИКИ': { "ru": "👨‍🏭 СВАРЩИКИ", "kz": "👨‍🏭 СВАРШИКТЕР" },
    'ФАСТФУД': { "ru": "🍔 ФАСТФУД", "kz": "🍔 ФАСТФУД" },
    'ОКНА': { "ru": "🪟 ОКНА/ПОТОЛКИ", "kz": "🪟 ТЕРЕЗЕЛЕР" },
    'ПТИЦЫ': { "ru": "🦆 ПТИЦЕВОДСТВО", "kz": "🦆 ҚҰСТАР" },
    'FAVORITES': { "ru": "⭐ Избранное", "kz": "⭐ Таңдаулылар" },
    'БЛАГОУСТРОЙСТВО': { "ru": "🧹 БЛАГОУСТРОЙСТВО", "kz": "🧹 АБАТТАНДЫРУ" },
    'ВЫПЕЧКА': { "ru": "🥐 ВЫПЕЧКА", "kz": "🥐 ПІСІРІЛГЕН ТАҒАМДАР" },
    'КАФЕ': { "ru": "☕ КАФЕ", "kz": "☕ КАФЕ" },
    'КОВРЫ': { "ru": "🧺 КОВРЫ", "kz": "🧺 КІЛЕМДЕР" },
    'КОРМА': { "ru": "🌾 КОРМА", "kz": "🌾 ЖЕМШӨП" },
    'ПОТОЛКИ': { "ru": "🔨 ПОТОЛКИ", "kz": "🔨 ТӨБЕЛЕР" },
    'СКВАЖИНЫ': { "ru": "🚰 СКВАЖИНЫ", "kz": "🚰 ҰҢҒЫМАЛАР" },
    'ШКОЛЫ': { "ru": "🏫 ШКОЛЫ", "kz": "🏫 МЕКТЕПТЕР" }
};

const categories = Object.keys(categoryTranslations);

// Языковой словарь сайта со встроенными текстами новой инструкции
const dict = {
    ru: {
        title: "Справочник посёлков", search: "Поиск...",
        reset: "Сбросить",
        mainBtn: "&nbsp;&nbsp;Добавить", favBtn: "&nbsp;&nbsp;Избранное",
        viewTabs: "👁️ Вкладки", viewSelect: "👁️ Список",
        noResults: "Ничего не найдено", callMob: "Позвонить",
        callGov: "Позвонить на городской",
        numCopied: "Номер скопирован в буфер обмена!",
        shareCopied: "Ссылка скопирована! Отправьте её друзьям.",
        confirmErr: "Хотите сообщить администратору об ошибке в этом контакте?",
        mTitle: "Новая анкетная форма", mCustomOpt: "Вписать категорию руками...",
        lblHasWa: "На этом номере есть WhatsApp", mSubmit: "Отправить в WhatsApp",
        mAlert: "Заполните Посёлок, Категорию, Название и Телефон!",
        infoWelcome: "Добро пожаловать!", infoHowTo: "Как пользоваться справочником?",
        infoOpenBtn: "Открыть справочник", infoCloseBtn: "Понятно",
        infoText: `
            <div class="info-step-block">
                <div class="info-step-title">🔍 Шаг 1. Быстрый поиск и категории</div>
                <div class="info-step-text">Выбирайте свой посёлок вверху экрана для точной фильтрации. Чтобы найти услугу, используйте любой удобный способ: перелистывайте горизонтальные Вкладки, открывайте выпадающий Список категорий или просто пишите название (например, 'Пожарная' или 'Ремонт') в строке Поиск. Если не можете найти человека по короткому имени (Паша), введите полное (Павел).</div>
            </div>
            <div class="info-step-block">
                <div class="info-step-title">⭐ Шаг 2. Избранное и Безопасность</div>
                <div class="info-step-text">Нажмите звёздочку на карточке, чтобы добавить контакт в Избранное — они всегда будут под рукой. При нажатии на синюю кнопку 'Позвонить' сайт попросит подтверждение, чтобы защитить вас от случайных вызовов.</div>
            </div>
            <div class="info-step-block">
                <div class="info-step-title">🛡️ Шаг 3. Добавление и Ошибки</div>
                <div class="info-step-text">Проект бесплатный и общественный. Если вы знаете полезный контакт или хотите добавить себя — нажмите + Добавить. Если нашли неточность, нажмите на карточке кнопку ⚠️ Ошибка, чтобы отправить верные данные Администратору.</div>
            </div>
        `
    },
    kz: {
        title: "Ауыл анықтамалығы", search: "Іздеу...",
        reset: "Тазалау",
        mainBtn: "&nbsp;&nbsp;Қосу", favBtn: "&nbsp;&nbsp;Таңдаулылар",
        viewTabs: "👁️ Вкладқалар", viewSelect: "👁️ Тізім",
        noResults: "Ештеңе табылмады", callMob: "Қоңырау шалу",
        callGov: "Қалалық нөмірге қоңырау",
        numCopied: "Нөмір буферге көшірілді!",
        shareCopied: "Сілтеме көшірілді! Достарыңызға жіберіңіз.",
        confirmErr: "Бұл контактідегі қате туралы әкімшіге хабарлағыңыз келе ме?",
        mTitle: "Жаңа сауалнама формасы", mCustomOpt: "Санатты өз қолыңызбен жазу...",
        lblHasWa: "Бұл нөмірде WhatsApp бар", mSubmit: "WhatsApp-қа жіберу",
        mAlert: "Санатты, Атауды және Телефонды толтырыңыз!",
        infoWelcome: "Қош келдіңіздер!", infoHowTo: "Анықтамалықты қалай пайдалану керек?",
        infoOpenBtn: "Анықтамалықты ашу", infoCloseBtn: "Жақсы",
        infoText: `
            <div class="info-step-block">
                <div class="info-step-title">🔍 1-қадам. Жылдам іздеу және санаттар</div>
                <div class="info-step-text">Дұрыс сүзу үшін экранның жоғарғы жағынан өз ауылыңызды таңдаңыз. Қызметті табу үшін кез келген ыңғайлы әдісті қолданыңыз: көлденең Вкладқаларды парақтаңыз, санаттардың ашылатын Тізімін ашыңыз немесе Іздеу жолына атауын жазыңыз. Егер адамды қысқа атымен таппасаңыз, толық атын енгізіңіз.</div>
            </div>
            <div class="info-step-block">
                <div class="info-step-title">⭐ 2-қадам. Таңдаулылар және Қауіпсіздік</div>
                <div class="info-step-text">Таңдаулыларға қосу үшін карточкадағы жұлдызшаны басыңыз. Қоңырау шалу батырмасын басқанда, кездейсоқ қоңыраулардан қорғау үшін сайт растауды сұрайды.</div>
            </div>
            <div class="info-step-block">
                <div class="info-step-title">🛡️ 3-қадам. Қосу және Қателер</div>
                <div class="info-step-text">Жоба тегін және қоғамдық. Егер сіз анықтамалыққа жоқ пайдалы контактіні білсеңіз немесе өзіңізді қосқыңыз келсе + Қосу батырмасын басыңыз. Қате тапсаңыз, әкімшіге түзету жіберу үшін карточкадағы ⚠️ Қате батырмасын басыңыз.</div>
            </div>
        `
    }
};
// Инициализация при полной загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupEventListeners();
    handleWelcomeCounter();
    loadDatabase();
});

function setupEventListeners() {
    document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
    document.getElementById("searchInput")?.addEventListener("input", handleSearchInput);
    document.getElementById("clearSearch")?.addEventListener("click", clearSearch);
    document.getElementById("villageSelect")?.addEventListener("change", handleVillageChange);
    document.getElementById("favTabBtn")?.addEventListener("click", switchToFavoritesCategory);
    document.getElementById("addContactBtn")?.addEventListener("click", openAddModal);
    document.getElementById("closeModal")?.addEventListener("click", closeAddModal);
    document.getElementById("submitContactForm")?.addEventListener("click", handleFormSubmit);
    document.getElementById("viewModeToggle")?.addEventListener("click", toggleViewMode);
    
    // Привязка кнопки Инфо (i) и переключателей в модалке приветствия
    document.getElementById("btnInfo")?.addEventListener("click", openWelcomeModalManual);
    document.getElementById("closeWelcomeModal")?.addEventListener("click", closeWelcomeModal);
    document.getElementById("m-btn-ru")?.addEventListener("click", () => setWelcomeModalLang("ru"));
    document.getElementById("m-btn-kz")?.addEventListener("click", () => setWelcomeModalLang("kz"));
}

function initTheme() {
    const isDark = localStorage.getItem("dar_theme") === "dark";
    if (isDark) document.body.classList.add("dark-mode");
    updateThemeIcon();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dar_theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById("themeToggle");
    if (icon) icon.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// Умный автоматический счетчик посещений
function handleWelcomeCounter() {
    let visits = parseInt(localStorage.getItem("dar_visit_count") || "0");
    visits += 1;
    localStorage.setItem("dar_visit_count", visits);

    const modal = document.getElementById("welcomeModal");
    if (!modal) return;

    if (visits === 1 || visits % 20 === 0) {
        window.app.isManualOpen = false; // Автоматический запуск
        modal.style.display = "flex";
        setWelcomeModalLang(window.app.currentLang);
    } else {
        modal.style.display = "none";
    }
}

// Ручной вызов окна через круглую кнопку (i) в шапке
function openWelcomeModalManual() {
    const modal = document.getElementById("welcomeModal");
    if (modal) {
        window.app.isManualOpen = true; // Сигнал для смены текста кнопки
        modal.style.display = "flex";
        setWelcomeModalLang(window.app.currentLang);
    }
}

// Перевод внутри приветственной модалки и смена текста кнопки
function setWelcomeModalLang(lang) {
    document.getElementById("m-btn-ru")?.classList.toggle("lang-btn-active", lang === "ru");
    document.getElementById("m-btn-kz")?.classList.toggle("lang-btn-active", lang === "kz");
    
    const title = document.getElementById("welcomeModalTitle");
    const body = document.getElementById("welcomeModalText");
    const btn = document.getElementById("btnWelcomeAction");
    
    if (title) title.textContent = dict[lang].infoHowTo;
    if (body) body.innerHTML = dict[lang].infoText;
    
    if (btn) {
        btn.textContent = window.app.isManualOpen ? dict[lang].infoCloseBtn : dict[lang].infoOpenBtn;
    }
}

function closeWelcomeModal() {
    document.getElementById("welcomeModal").style.display = "none";
  }
function toggleLanguage() {
    window.app.currentLang = window.app.currentLang === "ru" ? "kz" : "ru";
    localStorage.setItem("dar_lang", window.app.currentLang);
    setLang(window.app.currentLang);
}

function setLang(lang) {
    document.getElementById("langToggle").textContent = lang === "ru" ? "KZ" : "RU";
    document.getElementById("searchInput").placeholder = dict[lang].searchPlaceholder;
    document.getElementById("favTabBtn").innerHTML = `<span>${dict[lang].favBtn}</span>`;
    document.getElementById("addContactBtn").innerHTML = `<span>${dict[lang].addBtn}</span>`;
    
    const villageSelect = document.getElementById("villageSelect");
    if (villageSelect) {
        const villages = lang === "ru" 
            ? ["Дарьинское", "Трёкино", "Озёрное", "Рубежка", "Володарка"]
            : ["Дария", "Трекин", "Озерное", "Рубежка", "Володарка"];
        const currentVal = villageSelect.value;
        villageSelect.innerHTML = villages.map(v => `<option value="${v}">${v}</option>`).join("");
        if (currentVal) villageSelect.value = currentVal;
    }

    renderTabs();
    buildFormCategorySelect();
    renderCards();
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
    
    if (!tabsContainer || !selectContainer) return;

    if (window.app.currentViewMode === "tabs") {
        tabsContainer.style.display = "flex";
        selectContainer.style.display = "none";
        if (toggleBtn) toggleBtn.textContent = "📱";
        
        tabsContainer.innerHTML = categories.map(cat => {
            const label = categoryTranslations[cat][window.app.currentLang];
            const activeClass = window.app.activeCategory === cat ? "active" : "";
            return `<button class="tab ${activeClass}" onclick="selectCategory('${cat}')">${label}</button>`;
        }).join("");
        
        setTimeout(() => {
            const activeTab = tabsContainer.querySelector(".tab.active");
            if (activeTab) activeTab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 50);
    } else {
        tabsContainer.style.display = "none";
        selectContainer.style.display = "block";
        if (toggleBtn) toggleBtn.textContent = "📋";
        
        selectContainer.innerHTML = `
            <select class="nav-select" onchange="selectCategory(this.value)">
                ${categories.map(cat => {
                    const label = categoryTranslations[cat][window.app.currentLang];
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

// Загрузка и парсинг базы данных округа
function loadDatabase() {
    fetch(`baza_darinsk.txt?v=${Date.now()}`)
        .then(res => res.text())
        .then(text => {
            window.app.allContacts = [];
            const lines = text.split("\n");
            
            for (let line of lines) {
                const lineClean = line.trim();
                // БЛОК №31: Надежное отсечение комментариев и пустых строк
                if (!lineClean || lineClean.startsWith("#") || !lineClean.includes("|")) continue;
                
                const cells = lineClean.split("|").map(c => c.trim());
                // БАГ №2 ИСПРАВЛЕН: жесткая и честная сверка структуры ячеек базы данных
                if (cells.length === 7) {
                    window.app.allContacts.push({
                        category: cells[0],
                        title: cells[1],
                        phone: cells[2],
                        name: cells[3] === "." ? "" : cells[3],
                        desc: cells[4] === "." ? "" : cells[4],
                        address: cells[5] === "." ? "" : cells[5],
                        waStatus: cells[6]
                    });
                }
            }
            setLang(window.app.currentLang);
            renderAlphabet();
        })
        .catch(err => console.error("Ошибка загрузки базы данных:", err));
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
    const query = document.getElementById("searchInput").value.trim();
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";
    renderCards();
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) clearBtn.style.display = "none";
    renderCards();
}

function handleVillageChange(e) {
    window.app.activeVillage = e.target.value;
    clearSearch();
}

function renderCards() {
    const container = document.getElementById("contactsContainer");
    if (!container) return;

    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const favs = JSON.parse(localStorage.getItem("dar_favorites") || "[]");
    let filtered = window.app.allContacts;

    if (window.app.activeCategory === "FAVORITES") {
        filtered = filtered.filter(c => favs.includes(c.phone));
    } else {
        filtered = filtered.filter(c => c.category === window.app.activeCategory);
    }

    if (window.app.activeCategory !== "FAVORITES" && window.app.activeCategory !== "🚨 АВАРИЙНАЯ" && window.app.activeCategory !== "ГОССЛУЖБЫ") {
        const villageKeyword = window.app.activeVillage.toLowerCase();
        filtered = filtered.filter(c => {
            const loc = c.address.toLowerCase();
            const tit = c.title.toLowerCase();
            return loc.includes(villageKeyword) || tit.includes(villageKeyword) || (!loc.includes("трекин") && !loc.includes("трёкино") && !loc.includes("рубеж") && !loc.includes("озёрн") && !loc.includes("володар"));
        });
    }

    if (window.app.activeLetter) {
        filtered = filtered.filter(c => c.title.trim().toUpperCase().startsWith(window.app.activeLetter));
    }

    if (query) {
        filtered = filtered.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.desc.toLowerCase().includes(query) || 
            c.address.toLowerCase().includes(query) || 
            c.phone.includes(query)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-results">${dict[window.app.currentLang].noResults}</div>`;
        return;
    }

    container.innerHTML = filtered.map(c => {
        const isFav = favs.includes(c.phone) ? "active" : "";
        const cleanNum = c.phone.replace(/\D/g, "").slice(-10);
        
        const formattedPhone = cleanNum.length === 10 
            ? `+7 (${cleanNum.slice(0,3)}) ${cleanNum.slice(3,6)}-${cleanNum.slice(6,8)}-${cleanNum.slice(8,10)}`
            : c.phone;

        // БАГ №1 ИСПРАВЛЕН: Безопасный URL без слэшей
        const waLink = `https://whatsapp.com{cleanNum}&text=${encodeURIComponent("Здравствуйте!")}`;
        const hasWa = c.waStatus === "$";

        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <span class="card-category-badge">${categoryTranslations[c.category]?.[window.app.currentLang] || c.category}</span>
                        <h3 class="card-title">${c.title}</h3>
                    </div>
                    <button class="fav-star ${isFav}" onclick="toggleFavorite('${c.phone}', this)">★</button>
                </div>
                <div class="card-body">
                    ${c.name ? `<p class="card-name">👤 ${c.name}</p>` : ""}
                    ${c.desc ? `<p class="card-desc">📝 ${c.desc}</p>` : ""}
                    ${c.address ? `<p class="card-landmark">📍 ${c.address}</p>` : ""}
                    <p class="card-phone card-phone-line">${formattedPhone}</p>
                </div>
                <div class="card-actions">
                    <a href="tel:+7${cleanNum}" class="btn btn-call ${hasWa ? "" : "w-100"}">📞 Звонок</a>
                    ${hasWa ? `<a href="${waLink}" target="_blank" class="btn btn-wa">💬 WhatsApp</a>` : ""}
                </div>
                <div class="card-footer-links">
                    <a href="https://whatsapp.com{adminPhone}&text=${encodeURIComponent("Ошибка в контакте: " + c.title)}" target="_blank" class="report-err">⚠️ ${dict[window.app.currentLang].errorReport}</a>
                </div>
            </div>
        `;
    }).join("");
}

function toggleFavorite(phone, element) {
    let favs = JSON.parse(localStorage.getItem("dar_favorites") || "[]");
    if (favs.includes(phone)) {
        favs = favs.filter(p => p !== phone);
        element.classList.remove("active");
    } else {
        favs.push(phone);
        element.classList.add("active");
    }
    localStorage.setItem("dar_favorites", JSON.stringify(favs));
    if (window.app.activeCategory === "FAVORITES") renderCards();
}

function openAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "flex";
    buildFormCategorySelect();
}

function closeAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "none";
}

function buildFormCategorySelect() {
    const select = document.getElementById("formCategorySelect");
    if (!select) return;
    select.innerHTML = categories.map(cat => {
        return `<option value="${cat}">${categoryTranslations[cat][window.app.currentLang]}</option>`;
    }).join("");
}

function handleFormSubmit(e) {
    e.preventDefault();
    const cat = document.getElementById("formCategorySelect").value;
    const title = document.getElementById("formTitle").value.trim();
    const phone = document.getElementById("formPhone").value.trim().replace(/\D/g, "").slice(-10);
    const name = document.getElementById("formName").value.trim() || ".";
    const desc = document.getElementById("formDesc").value.trim() || ".";
    const addr = document.getElementById("formAddress").value.trim() || ".";

    if (!title || phone.length !== 10) {
        alert("Заполните название и корректный номер телефона!");
        return;
    }

    const vcard = `BEGIN:VCARD%0AVERSION:3.0%0AFN:${title}%0ATEL;CELL:+7${phone}%0ANOTE:${cat} | ${desc}%0AADR:${addr}%0AEND:VCARD`;
    const text = `Новая заявка в справочник!%0A%0A${cat} | ${title} | ${phone} | ${name} | ${desc} | ${addr} | $%0A%0AСкопируйте vCard ниже для сохранения:%0A${vcard}`;
    
    window.open(`https://whatsapp.com{adminPhone}&text=${text}`, "_blank");
    closeAddModal();
}

let touchStartX = 0;
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches.screenX;
    touchStartY = e.changedTouches.screenY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
    if (window.app.currentViewMode !== "tabs" || window.app.activeCategory === "FAVORITES") return;
    const modal = document.getElementById("addModal");
    if (modal && modal.style.display === "flex") return;

    const diffX = touchStartX - e.changedTouches.screenX;
    const diffY = touchStartY - e.changedTouches.screenY;

    if (Math.abs(diffX) > 100 && Math.abs(diffY) < 45) {
        let idx = categories.indexOf(window.app.activeCategory);
        if (diffX > 0) {
            idx = (idx + 1) % categories.length;
        } else {
            idx = (idx - 1 + categories.length) % categories.length;
        }
        selectCategory(categories[idx]);
    }
}, { passive: true });
        
