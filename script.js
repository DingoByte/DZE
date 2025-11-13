// Dienstzeit
const startDate = new Date("2016-05-01");
const endDate   = new Date("2028-04-30");

// Abfindung – Max (100 %)
const maxAbfindung = 16853.35;

// BFD-Budget – Max
const maxBfd = 19000.0;

// Übergangsgebührnisse – Maxwerte
const ugb75Max  = 127970.28;
const ugb100Max = 163123.74;

// Formatter
const euro = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const $ = (id) => document.getElementById(id);

// Countdown
const daysEl    = $("days");
const hoursEl   = $("hours");
const minutesEl = $("minutes");
const secondsEl = $("seconds");

// Abfindungs-Circle
const circleAbfFG      = document.querySelector(".circle-fg-abf");
const circleAbfPercent = $("circle-abf-percent");
const circleAbfAmount  = $("circle-abf-amount");

// BFD-Circle
const circleBfdFG      = document.querySelector(".circle-fg-bfd");
const circleBfdPercent = $("circle-bfd-percent");
const circleBfdAmount  = $("circle-bfd-amount");

// Übergangsgebührnisse Balken
const ugb75Fill = $("ugb-75-fill");
const ugb100Fill = $("ugb-100-fill");
const ugb75Text = $("ugb-75-text");
const ugb100Text = $("ugb-100-text");

// Heute-Widget
const weekdayEl = $("weekday");
const dateEl    = $("date-string");
const weekendEl = $("weekend-text");

// Umfang für r=48
const CIRC = 301.59;

function updateToday() {
  const now = new Date();
  const days = [
    "Sonntag","Montag","Dienstag","Mittwoch",
    "Donnerstag","Freitag","Samstag"
  ];
  const w = days[now.getDay()];
  weekdayEl.textContent = w;

  const dd = String(now.getDate()).padStart(2,"0");
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const yyyy = now.getFullYear();
  dateEl.textContent = `${dd}.${mm}.${yyyy}`;

  let diffToSat = 6 - now.getDay();
  if (diffToSat <= 0) {
    weekendEl.textContent = "Wir sind im Wochenende.";
  } else if (diffToSat === 1) {
    weekendEl.textContent = "Noch 1 Tag bis zum Wochenende.";
  } else {
    weekendEl.textContent = `Noch ${diffToSat} Tage bis zum Wochenende.`;
  }
}

function updateDashboard() {
  const now = new Date();

  // Countdown
  let diff = endDate - now;
  if (diff < 0) diff = 0;

  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  daysEl.textContent    = String(days).padStart(3,"0");
  hoursEl.textContent   = String(hrs % 24).padStart(2,"0");
  minutesEl.textContent = String(mins % 60).padStart(2,"0");
  secondsEl.textContent = String(secs % 60).padStart(2,"0");

  // Fortschritt Dienstzeit
  const totalTime = endDate - startDate;
  let elapsed = now - startDate;
  if (elapsed < 0) elapsed = 0;
  if (elapsed > totalTime) elapsed = totalTime;

  const prog = totalTime > 0 ? elapsed / totalTime : 0;
  const progPct = prog * 100;

  // Abfindung Circle
  const currentAbf = maxAbfindung * prog;
  circleAbfFG.style.strokeDashoffset = CIRC * (1 - prog);
  circleAbfPercent.textContent = progPct.toFixed(1).replace(".", ",") + " %";
  circleAbfAmount.textContent  = euro.format(currentAbf) + " €";

  // BFD Circle
  const currentBfd = maxBfd * prog;
  circleBfdFG.style.strokeDashoffset = CIRC * (1 - prog);
  circleBfdPercent.textContent = progPct.toFixed(1).replace(".", ",") + " %";
  circleBfdAmount.textContent  = euro.format(currentBfd) + " €";

  // Übergangsgebührnisse Balken
  const ugb75 = ugb75Max * prog;
  const ugb100 = ugb100Max * prog;

  ugb75Fill.style.width  = progPct + "%";
  ugb100Fill.style.width = progPct + "%";

  ugb75Text.textContent  =
    `${euro.format(ugb75)} € von ${euro.format(ugb75Max)} €`;
  ugb100Text.textContent =
    `${euro.format(ugb100)} € von ${euro.format(ugb100Max)} €`;
}

// Initial
updateToday();
updateDashboard();

// Intervalle
setInterval(updateDashboard, 1000);
setInterval(updateToday, 60000);
