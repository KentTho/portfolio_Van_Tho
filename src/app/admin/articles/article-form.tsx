"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createArticleAction, updateArticleAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton, TextArea } from "@/app/admin/_components/form-ui";
import type { AdminArticleAggregate } from "@/modules/articles/domain/article";

export interface TagOption {
  readonly id: string;
  readonly name: string;
}

export function ArticleForm({
  aggregate,
  availableTags,
}: {
  aggregate?: AdminArticleAggregate;
  availableTags: readonly TagOption[];
}) {
  const editing = Boolean(aggregate);
  const [state, action] = useActionState(editing ? updateArticleAction : createArticleAction, idleState);
  const article = aggregate?.article;
  const vi = aggregate?.translations.find((t) => t.locale === "vi");
  const en = aggregate?.translations.find((t) => t.locale === "en");
  const selectedTags = new Set(aggregate?.tags.map((t) => t.tagId));

  return (
    <form action={action} className="mt-6 grid max-w-2xl gap-4">
      {article ? <input type="hidden" name="id" value={article.id} /> : null}
      {article ? <input type="hidden" name="rowVersion" value={article.rowVersion} /> : null}

      <Field name="slug" label="Slug" defaultValue={article?.slug} required placeholder="clean-architecture-notes" />
      <Checkbox name="featured" label="Nổi bật" defaultChecked={article?.featured ?? false} />

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">Tiếng Việt (bắt buộc)</legend>
        <div className="grid gap-3">
          <Field name="vi_title" label="Tiêu đề (vi)" defaultValue={vi?.title ?? ""} required />
          <Field name="vi_summary" label="Tóm tắt (vi)" defaultValue={vi?.summary ?? ""} />
          <TextArea name="vi_bodyMd" label="Nội dung Markdown (vi)" defaultValue={vi?.bodyMd ?? ""} rows={8} />
        </div>
      </fieldset>
      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">English (tuỳ chọn)</legend>
        <div className="grid gap-3">
          <Field name="en_title" label="Title (en)" defaultValue={en?.title ?? ""} />
          <Field name="en_summary" label="Summary (en)" defaultValue={en?.summary ?? ""} />
          <TextArea name="en_bodyMd" label="Body Markdown (en)" defaultValue={en?.bodyMd ?? ""} rows={8} />
        </div>
      </fieldset>

      <fieldset className="rounded-md border border-border p-4">
        <legend className="px-1 text-sm font-medium text-fg-muted">Thẻ</legend>
        {availableTags.length === 0 ? (
          <p className="text-sm text-fg-subtle">Chưa có thẻ nào. Thêm ở mục Thẻ.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {availableTags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm text-fg-muted">
                <input type="checkbox" name="tagId" value={tag.id} defaultChecked={selectedTags.has(tag.id)} className="h-4 w-4 rounded border-border" />
                {tag.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu bản nháp" : "Tạo bài viết"}</SubmitButton>
        <Link href="/admin/articles" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
