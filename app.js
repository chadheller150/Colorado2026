(function () {
  var T = window.TRIP;
  var STORE = "colorado2026:v1";
  var state = load();
  var mapInst = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(n) { return "$" + Math.round(n).toLocaleString(); }
  function mapsUrl(p) {
    return p.lat == null ? "#" : "https://www.google.com/maps/search/?api=1&query=" + p.lat + "," + p.lng;
  }

  /* ---------- Tabs ---------- */
  var TABS = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "cozy", label: "Cozy" },
    { id: "places", label: "Map & Ideas" },
    { id: "looks", label: "Outfits & Packing" },
    { id: "budget", label: "Budget" }
  ];
  var tabsEl = document.getElementById("tabs");
  var content = document.getElementById("content");

  TABS.forEach(function (t) {
    var b = document.createElement("button");
    b.className = "tab"; b.textContent = t.label; b.dataset.id = t.id;
    b.addEventListener("click", function () { show(t.id); });
    tabsEl.appendChild(b);
    var p = document.createElement("section");
    p.className = "panel"; p.id = "p-" + t.id;
    content.appendChild(p);
  });

  function show(id, noScroll) {
    TABS.forEach(function (t) {
      document.getElementById("p-" + t.id).classList.toggle("active", t.id === id);
    });
    Array.prototype.forEach.call(tabsEl.children, function (b) {
      b.classList.toggle("active", b.dataset.id === id);
      if (b.dataset.id === id && b.scrollIntoView) b.scrollIntoView({ inline: "center", block: "nearest" });
    });
    if (id === "places") initMap();
    state.tab = id; save();
    if (!noScroll) window.scrollTo({ top: document.getElementById("tabs").offsetTop - 1 });
  }

  /* ---------- Hero + countdown ---------- */
  document.getElementById("hero-dates").textContent = T.dateLabel;
  document.getElementById("hero-sub").textContent = T.base + " · " + T.tagline;

  function tick() {
    var el = document.getElementById("countdown");
    var now = new Date(), start = new Date(T.start), end = new Date(T.end);
    if (now > end) { el.innerHTML = '<span class="cd-msg">Welcome home.</span>'; return; }
    if (now >= start) { el.innerHTML = '<span class="cd-msg">You\'re here. Enjoy it.</span>'; return; }
    var s = Math.floor((start - now) / 1000);
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    el.innerHTML = [[d, "days"], [h, "hrs"], [m, "min"]].map(function (x) {
      return '<div class="cd"><b>' + x[0] + "</b><span>" + x[1] + "</span></div>";
    }).join("");
  }
  tick(); setInterval(tick, 30000);

  /* ---------- Overview ---------- */
  function renderOverview() {
    var el = document.getElementById("p-overview");
    var days = T.days.map(function (d) {
      return '<button class="day-link' + (d.highlight ? " highlight" : "") + '" data-day="' + d.id + '">' +
        '<i class="bi ' + d.icon + '"></i><div><b>' + esc(d.short) + " · " + esc(d.name) + "</b><small>" + esc(d.blurb) + "</small></div></button>";
    }).join("");
    el.innerHTML =
      "<h2>Welcome</h2><p class=\"lede\">Five slow, cozy days in the mountains, with one very important one in the middle: hot tub, movies, good food, and a couple of scenic outings.</p>" +
      '<div class="grid" style="margin-bottom:22px">' +
        '<div class="card stat"><i class="bi bi-geo-alt"></i><div><b>' + esc(T.base) + '</b><span>' + esc(T.elevation) + ' · near Pikes Peak</span></div></div>' +
        '<div class="card stat"><i class="bi bi-heart"></i><div><b>Sun, Dec 21</b><span>Elopement day (winter solstice)</span></div></div>' +
        '<div class="card stat"><i class="bi bi-thermometer-snow"></i><div><b>Plan for 10–35°F</b><span>Dress in layers; nights drop below 10°</span></div></div>' +
      "</div>" +
      '<h3>Forecast</h3><div class="card" id="wx"><p class="muted" style="margin:0">Loading forecast…</p></div>' +
      '<h3 style="margin-top:22px">The days</h3>' + days +
      '<h3 style="margin-top:22px">Good to know</h3><div class="card"><ul style="margin:0;padding-left:18px;color:var(--muted)">' +
        "<li>Altitude is 8,000+ ft: hydrate, go easy the first evening.</li>" +
        "<li>We're driving the Santa Fe Hybrid. Mountain roads can ice over, so check the CDOT road report (cotrip.org) and your tires before the final climb.</li>" +
        "<li>Closest big grocery stores are in Woodland Park (~20 min). Shop for the whole stay on arrival day.</li>" +
        "<li>Cell service is patchy; save directions offline.</li>" +
        "<li>Winter hours vary for parks and restaurants. Confirm before you go.</li>" +
      "</ul></div>";
    el.querySelectorAll("[data-day]").forEach(function (b) {
      b.addEventListener("click", function () { state.day = b.dataset.day; save(); renderItinerary(); show("itinerary"); });
    });
    loadWeather();
  }

  /* ---------- Weather (Open-Meteo, no key) ---------- */
  var WX = {
    0: ["Clear", "bi-sun"], 1: ["Mostly clear", "bi-sun"], 2: ["Partly cloudy", "bi-cloud-sun"], 3: ["Overcast", "bi-cloud"],
    45: ["Fog", "bi-cloud-fog"], 48: ["Fog", "bi-cloud-fog"], 51: ["Drizzle", "bi-cloud-drizzle"], 61: ["Rain", "bi-cloud-rain"],
    63: ["Rain", "bi-cloud-rain"], 65: ["Heavy rain", "bi-cloud-rain-heavy"], 71: ["Light snow", "bi-cloud-snow"],
    73: ["Snow", "bi-cloud-snow"], 75: ["Heavy snow", "bi-snow2"], 77: ["Snow grains", "bi-cloud-snow"],
    80: ["Showers", "bi-cloud-rain"], 85: ["Snow showers", "bi-cloud-snow"], 86: ["Snow showers", "bi-snow2"], 95: ["Storms", "bi-cloud-lightning"]
  };
  function wxInfo(c) { return WX[c] || (c >= 71 && c <= 77 ? WX[73] : c >= 80 ? WX[80] : ["—", "bi-cloud"]); }

  function loadWeather() {
    var box = document.getElementById("wx");
    var a = T.start.slice(0, 10), b = T.end.slice(0, 10);
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + T.home.lat + "&longitude=" + T.home.lng +
      "&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum&temperature_unit=fahrenheit&timezone=America%2FDenver" +
      "&start_date=" + a + "&end_date=" + b;
    fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      var d = j.daily;
      box.innerHTML = '<div class="wx">' + d.time.map(function (t, i) {
        var w = wxInfo(d.weathercode[i]), dt = new Date(t + "T12:00:00");
        var snow = d.snowfall_sum[i] > 0 ? "<small>" + (d.snowfall_sum[i] / 2.54).toFixed(1) + '" snow</small>' : "";
        return '<div class="wx-day"><small>' + dt.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }) +
          '</small><i class="bi ' + w[1] + '"></i><b>' + Math.round(d.temperature_2m_max[i]) + "° / " + Math.round(d.temperature_2m_min[i]) + "°</b><small>" + w[0] + "</small>" + snow + "</div>";
      }).join("") + "</div>";
    }).catch(function () {
      box.innerHTML = '<p class="muted" style="margin:0">Forecast appears about 16 days before the trip (around Dec 3). Check back then.</p>';
    });
  }

  /* ---------- Itinerary ---------- */
  function renderItinerary() {
    var el = document.getElementById("p-itinerary");
    var id = state.day || T.days[0].id;
    var idx = Math.max(0, T.days.findIndex(function (d) { return d.id === id; }));
    var d = T.days[idx];
    var chips = T.days.map(function (x, i) {
      return '<button class="tab' + (i === idx ? " active" : "") + '" data-i="' + i + '">' + esc(x.short) + "</button>";
    }).join("");
    var items = d.items.map(function (it) {
      var p = it.place && T.places[it.place];
      var link = p && p.lat != null ? ' <a class="maplink" target="_blank" rel="noopener" href="' + mapsUrl(p) + '"><i class="bi bi-geo-alt"></i> ' + esc(p.name) + "</a>" : "";
      return '<li><div class="t">' + esc(it.time) + "</div><h4>" + esc(it.title) + link + "</h4><p>" + esc(it.note) + "</p></li>";
    }).join("");
    el.innerHTML =
      '<div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:18px">' + chips + "</div>" +
      '<div class="card"><div class="day-head"><h2>' + esc(d.name) + "</h2>" +
      (d.highlight ? '<span class="pill ember">The big day</span>' : '<span class="pill">' + esc(d.short) + "</span>") + "</div>" +
      '<p class="lede" style="margin-bottom:0">' + esc(d.blurb) + "</p>" +
      '<ul class="timeline' + (d.highlight ? " highlight" : "") + '">' + items + "</ul></div>" +
      '<div class="day-nav">' +
        (idx > 0 ? '<button class="btn" data-i="' + (idx - 1) + '">← ' + esc(T.days[idx - 1].name) + "</button>" : "<span></span>") +
        (idx < T.days.length - 1 ? '<button class="btn primary" data-i="' + (idx + 1) + '">' + esc(T.days[idx + 1].name) + " →</button>" : "<span></span>") +
      "</div>";
    el.querySelectorAll("[data-i]").forEach(function (b) {
      b.addEventListener("click", function () { state.day = T.days[+b.dataset.i].id; save(); renderItinerary(); window.scrollTo({ top: document.getElementById("tabs").offsetTop - 1 }); });
    });
  }

  /* ---------- Map & ideas ---------- */
  var filter = "All";
  function renderPlaces() {
    var el = document.getElementById("p-places");
    var cats = ["All", "Do", "Eat", "Stay"];
    var list = T.ideas.filter(function (i) { return filter === "All" || i.cat === filter; }).map(function (i) {
      var p = T.places[i.where];
      var cls = i.cat === "Eat" ? "ember" : i.cat === "Stay" ? "spruce" : "";
      return '<div class="card idea"><div><span class="pill ' + cls + '">' + i.cat + "</span><h4>" + esc(i.name) + "</h4><p>" + esc(i.detail) + "</p></div>" +
        (p && p.lat != null ? '<a class="btn sm" target="_blank" rel="noopener" href="' + mapsUrl(p) + '">Map</a>' : "") + "</div>";
    }).join("");
    el.innerHTML = "<h2>Map &amp; Ideas</h2><p class=\"lede\">Nothing here is booked. These are ideas to pick from.</p>" +
      '<div id="map"></div><div class="filters">' + cats.map(function (c) {
        return '<button class="btn sm' + (c === filter ? " on" : "") + '" data-f="' + c + '">' + c + "</button>";
      }).join("") + "</div>" + list;
    el.querySelectorAll("[data-f]").forEach(function (b) {
      b.addEventListener("click", function () { filter = b.dataset.f; mapInst = null; renderPlaces(); initMap(); });
    });
  }
  function initMap() {
    if (!window.L || mapInst) return;
    var el = document.getElementById("map"); if (!el) return;
    mapInst = L.map(el, { scrollWheelZoom: false }).setView([T.home.lat, T.home.lng], 9);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(mapInst);
    var pts = [];
    Object.keys(T.places).forEach(function (k) {
      var p = T.places[k]; if (p.lat == null) return;
      var home = k === "home";
      var icon = L.divIcon({ className: "", html: '<div style="width:' + (home ? 18 : 12) + "px;height:" + (home ? 18 : 12) + "px;border-radius:50%;background:" + (home ? "#c4703a" : "#4b7ba7") + ';border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
      L.marker([p.lat, p.lng], { icon: icon }).addTo(mapInst).bindPopup("<b>" + esc(p.name) + "</b><br>" + esc(p.note) + '<br><a target="_blank" rel="noopener" href="' + mapsUrl(p) + '">Open in Maps</a>');
      if (p.type !== "airport") pts.push([p.lat, p.lng]);
    });
    if (pts.length) mapInst.fitBounds(pts, { padding: [30, 30] });
    setTimeout(function () { mapInst.invalidateSize(); }, 50);
  }

  /* ---------- Cozy ---------- */
  function renderCozy() {
    var el = document.getElementById("p-cozy");
    state.meals = state.meals || {}; state.movies = state.movies || T.cozy.movies.slice(); state.seen = state.seen || {};
    var meals = T.cozy.meals.map(function (m) {
      var v = state.meals[m.id] != null ? state.meals[m.id] : m.note;
      return '<div class="card"><h3>' + esc(m.day) + '</h3><textarea data-m="' + m.id + '" placeholder="What is cooking?">' + esc(v) + "</textarea></div>";
    }).join("");
    var movies = state.movies.map(function (m, i) {
      var on = !!state.seen[m];
      return '<div class="row' + (on ? " paid" : "") + '" style="grid-template-columns:24px 1fr 30px"><input type="checkbox" data-s="' + i + '"' + (on ? " checked" : "") + ' title="Watched"><div class="nm">' + esc(m) + '</div><button class="x" data-r="' + i + '" title="Remove"><i class="bi bi-x-lg"></i></button></div>';
    }).join("");
    el.innerHTML = '<h2>Cozy</h2><p class="lede">The point of the trip: warm, quiet, and unhurried.</p>' +
      '<div class="grid" style="margin-bottom:22px">' +
        '<div class="card stat"><i class="bi bi-droplet-half"></i><div><b>Hot tub</b><span>Every evening; check temp + cover rules</span></div></div>' +
        '<div class="card stat"><i class="bi bi-fire"></i><div><b>Fire + blankets</b><span>Confirm firewood and fireplace rules</span></div></div>' +
      "</div><h3>Menu plan</h3>" + meals +
      '<h3 style="margin-top:22px">Movie watchlist</h3><div class="card">' + (movies || '<p class="muted">Nothing yet.</p>') +
      '<div class="add" style="grid-template-columns:1fr auto"><input type="text" id="mv-name" placeholder="Add a movie"><button class="btn primary" id="mv-add">Add</button></div></div>';
    el.querySelectorAll("[data-m]").forEach(function (t) { t.addEventListener("input", function () { state.meals[t.dataset.m] = t.value; save(); }); });
    el.querySelectorAll("[data-s]").forEach(function (c) { c.addEventListener("change", function () { state.seen[state.movies[+c.dataset.s]] = c.checked; save(); renderCozy(); }); });
    el.querySelectorAll("[data-r]").forEach(function (c) { c.addEventListener("click", function () { state.movies.splice(+c.dataset.r, 1); save(); renderCozy(); }); });
    document.getElementById("mv-add").addEventListener("click", function () {
      var v = document.getElementById("mv-name").value.trim(); if (!v) return;
      state.movies.push(v); save(); renderCozy();
    });
  }

  /* ---------- Outfits & Packing ---------- */
  function renderLooks() {
    var el = document.getElementById("p-looks");
    state.packed = state.packed || {}; state.looks = state.looks || {};
    var total = 0, done = 0;
    var cats = Object.keys(T.packing).map(function (cat) {
      var rows = T.packing[cat].map(function (item, i) {
        var key = cat + "|" + item; total++; var on = !!state.packed[key]; if (on) done++;
        return '<label class="check' + (on ? " done" : "") + '"><input type="checkbox" data-k="' + esc(key) + '"' + (on ? " checked" : "") + "><span>" + esc(item) + "</span></label>";
      }).join("");
      return '<div class="card"><h3>' + esc(cat) + "</h3>" + rows + "</div>";
    }).join("");
    var looks = T.looks.map(function (l) {
      var v = state.looks[l.id] != null ? state.looks[l.id] : l.note;
      return '<div class="card"><h3>' + esc(l.title) + '</h3><textarea data-l="' + l.id + '" placeholder="Notes, links, who\'s wearing what…">' + esc(v) + "</textarea></div>";
    }).join("");
    el.innerHTML = "<h2>Outfits &amp; Packing</h2><p class=\"lede\">Layers are the whole game: cold mornings, sunny afternoons, freezing nights.</p>" +
      "<h3>Looks</h3>" + looks +
      '<h3 style="margin-top:22px">Packing list <span class="muted" style="font-family:var(--sans);font-size:.9rem" id="pk-count"></span></h3><div class="progress"><div id="pk-bar"></div></div>' + cats;
    function upd() {
      var t = 0, d = 0;
      el.querySelectorAll("[data-k]").forEach(function (c) { t++; if (c.checked) d++; });
      document.getElementById("pk-count").textContent = d + " / " + t;
      document.getElementById("pk-bar").style.width = (t ? d / t * 100 : 0) + "%";
    }
    upd();
    el.querySelectorAll("[data-k]").forEach(function (c) {
      c.addEventListener("change", function () {
        state.packed[c.dataset.k] = c.checked; save();
        c.parentNode.classList.toggle("done", c.checked); upd();
      });
    });
    el.querySelectorAll("[data-l]").forEach(function (t) {
      t.addEventListener("input", function () { state.looks[t.dataset.l] = t.value; save(); });
    });
  }

  /* ---------- Budget ---------- */
  function budgetItems() {
    if (!state.budget) {
      state.budget = T.budget.map(function (b) { return { id: b.id, name: b.name, amount: b.amount, paid: b.paid, note: b.note }; });
      save();
    }
    return state.budget;
  }
  function renderBudget() {
    var el = document.getElementById("p-budget");
    var items = budgetItems();
    var total = items.reduce(function (s, i) { return s + (+i.amount || 0); }, 0);
    var paid = items.reduce(function (s, i) { return s + (i.paid ? (+i.amount || 0) : 0); }, 0);
    var rows = items.map(function (i, n) {
      return '<div class="row' + (i.paid ? " paid" : "") + '"><input type="checkbox" data-p="' + n + '"' + (i.paid ? " checked" : "") + ' title="Paid">' +
        '<div class="nm">' + esc(i.name) + (i.note ? "<small>" + esc(i.note) + "</small>" : "") + "</div>" +
        '<input type="number" min="0" step="1" inputmode="decimal" data-a="' + n + '" value="' + (+i.amount || "") + '" placeholder="$0">' +
        '<button class="x" data-d="' + n + '" title="Remove"><i class="bi bi-x-lg"></i></button></div>';
    }).join("");
    el.innerHTML = "<h2>Budget</h2><p class=\"lede\">Add amounts as you book. Check the box once an item is paid.</p>" +
      '<div class="sum"><div class="card"><b>' + money(total) + "</b><span>Total</span></div>" +
      '<div class="card"><b>' + money(paid) + "</b><span>Paid</span></div>" +
      '<div class="card"><b>' + money(total - paid) + "</b><span>Remaining</span></div></div>" +
      '<div class="card">' + (rows || '<p class="muted">No items yet.</p>') +
      '<div class="add"><input type="text" id="b-name" placeholder="Add an item"><input type="number" id="b-amt" min="0" inputmode="decimal" placeholder="$"><button class="btn primary" id="b-add">Add</button></div></div>' +
      '<div class="share-line"><span>Split evenly by <input type="number" id="split" min="1" value="' + (state.split || 2) + '" style="width:64px;display:inline-block;padding:4px 8px"></span><b id="split-out">' + money(total / (state.split || 2)) + " each</b></div>";
    el.querySelectorAll("[data-p]").forEach(function (c) { c.addEventListener("change", function () { items[+c.dataset.p].paid = c.checked; save(); renderBudget(); }); });
    el.querySelectorAll("[data-a]").forEach(function (c) { c.addEventListener("change", function () { items[+c.dataset.a].amount = +c.value || 0; save(); renderBudget(); }); });
    el.querySelectorAll("[data-d]").forEach(function (c) { c.addEventListener("click", function () { items.splice(+c.dataset.d, 1); save(); renderBudget(); }); });
    document.getElementById("b-add").addEventListener("click", function () {
      var nm = document.getElementById("b-name").value.trim();
      if (!nm) return;
      items.push({ id: "c" + Date.now(), name: nm, amount: +document.getElementById("b-amt").value || 0, paid: false, note: "" });
      save(); renderBudget();
    });
    document.getElementById("split").addEventListener("input", function (e) {
      state.split = Math.max(1, +e.target.value || 1); save();
      document.getElementById("split-out").textContent = money(total / state.split) + " each";
    });
  }

  /* ---------- Snow ---------- */
  (function snow() {
    var c = document.getElementById("snow"), x = c.getContext("2d");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var W, H, flakes = [], dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    function size() { W = c.width = innerWidth; H = c.height = innerHeight; }
    size(); addEventListener("resize", size);
    var n = innerWidth < 600 ? 40 : 80;
    for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .6, v: Math.random() * .6 + .3, p: Math.random() * 6 });
    (function loop() {
      x.clearRect(0, 0, W, H);
      x.fillStyle = dark ? "rgba(255,255,255,.55)" : "rgba(120,150,180,.35)";
      flakes.forEach(function (f) {
        f.y += f.v; f.p += .01; f.x += Math.sin(f.p) * .3;
        if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
        x.beginPath(); x.arc(f.x, f.y, f.r, 0, 6.283); x.fill();
      });
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------- Init ---------- */
  renderOverview(); renderItinerary(); renderCozy(); renderPlaces(); renderLooks(); renderBudget();
  show(state.tab || "overview", true);
})();
