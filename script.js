/*
 * Rustam Valeev website
 * Experience is loaded from content/experience.{en,ru}.md.
 * To add a role, add a ### Company — Job title heading, an italic date
 * line, followed by ordinary Markdown list items. No HTML changes needed.
 */
const translations = {
  en: {
    navExperience: "Experience",
    navContact: "Contact",
    introKicker: "DATABASE ENGINEER / POSTGRESQL",
    introSummary: "I work on the performance and reliability of production database systems, primarily PostgreSQL: SQL workloads, physical data design, replication and complex incident analysis.",
    introDetails: "SQL & performance · Data modeling · Replication · Reliability",
    experienceTitle: "Experience",
    contactTitle: "Contact",
    contactText: "For professional inquiries and discussions about PostgreSQL and database systems.",
    contactLink: "LinkedIn profile ↗",
    footerNote: "Senior Database Engineer · PostgreSQL",
    toolsLabel: "Tools & technologies",
    loading: "Loading experience…",
    failed: "Could not load work history. Please refresh the page."
  },
  ru: {
    navExperience: "Опыт",
    navContact: "Контакты",
    introKicker: "DATABASE ENGINEER / POSTGRESQL",
    introSummary: "Работаю с производительностью и надёжностью production-баз данных. Основной фокус — PostgreSQL: SQL-нагрузка, физическая организация данных, репликация и разбор сложных инцидентов.",
    introDetails: "SQL & performance · Data modeling · Replication · Reliability",
    experienceTitle: "Опыт работы",
    contactTitle: "Контакты",
    contactText: "Для профессиональных вопросов и обсуждения PostgreSQL и систем баз данных.",
    contactLink: "Профиль LinkedIn ↗",
    footerNote: "Senior Database Engineer · PostgreSQL",
    toolsLabel: "Технологии и инструменты",
    loading: "Загрузка опыта работы…",
    failed: "Не удалось загрузить опыт работы. Обновите страницу."
  }
};

const languageButton = document.getElementById("lang");
const positionsElement = document.getElementById("positions");
const yearsElement = document.getElementById("experience-years");
const statusElement = document.getElementById("experience-status");
const experienceCache = new Map();
let currentLanguage = "en";
let requestToken = 0;

try { if (localStorage.getItem("portfolio-language") === "ru") currentLanguage = "ru"; } catch (_) {}

/*
 * Supported Markdown syntax (one role per ### heading):
 *
 * ### Company — Job title
 * *January 2020 — Present*
 *
 * - Responsibility
 * - Responsibility
 *
 * Technologies: PostgreSQL, Linux
 *
 * Heading, dates, bullet points and technologies are detected from markers,
 * not fixed positions or employer names. Escaped HTML is never executed.
 */
function parseExperience(markdown) {
  const roles = [];
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let role = null;
  let lastBulletIndex = -1;
  let comment = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("<!--")) comment = true;
    if (comment) {
      if (line.includes("-->")) comment = false;
      continue;
    }
    if (!line || line === "---") { lastBulletIndex = -1; continue; }

    const heading = line.match(/^###\s+(.+?)\s+[—–-]\s+(.+)$/);
    if (heading) {
      role = {
        company: heading[1].trim(),
        title: heading[2].trim(),
        dates: "",
        bullets: [],
        technologies: ""
      };
      roles.push(role);
      lastBulletIndex = -1;
      continue;
    }

    if (!role) continue;
    const date = line.match(/^\*([^*]+)\*$/) || line.match(/^\*\*([^*]+)\*\*$/) || line.match(/^(?:Даты|Dates|Period):\s*(.+)$/i);
    if (date && !role.dates) {
      role.dates = date[1].trim();
      lastBulletIndex = -1;
      continue;
    }

    const technologies = line.match(/^(?:Технологии и инструменты|Технологии|Technologies|Tech stack|Tools & technologies):\s*(.+)$/i);
    if (technologies) {
      role.technologies = technologies[1].trim();
      lastBulletIndex = -1;
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      role.bullets.push(bullet[1]);
      lastBulletIndex = role.bullets.length - 1;
    } else if (lastBulletIndex >= 0 && !line.startsWith("#")) {
      role.bullets[lastBulletIndex] += " " + line;
    }
  }
  return roles.filter(item => item.company && item.title && item.dates);
}

function renderInlineMarkdown(node, input) {
  // Allow optional **emphasis**, *emphasis*, and `inline code`.
  // All user text is inserted with textContent, never innerHTML.
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let cursor = 0;
  for (const match of input.matchAll(pattern)) {
    const pos = match.index ?? 0;
    if (pos > cursor) node.appendChild(document.createTextNode(input.slice(cursor, pos)));
    let element;
    if (match[2]) element = document.createElement("strong");
    else if (match[3]) element = document.createElement("em");
    else element = document.createElement("code");
    element.textContent = match[2] || match[3] || match[4] || "";
    node.appendChild(element);
    cursor = pos + match[0].length;
  }
  if (cursor < input.length) node.appendChild(document.createTextNode(input.slice(cursor)));
}

function createRole(role, index, language) {
  const article = document.createElement("article");
  article.className = "position " + (index < 2 ? "position-primary" : "position-secondary");
  const dates = document.createElement("div");
  dates.className = "position-date";
  dates.textContent = role.dates;
  article.appendChild(dates);

  const content = document.createElement("div");
  content.className = "position-content";
  const heading = document.createElement("div");
  heading.className = "position-heading";
  const title = document.createElement("h3");
  title.textContent = role.company;
  const subtitle = document.createElement("p");
  subtitle.className = "position-role";
  subtitle.textContent = role.title;
  heading.append(title, subtitle);
  content.appendChild(heading);

  if (role.bullets.length) {
    const list = document.createElement("ul");
    for (const item of role.bullets) {
      const li = document.createElement("li");
      renderInlineMarkdown(li, item);
      list.appendChild(li);
    }
    content.appendChild(list);
  }

  if (role.technologies) {
    const tools = document.createElement("p");
    tools.className = "position-tools";
    const label = document.createElement("span");
    label.className = "tools-label";
    label.textContent = translations[language].toolsLabel;
    const values = document.createElement("span");
    values.className = "tools-list";
    values.textContent = role.technologies;
    tools.append(label, values);
    content.appendChild(tools);
  }

  article.appendChild(content);
  return article;
}

function yearsFromRoles(roles, language) {
  const years = roles.flatMap(role => [...role.dates.matchAll(/(?:19|20)\d{2}/g)].map(match => Number(match[0])));
  if (!years.length) return "";
  const earliest = Math.min(...years);
  const latest = Math.max(...years);
  const current = roles.some(role => /(?:настоящее время|present|current|now)/i.test(role.dates));
  return earliest + " — " + (current ? (language === "ru" ? "наст. время" : "Present") : latest);
}

async function getExperience(language) {
  if (experienceCache.has(language)) return experienceCache.get(language);
  const path = "content/experience." + language + ".md";
  const response = await fetch(path, {cache: "no-cache"});
  if (!response.ok) throw new Error("Cannot fetch " + path + ": HTTP " + response.status);
  const roles = parseExperience(await response.text());
  if (!roles.length) throw new Error("No valid roles found in " + path);
  experienceCache.set(language, roles);
  return roles;
}

async function applyLanguage(language) {
  currentLanguage = language;
  const token = ++requestToken;
  document.documentElement.lang = language;
  const copy = translations[language];
  for (const element of document.querySelectorAll("[data-i]")) {
    const value = copy[element.dataset.i];
    if (value !== undefined) element.textContent = value;
  }
  languageButton.textContent = language === "ru" ? "EN" : "RU";
  languageButton.setAttribute("aria-label", language === "ru" ? "Switch to English" : "Переключить на русский");

  positionsElement.setAttribute("aria-busy", "true");
  if (statusElement.isConnected) statusElement.textContent = copy.loading;
  try {
    const roles = await getExperience(language);
    if (token !== requestToken) return;
    const fragment = document.createDocumentFragment();
    roles.forEach((role, index) => fragment.appendChild(createRole(role, index, language)));
    positionsElement.replaceChildren(fragment);
    yearsElement.textContent = yearsFromRoles(roles, language);
    positionsElement.setAttribute("aria-busy", "false");
  } catch (error) {
    if (token !== requestToken) return;
    console.error("Failed to load experience:", error);
    const errorMessage = document.createElement("p");
    errorMessage.className = "experience-error";
    errorMessage.textContent = copy.failed;
    positionsElement.replaceChildren(errorMessage);
    positionsElement.setAttribute("aria-busy", "false");
  }
  try { localStorage.setItem("portfolio-language", language); } catch (_) {}
}

languageButton.addEventListener("click", () => applyLanguage(currentLanguage === "en" ? "ru" : "en"));
applyLanguage(currentLanguage);

const menu = document.getElementById("menu");
const nav = document.getElementById("navigation");
menu.addEventListener("click", () => {
  menu.setAttribute("aria-expanded", String(nav.classList.toggle("is-open")));
});
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
}));
const photo = document.getElementById("profile");
if (photo) {
  photo.addEventListener("error", () => photo.classList.add("failed"));
  if (photo.complete && !photo.naturalWidth) photo.classList.add("failed");
}
document.getElementById("year").textContent = new Date().getFullYear();
