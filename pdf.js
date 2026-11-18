/*
 * Client-side PDF export. Documents are assembled on demand using the
 * same Markdown source and translations as the website; no PDF files
 * are stored or pre-generated on the server.
 *
 * pdfmake (MIT license) is loaded only when the button is pressed.
 * Roboto is embedded by its VFS font bundle, including Cyrillic glyphs.
 */
(function () {
  "use strict";

  const button = document.getElementById("download-pdf");
  const status = document.getElementById("pdf-download-status");
  if (!button) return;

  const resources = [
    [
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.23/pdfmake.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.23/vfs_fonts.min.js"
    ],
    [
      "https://cdn.jsdelivr.net/npm/pdfmake@0.2.23/build/pdfmake.min.js",
      "https://cdn.jsdelivr.net/npm/pdfmake@0.2.23/build/vfs_fonts.js"
    ]
  ];
  let pdfLibrary = null;
  let libraryPromise = null;
  let fontsReady = false;

  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = src;
      element.async = true;
      element.onload = resolve;
      element.onerror = () => reject(new Error("Failed loading " + src));
      document.head.appendChild(element);
    });
  }

  async function loadPdfMake() {
    if (pdfLibrary) return pdfLibrary;
    if (!libraryPromise) {
      libraryPromise = (async () => {
        let lastError;
        for (const pair of resources) {
          try {
            if (!window.pdfMake?.createPdf) await injectScript(pair[0]);
            if (!fontsReady) {
              // pdfmake 0.2.x registers the VFS internally via
              // addVirtualFileSystem(), so window.pdfMake.vfs is not
              // necessarily exposed even when fonts are registered.
              await injectScript(pair[1]);
              fontsReady = true;
            }
            if (!window.pdfMake?.createPdf) {
              throw new Error("PDF engine is unavailable");
            }
            pdfLibrary = window.pdfMake;
            return pdfLibrary;
          } catch (error) {
            lastError = error;
            console.warn("PDF library source unavailable:", error);
          }
        }
        throw lastError || new Error("Unable to initialize PDF library");
      })().catch(error => {
        libraryPromise = null;
        throw error;
      });
    }
    return libraryPromise;
  }

  const stripInlineMarkdown = value => String(value)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");

  function createDefinition(language, roles) {
    const text = translations[language];
    const line = "#D9DEDA";
    const content = [
      { text: "Rustam Valeev", style: "name", margin: [0, 0, 0, 2] },
      { text: "Senior Database Engineer", style: "subtitle", margin: [0, 0, 0, 9] },
      {
        text: [
          { text: "rstkzn@yandex.ru", link: "mailto:rstkzn@yandex.ru", color: "#355E50" },
          "   ·   +7 917 393 5321   ·   ",
          { text: "LinkedIn", link: "https://www.linkedin.com/in/rustam-v/", color: "#355E50" }
        ],
        style: "contacts",
        margin: [0, 0, 0, 15]
      },
      { text: text.introSummary, style: "summary", margin: [0, 0, 0, 15] },
      { text: text.experienceTitle, style: "section", margin: [0, 3, 0, 8] }
    ];

    for (const role of roles) {
      content.push({
        columns: [
          { text: role.company, style: "company", width: "*" },
          { text: role.dates, style: "period", width: "auto", alignment: "right" }
        ],
        columnGap: 12,
        margin: [0, 9, 0, 1]
      });
      content.push({ text: role.title, style: "role", margin: [0, 0, 0, 5] });
      if (role.bullets.length) {
        content.push({
          ul: role.bullets.map(bullet => stripInlineMarkdown(bullet)),
          style: "bulletList",
          margin: [0, 0, 0, 6]
        });
      }
      if (role.technologies) {
        content.push({
          text: [
            { text: text.toolsLabel + ": ", bold: true },
            { text: role.technologies }
          ],
          style: "technology",
          margin: [0, 1, 0, 4]
        });
      }
    }

    content.push(
      { text: text.educationTitle, style: "section", margin: [0, 16, 0, 9] },
      { text: text.educationUniversity, style: "company", margin: [0, 0, 0, 2] },
      { text: text.educationDegree + " · " + text.educationYear, style: "role", margin: [0, 0, 0, 3] },
      { text: text.educationField, style: "summary", margin: [0, 0, 0, 5] }
    );

    return {
      pageSize: "A4",
      pageMargins: [42, 40, 42, 46],
      info: {
        title: "Rustam Valeev — Senior Database Engineer",
        author: "Rustam Valeev",
        subject: "Database Engineering CV (" + language.toUpperCase() + ")"
      },
      content,
      defaultStyle: { font: "Roboto", fontSize: 9.25, color: "#252B28", lineHeight: 1.24 },
      styles: {
        name: { fontSize: 22, bold: false, color: "#171B19" },
        subtitle: { fontSize: 12, color: "#394740" },
        contacts: { fontSize: 9, color: "#58615B" },
        summary: { fontSize: 9.25, lineHeight: 1.32, color: "#3B4841" },
        section: { fontSize: 12.5, bold: true, color: "#18241D", decoration: "underline", decorationColor: line },
        company: { fontSize: 10.5, bold: true, color: "#202923" },
        period: { fontSize: 8.6, color: "#606E65" },
        role: { fontSize: 9, color: "#5A635D" },
        bulletList: { fontSize: 9, lineHeight: 1.2, color: "#303A34" },
        technology: { fontSize: 8.35, lineHeight: 1.2, color: "#56625B" }
      },
      footer: (page, pages) => ({
        text: page + " / " + pages,
        alignment: "right",
        margin: [0, 12, 42, 0],
        color: "#89928C",
        fontSize: 8
      })
    };
  }

  async function getFreshRoles(language) {
    // Re-read the Markdown even when the page was opened before an edit.
    // The existing parser is the single source of rendering semantics.
    const response = await fetch("content/experience." + language + ".md", { cache: "no-store" });
    if (!response.ok) throw new Error("Cannot load CV Markdown: HTTP " + response.status);
    const roles = parseExperience(await response.text());
    if (!roles.length) throw new Error("No valid work experience entries in Markdown");
    return roles;
  }

  async function downloadPdf() {
    if (button.disabled) return;
    const language = currentLanguage;
    button.disabled = true;
    status.textContent = language === "ru" ? "Формирование PDF…" : "Generating PDF…";
    try {
      const [library, roles] = await Promise.all([loadPdfMake(), getFreshRoles(language)]);
      const document = createDefinition(language, roles);
      const filename = "Rustam_Valeev_CV_" + language.toUpperCase() + ".pdf";
      await library.createPdf(document).download(filename);
      status.textContent = "";
    } catch (error) {
      console.error("PDF export failed:", error);
      status.textContent = language === "ru"
        ? "Не удалось сформировать PDF. Попробуйте ещё раз."
        : "PDF generation failed. Please try again.";
    } finally {
      button.disabled = false;
    }
  }

  button.disabled = false;
  button.addEventListener("click", downloadPdf);

  // Expose pure builders for automated browser tests without downloading files.
  window.__cvPdfTest = { createDefinition, getFreshRoles };
})();
