import { Elysia, t } from "elysia";
import { requireLogin } from "../middlewares/authMiddleware";
import { hashPassword } from "../utils/auth";
import { db } from "../utils/db";

export const user = new Elysia();

user.onBeforeHandle(requireLogin);

user.get("/", ({ store }) => {
  const { password, ...userData } = store.user;
  return userData;
});

user.put("/user", async ({ store, body, set }) => {
  const newUsername: string = body.username;
  const newPassword: string = body.password;
  const conf_password: string = body.conf_password;
  await db.read();
  const user = db.data.users.find((u) => u.id === store.user.id);
  if (!user) {
    set.status = 404;
    return { error: "User tidak ditemukan" };
  }
  if (newUsername) {
    const usernameExists = db.data.users.some(
      (u) => u.username === newUsername && u.id !== user.id
    );
    if (usernameExists) {
      set.status = 400;
      return { error: "Username sudah digunakan" };
    }
    user.username = newUsername;
  }
  if (newPassword) {
    if (!conf_password || newPassword !== conf_password) {
      set.status = 400;
      return { error: "Konfirmasi password tidak cocok" };
    }
    user.password = await hashPassword(newPassword);
  }
  user.updatedAt = new Date().toISOString();
  await db.write();
  return { message: "Data berhasil diperbarui" };
}, {
  body: t.Object({
    username: t.String(),
    password: t.String(),
    conf_password: t.String(), 
  }),
});

user.post("/logout", async ({set, cookie : {token}}) => {
  token.value = '';
  token.httpOnly = true;
  token.maxAge = 0;
  return { message: "Logout Berhasil" };
});

