"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createEducationAction, updateEducationAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton } from "@/app/admin/_components/form-ui";
import type { Education } from "@/modules/career/domain/career";

export function EducationForm({ education }: { education?: Education }) {
  const editing = Boolean(education);
  const [state, action] = useActionState(editing ? updateEducationAction : createEducationAction, idleState);
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      {education ? <input type="hidden" name="id" value={education.id} /> : null}
      {education ? <input type="hidden" name="rowVersion" value={education.rowVersion} /> : null}
      <Field name="institution" label="Cơ sở đào tạo" defaultValue={education?.institution} required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="degree" label="Bằng cấp" defaultValue={education?.degree ?? ""} />
        <Field name="fieldOfStudy" label="Chuyên ngành" defaultValue={education?.fieldOfStudy ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="startDate" label="Bắt đầu" type="date" defaultValue={education?.startDate ?? ""} />
        <Field name="endDate" label="Kết thúc" type="date" defaultValue={education?.endDate ?? ""} />
      </div>
      <Field name="url" label="Website" type="url" defaultValue={education?.url ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <Field name="sortOrder" label="Thứ tự" type="number" defaultValue={String(education?.sortOrder ?? 0)} />
        <div className="flex items-end gap-4">
          <Checkbox name="isCurrent" label="Đang học" defaultChecked={education?.isCurrent ?? false} />
          <Checkbox name="isVisible" label="Hiển thị" defaultChecked={education?.isVisible ?? true} />
        </div>
      </div>
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo học vấn"}</SubmitButton>
        <Link href="/admin/education" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
