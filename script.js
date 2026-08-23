// ==========================================
// БЛОК 1: ГЛОБАЛЬНЫЙ КОНФИГ И СЛОВАРИ
// ==========================================
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

const categoryTranslations = {
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
        lblHasWA: "На этом номере есть WhatsApp", mSubmit: "Отправить в WhatsApp", mAlert: "Заполните Категорию, Название и Телефон!"
    },
    kz: {
        title: "Ауыл анықтамалығы", search: "Іздеу...", reset: "Тазалау",
        mainBtn: "➕ Қосу", favBtn: "⭐ Таңдаулы", viewTabs: "👁‍🗨 Вкладкалар", viewSelect: "👁‍🗨 Тізім",
        noResults: "Ештеңе табылмады", callMob: "Қоңырау шалу", callGov: "Қалалық нөмірге қоңырау",
        numCopied: "Нөмір буферге көшірілді!", shareCopied: "Сілтеме көшірілді! Достарыңызға жіберіңіз.",
        confirmErr: "Бұл контактідеғы қате туралы әкімшіге хабарлағыңыз келе ме?",
        mTitle: "Жаңа сауалнама формасы", mCustomOpt: "Санатты өз қолыңызбен жазу...",
        lblHasWA: "Бұл нөмірде WhatsApp бар", mSubmit: "WhatsApp-қа жіберу", mAlert: "Санатты, Атауды және Телефонды толтырыңыз!"
    }
};

function normalizeString(str) {
    if (!str) return "";
    return str.toString().toLowerCase()
        .replace(/ё/g, "е")
        .replace(/ә/g, "а").replace(/ғ/g, "г").replace(/қ/g, "к").replace(/ң/g, "н")
        .replace(/ө/g, "о").replace(/ұ/g, "у").replace(/ү/g, "у").replace(/і/g, "и")
        .replace(/h/g, "х").replace(/һ/g, "х")
        .replace(/[^a-z0-9а-яё]/g, "");
}
// ==========================================
// БЛОК 2: МОТОР ЯДРА
// ==========================================
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
                }
            });
            window.app.activeVillage = "darinsk";
            renderVillageSelector();
            loadBazaByVillage(window.app.activeVillage);
        })
        .catch(function() {
            window.app.villages = [{ id: "darinsk", ru: "Посёлок Дарьинское", kz: "Дарьинское ауылы" }];
            window.app.activeVillage = "darinsk";
            renderVillageSelector();
            loadBazaByVillage("darinsk");
        });
}

function renderVillageSelector() {
    const container = document.getElementById("villageSelectorContainer");
    if (!container) return; container.innerHTML = "";
    window.app.villages.forEach(function(v) {
        const btn = document.createElement("button");
        btn.style.cssText = "padding:4px 10px; font-size:12px; font-weight:600; border:none; border-radius:20px; cursor:pointer; white-space:nowrap; transition:all 0.2s ease;";
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
                    rawCategories.add(cells.toUpperCase());
                    window.app.allContacts.push({
                        category: cells.toUpperCase(), title: cells, phone: cells,
                        fio: cells, desc: cells, landmark: cells, waStatus: cells
                    });
                }
            });
            const sortedCategories = [...rawCategories].sort(function(a, b) { return a.localeCompare(b); });
            window.app.activeCategory = sortedCategories.length > 0 ? sortedCategories : "";
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

// ==========================================
// БЛОК 3: ОТРИСОВКА КАРТОЧЕК
// ==========================================
function clearDot(str) { if (!str || str.trim() === ".") return ""; return str.trim(); }

function getClean10Digits(rawPhone) {
    if (!rawPhone) return "";
    let digits = rawPhone.toString().replace(/[^0-9]/g, "").trim();
    if (digits.length >= 10) { digits = digits.substring(digits.length - 10); }
    return digits;
}
function formatPhoneNumber(pure10Digits) {
    if (pure10Digits.length !== 10) return pure10Digits;
    if (pure10Digits.startsWith("71131")) {
        const city = pure10Digits.substring(0, 5);
        return "+7 (" + city + ") " + pure10Digits.substring(5, 6) + "-" + pure10Digits.substring(6, 8) + "-" + pure10Digits.substring(8, 10);
    }
    return "+7 " + pure10Digits.substring(0, 3) + " " + pure10Digits.substring(3, 6) + "-" + pure10Digits.substring(6, 8) + "-" + pure10Digits.substring(8, 10);
}

function downloadVCard(category, title, pure10Digits, fio) {
    const fullName = clearDot(fio) ? clearDot(title) + " (" + clearDot(fio) + ")" : clearDot(title);
    const vcardPhone = pure10Digits.startsWith("71131") ? "+" + pure10Digits : "+7" + pure10Digits;
    const vcardText = "BEGIN:VCARD\nVERSION:3.0\nFN:" + fullName + "\nTEL;TYPE=CELL:" + vcardPhone + "\nNOTE:Справочник. Посёлок: " + window.app.activeVillage + "\nEND:VCARD";
    const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url;
    link.download = clearDot(title).replace(/[^а-яА-ЯёЁa-zA-Z0-9]/g, "_") + ".vcf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
}

function renderCards() {
    const container = document.getElementById("content"); if (!container) return; container.innerHTML = "";
    const query = document.getElementById("searchInput") ? normalizeString(document.getElementById("searchInput").value) : "";
    const isSearching = query.length > 0;
    let favorites = JSON.parse(localStorage.getItem("dar_fav_numbers") || "[]");
    let filtered = window.app.allContacts.filter(function(item) {
        if (window.app.activeCategory === "FAVORITES") return favorites.includes(getClean10Digits(item.phone));
        if (isSearching) return normalizeString(item.category + item.title + item.phone + item.fio + item.desc + item.landmark).includes(query);
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
        const p10 = getClean10Digits(item.phones.num);
        let html = "<div class='card-header-row'><span class='card-tag'>" + tag + "</span><button class='card-fav-btn " + (favorites.includes(p10) ? "active" : "") + "' onclick=\"toggleFavorite('" + p10 + "')\">★</button></div><div class='card-title'>" + item.title + "</div>";
        if (clearDot(item.fio) && item.phones.length === 1) html += "<div class='card-fio'>" + clearDot(item.fio) + "</div>";
        if (item.phones.length === 1 && clearDot(item.phones.desc)) html += "<div class='card-desc'>" + clearDot(item.phones.desc) + "</div>";
        if (clearDot(item.landmark)) html += "<div class='card-landmark'>📍 " + clearDot(item.landmark) + "</div>";
        item.phones.forEach(function(pObj) {
            const pure10 = getClean10Digits(pObj.num);
            html += "<div style='margin-top:12px; padding-top:10px; border-top:1px dashed rgba(0,0,0,0.06);'>";
            if (pure10.length !== 10) { html += "<div class='card-phone-line' style='color:#dc2626;'>📱 " + pObj.num + "</div><div style='background:#fee2e2; color:#991b1b; padding:6px; border-radius:6px; font-size:12px; text-align:center; margin:6px 0;'>⚠️ Формат номера неверен</div>"; }
            else {
                const isLand = pure10.startsWith("71131");
                html += "<div class='card-phone-line' onclick=\"copyNumberOnly('" + pure10 + "')\">📱 <b>" + formatPhoneNumber(pure10) + "</b></div>";
                if (item.phones.length > 1) {
                    const subText = clearDot(pObj.fio) ? clearDot(pObj.fio) + (clearDot(pObj.desc) ? " - " + clearDot(pObj.desc) : "") : clearDot(pObj.desc);
                    if (subText) html += "<div class='card-desc' style='font-size:13px; font-style:italic;'>📝 " + subText + "</div>";
                }
                html += "<div class='card-actions'>";
                if (isLand || pObj.wa === "NO_WA") { html += "<a href='tel:+" + pure10 + "' class='btn-ui btn-ui-call' style='width:100%; flex:none;'>" + (isLand ? dict[window.app.currentLang].callGov : dict[window.app.currentLang].callMob) + "</a>"; }
                else {
                    const curUrl = window.location.origin + window.location.pathname;
                    let msg = "Здравствуйте! Нашел ваш контакт в Справочнике поселков (" + curUrl + "). Подскажите, пожалуйста... ";
                    if (window.app.currentLang === "kz") msg = "Саламатсыз ба! Контактіңізді ауыл анықтамалығынан (" + curUrl + ") таптым. Айтып жіберіңізші, өтініш... ";
                    html += "<a href='tel:+7" + pure10 + "' class='btn-ui btn-ui-call'>" + dict[window.app.currentLang].callMob + "</a><a href='whatsapp://send?phone=7" + pure10 + "&text=" + encodeURIComponent(msg) + "' class='btn-ui btn-ui-wa'>WhatsApp</a>";
                }
                html += "</div>";
            }
            html += "</div>";
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
// ==========================================
// БЛОК 4: ДЕЙСТВИЯ И ИНТЕРФЕЙС
// ==========================================
let touchStartX = 0, touchStartY = 0;
window.addEventListener("touchstart", function(e) { touchStartX = e.changedTouches.screenX; touchStartY = e.changedTouches.screenY; }, { passive: true });
window.addEventListener("touchend", function(e) {
    const sInput = document.getElementById("searchInput");
    if (window.app.currentViewMode !== "tabs" || (sInput && sInput.value.length > 0)) return;
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
function copyNumberOnly(n) { navigator.clipboard.writeText(n).then(function() { alert(dict[window.app.currentLang].numCopied); }).catch(function() { var el = document.createElement("textarea"); el.value = n; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); alert(dict[window.app.currentLang].numCopied); }); }
function copyToClipboard(t) { navigator.clipboard.writeText(t).then(function() { alert(dict[window.app.currentLang].shareCopied); }).catch(function() { var el = document.createElement("textarea"); el.value = t; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); alert(dict[window.app.currentLang].shareCopied); }); }
function toggleFavorite(p) { var f = JSON.parse(localStorage.getItem("dar_fav_numbers") || "[]"); f = f.includes(p) ? f.filter(function(x) { return x !== p; }) : [...f, p]; localStorage.setItem("dar_fav_numbers", JSON.stringify(f)); renderCards(); }
function reportErrorWithConfirm(c, t, p) { if (confirm(dict[window.app.currentLang].confirmErr)) { var msg = "Найдена ошибка в контакте:\nКатегория: " + c + "\nНазвание: " + t + "\nТелефон: " + p + "\n\nОпишите правильные данные: "; window.location.href = "whatsapp://send?phone=" + adminPhone + "&text=" + encodeURIComponent(msg); } }
function buildFormCategorySelect(cats) {
    var s = document.getElementById("formCatSelect"); if (!s) return; s.innerHTML = "";
    cats.forEach(function(c) { var o = document.createElement("option"); o.value = c; o.innerText = (categoryTranslations[c] && categoryTranslations[c][window.app.currentLang]) ? categoryTranslations[c][window.app.currentLang] : c; s.appendChild(o); });
    var co = document.createElement("option"); co.value = "CUSTOM_OPTION"; co.innerText = dict[window.app.currentLang].mCustomOpt; s.appendChild(co); toggleCustomCategoryField();
}
function toggleCustomCategoryField() { var s = document.getElementById("formCatSelect"); var w = document.getElementById("customCatWrapper"); if (s && w) w.style.display = (s.value === "CUSTOM_OPTION") ? "block" : "none"; }
function sendNewContact() {
    var sv = document.getElementById("formCatSelect").value; var cat = (sv === "CUSTOM_OPTION") ? document.getElementById("formCatCustom").value.trim() : sv;
    var rp = document.getElementById("formPhone").value.trim(); var t = document.getElementById("formName").value.trim(); var pd = getClean10Digits(rp);
    if (!cat || !pd || !t) { alert(dict[window.app.currentLang].mAlert); return; }
    var hasWA = document.getElementById("formHasWA").checked; var line = cat.toUpperCase() + " | " + t + " | " + pd + " | " + document.getElementById("formFio").value.trim() + " | " + document.getElementById("formDesc").value.trim() + " | " + document.getElementById("formLoc").value.trim() + " | " + (hasWA ? "$" : "NO_WA");
    var btn = document.getElementById("btnSubmitForm"); btn.disabled = true; btn.innerText = "..."; window.location.href = "whatsapp://send?phone=" + adminPhone + "&text=" + encodeURIComponent("Здравствуйте! Прошу добавить контакт.\n\n" + line);
    setTimeout(function() { btn.disabled = false; btn.innerText = dict[window.app.currentLang].mSubmit; closeModal("addModal"); }, 2000);
}

function setLang(l) {
    window.app.currentLang = l; document.querySelectorAll(".lang-btn").forEach(function(b) { b.classList.remove("active"); });
    var ab = document.getElementById("btn-" + l); if (ab) ab.classList.add("active");
    document.getElementById("siteTitle").innerText = dict[l].title; document.getElementById("searchInput").placeholder = dict[l].search;
    document.getElementById("btnReset").innerText = dict[l].reset; document.getElementById("btnMainAction").innerText = dict[l].mainBtn;
    document.getElementById("btnFavAction").innerText = dict[l].favBtn; document.getElementById("modalTitle").innerText = dict[l].mTitle;
    document.getElementById("lblHasWA").innerText = dict[l].lblHasWA; document.getElementById("btnSubmitForm").innerText = dict[l].mSubmit;
    document.getElementById("btnCancelForm").innerText = l === "ru" ? "Отмена" : "Бас тарту";
    document.getElementById("btnViewToggle").innerText = (window.app.currentViewMode === "tabs") ? dict[l].viewTabs : dict[l].viewSelect;
    var categories = [...new Set(window.app.allContacts.map(function(i) { return i.category; }))].sort(function(a, b) { return a.localeCompare(b); });
    renderTabs(categories); renderSelectMenu(categories); renderCards();
}
function showWelcomeModal() {
    if (document.getElementById("welcomeModal")) return;
    var w = document.createElement("div"); w.id = "welcomeModal"; w.className = "modal"; w.style.display = "flex";
    w.innerHTML = "<div class='modal-content' style='max-width: 450px; padding: 20px 25px; text-align: left;'>" +
        "<div style='display:flex; justify-content:flex-end; gap:6px; margin-bottom:10px;'>" +
        "<span class='lang-btn " + (window.app.currentLang === "ru" ? "active" : "") + "' style='font-size:12px; padding:2px 8px; border-radius:4px; cursor:pointer;' onclick=\"changeWelcomeLang('ru')\">RU</span>" +
        "<span class='lang-btn " + (window.app.currentLang === "kz" ? "active" : "") + "' style='font-size:12px; padding:2px 8px; border-radius:4px; cursor:pointer;' onclick=\"changeWelcomeLang('kz')\">KZ</span></div>" +
        "<h2 id='welcomeTitleTxt' style='margin-bottom:12px; font-size:22px; font-weight:700;'>Добро пожаловать!</h2>" +
        "<div id='welcomeBodyTxt' style='font-size:14px; color:#4a5568; line-height:1.6; margin-bottom:20px;'></div>" +
        "<button id='welcomeCloseBtn' class='btn-action-main' style='margin:0; width:100%; background:#0b66ff;' onclick=\"document.getElementById('welcomeModal').remove()\">Открыть справочник / Анықтамалықты ашу</button></div>";
    document.body.appendChild(w); changeWelcomeLang(window.app.currentLang);
}

function changeWelcomeLang(l) {
    setLang(l); const t = document.getElementById("welcomeTitleTxt"); const b = document.getElementById("welcomeBodyTxt"); if (!t || !b) return;
    if (l === "ru") {
        t.innerText = "Добро пожаловать!";
        b.innerHTML = "Прошу прощения, если чья-то фамилия или номер записаны неверно. Если вы нашли ошибку, нажмите на кнопку с треугольником (⚠️) на нужной карточке, чтобы прислать верные сведения.<br><br>💡 <b>Подсказка по поиску:</b> Введите любое имя или услугу. Поиск проверит все разделы разом! Если не можете найти человека по короткому имени (Паша, Женя), попробуйте ввести полное (Павел, Евгений).";
    } else {
        t.innerText = "Қош келдіңіздер!";
        b.innerHTML = "Егер біреудің тегі немесе нөмірі қате жазылса, кешірім өтінемін. Қате тапсаңыз, дұрыс мәліметті жіберу үшін тиісті карточкадағы үшбұрыш (⚠️) батырмасын басыңыз.<br><br>💡 <b>Іздеу бойынша кеңес:</b> Кез келген есімді немесе қызметті енгізіңіз. Іздеу барлық бөлімдерді бірден тексереді! Егер адамды қысқа атымен (Паша, Женя) таба алмасаңыз, толық атын (Павел, Евгений) енгізіп көріңіз.";
    }
    const wm = document.getElementById("welcomeModal"); if (wm) { wm.querySelectorAll(".lang-btn").forEach(function(x) { x.classList.remove("active"); if (x.innerText.toLowerCase() === l) x.classList.add("active"); }); }
}

function resetSearch() {
    const sIn = document.getElementById("searchInput"); if (sIn) sIn.value = "";
    const bRes = document.getElementById("btnReset"); if (bRes) bRes.style.display = "none";
    const tRow = document.querySelector(".categories-control-row"); if (tRow) tRow.style.display = "flex";
    const fTag = document.querySelector(".card-tag");
    if (fTag) {
        const curL = fTag.innerText;
        for (let key in categoryTranslations) { if (categoryTranslations[key][window.app.currentLang] === curL || key === curL) { window.app.activeCategory = key; break; } }
    }
    renderCards();
    setTimeout(function() { const aTab = document.querySelector(".tab.active"); if (aTab) aTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }, 50);
}

function renderAlphabet(uniqueLetters) {
    const container = document.getElementById("alphabetContainer"); if (!container) return; container.innerHTML = "";
    if (window.app.activeCategory !== "ЖИТЕЛИ" || document.getElementById("searchInput").value.length > 0) { container.style.display = "none"; return; }
    container.style.display = "flex";
    uniqueLetters.forEach(function(letter) {
        const btn = document.createElement("button"); btn.className = "letter-btn " + (letter === window.app.activeLetter ? "active" : ""); btn.innerText = letter;
        btn.onclick = function() { window.app.activeLetter = (window.app.activeLetter === letter) ? "" : letter; renderCards(); }; container.appendChild(btn);
    });
}

function toggleCategoriesView() {
    const tabsCont = document.getElementById("tabsContainer"); const selectCont = document.getElementById("categoriesMainSelect"); const toggleBtn = document.getElementById("btnViewToggle"); if (!tabsCont || !selectCont || !toggleBtn) return;
    if (window.app.currentViewMode === "tabs") { window.app.currentViewMode = "select"; tabsCont.style.display = "none"; selectCont.style.display = "block"; toggleBtn.innerText = dict[window.app.currentLang].viewSelect; }
    else { window.app.currentViewMode = "tabs"; tabsCont.style.display = "flex"; selectCont.style.display = "none"; toggleBtn.innerText = dict[window.app.currentLang].viewTabs; }
    localStorage.setItem("dar_view_mode", window.app.currentViewMode);
}
function restoreViewMode() {
    const saved = localStorage.getItem("dar_view_mode"); if (saved) { window.app.currentViewMode = saved; }
    const tabsCont = document.getElementById("tabsContainer"); const selectCont = document.getElementById("categoriesMainSelect"); const toggleBtn = document.getElementById("btnViewToggle"); if (!tabsCont || !selectCont || !toggleBtn) return;
    if (window.app.currentViewMode === "select") { tabsCont.style.display = "none"; selectCont.style.display = "block"; toggleBtn.innerText = dict[window.app.currentLang].viewSelect; }
    else { tabsCont.style.display = "flex"; selectCont.style.display = "none"; toggleBtn.innerText = dict[window.app.currentLang].viewTabs; }
}
function handleSelectCategoryChange() { const mainSel = document.getElementById("categoriesMainSelect"); if (mainSel) { window.app.activeCategory = mainSel.value; window.app.activeLetter = ""; renderCards(); } }

window.onscroll = function() { var btnTop = document.getElementById("btnTop"); if (btnTop) btnTop.style.display = (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) ? "flex" : "none"; };
function scrollToTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
window.addEventListener("scroll", function() { var sInput = document.getElementById("searchInput"); if (sInput && document.activeElement === sInput) sInput.blur(); });
function initTracking() { var img = document.createElement("img"); img.src = "https://yadro.ru" + escape(document.URL) + ";" + Math.random(); img.style.display = "none"; document.body.appendChild(img); }
function toggleTheme() { document.body.classList.toggle("dark-mode"); }
