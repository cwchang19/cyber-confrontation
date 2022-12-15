import request from '@/utils/request'

export function searchActionByCondition(params) {
  return request({
    url: '/api/action/',
    method: 'get',
    params: params
  })
}

export function searchActionAll() {
  return request({
    url: '/api/action/all',
    method: 'get',
  })
}