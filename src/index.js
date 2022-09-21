import { createApp } from 'vue'
import PreviewContent from './index.vue'

let state = null // 预览组件内部的状态数据
/**
 * 通过use调用时挂载到vue实例
 * @param {Object} App
 */
export default function install(App) {
  initialize()
  App.config.globalProperties.$preview = preview
}
/**
 * @param {String|Number} current 当前预览的图片索引或者url
 * @param {Array} list 需要预览的图片数组 非必传 如果不传的话 current必须为url 不能为索引
 * @param {String} key 如果list里面的item是图片的url 则不需要，如果是对象的话，需传图片的在对象中的key。
 */
export function preview(current = '', list = [], key = '') {
  if (state === null) {
    initialize()
  }
  if (current === '' || current === null || current === undefined) {
    throw 'Vue3PreviewImage：请传入参数'
  } else if (typeof current === 'number') {
    if (!list || !list.length) {
      throw 'Vue3PreviewImage：参数错误，第一个参数为索引时，请在第二个参数中传入数组'
    }
    state.currentImg = key ? list[current][key] : list[current]
  } else {
    state.currentImg = current
    if (!list.length) {
      state.imgList = [current]
    }
  }
  state.imgList = list
  state.imgKey = key
  state.show = true
}

export function closePreview() {
  if (state !== null && state.show) {
    state.show = false
  }
}

/**
 * 初始化
 */
function initialize() {
  const instance = createApp(PreviewContent)
  const box = document.createElement('div')
  document.body.appendChild(box)
  state = instance.mount(box)
}
