import request from '@/utils/request'

export function searchAlgorithmByCondition(params) {
  return request({
    url: '/api/algorithm',
    method: 'get',
    params: params
  })
}

export function searchAlgorithmById(id) {
  return request({
    url: '/api/algorithm/' + id,
    method: 'get'
  })
}

export function searchAlgorithmAll() {
  return request({
    url: '/api/algorithm/all',
    method: 'get',
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

export function alterAlgorithmInfo(id, data) {
  return request({
    url: '/api/algorithm/info/' + id,
    method: 'put',
    data
  })
}

export function alterAlgorithmFile(id, data) {
  return request({
    url: '/api/algorithm/algorithm_file/' + id,
    method: 'post',
    data,
    headers: {'Content-Type':  "multipart/form-data"}
  })
}

export function deleteAlgorithm(id) {
  return request({
    url: '/api/algorithm/' + id,
    method: 'delete',
  })
}