<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>后台管理系统</h1>
      <div class="header-actions">
        <router-link to="/features" class="nav-link">功能中心</router-link>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </div>
    <div class="dashboard-content">
      <p>欢迎进入后台管理系统</p>
      <p>Token: {{ token }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref('')

onMounted(() => {
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token.value = storedToken
  }
})

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.dashboard-header h1 {
  margin: 0;
  color: #1f2738;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-link {
  padding: 10px 18px;
  background: #667eea;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.nav-link:hover {
  background: #5568d3;
}

.logout-btn {
  padding: 10px 20px;
  background: #ff6200;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background: #e55a00;
}

.dashboard-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-content p {
  color: #67748e;
  line-height: 1.8;
}
</style>
