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
    url: '/api/algorithm/upload',
    method: 'post',
    data,
    headers: {'Content-Type':  "multipart/form-data"}
  })
}

export function alterAlgorithmInfo(params, data) {
  return request({
    url: '/api/algorithm/info',
    method: 'put',
    params: params,
    data
  })
}

export function alterAlgorithmFile(params, data) {
  return request({
    url: '/api/algorithm/algorithm_file',
    method: 'post',
    params: params,
    data,
    headers: {'Content-Type':  "multipart/form-data"}
  })
}

export function deleteAlgorithm(params) {
  return request({
    url: '/api/algorithm',
    method: 'delete',
    params: params
  })
}