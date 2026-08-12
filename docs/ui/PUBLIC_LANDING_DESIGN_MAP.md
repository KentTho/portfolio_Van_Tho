# PUBLIC LANDING — Design Ownership Map

> **Đọc file này ĐẦU TIÊN trước mọi lần nâng cấp giao diện public.** Đây **không** phải
> project tracker — nó là bản đồ *ai (file nào) sở hữu phần nào* của Single Landing Page,
> kèm token/typography/motion/data-source để chỉnh sửa đúng chỗ.
>
> Design language: **COSMIC ENGINEERING EDITORIAL** — depth · atmosphere · brand geometry ·
> controlled motion. Palette lấy từ logo thật (`src/components/public/image/logo_myself.jpg`):
> **xanh royal điện + vàng kim trên nền đen**. Dials: DESIGN_VARIANCE≈7 · MOTION_INTENSITY≈5 · VISUAL_DENSITY≈5.

## 1. Global foundation

| Concern | File | Ghi chú |
|---|---|---|
| **Design tokens** (màu/shape/typography scale/spacing/motion) | `src/styles/tokens.css` | Brand canonical `--brand-primary/-soft/-secondary/-secondary-soft/-highlight`, `--canvas(-elevated)`, `--surface(-raised/-hover)`, `--foreground(-muted/-subtle)`, `--border(-strong)`, `--focus-ring`, `--glow-primary-soft/-strong`, `--glow-secondary-soft`. Legacy `--fg/--accent/--ring/--glow-*` = **alias** trỏ brand (đừng xóa — nhiều component dùng). **Không hardcode hex trong component.** |
| **Theme mapping + typography classes** | `src/app/globals.css` | `@theme` sinh utility (`bg-brand-primary`, `text-accent`, `border-border-strong`…). Typography: `.text-display / .text-h1 / .text-h2 / .text-h3 / .text-body-l / .text-body-s / .label-mono`. Reduced-motion global gate. |
| **Fonts** | `src/app/layout.tsx` | `Syne` (display, `--font-syne`) · `Inter` (body, `--font-inter`) · `JetBrains_Mono` (mono, `--font-mono`). Nhất quán toàn site — không thêm font khác. |
| **Atmospheric background** | `src/components/public/cosmic-background.tsx` | Aurora xanh (top) + glow vàng + masked grid. Pure CSS, fixed, `-z-10`. Dùng brand qua alias. |
| **Scroll-reveal primitive** | `src/components/public/reveal.tsx` | `Reveal` (whileInView, once, reduced-motion aware). Motion signature dùng chung cho entrance. |
| **Portrait primitive** | `src/components/public/visual/portrait-frame.tsx` | `vantho.png` next/image + brand glow + gold hairline + bottom-fade vào canvas. |
| **Technology tile** | `src/components/technology/technology-logo.tsx` | Map canonical tech id → tile màu brand riêng của tech (short-code fallback). **Data authority = Neon/Admin** (`src/config/technology-catalog.ts` chỉ định nghĩa cách render, KHÔNG phải inventory). |

### Typography roles (§8 — tách biệt tiêu đề/phụ/nội dung)
`Display` = tên Hero · `H2` (`.text-h2`) = tiêu đề section · `H3` = tiêu đề card/project · `Body-L` = lead ·
`Body` = nội dung · `Label/Mono` (`.label-mono`) = metadata/counter/kỹ thuật.

### Spatial grammar (§9)
`--container-max: 72rem` · gutter `px-6` · `--section-py` (`py-24`) · reading measure `--measure` · grid gap 3–4.

## 2. Nine sections (ONE SECTION = ONE OWNER FILE)

| Section | Anchor | Owner file | Data source | Visual purpose | Motion signature | Notes |
|---|---|---|---|---|---|---|
| **Hero** | `#home` | `sections/hero-section.tsx` | `profile` (name/role/headline) + `portrait-frame` | First impression: identity + portrait | BlurText name + staggered meta + portrait depth entrance + slow orbital drift (LEVEL 3) | Fallback name = `SITE.owner` khi profile trống. Không chứa tech inventory. |
| **About** | `#about` | `sections/about-section.tsx` | `profile.summary` + facts (role/location/languages) | Bio + technical snapshot | `Reveal` prose + facts grid | Education để ở Experience (tránh trùng). |
| **Focus** | `#focus` | `sections/focus-section.tsx` | `profile.focusAreas` | Trọng tâm kỹ thuật (pills) | `Reveal` stagger pills | Empty → chỉ heading. |
| **Projects** | `#projects` | `sections/featured-projects-section.tsx` | `repo.listProjects()` (LIVE Neon) | Case-study cards | hover lift + border glow (`Reveal` stagger) | Empty state chỉnh chu. Detail: `projects/[slug]`. `viewAllHref` optional (không dùng ở landing). |
| **Experience** | `#experience` | `sections/experience-section.tsx` | `repo.listExperience()` + `profile.education` | Timeline nghề nghiệp + học vấn | timeline entry reveal | Empty state. |
| **Skills** | `#skills` | `sections/tech-matrix-section.tsx` | `repo.getTechGroups()` (**hiện `[]` — chưa có nguồn Neon cho groups**) | Tech matrix (logo tiles) | grid reveal + tile depth | **Data authority = Neon/Admin only.** Empty tới khi Owner thêm. |
| **Principles** | `#principles` | `sections/principles-section.tsx` | `dict.principles` | Manifesto kỹ thuật | sequential numbered reveal + hairline | Typography là visual chính. |
| **Articles** | `#articles` | `sections/articles-section.tsx` | `repo.listArticles()` (LIVE Neon) | Publication list | staggered editorial reveal | Empty state. Detail: `articles/[slug]`. |
| **Contact** | `#contact` | `sections/contact-cta-section.tsx` | `contactSocials` (profile socials, fallback GitHub `SITE.repositoryUrl`) | Closing CTA + verified links | glow entrance + CTA feedback | Contact **form** = Wave 06A (không fake submit). Email = primary button khi có. |

## 3. Header / Footer / Section composer

| Element | File | Ghi chú |
|---|---|---|
| **Landing composer** | `src/app/[locale]/page.tsx` | Fetch profile/groups/projects/articles/experience; anchor wrappers `#id scroll-mt-20`; fallbacks empty-state; JSON-LD. |
| **Header** | `src/components/public/public-header.tsx` | Anchor-aware nav + IntersectionObserver scroll-spy + blur/transparency transition + layoutId indicator + mobile drawer. Nav array ở `layout.tsx`. |
| **Footer** | `src/components/public/public-footer.tsx` | Minimal closure (hairline + social pills). Không cạnh tranh Contact. |
| **Section shell** | `src/components/public/section-heading.tsx` | `.text-h2` title + `.text-body` subtitle (max 1 eyebrow/3 sections). |

## 4. Motion architecture (§12)
- Grammar chung: easing `--ease-out` (cubic-bezier .22,1,.36,1), duration 380–700ms, entrance từ dưới lên (`y+16→0`, opacity).
- Strategic continuous motion: **Hero** (orbital drift). Projects/Skills = interaction-on-hover (không loop).
- **MUST honor `prefers-reduced-motion`** (global CSS gate + per-component `useReducedMotion`).

## 5. React Bits / 3D (§26–§27)
- Dùng: **BlurText** (`components/ui/blur-text.tsx`) ở Hero name. **0 component React Bits mới thêm** (CSS + `motion/react` đủ).
- Depth = CSS transform/perspective/glow/orbital, **không WebGL/Three**. Animation authority = `motion/react` (không `framer-motion`).

## 6. Cách nâng cấp lần sau
1. Đổi màu/thang chữ/nhịp → **`tokens.css`** (+ `globals.css` nếu thêm utility). Không sửa hex trong component.
2. Đổi 1 section → mở đúng owner file ở §2. Data-driven section: nội dung đến từ Neon/Admin, **không hardcode**.
3. Thêm motion → theo grammar §4, luôn gate reduced-motion.
4. QA: `node scripts/qa-screenshot.mjs <url> <out.png> [w] [h] [selector]` (output `.qa-shots/`, gitignored).

## 7. Trạng thái QA (Prompt 12)
- **Hero**: QA desktop 1440 + mobile 390 — PASS (portrait + brand + typography).
- **Principles**: PASS (nội dung `dict`).
- **Contact**: PASS (GitHub fallback link).
- **Các section data-driven (Projects/Experience/Skills/Articles/About/Focus)**: hiện **empty state** vì Neon Dev chưa có nội dung (Owner nhập qua Admin sau). Empty states đã QA on-brand. **Populated-state QA sẽ chạy lại sau khi Owner nhập dữ liệu thật.**
