<template>
  <div class="luck-draw-app">
    <div class="config-section" v-if="!spinning">
      <h2 class="title">🌿 {{ title || '幸运草抽奖' }}</h2>
      <input v-model="title" placeholder="输入活动名称" class="m-input" />
      <textarea v-model="namesInput" placeholder="输入名单(每行一个)" class="m-textarea"></textarea>
      
      <div class="btn-group">
        <button @click="handleCreate" class="btn-main">更新名单</button>
        <button @click="reset" class="btn-sub">重置</button>
      </div>
    </div>

    <div class="wheel-section">
      <div v-if="created" class="wheel-box">
        <div class="m-pointer"></div>
        <div class="m-wheel" :style="{ transform: `rotate(${rotateDeg}deg)` }" @click="startDraw">
          <div class="m-canvas" :style="wheelStyle">
            <div v-for="(item, index) in names" :key="index" class="m-item" :style="getLabelStyle(index)">
              {{ item }}
            </div>
          </div>
          <div class="m-center">GO</div>
        </div>
        <p class="m-tip">点击转盘开始抽奖</p>
      </div>
      
      <div v-if="history.length > 0" class="m-history">
        <span>最近中奖：</span>
        <strong v-for="(h, i) in history.slice(-2)" :key="i">{{ h }} </strong>
      </div>
    </div>

    <div v-if="showWinnerModal" class="m-modal" @click="showWinnerModal = false">
      <div class="m-modal-card" @click.stop>
        <p>🎉 恭喜中奖</p>
        <div class="m-winner">{{ winner }}</div>
        <button class="btn-main" @click="showWinnerModal = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const title = ref('')
const namesInput = ref('日日倾\njay\n仙女\n开开\n欢喜\n发财')
const names = ref([])
const created = ref(true)
const history = ref([])
const rotateDeg = ref(0)
const winner = ref('')
const spinning = ref(false)
const showWinnerModal = ref(false)

const colors = ['#A7F3D0', '#FDE68A', '#BFDBFE', '#DDD6FE', '#FECACA', '#FED7AA']

const handleCreate = () => {
  const list = namesInput.value.split('\n').map(i => i.trim()).filter(Boolean)
  if (list.length < 2) return alert('最少2人')
  names.value = list
  created.value = true
}
handleCreate()

const wheelStyle = computed(() => {
  let g = 'conic-gradient('
  names.value.forEach((_, i) => {
    const s = (i * 360) / names.value.length
    const e = ((i + 1) * 360) / names.value.length
    g += `${colors[i % colors.length]} ${s}deg ${e}deg${i === names.value.length - 1 ? '' : ','}`
  })
  return { background: g + ')' }
})

const getLabelStyle = (i) => {
  const per = 360 / names.value.length
  return { transform: `translate(-50%, -50%) rotate(${i * per + per / 2}deg) translateY(-80px)` }
}

const startDraw = () => {
  if (spinning.value) return
  spinning.value = true
  const idx = Math.floor(Math.random() * names.value.length)
  const per = 360 / names.value.length
  rotateDeg.value += 360 * 5 + (360 - (idx * per + per / 2) - (rotateDeg.value % 360))
  setTimeout(() => {
    winner.value = names.value[idx]
    history.value.push(winner.value)
    spinning.value = false
    showWinnerModal.value = true
  }, 3000)
}

const reset = () => { history.value = []; rotateDeg.value = 0; namesInput.value = '' }
</script>

<style scoped>
/* 极简兼容布局 */
.luck-draw-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background: #fcfdfd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
}

/* 配置区 */
.config-section {
  background: #fff;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.title { color: #2d5a27; font-size: 1.2rem; margin-bottom: 15px; text-align: center; }

.m-input, .m-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  font-size: 14px;
}
.m-textarea { height: 100px; }

.btn-group { display: flex; gap: 10px; }
.btn-main {
  flex: 2; background: #42b983; color: white; border: none;
  padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer;
}
.btn-sub {
  flex: 1; background: #eee; border: none; padding: 12px; border-radius: 8px; cursor: pointer;
}

/* 转盘区 */
.wheel-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.wheel-box { position: relative; width: 300px; height: 300px; margin: 20px 0; }
.m-pointer {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  z-index: 10; width: 20px; height: 30px; background: #42b983;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
}

.m-wheel {
  width: 100%; height: 100%; border-radius: 50%; border: 8px solid white;
  box-shadow: 0 0 20px rgba(0,0,0,0.1); position: relative;
  transition: transform 3s cubic-bezier(0.1, 0, 0.2, 1);
  overflow: hidden;
}

.m-canvas { width: 100%; height: 100%; }
.m-item {
  position: absolute; top: 50%; left: 50%; font-size: 12px;
  font-weight: bold; color: #333; white-space: nowrap;
}

.m-center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 50px; height: 50px; background: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; color: #42b983; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.m-tip { color: #999; font-size: 12px; margin-top: 10px; }

.m-history { background: #f0f7f3; padding: 8px 15px; border-radius: 20px; font-size: 13px; color: #666; }

/* 弹窗修复 */
.m-modal {
  position: fixed; inset: 0; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center; z-index: 999;
}
.m-modal-card {
  background: white; padding: 30px; border-radius: 20px; text-align: center; width: 260px;
}
.m-winner { font-size: 32px; font-weight: bold; color: #42b983; margin: 15px 0 25px; }
</style>