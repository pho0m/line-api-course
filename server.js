import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3000;
const ACCESS_TOKEN = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";
const USER_ID = "YOUR_LINE_USER_ID";

app.use(cors());
app.use(express.json());

// เก็บข้อความที่ได้รับจาก LINE
const messages = [];

// 📩 รับข้อมูลจากฟอร์มแล้วส่งไป LINE
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

// 💬 รับข้อความจาก LINE (Webhook)
app.post("/webhook", (req, res) => {
  const events = req.body.events;
  if (events && events.length > 0) {
    events.forEach((e) => {
      if (e.type === "message" && e.message.type === "text") {
        messages.push({
          user: e.source.userId || "ผู้ใช้ไม่ระบุชื่อ",
          text: e.message.text,
        });
      }
    });
  }
  res.sendStatus(200);
});

// 🔄 API ดึงข้อความที่รับไว้ (ให้หน้าเว็บเรียกดู)
app.get("/messages", (req, res) => {
  res.json(messages.slice(-10)); // แสดง 10 ข้อความล่าสุด
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
