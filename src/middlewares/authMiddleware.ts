import { Context } from "elysia";
import { verifyToken } from "../utils/auth";
import { db } from "../utils/db";

export const preventAfterLogin = ({ set, cookie: { token } }: Context) => {
  if (token.value) {
    set.status = 400;
    return { error: "Anda sudah login" };
  }
};

export const requireLogin = async ({ set, cookie: { token }, store }: Context) => {
  if (!token.value) {
    return { error: "Anda belum login" };
  }
  
  try {
    const decoded = verifyToken(token.value);
    await db.read();
    const user = db.data.users.find((u) => u.id == decoded.user_id);
  
    if (!user) {
      throw Error;
    }
    store.user = user;
  } catch {
    set.status = 401;
    token.value = '';
    token.httpOnly = true;
    token.maxAge = 0
    return { error: "Token tidak valid, silahkan login ulang" };
  }
};

export const requireAdmin = ({ store, set }: Context) => {
  if (store.user.role !== "admin") {
    set.status = 403; 
    return { error: "Akses ditolak. Anda bukan admin." };
  }
};