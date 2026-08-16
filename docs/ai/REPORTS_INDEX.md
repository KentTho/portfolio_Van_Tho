# 📍 Bản đồ báo cáo & tài liệu — portfolio_Van_Tho

> Owner đọc file này để biết **báo cáo/tiến độ nằm ở đâu**. Mỗi file có một vai trò rõ ràng;
> không trùng lặp. Tất cả cập nhật ở ranh giới an toàn cuối mỗi phiên/Wave.

## 1. Tiến độ & trạng thái hiện tại (đọc trước)

| File | Trả lời câu hỏi | Nhịp cập nhật |
|---|---|---|
| **[`ROADMAP.md`](../../ROADMAP.md)** | Bức tranh tổng: snapshot nhánh/HEAD, bảng Wave, dependency rebase, capability levels | Cuối mỗi Wave |
| **[`docs/ai/PROJECT_STATE.md`](PROJECT_STATE.md)** | "Sự thật đã xác minh" hiện tại: machine state, quyết định Owner đã chốt | Cuối mỗi Wave |
| **[`docs/status/STACK_PROGRESS.md`](../status/STACK_PROGRESS.md)** | % theo từng lớp (Infra/DB/BE/Admin/Public) + gap + next unlock | Cuối mỗi Wave |
| **[`docs/ai/HANDOFF.md`](HANDOFF.md)** | Nhật ký bàn giao: mỗi phiên làm gì, còn gì PENDING_OPERATOR | Cuối mỗi phiên |

## 2. Hiểu toàn hệ thống & luồng xử lý

| File | Nội dung |
|---|---|
| **[`docs/architecture/PROJECT_UNDERSTANDING.md`](../architecture/PROJECT_UNDERSTANDING.md)** | **Knowledge map** (áp dụng phương pháp *Understand-Anything* natively): node/edge của toàn bộ module, use-case, port, repo; layer graph; luồng hạ tầng + dữ liệu; quy trình nghiệp vụ; "guided tours" để đọc code |
| **[`docs/architecture/SYSTEM_MAP.md`](../architecture/SYSTEM_MAP.md)** | Sơ đồ Mermaid: topology hạ tầng · Clean Architecture · **ERD 25 bảng** · luồng đọc công khai · luồng ghi admin · luồng auth/bootstrap · báo cáo DB theo module. Có legend `[TARGET]` vs `[LIVE]` |
| **[`docs/architecture/`](../architecture/)** | Chi tiết kiến trúc + `adr/` (Architecture Decision Records) + `dependency-rules.md` |

## 3. Kiểm toán chuyên sâu (bằng chứng)

| File | Nội dung |
|---|---|
| [`docs/audit/WAVE05_DATABASE_CONTRACT.md`](../audit/WAVE05_DATABASE_CONTRACT.md) | Hợp đồng DB Wave-05 (G1–G5), constraint, ledger |
| [`docs/audit/WAVE05_BACKEND_APPLICATION_AUDIT.md`](../audit/WAVE05_BACKEND_APPLICATION_AUDIT.md) | Kiểm toán tầng application backend |
| [`docs/audit/INFRA_DEV_PREVIEW_SUBSTRATE.md`](../audit/INFRA_DEV_PREVIEW_SUBSTRATE.md) | Substrate hạ tầng Dev/Preview |

## 4. Quy trình & luật lệ

| File | Nội dung |
|---|---|
| **[`CLAUDE.md`](../../CLAUDE.md)** | Hợp đồng governance §1–§27 (thẩm quyền gốc — HOW we build) |
| **[`docs/ai/WORKING_METHOD.md`](WORKING_METHOD.md)** | Cách AI xử lý mỗi Prompt + tổng hợp mọi tiêu chí/nguyên tắc/luật |
| [`docs/ai/DECISION_LOG.md`](DECISION_LOG.md) | Nhật ký quyết định (D-xxx) |
| [`docs/skills/`](../skills/) | Chính sách áp dụng skill (matrix, conflict register, wave map) |

## 5. Báo cáo cuối mỗi phiên nằm ở đâu?

Báo cáo tổng kết (verdict, % tiến độ, việc còn lại) được ghi **trực tiếp trong tin nhắn trả lời**
của phiên đó, **và** cô đọng vào `HANDOFF.md` (mục "Completed" mới nhất) + cập nhật `PROJECT_STATE.md`.
Không có file "report_YYYYMMDD" rời rạc — để tránh phân mảnh, trạng thái luôn hội tụ về 4 file ở Mục 1.

---
*Cập nhật: nhánh `integration/pre-fe-foundation` @ `a086c84`.*
