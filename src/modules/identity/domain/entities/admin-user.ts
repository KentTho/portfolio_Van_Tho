import { Entity } from "@/shared/domain/entity";

export type AdminRole = "owner_admin" | "editor" | "viewer";
export type AdminStatus = "active" | "suspended" | "disabled";

export interface AdminUserProps {
  readonly email: string;
  readonly role: AdminRole;
  readonly status: AdminStatus;
}

/** An authenticated, authorized administrator. Framework-free. */
export class AdminUser extends Entity<string> {
  private constructor(
    id: string,
    private readonly props: AdminUserProps,
  ) {
    super(id);
  }

  static create(id: string, props: AdminUserProps): AdminUser {
    return new AdminUser(id, props);
  }

  get email(): string {
    return this.props.email;
  }
  get role(): AdminRole {
    return this.props.role;
  }
  get status(): AdminStatus {
    return this.props.status;
  }
  isActive(): boolean {
    return this.props.status === "active";
  }
}
