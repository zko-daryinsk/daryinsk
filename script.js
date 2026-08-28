const adminPhone = "77058120376";

window.app = {
    allContacts: [],
    activeCategory: "",
    activeLetter: "",
    currentLang: "ru",
    currentViewMode: "tabs",
    villages: [],
    activeVillage: "darinsk"
};

const nameSynonyms = {
    "саня": "александр", "санек": "александр",
    "вова": "владимир", "володя": "владимир",
    "паша": "павел", "леша": "алексей",
    "алеша": "алексей", "петя": "петр",
    "серик": "серикбол", "али": "алихан",
    "баха": "бахтияр", "маха": "махамбет"
};
const categoryTranslations = {
    "АВАРИЙНАЯ": { "ru": "🚨 АВАРИЙНАЯ", "kz": "🚨 АПАТТЫҚ" },
    "ПОЛИЦИЯ": { "ru": "👮 ПОЛИЦИЯ", "kz": "👮 ПОЛИЦИЯ" },
    "АВТОСЕРВИС": { "ru": "🔧 АВТОСЕРВИС", "kz": "🔧 АВТОСЕРВИС" },
    "АПТЕКИ": { "ru": "💊 АПТЕКИ", "kz": "💊 ДӘРІХАНАЛАР" },
    "БАНИ": { "ru": "🧼 БАНИ", "kz": "🧼 МАСАЖ/МОНША" },
    "ГОССЛУЖБЫ": { "ru": "🏛️ СЛУЖБЫ", "kz": "🏛️ ҚЫЗМЕТТЕР" },
    "ГРУЗОПЕРЕВОЗКИ": { "ru": "🚚 ГРУЗОПЕРЕВОЗКИ", "kz": "🚚 ЖҮК ТАСЫМАЛЫ" },
    "ДОСТАВКА": { "ru": "📦 ДОСТАВКА", "kz": "📦 ЖЕТКІЗУ" },
    "ДРОВА": { "ru": "🪵 ДРОВА", "kz": "🪵 ОҚЫН/ОТЫН" },
    "ЖИТЕЛИ": { "ru": "👤 ЖИТЕЛИ", "kz": "👤 ТҰРҒЫНДАР" },
    "ИНТЕРНЕТ": { "ru": "🌐 ИНТЕРНЕТ", "kz": "🌐 ИНТЕРНЕТ" },
    "КРАСОТА": { "ru": "💅 КРАСОТА", "kz": "💅 СҰЛУЛЫҚ" },
    "МАГАЗИНЫ": { "ru": "🛒 МАГАЗИНЫ", "kz": "🛒 ДҮКЕНДЕР" },
    "МЕДИЦИНА": { "ru": "🩺 МЕДИЦИНА", "kz": "🩺 МЕДИЦИНА" },
    "МАСТЕРА": { "ru": "👨‍🔧 МАСТЕРА", "kz": "👨‍🔧 ШЕБЕРЛЕР" },
    "МЕБЕЛЬ": { "ru": "🛋️ МЕБЕЛЬ", "kz": "🛋️ ЖИҺАЗ" },
    "НОТАРИУС": { "ru": "⚖️ НОТАРИУС", "kz": "⚖️ НОТАРИУС" },
    "ОТДЫХ": { "ru": "🏕️ ОТДЫХ", "kz": "🏕️ ДЕМ АЛЫС" },
    "ПРОДУКТЫ": { "ru": "🍞 ПРОДУКТЫ", "kz": "🍞 АЗЫҚ-ТҮЛІК" },
    "РЕМОНТ": { "ru": "🛠️ РЕМОНТ", "kz": "🛠️ ЖӨНДЕУ" },
    "РИТУАЛ": { "ru": "🪦 РИТУАЛ", "kz": "🪦 РИТУАЛ" },
    "СЕПТИКИ": { "ru": "🛢️ СЕПТИКИ", "kz": "🛢️ СЕПТИКТЕР" },
    "ТАКСИ": { "ru": "🚖 ТАКСИ", "kz": "🚖 ТАКСИ" },
    "УСЛУГИ": { "ru": "📋 УСЛУГИ", "kz": "📋 ҚЫЗМЕТТЕР" },
    "ШКОЛА": { "ru": "🎒 ШКОЛА", "kz": "🎒 МЕКТЕП" },
    "ЭЛЕКТРИКИ": { "ru": "⚡ ЭЛЕКТРИКИ", "kz": "⚡ ЭЛЕКТРИКТЕР" },
    "СВАРЩИКИ": { "ru": "👨‍🏭 СВАРЩИКИ", "kz": "👨‍🏭 СВАРШИКТЕР" },
    "ФАСТФУД": { "ru": "🍔 ФАСТФУД", "kz": "🍔 ФАСТФУД" },
    "ОКНА": { "ru": "🪟 ОКНА/ПОТОЛКИ", "kz": "🪟 ТЕРЕЗЕЛЕР" },
    "ПТИЦЫ": { "ru": "🐥 ПТИЦЕВОДСТВО", "kz": "🐥 ҚҰСТАР" },
    "FAVORITES": { "ru": "⭐ Избранное", "kz": "⭐ Таңдаулы" }
};
const dict = {
    ru: {
        title: "Справочник посёлков", search: "Поиск...", reset: "Сбросить",
        mainBtn: "➕ Добавить", favBtn: "⭐ Избранное", viewTabs: "👁‍🗨 Вкладки", viewSelect: "👁‍🗨 Список",
        noResults: "Ничего не найдено", callMob: "Позвонить", callGov: "Позвонить на городской",
        numCopied: "Номер скопирован в буфер обмена!", shareCopied: "Ссылка скопирована! Отправьте её друзьям.",
        confirmErr: "Хотите сообщить администратору об ошибке в этом контакте?",
        mTitle: "Новая анкетная форма", mCustomOpt: "Вписать категорию руками...",
        lblHasWA: "На этом номере есть WhatsApp", mSubmit: "Отправить в WhatsApp", mAlert: "Заполните Посёлок, Категорию, Название и Телефон!"
    },
    kz: {
        title: "Ауыл анықтамалығы", search: "Іздеу...", reset: "Тазалау",
        mainBtn: "➕ Қосу", favBtn: "⭐ Таңдаулы", viewTabs: "👁‍🗨 Вкладкалар", viewSelect: "👁‍🗨 Тізім",
        noResults: "Ештеңе табылмады", callMob: "Қоңырау шалу", callGov: "Қалалық нөмірге қоңырау",
        numCopied: "Нөмір буферге көшірілді!", shareCopied: "Сілтеме көшірілді! Достарыңызға жіберіңіз.",
        confirmErr: "Бұл kontaktідеғы қате туралы әкімшіге хабарлағыңыз келе ме?",
        mTitle: "Жаңа сауалнама формасы", mCustomOpt: "Санатты өз қолыңызбен жазу...",
        lblHasWA: "Бұл нөмірде WhatsApp бар", mSubmit: "WhatsApp-қа жіберу", mAlert: "Санатты, Атауды және Телефонды толтырыңыз!"
    }
};

function normalizeString(str) {
    if (!str) return "";
    return str.toString().toLowerCase()
        .replace(/ё/g, "е").replace(/ә/g, "а").replace(/ғ/g, "г").replace(/қ/g, "к").replace(/ң/g, "н")
        .replace(/ө/g, "о").replace(/ұ/g, "у").replace(/ү/g, "у").replace(/і/g, "и")
        .replace(/h/g, "х").replace(/һ/g, "х").replace(/[^a-z0-9а-яё]/g, "");
}
function initApp() {
    restoreViewMode();
    loadVillages();
}

function loadVillages() {
    fetch("villages.txt?v=" + new Date().getTime())
        .then(function(res) { if (!res.ok) throw new Error(); return res.text(); })
        .then(function(data) {
            window.app.villages = [];
            data.split("\n").forEach(function(line) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#")) return;
                const cells = trimmed.split("|").map(function(c) { return c.trim(); });
                if (cells.length >= 3) {
                    window.app.villages.push({ id: cells[0], ru: cells[1], kz: cells[2] });
                }
            });
            window.app.activeVillage = "darinsk";
            renderVillageSelector();
            buildFormVillageSelect();
            loadBazaByVillage(window.app.activeVillage);
        })
        .catch(function() {
            window.app.villages = [{ id: "darinsk", ru: "Посёлок Дарьинское", kz: "Дарьинское ауылы" }];
            window.app.activeVillage = "darinsk";
            renderVillageSelector();
            buildFormVillageSelect();
            loadBazaByVillage("darinsk");
        });
}

function buildFormVillageSelect() {
    var s = document.getElementById("formVillageSelect"); if (!s) return; s.innerHTML = "";
    window.app.villages.forEach(function(v) {
        var o = document.createElement("option"); o.value = v.id;
        o.innerText = "📍 КУДА: " + (window.app.currentLang === "ru" ? v.ru : v.kz);
        s.appendChild(o);
    });
}
function renderVillageSelector() {
    const container = document.getElementById("villageSelectorContainer");
    if (!container) return; container.innerHTML = "";
    window.app.villages.forEach(function(v) {
        const btn = document.createElement("button");
        btn.style.cssText = "padding:4px 10px; font-size:12px; font-weight:600; border:none; border-radius:20px; cursor:pointer; white-space:nowrap; transition:all 0.2s ease; margin-right:4px;";
        if (v.id === window.app.activeVillage) { btn.style.background = "#0b66ff"; btn.style.color = "white"; }
        else { btn.style.background = "rgba(0,0,0,0.06)"; btn.style.color = "#4a5568"; }
        btn.innerText = "📍 " + (window.app.currentLang === "ru" ? v.ru : v.kz);
        btn.onclick = function() {
            if (window.app.activeVillage === v.id) return;
            window.app.activeVillage = v.id; renderVillageSelector(); loadBazaByVillage(v.id);
        };
        container.appendChild(btn);
    });
}
function loadBazaByVillage(villageId) {
    const fileName = "baza_" + villageId + ".txt";
    fetch(fileName + "?v=" + new Date().getTime())
        .then(function(res) { if (!res.ok) throw new Error(); return res.text(); })
        .then(function(data) {
            window.app.allContacts = [];
            const rawCategories = new Set();
            data.split("\n").forEach(function(line) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#")) return;
                const cells = trimmed.split("|").map(function(c) { return c.trim(); });
                if (cells.length === 7) {
                    rawCategories.add(cells[0].toUpperCase());
                    window.app.allContacts.push({
                        category: cells[0].toUpperCase(), title: cells[1], phone: cells[2],
                        fio: cells[3], desc: cells[4], landmark: cells[5], waStatus: cells[6]
                    });
                }
            });
                        const sortedCategories = [...rawCategories].sort(function(a, b) { return a.localeCompare(b); });
            window.app.activeCategory = sortedCategories.length > 0 ? sortedCategories[0] : "";
            window.app.activeLetter = "";
            const currentV = window.app.villages.find(function(v) { return v.id === villageId; });
            if (currentV) { document.getElementById("siteTitle").innerText = window.app.currentLang === "ru" ? currentV.ru : currentV.kz; }
            setLang(window.app.currentLang);
            if (!localStorage.getItem("dar_welcome_seen")) { showWelcomeModal(); localStorage.setItem("dar_welcome_seen", "true"); }
        })
        .catch(function() {
            window.app.allContacts = [];
            const content = document.getElementById("content");
            if (content) content.innerHTML = "<div style='text-align:center; padding:20px; color:#999;'>" + dict[window.app.currentLang].noResults + "</div>";
            setLang(window.app.currentLang);
        });
}
function clearDot(str) { if (!str || str.trim() === ".") return ""; return str.trim(); }

function getClean10Digits(rawPhone) {
    if (!rawPhone) return "";
    let digits = rawPhone.toString().replace(/[^0-9]/g, "").trim();
    if (digits.length === 3) return digits;
    if (digits.length >= 10) { digits = digits.substring(digits.length - 10); }
    return digits;
}

function formatPhoneNumber(pureDigits) {
    if (pureDigits.length === 3) return pureDigits;
    if (pureDigits.length !== 10) return pureDigits;
    if (pureDigits.startsWith("71131")) {
        return "+7 (" + pureDigits.substring(0, 5) + ") " + pureDigits.substring(5, 6) + "-" + pureDigits.substring(6, 8) + "-" + pureDigits.substring(8, 10);
    }
    return "+7 " + pureDigits.substring(0, 3) + " " + pureDigits.substring(3, 6) + "-" + pureDigits.substring(6, 8) + "-" + pureDigits.substring(8, 10);
}
function downloadVCard(category, title, pureDigits, fio) {
    const fullName = clearDot(fio) ? clearDot(title) + " (" + clearDot(fio) + ")" : clearDot(title);
    const vcardPhone = (pureDigits.length === 3) ? pureDigits : (pureDigits.startsWith("71131") ? "+" + pureDigits : "+7" + pureDigits);
    const vcardText = "BEGIN:VCARD\nVERSION:3.0\nFN:" + fullName + "\nTEL;TYPE=CELL:" + vcardPhone + "\nNOTE:Справочник\nEND:VCARD";
    const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url;
    link.download = clearDot(title).replace(/[^а-яА-ЯёЁa-zA-Z0-9]/g, "_") + ".vcf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
}

function handleSearch() {
    const sInput = document.getElementById("searchInput"); if (!sInput) return;
    const rawQuery = sInput.value.trim().toLowerCase();
    const btnReset = document.getElementById("btnReset"); if (btnReset) btnReset.style.display = (rawQuery.length > 0) ? "block" : "none";
    const tabsRow = document.querySelector(".categories-control-row");
    const sTitle = document.getElementById("searchTitleContainer");
    
    if (rawQuery.length > 0) {
        if (tabsRow) tabsRow.style.display = "none";
        if (sTitle) { sTitle.style.display = "block"; sTitle.innerText = (window.app.currentLang === "ru" ? "Результаты поиска по запросу: " : "Іздеу нәтижелері: ") + sInput.value; }
    } else {
        if (tabsRow) tabsRow.style.display = "flex";
        if (sTitle) sTitle.style.display = "none";
    }
    renderCards();
}
function renderCards() {
    const container = document.getElementById("content"); if (!container) return; container.innerHTML = "";
    const sInput = document.getElementById("searchInput");
    let query = sInput ? sInput.value.trim().toLowerCase() : "";
    const isSearching = query.length > 0;
    if (isSearching && nameSynonyms[query]) { query = nameSynonyms[query]; }
    const normQuery = normalizeString(query);
    let favorites = JSON.parse(localStorage.getItem("dar_fav_numbers") || "[]");
    let filtered = window.app.allContacts.filter(function(item) {
        if (window.app.activeCategory === "FAVORITES" && !isSearching) return favorites.includes(getClean10Digits(item.phone));
        if (isSearching) {
            return normalizeString(item.category + item.title + item.phone + item.fio + item.desc + item.landmark).includes(normQuery) || item.phone.includes(query);
        }
        return item.category === window.app.activeCategory;
    });
    if (window.app.activeCategory === "ЖИТЕЛИ" && !isSearching) {
        const letters = new Set(); filtered.forEach(function(i) { const f = i.title.trim().toUpperCase(); if (f) letters.add(f.substring(0, 1)); });
        renderAlphabet([...letters].sort(function(a, b) { return a.localeCompare(b); }));
        if (window.app.activeLetter) filtered = filtered.filter(function(i) { return i.title.trim().toUpperCase().startsWith(window.app.activeLetter); });
    } else { const ac = document.getElementById("alphabetContainer"); if (ac) ac.style.display = "none"; }
    if (filtered.length === 0) { container.innerHTML = "<div style='text-align:center; padding:20px; color:#999;'>" + dict[window.app.currentLang].noResults + "</div>"; return; }
    const grouped = [];
    filtered.forEach(function(item) {
        const existing = grouped.find(function(g) { return g.category === item.category && g.title.toLowerCase() === item.title.toLowerCase() && g.fio.toLowerCase() === item.fio.toLowerCase(); });
        if (existing) { if (item.phone) existing.phones.push({ num: item.phone, wa: item.waStatus, desc: item.desc, fio: item.fio }); }
        else { grouped.push({ category: item.category, title: item.title, fio: item.fio, desc: item.desc, landmark: item.landmark, phones: item.phone ? [{ num: item.phone, wa: item.waStatus, desc: item.desc, fio: item.fio }] : [] }); }
    });
        grouped.forEach(function(item) {
        if (!item.phones || item.phones.length === 0) return;
        const card = document.createElement("div"); card.className = "card";
        const tag = (categoryTranslations[item.category] && categoryTranslations[item.category][window.app.currentLang]) ? categoryTranslations[item.category][window.app.currentLang] : item.category;
        const p10 = getClean10Digits(item.phones[0].num);
        let html = "<div class='card-header-row'><span class='card-tag'>" + tag + "</span><button class='card-fav-btn " + (favorites.includes(p10) ? "active" : "") + "' onclick=\"toggleFavorite('" + p10 + "')\">★</button></div><div class='card-title'>" + item.title + "</div>";
        if (clearDot(item.fio) && item.phones.length === 1) html += "<div class='card-fio'>" + clearDot(item.fio) + "</div>";
        if (item.phones.length === 1 && clearDot(item.phones[0].desc)) html += "<div class='card-desc'>" + clearDot(item.phones[0].desc) + "</div>";
        if (clearDot(item.landmark)) html += "<div class='card-landmark'>📍 " + clearDot(item.landmark) + "</div>";
        item.phones.forEach(function(pObj) {
            const pureDigits = getClean10Digits(pObj.num);
            html += "<div style='margin-top:8px; padding-top:8px; border-top:1px dashed rgba(0,0,0,0.06);'>";
            const isLand = pureDigits.startsWith("71131");
            const isShort = pureDigits.length === 3;
            html += "<div class='card-phone-line' onclick=\"copyNumberOnly('" + pureDigits + "')\">📱 <b>" + formatPhoneNumber(pureDigits) + "</b></div>";
            if (item.phones.length > 1 && clearDot(pObj.desc)) html += "<div class='card-desc' style='font-size:13px; font-style:italic;'>📝 " + clearDot(pObj.desc) + "</div>";
            html += "<div class='card-actions'>";
            if (isShort) {
                html += "<a href='tel:" + pureDigits + "' class='btn-ui btn-ui-call' style='width:100%; flex:none;'>" + dict[window.app.currentLang].callGov + "</a>";
            } else if (isLand || pObj.wa === "NO_WA") {
                html += "<a href='tel:+" + pureDigits + "' class='btn-ui btn-ui-call' style='width:100%; flex:none;'>" + (isLand ? dict[window.app.currentLang].callGov : dict[window.app.currentLang].callMob) + "</a>";
            } else {
                const curUrl = window.location.origin + window.location.pathname;
                let msg = "Здравствуйте! Нашел ваш контакт в Справочнике поселков (" + curUrl + "). ";
                if (window.app.currentLang === "kz") msg = "Саламатсыз ба! Контактіңізді ауыл анықтамалығынан (" + curUrl + ") таптым. ";
                html += "<a href='tel:+7" + pureDigits + "' class='btn-ui btn-ui-call'>" + dict[window.app.currentLang].callMob + "</a><a href='whatsapp://send?phone=7" + pureDigits + "&text=" + encodeURIComponent(msg) + "' class='btn-ui btn-ui-wa'>WhatsApp</a>";
            }
            html += "</div></div>";
        });
        const curUrl = window.location.origin + window.location.pathname;
        const allNums = item.phones.map(function(p) { return formatPhoneNumber(getClean10Digits(p.num)); }).join(", ");
        const sTxt = clearDot(item.title) + ". Тел: " + allNums + ". Справочник: " + curUrl;
        html += "<div class='card-actions-row-three' style='display:flex; gap:6px; margin-top:14px; border-top:1px dashed #ccc; padding-top:10px;'>\n" +
            "<button class='btn-ui-mini' style='background:#6c757d; flex:1;' onclick=\"copyToClipboard('" + sTxt.replace(/'/g, "\\'") + "')\">🔗 Поделиться</button>\n" +
            "<button class='btn-ui-mini' style='background:#2563eb; flex:1;' onclick=\"downloadVCard('" + item.category + "', '" + item.title.replace(/'/g, "\\'") + "', '" + p10 + "', '" + item.fio.replace(/'/g, "\\'") + "')\">📥 Сохранить</button>\n" +
            "<button class='btn-ui-mini' style='background:#dc2626; flex:1;' onclick=\"reportErrorWithConfirm('" + item.category + "', '" + item.title.replace(/'/g, "\\'") + "', '" + allNums + "')\">⚠️ Ошибка</button></div>";
        card.innerHTML = html; container.appendChild(card);
    });
}
let touchStartX = 0, touchStartY = 0;
window.addEventListener("touchstart", function(e) { touchStartX = e.changedTouches.screenX; touchStartY = e.changedTouches.screenY; }, { passive: true });
window.addEventListener("touchend", function(e) {
    const sIn = document.getElementById("searchInput");
    if (window.app.currentViewMode !== "tabs" || (sIn && sIn.value.length > 0)) return;
    if (document.getElementById("welcomeModal") || (document.getElementById("addModal") && document.getElementById("addModal").style.display === "flex")) return;
    const diffX = touchStartX - e.changedTouches.screenX; const diffY = touchStartY - e.changedTouches.screenY;
    if (Math.abs(diffX) > 100 && Math.abs(diffY) < 45) {
        const categories = [...new Set(window.app.allContacts.map(function(i) { return i.category; }))].sort(function(a, b) { return a.localeCompare(b); });
        let idx = categories.indexOf(window.app.activeCategory);
        if (categories.length > 0) {
            if (diffX > 0) { idx = (idx < categories.length - 1) ? idx + 1 : 0; }
            else if (diffX < 0) { idx = (idx > 0) ? idx - 1 : categories.length - 1; }
            window.app.activeCategory = categories[idx]; window.app.activeLetter = ""; setLang(window.app.currentLang); window.scrollTo({ top: 0, behavior: "instant" });
            setTimeout(function() { const activeTab = document.querySelector(".tab.active"); if (activeTab) activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }, 50);
        }
    }
}, { passive: true });

function openModal(id) { const m = document.getElementById(id); if (m) m.style.display = "flex"; }
function closeModal(id, e) { if (e) e.stopPropagation(); const m = document.getElementById(id); if (m) m.style.display = "none"; }
function copyNumberOnly(n) { navigator.clipboard.writeText(n).then(function() { alert(dict[window.app.currentLang].numCopied); }).catch(function() { var el = document.createElement("textarea"); el.value = n; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); alert(dict[window.app.currentLang].numC