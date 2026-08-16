"use client";

import { useActionState } from "react";
import { upsertSettingAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Checkbox, Field, FormStatus, SubmitButton, TextArea } from "@/app/admin/_components/form-ui";

/** Upsert a key/value setting. Value is JSON. Reused for create + edit (key is the identity). */
export function SettingForm({ setting }: { setting?: { key: string; value: unknown; isPublic: boolean } }) {
  const [state, action] = useActionState(upsertSettingAction, idleState);
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      <Field
        name="key"
        label="Khoá"
        defaultValue={setting?.key}
        required
        placeholder="site.title"
      />
      <TextArea
        name="value"
        label="Giá trị (JSON)"
        defaultValue={setting ? JSON.stringify(setting.value, null, 2) : ""}
        rows={5}
      />
      <Checkbox name="isPublic" label="Cho phép đọc công khai" defaultChecked={setting?.isPublic ?? false} />
      <FormStatus state={state} />
      <div>
        <SubmitButton>Lưu cài đặt</SubmitButton>
      </div>
    </form>
  );
}
