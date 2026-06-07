<template>
  <main class="clipboard-page">
    <section class="clipboard-shell">
      <header class="clipboard-header">
        <div>
          <p class="eyebrow">在线临时剪贴板</p>
          <h1>添加内容</h1>
        </div>
        <router-link class="ghost-link" to="/clipboard/view">查看列表</router-link>
      </header>

      <form class="editor-panel" @submit.prevent="handleSave">
        <div class="type-tabs" role="tablist" aria-label="内容类型">
          <button
            class="type-tab"
            :class="{ active: contentType === 'text' }"
            type="button"
            @click="switchType('text')"
          >
            文本
          </button>
          <button
            class="type-tab"
            :class="{ active: contentType === 'image' }"
            type="button"
            @click="switchType('image')"
          >
            图片
          </button>
        </div>

        <textarea
          v-if="contentType === 'text'"
          v-model="content"
          placeholder="请输入要保存的内容"
          :disabled="saving"
        ></textarea>

        <div v-else class="image-panel">
          <label class="image-picker">
            <span>选择图片</span>
            <input
              type="file"
              accept="image/*"
              :disabled="saving"
              @change="handleImageChange"
            />
          </label>

          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="已选择的图片预览" />
            <button class="remove-image-btn" type="button" @click="clearImage">移除图片</button>
          </div>
          <div v-else class="image-empty">请选择一张图片</div>
        </div>

        <div class="actions">
          <button class="primary-btn" type="submit" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <router-link class="secondary-btn" to="/features">返回功能中心</router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addRecord } from '../api/record'

type ContentType = 'text' | 'image'

const content = ref('')
const imagePreview = ref('')
const contentType = ref<ContentType>('text')
const saving = ref(false)
const router = useRouter()

const switchType = (type: ContentType) => {
  contentType.value = type
}

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    input.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    imagePreview.value = String(reader.result || '')
  }
  reader.onerror = () => {
    alert('图片读取失败，请重新选择')
    input.value = ''
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imagePreview.value = ''
}

const handleSave = async () => {
  const value = contentType.value === 'text' ? content.value.trim() : imagePreview.value

  if (!value) {
    alert('内容不能为空')
    return
  }

  saving.value = true

  try {
    await addRecord(value)
    content.value = ''
    imagePreview.value = ''
    alert('保存成功')
    router.push('/clipboard/view')
  } catch (error) {
    console.error('保存剪贴板内容失败:', error)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.clipboard-page {
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #eef5fb 0%, #f8fbff 100%);
}

.clipboard-shell {
  width: min(800px, 100%);
  margin: 0 auto;
  text-align: left;
}

.clipboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #4f6fba;
  font-size: 14px;
  font-weight: 700;
}

h1 {
  margin: 0;
  color: #1f2738;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0;
}

.editor-panel {
  background: #ffffff;
  border: 1px solid #e5ecf9;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 18px 50px rgba(20, 35, 70, 0.08);
}

.type-tabs {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  margin-bottom: 16px;
  border: 1px solid #dbe4f2;
  border-radius: 8px;
  background: #f8fbff;
}

.type-tab {
  min-width: 84px;
  min-height: 36px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #536179;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.type-tab.active {
  background: #ffffff;
  color: #ff6200;
  box-shadow: 0 6px 18px rgba(20, 35, 70, 0.08);
}

textarea {
  width: 100%;
  min-height: 220px;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid #dbe4f2;
  border-radius: 8px;
  padding: 14px 16px;
  color: #1f2738;
  background: #fbfdff;
  font-size: 16px;
  line-height: 1.7;
  outline: none;
}

textarea:focus {
  border-color: #4f6fba;
  box-shadow: 0 0 0 3px rgba(79, 111, 186, 0.12);
}

.image-panel {
  display: grid;
  gap: 16px;
}

.image-picker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  background: #eef3fb;
  color: #31415f;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.image-picker input {
  display: none;
}

.image-empty,
.image-preview {
  min-height: 220px;
  border: 1px dashed #cbd8ea;
  border-radius: 8px;
  background: #fbfdff;
}

.image-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #78849a;
}

.image-preview {
  padding: 14px;
}

.image-preview img {
  display: block;
  max-width: 100%;
  max-height: 460px;
  margin: 0 auto;
  border-radius: 8px;
  object-fit: contain;
}

.remove-image-btn {
  display: block;
  margin: 14px auto 0;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dbe4f2;
  border-radius: 8px;
  background: #ffffff;
  color: #536179;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.primary-btn,
.secondary-btn,
.ghost-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
}

.primary-btn {
  background: #ff6200;
  color: #ffffff;
}

.primary-btn:disabled {
  background: #c8d0de;
  cursor: not-allowed;
}

.secondary-btn,
.ghost-link {
  background: #eef3fb;
  color: #31415f;
}

@media (max-width: 600px) {
  .clipboard-page {
    padding: 24px 14px;
  }

  .clipboard-header,
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .type-tabs,
  .image-picker {
    width: 100%;
    box-sizing: border-box;
  }

  .type-tab {
    flex: 1;
  }

  h1 {
    font-size: 28px;
  }
}
</style>
