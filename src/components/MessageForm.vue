<template>
  <div class="form-overlay" @click.self="$emit('close')">
    <div class="form-container">
      <button class="close-btn" @click="$emit('close')" aria-label="Đóng">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <h2 class="form-title">✨ Gửi tin nhắn ẩn danh</h2>
      <p class="form-subtitle">Chia sẻ suy nghĩ của bạn sau khoảnh khắc thiền định. Hoàn toàn ẩn danh.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Tên hiển thị (tùy chọn)</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            placeholder="Để trống nếu muốn hoàn toàn ẩn danh..."
          />
        </div>

        <div class="form-group">
          <label for="message">Tin nhắn</label>
          <textarea 
            id="message" 
            v-model="formData.message" 
            required
            rows="6"
            placeholder="Viết điều gì đó bạn muốn chia sẻ..."
          ></textarea>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">📨 Gửi tin nhắn</span>
          <span v-else>⏳ Đang gửi...</span>
        </button>

        <p v-if="statusMessage" class="status-message" :class="statusType">
          {{ statusMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import emailjs from '@emailjs/browser'

const emit = defineEmits(['close', 'message-sent'])

const loading = ref(false)
const statusMessage = ref('')
const statusType = ref('') // 'success' or 'error'

const formData = reactive({
  name: '',
  message: ''
})

// ⚠️ CẤU HÌNH EMAILJS - THAY ĐỔI 3 GIÁ TRỊ NÀY
const EMAILJS_CONFIG = {
  publicKey: '5WF7UI-0_WuugK7t2',      // Lấy từ EmailJS Dashboard > Account > API Keys
  serviceId: 'service_ohl7jkc',       // Lấy từ EmailJS Dashboard > Email Services
  templateId: 'template_2bswppj'      // Lấy từ EmailJS Dashboard > Email Templates
}

// Kiểm tra config
const isConfigured = !EMAILJS_CONFIG.publicKey.includes('YOUR_') && 
                     !EMAILJS_CONFIG.serviceId.includes('YOUR_') && 
                     !EMAILJS_CONFIG.templateId.includes('YOUR_')

// Khởi tạo EmailJS
if (isConfigured) {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

async function handleSubmit() {
  loading.value = true
  statusMessage.value = ''
  
  // Kiểm tra cấu hình trước khi gửi
  if (!isConfigured) {
    statusMessage.value = '⚠️ Chưa cấu hình EmailJS! Xem file EMAILJS_SETUP.md để setup.'
    statusType.value = 'error'
    loading.value = false
    console.error('❌ EmailJS chưa được cấu hình. Vui lòng cập nhật EMAILJS_CONFIG trong MessageForm.vue')
    return
  }
  
  try {
    // Lấy thời gian hiện tại
    const now = new Date()
    const timestamp = now.toLocaleString('vi-VN', { 
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log('📤 Đang gửi email với config:', {
      serviceId: EMAILJS_CONFIG.serviceId,
      templateId: EMAILJS_CONFIG.templateId
    })
    
    // Gửi email qua EmailJS (từ hieusob@gmail.com đến hieusob@gmail.com)
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        from_name: formData.name || 'Người dùng ẩn danh',
        message: formData.message,
        timestamp: timestamp,
        to_email: 'hieusob@gmail.com'
      }
    )
    
    if (response.status === 200) {
      statusMessage.value = '✅ Tin nhắn đã được gửi thành công!'
      statusType.value = 'success'
      console.log('✅ Email gửi thành công!')
      
      // Bật nhạc sau khi gửi thành công
      window.dispatchEvent(new CustomEvent('play-music'))
      
      // Reset form
      setTimeout(() => {
        formData.name = ''
        formData.message = ''
        emit('close')
      }, 2000)
    }
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error)
    
    // Xử lý các loại lỗi cụ thể
    if (error.text) {
      // Lỗi từ EmailJS API
      if (error.text.includes('Invalid')) {
        statusMessage.value = '❌ Service ID hoặc Template ID không đúng!'
      } else if (error.text.includes('Unauthorized')) {
        statusMessage.value = '❌ Public Key không hợp lệ!'
      } else {
        statusMessage.value = `❌ Lỗi EmailJS: ${error.text}`
      }
    } else if (error.status === 404) {
      statusMessage.value = '❌ Không tìm thấy Service hoặc Template! Kiểm tra lại ID.'
    } else if (error.status === 403) {
      statusMessage.value = '❌ Public Key không hợp lệ hoặc chưa được kích hoạt!'
    } else {
      statusMessage.value = '❌ Có lỗi xảy ra! Vui lòng kiểm tra console và file EMAILJS_SETUP.md'
    }
    
    statusType.value = 'error'
    
    // Log chi tiết để debug
    console.error('Chi tiết lỗi:', {
      error,
      config: EMAILJS_CONFIG,
      message: error.text || error.message
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 11, 22, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-container {
  background: rgba(15, 23, 42, 0.98);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 520px;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
              0 0 60px rgba(14, 165, 233, 0.15);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: rotate(90deg);
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
  font-size: 15px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #60a5fa;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(96, 165, 250, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(96, 165, 250, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.status-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.status-message.success {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-message.error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 640px) {
  .form-container {
    padding: 28px 24px;
  }
  
  .form-title {
    font-size: 24px;
  }
  
  .form-subtitle {
    font-size: 14px;
  }
}
</style>
