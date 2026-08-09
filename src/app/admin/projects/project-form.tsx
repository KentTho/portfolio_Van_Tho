"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProjectAction, updateProjectAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, Select, SubmitButton, TextArea } from "@/app/admin/_components/form-ui";
import { PROJECT_VISIBILITIES, type AdminProjectAggregate } from "@/modules/projects/domain/project";

export interface TechOption {
  readonly id: string;
  readonly name: string;
}

const VISIBILITY_OPTIONS = PROJECT_VISIBILITIES.map((v) => ({ value: v, label: v }));

export function ProjectForm({
  aggregate,
  availableTechnologies,
}: {
  aggregate?: AdminProjectAggregate;
  availableTechnologies: readonly TechOption[];
}) {
  const editing = Boolean(aggregate);
  const [state, action] = useActionState(editing ? updateProjectAction : createProjectAction, idleState);
  const project = aggregate?.project;
  const vi = aggregate?.translations.find((t) => t.locale === "vi");
  const en = aggregate?.translations.find((t) => t.locale === "en");
  const selectedTech = new Set(aggregate?.technologies.map((t) => t.technologyId));

  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      {project ? <input type="hidden" name="rowVersion" value={project.rowVersion} /> : null}

      <div className="grid grid-cols-2 gap-4">
        <Field name="slug" label="Slug" defaultValue={project?.slug} required placeholder="portfolio-platform" />
        <Field name="category" label="Danh mục" defaultValue={project?.category ?? "software"} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select name="visibility" label="Hiển thị" defaultValue={project?.visibility ?? "private"} options={VISIBILITY_OPTIONS} />
        <Field name="role" label="Vai trò" defaultValue={project?.role ?? ""} placeholder="Lead Engineer" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="featuredOrder" label="Thứ tự nổi bật" type="number" defaultValue={project?.featuredOrder != null ? String(project.featuredOrder) : ""} />
        <div className="flex items-end">
          <Checkbox name="featured" label="Nổi bật" defaultChecked={project?.featured ?? false} />
        </div>
      </div>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">Tiếng Việt (bắt buộc)</legend>
        <div className="grid gap-3">
          <Field name="vi_title" label="Tiêu đề (vi)" defaultValue={vi?.title ?? ""} required />
          <Field name="vi_tagline" label="Tagline (vi)" defaultValue={vi?.tagline ?? ""} />
          <TextArea name="vi_summary" label="Tóm tắt (vi)" defaultValue={vi?.summary ?? ""} rows={3} />
        </div>
      </fieldset>
      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">English (tuỳ chọn)</legend>
        <div className="grid gap-3">
          <Field name="en_title" label="Title (en)" defaultValue={en?.title ?? ""} />
          <Field name="en_tagline" label="Tagline (en)" defaultValue={en?.tagline ?? ""} />
          <TextArea name="en_summary" label="Summary (en)" defaultValue={en?.summary ?? ""} rows={3} />
        </div>
      </fieldset>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">Công nghệ</legend>
        {availableTechnologies.length === 0 ? (
          <p className="text-sm text-fg-subtle">Chưa có công nghệ nào. Thêm ở mục Công nghệ.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {availableTechnologies.map((tech) => (
              <label key={tech.id} className="flex items-center gap-2 text-sm text-fg-muted">
                <input type="checkbox" name="technologyId" value={tech.id} defaultChecked={selectedTech.has(tech.id)} className="h-4 w-4 rounded border-border" />
                {tech.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <p className="text-xs text-fg-subtle">
        Liên kết, chỉ số và các mục nội dung dài được giữ nguyên khi lưu (quản lý riêng ở bản nâng cấp sau).
      </p>
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu bản nháp" : "Tạo dự án"}</SubmitButton>
        <Link href="/admin/projects" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
