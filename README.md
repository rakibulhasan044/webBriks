# WebBriks ZenBoard

Welcome to **ZenBoard**, a full-stack Kanban board application built with Next.js, NestJS, Prisma, and MinIO.

## 🚀 Quick Setup (The Easiest Way)

The absolute easiest way to get this project running is to use a cloud Postgres database (like **Neon** or **Supabase**) so you don't have to run Postgres locally.

1. **Environment Variables:**
   - **Backend:** Create a `.env` file in the **root directory** (you can copy `.env.example`).
   - **Frontend:** Create a `.env.local` file inside the **`frontend` folder** (you can copy `frontend/.env.example`).
2. Replace the `DATABASE_URL` with your Neon or Supabase connection string:
   ```env
   DATABASE_URL="postgresql://user:password@hostname/dbname?sslmode=require"
   ```

## 🐳 Running with Docker

We have fully dockerized the Frontend, Backend, and MinIO storage.

### For Mac/Linux Users (Recommended)
Simply run the shell script from the root directory. This will automatically build everything and print out all the useful application links!
```bash
./start.sh
```

### For Windows Users
Run the batch script:
```cmd
start.bat
```
> **⚠️ Windows Note:** I primarily develop on a Mac. Docker Desktop on Windows sometimes has severe memory starvation or `EOF` issues during builds. Because I don't use Windows, I could not fully debug these Docker issues. Even manual build commands might fail or freeze on some Windows machines. **It is highly requested and recommended to evaluate/run this project on a Mac.**

### Manual Docker Build Commands
If you prefer not to use the shortcut scripts, you can build and start the containers manually:
```bash
docker compose build backend
docker compose build frontend
docker compose up -d
```

## 🔗 Application Links

Once the setup is complete and Docker is running, you can access the services here:

- 🌐 **Frontend:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API:** [http://localhost:6001/api/v1](http://localhost:6001/api/v1)
- 📚 **Swagger Docs:** [http://localhost:6001/api/v1/docs](http://localhost:6001/api/v1/docs)
- 🪣 **MinIO UI (Storage):** [http://localhost:9001](http://localhost:9001) *(Check your `.env` for login credentials)*

---

### ℹ️ Why is there no Live Demo Link?
A live hosted version is not provided because this application relies on **MinIO**, which acts as a local AWS S3-compatible storage bucket for handling user uploads and attachments. Hosting a dedicated S3 bucket and persistent database for a live demo exceeds the scope of this repository. Running it locally via Docker gives you the full, uncompromised experience!
