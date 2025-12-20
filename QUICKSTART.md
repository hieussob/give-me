# 🚀 Hướng dẫn Setup EmailJS Nhanh (5 phút)

## Bước 1: Đăng ký EmailJS (2 phút)

1. Truy cập: **https://www.emailjs.com/**
2. Click **Sign Up** (miễn phí)
3. Đăng nhập với Gmail: **hieusob@gmail.com**
4. Xác nhận email nếu cần

---

## Bước 2: Kết nối Gmail Service (1 phút)

1. Vào dashboard EmailJS
2. Click **Email Services** ở menu bên trái
3. Click nút **Add New Service**
4. Chọn **Gmail**
5. Click **Connect Account** → Đăng nhập Gmail **hieusob@gmail.com**
6. Cho phép quyền truy cập
7. **✅ Copy Service ID** (VD: `service_abc123xyz`)

---

## Bước 3: Tạo Email Template (1 phút)

1. Click **Email Templates** ở menu bên trái
2. Click **Create New Template**
3. **Điền form:**

### To Email:
```
hieusob@gmail.com
```

### Subject:
```
✨ Tin nhắn ẩn danh từ {{from_name}}
```

### Content (body):
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #60a5fa;">🕊️ Tin nhắn ẩn danh từ Pixel Thoughts</h2>
  
  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>👤 Tên:</strong> {{from_name}}</p>
    <p><strong>🕐 Thời gian:</strong> {{timestamp}}</p>
  </div>
  
  <div style="background: white; padding: 20px; border-left: 4px solid #60a5fa; margin: 20px 0;">
    <p style="white-space: pre-wrap;">{{message}}</p>
  </div>
  
  <p style="color: #9ca3af; font-size: 12px;">Gửi từ Pixel Thoughts App</p>
</div>
```

4. Click **Save**
5. **✅ Copy Template ID** (VD: `template_xyz789`)

---

## Bước 4: Lấy Public Key (30 giây)

1. Click **Account** (icon cài đặt) ở menu bên trái
2. Tìm mục **API Keys** hoặc **Public Key**
3. **✅ Copy Public Key** (VD: `abc123XYZ456`)

---

## Bước 5: Cập nhật Code (30 giây)

Mở file: **`src/components/MessageForm.vue`**

Tìm dòng **62-66** và thay thế:

```javascript
const EMAILJS_CONFIG = {
  publicKey: 'PASTE_PUBLIC_KEY_HERE',      // ← Dán Public Key
  serviceId: 'PASTE_SERVICE_ID_HERE',      // ← Dán Service ID  
  templateId: 'PASTE_TEMPLATE_ID_HERE'     // ← Dán Template ID
}
```

### ✅ Ví dụ sau khi điền:
```javascript
const EMAILJS_CONFIG = {
  publicKey: 'mJ4k2xL9pQ7sR1tY',
  serviceId: 'service_abc123xyz',
  templateId: 'template_xyz789'
}
```

**Lưu file (Ctrl+S)**

---

## Bước 6: Test thử! 🎉

1. Chạy app:
```bash
npm run dev
```

2. Mở trình duyệt và làm theo:
   - Nhập một thought bất kỳ
   - Click **Release** → Đợi 60s (hoặc click Stop)
   - Form sẽ hiện ra
   - Điền tin nhắn test
   - Click **Gửi tin nhắn**

3. Kiểm tra email **hieusob@gmail.com** (inbox hoặc spam)

---

## ❓ Troubleshooting

### Lỗi: "Chưa cấu hình EmailJS"
→ Bạn chưa thay thế 3 giá trị trong `EMAILJS_CONFIG`

### Lỗi 404: "Service hoặc Template không tìm thấy"
→ Service ID hoặc Template ID sai
→ Kiểm tra lại trong EmailJS Dashboard

### Lỗi 403: "Public Key không hợp lệ"
→ Public Key sai hoặc chưa được kích hoạt
→ Copy lại từ Account > API Keys

### Không nhận được email
→ Kiểm tra **Spam folder**
→ Verify email trong EmailJS dashboard
→ Kiểm tra quota (free plan: 200 emails/tháng)

---

## 📊 Free Plan Limits

- ✅ **200 emails/tháng** (đủ dùng)
- ✅ 2 email services
- ✅ Unlimited templates
- ✅ Email history 30 ngày

---

## 🎯 Xong rồi!

Giờ app của bạn có thể nhận tin nhắn ẩn danh sau mỗi meditation session! 🚀

Mọi tin nhắn sẽ được gửi về **hieusob@gmail.com** mà không cần backend server.
