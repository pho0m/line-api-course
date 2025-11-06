
# 💬 LINE Messaging API Workshop

โปรเจกต์นี้เป็นตัวอย่างสำหรับการเชื่อมต่อ **LINE Messaging API** กับ **Web Application**
ให้นักเรียนเข้าใจหลักการทำงานของ “Webhook” และการส่งข้อความผ่าน LINE Bot  
โดยมีทั้งฝั่งผู้ส่ง (หน้าเว็บ HTML) และฝั่งผู้รับ (Server Node.js)

---

## 🎯 เป้าหมายของกิจกรรม
- รู้จักวิธีการส่งข้อความจากเว็บไซต์ไปยัง LINE
- เข้าใจการทำงานของ Webhook ที่รับข้อความจาก LINE
- ทดลองพัฒนา LINE Bot แบบง่าย ๆ ด้วย Node.js
- ทดสอบระบบจริงผ่าน ngrok และ LINE Developers Console

---

## 📁 โครงสร้างโปรเจกต์

```

LINE-API-COURSE/
│
├── index.html     # หน้าเว็บฟอร์มแจ้งงาน / ส่งข้อความ
├── server.js      # เซิร์ฟเวอร์ Node.js สำหรับเชื่อมกับ LINE API
├── package.json   # รายละเอียดโปรเจกต์และ dependencies
└── node_modules/  # โฟลเดอร์เก็บ dependencies (หลังติดตั้ง)

````

---

## ⚙️ เครื่องมือที่ต้องใช้

| เครื่องมือ | หน้าที่ |
|-------------|----------|
| 🟢 Node.js | รัน server ของเรา |
| 🧩 Express.js | สร้างเว็บเซิร์ฟเวอร์ |
| 🔗 Axios | ใช้เชื่อมต่อกับ LINE API |
| 🌐 Ngrok | เปิดพอร์ตให้ LINE เรียกเข้าได้จากภายนอก |
| 💬 LINE Developers | สำหรับสร้าง Channel และรับ Access Token |

---

## 🚀 ขั้นตอนการเริ่มต้น

### 1️⃣ ติดตั้งโปรแกรมที่จำเป็น
ติดตั้ง **Node.js** (แนะนำเวอร์ชัน LTS)  
จากนั้นเปิด Terminal แล้วพิมพ์:

```bash
npm init -y
npm install express axios cors
````

---

### 2️⃣ สร้างไฟล์ `server.js`

คัดลอกโค้ดตัวอย่างนี้:

```js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3000;

const ACCESS_TOKEN = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";
const USER_ID = "YOUR_LINE_USER_ID";

app.use(cors());
app.use(express.json());

// รับข้อมูลจากหน้าเว็บแล้วส่งไปยัง LINE
app.post("/notify", async (req, res) => {
  const { name, message } = req.body;
  await axios.post(
    "https://api.line.me/v2/bot/message/push",
    {
      to: USER_ID,
      messages: [
        { type: "text", text: `📢 แจ้งงานใหม่จาก ${name}\n\n${message}` },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  res.sendStatus(200);
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

---

### 3️⃣ สร้างหน้าเว็บ `index.html`

```html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>แจ้งงานผ่าน LINE Bot</title>
</head>
<body>
  <h2>📩 แจ้งงานผ่าน LINE Bot</h2>
  <form id="notifyForm">
    <input id="name" placeholder="ชื่อผู้แจ้ง" required />
    <textarea id="message" placeholder="รายละเอียดปัญหา" required></textarea>
    <button type="submit">ส่งข้อมูลไปยัง LINE</button>
  </form>

  <script>
    const form = document.getElementById("notifyForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("name").value,
        message: document.getElementById("message").value,
      };
      await fetch("http://localhost:3000/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("✅ ส่งข้อความไปยัง LINE แล้ว!");
    });
  </script>
</body>
</html>
```

---

### 4️⃣ รันเซิร์ฟเวอร์

```bash
node server.js
```

จากนั้นเปิด Browser ไปที่
👉 [http://localhost:3000](http://localhost:3000)

---

### 5️⃣ ใช้ ngrok เปิดพอร์ตภายนอก

```bash
npx ngrok http 3000
```

จะได้ URL เช่น

```
https://abcd1234.ngrok.io
```

นำ URL นี้ไปตั้งใน LINE Developers > Webhook URL
เช่น

```
https://abcd1234.ngrok.io/webhook
```

---

### 6️⃣ ทดสอบการทำงาน

1. เปิด `index.html`
2. กรอกข้อมูล → กดส่ง
3. ดูผลลัพธ์ข้อความที่ส่งถึง LINE OA
4. พิมพ์ตอบกลับใน LINE → ดูข้อความแสดงบนหน้ารับข้อความได้ด้วย

---

## 🧠 สรุปสิ่งที่นักเรียนได้เรียนรู้

✅ การใช้ Node.js สร้าง API
✅ การเชื่อม LINE Messaging API ด้วย Access Token
✅ การทำงานของ Webhook (รับ event แบบเรียลไทม์)
✅ การสร้างหน้าเว็บส่งข้อมูลเข้าระบบจริง
✅ การใช้ ngrok สำหรับทดสอบโปรแกรมในเครื่อง

---

## 🏆 Challenge (กิจกรรมท้ายคาบ)

* เพิ่มระบบ “เลือกประเภทงาน” (เช่น แจ้งซ่อม, แจ้งหาย, แจ้งเหตุ)
* ให้ Bot ตอบกลับอัตโนมัติตามข้อความที่ส่งมา
* นับจำนวนข้อความที่ส่ง/รับทั้งหมด

---

## 👩‍💻 จัดทำโดย

ทีมผู้สอนหลักสูตร “ต่อยอดไอเดียผ่าน LINE: เริ่มต้นด้วย Messaging API”
ร่วมกับนักศึกษาสาขาเทคโนโลยีสารสนเทศ ปวช.3
ห้อง M-Learning
วันที่ 6 พฤศจิกายน 2568

```
