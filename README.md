# Frontend (React + Vite)

1. From project root run `npm run install:all` (or `npm install` in this folder after backend dependencies are installed).
2. Copy `.env.example` to `.env`. Leave `VITE_API_URL` blank for same-origin/single-service deployment. For split hosting, set it to the backend origin.
3. Start frontend only with `npm run dev --prefix client`; open http://localhost:5173.
4. Production bundle: `npm run build --prefix client`. Output is `client/dist`.

The UI talks to `/api` and `/socket.io`. Local Vite config proxies both to `http://localhost:5000`.
