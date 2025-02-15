import { Elysia } from "elysia";
import { auth } from "./routes/auth";
import { user } from "./routes/user";
import { admin } from "./routes/admin";

const app = new Elysia();

app.use(user);
app.use(auth);
app.use(admin);

app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
