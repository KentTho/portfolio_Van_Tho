"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCertificationAction, updateCertificationAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton } from "@/app/admin/_components/form-ui";
import type { Certification } from "@/modules/career/domain/career";

export function CertificationForm({ certification }: { certification?: Certification }) {
  const editing = Boolean(certification);
  const [state, action] = useActionState(
    editing ? updateCertificationAction : createCertificationAction,
    idleState,
  );
  const c = certification;
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      {c ? <input type="hidden" name="id" value={c.id} /> : null}
      {c ? <input type="hidden" name="rowVersion" value={c.rowVersion} /> : null}
      <div className="grid grid-cols-2 gap-4">
        <Field name="name" label="Tên chứng chỉ" defaultValue={c?.name} required />
        <Field name="issuer" label="Đơn vị cấp" defaultValue={c?.issuer} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="issueDate" label="Ngày cấp" type="date" defaultValue={c?.issueDate ?? ""} />
        <Field name="expiryDate" label="Ngày hết hạn" type="date" defaultValue={c?.expiryDate ?? ""} />
      </div>
      <Field name="credentialId" label="Mã chứng chỉ" defaultValue={c?.credentialId ?? ""} />
      <Field name="credentialUrl" label="Đường dẫn xác thực" type="url" defaultValue={c?.credentialUrl ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <Field name="sortOrder" label="Thứ tự" type="number" defaultValue={String(c?.sortOrder ?? 0)} />
        <div className="flex items-end">
          <Checkbox name="isVisible" label="Hiển thị" defaultChecked={c?.isVisible ?? true} />
        </div>
      </div>
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo chứng chỉ"}</SubmitButton>
        <Link href="/admin/certifications" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
