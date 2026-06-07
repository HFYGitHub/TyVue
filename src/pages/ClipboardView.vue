<template>
  <main class="clipboard-page">
    <section class="clipboard-shell">
      <header class="clipboard-header">
        <div>
          <p class="eyebrow">在线临时剪贴板</p>
          <h1>内容列表</h1>
        </div>
        <div class="header-actions">
          <router-link class="ghost-link" to="/clipboard/add">添加内容</router-link>
          <router-link class="ghost-link muted" to="/features">返回功能中心</router-link>
        </div>
      </header>

      <div class="list-toolbar">
        <span>共 {{ total }} 条</span>
        <label>
          每页
          <select v-model.number="pageSize" :disabled="loading" @change="changePageSize">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
          </select>
          条
        </label>
      </div>

      <div v-if="loading" class="empty-state">加载中...</div>
      <div v-else-if="records.length === 0" class="empty-state">暂无内容</div>

      <div v-else class="record-list">
        <article v-for="record in records" :key="record.id" class="record-card">
          <div v-if="isImageContent(record.content)" class="image-placeholder">
            <div>
              <p class="image-title">图片内容</p>
              <p class="image-meta">点击查看时再加载预览</p>
            </div>
            <button type="button" @click="previewImage(record.content)">查看图片</button>
          </div>
          <p v-else class="record-content">{{ record.content }}</p>

          <footer class="record-footer">
            <time>{{ getCreateTime(record) }}</time>
            <div class="card-actions">
              <button type="button" title="复制" @click="copyContent(record.content)">📋</button>
              <button type="button" title="删除" @click="handleDelete(record.id)">🗑️</button>
            </div>
          </footer>
        </article>
      </div>

      <nav class="pagination" aria-label="分页">
        <button type="button" :disabled="loading || page <= 1" @click="goToPage(page - 1)">
          上一页
        </button>
        <span>第 {{ page }} / {{ displayPages }} 页</span>
        <button type="button" :disabled="loading || page >= pages" @click="goToPage(page + 1)">
          下一页
        </button>
      </nav>
    </section>

    <div v-if="previewImageSrc" class="preview-mask" @click="closePreview">
      <div class="preview-dialog" @click.stop>
        <button class="preview-close" type="button" @click="closePreview">关闭</button>
        <img :src="previewImageSrc" alt="剪贴板图片预览" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { deleteRecord, getRecords, type RecordItem } from '../api/record'

const records = ref<RecordItem[]>([])
const loading = ref(false)
const previewImageSrc = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const pages = ref(0)

const displayPages = computed(() => Math.max(pages.value, 1))

const isImageContent = (content: string) => {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(content)
}

const loadRecords = async () => {
  loading.value = true

  try {
    const result = await getRecords(page.value, pageSize.value)
    page.value = result.page
    pageSize.value = result.pageSize
    total.value = result.total
    pages.value = result.pages
    records.value = result.records

    if (page.value > 1 && records.value.length === 0) {
      await goToPage(page.value - 1)
    }
  } catch (error) {
    console.error('加载剪贴板列表失败:', error)
    records.value = []
    total.value = 0
    pages.value = 0
    alert('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goToPage = async (nextPage: number) => {
  if (nextPage < 1 || (pages.value > 0 && nextPage > pages.value)) {
    return
  }

  page.value = nextPage
  await loadRecords()
}

const changePageSize = async () => {
  page.value = 1
  await loadRecords()
}

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'readonly')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

const copyContent = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else if (!fallbackCopy(text)) {
      throw new Error('Fallback copy failed')
    }

    alert('已复制')
  } catch (error) {
    console.error('复制剪贴板内容失败:', error)
    alert('复制失败，请手动选择文本复制')
  }
}

const previewImage = (content: string) => {
  previewImageSrc.value = content
}

const closePreview = () => {
  previewImageSrc.value = ''
}

const handleDelete = async (id: number | string) => {
  if (!window.confirm('确定删除这条内容吗？')) {
    return
  }

  try {
    await deleteRecord(id)
    await loadRecords()
  } catch (error) {
    console.error('删除剪贴板内容失败:', error)
    alert('删除失败，请稍后重试')
  }
}

const getCreateTime = (record: RecordItem) => {
  return record.createTime || record.create_time || record.createdAt || '无创建时间'
}

onMounted(loadRecords)
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

.header-actions,
.pagination,
.list-toolbar {
  display: flex;
  gap: 10px;
}

.list-toolbar {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  color: #536179;
  font-size: 14px;
}

.list-toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.list-toolbar select {
  height: 34px;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  background: #ffffff;
  color: #31415f;
}

.ghost-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 8px;
  background: #ff6200;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-sizing: border-box;
}

.ghost-link.muted {
  background: #eef3fb;
  color: #31415f;
}

.empty-state {
  padding: 44px 20px;
  border: 1px dashed #cbd8ea;
  border-radius: 8px;
  color: #6b7890;
  background: #ffffff;
  text-align: center;
}

.record-list {
  display: grid;
  gap: 16px;
}

.record-card {
  padding: 20px;
  border: 1px solid #e5ecf9;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 34px rgba(20, 35, 70, 0.07);
}

.record-content {
  margin: 0;
  color: #1f2738;
  font-size: 16px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-word;
}

.image-placeholder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-height: 92px;
  padding: 18px;
  border: 1px dashed #cbd8ea;
  border-radius: 8px;
  background: #fbfdff;
}

.image-title {
  margin: 0 0 6px;
  color: #1f2738;
  font-size: 16px;
  font-weight: 700;
}

.image-meta {
  margin: 0;
  color: #78849a;
  font-size: 13px;
}

.image-placeholder button,
.pagination button {
  flex: 0 0 auto;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  background: #eef3fb;
  color: #31415f;
  font-weight: 700;
  cursor: pointer;
}

.pagination {
  justify-content: center;
  align-items: center;
  margin-top: 22px;
  color: #536179;
}

.pagination button:disabled {
  color: #9aa3b8;
  cursor: not-allowed;
  background: #f3f6fb;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
}

time {
  color: #78849a;
  font-size: 13px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions button {
  width: 38px;
  height: 38px;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  background: #f8fbff;
  cursor: pointer;
  font-size: 17px;
}

.card-actions button:hover,
.image-placeholder button:hover,
.pagination button:hover:not(:disabled) {
  border-color: #4f6fba;
  background: #eef3fb;
}

.preview-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(16, 24, 40, 0.72);
  box-sizing: border-box;
}

.preview-dialog {
  position: relative;
  width: min(900px, 100%);
  max-height: 90vh;
  padding: 54px 18px 18px;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;
  overflow: auto;
}

.preview-dialog img {
  display: block;
  max-width: 100%;
  max-height: 76vh;
  margin: 0 auto;
  border-radius: 8px;
  object-fit: contain;
}

.preview-close {
  position: absolute;
  top: 12px;
  right: 12px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #dce5f2;
  border-radius: 8px;
  background: #f8fbff;
  color: #31415f;
  cursor: pointer;
}

@media (max-width: 600px) {
  .clipboard-page {
    padding: 24px 14px;
  }

  .clipboard-header,
  .record-footer,
  .list-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .image-placeholder {
    flex-direction: column;
    align-items: stretch;
  }

  h1 {
    font-size: 28px;
  }

  .card-actions {
    justify-content: flex-end;
  }
}
</style>
