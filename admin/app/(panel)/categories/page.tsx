import { redirect } from "next/navigation";
import DataTable from "@/components/DataTable";
import { getAuthToken } from "@/lib/auth";
import { ApiError } from "@/lib/backend";
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/services/categoriesAdmin";

async function createAction(formData: FormData) {
  "use server";
  try {
    await createCategory(getAuthToken(), String(formData.get("name") || ""), String(formData.get("img") || ""));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/categories");
}

async function updateAction(formData: FormData) {
  "use server";
  try {
    await updateCategory(
      getAuthToken(),
      String(formData.get("id") || ""),
      String(formData.get("name") || ""),
      String(formData.get("img") || "")
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/categories");
}

async function deleteAction(formData: FormData) {
  "use server";
  try {
    await deleteCategory(getAuthToken(), String(formData.get("id") || ""));
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  }
  redirect("/categories");
}

export default async function CategoriesPage() {
  const cats = await listCategories(getAuthToken()).catch((e) => {
    if (e instanceof ApiError && e.status === 401) redirect("/login?error=Unauthorized");
    throw e;
  });
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Categories ({cats.length}/15)</h1>
      <DataTable
        columns={["Name", "Image", "ID"]}
        rows={cats.map((c) => [c.name, String(c.img).slice(0, 60), c.id])}
        empty="No categories"
      />
      <h2>Add (name 2-30, img https ≤500)</h2>
      <form action={createAction} className="row">
        <input name="name" placeholder="name" required minLength={2} maxLength={30} />
        <input name="img" placeholder="https://..." required maxLength={500} style={{ minWidth: 280 }} />
        <button type="submit">Add</button>
      </form>
      <h2>Edit</h2>
      <form action={updateAction} className="row">
        <input name="id" placeholder="id" required />
        <input name="name" placeholder="name" required minLength={2} maxLength={30} />
        <input name="img" placeholder="https://..." required maxLength={500} />
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
