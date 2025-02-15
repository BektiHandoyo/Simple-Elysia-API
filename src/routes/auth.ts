import { t, Elysia } from "elysia";
import { db, User } from "../utils/db";
import { hashPassword } from "../utils/auth";
import { randomUUID } from "crypto";
import { comparePassword, generateToken } from "../utils/auth";
import { preventAfterLogin } from "../middlewares/authMiddleware";

type authRequestBody = {
    username: string,
    password: string
}

export const auth = new Elysia();

auth.onBeforeHandle(preventAfterLogin);

auth.post("/signup", async ({ body, set }) => {
    const { username, password } = body as authRequestBody;

    if (db.data.users.some((user) => user.username === username)) {
        set.status = 400;
        return { error: "Username sudah digunakan" };
    }

    const newUser: User = {
        id: randomUUID(),
        username,
        password: await hashPassword(password),
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.data.users.push(newUser);
    await db.write();

    set.status = 201;
    return { message: "Registrasi berhasil" };
});

auth.post("/login", async ({ body, set, cookie : {token} }) => {
    const { username, password } = body as authRequestBody;

    await db.read();
    const user = db.data.users.find((u) => u.username === username);
    if (!user || !(await comparePassword(password, user.password))) {
      set.status = 401;
      return { error: "Username atau password salah" };
    }
  
    const userToken = generateToken(user.id, user.role);
    token.value = userToken;
    token.httpOnly = true;
    token.maxAge = 86400

    user.updatedAt = new Date().toISOString();
    await db.write();
  
    set.status = 302;
    set.headers = {"location" : "/"};
});