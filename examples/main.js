import { createApp } from 'vue'
import App from './App.vue'
import Vue3PreviewImage, { setPreviewDefaultOptions } from '../src/index'

createApp(App).use(Vue3PreviewImage).mount('#app')

setPreviewDefaultOptions({
  enabledMaskClose: false, // 开启点击遮罩关闭
  enabledEscClose: false, // 开启esc按键关闭
  enabledMouseZoom: false, // 开启鼠标滚轮缩放
  activeColor: 'green' // 预览图中选中图片的背景颜色
})
