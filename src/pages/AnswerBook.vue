<template>
  <div class="answer-book-page">
    <div class="header-controls">
      <button @click="goBack" class="back-btn">← 返回</button>
    </div>

    <div class="book-container">
      <div 
        class="magic-book" 
        @click="getAnswer" 
        :class="{ 
          'is-opening': isOpening, 
          'is-answered': hasAnswer 
        }"
      >
        <div class="book-spine"></div>

        <div class="book-cover-layer">
          <div class="book-cover-content">
            <div class="book-title">答案</div>
            <div class="book-decoration">✨</div>
            <p class="click-hint">点击开启命运</p>
          </div>
        </div>

        <div class="book-page-layer">
          <div v-if="hasAnswer" class="answer-content">
            <p class="answer-text">{{ currentAnswer }}</p>
          </div>
          <div v-else class="loading-state">
            <div class="sparkles">✨✨✨</div>
            <p>正在寻找答案...</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-area">
      <div class="hint-text" v-if="!hasAnswer">
        <p>在心中思考一个问题</p>
        <p>点击答案之书寻求启示</p>
      </div>
      
      <div class="action-buttons" v-if="hasAnswer">
        <button @click="resetAnswer" class="reset-btn">重新提问</button>
      </div>
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

const answers = ["是的","不是","也许","再等等","顺其自然","大胆一点","不建议","可以尝试","时机未到","相信直觉","需要更多信息","结果会很好","结果不如预期","放轻松","坚持下去","放弃","改变方向","重新开始","别着急","慢一点","快行动",
"机会来了","暂时不要行动","专注自己","听从内心","多问别人","保持沉默","表达出来","等待时机","行动胜于空想","结果不重要","过程更重要","会成功","会失败","值得一试","不值得","情况复杂","一切顺利","小心谨慎","大胆突破","相信自己",
"别太自信","好运即将到来","需要努力","坚持到底","适可而止","不要后悔","未来可期","情况不明","再考虑一下","换个角度","值得等待","不必执着","随遇而安","行动吧","停下来","现在不是时候","机会就在眼前","你已经知道答案","保持耐心",
"勇敢一点","冷静分析","相信运气","不要冒险","可以冒险","事情会有转机","没有结果","答案就在细节里","继续观察","很快会明朗","不要勉强","值得信任","需要怀疑","听听别人的意见","坚持自己的想法","不要急于决定","马上决定","结果出乎意料",
"平淡无奇","会有惊喜","没有惊喜","值得期待","降低期待","结果在你手中","交给时间","不必多想","多想一步","一切都会过去","现在就行动","等一等","不要犹豫","保持理性","跟随感觉","需要计划","随机应变","稳扎稳打","大胆创新","暂缓执行",
"继续推进","可能有风险","风险可控","结果未知","前景乐观","前景不明","顺利进行","困难重重","值得信赖","保持警惕","一切正常","情况特殊","尝试新方法","保持现状","做出改变","等待机会","创造机会","你会后悔","不会后悔","值得冒险",
"不值得冒险","很快有结果","需要很久","不确定","可以确定","答案是否定的","答案是肯定的","不要强求","顺其自然","尝试不同路径","坚持原计划","有隐藏因素","表面即真相","多观察","少干预","结果取决于你","结果已注定","需要帮助","独立完成",
"适合合作","不适合合作","值得投入","减少投入","机会稍纵即逝","机会还会再来","大胆表达","保持低调","结果令人满意","结果一般","结果不理想","值得坚持","不必坚持","改变策略","保持策略","你会成功","成功概率不高","值得期待","无需期待",
"谨慎前行","放心前行","需要时间沉淀","立即见效","机会隐藏着","机会明显","不要忽视细节","抓住重点","调整心态","坚持心态","冷静处理","热情投入","理性优先","感性优先","结果取决于选择","不要轻易选择","勇敢做决定","再等等看","会有突破",
"难有进展","保持信心","降低期望","你在正确的路上","需要调整方向","机会在远方","机会在身边","事情会变好","事情会变差","继续努力","适当放松","多听建议","少听干扰","结果令人惊喜","结果平平","隐藏的答案","显而易见的答案","需要勇气",
"需要智慧","行动决定结果","等待决定结果","你会明白","现在还不明白","未来会更好","保持现状即可","适合改变","不适合改变","值得相信","不要相信","继续探索","停止探索","答案很简单","答案很复杂","需要更多努力","不需要太多努力","你会找到答案",
"答案不会出现","顺利达成","难以达成","避免冒险","机会即将消失","机会刚刚开始","你已经准备好了","还需要准备","未来未知","未来可控","行动带来改变","保持不变更好","需要主动争取","值得信任的人","需要警惕的人","你会满意","可能失望",
"结果与你有关","结果与你无关","事情简单","事情复杂","保持初心","调整目标","成功不易","需要坚持","大胆尝试","谨慎选择","时间会证明","时间不够","结果明确","结果模糊","你会理解","暂时不理解","值得等待","无需等待","会有好消息","没有消息",
"相信过程","只看结果","有阻碍","可以解决","难以解决","答案在未来","答案在现在","不要执着","坚持到底","有转机","没有转机","不值得信赖","适合开始","暂不开始","有好结果","结果一般","不要冲动","适当冲动","你会明白一切","现在无法理解",
"一切刚刚开始","已经结束","值得庆祝","无需庆祝"];

const getAnswer = async () => {
  if (isOpening.value || hasAnswer.value) return
  
  isOpening.value = true
  
  // 模拟仪式感延迟
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * answers.length)
    currentAnswer.value = answers[randomIndex]
    hasAnswer.value = true
    isOpening.value = false
  }, 1200)
}

const resetAnswer = () => {
  hasAnswer.value = false
  currentAnswer.value = ''
  isOpening.value = false
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.answer-book-page {
  min-height: 100vh;
  /* 魔法感的渐变色 */
  background: radial-gradient(circle at center, #2d1b4e 0%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.header-controls {
  position: fixed;
  top: env(safe-area-inset-top, 20px);
  left: 20px;
  z-index: 100;
}

.back-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(5px);
  font-size: 14px;
}

.book-container {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 3 / 4;
  perspective: 1500px;
  margin-top: -20px;
}

.magic-book {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* 封面层 */
.book-cover-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #3d0a0a 0%, #1a0505 100%);
  border: 4px solid #daa520;
  border-radius: 8px 15px 15px 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  box-shadow: 10px 10px 30px rgba(0,0,0,0.5);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
}

/* 书本打开动画 */
.is-answered .book-cover-layer,
.is-opening .book-cover-layer {
  transform: rotateY(-110deg);
  opacity: 0.3;
  pointer-events: none;
}

.book-cover-content {
  text-align: center;
}

.book-title {
  font-size: 42px;
  color: #daa520;
  font-family: serif;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
  margin-bottom: 20px;
}

.book-decoration {
  font-size: 50px;
  animation: pulse 2s infinite;
}

.click-hint {
  color: rgba(218, 165, 32, 0.6);
  font-size: 12px;
  margin-top: 30px;
  letter-spacing: 2px;
}

/* 内容层 */
.book-page-layer {
  position: absolute;
  inset: 4px;
  background: #fdf5e6; /* 古典纸张色 */
  border-radius: 4px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-shadow: inset 0 0 50px rgba(0,0,0,0.1);
}

.answer-text {
  font-size: 26px;
  color: #2c3e50;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
  font-family: "STKaiti", "KaiTi", serif;
  animation: fadeIn 1s ease;
}

.loading-state {
  text-align: center;
  color: #8b4513;
}

.footer-area {
  margin-top: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80px;
}

.hint-text {
  color: rgba(255,255,255,0.5);
  font-size: 14px;
  line-height: 1.8;
  text-align: center;
}

.action-buttons {
  animation: slideUp 0.5s ease;
}

.reset-btn {
  padding: 12px 40px;
  background: #daa520;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
}

/* 动画库 */
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; text-shadow: 0 0 20px gold; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 适配超小屏幕 */
@media (max-width: 350px) {
  .book-container {
    max-width: 260px;
  }
  .book-title {
    font-size: 32px;
  }
}
</style>