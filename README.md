# User Management API

User Management API adalah sistem autentikasi berbasis **Elysia.js** yang memungkinkan pengguna untuk melakukan **registrasi, login, update profil, dan manajemen pengguna**. Sistem ini memiliki fitur role-based access control (RBAC) dengan peran **admin** dan **user**.

## 🚀 Fitur Utama
- **User Management**: Register, login, lihat profil, edit profil.
- **Admin Panel**: Admin dapat melihat, mengedit, dan menghapus user.
- **Middleware Proteksi**: Akses hanya untuk user yang sudah login atau admin.
- **Token-Based Authentication**: Menggunakan cookie untuk sesi login.

## 📌 Teknologi yang Digunakan
- **[Elysia.js](https://elysiajs.com/)** - Backend framework
- **TypeScript** - Supaya lebih maintainable
- **JSON File Database** - Simulasi database

## 📂 Struktur Proyek
```
.
├── src
│   ├── routes
│   │   ├── auth.ts       # Endpoint login & register
│   │   ├── user.ts       # Endpoint untuk user (profile, edit data)
│   │   ├── admin.ts      # Endpoint khusus admin
│   ├── middlewares
│   │   ├── authMiddleware.ts  # Middleware untuk proteksi endpoint
│   ├── utils
│   │   ├── auth.ts       # Utility fungsi autentikasi (hashing, token)
├── data
│   ├── users.json        # Simulasi database
├── package.json
├── tsconfig.json
├── README.md
```

## 🛠 Instalasi & Menjalankan Server
1. Clone repository ini:
   ```sh
   git clone https://github.com/BektiHandoyo/Simple-Elysia-API.git
   cd repository
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Jalankan server:
   ```sh
   npm run dev
   ```
4. API berjalan di `http://localhost:3000`

## 📌 Endpoint API
### **Auth Routes**
| Method | Endpoint    | Deskripsi |
|--------|------------|-----------|
| POST   | `/signup`  | Register user baru |
| POST   | `/login`   | Login user & generate token |
| GET    | `/user`    | Ambil data user yang login |
| PUT    | `/user`    | Update data user |

### **Admin Routes** (Hanya untuk admin)
| Method | Endpoint    | Deskripsi |
|--------|------------|-----------|
| GET    | `/admin`   | Lihat semua user |
| PUT    | `/admin/user/:id` | Edit username & role user |
| DELETE | `/admin/delete/:id` | Hapus user |

## 🛡️ Middleware Proteksi
Middleware memastikan endpoint hanya bisa diakses oleh user yang sesuai:
- `requireLogin` → Pastikan user sudah login
- `requireAdmin` → Pastikan user memiliki role **admin**
- `preventAfterLogin` → Cegah login ulang jika sudah login

## 💡 Catatan Tambahan
- Token disimpan dalam **httpOnly cookie** untuk keamanan.
- Gunakan **Postman atau Insomnia** untuk testing API.
- Simulasi database disimpan di `src/data/users.json`, bisa diedit manual jika perlu reset.

## 📜 Lisensi
Proyek ini menggunakan lisensi MIT. Silakan gunakan dan kembangkan sesuai kebutuhan.

---
Jika ada pertanyaan atau ingin kontribusi, silakan buka **issue atau pull request**. 🚀

