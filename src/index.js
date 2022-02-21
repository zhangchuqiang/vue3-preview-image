import { createApp } from 'vue'
import Preview from './index.vue'
export default function install(App) {
  const instance = createApp(Preview)
  const box = document.createElement('div')
  document.body.appendChild(box)
  const state = instance.mount(box)
  /**
   *
   * @param {String|Number} current 当前预览的图片索引或者url
   * @param {Array} list 需要预览的图片数组 非必传 如果不传的话 current必须为url 不能为索引
   * @param {String} key 如果list里面的item是图片的url 则不需要，如果是对象的话，需传图片的在对象中的key。
   */
  App.config.globalProperties.$preview = (current = '', list = [], key = '') => {
    if (typeof current === 'number') {
      if (!list.length) {
        throw 'vue3preview：参数错误，如果请在第二个参数中传入数组'
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
}
