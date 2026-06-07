import axios from 'axios'

export interface RecordItem {
  id: number | string
  content: string
  create_time?: string
  createTime?: string
  createdAt?: string
}

export interface RecordsPage {
  page: number
  pageSize: number
  total: number
  pages: number
  records: RecordItem[]
}

const emptyRecordsPage = (page = 1, pageSize = 10): RecordsPage => ({
  page,
  pageSize,
  total: 0,
  pages: 0,
  records: []
})

const normalizeRecordsPage = (data: unknown, page: number, pageSize: number): RecordsPage => {
  if (!data || typeof data !== 'object') {
    return emptyRecordsPage(page, pageSize)
  }

  const payload = data as Partial<RecordsPage>

  return {
    page: Number(payload.page) || page,
    pageSize: Number(payload.pageSize) || pageSize,
    total: Number(payload.total) || 0,
    pages: Number(payload.pages) || 0,
    records: Array.isArray(payload.records) ? payload.records : []
  }
}

export const addRecord = async (content: string) => {
  const response = await axios.post('/api/records', { content })
  return response.data
}

export const getRecords = async (page = 1, pageSize = 10) => {
  const response = await axios.get('/api/records', {
    params: {
      page,
      pageSize
    }
  })

  return normalizeRecordsPage(response.data, page, pageSize)
}

export const deleteRecord = async (id: number | string) => {
  const response = await axios.delete(`/api/records/${id}`)
  return response.data
}
