import request from '@/utils/request'

export function searchAllAlgorithm() {
  return request({
    url: '/api/algorithm/all',
    method: 'get',
    params: null,
  })
}

export function searchAlgorithmById(id) {
  return request({
    url: '/api/algorithm',
    method: 'get',
    params: { id }
  })
}

export function searchAlgorithmByCondition(algorithm_name, pageSize, page) {
  return request({
    url: '/api/algorithm',
    method: 'get',
    params: { algorithm_name, pageSize, page }
  })
}

export function deleteAlgorithmById(id) {
  return request({
    url: '/api/algorithm',
    method: 'delete',
    params: { id }
  })
}

export function alterAlgorithmById(id) {
  return request({
    url: '/api/algorithm',
    method: 'put',
    params: { id }
  })
}