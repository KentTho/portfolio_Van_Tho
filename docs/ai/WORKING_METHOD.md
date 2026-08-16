# Cách làm việc khi nhận Prompt — portfolio_Van_Tho

> Tài liệu quy trình (tiếng Việt). Tổng hợp **cách AI xử lý mỗi Prompt** và **toàn bộ tiêu chí,
> nguyên tắc, luật lệ** Owner đã ban hành. Áp dụng cho **mọi phiên**, mọi Wave.
> Thẩm quyền gốc vẫn là `CLAUDE.md` (§1–§27) + các ADR — file này chỉ **tóm tắt để thi hành**,
> không tạo thẩm quyền mới. Khi mâu thuẫn: `CLAUDE.md`/ADR thắng (`PROJECT_AUTHORITY_WINS`).

---

## 0. Nguyên tắc tối cao

1. **ACTUAL_SOURCE_WINS / ACTUAL_GIT_STATE_WINS** — luôn kiểm chứng trạng thái *thực* của repo/DB/Git
   trước khi tin báo cáo cũ hay trí nhớ. Không tái tạo từ trí nhớ.
2. **Evidence-first** — không tuyên bố PASS/DONE/100% nếu không có output lệnh từ baseline hiện tại.
   Nêu rõ suite nào bị bỏ qua và ai là chủ sở hữu bằng chứng.
3. **Deny by default / Fail closed** — bảo mật & phân quyền mặc định từ chối; kiểm tra ở server.
4. **STOP là kết quả an toàn** — không tự ghi đè một điều kiện `STOP_*`.

---

## 1. Vòng lặp thực thi mỗi Prompt (Karpathy — §27 CLAUDE.md)

```
THINK  → tối đa ~5 gạch đầu dòng; soi đúng thẩm quyền; xác định 1 cổng thành công (success gate)
VERIFY → kiểm chứng trạng thái thực (git/DB/file) trước khi đụng vào
SMALLEST CHANGE → thay đổi nhỏ nhất giải quyết *đúng gốc rễ*
NARROW TEST → test hẹp chứng minh thay đổi
FULL TEST → chạy full validation matrix
COMMIT → exact-path staging, Conventional Commits
PUSH → feature branch, verify remote == local
CONTINUE
```

- **Think before coding:** không phỏng đoán; nêu mâu thuẫn; trình bày tradeoff; **bối rối thì hỏi**, không đoán.
- **Simplicity first:** lượng code tối thiểu; không trừu tượng hoá đầu cơ; không thêm framework/authority trùng.
- **Surgical changes:** đúng path; không format toàn cục; không dọn/refactor ngoài phạm vi; không xoá code cũ mình chưa hiểu.
- **Goal-driven:** định nghĩa tiêu chí thành công trước; reproduce-before-fix; thêm test chứng minh; lặp tới khi có bằng chứng thật.
- **Self-healing:** lỗi thường (TypeScript/lint/test/build/routing/wiring) tự sửa theo `FAIL → ROOT_CAUSE →
  SMALLEST_SAFE_FIX → NARROW_VERIFY → FULL_VERIFY → CONTINUE`. Chỉ dừng khi gốc rễ không thể sửa an toàn.

## 1b. Luật hỏi làm rõ đầu phiên (§27 — Owner ban hành, thường trực)

Đầu mỗi phiên và **trước mọi mutation lớn/mơ hồ**: hỏi Owner câu hỏi làm rõ, **kèm phương án cụ thể**
theo kế hoạch/Wave, luôn cho phép "Other". **Không tự chọn** trên các quyết định đổi: phạm vi, chiến
lược nhánh, mức phơi nhiễm production, hay mô hình dữ liệu.

---

## 2. Kiến trúc & ranh giới phụ thuộc (§3–§10)

- Modular monolith feature-first trên Next.js App Router + Clean Architecture.
- `presentation → application → domain`; `infrastructure` hiện thực ports; composition roots ráp nối.
- `domain/` **không** import framework/provider/`process.env`/React/Node fs/UI.
- `presentation/` gọi **composition roots**, **không bao giờ chạm Drizzle trực tiếp**.
- Server Components mặc định; `"use client"` chỉ khi cần tương tác. Server Actions cho mutation tin cậy;
  Route Handlers cho contact/auth-callback/signed-upload/health/webhook.
- Không import module server-only (DB client, secret env, service key) vào client. `NEXT_PUBLIC_*` chỉ cho
  giá trị an toàn ở browser. Response công khai không lộ session Admin/draft/URL riêng tư.
- Enforce bằng `pnpm test:architecture` + ESLint import rules + dependency-cruiser.

---

## 3. Dữ liệu · Migration · Auth · Storage (§11–§14)

- **Neon PostgreSQL** = primary DB duy nhất (Drizzle). UUID PK, `timestamptz`, enums/checks, FK trong Neon.
  Public repository **không bao giờ** trả draft/private/unlisted. Multi-table write dùng transaction/`db.batch`.
- **Migration forward-only**; không `db push`/migrate huỷ diệt lúc khởi động; không migrate lên DB shared/prod.
- **Auth:** Supabase GitHub OAuth cho Admin. Quyền = allow-list (`ADMIN_ALLOWED_EMAILS`) +
  `app_users.role=owner_admin` + `status=active`, kiểm ở server. Không đăng ký admin công khai.
  Không thêm authority auth thứ hai; không hardcode credentials.
- **Storage:** Supabase; `portfolio-public` vs `portfolio-private` (signed URL). Server kiểm role+bucket+path
  +MIME+size trước khi cấp signed upload; không tin filename gốc; SVG mặc định cấm; service key không ra browser.

---

## 4. Bảo mật & bí mật (§15, §20)

- Validate mọi input biên bằng schema (Zod). Sanitize markdown render (no raw HTML/`js:`/`data:`), CSP,
  CSRF origin check, rate limit, Turnstile cho contact, log đã redact.
- **Không đọc/in/copy/report giá trị bí mật thật**; không `cat`/`type`/`Get-Content` `.env*`.
- Không stage bất kỳ file env; `.env.local` phải gitignored/untracked.
- Không log token/cookie/password/DB URL/service key/auth header. Che định danh (email/UID) trong bằng chứng.

---

## 5. Git & an toàn thay đổi (§18, §19, §25)

- pnpm; Node ghim theo `.node-version`. Branch theo Wave. Conventional Commits.
- **Stage đúng path:** `git add -- <path>`. **KHÔNG** `git add .`/`-A`/`commit -a`.
- **Cấm nếu chưa được duyệt từng-lần:** force push, rewrite history, `reset --hard`, `clean`, `stash`,
  `rebase`, `merge`, `cherry-pick`, `amend`, xoá remote branch/tag, đổi visibility/secret/branch-protection,
  merge PR, deploy prod, đổi DNS/domain, migrate DB prod.
- Sau khi có `main`: mọi thay đổi qua feature branch + PR. AI dừng ở
  `PR_READY_FOR_HUMAN_REVIEW_AND_MERGE`; người merge.
- **Scope lock (§19):** trước mutation, khai báo `CURRENT_WAVE`, path add/modify/delete, protected paths,
  out-of-scope, kế hoạch validate. Path ngoài phạm vi → `STOP_SCOPE_EXPANSION_REQUIRES_REVIEW`.

---

## 6. TypeScript & chất lượng code (§8, §25, "Code quality")

- `strict: true` (+ `noUncheckedIndexedAccess`). Không `any` vô cớ; không assertion không an toàn ở biên.
- Ưu tiên **suy luận kiểu**; suy ra runtime type từ Zod `z.infer` (single source of truth).
- Domain thuần; error type tường minh (không throw string); không side effect ẩn; không provider SDK trong domain;
  không `utils.ts` bãi rác; không circular deps; không trừu tượng đầu cơ; comment giải thích *tại sao*, không mô tả cú pháp.
- **Không** `@ts-ignore`/`@ts-nocheck`; **không** làm yếu test/strictness/security/git-safety để lấy "xanh".

---

## 7. Chính sách Skill (§26) & kỷ luật Karpathy (§27)

- Skill README ngoài (mattpocock/Cline/Kilo/Karpathy/…) = **tư vấn**, không phải luật thực thi. Governance & ADR thắng.
- Skill chỉ kích hoạt cho task liên quan của Wave hiện tại (đọc `docs/skills/WAVE_SKILL_MAP.md`).
- **Không chạy lệnh cài plugin/CLI** từ README nếu chưa review an toàn. Không `curl|bash` script từ xa.
- Nguồn license không rõ → `LOCAL_REFERENCE_ONLY` (giữ untracked, không copy vào docs tracked).

---

## 8. Non-goals (§2) — điều KHÔNG làm

- Không phức tạp trang trí (animation thừa, badge-stuffing, layer "enterprise" giả).
- Không bịa nội dung: không metric/testimonial/khách hàng/kết quả/bằng cấp/công ty (đặc biệt **không BBOTech**) nếu không có bằng chứng.
- Không dữ liệu bảo mật bên thứ ba. Không tài khoản người dùng công khai ở V1.
- Không dịch vụ non-cần thiết ở V1 (Redis/Kafka/k8s/microservice/GraphQL/realtime/FastAPI/Django).

---

## 9. Định dạng bằng chứng & handoff (§21, §22, §24)

- Báo cáo Wave theo format 37 mục; không "DONE/100%/production-ready" nếu không có bằng chứng lệnh.
- Đầu phiên chỉ đọc: `CLAUDE.md`, `docs/ai/PROJECT_STATE.md`, `CURRENT_SCOPE.md`, `NEXT_PHASE.md`, ADR liên quan,
  file Wave hiện tại, trạng thái Git. Không đọc lại toàn repo mỗi lượt.
- Cập nhật `docs/ai/HANDOFF.md` tại ranh giới an toàn trước khi kết phiên.
- **Definition of Done/Wave:** validate local PASS (output thật) · commit đúng · push & verify remote ·
  PR mở (khi có main) · CI xanh (từ Wave 07) · không secret · không đụng protected path · không overclaim.
  Năng lực tiến từng bậc L0→L7, không nhảy cóc.

---

## 10. Checklist rút gọn mỗi lượt

- [ ] Đã VERIFY trạng thái thực (git `rev-parse`/`status`, DB, file) trước khi đụng?
- [ ] Thay đổi có **surgical** & trong scope không? Đã khai báo scope nếu mutation lớn?
- [ ] Quyết định đổi scope/branch/prod/data-model → đã **hỏi Owner kèm phương án** (§27)?
- [ ] Domain sạch? Presentation không chạm Drizzle? Deny-by-default?
- [ ] Không secret bị đọc/log/stage? `git add -- <path>` đúng, không `add .`?
- [ ] Validation matrix chạy thật, có output? Không làm yếu test?
- [ ] Không overclaim; nêu rõ phần PENDING_OPERATOR + thao tác chính xác?
- [ ] Đã tôn trọng mọi `STOP_*`?

---

### Phụ lục — Ma trận trạng thái thường dùng

`PENDING_OPERATOR` (cần thao tác người, kèm 1 lệnh/hành động chính xác) ·
`PENDING_INTERACTIVE` (cần đăng nhập tương tác) ·
`STOP_SCOPE_EXPANSION_REQUIRES_REVIEW` · `PROJECT_AUTHORITY_WINS` ·
`ACTUAL_SOURCE_WINS` / `ACTUAL_GIT_STATE_WINS` · `PR_READY_FOR_HUMAN_REVIEW_AND_MERGE`.
