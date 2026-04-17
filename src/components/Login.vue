<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="panel-title">{{ isLoginMode ? '平台登录' : '新用户注册' }}</div>
      <div class="login-card">
        <div class="tabs">
          <button
            class="tab"
            :class="{ active: isLoginMode }"
            type="button"
            @click="setMode('login')"
          >
            账号密码登录
          </button>
          <button
            class="tab"
            :class="{ active: !isLoginMode }"
            type="button"
            @click="setMode('register')"
          >
            注册账号
          </button>
        </div>

        <form @submit.prevent="isLoginMode ? handleLogin() : handleRegister()">
          <div class="field-row">
            <span class="field-icon">👤</span>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              :placeholder="isLoginMode ? '请输入账号' : '请输入用户名'"
            />
          </div>

          <div class="field-row">
            <span class="field-icon">🔒</span>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="请输入密码"
            />
          </div>

          <div class="field-row" v-if="!isLoginMode">
            <span class="field-icon">🔒</span>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="请再次输入密码"
            />
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? (isLoginMode ? '登录中...' : '注册中...') : (isLoginMode ? '登录' : '注册') }}
          </button>
        </form>

        <div class="card-footer">
          <label class="auto-login" v-if="isLoginMode">
            <input type="checkbox" v-model="autoLogin" /> 自动登录
          </label>
          <div class="footer-links">
            <a
              href="#"
              class="forgot-link"
              v-if="isLoginMode"
              @click.prevent="switchToRegister"
            >
              前去注册
            </a>
            <a href="#" class="forgot-link" v-if="isLoginMode">忘记密码</a>
            <a
              href="#"
              class="forgot-link"
              v-else
              @click.prevent="switchToLogin"
            >
              已有账号，去登录
            </a>
          </div>
        </div>

        <p v-if="errorMessage" class="message error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="message success">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const autoLogin = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isLoginMode = ref(true)

const resetForm = () => {
  username.value = ''
  password.value = ''
  confirmPassword.value = ''
  autoLogin.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

const setMode = (mode: 'login' | 'register') => {
  isLoginMode.value = mode === 'login'
  resetForm()
}

const switchToRegister = () => {
  setMode('register')
}

const switchToLogin = () => {
  setMode('login')
}

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch('http://127.0.0.1:10522/app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (response.ok) {
      const data = await response.json()
      successMessage.value = '登录成功！'
      console.log('登录成功:', data)
    } else {
      errorMessage.value = '登录失败，请检查账号和密码。'
    }
  } catch (error) {
    errorMessage.value = '网络错误，请稍后重试。'
    console.error('登录错误:', error)
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致。'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await fetch('http://127.0.0.1:10522/app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (response.ok) {
      const data = await response.json()
      successMessage.value = '注册成功，请登录！'
      console.log('注册成功:', data)
      setMode('login')
    } else {
      errorMessage.value = '注册失败，请稍后重试。'
    }
  } catch (error) {
    errorMessage.value = '网络错误，请稍后重试。'
    console.error('注册错误:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.85), transparent 35%),
    radial-gradient(circle at bottom right, rgba(255, 106, 106, 0.12), transparent 20%),
    linear-gradient(180deg, #eef5fb 0%, #f6fbff 100%);
}

.login-panel {
  width: min(480px, 100%);
  background: white;
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(20, 35, 70, 0.12);
  overflow: hidden;
}

.panel-title {
  padding: 32px 32px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2738;
  text-align: center;
}

.login-card {
  padding: 30px 32px 36px;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 24px 0 28px;
}

.tab {
  padding: 10px 18px;
  border: none;
  border-radius: 999px;
  background: #f4f7fb;
  color: #67748e;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab.active {
  background: #fff5ef;
  color: #ff6200;
  box-shadow: 0 10px 25px rgba(255, 98, 0, 0.12);
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8faff;
  border: 1px solid #e5ecf9;
  border-radius: 14px;
  padding: 12px 16px;
  margin-bottom: 18px;
}

.field-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e6eeff;
  color: #4d6ef2;
  font-size: 16px;
}

input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #222b45;
  outline: none;
}

input::placeholder {
  color: #9aa3b8;
}

button {
  width: 100%;
  padding: 14px 16px;
  margin-top: 8px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #ff6200, #ff8530);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 30px rgba(255, 98, 0, 0.2);
}

button:disabled {
  background: #d8dbe6;
  cursor: not-allowed;
  box-shadow: none;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
  color: #6d7588;
  font-size: 13px;
}

.footer-links {
  display: flex;
  gap: 18px;
  align-items: center;
}

.auto-login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.auto-login input {
  width: 14px;
  height: 14px;
  accent-color: #ff6200;
}

.forgot-link {
  color: #8a96b4;
  text-decoration: none;
}

.forgot-link:hover {
  color: #ff6200;
}

.message {
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  margin-top: 20px;
}

.error {
  background: rgba(255, 106, 106, 0.12);
  color: #d44444;
}

.success {
  background: rgba(81, 207, 102, 0.12);
  color: #2f8c57;
}
</style>