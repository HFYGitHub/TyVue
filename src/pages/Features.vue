<template>
  <div class="features-page">
    <!-- 左上角标题 -->
    <div class="header-logo">
      <h2>Ty Web</h2>
    </div>

    <!-- 装饰插画 -->
    <div class="illustration">
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <!-- 气球 -->
        <circle cx="60" cy="80" r="25" fill="#FF6B6B" opacity="0.8"/>
        <line x1="60" y1="105" x2="60" y2="180" stroke="#999" stroke-width="2"/>
        
        <circle cx="150" cy="60" r="30" fill="#4ECDC4" opacity="0.8"/>
        <line x1="150" y1="90" x2="150" y2="180" stroke="#999" stroke-width="2"/>
        
        <circle cx="240" cy="90" r="22" fill="#FFE66D" opacity="0.8"/>
        <line x1="240" y1="112" x2="240" y2="180" stroke="#999" stroke-width="2"/>
        
        <!-- 云朵 -->
        <g opacity="0.6">
          <ellipse cx="80" cy="220" rx="35" ry="20" fill="#E8E8E8"/>
          <ellipse cx="110" cy="225" rx="30" ry="18" fill="#E8E8E8"/>
          <ellipse cx="50" cy="225" rx="25" ry="15" fill="#E8E8E8"/>
        </g>
        
        <!-- 星星装饰 -->
        <g fill="#FFE66D" opacity="0.5">
          <polygon points="20,40 25,50 35,50 27,57 30,67 20,61 10,67 13,57 5,50 15,50"/>
          <polygon points="270,180 273,188 282,188 275,194 278,202 270,197 262,202 265,194 258,188 267,188"/>
        </g>
      </svg>
    </div>

    <div class="features-container">
      <h1 class="page-title">系统功能中心</h1>
      
      <!-- 时间翻页显示 -->
      <div class="time-section">
        <div class="time-flip-box">
          <!-- 小时 -->
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(0, 2) }}</div>
            <div class="unit-label">小时</div>
          </div>

          <!-- 分钟 -->
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(2, 4) }}</div>
            <div class="unit-label">分钟</div>
          </div>

          <!-- 秒 -->
          <div class="time-unit">
            <div class="time-value">{{ currentTime.slice(4, 6) }}</div>
            <div class="unit-label">秒</div>
          </div>
        </div>
      </div>

      <!-- 功能选项 -->
      <div class="functions-grid">
        <div class="function-card" v-for="func in functions" :key="func.id" @click="handleFunctionClick(func)">
          <div class="function-icon">{{ func.icon }}</div>
          <div class="function-name">{{ func.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('000000')

const functions = ref([
  { id: 1, name: '抽奖', icon: '🎯' },
  { id: 2, name: '答案之书', icon: '👫' },
  { id: 3, name: '待开发', icon: '🎮' },
  { id: 4, name: '待开发', icon: '🎨' }
])

const handleFunctionClick = (func: any) => {
  if (func.id === 1) {
    router.push('/lucky-draw')
  }
  if (func.id === 2) {
    router.push('/answer-book')
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
  letter-spacing: 1px;
}

.illustration {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  width: 400px;
  height: 400px;
  opacity: 0.12;
  pointer-events: none;
}

.illustration svg {
  width: 100%;
  height: 100%;
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
  margin-bottom: 60px;
  letter-spacing: 2px;
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
  letter-spacing: 1px;
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
  border-radius: 12px;
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

.function-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.function-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2738;
}

@media (max-width: 768px) {
  .illustration {
    width: 300px;
    height: 300px;
    right: 10px;
    opacity: 0.08;
  }
}

@media (max-width: 600px) {
  .header-logo {
    top: 20px;
    left: 20px;
  }

  .header-logo h2 {
    font-size: 18px;
  }

  .illustration {
    display: none;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 40px;
  }

  .time-flip-box {
    gap: 30px;
  }

  .time-value {
    width: 65px;
    height: 65px;
    font-size: 28px;
  }

  .unit-label {
    font-size: 11px;
  }

  .functions-grid {
    gap: 16px;
    margin-top: 30px;
  }

  .function-card {
    padding: 20px 15px;
  }

  .function-icon {
    font-size: 32px;
  }

  .function-name {
    font-size: 14px;
  }
}
</style>

