<template>
  <div class="answer-book-page">
    <!-- 左上角返回按钮 -->
    <div class="header-controls">
      <button @click="goBack" class="back-btn">← 返回</button>
    </div>

    <!-- 魔法书显示区域 -->
    <div class="book-container">
      <!-- 魔法书 -->
      <div class="magic-book" @click="getAnswer" :class="{ opening: isOpening, answered: hasAnswer }">
        <div class="book-spine"></div>
        <div class="book-left">
          <div class="book-cover">
            <div class="book-title">答案</div>
            <div class="book-decoration">✨</div>
          </div>
        </div>
        <div class="book-right">
          <div v-if="!hasAnswer" class="book-pages">
            <p>点击打开</p>
          </div>
          <div v-else class="book-answer">
            <p>{{ currentAnswer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示文字 -->
    <div class="hint-text">
      <p>在心中思考一个问题，点击答案之书寻求答案</p>
    </div>

    <!-- 重新提问按钮 -->
    <div class="action-buttons" v-if="hasAnswer">
      <button @click="resetAnswer" class="reset-btn">重新提问</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpening = ref(false)
const hasAnswer = ref(false)
const currentAnswer = ref('')

const answers = [
  '是的，当然可以。',
  '不太可能。',
  '再想想吧。',
  '绝对会的。',
  '前景不太好。',
  '现在不行，但以后可能。',
  '很有可能。',
  '别指望了。',
  '问题有点模糊，再问一次。',
  '坚定地相信是的。',
  '我的答案是否定的。',
  '你可以相信这一点。',
  '最好不要问。',
  '展望是不确定的。',
  '是的，在我的计算中。',
  '集中精力再问。',
  '不要在此时计算。',
  '很好很好。',
  '我的消息来源说不是。',
  '前景不确定。'
]

const getAnswer = async () => {
  if (isOpening.value) return
  
  isOpening.value = true
  
  // 模拟打开书的动画时间
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * answers.length)
    currentAnswer.value = answers[randomIndex]
    hasAnswer.value = true
    isOpening.value = false
  }, 800)
}

const resetAnswer = () => {
  hasAnswer.value = false
  currentAnswer.value = ''
  isOpening.value = false
}

const goBack = () => {
  router.push('/features')
}
</script>

<style scoped>
.answer-book-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.header-controls {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
}

.back-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-2px);
}

.book-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 80px;
}

.magic-book {
  width: 300px;
  height: 400px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease;
}

.magic-book:hover {
  transform: scale(1.05);
}

.magic-book.opening {
  animation: openBook 0.8s ease-in-out forwards;
}

.book-spine {
  position: absolute;
  left: 50%;
  top: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(to right, #8B4513, #DAA520, #8B4513);
  transform: translateX(-50%);
  z-index: 5;
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.5), 3px 0 10px rgba(0, 0, 0, 0.5);
}

.book-left,
.book-right {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-left {
  left: 0;
  transform-origin: right center;
  transition: none;
}

.magic-book.opening .book-left {
  transform: rotateY(0deg);
}

.book-right {
  right: 0;
  transform-origin: left center;
  transition: transform 0.8s ease-in-out;
}

.magic-book.opening .book-right {
  transform: rotateY(-180deg);
}

.book-cover {
  width: 95%;
  height: 95%;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
  border: 3px solid #DAA520;
}

.book-cover::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border: 2px solid #FFD700;
  border-radius: 2px;
  pointer-events: none;
}

.book-cover::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 215, 0, 0.05) 2px,
      rgba(255, 215, 0, 0.05) 4px
    );
  pointer-events: none;
}

.book-title {
  font-size: 32px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 4px;
  z-index: 1;
  font-family: 'Georgia', serif;
  font-style: italic;
}

.book-decoration {
  font-size: 48px;
  animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite;
  z-index: 1;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.book-pages {
  width: 95%;
  height: 95%;
  background: linear-gradient(to right, #F5E6D3 0%, #FFF8DC 100%);
  border-radius: 2px;
  padding: 40px 30px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #DAA520;
}

.book-pages::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(0, 0, 0, 0.02) 20px,
      rgba(0, 0, 0, 0.02) 21px
    );
  pointer-events: none;
}

.book-pages p {
  color: #999;
  font-size: 16px;
  text-align: center;
  position: relative;
  z-index: 1;
  font-family: 'Georgia', serif;
}

.book-answer {
  width: 95%;
  height: 95%;
  background: linear-gradient(to right, #F5E6D3 0%, #FFF8DC 100%);
  border-radius: 2px;
  padding: 40px 30px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.6s ease-in-out;
  border: 1px solid #DAA520;
}

.book-answer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(0, 0, 0, 0.02) 20px,
      rgba(0, 0, 0, 0.02) 21px
    );
  pointer-events: none;
}

.book-answer p {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  max-width: 90%;
  font-family: 'Georgia', serif;
}

.hint-text {
  position: relative;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  letter-spacing: 0.5px;
  margin-top: 30px;
}

.hint-text p {
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  position: absolute;
  bottom: 40px;
}

.reset-btn {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@keyframes openBook {
  0% {
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)) brightness(1);
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)) brightness(1.2);
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)) brightness(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .magic-book {
    width: 220px;
    height: 300px;
  }

  .book-title {
    font-size: 24px;
  }

  .book-decoration {
    font-size: 36px;
  }

  .book-pages p,
  .book-answer p {
    font-size: 14px;
  }

  .hint-text {
    font-size: 12px;
  }

  .header-controls {
    top: 20px;
    left: 20px;
  }
}
</style>
