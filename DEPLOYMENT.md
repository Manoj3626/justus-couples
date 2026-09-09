# JustUs ❤️ — Deployment Guide

**"Two people. One private space."**

---

## Architecture Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Frontend (SPA)  │────▶│  Backend (API)   │────▶│  MongoDB Atlas   │
│  Netlify         │     │  Render/Railway  │     │  (Database)      │
│  React + Vite    │     │  Node + Express  │     └──────────────────┘
│                  │     │  Socket.IO       │
│                  │◀───▶│  (WebSocket)     │────▶┌──────────────────┐
└──────────────────┘     └──────────────────┘     │  Cloudinary/S3   │
                                                  │  (Media Storage) │
                                                  └──────────────────┘
```

---

## 1. MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user with a strong password
4. Whitelist `0.0.0.0/0` for access from Render/Railway (or use specific IPs)
5. Get the connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/justus_db?retryWrites=true&w=majority
   ```
6. Set this as `MONGO_URI` in your backend environment

---

## 2. Cloudinary Storage Setup

1. Go to [https://cloudinary.com](https://cloudinary.com) and create a free account
2. From the Dashboard, get your:
   - Cloud Name
   - API Key
   - API Secret
3. Construct your `CLOUDINARY_URL`:
   ```
   cloudinary://API_KEY:API_SECRET@CLOUD_NAME
   ```
4. Set this as `CLOUDINARY_URL` in your backend environment

> **IMPORTANT:** The application will NOT start in production without cloud storage configured. This prevents user media from being stored on ephemeral local disk.

---

## 3. SMTP Email Setup

For Gmail:
1. Enable 2FA on your Google account
2. Generate an App Password: Google Account → Security → App Passwords
3. Set:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   SMTP_FROM="JustUs ❤️" <your-email@gmail.com>
   ```

For other providers (SendGrid, Mailgun, etc.), use their SMTP credentials.

> If SMTP is not configured, OTP codes are logged to the server console (development only).

---

## 4. Backend Deployment (Render)

### Option A: Render

1. Go to [https://render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your Git repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
   - **Environment:** `Node`
5. Add environment variables (see Section 5)
6. Deploy

### Option B: Railway

1. Go to [https://railway.app](https://railway.app)
2. Create a new project from GitHub
3. Set root directory to `backend`
4. Add environment variables (see Section 5)
5. Deploy

---

## 5. Backend Environment Variables

| Variable | Required | Value |
|---|---|---|
| `NODE_ENV` | **YES** | `production` |
| `PORT` | No | `5000` (or use provider default) |
| `JWT_SECRET` | **YES** | Strong random string (32+ chars). Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `MONGO_URI` | **YES** | MongoDB Atlas connection string |
| `CORS_ORIGIN` | **YES** | Frontend URL (e.g., `https://justus.netlify.app`) |
| `FRONTEND_URL` | **YES** | Same as CORS_ORIGIN |
| `CLOUDINARY_URL` | **YES** | Cloudinary connection URL |
| `SMTP_HOST` | Recommended | SMTP server hostname |
| `SMTP_PORT` | Recommended | SMTP port (587 for TLS) |
| `SMTP_SECURE` | Recommended | `false` for STARTTLS, `true` for SSL |
| `SMTP_USER` | Recommended | SMTP username/email |
| `SMTP_PASS` | Recommended | SMTP password/app password |
| `SMTP_FROM` | Recommended | Sender display name and email |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth Client ID |
| `GEMINI_API_KEY` | Optional | Google Gemini API key |

### Production Startup Validation

The server will **refuse to start** in production if any of these are missing:
- `JWT_SECRET`
- `CORS_ORIGIN` or `FRONTEND_URL`
- `MONGO_URI`
- `CLOUDINARY_URL` or `AWS_S3_BUCKET`

---

## 6. Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

> If `VITE_SOCKET_URL` is not set, the frontend automatically uses `window.location.origin` for non-localhost environments.

---

## 7. Netlify Configuration

### Build Settings

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Import from Git
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variables:
   - `VITE_API_URL` = your backend URL
   - `VITE_SOCKET_URL` = your backend URL

### Redirects (SPA Routing)

Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

This ensures React Router works correctly on page refresh.

---

## 8. CORS Configuration

The backend restricts CORS to the value of `CORS_ORIGIN` (or `FRONTEND_URL`).

- In **production**: Only the configured frontend URL is allowed
- In **development**: All origins are allowed (`origin: true`)

If you have multiple frontend domains (e.g., custom domain + netlify.app), set `CORS_ORIGIN` to a comma-separated list and update the CORS middleware accordingly.

---

## 9. Socket.IO Configuration

Socket.IO uses the same origin restriction as CORS.

- Transport: WebSocket with polling fallback
- Max buffer size: 1MB (prevents binary data flooding)
- Authentication: JWT token verified on every connection
- Room isolation: Users join `space_${connectionId}` rooms only after server-side verification

**Important:** Socket.IO does NOT carry video/audio binary data. Media is delivered via HTTP/cloud storage. Socket.IO only synchronizes playback state (play, pause, seek, track change).

---

## 10. Production Cookie Configuration

| Setting | Value | Purpose |
|---|---|---|
| `httpOnly` | `true` | Prevents JavaScript access (XSS protection) |
| `secure` | `true` (production) | Cookies sent only over HTTPS |
| `sameSite` | `none` (production) | Required for cross-origin cookie (Netlify → Render) |
| `maxAge` | 30 days | Token expiration |

> **Note:** `sameSite: 'none'` requires `secure: true`. Your backend MUST be served over HTTPS.

---

## 11. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized JavaScript Origins:
   - `https://justus.netlify.app` (your frontend URL)
   - `http://localhost:5173` (for development)
4. Set `GOOGLE_CLIENT_ID` in backend environment
5. The frontend uses Google Identity Services (GSI) library

> If `GOOGLE_CLIENT_ID` is not set, Google OAuth is disabled. The application still works with email/password authentication.

---

## 12. Gemini AI Configuration

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Set `GEMINI_API_KEY` in backend environment

> If not set, the AI date suggestion endpoint returns curated fallback ideas instead.

---

## 13. Domain Configuration

### Custom Domain on Netlify
1. Go to Netlify → Domain Settings
2. Add your custom domain
3. Enable HTTPS (automatic with Netlify)

### Update Backend CORS
After setting up your custom domain, update:
```
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

---

## 14. Post-Deployment Testing

After deployment, verify:

- [ ] Frontend loads at your Netlify URL
- [ ] Signup creates account and sends OTP
- [ ] Login works with correct credentials
- [ ] OTP verification succeeds
- [ ] Couple connection with code works
- [ ] Real-time chat messages delivered between partners
- [ ] Music upload and shared playback works
- [ ] Video upload and Watch Together sync works
- [ ] Memories upload (image/video) and viewing works
- [ ] Dates creation and calendar works
- [ ] Games persist answers between sessions
- [ ] AI date suggestions return results (or fallbacks)
- [ ] Notifications display correctly
- [ ] Mobile layout works on phone screens
- [ ] WebSocket connects and stays connected
- [ ] Page refresh maintains authenticated session
- [ ] Logout clears session correctly

---

## 15. Troubleshooting

### Socket.IO won't connect
- Check that `CORS_ORIGIN` matches your frontend URL exactly (including `https://`)
- Check browser console for CORS errors
- Verify WebSocket is not blocked by firewall/proxy

### Cookies not persisting (logged out on refresh)
- Ensure backend is on HTTPS
- Check `sameSite: 'none'` and `secure: true` are set
- Verify `credentials: 'include'` is set in frontend fetch calls

### OTP not received
- Check SMTP credentials in environment
- Check backend logs for email errors
- In dev mode, OTP is logged to console

### Media uploads fail
- Check `CLOUDINARY_URL` is correctly formatted
- Check Cloudinary dashboard for usage limits
- Max file size is 50MB

### Backend crashes on startup
- Check all REQUIRED environment variables are set
- In production, JWT_SECRET, MONGO_URI, CORS_ORIGIN, and cloud storage are all mandatory
- Check MongoDB Atlas network access whitelist

### "dev-login" route returns 404
- This is **expected** in production — dev-login is disabled
- Use normal email/password or Google OAuth to authenticate

---

## Security Checklist

- [x] JWT_SECRET is environment-variable only (no hardcoded fallback in production)
- [x] dev-login route disabled in production
- [x] Google OAuth verifies credential cryptographically (google-auth-library)
- [x] JSON body parser limited to 2MB (file uploads use multer)
- [x] Socket.IO buffer limited to 1MB
- [x] CORS restricted to specific frontend origin in production
- [x] File uploads validated for MIME type and size
- [x] Couple data isolation enforced server-side
- [x] Cookies are httpOnly, secure, sameSite in production
- [x] No secrets committed to Git
- [x] .env files gitignored
- [x] Production startup validates all critical configuration
