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

    if (window.app.searchTags && window.app.searchTags[query]) {
        window.app.activeCategory = window.app.searchTags[query];
        renderTabs();
    }
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
    if (!container || !window.app.dict[window.app.currentLang]) return;

    let query = document.getElementById("searchInput").value.trim().toLowerCase();
    const favs = JSON.parse(localStorage.getItem("dar_favorites") || "[]");
    let filtered = window.app.allContacts;

    if (window.app.nameSynonyms && window.app.nameSynonyms[query]) {
        query = window.app.nameSynonyms[query];
    }

    if (window.app.activeCategory === "FAVORITES") {
        filtered = filtered.filter(c => favs.includes(c.phone));
    } else {
        filtered = filtered.filter(c => c.category === window.app.activeCategory);
    }

    // СНАЙПЕРСКАЯ ФИЛЬТРАЦИЯ ПОСЕЛКОВ С ПОДДЕРЖКОЙ СЛОВА "ОКРУГ" (Вариант Б)
    if (window.app.activeCategory !== "FAVORITES" && window.app.activeCategory !== "🚨 АВАРИЙНАЯ" && window.app.activeCategory !== "ГОССЛУЖБЫ" && window.app.activeCategory !== "ПОЛИЦИЯ") {
        const villageKeyword = window.app.activeVillage.toLowerCase();
        filtered = filtered.filter(c => {
            const loc = c.address.toLowerCase();
            return loc.includes(villageKeyword) || loc.includes("округ");
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
            c.phone.replace(/\D/g, "").includes(query)
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-results">${window.app.dict[window.app.currentLang].noResults}</div>`;
        return;
    }
    container.innerHTML = filtered.map(c => {
        const isFav = favs.includes(c.phone) ? "active" : "";
        const cleanNum = c.phone.replace(/\D/g, "").slice(-10);
        
        let formattedPhone = c.phone;
        if (cleanNum.length === 10 && !c.phone.startsWith("1")) {
            formattedPhone = `+7 (${cleanNum.slice(0,3)}) ${cleanNum.slice(3,6)}-${cleanNum.slice(6,8)}-${cleanNum.slice(8,10)}`;
        }

        const waLink = `https://whatsapp.com{cleanNum}&text=${encodeURIComponent("Здравствуйте!")}`;
        const hasWa = c.waStatus === "$";

        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <span class="card-category-badge">${window.app.categoryTranslations[c.category]?.[window.app.currentLang] || c.category}</span>
                        <h3 class="card-title">${c.title}</h3>
                    </div>
                    <button class="fav-star ${isFav}" onclick="toggleFavorite('${c.phone}', this)">★</button>
                </div>
                <div class="card-body">
                    ${c.name ? `<p>👤 ${c.name}</p>` : ""}
                    ${c.desc ? `<p>📝 ${c.desc}</p>` : ""}
                    ${c.address ? `<p>📍 ${c.address}</p>` : ""}
                    <p class="card-phone card-phone-line">${formattedPhone}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-call ${hasWa ? "" : "w-100"}" onclick="makeCall('${c.phone}', '${c.title}', '${c.address}')">📞 Звонок</button>
                    ${hasWa ? `<a href="${waLink}" target="_blank" class="btn btn-wa">💬 WhatsApp</a>` : ""}
                </div>
                <div class="card-footer-links">
                    <a href="https://whatsapp.com{adminPhone}&text=${encodeURIComponent("Ошибка в контакте: " + c.title)}" target="_blank" class="report-err">⚠️ ${window.app.dict[window.app.currentLang].errorReport || "Ошибка"}</a>
                </div>
            </div>
        `;
    }).join("");
}
function makeCall(phone, title, address) {
    const d = window.app.dict[window.app.currentLang];
    const clean = phone.replace(/\D/g, "");
    let finalPhone = phone;

    if (clean.length < 10) {
        let detectedVillage = window.app.activeVillage;
        const addrLower = address.toLowerCase();
        if (addrLower.includes("рубеж")) detectedVillage = "Рубежка";
        if (addrLower.includes("трекин") || addrLower.includes("трёкин")) detectedVillage = "Трёкино";
        if (addrLower.includes("озёрн") || addrLower.includes("озерн")) detectedVillage = "Озёрное";
        if (addrLower.includes("володар")) detectedVillage = "Володарка";

        const areaCode = window.app.villageAreaCodes[detectedVillage] || "71131";
        finalPhone = `+7${areaCode}${clean}`;
    } else {
        finalPhone = `+7${clean.slice(-10)}`;
    }

    if (confirm(`${d.callMob || "Позвонить"} ${title}?\n${finalPhone}`)) {
        window.location.href = `tel:${finalPhone}`;
    }
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
    const categories = Object.keys(window.app.categoryTranslations || {});
    if (!select || categories.length === 0) return;
    select.innerHTML = categories.map(cat => {
        const label = window.app.categoryTranslations[cat]?.[window.app.currentLang] || cat;
        return `<option value="${cat}">${label}</option>`;
    }).join("");
}

function handleFormSubmit(e) {
    e.preventDefault();
    const d = window.app.dict[window.app.currentLang];
    const cat = document.getElementById("formCategorySelect").value;
    const title = document.getElementById("formTitle").value.trim();
    const phone = document.getElementById("formPhone").value.trim().replace(/\D/g, "").slice(-10);
    const name = document.getElementById("formName").value.trim() || ".";
    const desc = document.getElementById("formDesc").value.trim() || ".";
    const addr = document.getElementById("formAddress").value.trim() || ".";
    const schedule = document.getElementById("formSchedule").value.trim() || ".";

    if (!title || phone.length !== 10) {
        alert(d.mAlert || "Ошибка заполнения!");
        return;
    }

    const vcard = `BEGIN:VCARD%0AVERSION:3.0%0AFN:${title}%0ATEL;CELL:+7${phone}%0ANOTE:${cat} | ${desc} | Время работы: ${schedule}%0AADR:${addr}%0AEND:VCARD`;
    const text = `Новая заявка в справочник!%0A%0A${cat} | ${title} | ${phone} | ${name} | ${desc} | ${addr} | ${schedule} | $%0A%0AСкопируйте vCard ниже для сохранения:%0A${vcard}`;
    
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
    const addMod = document.getElementById("addModal");
    const welMod = document.getElementById("welcomeModal");
    if ((addMod && addMod.style.display === "flex") || (welMod && welMod.style.display === "flex")) return;

    const diffX = touchStartX - e.changedTouches.screenX;
    const diffY = touchStartY - e.changedTouches.screenY;
    const categories = Object.keys(window.app.categoryTranslations || {});

    if (Math.abs(diffX) > 100 && Math.abs(diffY) < 45 && categories.length > 0) {
        let idx = categories.indexOf(window.app.activeCategory);
        if (diffX > 0) {
            idx++; if (idx >= categories.length) idx = 0;
        } else {
            idx--; if (idx < 0) idx = categories.length - 1;
        }
        selectCategory(categories[idx]);
    }
}, { passive: true });
