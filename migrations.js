import 'dotenv/config';
import { db } from './src/utils/db.js';

await db.execute("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, completed BOOLEAN NOT NULL DEFAULT 0);");

await db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE);");

// await db.execute("ALTER TABLE users ADD COLUMN password TEXT;").catch(() => {}); // Ignore if column exists

// await db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);");
