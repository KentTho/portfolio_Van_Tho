"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createExperienceAction, updateExperienceAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton, TextArea } from "@/app/admin/_components/form-ui";
import type { AdminExperienceAggregate } from "@/modules/career/domain/career";

export function ExperienceForm({ aggregate }: { aggregate?: AdminExperienceAggregate }) {
  const editing = Boolean(aggregate);
  const [state, action] = useActionState(editing ? updateExperienceAction : createExperienceAction, idleState);
  const exp = aggregate?.experience;
  const vi = aggregate?.translations.find((t) => t.locale === "vi");
  const en = aggregate?.translations.find((t) => t.locale === "en");

  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-4">
      {exp ? <input type="hidden" name="id" value={exp.id} /> : null}
      {exp ? <input type="hidden" name="rowVersion" value={exp.rowVersion} /> : null}

      <Field name="organization" label="Tổ chức" defaultValue={exp?.organization} required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="employmentType" label="Hình thức" defaultValue={exp?.employmentType ?? ""} placeholder="full-time" />
        <Field name="location" label="Địa điểm" defaultValue={exp?.location ?? ""} />
      </div>
      <Field name="url" label="Website" type="url" defaultValue={exp?.url ?? ""} />
      <div className="grid grid-cols-2 gap-4">
        <Field name="startDate" label="Bắt đầu" type="date" defaultValue={exp?.startDate ?? ""} required />
        <Field name="endDate" label="Kết thúc" type="date" defaultValue={exp?.endDate ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="sortOrder" label="Thứ tự" type="number" defaultValue={String(exp?.sortOrder ?? 0)} />
        <div className="flex items-end gap-4">
          <Checkbox name="isCurrent" label="Hiện tại" defaultChecked={exp?.isCurrent ?? false} />
          <Checkbox name="isVisible" label="Hiển thị" defaultChecked={exp?.isVisible ?? true} />
        </div>
      </div>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">Tiếng Việt (bắt buộc)</legend>
        <div className="grid gap-3">
          <Field name="vi_title" label="Chức danh (vi)" defaultValue={vi?.title ?? ""} required />
          <TextArea name="vi_summary" label="Mô tả (vi)" defaultValue={vi?.summary ?? ""} rows={3} />
        </div>
      </fieldset>
      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">English (tuỳ chọn)</legend>
        <div className="grid gap-3">
          <Field name="en_title" label="Title (en)" defaultValue={en?.title ?? ""} />
          <TextArea name="en_summary" label="Summary (en)" defaultValue={en?.summary ?? ""} rows={3} />
        </div>
      </fieldset>

      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo kinh nghiệm"}</SubmitButton>
        <Link href="/admin/experience" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
