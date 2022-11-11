import request from '@/utils/request'

export function searchAlgorithmByCondition(params) {
  return request({
    url: '/api/algorithm',
    method: 'get',
    params: params
  })
}

export function addAlgorithm(data) {
  return request({
    url: '/api/algorithm',
    method: 'post',
    data
  })
}

export function alterAlgorithm(params, data) {
  return request({
    url: '/api/algorithm',
    method: 'put',
    params: params,
    data
  })
}

export function deleteAlgorithm(params) {
  return request({
    url: '/api/algorithm',
    method: 'delete',
    params: params
  })
}