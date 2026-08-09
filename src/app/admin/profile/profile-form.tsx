"use client";

import { useActionState } from "react";
import { updateProfileAction } from "./actions";
import { idleState } from "@/app/admin/_lib/form-state";
import { Field, FormStatus, Select, SubmitButton } from "@/app/admin/_components/form-ui";
import type { Profile } from "@/modules/profile/domain/profile";

const AVAILABILITY = [
  { value: "open", label: "Sẵn sàng nhận việc" },
  { value: "limited", label: "Giới hạn" },
  { value: "unavailable", label: "Không nhận việc" },
  { value: "unknown", label: "Chưa xác định" },
];
const LOCALES = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfileAction, idleState);
  return (
    <form action={action} className="mt-6 grid max-w-xl gap-4">
      <Field name="fullName" label="Họ tên" defaultValue={profile.fullName} />
      <Field name="professionalTitle" label="Chức danh" defaultValue={profile.professionalTitle} />
      <Field name="location" label="Địa điểm" defaultValue={profile.location ?? ""} />
      <Field name="publicEmail" label="Email công khai" type="email" defaultValue={profile.publicEmail ?? ""} />
      <Select name="availabilityStatus" label="Trạng thái" defaultValue={profile.availabilityStatus} options={AVAILABILITY} />
      <Select name="defaultLocale" label="Ngôn ngữ mặc định" defaultValue={profile.defaultLocale} options={LOCALES} />
      <FormStatus state={state} />
      <div>
        <SubmitButton>Lưu hồ sơ</SubmitButton>
      </div>
    </form>
  );
}
