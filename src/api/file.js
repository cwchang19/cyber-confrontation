import request from '@/utils/request'

export function searchFileById(params) {
  return request({
    url: '/api/file',
    method: 'get',
    params: params
  })
}