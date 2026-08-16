import "server-only";
import { getCurrentAdmin } from "@/composition/identity";
import { isErr, type Result } from "@/shared/domain/result";
import type { AdminUser } from "@/modules/identity/domain/entities/admin-user";
import { failure, type FormState } from "@/app/admin/_lib/form-state";

/**
 * Run an admin Server Action body with the resolved admin. Deny-by-default: an unauthenticated
 * request never reaches the use-case. Any thrown error becomes a safe generic failure (no raw
 * DB exception leaks to the client).
 */
export async function withAdminAction(
  run: (admin: AdminUser) => Promise<FormState>,
): Promise<FormState> {
  const admin = await getCurrentAdmin();
  if (!admin) return failure("Bạn cần đăng nhập lại để tiếp tục.", "FORBIDDEN");
  try {
    return await run(admin);
  } catch {
    return failure("Đã xảy ra lỗi máy chủ. Vui lòng thử lại.", "SERVER_ERROR");
  }
}

/** Map a domain Result error to a FormState failure carrying its typed code. */
export function fromResultError<T, E extends { code: string; message: string }>(
  result: Result<T, E>,
): FormState {
  if (isErr(result)) {
    return { status: "error", message: result.error.message, code: result.error.code };
  }
  return failure("Unexpected success mapped as error");
}
