# SE NPRU TaskFlow (คู่มือการทำโปรเจกต์)

โปรเจกต์ **SE NPRU TaskFlow** เป็นเว็บแอปพลิเคชันสำหรับจัดการงาน (Task Management) ที่พัฒนาขึ้นโดยใช้ MERN Stack (MongoDB, Express, React, Node.js) เพื่อช่วยให้ผู้ใช้สามารถติดตามสถานะงานของตัวเองได้อย่างมีประสิทธิภาพ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend (Client)
- **React (Vite)**: สำหรับสร้าง User Interface ที่รวดเร็ว
- **TailwindCSS v4**: สำหรับการจัดแต่งหน้าจอ (Styling)
- **DaisyUI v5**: คอมโพเนนต์ UI สำเร็จรูปที่สวยงามและใช้งานง่าย
- **Zustand**: สำหรับจัดการ State ของระบบ (Auth, Task, Theme, Language)
- **Axios**: สำหรับเชื่อมต่อกับ Backend API
- **React Router v7**: สำหรับจัดการเส้นทางหน้าเว็บ (Routing)
- **Lucide React**: และไอคอนต่างๆ ที่ใช้ในระบบ

### Backend (Server)
- **Node.js & Express**: เซิร์ฟเวอร์หลักของระบบ
- **MongoDB & Mongoose**: ฐานข้อมูลแบบ NoSQL และเครื่องมือจัดการ Schema
- **JSON Web Token (JWT)**: สำหรับการยืนยันตัวตน (Authentication)
- **bcrypt**: สำหรับเข้ารหัสผ่าน (Password Hashing)
- **Cookie-parser**: สำหรับดึงข้อมูลจาก Cookie ในฝั่งเซิร์ฟเวอร์
- **CORS**: สำหรับอนุญาตการเชื่อมต่อข้ามโดเมนระหว่าง Vercel และ Render

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
├── client/              # [Frontend] โค้ดส่วนหน้าจอผู้ใช้งาน
│   ├── src/
│   │   ├── components/  # คอมโพเนนต์ที่ใช้ร่วมกัน
│   │   ├── pages/       # หน้าหลักต่างๆ (Login, Dashboard, ...)
│   │   ├── services/    # การเชื่อมต่อ API (Axios config)
│   │   └── stores/      # การจัดการข้อมูลส่วนกลาง (Zustand)
│   └── public/          # ไฟล์สาธารณะ (Assets)
│
├── server/              # [Backend] โค้ดส่วนเซิร์ฟเวอร์และ API
│   ├── controllers/     # ตรรกะการทำงาน (Logic) ของแต่ละ API
│   ├── models/          # โครงสร้างฐานข้อมูล (Database Schema)
│   ├── middlewares/     # ตัวกรองข้อมูล (เช่น การเช็ค Login)
│   └── routers/         # เส้นทางของ API (API Routes)
│
├── howtoinstall.md      # วิธีการติดตั้ง (คู่มือภาษาไทย)
├── howtouse.md          # วิธีการใช้งาน (คู่มือภาษาไทย)
└── README.md            # คู่มือการทำโปรเจกต์ (หน้านี้)
```

---

## 🚀 สถาปัตยกรรมระบบ (Architecture)

1.  **Frontend**: รันบน **Vercel** โดยใช้ Static Hosting
2.  **Backend**: รันบน **Render** โดยรันเป็น Web Service (Node.js)
3.  **Database**: ข้อมูลทั้งหมดถูกเก็บไว้บน **MongoDB Atlas** (Cloud)
4.  **Security**: ใช้ **HTTPOnly Cookies** ในการเก็บ JWT Token เพื่อป้องกันการโจมตีแบบ XSS และตั้งค่า `Secure` กับ `SameSite: None` เพื่อให้รองรับการทำงานข้ามโดเมนบน Browser สมัยใหม่

---

## 📄 ลิงก์ที่เกี่ยวข้องอื่นๆ

- [วิธีการติดตั้ง (Installation)](./howtoinstall.md)
- [วิธีการใช้งาน (Usage Guide)](./howtouse.md)
