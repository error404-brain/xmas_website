# 🎄 Hướng Dẫn Deploy Website Giáng Sinh

## 📋 Tổng Quan

Website của bạn có 2 phần:

- **Frontend**: React + Vite (thư mục `Font_End/xmas_lette`)
- **Backend**: Express.js (thư mục `BackEnd`) - _Nếu cần_

---

## 🚀 CÁCH 1: VERCEL (KHUYÊN DÙNG - MIỄN PHÍ & DỄ NHẤT)

### ✅ Ưu điểm:

- Hoàn toàn miễn phí
- Tự động deploy khi push code lên GitHub
- SSL/HTTPS miễn phí
- CDN toàn cầu, tốc độ nhanh
- Domain miễn phí: `your-project.vercel.app`

### 📝 Các bước:

#### **Option A: Deploy qua Website (DỄ NHẤT)**

1. **Push code lên GitHub** (nếu chưa có):

   ```powershell
   cd f:\code\xmas_website
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vào Vercel**:

   - Truy cập: https://vercel.com
   - Click "Sign Up" → Chọn "Continue with GitHub"
   - Authorize Vercel truy cập GitHub

3. **Import Project**:

   - Click "Add New" → "Project"
   - Chọn repository `xmas_website`
   - **Root Directory**: Chọn `Font_End/xmas_lette`
   - Click "Deploy"

4. **XONG!** 🎉
   - Vercel sẽ tự động build và deploy
   - Bạn sẽ có link dạng: `https://xmas-website-xxx.vercel.app`

#### **Option B: Deploy qua CLI**

```powershell
# 1. Cài Vercel CLI (chỉ lần đầu)
npm install -g vercel

# 2. Di chuyển vào folder frontend
cd f:\code\xmas_website\Font_End\xmas_lette

# 3. Login Vercel
vercel login

# 4. Deploy
vercel

# 5. Deploy production (khi đã test xong)
vercel --prod
```

---

## 🚀 CÁCH 2: NETLIFY (MIỄN PHÍ)

### ✅ Ưu điểm:

- Miễn phí
- Kéo thả deploy siêu đơn giản
- SSL/HTTPS miễn phí
- Domain miễn phí: `your-project.netlify.app`

### 📝 Các bước:

#### **Option A: Kéo Thả (DỄ NHẤT)**

```powershell
# 1. Build project
cd f:\code\xmas_website\Font_End\xmas_lette
npm install
npm run build
```

2. Vào https://app.netlify.com
3. Kéo thả folder `dist` vào màn hình
4. **XONG!** 🎉

#### **Option B: Deploy qua CLI**

```powershell
# 1. Cài Netlify CLI
npm install -g netlify-cli

# 2. Di chuyển vào folder frontend
cd f:\code\xmas_website\Font_End\xmas_lette

# 3. Login
netlify login

# 4. Build
npm run build

# 5. Deploy
netlify deploy --prod --dir=dist
```

---

## 🚀 CÁCH 3: GITHUB PAGES (MIỄN PHÍ)

### 📝 Các bước:

1. **Cập nhật `vite.config.js`**:

   ```javascript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     base: "/xmas_website/", // Tên repository của bạn
   });
   ```

2. **Cài package gh-pages**:

   ```powershell
   cd f:\code\xmas_website\Font_End\xmas_lette
   npm install --save-dev gh-pages
   ```

3. **Thêm scripts vào `package.json`**:

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**:

   ```powershell
   npm run deploy
   ```

5. **Cấu hình GitHub**:

   - Vào repository trên GitHub
   - Settings → Pages
   - Source: `gh-pages` branch
   - Click Save

6. Website sẽ có tại: `https://error404-brain.github.io/xmas_website/`

---

## 🚀 CÁCH 4: RENDER (MIỄN PHÍ - Cho cả Frontend + Backend)

### 📝 Deploy Backend:

1. Vào https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect repository `xmas_website`
5. **Root Directory**: `BackEnd`
6. **Build Command**: `npm install`
7. **Start Command**: `node server.js`
8. Click "Create Web Service"

### 📝 Deploy Frontend:

1. Click "New +" → "Static Site"
2. Connect repository `xmas_website`
3. **Root Directory**: `Font_End/xmas_lette`
4. **Build Command**: `npm run build`
5. **Publish Directory**: `dist`
6. Click "Create Static Site"

---

## 🎯 KHUYẾN NGHỊ

### Nếu chỉ có Frontend (không dùng Backend):

✅ **VERCEL** hoặc **NETLIFY** - Dễ nhất, nhanh nhất

### Nếu có cả Backend:

✅ **RENDER** (cả 2) hoặc **VERCEL** (Frontend) + **Railway/Render** (Backend)

---

## 🔧 LƯU Ý QUAN TRỌNG

### 1. **Kiểm tra các đường dẫn file**:

Trong `Home.jsx`, bạn dùng:

```javascript
img.src = "/picture_game.png";
musicRef.current = new Audio("/song.mp3");
```

✅ Đảm bảo các file này có trong folder `public/`

### 2. **Environment Variables** (nếu cần):

Nếu có API keys hoặc config:

- Tạo file `.env` (local)
- Thêm variables vào Vercel/Netlify dashboard

### 3. **CORS** (nếu dùng Backend):

Trong `BackEnd/server.js`, đảm bảo CORS đã được cấu hình đúng:

```javascript
app.use(
  cors({
    origin: "https://your-frontend-domain.vercel.app",
  })
);
```

---

## 🎁 BONUS: Domain Tùy Chỉnh

Sau khi deploy, bạn có thể mua domain (.com, .vn) và connect:

### Vercel:

1. Settings → Domains
2. Add domain của bạn
3. Cập nhật DNS records theo hướng dẫn

### Netlify:

1. Domain settings → Add custom domain
2. Cập nhật DNS records

---

## 🆘 Troubleshooting

### Lỗi "Cannot find module":

```powershell
npm install
```

### Lỗi build:

```powershell
npm run build
```

Xem lỗi và fix theo message

### File không load (404):

- Kiểm tra file có trong folder `public/`
- Đường dẫn phải đúng (case-sensitive)

---

## 📞 Cần Giúp Đỡ?

Nếu gặp vấn đề, hãy:

1. Check console browser (F12)
2. Check build logs trên platform
3. Đảm bảo đã `npm install` và `npm run build` thành công local

---

**🎄 Chúc bạn deploy thành công! Merry Christmas! 🎅**
