# Rustam Valeev - personal CV website

A small static website hosted on GitHub Pages.

Website: https://rstkzn.github.io/landing/

## Project structure

```text
landing/
├── index.html                  # Page structure, no individual employers
├── script.js                   # Markdown parser and RU/EN switch
├── pdf.js                      # On-demand bilingual PDF generator (pdfmake)
├── vendor/
│   ├── pdfmake.min.js          # Pinned self-hosted PDF engine
│   └── vfs_fonts.js            # Embedded Unicode fonts (incl. Cyrillic)
├── styles.css                  # Layout and styling
├── assets/
│   └── profile.webp           # Self-hosted color portrait
├── config/
│   └── typography.css         # All text sizes, line heights, spacing
├── content/
│   ├── experience.ru.md       # Russian job history
│   └── experience.en.md       # English job history
└── .github/
    └── workflows/
        └── visual-audit.yml  # Live site and parser tests
```

## Change or add an employer

Edit **content/experience.ru.md** for Russian and **content/experience.en.md** for English.

Use this Markdown format (copy a whole block for a new job):

```md
### Example Company - Senior Database Engineer
*September 2026 - Present*

- First responsibility.
- Second responsibility with **optional bold text**.
- Technical work with `EXPLAIN ANALYZE`.

Technologies: PostgreSQL, Linux, Grafana
```

Russian version:

```md
### Пример компании - Senior Database Engineer
*Сентябрь 2026 - настоящее время*

- Первая область ответственности.
- Вторая область ответственности.

Технологии и инструменты: PostgreSQL, Linux, Grafana
```

### Parsing rules

- **`### Company - Position`** starts a new employer entry. Use the plain hyphen `-` between company and position (older en/em-dash headings remain supported).
- The following *italic* line (`*...*`) is the date range. You can also write `Dates: ...` or `Даты: ...`.
- Each `- ` or `* ` line becomes a bullet.
- `Technologies: ...` / `Технологии и инструменты: ...` shows a technology list.
- Blank lines between blocks are allowed; number of employers is unlimited.
- For two languages, add the same job in **both** files. Language switching loads the corresponding file.
- Optional inline formatting in bullet text: `**bold**`, `*italic*`, `\`code\``.
- Text is inserted safely as text nodes; HTML tags from Markdown are never executed.
- The Experience heading does not repeat a date range; each role includes its own dates.
- Job entries appear in **file order**, so place the newest job first.

**Publishing:** commit edits to `main`. GitHub Pages republishes the site; refresh the website to retrieve the updated Markdown. No `index.html` or JavaScript edits are required to add jobs.

## Download CV as PDF

The **Download PDF / Скачать PDF** button builds a fresh PDF in the visitor's browser for the currently selected language.

- Experience is fetched from `content/experience.en.md` or `content/experience.ru.md` at the time of the click.
- Professional summary and education are taken from the language dictionary in `script.js`.
- Phone, email and LinkedIn are included in the output.
- No pre-generated PDFs are stored in this repository or on GitHub Pages.
- `pdf.js` lazily loads the pinned MIT-licensed pdfmake 0.2.23 engine and bundled Roboto font data (including Cyrillic) from local `vendor/` files, with CDN mirrors only as a fallback.
- No server-side services or GitHub Actions are required to create a PDF for visitors.

The generated file is named `Rustam_Valeev_CV_EN.pdf` or `Rustam_Valeev_CV_RU.pdf`.

## Customize all font sizes and spacing

Edit **config/typography.css**; no other file is necessary.

| Setting | What it controls |
|---|---|
| `--work-description-size` | Font size of responsibility bullet points |
| `--work-description-line-height` | Line spacing inside responsibility text |
| `--work-bullet-gap` | Vertical spacing between responsibility bullets |
| `--work-role-gap` | Space between dates column and role content |
| `--work-block-top-padding` | Space above each employer |
| `--work-block-bottom-padding` | Space below each employer |
| `--employer-name-size` | Employer heading font size |
| `--role-title-size` | Position heading font size |
| `--employment-dates-size` | Date font size |
| `--technology-size` | Technology list text size |
| `--portrait-desktop-size` | Desktop portrait diameter |
| `--portrait-mobile-size` | Mobile portrait diameter |

For example:

```css
:root {
  --work-description-size: 16px;
  --work-description-line-height: 1.95;
  --work-bullet-gap: 14px;
}
```

Use the variable declarations **already present** in the file rather than duplicating the `:root` block.

The circular, full-bleed color portrait is stored locally at `assets/profile.webp`. The website uses `src="assets/profile.webp"` and does not depend on LinkedIn for the image. To replace it later, upload a new `assets/profile.webp` in the same format.

## Local preview

Run a local HTTP server from the repository root. The site fetches Markdown files, so opening `index.html` directly using `file://` will not work.

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/

## Use in ChatGPT Projects

Download the GitHub repository as ZIP (Code → Download ZIP), then add the files or archive to your ChatGPT Project. Editing the live site remains tied to GitHub commits; ChatGPT Projects is a workspace for the source files, not the website host.
