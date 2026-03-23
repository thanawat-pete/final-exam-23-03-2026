# วิธีการติดตั้ง (Installation Guide)

คู่มือนี้สำหรับนักพัฒนาที่ต้องการติดตั้งโปรเจกต์ **SE NPRU TaskFlow** ลงบนเครื่องคอมพิวเตอร์ส่วนตัว (Local Machine)

## 1. สิ่งที่ต้องมีก่อน (Prerequisites)

*   **Node.js**: เวอร์ชั่น 18 ขึ้นไป (แนะนำ v20+)
*   **npm** หรือ **yarn**
*   **MongoDB**: แนะนำให้ใช้ **MongoDB Atlas** (Cloud) หรือจะติดตั้งแบบ Local ก็ได้

---

## 2. ขั้นตอนการติดตั้ง

### 2.1 Clone Project
```bash
git clone https://github.com/thanawat-pete/final-exam-23-03-2026.git
cd final-exam-23-03-2026
```

### 2.2 ติดตั้ง Dependencies
โปรเจกต์นี้แยกโฟลเดอร์ระหว่าง Frontend และ Backend ต้องติดตั้งทั้งสองที่:

**Backend (Server):**
```bash
cd server
npm install
```

**Frontend (Client):**
```bash
cd ../client
npm install
```

---

## 3. การตั้งค่า Environment Variables (.env)

คุณต้องสร้างไฟล์ `.env` ไว้ในโฟลเดอร์ `server` และ `client` โดยใช้ไฟล์ตัวอย่างที่มีอยู่:

### Backend (`server/.env`)
สร้างไฟล์ใหม่ชื่อ `.env` ในโฟลเดอร์ `server` และใส่ข้อมูลดังนี้:
```env
PORT=5000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/task-manager
CLIENT_URL=http://localhost:5173
JWT_SECRET=ใส่รหัสลับของคุณที่นี่
NODE_ENV=development
```

### Frontend (`client/.env`)
สร้างไฟล์ใหม่ชื่อ `.env` ในโฟลเดอร์ `client` และใส่ข้อมูลดังนี้:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 4. วิธีการรันโปรเจกต์

### รัน Backend
1. เปิด Terminal ใหม่
2. ไปที่โฟลเดอร์ `server`
3. รันคำสั่ง:
   ```bash
   npm run dev
   ```
   *(เซิร์ฟเวอร์จะรันที่ http://localhost:5000)*

### รัน Frontend
1. เปิด Terminal อีกหน้าต่างหนึ่ง
2. ไปที่โฟลเดอร์ `client`
3. รันคำสั่ง:
   ```bash
   npm run dev
   ```
   *(เว็บจะรันที่ http://localhost:5173)*

---

## 5. การเตรียมตัวบน Production (Render & Vercel)

- สำหรับ **Render (Backend)**: อย่าลืมตั้งค่า `NODE_ENV=production` ใน Environment Variables เพื่อให้ระบบ Cookie ทำงานได้ถูกต้อง
- สำหรับ **Vercel (Frontend)**: ต้องตั้งค่า `VITE_API_URL` ให้ชี้ไปยัง URL ของ Render
