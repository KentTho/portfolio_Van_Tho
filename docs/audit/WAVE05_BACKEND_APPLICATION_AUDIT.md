# Kiểm toán Backend Application — Wave 05 (CMS Foundation)

> Báo cáo kiểm toán chéo toàn bộ tầng Application backend của Wave 05.
> Phạm vi: **chỉ backend** (không Admin UI, không auth trực tiếp, không Preview, không production).
> Cơ sở dữ liệu mục tiêu: **Neon Development**. Không migration mới trong lượt này (schema G1–G5 đã áp dụng, ledger = 6).

**Nhánh:** `feat/wave-05-cms-foundation` · **HEAD:** `1d7a9f1` · **Ngày:** 2026-08-09

---

## 1. Kết luận

**`BACKEND_APPLICATION_FOUNDATION_DEV_VERIFIED`** — toàn bộ năng lực nội dung backend đã được
kiểm chứng trên Neon Development với bằng chứng thực (offline matrix + live smoke), commit từng
phần theo đúng exact-path, không rò rỉ bí mật, không thay đổi ngoài phạm vi.

Giai đoạn kế tiếp (KHÔNG thực hiện trong lượt này): **ADMIN_FUNCTIONAL_CMS_COMPLETION**.

---

## 2. Ma trận năng lực theo module

| Nhóm | Module | Ghi/Đọc | Cơ chế then chốt | Đơn vị test | Live smoke (Neon Dev) | Commit |
|---|---|---|---|---|---|---|
| G1 | shared taxonomy (tags) | write + đọc công khai | slug-unique, soft-delete, audit | ✅ | (qua articles) | `40663cd`/`83da432` |
| G1B | technologies | CRUD + visibility | slug-unique, audit, no-clobber | ✅ | (qua projects) | `c33b830` |
| G2b | projects | write + đọc công khai | batch tx nguyên tử, row_version, published-only | ✅ | ✅ `projects-writeside` | `85c1222` |
| G3 | articles | write + đọc công khai | batch tx, row_version, publish state, tag RESTRICT | ✅ | ✅ `articles-writeside` | `10fc20f` |
| G4 | career (experiences/education/certifications) | write + đọc công khai | batch tx (exp+translations), row_version, soft-delete, visible-only | ✅ | ✅ `career-writeside` | `78a1006` |
| G4 | profile (singleton) | get + upsert | upsert khoá "primary", audit | ✅ | ✅ `owner-settings-writeside` | `0657732` |
| G4 | skills | CRUD | slug-unique, visible-only, audit | ✅ | ✅ `owner-settings-writeside` | `0657732` |
| G4 | site-settings | KV get/upsert/delete | gate `settings.write`, public chỉ khi `is_public` | ✅ | ✅ `owner-settings-writeside` | `0657732` |
| G5 | revisions | append-only snapshot | version = max+1, bất biến, preview không đột biến | ✅ | ✅ `revisions-writeside` | `cf165c0` |
| — | public read model | đọc công khai hợp nhất | chỉ published/visible/public/non-deleted | — | ✅ `public-read-model` | `1d7a9f1` |

---

## 3. Bất biến kiến trúc (kiểm chứng chéo)

| Bất biến | Trạng thái | Bằng chứng |
|---|---|---|
| Không rò rỉ bản nháp (draft) ra công khai | ✅ | smoke projects/articles: draft không xuất hiện trước publish |
| Không rò rỉ bản lưu trữ/xoá mềm | ✅ | smoke articles/career: sau archive/soft-delete biến mất khỏi public |
| Giao dịch nguyên tử đa bảng | ✅ | `db.batch` (neon-http tx); smoke FK-restrict rollback (projects/articles) |
| Đồng thời lạc quan (optimistic concurrency) | ✅ | `row_version` WHERE điều kiện; smoke "stale" bị từ chối |
| Ghi audit khi thành công | ✅ | mọi use-case ghi `AuditLogPort`; test đơn vị xác nhận action |
| Tách bạch revisions ↔ audit_logs | ✅ | snapshot ở content_revisions; audit chỉ ghi who/when, không chứa payload |
| Kiểm tra biên (Zod) mọi input | ✅ | schema create/update no-clobber; RFC-uuid, ISO date, email, kebab slug |
| domain không import framework/infra | ✅ | `pnpm test:architecture` 10/10 xanh |
| Không có bí mật trong patch | ✅ | secret-scan mỗi commit; không stage file `.env*` |

---

## 4. Bằng chứng kiểm thử (baseline hiện tại)

| Lệnh | Kết quả |
|---|---|
| `pnpm typecheck` | ✅ sạch (tsc --noEmit) |
| `pnpm lint` | ✅ sạch (eslint, 0 warning) |
| `pnpm test` (offline) | ✅ 159 passed · 6 skipped (smoke có cổng) · 26 files |
| `pnpm test:architecture` | ✅ 10 passed |
| `pnpm build` | ✅ Next.js production build thành công |
| Live smokes (`RUN_DB_SMOKE=1`, Neon Dev) | ✅ 6 files · 12 tests passed; fixtures dọn sạch |

---

## 5. Hạng mục còn lại (ngoài phạm vi backend-only)

| Hạng mục | Trạng thái | Lý do hoãn |
|---|---|---|
| Contact inbox backend | ⏸ HOÃN | Là biên public-write bảo mật (Turnstile, rate-limit, IP-hash — CLAUDE.md §15), thuộc Wave tích hợp/bảo mật, không phải năng lực nội dung CMS. Không dựng hạ tầng bảo mật đầu cơ. |
| Admin Functional CMS UI | ⏸ GIAI ĐOẠN SAU | Owner chốt lượt này chỉ backend |
| Live owner auth (app_users bootstrap) | ⏸ GIAI ĐOẠN SAU | Owner đã đăng nhập GitHub OAuth; seed để lượt Admin/Auth |
| Vercel Preview E2E | ⏸ PENDING_OPERATOR | Cần thao tác viên deploy; AI không deploy production/preview |

---

## 6. Trạng thái DB (chỉ đọc, không đột biến trong lượt này)

- Neon **Development**; ledger migration = **6** (`0000`–`0005`); 25 bảng chuẩn.
- Lượt này **không** tạo/áp dụng migration (schema G3/G4/G5 đã verified từ trước; không có drift).
- Mọi fixture smoke đã bị xoá sau khi chạy (kiểm chứng bằng truy vấn đếm còn lại = 0).

---

## 7. Chứng minh Git

Chuỗi commit durable trên `feat/wave-05-cms-foundation` (local == remote sau mỗi push):

```
83da432 tags write-side (nền tảng)
10fc20f feat(articles): group 3 backend + public read
78a1006 feat(career): group 4 backend + public read
0657732 feat(owner-settings): profile + skills + site-settings (group 4)
cf165c0 feat(revisions): group 5 content revision backend
1d7a9f1 feat(public-read): consolidate public Neon read model
```

Staging exact-path; không `git add .`/`-A`/`commit -a`; không force-push/rewrite.
