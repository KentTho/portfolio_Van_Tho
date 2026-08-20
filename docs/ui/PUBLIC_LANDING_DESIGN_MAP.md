# PUBLIC LANDING — Design Ownership Map

> **Đọc file này ĐẦU TIÊN trước mọi lần nâng cấp giao diện public.** Đây **không** phải
> project tracker — nó là bản đồ *ai (file nào) sở hữu phần nào* của Single Landing Page,
> kèm token/typography/motion/data-source để chỉnh sửa đúng chỗ.
>
> Design language: **COSMIC ENGINEERING EDITORIAL** — depth · atmosphere · brand geometry ·
> controlled motion. Palette lấy từ logo thật (`src/components/public/image/logo_myself.jpg`):
> **xanh royal điện + vàng kim trên nền đen**. Dials: DESIGN_VARIANCE≈7 · MOTION_INTENSITY≈5 · VISUAL_DENSITY≈5.
>
> **[V2 — Hero+Menu+About = APPROVED (PR #9); Career IN PROGRESS · 2026-08-18]**
> **Hero+Menu+About + Career + Contact/Footer:** ✅ **APPROVED + MERGED + Production LIVE.** `main` = **`9939ec5`** (Contact/Footer PR #12 merged). Tất cả 6 block V2 + Footer trên main, production verified. **Global Navigation + Motion (`#header` + cross-section):** branch `feat/v2-global-navigation-motion-system` (**PR** mở, base main) — compact/expanded icon-capsule nav (Owner 2A) + MASTER-MOTION-02 handoff (Owner 3A). Chi tiết ở §Header + §Motion. **Hydration:** `EXTERNAL_BROWSER_EXTENSION_MUTATION_CONFIRMED` (clean Chromium 0 errors; Owner trace = Liner `data-liner-extension-version` + `data-be-installed` extension injection — no app fix, no suppressHydrationWarning; regression guard added tới e2e:public). Chi tiết Career ↓.
>
> **[HISTORICAL — Career `#career` detail]** branch `feat/v2-career-experience-education` — **Education-first timeline** (central-axis, milestone node + glow, year metadata, Syne institution authority) với **dormant two-tab state machine** [Kinh nghiệm | Học vấn] tự bật khi verified Experience xuất hiện (không rewrite). No fabrication (Experience thật vẫn `PENDING_OWNER_EXPERIENCE_DETAILS`). Chi tiết ↓.
>
> **[HISTORICAL — Hero+Menu+About V2 detail · branch `feat/v2-hero-menu-enhancement` · PR #9]**
> Reference `docs/image_demo_portfolio/{hero-section,About}.png` + `HEROAUDIT.md` / `Menu_audit.md` / `ABOUT01audit.md`
> (học composition/lighting/rhythm — KHÔNG clone, KHÔNG tím). **Hero (corrected):** 3-zone (LEFT identity · CENTER
> portrait anchor · RIGHT profession) — **tên 2 dòng "Hà Văn"/"Thọ"** (Owner-locked), portrait lớn hơn + cao hơn +
> backlight blue tập trung (portrait nổi hơn nền), right zone kéo gần eye-line, **1 CTA primary "Xem dự án" + "Liên hệ"
> = text-link nhẹ**, orbital giảm còn 1 ring rất mờ. **Canvas tối hơn + grid mờ hơn** (`cosmic-background`). **Menu:**
> verified vs `Menu_audit` — active = underline glow ≠ hover underline-grow, scroll-spy đúng cả 6 block (Contact
> activate ở bottom, KHÔNG dead-zone), anchor offset qua `scroll-mt-20`, brand=Syne / nav=Inter. **About (V2 mới):**
> editorial split — statement (eyebrow/Syne headline/Inter lead) + **backlit identity fact-panel** (Vai trò/Địa điểm/
> Học vấn thật + orbital echo) — continuation của Hero, không card-grid, không portrait-repeat. **Hydration:**
> `EXTERNAL_BROWSER_EXTENSION_MUTATION_CONFIRMED` (clean env 0 errors; Owner's warning = Liner/`data-be-installed`
> extension). Chưa merge vào main. Các section Projects/Career/Skills/Contact **KHÔNG đổi** phiên này.

## 1. Global foundation

| Concern | File | Ghi chú |
|---|---|---|
| **Design tokens** (màu/shape/typography scale/spacing/motion) | `src/styles/tokens.css` | Brand canonical `--brand-primary/-soft/-secondary/-secondary-soft/-highlight`, `--canvas(-elevated)`, `--surface(-raised/-hover)`, `--foreground(-muted/-subtle)`, `--border(-strong)`, `--focus-ring`, `--glow-primary-soft/-strong`, `--glow-secondary-soft`. Legacy `--fg/--accent/--ring/--glow-*` = **alias** trỏ brand (đừng xóa — nhiều component dùng). **Không hardcode hex trong component.** |
| **Theme mapping + typography classes** | `src/app/globals.css` | `@theme` sinh utility (`bg-brand-primary`, `text-accent`, `border-border-strong`…). Typography: `.text-display / .text-h1 / .text-h2 / .text-h3 / .text-body-l / .text-body-s / .label-mono`. Reduced-motion global gate. |
| **Fonts** | `src/app/layout.tsx` | `Syne` (display, `--font-syne`) · `Inter` (body, `--font-inter`) · `JetBrains_Mono` (mono, `--font-mono`). Nhất quán toàn site — không thêm font khác. |
| **Atmospheric background** | `src/components/public/cosmic-background.tsx` | **V2: darker/quieter** — restrained aurora (blue 7% / gold 5%) + **barely-there grid (opacity 0.05)** so the hero portrait backlight, not the background, carries the light (Owner V2 direction). Pure CSS, fixed, `-z-10`. |
| **Scroll-reveal primitive** | `src/components/public/reveal.tsx` | `Reveal` (whileInView, once, reduced-motion aware). Motion signature dùng chung cho entrance. |
| **Portrait primitive** | `src/components/public/visual/portrait-frame.tsx` | **V2: frameless** — `vantho.png` next/image (object-contain, no distortion) *emerging from canvas*: blue backlight + restrained gold undertone (silhouette separation), radial vignette + multiply sink + bottom-fade dissolve the studio backdrop's rectangular edges (no card/box). Pointer depth layered by Hero via `PointerTilt`. |
| **Brand marks** | `src/components/public/visual/brand-icons.tsx` | GitHub/LinkedIn inline SVG (`currentColor`) — lucide dropped brand glyphs. Used by Hero social rail. |
| **Intro gate** | `src/components/public/motion/intro-gate.ts` | Single-authority "stage clear" signal (`markIntroReady`/`useIntroReady`). IntroCurtain fires it as it lifts so the Hero entrance is *seen*, not hidden behind the curtain. |
| **Reduced-motion (hydration-safe)** | `src/components/public/motion/use-reduced-motion-safe.ts` | Returns `false` on server + first client render, real value after mount → no hydration mismatch for components that branch DOM on reduced motion (KineticText, Reveal, Magnetic/PointerTilt, CursorHalo, Hero). |
| **Technology tile** | `src/components/technology/technology-logo.tsx` | Map canonical tech id → tile màu brand riêng của tech (short-code fallback). **Data authority = Neon/Admin** (`src/config/technology-catalog.ts` chỉ định nghĩa cách render, KHÔNG phải inventory). |

### Typography roles (§8 — tách biệt tiêu đề/phụ/nội dung)
`Display` = tên Hero · `H2` (`.text-h2`) = tiêu đề section · `H3` = tiêu đề card/project · `Body-L` = lead ·
`Body` = nội dung · `Label/Mono` (`.label-mono`) = metadata/counter/kỹ thuật.

### Spatial grammar (§9)
`--container-max: 72rem` · gutter `px-6` · `--section-py` (`py-24`) · reading measure `--measure` · grid gap 3–4.

## 2. Sections (ONE SECTION = ONE OWNER FILE)

> **IA UPDATE (Prompt 12R/V1):** the landing is now **6 recruiter-first blocks** —
> `#home` (Hero) · `#about` · `#projects` (Expense Tracker) · `#career` (Experience & Education) ·
> `#skills` · `#contact`. **Focus / Principles / Articles were removed from the landing** (their
> section components deleted); the **article domain + `/articles/[slug]` detail routes remain**.
> Skills populate from Neon skills (`getTechGroups`←`listPublicSkills`, grouped by category);
> Education from Neon (`getProfile().education`←`listPublicEducation`). The 9-section table below is
> historical — treat only the 6 blocks above as current.

### (historical 9-section reference)

| Section | Anchor | Owner file | Data source | Visual purpose | Motion signature | Notes |
|---|---|---|---|---|---|---|
| **Hero** | `#home` | `sections/hero-section.tsx` | `profile` (name/role/headline/**socials**) + `portrait-frame` + hero labels (`dict.hero.intro/focus/scroll`) | First impression: identity + portrait + profession | **V2 3-zone (corrected):** LEFT identity (intro eyebrow → **2-line name** `KineticText` "Hà Văn"/"Thọ" focal → lead → **1 primary CTA + light secondary link**) · CENTER portrait anchor (large, high, focused blue backlight, descends -26→0, `PointerTilt` max 4°) · RIGHT profession (focus eyebrow → `KineticText` role → availability chip, tucked near eye-line) · vertical social rail · scroll cue. Opposing vectors (portrait down / text up), released by `intro-gate` when curtain lifts, **once, no loop**, reduced-motion gated. Single orbital ring (very faint). CTAs: Xem dự án→#projects (primary), Liên hệ→#contact (text link; no Resume — `PENDING_PUBLIC_SAFE_RESUME`). | Name break Owner-locked. Fallback name = `SITE.owner`. Social rail = real socials only (GitHub + email). Không tech inventory. |
| **About** | `#about` | `sections/about-section.tsx` | `profile.summary` (fallback `dict.meta.homeDescription`) + facts (role/location/**education**) + `dict.about.{eyebrow,headline}` | **V2 continuation of Hero:** "how I build" | **V2 editorial split:** statement (mono eyebrow → Syne headline → Inter lead) + **backlit identity fact-panel** (blue backlight + orbital echo + mono-label fact rail); `Reveal` once. NOT a card grid, NOT a portrait-repeat. | Real facts only; empty facts drop out. Summary falls back to site description (config, not fabricated). |
| **Focus** | `#focus` | `sections/focus-section.tsx` | `profile.focusAreas` | Trọng tâm kỹ thuật (pills) | `Reveal` stagger pills | Empty → chỉ heading. |
| **Projects** | `#projects` | `sections/featured-projects-section.tsx` | `repo.listProjects()` (LIVE Neon) | Case-study cards | hover lift + border glow (`Reveal` stagger) | Empty state chỉnh chu. Detail: `projects/[slug]`. `viewAllHref` optional (không dùng ở landing). |
| **Career** | `#career` | `sections/experience-section.tsx` (client) + pure `sections/career-tabs.ts` | `repo.listExperience()` + **`repo.listEducation()`** (new port method → `EducationItem`) + `dict.career.*` | **V2 verified chronology:** central-axis timeline (milestone node + brand glow, gold year metadata, Syne institution/role H3, Inter detail). **State machine:** Education-only → single timeline (NO empty tab); Experience+Education → `role=tablist` [Kinh nghiệm\|Học vấn] (default Experience) with crossfade+y panel transition, **grid-stacked panels → 0 height jump**, roving keyboard, `aria-selected/controls`, focus-visible, ≥44px targets. | Motion: line-draw (scaleY once) + milestone stagger, reduced-motion→static. Auto-upgrades to two-tab when Experience authored (no rewrite). Live Neon only; Experience real = `PENDING_OWNER_EXPERIENCE_DETAILS` (no fabrication). |
| **Skills** | `#skills` | `sections/tech-matrix-section.tsx` | `repo.getTechGroups()` (**hiện `[]` — chưa có nguồn Neon cho groups**) | Tech matrix (logo tiles) | grid reveal + tile depth | **Data authority = Neon/Admin only.** Empty tới khi Owner thêm. |
| **Principles** | `#principles` | `sections/principles-section.tsx` | `dict.principles` | Manifesto kỹ thuật | sequential numbered reveal + hairline | Typography là visual chính. |
| **Articles** | `#articles` | `sections/articles-section.tsx` | `repo.listArticles()` (LIVE Neon) | Publication list | staggered editorial reveal | Empty state. Detail: `articles/[slug]`. |
| **Contact** | `#contact` | `sections/contact-cta-section.tsx` (client) + pure `sections/contact-copy.ts` | real `email` (profile publicEmail) + verified `channels` (GitHub via `SITE.repositoryUrl`) + `dict.contact.*` | **V2 conversion point:** centered editorial (eyebrow → Syne headline → recruiter lead), **primary real `mailto` CTA "Gửi email"** + **copy-email state machine** (idle/copied/error, clipboard try/catch, timer cleanup, **grid-stacked labels = 0 width jump**, `role=status` aria-live, keyboard) + verified channels (hover **increases** affordance, external rel). No glass card, one accent. | entrance stagger once (reduced-motion static). **No form** (Wave 06A), no fake submit, no fabricated socials. |

## 3. Header / Footer / Section composer

| Element | File | Ghi chú |
|---|---|---|
| **Landing composer** | `src/app/[locale]/page.tsx` | Fetch profile/groups/projects/articles/experience; anchor wrappers `#id scroll-mt-20`; fallbacks empty-state; JSON-LD. |
| **Header** | `src/components/public/public-header.tsx` (client) | Brand-left (**= Home**, subtle active treatment at top) + **compact/expanded icon-capsule nav** right (Owner 2A, adapted from `Menu-Update`, NOT copied). **State model:** `active` section = capsule **always expanded** [icon + label] (blue tint + gold micro-hairline, `aria-current="location"`); `inactive` = **compact icon** capsule (icon always visible + `aria-label`); **hover/focus-visible** inactive → temporary expand (label via **grid-column `0fr→1fr` transition → 0 header CLS**, brand/locale never jump). Icons (lucide): About=UserRound · Projects=FolderKanban · Career=Briefcase · Skills=Code2 · Contact=Mail. One IntersectionObserver scroll-spy (6 blocks, **no dead-zone** — Contact active through footer; verified). transparent→blur on scroll. `LanguageSwitcher` separate. **Mobile:** explicit icon + **full-label** drawer (no icon-only mystery), `aria-expanded/controls`, Escape. `useReducedMotionSafe`. Nav array ở `layout.tsx`. |
| **Footer** | `src/components/public/public-footer.tsx` (server) | **V2 page closure:** brand + `madeWith` + `© {year}` (server-computed → deterministic, no hydration risk) · verified links (hover increases affordance) · **Back-to-Top** control (`/{locale}#home`, native smooth-scroll, ≥44px, `dict.footer.backToTop`). Hairline top border, minimal, không cạnh tranh Contact. Receives `locale`. |
| **Section shell** | `src/components/public/section-heading.tsx` | `.text-h2` title + `.text-body` subtitle (max 1 eyebrow/3 sections). |

## 4. Motion architecture — MASTER-MOTION-02, VISIBLE-PREMIUM (Owner 3A `HYBRID_PERSISTENT_HANDOFF`)
- **Perception-first:** a normal viewer must SEE the entrance at normal scroll (không cần DevTools). Envelope: major sections move **~28–34px over ~0.7s**, Hero emphasis ~0.85s; stagger 60–110ms. Tokens in `motion/motion-tokens.ts` (`DURATION.section/emphasis/interaction`, `DISTANCE.section/emphasis`, `STAGGER`). Easing `--ease-out`.
- **`Reveal` primitive (`reveal.tsx`):** configurable `direction (up|left|right)` · `distance (30)` · `duration (0.72)` · `amount (0.22)` · optional `blur`. **once=true, no replay**, content in DOM from first render → **fast-scroll safe** (max ~0.7s to appear, never a 2s wait / never blank), re-entry keeps content readable (verified opacity stays 1), no Hero IntroCurtain replay. Trigger `amount:0.22` = fires when the element is actually visible (not near-zero early).
- **Per-section choreography (not one fade-up ×6):** **Hero** HIGH (portrait descends y−34/0.85s + kinetic name + staggered zones) · **About** MEDIUM (two halves **converge** — statement x−34, panel x+34; section `overflow-x-clip` guards mobile) · **Projects** MEDIUM (heading reveal → card stagger + hover lift) · **Career** LOW/MED (timeline scaleY draw → milestone stagger) · **Skills** MEDIUM (heading → **group-level** stagger 0.09, not per-tile) · **Contact** LOW/MED (staggered rise 26px, primary CTA emphasis) · **Footer** LOW · **Header** MICRO (capsule expand: opacity + grid-column).
- **Cross-section handoff (ambient recede):** `cosmic-background.tsx` (client, ONE IntersectionObserver on `#home`) lowers aurora opacity (1→0.5) once Hero scrolls away — decorative depth recedes so "focus moves forward"; **core text never hidden**. Reduced-motion → instant.
- **Reject list (from `MASTERSCROLL.md`):** reset:true replay · 2000ms reveals · near-zero-trigger · content→opacity 0 after leaving · blank-on-fast-scroll · scroll-jacking · section pinning · offscreen continuous loops.
- Strategic continuous motion: **Hero** (single faint orbital + backlight). CursorHalo = pointer-fine only. Projects/Skills/Career/Contact/Footer = no loop.
- **MUST honor `prefers-reduced-motion`** (`useReducedMotionSafe`, hydration-safe): content in final state immediately, no displacement/blur; nav labels usable; all functionality intact.

## 5. React Bits / 3D (§26–§27)
- Dùng: **BlurText** (`components/ui/blur-text.tsx`) ở Hero name. **0 component React Bits mới thêm** (CSS + `motion/react` đủ).
- Depth = CSS transform/perspective/glow/orbital, **không WebGL/Three**. Animation authority = `motion/react` (không `framer-motion`).

## 6. Cách nâng cấp lần sau
1. Đổi màu/thang chữ/nhịp → **`tokens.css`** (+ `globals.css` nếu thêm utility). Không sửa hex trong component.
2. Đổi 1 section → mở đúng owner file ở §2. Data-driven section: nội dung đến từ Neon/Admin, **không hardcode**.
3. Thêm motion → theo grammar §4, luôn gate reduced-motion.
4. QA: `node scripts/qa-screenshot.mjs <url> <out.png> [w] [h] [selector]` (output `.qa-shots/`, gitignored).

## 7. Trạng thái QA (cập nhật V1 — post-merge 2026-08-16)
- **V1 đã MERGE vào `main` + deploy Vercel Production** (`https://portfolio-van-tho.vercel.app`). Runtime smoke: `/vi`·`/en` 200, cả 6 anchor live, admin deny, no phone.
- **Hero**: QA desktop 1440 + mobile 390 — PASS (portrait + brand + typography), hiển thị tên/role thật (Hà Văn Thọ).
- **Contact**: PASS (GitHub fallback link; email primary khi có).
- **Populated-state QA (dữ liệu thật đã nhập qua Admin)**: PASS — **#about** (Giới thiệu) role/location · **#projects** Expense Tracker card (summary thật) · **#career** Education row (NTTU, 2022—nay; Experience đúng là vắng vì `PENDING_OWNER_EXPERIENCE_DETAILS`) · **#skills** 6 nhóm năng lực populate từ Neon. *(Cosmetic V2: vài skill tile hiện slug khi slug nằm ngoài technology-catalog.)*
- **Note lịch sử:** Focus/Principles/Articles đã gỡ khỏi landing (6-block IA); article domain + `/articles/[slug]` vẫn giữ.
