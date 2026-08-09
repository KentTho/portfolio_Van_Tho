"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTechnologyAction, updateTechnologyAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, Select, SubmitButton } from "@/app/admin/_components/form-ui";
import { TECHNOLOGY_CATEGORIES, type Technology } from "@/modules/technologies/domain/technology";

const CATEGORY_OPTIONS = TECHNOLOGY_CATEGORIES.map((c) => ({ value: c, label: c }));

export function TechnologyForm({ technology }: { technology?: Technology }) {
  const editing = Boolean(technology);
  const [state, action] = useActionState(
    editing ? updateTechnologyAction : createTechnologyAction,
    idleState,
  );
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      {technology ? <input type="hidden" name="id" value={technology.id} /> : null}
      <Field name="slug" label="Slug" defaultValue={technology?.slug} required placeholder="next-js" />
      <Field name="name" label="Tên" defaultValue={technology?.name} required placeholder="Next.js" />
      <Select
        name="category"
        label="Nhóm"
        defaultValue={technology?.category ?? "frontend"}
        options={CATEGORY_OPTIONS}
      />
      <Field name="deviconKey" label="Devicon key" defaultValue={technology?.deviconKey ?? ""} placeholder="nextjs" />
      <Field name="brandColor" label="Màu thương hiệu (#rrggbb)" defaultValue={technology?.brandColor ?? ""} placeholder="#000000" />
      <Field name="website" label="Website" type="url" defaultValue={technology?.website ?? ""} placeholder="https://nextjs.org" />
      <Field name="sortOrder" label="Thứ tự" type="number" defaultValue={String(technology?.sortOrder ?? 0)} />
      <Checkbox name="isVisible" label="Hiển thị công khai" defaultChecked={technology?.isVisible ?? true} />
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo công nghệ"}</SubmitButton>
        <Link href="/admin/technologies" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
