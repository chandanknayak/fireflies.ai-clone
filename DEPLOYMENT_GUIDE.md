# Fireflies Clone - Deployment Guide (5-Minute Quick Start)

## ✅ STEP 1: Push to GitHub (DO THIS FIRST)
Run in your terminal:
```bash
cd your-repo-folder
git add -A
git commit -m "Fix CORS config, edit-modal stale state, bump Next.js"
git push
```

**What changed:**
- ✅ Fixed CORS configuration in backend
- ✅ Fixed edit modal stale state bug in frontend
- ✅ Updated Next.js version

---

## 🚀 STEP 2: Deploy Backend on Render (2-3 minutes)

1. Go to **render.com** → Log in
2. Click **"+ New"** → Select **"Blueprint"**
3. **Connect GitHub repo** (select your fireflies repo)
4. Render auto-detects `render.yaml` ✅
5. It will pre-fill:
   - Root directory: `backend/`
   - Build command: detected
   - Start command: detected
6. Under **Environment Variables**, set:
   - `ALLOWED_ORIGINS` = `*` (temporary, we'll lock it down later)
7. Click **"Deploy Blueprint"**
8. ⏳ Wait 2-3 minutes for build to complete

**When done:** Copy your backend URL (looks like `https://fireflies-clone-backend.onrender.com`)

---

## 🎯 STEP 3: Deploy Frontend on Vercel (2-3 minutes)

1. Go to **vercel.com** → Log in
2. Click **"Add New"** → Select **"Project"**
3. **Import** your GitHub repo
4. When prompted, click **"Edit"** next to "Root Directory"
5. Change it from `.` to `frontend` → Save
6. Vercel auto-detects Next.js ✅
7. Before deploying, add **Environment Variable:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://fireflies-clone-backend.onrender.com/api` (replace with YOUR Render URL from Step 2)
8. Click **"Deploy"**
9. ⏳ Wait 2-3 minutes for build to complete

**When done:** Copy your Vercel URL (looks like `https://fireflies-clone.vercel.app`)

---

## 🔒 STEP 4: Lock Down CORS (1 minute)

1. Go back to **render.com** → Your backend service
2. Click **"Environment"** tab
3. Find `ALLOWED_ORIGINS` (currently set to `*`)
4. Change it to your **Vercel URL** from Step 3:
   ```
   https://your-app.vercel.app
   ```
5. Click **"Save"**
6. ⏳ Render auto-redeploys in ~30 seconds

---

## ✨ STEP 5: Verify Everything Works (30 seconds)

1. Open your **Vercel URL** in browser
2. You should see **7 seeded meetings** load immediately ✅
3. Test by:
   - Creating a **new meeting**
   - **Editing an existing meeting** twice in a row
   - This second edit tests the bug fix! ✅

**If it works:** 🎉 You're live!

---

## 📋 Checklist

- [ ] Step 1: Pushed to GitHub
- [ ] Step 2: Backend deployed on Render (have URL saved)
- [ ] Step 3: Frontend deployed on Vercel (have URL saved)
- [ ] Step 4: CORS locked to Vercel URL
- [ ] Step 5: Everything loads & works

---

## 🆘 Troubleshooting

**Frontend not loading data?**
- Check `NEXT_PUBLIC_API_URL` on Vercel is set correctly
- Check CORS on Render backend is set to your Vercel URL (no `*`)

**Build fails?**
- Check Render/Vercel logs for errors
- Make sure your GitHub push completed successfully

**Slow first load?**
- Render free tier is slow; this is normal (cold start)
- First request after deployment takes 10-30 seconds

---

**Total time: ~5-7 minutes** ⏱️
