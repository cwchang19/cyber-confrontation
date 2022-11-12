import request from '@/utils/request'

export function searchFiles(params) {
  return request({
    url: '/api/file',
    methon: 'get',
    params: params
  })
}