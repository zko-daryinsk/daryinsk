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
  "МАСТЕРА": { "ru": "🧰 МАСТЕРА", "kz": "🧰 ШЕБЕРЛЕР" },
  "МЕБЕЛЬ": { "ru": "🛋️ МЕБЕЛЬ", "kz": "🛋️ ЖИҺАЗ" },
  "НОТАРИУС": { "ru": "📜 НОТАРИУС", "kz": "📜 НОТАРИУС" },
  "ОТДЫХ": { "ru": "🏕️ ОТДЫХ", "kz": "🏕️ ДЕМ АЛЫС" },
  "ПРОДУКТЫ": { "ru": "🍞 ПРОДУКТЫ", "kz": "🍞 АЗЫҚ-ТҮЛІК" },
  "РЕМОНТ": { "ru": "🛠️ РЕМОНТ", "kz": "🛠️ ЖӨНДЕУ" },
  "РИТУАЛ": { "ru": "🪦 РИТУАЛ", "kz": "🪦 РИТУАЛ" },
  "СЕПТИКИ": { "ru": "🛢️ СЕПТИКИ", "kz": "🛢️ СЕПТИКТЕР" },
  "ТАКСИ": { "ru": "🚕 ТАКСИ", "kz": "🚕 ТАКСИ" },
  "УСЛУГИ": { "ru": "📋 УСЛУГИ", "kz": "📋 ҚЫЗМЕТТЕР" },
  "ШКОЛА": { "ru": "🎒 ШКОЛА", "kz": "🎒 МЕКТЕП" },
  "ЭЛЕКТРИКИ": { "ru": "⚡ ЭЛЕКТРИКИ", "kz": "⚡ ЭЛЕКТРИКТЕР" },
  "СВАРЩИКИ": { "ru": "👨‍🏭 СВАРЩИКИ", "kz": "👨‍🏭 СВАРШИКТЕР" },
  "ФАСТФУД": { "ru": "🍔 ФАСТФУД", "kz": "🍔 ФАСТФУД" },
  "ОКНА": { "ru": "🪟 ОКНА/ПОТОЛКИ", "kz": "🪟 ТЕРЕЗЕЛЕР" },
  "ПТИЦЫ": { "ru": "🐥 ПТИЦЕВОДСТВО", "kz": "🐥 ҚҰСТАР" },
  "FAVORITES": { "ru": "⭐ Избранное", "kz": "⭐ Таңдаулылар" },
  "БЛАГОУСТРОЙСТВО": { "ru": "🌳 БЛАГОУСТРОЙСТВО", "kz": "🌳 АБАТТАНДЫРУ" },
  "ВЫПЕЧКА": { "ru": "🥐 ВЫПЕЧКА", "kz": "🥐 ПІСІРІЛГЕН ТАҒАМДАР" },
  "КАФЕ": { "ru": "☕ КАФЕ", "kz": "☕ КАФЕ" },
  "КОВРЫ": { "ru": "🖼️ КОВРЫ", "kz": "🖼️ КІЛЕМДЕР" },
  "КОРМА": { "ru": "🐾 КОРМА", "kz": "🐾 ЖЕМШӨП" },
  "НОТАРИУСЫ": { "ru": "📜 НОТАРИУСЫ", "kz": "📜 НОТАРИУСЫ" },
  "ПОТОЛКИ": { "ru": "🏠 ПОТОЛКИ", "kz": "🏠 ТӨБЕЛЕР" },
  "СКВАЖИНЫ": { "ru": "🚰 СКВАЖИНЫ", "kz": "🚰 ҰҢҒЫМАЛАР" },
  "ШКОЛЫ": { "ru": "🏫 ШКОЛЫ", "kz": "🏫 МЕКТЕПТЕР" }
};

const dict = {
  ru: {
    title: "Справочник посёлков", search: "Поиск...", reset: "Сбросить",
    mainBtn: "+&nbsp;&nbsp;Добавить", favBtn: "⭐&nbsp;&nbsp;Избранное", viewTabs: "👁️ Вкладки", viewSelect: "👁️ Список",
    noResults: "Ничего не найдено", callMob: "Позвонить", callGov: "Позвонить на городской",
    numCopied: "Номер скопирован в буфер обмена!", shareCopied: "Ссылка скопирована! Отправьте её друзьям.",
    confirmErr: "Хотите сообщить администратору об ошибке в этом контакте?",
    mTitle: "Новая анкетная форма", mCustomOpt: "Вписать категорию руками...",
    lblHasWA: "На этом номере есть WhatsApp", mSubmit: "Отправить в WhatsApp",
    mAlert: "Заполните Посёлок, Категорию, Название и Телефон!",
    infoWelcome: "Добро пожаловать!", infoHowTo: "Как пользоваться справочником?",
    infoOpenBtn: "Открыть справочник", infoCloseBtn: "Понятно",
    infoText: "<div class='info-step-block'><div class='info-step-title'>🔍 Шаг 1. Быстрый поиск и категории</div><div class='info-step-text'>Выбирайте свой посёлок вверху экрана для точной фильтрации. Чтобы найти услугу, используйте любой удобный способ: перелистывайте горизонтальные <b>Вкладки</b>, открывайте выпадающий <b>Список</b> категорий или просто пишите название в строке <b>Поиск</b>. Если не можете найти человека по короткому имени (Паша), введите полное (Павел).</div></div><div class='info-step-block'><div class='info-step-title'>⭐ Шаг 2. Избранное и Безопасность</div><div class='info-step-text'>Нажмите звёздочку на карточке, чтобы добавить контакт в Избранное — они всегда будут под рукой. При нажатии на синюю кнопку 'Позвонить' сайт попросит подтверждение, чтобы защитить вас от случайных вызовов.</div></div><div class='info-step-block'><div class='info-step-title'>🛡️ Шаг 3. Добавление и Ошибки</div><div class='info-step-text'>Проект бесплатный и общественный. Если вы знаете полезный контакт или хотите добавить себя — нажмите <b>Добавить</b>. Если нашли неточность, нажмите на карточке кнопку <b>⚠️ Ошибка</b>, чтобы отправить верные данные Администратору.</div></div>"
  },
  kz: {
    title: "Ауыл анықтамалығы", search: "Іздеу...", reset: "Тазалау",
    mainBtn: "+&nbsp;&nbsp;Қосу", favBtn: "⭐&nbsp;&nbsp;Таңдаулылар", viewTabs: "👁️ Вкладкалар", viewSelect: "👁️ Тізім",
    noResults: "Ештеңе табылмады", callMob: "Қоңырау шалу", callGov: "Қалалық нөмірге қоңырау",
    numCopied: "Нөмір буферге көшірілді!", shareCopied: "Сілтеме көшірілді! Достарыңызға жіберіңіз.",
    confirmErr: "Бұл контактідегі қате туралы әкімшіге хабарлағыңыз келе ме?",
    mTitle: "Жаңа сауалнама формасы", mCustomOpt: "Санатты өз қолыңызбен жазу...",
    lblHasWA: "Бұл нөмірде WhatsApp бар", mSubmit: "WhatsApp-қа жіберу",
    mAlert: "Санатты, Атауды и Телефонды толтырыңыз!",
    infoWelcome: "Қош келдіңіздер!", infoHowTo: "Анықтамалықты қалай пайдалану керек?",
    infoOpenBtn: "Анықтамалықты ашу", infoCloseBtn: "Жақсы",
    infoText: "<div class='info-step-block'><div class='info-step-title'>🔍 1-қадам. Жылдам іздеу және санаттар</div><div class='info-step-text'>Дұрыс сүзу үшін экранның жоғарғы жағынан өз ауылыңызды таңдаңыз. Қызметті табу үшін кез келген ыңғайлы әдісті қолданомыз: көлденең <b>Вкладкаларды</b> парақтаңыз, санаттардың ашылмалы <b>Тізімін</b> ашыңыз немесе <b>Іздеу</b> жолына атауын жазыңыз. Егер адамды қысқа атымен таппасаңыз, толық атын енгізіп көріңіз.</div></div><div class='info-step-block'><div class='info-step-title'>⭐ 2-қадам. Таңдаулылар және Қауіпсіздік</div><div class='info-step-text'>Контактіні <b>Таңдаулылар</b> тізіміне қосу үшін карточкадағы жұлдызшаны басыңыз. 'Қоңырау шалу' батырмасын басқанда, кездейсоқ қоңыраулардан қорғау үшін сайт растауды сұрайды.</div></div><div class='info-step-block'><div class='info-step-title'>🛡️ 3-қадам. Қосу және Қателер</div><div class='info-step-text'>Жоба тегін және қоғамдық. Егер сіз анықтамалықта жоқ пайдалы контактіні білсеңіз немесе өзіңізді қосқыңыз келсе — <b>Қосу</b> батырмасын басыңыз. Қате тапсаңыз, Әкімшіге түзету жідеру за карточкадағы <b>⚠️ Ошибка</b> батырмасын басыңыз.</div></div>"
  }
};
function normalizeString(str) {
  if (!str) return "";
  return str.toString().toLowerCase()
    .replace(/ё/g, "е").replace(/ә/g, "a").replace(/ғ/g, "г").replace(/қ/g, "к").replace(/ң/g, "н")
    .replace(/ө/g, "о").replace(/ұ/g, "у").replace(/ү/g, "у").replace(/і/g, "и")
    .replace(/һ/g, "х").replace(/х/g, "х").replace(/[^a-z0-9а-яё]/g, "");
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
  var s = document.getElementById("formVillageSelect");
  if (!s) return; s.innerHTML = "";
  window.app.villages.forEach(function(v) {
    var o = document.createElement("option");
    o.value = v.id;
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
    if (v.id === window.app.activeVillage) {
      btn.style.background = "#0b66ff"; btn.style.color = "white";
    } else {
      btn.style.background = "rgba(0,0,0,0.06)"; btn.style.color = "#4a5568";
    }
    btn.innerText = "📍 " + (window.app.currentLang === "ru" ? v.ru : v.kz);
    btn.onclick = function() {
      if (window.app.activeVillage === v.id) return;
      window.app.activeVillage = v.id;
      renderVillageSelector();
      loadBazaByVillage(v.id);
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
        const lineClean = line.trim();
        if (!lineClean || lineClean.startsWith("#") || !lineClean.includes("|")) {
          return;
        }
        
        const cells = lineClean.split("|").map(function(c) { return c.trim(); });
        if (cells.length === 7) {
          rawCategories.add(cells[1].toUpperCase());
          window.app.allContacts.push({
            category: cells[1].toUpperCase(),
            title: cells[2],
            phone: cells[3],
            fio: cells[4],
            desc: cells[5],
            landmark: cells[6],
            waStatus: "HAS_WA"
          });
        }
      });

      const sortedCategories = [...rawCategories].sort(function(a, b) { return a.localeCompare(b); });
      window.app.activeCategory = sortedCategories.length > 0 ? sortedCategories[0] : "";
      window.app.activeLetter = "";
      
      const currentV = window.app.villages.find(function(v) { return v.id === villageId; });
      if (currentV) {
        document.getElementById("siteTitle").innerText = window.app.currentLang === "ru" ? currentV.ru : currentV.kz;
      }
      
      setLang(window.app.currentLang);
      handleWelcomeCounter();
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
  if (digits.length >= 10) return digits.substring(digits.length - 10);
  return digits;
}

function formatPhoneNumber(pureDigits) {
  if (pureDigits.length === 3) return pureDigits;
  if (pureDigits.length !== 10) return pureDigits;
  if (pureDigits.startsWith("71131")) {
    return "+7 (71131) " + pureDigits.substring(5, 6) + "-" + pureDigits.substring(6, 8) + "-" + pureDigits.substring(8, 10);
  }
  return "+7 (" + pureDigits.substring(0, 3) + ") " + pureDigits.substring(3, 6) + "-" + pureDigits.substring(6, 8) + "-" + pureDigits.substring(8, 10);
}

function downloadVCard(category, title, pureDigits, fio) {
  const fullName = clearDot(fio) ? clearDot(fio) + " (" + clearDot(title) + ")" : clearDot(title);
  const vcardPhone = (pureDigits.length === 3) ? pureDigits : (pureDigits.startsWith("71131") ? "+" + pureDigits : "+7" + pureDigits);
  const vcardText = "BEGIN:VCARD\nVERSION:3.0\nFN:" + fullName + "\nTEL;TYPE=CELL:" + vcardPhone + "\nNOTE:Справочник\nEND:VCARD";
  const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = clearDot(title).replace(/[^a-яА-ЯёЁа-яА-Я0-9]/g, "_") + ".vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function handleSearch() {
  const sInput = document.getElementById("searchInput");
  if (!sInput) return;
  const rawQuery = sInput.value.trim().toLowerCase();
  const btnReset = document.getElementById("btnReset");
  if (btnReset) btnReset.style.display = (rawQuery.length > 0) ? "block" : "none";
  const tabsRow = document.querySelector(".categories-control-row");
  const sTitle = document.getElementById("searchTitleContainer");

  if (rawQuery.length > 0) {
    if (tabsRow) tabsRow.style.display = "none";
    if (sTitle) {
      sTitle.style.display = "block";
      sTitle.innerText = (window.app.currentLang === "ru" ? "Результаты поиска по запросу: " : "Іздеу нәтижелері: ") + sInput.value;
    }
  } else {
    if (tabsRow) tabsRow.style.display = "flex";
    if (sTitle) sTitle.style.display = "none";
  }
  renderCards();
}

function renderCards() {
  const container = document.getElementById("content");
  if (!container) return; container.innerHTML = "";
  const sInput = document.getElementById("searchInput");
  let query = sInput ? sInput.value.trim().toLowerCase() : "";
  const isSearching = query.length > 0;
  if (isSearching && nameSynonyms[query]) { query = nameSynonyms[query]; }
  const normQuery = normalizeString(query);
  let favorites = JSON.parse(localStorage.getItem("dar_fav_numbers") || "[]");

  let filtered = window.app.allContacts.filter(function(item) {
    if (window.app.activeCategory === "FAVORITES" && !isSearching) {
      return favorites.includes(getClean10Digits(item.phone));
    }
    if (isSearching) {
      return normalizeString(item.category + item.title + item.phone + item.fio + item.desc + item.landmark).includes(normQuery) || item.phone.includes(query);
    }
    return item.category === window.app.activeCategory;
  });

  if (window.app.activeCategory === "ЖИТЕЛИ" && !isSearching) {
    const letters = new Set();
    filtered.forEach(function(i) { const f = i.title.trim().toUpperCase(); if (f) letters.add(f.substring(0, 1)); });
    renderAlphabet([...letters].sort(function(a, b) { return a.localeCompare(b); }));
    if (window.app.activeLetter) {
      filtered = filtered.filter(function(i) { return i.title.trim().toUpperCase().startsWith(window.app.activeLetter); });
    }
  } else {
    const ac = document.getElementById("alphabetContainer"); if (ac) ac.style.display = "none";
  }

  if (filtered.length === 0) {
    container.innerHTML = "<div style='text-align:center; padding:20px; color:#999;'>" + dict[window.app.currentLang].noResults + "</div>";
    return;
  }

  const grouped = [];
  filtered.forEach(function(item) {
    const existing = grouped.find(function(g) {
      return g.category === item.category && g.title.trim().toLowerCase() === item.title.trim().toLowerCase();
    });
    if (existing) {
      existing.phones.push({ num: item.phone, wa: item.waStatus, desc: item.desc, fio: item.fio });
    } else {
      grouped.push({
        category: item.category, title: item.title, landmark: item.landmark,
        phones: [{ num: item.phone, wa: item.waStatus, desc: item.desc, fio: item.fio }]
      });
    }
  });

  grouped.forEach(function(item) {
    const card = document.createElement("div"); card.className = "card";
    const tag = (categoryTranslations[item.category] && categoryTranslations[item.category][window.app.currentLang]) ? categoryTranslations[item.category][window.app.currentLang] : item.category;
    const firstP10 = getClean10Digits(item.phones[0].num);
    
    let html = "<div class='card-header-row'><span class='card-tag'>" + tag + "</span><button class='card-fav-btn " + (favorites.includes(firstP10) ? "active" : "") + "' onclick=\"toggleFavorite('" + firstP10 + "')\">★</button></div><div class='card-title'>" + item.title + "</div>";
    if (clearDot(item.landmark)) html += "<div class='card-landmark'>📍 " + clearDot(item.landmark) + "</div>";

    item.phones.forEach(function(pObj) {
      const pureDigits = getClean10Digits(pObj.num);
      html += "<div style='margin-top:8px; padding-top:8px; border-top:1px dashed rgba(0,0,0,0.06);'>";
      
      if (clearDot(pObj.fio)) html += "<div class='card-fio'>" + clearDot(pObj.fio) + "</div>";
      if (clearDot(pObj.desc)) html += "<div class='card-desc'>📝 " + clearDot(pObj.desc) + "</div>";
      
      html += "<div class='card-phone-line' onclick=\"copyNumberOnly('" + pureDigits + "')\"><b>" + formatPhoneNumber(pureDigits) + "</b></div>";
      
      const isLand = pureDigits.startsWith("71131");
      const isShort = pureDigits.length === 3;
      html += "<div class='card-actions'>";
      
      if (isShort) {
        html += "<a href='tel:" + pureDigits + "' class='btn-ui btn-ui-call' style='flex:none; width:100%;' onclick=\"return confirm(window.app.currentLang === 'ru' ? 'Позвонить на городской номер " + formatPhoneNumber(pureDigits) + "?' : 'Қалалық нөмірге қоңырау шалу " + formatPhoneNumber(pureDigits) + "?')\">" + dict[window.app.currentLang].callGov + "</a>";
      } else if (isLand || pObj.wa === "NO_WA") {
        html += "<a href='tel:+7" + pureDigits + "' class='btn-ui btn-ui-call' style='flex:none; width:100%;' onclick=\"return confirm(window.app.currentLang === 'ru' ? 'Вы действительно хотите позвонить по номеру +7 " + formatPhoneNumber(pureDigits) + "?' : 'Сіз шынымен +7 " + formatPhoneNumber(pureDigits) + " нөміріне қоңырау шалғыңыз келе ме?')\">" + (isLand ? dict[window.app.currentLang].callGov : dict[window.app.currentLang].callMob) + "</a>";
      } else {
        const curUrl = window.location.origin + window.location.pathname;
        let msg = "Здравствуйте! Нашел ваш контакт в Справочнике поселков (" + curUrl + "). ";
        if (window.app.currentLang === "kz") msg = "Саламатсыз ба! Контактіңізді ауыл анықтамалығынан (" + curUrl + ") таптым. ";
        
        html += "<a href='tel:+7" + pureDigits + "' class='btn-ui btn-ui-call' onclick=\"return confirm(window.app.currentLang === 'ru' ? 'Вы действительно хотите позвонить по номеру +7 " + formatPhoneNumber(pureDigits) + "?' : 'Сіз шынымен +7 " + formatPhoneNumber(pureDigits) + " нөміріне қоңырау шалғыңыз келе ме?')\">" + dict[window.app.currentLang].callMob + "</a>";
        // ВОССТАНОВЛЕНО: Родной формат wa.me/ со слэшем на правильном месте перед номером телефона
        html += "<a href='https://wa.me" + pureDigits + "?text=" + encodeURIComponent(msg) + "' class='btn-ui btn-ui-wa'>WhatsApp</a>";
      }
      html += "</div></div>";
    });

    const curUrl = window.location.origin + window.location.pathname;
    const allNums = item.phones.map(function(p) { return formatPhoneNumber(getClean10Digits(p.num)); }).join(", ");
    const sTxt = clearDot(item.title) + ". Тел: " + allNums + ". Справочник: " + curUrl;
    
    html += "<div class='card-actions-row-three'>";
    html += "<button class='btn-ui-mini' style='background:#6c757d; flex:1;' onclick=\"copyToClipboard('" + sTxt.replace(/'/g, "\\'") + "')\">Поделиться</button>";
    html += "<button class='btn-ui-mini' style='background:#2563eb; flex:1;' onclick=\"downloadVCard('" + item.category + "','" + item.title.replace(/'/g, "\\'") + "','" + getClean10Digits(item.phones[0].num) + "','" + item.phones[0].fio.replace(/'/g, "\\'") + "')\">Сохранить</button>";
    html += "<button class='btn-ui-mini' style='background:#dc2626; flex:1;' onclick=\"reporterWithErrorConfirm('" + item.category + "','" + item.title.replace(/'/g, "\\'") + "','" + allNums + "')\">⚠️ Ошибка</button>";
    html += "</div>";

    card.innerHTML = html;
    container.appendChild(card);
  });
        }
function setLang(lang) {
  window.app.currentLang = lang;
  localStorage.setItem("dar_lang", lang);
  document.getElementById("btn-ru").classList.toggle("active", lang === "ru");
  document.getElementById("id-kz").classList.toggle("active", lang === "kz");
  
  const sIn = document.getElementById("searchInput"); if (sIn) sIn.placeholder = dict[lang].search;
  const bRes = document.getElementById("btnReset"); if (bRes) bRes.innerText = dict[lang].reset;
  
  const bFav = document.getElementById("btnFavAction"); if (bFav) bFav.innerHTML = dict[lang].favBtn;
  const bAdd = document.getElementById("btnMainAction"); if (bAdd) bAdd.innerHTML = dict[lang].mainBtn;
  
  const bVToggle = document.getElementById("btnViewToggle");
  if (bVToggle) {
    bVToggle.innerText = (window.app.currentViewMode === "tabs") ? dict[lang].viewTabs : dict[lang].viewSelect;
  }
  
  const wModal = document.getElementById("welcomeModal");
  if (wModal && wModal.style.display === "flex") {
    const isAuto = window.app.isWelcomeModalAuto !== false;
    updateWelcomeModalContent(isAuto);
  }
  
  const rawCategories = [...new Set(window.app.allContacts.map(function(i) { return i.category; }))].sort(function(a, b) { return a.localeCompare(b); });
  if (!window.app.activeCategory && rawCategories.length > 0) window.app.activeCategory = rawCategories;
    const tContainer = document.getElementById("tabsContainer");
  const mSelect = document.getElementById("categoriesMainSelect");
  
  if (window.app.currentViewMode === "tabs") {
    if (tContainer) tContainer.style.display = "flex"; if (mSelect) mSelect.style.display = "none";
    if (tContainer) {
      tContainer.innerHTML = "";
      rawCategories.forEach(function(cat) {
        const t = document.createElement("div"); t.className = "tab " + (window.app.activeCategory === cat ? "active" : "");
        t.innerText = (categoryTranslations[cat] && categoryTranslations[cat][lang]) ? categoryTranslations[cat][lang] : cat;
        t.onclick = function() { window.app.activeCategory = cat; window.app.activeLetter = ""; setLang(lang); };
        tContainer.appendChild(t);
      });
      if (window.app.activeCategory === "FAVORITES") {
        const t = document.createElement("div"); t.className = "tab active"; t.innerText = categoryTranslations["FAVORITES"][lang];
        tContainer.appendChild(t);
      }
    }
  } else {
    if (tContainer) tContainer.style.display = "none"; if (mSelect) mSelect.style.display = "block";
    if (mSelect) {
      mSelect.innerHTML = "";
      rawCategories.forEach(function(cat) {
        const o = document.createElement("option"); o.value = cat;
        o.innerText = (categoryTranslations[cat] && categoryTranslations[cat][lang]) ? categoryTranslations[cat][lang] : cat;
        o.selected = (window.app.activeCategory === cat); mSelect.appendChild(o);
      });
      if (window.app.activeCategory === "FAVORITES") {
        const o = document.createElement("option"); o.value = "FAVORITES"; o.innerText = categoryTranslations["FAVORITES"][lang];
        o.selected = true; mSelect.appendChild(o);
      }
    }
  }
  
  const fCat = document.getElementById("formCatSelect");
  if (fCat) {
    fCat.innerHTML = "";
    Object.keys(categoryTranslations).forEach(function(k) {
      if (k === "FAVORITES") return;
      const o = document.createElement("option"); o.value = k;
      o.innerText = categoryTranslations[k][lang]; fCat.appendChild(o);
    });
    const oCust = document.createElement("option"); oCust.value = "CUSTOM"; oCust.innerText = dict[lang].mCustomOpt;
    fCat.appendChild(oCust);
  }
  renderCards();
}
