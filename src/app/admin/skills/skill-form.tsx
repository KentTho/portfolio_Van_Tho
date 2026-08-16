"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createSkillAction, updateSkillAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton, TextArea } from "@/app/admin/_components/form-ui";
import type { Skill } from "@/modules/skills/domain/skill";

export function SkillForm({ skill }: { skill?: Skill }) {
  const editing = Boolean(skill);
  const [state, action] = useActionState(editing ? updateSkillAction : createSkillAction, idleState);
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      {skill ? <input type="hidden" name="id" value={skill.id} /> : null}
      <Field name="slug" label="Slug" defaultValue={skill?.slug} required placeholder="typescript" />
      <Field name="name" label="Tên" defaultValue={skill?.name} required placeholder="TypeScript" />
      <Field name="category" label="Nhóm" defaultValue={skill?.category ?? "general"} />
      <Field name="proficiencyLabel" label="Mức độ" defaultValue={skill?.proficiencyLabel ?? ""} placeholder="Thành thạo" />
      <TextArea name="evidenceText" label="Bằng chứng" defaultValue={skill?.evidenceText ?? ""} />
      <Field name="displayOrder" label="Thứ tự hiển thị" type="number" defaultValue={String(skill?.displayOrder ?? 0)} />
      <Checkbox name="isVisible" label="Hiển thị công khai" defaultChecked={skill?.isVisible ?? true} />
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo kỹ năng"}</SubmitButton>
        <Link href="/admin/skills" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
