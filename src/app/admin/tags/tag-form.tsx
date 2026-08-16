"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTagAction, updateTagAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Field, FormStatus, SubmitButton } from "@/app/admin/_components/form-ui";
import type { Tag } from "@/modules/tags/domain/tag";

export function TagForm({ tag }: { tag?: Tag }) {
  const editing = Boolean(tag);
  const [state, action] = useActionState(editing ? updateTagAction : createTagAction, idleState);
  return (
    <form action={action} className="mt-6 grid max-w-md gap-4">
      {tag ? <input type="hidden" name="id" value={tag.id} /> : null}
      <Field name="slug" label="Slug" defaultValue={tag?.slug} required placeholder="clean-architecture" />
      <Field name="name" label="Tên" defaultValue={tag?.name} required placeholder="Clean Architecture" />
      <Field name="sortOrder" label="Thứ tự" type="number" defaultValue={String(tag?.sortOrder ?? 0)} />
      <FormStatus state={state} />
      <div className="flex items-center gap-3">
        <SubmitButton>{editing ? "Lưu" : "Tạo thẻ"}</SubmitButton>
        <Link href="/admin/tags" className="text-sm text-fg-muted hover:text-fg">
          Quay lại
        </Link>
      </div>
    </form>
  );
}
