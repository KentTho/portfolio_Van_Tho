# PREMIUM PORTFOLIO — DESIGN BRIEF (Prompt 12R, Phase 2)

> **[STATUS 2026-08-16 — HISTORICAL / DESIGN REFERENCE]** File này là **nguồn định hướng visual & lịch sử
> discovery**, KHÔNG phải tracker trạng thái. **IA hiện hành (V1, đã ship Production) = 6 blocks**
> (`#home #about #projects #career #skills #contact`) — thẩm quyền IA/section-ownership hiện tại là
> **[`PUBLIC_LANDING_DESIGN_MAP.md`](PUBLIC_LANDING_DESIGN_MAP.md)**. Content hierarchy 9-section bên dưới
> (Focus/Principles/Articles) là **phương án discovery lịch sử** — Focus/Principles/Articles đã được gỡ khỏi
> landing ở V1. Giữ nguyên brief để tham chiếu palette/typography/motion/grid cho **`V2_PUBLIC_VISUAL_ENHANCEMENT`**.
>
> Language: cosmic engineering editorial, recruiter-first, premium interactive — KHÔNG effect showcase.
> Nguồn: 6 design sources + UI/UX Pro Max + Taste. Quyết định discovery đã khóa (xem §DEPENDENCY & §SIGNATURE).

## 1. IDENTITY
Van Tho — **Software Engineer** (Full-Stack · Backend · AI/Automation · Clean Architecture). Portfolio = bằng chứng năng lực kỹ thuật, tự nó là sản phẩm chứng minh kỹ năng.

## 2. TARGET AUDIENCE
Recruiter · Hiring Manager · Engineering Lead · Technical Founder · SE peers. **Recruiter-first**: quét nhanh giá trị + proof of work; đẹp nhưng không cản đọc.

## 3. BRAND PROMISE
"Kỹ sư có tư duy hệ thống, làm được Backend/Full-Stack/Data/Architecture, và đủ design-awareness để xây sản phẩm hoàn chỉnh."

## 4. VISUAL MOOD
Cinematic · editorial · technical · precise · spatial · premium · human. **Cosmic = depth/atmosphere/light/brand-geometry/controlled-motion** — KHÔNG neon overload, KHÔNG gaming/crypto/SaaS-template.

## 5. CONTENT HIERARCHY
Hero (identity+portrait+CTA) → About (bio+snapshot) → Focus (chuyên môn) → **Projects (credibility centerpiece)** → Experience+Education → Skills/Tech → Principles → Articles → Contact.

## 6. TYPOGRAPHY (Owner: giữ Syne + JetBrains Mono)
`Syne` display · `Inter` body · `JetBrains Mono` label/mono. Scale (theo quychuan, responsive desktop→mobile):
Hero 64/68→40/46 · H1 52/60→36/42 · H2 40/48→30/38 · H3 28/36→24/32 · Card 18/26 · Body-L 18/28 · Body 16/24 · Body-S 14/21 · Label/Caption 12/16 (mono, uppercase, tracking). Weight 600–800 display, 400 body, 500 label. **Tách bạch tiêu đề/phụ/nội dung; readability > effect.**

## 7. COLOR (logo authority — KHÓA)
Brand blue `#3b82f6`/soft `#6ba5ff` (accent tương tác chủ đạo) + gold `#e9a93e`/highlight `#fbe3a6` (nhấn premium tiết chế). Canvas `#050912`, surface/foreground/border theo `tokens.css`. **REJECT** palette xanh-lá/trắng của quychuan (template khác). WCAG-AA toàn bộ. Gold ≤ ~10% diện tích, chỉ ở focal (hero core, section counter, contact convergence).

## 8. GRID (theo quychuan, adapt)
Container **1200px** desktop (gutter 24px) / tablet 8-col (gutter 20px, pad 32) / mobile 4-col (gutter 16px, pad 20). Section padding 96/80/64 (desktop/tablet/mobile). Editorial asymmetry desktop; clarity-first mobile (recompose, KHÔNG scale desktop).

## 9. SPACING
Scale 4/8/12/16/20/24/32/40/48/64/80/96/120. Heading→desc 16–24 · desc→CTA 24–32 · header→grid 40 · card gap 24/20/16.

## 10. IMAGERY
Portrait thật `vantho.png` (Next/Image, blur placeholder, sizes, priority, không distortion, brand frame + fade-into-canvas). Brand geometry (orbital echo logo) SVG/CSS. **KHÔNG fake screenshot/metric/logo.** Tech logos = Neon/Admin authority (empty tới khi Owner nhập).

## 11. SECTION COMPOSITION + 12. MOTION SIGNATURE
| Section | Composition | Motion signature |
|---|---|---|
| Hero | Split 56/44, portrait + orbital depth, kinetic name | intro reveal → kinetic type → pointer-depth portrait → orbital drift (LEVEL 3) |
| About | Editorial sticky statement + fact rail | masked narrative reveal, scroll-emphasis (LEVEL 2) |
| Focus | Asymmetric capability field | spotlight-follow depth (LEVEL 2–3) |
| Projects | Tilt + spotlight case-study cards (Featured #1 lớn hơn) | perspective tilt + pointer-spotlight + hover depth (LEVEL 3) |
| Experience | Scroll-progress timeline | line-draw + milestone activation (LEVEL 2) |
| Skills | Spatial tech constellation (khi có data) | grid reveal + pointer logo-depth (LEVEL 2–3) |
| Principles | Large numbered kinetic statements | sequential type reveal + line progression (LEVEL 2) |
| Articles | Editorial masked list | staggered mask reveal (LEVEL 2) |
| Contact | Brand light convergence + magnetic CTA | glow convergence + magnetic pointer (LEVEL 2–3) |

## 13. SCROLL CHOREOGRAPHY (section-to-section continuity)
Background/lighting continuity qua `CosmicBackground` (aurora blue top → gold accent → grid), section handoff bằng hairline + depth-gradient (không separator ở mọi đoạn). Reveal **1× (không reset)**, duration 600–800ms, easing brand. Scroll mượt native, no CLS, no content-jump.

## 14. 3D / DEPTH
CSS transform/perspective + pointer-parallax + orbital geometry + layered glow (KHÔNG WebGL mặc định). Depth giữ perf/mobile/keyboard/reduced-motion.

## 15. CURSOR / POINTER (Owner: Cursor Halo)
Desktop cursor halo: vòng tròn theo pointer, spring/lag nhẹ, scale/opacity đổi khi hover CTA/project/logo, subtle blue/gold glow, **không che native cursor / không chiếm pointer-events / không lag**. Touch = OFF. reduced-motion = OFF hoặc static.

## 16. CTA SYSTEM (một intent một label)
Primary = "Xem dự án"→#projects (blue fill + magnetic). Secondary = "Liên hệ"→#contact (outline). Contact CTA = email/GitHub thật. Không duplicate intent, không wrap 2 dòng, contrast AA.

## 17. RESPONSIVE STRATEGY
Design riêng 1440/1024/768/390/320. Desktop full composition; tablet giảm depth/amplitude; mobile recompose + motion nhẹ + không pointer-dependent.

## 18. PERFORMANCE BUDGET
Next/Image + sizes + lazy below-fold; tránh CLS, video nặng, blur-stack, permanent loops thừa, client boundary thừa. Đo sau build. Signature interactions gate + lazy.

## 19. ACCESSIBILITY
`prefers-reduced-motion` → tắt parallax/loop/large-transform, content đọc ngay. focus-visible, keyboard, semantic headings, landmarks, alt, contrast AA, touch target ≥44px, mobile nav.

## 20. NEGATIVE CONSTRAINTS
Cấm: generic SaaS card grid · glassmorphism everywhere · same fade-up mọi section · AI purple/pink · neon/particle overload · 3D trang trí vô nghĩa · intro dài · animation chặn nội dung · hover-only UX · cursor che native · WebGL không mục đích · mobile = scaled desktop · fake tech/project/metric/experience/social.

## 21. TECHNICAL PLAN — DEPENDENCY DECISION (§23)
**Owner đã cho phép cả 3 tầng; kế hoạch perf-first, recruiter-first:**
- **motion/react (mặc định, KHÔNG cài mới):** đủ cho cursor halo, kinetic type, pointer-depth, magnetic CTA, cinematic intro, tilt+spotlight projects, scroll-reveal choreography, timeline. → **Build toàn bộ Prompt 12R bằng motion/react + CSS.**
- **GSAP + ScrollTrigger — APPROVED nhưng DEFERRED:** chỉ cài khi có **1 project case study thật** cần pinned storytelling (sau khi Owner nhập content + QA chứng minh motion/react không đủ). Không cài lúc này (Neon Dev rỗng project).
- **Three.js / R3F — APPROVED nhưng DEFERRED:** dành cho **1 signature 3D** (Hero HOẶC Skills) nếu CSS-depth chứng minh không đủ sau QA. Khuyến nghị: đạt "cosmic depth" bằng CSS/pointer-parallax trước; đánh giá R3F ở QA. Nếu dùng: dynamic import + lazy + reduced-motion static + mobile fallback CSS.
- **Impact nếu cài sau (báo trước khi install):** GSAP ~ +50KB gz (tree-shakeable, 1 section); R3F+three ~ +150KB gz (chỉ hero/skills, lazy, mobile-off). Cả hai lazy/dynamic, không vào initial bundle của các section khác.
- **React Bits:** 0–3, chỉ khi CSS/motion không giải quyết sạch (justify từng cái). Hiện: giữ BlurText (hoặc thay bằng kinetic type tự viết).

**One section = one owner file** (giữ `docs/ui/PUBLIC_LANDING_DESIGN_MAP.md`). Shared motion primitives → `src/components/public/motion/` (cursor-halo, reveal, stagger, pointer-tilt) chỉ khi ≥2 section dùng.

## 22. QA PLAN
Build theo waves (A global foundation → B header+hero → C about+focus → D projects → E experience+skills → F principles+articles → G contact+footer → H cross-section). Sau MỖI wave: dev → screenshot 1440/1024/768/390/320 · VI+EN → inspect (hierarchy/spacing/overflow/motion/pointer/keyboard/focus/reduced-motion/hydration) → fix → re-render → PASS → next. Audit theo `portfoliouxmotionaudit` guardrails. Validation: check:env/typecheck/lint/test/arch/build/e2e:public + admin regression. **Populated QA sau khi Owner nhập content** (Neon Dev đang rỗng — `PENDING_OWNER_CONTENT`). Cuối: Owner Visual Acceptance.

---
**DATA GATE:** Neon Dev = 1 profile rỗng, 0 published projects/articles/experiences/technologies. Build sẽ dùng **production empty states**; populated visual QA chờ Owner nhập qua Admin (không seed, không fake).
