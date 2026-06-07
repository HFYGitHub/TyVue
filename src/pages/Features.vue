<template>
  <div class="features-page">
    <div class="header-logo">
      <h2>Ty Web</h2>
    </div>

    <div class="features-container">
      <h1 class="page-title">功能中心</h1>

      <div class="time-section">
        <div class="time-flip-box">
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(0, 2) }}</div>
            <div class="unit-label">小时</div>
          </div>
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(2, 4) }}</div>
            <div class="unit-label">分钟</div>
          </div>
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(4, 6) }}</div>
            <div class="unit-label">秒</div>
          </div>
        </div>
      </div>

      <div class="functions-grid">
        <button
          v-for="func in functions"
          :key="func.id"
          class="function-card"
          type="button"
          @click="handleFunctionClick(func.path)"
        >
          <span class="function-icon">{{ func.icon }}</span>
          <span class="function-name">{{ func.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('000000')

const functions = [
  { id: 1, name: '抽奖', icon: '🎁', path: '/lucky-draw' },
  { id: 2, name: '答案之书', icon: '📖', path: '/answer-book' },
  { id: 3, name: '临时剪贴板', icon: '📋', path: '/clipboard/view' },
  { id: 4, name: '待开发', icon: '✨', path: '' }
]

const handleFunctionClick = (path: string) => {
  if (path) {
    router.push(path)
  }
}

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${hours}${minutes}${seconds}`
}

let timeInterval: ReturnType<typeof setInterval>

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style scoped>
.features-page {
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.header-logo {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
}

.header-logo h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  letter-spacing: 0;
}

.features-container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.page-title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #1f2738;
  margin: 0 0 60px;
  letter-spacing: 0;
}

.time-section {
  display: flex;
  justify-content: center;
  margin-bottom: 80px;
}

.time-flip-box {
  display: flex;
  gap: 60px;
  justify-content: center;
  align-items: flex-start;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.time-value {
  width: 80px;
  height: 80px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  color: #333;
  font-family: 'Courier New', monospace;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.unit-label {
  font-size: 12px;
  font-weight: 600;
  color: #999;
}

.functions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-top: 40px;
  margin-top: 40px;
  border-top: 1px solid #e5e7eb;
}

.function-card {
  background: white;
  border-radius: 8px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.function-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.function-icon,
.function-name {
  display: block;
}

.function-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.function-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2738;
}

@media (max-width: 600px) {
  .header-logo {
    top: 20px;
    left: 20px;
  }

  .header-logo h2 {
    font-size: 18px;
  }

  .page-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .time-flip-box {
    gap: 20px;
  }

  .time-value {
    width: 65px;
    height: 65px;
    font-size: 28px;
  }

  .functions-grid {
    gap: 16px;
    margin-top: 30px;
  }

  .function-card {
    padding: 20px 15px;
  }
}
</style>
