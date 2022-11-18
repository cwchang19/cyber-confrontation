import request from '@/utils/request'

export function searchTraining(params) {
  return request({
    url: '/api/training',
    method: 'get',
    params: params
  })
}

export function searchTrainingById(id) {
  return request({
    url: '/api/training/' + id,
    method: 'get'
  })
}

export function searchTrainingAll() {
  return request({
    url: '/api/training/all',
    method: 'get'
  })
}

export function addTraining(data) {
  return request({
    url: '/api/training/',
    method: 'post',
    data
  })
}

export function deleteTraining(id) {
  return request({
    url: '/api/training/' + id,
    method: 'delete'
  })
}

export function downloadTraining(params) {
  return request({
    url: '/api/training/download/',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}

export function pauseTraining(id) {
  return request({
    url: '/api/training/pause/' + id,
    method: 'get'
  })
}

export function continueTraining(id) {
  return request({
    url: '/api/training/continue/' + id,
    method: 'get'
  })
}

export function restartTraining(id) {
  return request({
    url: '/api/training/restart/' + id,
    method: 'get'
  })
}

export function renameTraining(id, params) {
  return request({
    url: '/api/training/rename/' + id,
    method: 'get',
    params: params
  })
}

export function debugTraining(id) {
  return request({
    url: '/api/training/debug/' + id,
    method: 'get'
  })
}