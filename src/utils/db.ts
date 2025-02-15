import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

type User = {
  id: string;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

type Database = {
  users: User[];
};

const adapter = new JSONFile<Database>(__dirname + "/../data/users.json");
const db = new Low(adapter, { users: [] });
await db.read(); 
export { db, User };
