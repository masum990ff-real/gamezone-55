import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { createStaff, deleteStaff, listStaff, updateStaff } from "@/services/staffAdmin";
import { PERMISSIONS } from "@/types/roles";

async function createAction(formData: FormData) {
  "use server";
  const permissions = String(formData.get("permissions") || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  try {
    await createStaff(getAuthToken(), {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      permissions,
    });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/staff");
}

async function updateAction(formData: FormData) {
  "use server";
  const payload: Record<string, unknown> = {};
  const perms = String(formData.get("permissions") || "");
  if (perms) payload.permissions = perms.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const pw = String(formData.get("password") || "");
  if (pw) payload.password = pw;
  try {
    await updateStaff(getAuthToken(), String(formData.get("id") || ""), payload);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/staff");
}

async function deleteAction(formData: FormData) {
  "use server";
  try {
    await deleteStaff(getAuthToken(), String(formData.get("id") || ""));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/staff");
}

export default async function StaffPage() {
  const staffs = await listStaff(getAuthToken()).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Staff (requirePermission staff)</h1>
      <p style={{ color: "#64748b" }}>Allowed perms: {PERMISSIONS.join(", ")}</p>
      <DataTable
        columns={["Email", "Permissions", "ID"]}
        rows={staffs.map((s) => [s.email, s.permissions.join(", "), s.id])}
        empty="No staff"
      />
      <h2>Create (password 6-64)</h2>
      <form action={createAction} className="row">
        <input name="email" type="email" placeholder="email" required />
        <input name="password" type="password" placeholder="password" required minLength={6} maxLength={64} />
        <input name="permissions" placeholder="perms csv, e.g. users,withdrawals" style={{ minWidth: 260 }} />
        <button type="submit">Create</button>
      </form>
      <h2>Update</h2>
      <form action={updateAction} className="row">
        <input name="id" placeholder="id" required />
        <input name="password" type="password" placeholder="new password (optional)" minLength={6} maxLength={64} />
        <input name="permissions" placeholder="perms csv" />
        <button type="submit">Update</button>
      </form>
      <h2>Delete</h2>
      <form action={deleteAction} className="row">
        <input name="id" placeholder="id" required />
        <button type="submit">Delete</button>
      </form>
    </div>
  );
}
