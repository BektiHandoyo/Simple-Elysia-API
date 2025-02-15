import { Elysia, t } from "elysia";
import { requireLogin, requireAdmin } from "../middlewares/authMiddleware";
import { db } from "../utils/db";

export const admin = new Elysia();

admin.onBeforeHandle(requireLogin);
admin.onBeforeHandle(requireAdmin);

admin.get("/admin", async () => {
  await db.read();
  return db.data.users.map(({ password, ...user }) => user);
});

admin.put("admin/user/:id", async ({ params, body, set }) => {
    const { id } = params;
    const { username, role } = body as {username: string, role: string};
  
    await db.read();
    const user = db.data.users.find((u) => u.id === id);
    if (!user) {
      set.status = 404;
      return { error: "User tidak ditemukan" };
    }
    
    if (db.data.users.some((u) => u.username === username && u.id !== id)) {
        set.status = 400;
        return { error: "Username sudah digunakan" };
    }

    if (role !== "user" && role !== "admin") {
        set.status = 400;
        return { error: "Role tidak valid" };
    }
  
    user.username = username;
    user.role = role;
    user.updatedAt = new Date().toISOString();
    await db.write();
  
    set.status = 200;
    return { message: "User berhasil diperbarui" };
});

admin.delete("/admin/delete/:id", async ({ params, set, store }) => {
    const { id } = params;
    
    if (store.user.id == id){
        set.status = 400;
        return {error : "Tidak dapat menghapus akun yang sedang anda gunakan"}
    }

    await db.read();
    const userIndex = db.data.users.findIndex((u) => u.id === id);
    

    if (userIndex === -1) {
      set.status = 404;
      return { error: "User tidak ditemukan" };
    }
  
    db.data.users.splice(userIndex, 1);
    await db.write();
  
    set.status = 200;
    return { message: "User berhasil dihapus" };
});
  
