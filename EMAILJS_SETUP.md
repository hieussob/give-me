# 📧 Hướng dẫn Cấu hình EmailJS

## Bước 1: Tạo tài khoản EmailJS

1. Truy cập: https://www.emailjs.com/
2. Click **Sign Up** (miễn phí - 200 emails/tháng)
3. Đăng ký với email của bạn

## Bước 2: Thêm Email Service

1. Vào **Email Services** > Click **Add New Service**
2. Chọn **Gmail**
3. Click **Connect Account** và đăng nhập với **hieusob@gmail.com**
4. Copy **Service ID** (VD: `service_abc123xyz`)

**Lưu ý:** Email sẽ được gửi từ hieusob@gmail.com đến chính hieusob@gmail.com (ẩn danh)

## Bước 3: Tạo Email Template

1. Vào **Email Templates** > Click **Create New Template**
2. Cấu hình template:

### Template Settings:
- **Template Name**: `meditation_message`
- **Template ID**: Sẽ tự động tạo (VD: `template_xyz789`)

### Email Template Content:

**Subject:**
```
✨ Tin nhắn ẩn danh từ {{from_name}} - Pixel Thoughts
```

**Content (Body):**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">�️ Tin nhắn ẩn danh</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Pixel Thoughts Meditation App</p>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0;"><strong style="color: #1f2937;">👤 Tên hiển thị:</strong></p>
      <p style="margin: 8px 0 0 0; color: #60a5fa; font-size: 18px; font-weight: 600;">{{from_name}}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0;"><strong style="color: #1f2937;">� Thời gian:</strong></p>
      <p style="margin: 8px 0 0 0; color: #6b7280;">{{timestamp}}</p>
    </div>
    
    <h3 style="color: #1f2937; margin-bottom: 10px;">💭 Tin nhắn:</h3>
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #60a5fa;">
      <p style="color: #374151; line-height: 1.6; white-space: pre-wrap; margin: 0;">{{message}}</p>
    </div>
    
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      🔒 Tin nhắn ẩn danh - Không lưu thông tin cá nhân người gửi
    </p>
  </div>
</div>
```

**From Email:** (sẽ tự động dùng hieusob@gmail.com)

**To Email:**
```
hieusob@gmail.com
```

**Reply To:** Để trống (vì ẩn danh)

3. Click **Save**
4. Copy **Template ID**

## Bước 4: Lấy Public Key

1. Vào **Account** > **General**
2. Tìm mục **Public Key** (hoặc **API Keys**)
3. Copy Public Key (VD: `IwZlGm-LxFiFcDi0I`)

## Bước 5: Cập nhật Code

Mở file `src/components/MessageForm.vue` và thay thế 3 giá trị:

```javascript
// Dòng 45: Thay YOUR_PUBLIC_KEY
emailjs.init('YOUR_PUBLIC_KEY') // ← Thay bằng Public Key của bạn

// Dòng 63-64: Thay Service ID và Template ID
const response = await emailjs.send(
  'YOUR_SERVICE_ID',   // ← Thay bằng Service ID
  'YOUR_TEMPLATE_ID',  // ← Thay bằng Template ID
  {
    from_name: formData.name || 'Người dùng ẩn danh',
    message: formData.message,
    timestamp: timestamp,
    to_email: 'hieusob@gmail.com'
  }
)
```

**Lưu ý:** Template cần có 3 biến: `{{from_name}}`, `{{message}}`, `{{timestamp}}`

## Bước 6: Test

1. Chạy app: `npm run dev`
2. Hoàn thành meditation 60s (hoặc click Stop)
3. Form sẽ hiện ra
4. Điền thông tin và gửi
5. Kiểm tra email `hieusob@gmail.com`

## ✅ Hoàn tất!

Bây giờ mỗi khi ai đó hoàn thành meditation, họ có thể gửi tin nhắn trực tiếp về email của bạn mà không cần backend! 🚀

---

## 🔧 Troubleshooting

### Lỗi "Public Key is required"
→ Chưa init() hoặc Public Key sai

### Lỗi "Service not found"
→ Service ID sai hoặc chưa kết nối email

### Lỗi "Template not found"
→ Template ID sai hoặc template chưa được lưu

### Email không nhận được
→ Kiểm tra spam folder
→ Verify email trong EmailJS dashboard
→ Kiểm tra quota (200 emails/tháng với free plan)

## 📊 Free Plan Limits

- ✅ 200 emails/tháng
- ✅ 2 email services
- ✅ Unlimited templates
- ✅ Email history (30 ngày)

Nếu cần nhiều hơn → Upgrade plan ($7/tháng cho 1000 emails)
