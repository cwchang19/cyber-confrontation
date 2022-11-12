import request from '@/utils/request'

export function searchTraining(params) {
  return request({
    url: '/api/training',
    method: 'get',
    params: params
  })
}

export function addTraining(data) {
  return request({
    url: '/api/training',
    method: 'post',
    data
  })
}

export function deleteTraining(params) {
  return request({
    url: '/api/training',
    method: 'delete',
    params: params
  })
}
