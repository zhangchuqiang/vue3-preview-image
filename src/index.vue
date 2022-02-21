<template>
  <div v-if="show" class="preview-wrap" @mousewheel="handerMousewheel">
    <div class="preview" @click="show = false">
      <img
        class="preview-content"
        :src="currentImg"
        :style="{ top: imgTop + 'px', left: imgLeft + 'px', transform: `scale(${imgScale}) rotateZ(${imgRotate}deg)` }"
        @click.stop="preventDefault"
        @mousedown="handleMoveStart"
      />
      <div class="preview-footer" @click.stop="preventDefault">
        <ul class="preview-footer-tools">
          <li v-if="imgList.length" @click="handleCut('last')"><img src="./assets/arrow-left.png" alt="" /></li>
          <li @click="handleRotate('left')"><img src="./assets/refresh-left.png" alt="" /></li>
          <li @click="imgScale = 1"><img src="./assets/real-size.png" alt="" /></li>
          <li @click="handleRotate('right')"><img src="./assets/refresh-right.png" alt="" /></li>
          <li v-if="imgList.length" @click="handleCut('next')"><img src="./assets/arrow-right.png" alt="" /></li>
        </ul>
        <div class="preview-footer-thumbs" v-if="imgList.length">
          <div
            v-for="(item, index) in imgList"
            :id="'thumb-item-' + index"
            :key="index"
            class="thumb-item"
            :class="{ active: currentImg === (imgKey ? item[imgKey] : item) }"
            @click="handleClickThumb(item, index)"
          >
            <img :src="imgKey ? item[imgKey] : item" />
          </div>
        </div>
      </div>
      <span class="close-icon">
        <img src="./assets/close.png" alt="" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false, // 是否显示预览
      currentImg: '', // 当前预览图片的url
      imgList: [], // 需要预览的图片数组
      imgKey: '', // 图片所在的数据的key
      imgTop: 0, // 图片定位置top
      imgLeft: 0, // 图片定位置left
      startPageX: 0, // 按下鼠标时当前鼠标所在位置x
      startPageY: 0, // 按下鼠标时当前鼠标所在位置y
      imgScale: 1, // 图片缩放
      imgRotate: 0 // 图片旋转
    }
  },
  watch: {
    show: {
      handler(v) {
        if (v) {
          document.body.style.overflow = 'hidden'
          document.addEventListener('mousemove', this.preventDefault, false)
        } else {
          document.body.style.overflow = ''
          document.removeEventListener('mousemove', this.preventDefault, false)
          document.removeEventListener('mouseup', this.clearEvent, false)
          this.reset()
        }
      },
      immediate: true
    },
    currentImg() {
      this.imgTop = 0
      this.imgLeft = 0
      this.imgScale = 1
      this.imgRotate = 0
    }
  },
  methods: {
    // 关闭时重置值
    reset() {
      this.imgList = []
      this.currentImg = ''
      this.imgKey = ''
      this.imgTop = 0
      this.imgLeft = 0
      this.startPageX = 0
      this.startPageY = 0
      this.imgScale = 1
      this.imgRotate = 0
    },
    // 旋转
    handleRotate(type) {
      if (type === 'left') {
        this.imgRotate -= 90
      } else {
        this.imgRotate += 90
      }
    },
    // 切换上一张或者下一张
    handleCut(type) {
      if (this.imgList.length < 2) return
      const currentIndex = this.imgList.findIndex(item => {
        const url = this.imgKey ? item[this.imgKey] : item
        return url === this.currentImg
      })
      let targetIndex = null
      if (type === 'last') {
        if (currentIndex === 0) {
          targetIndex = this.imgList.length - 1
        } else {
          targetIndex = currentIndex - 1
        }
      }
      if (type === 'next') {
        if (currentIndex === this.imgList.length - 1) {
          targetIndex = 0
        } else {
          targetIndex = currentIndex + 1
        }
      }
      const targetItem = this.imgList[targetIndex]
      this.currentImg = this.imgKey ? targetItem[this.imgKey] : targetItem
      this.handleXScroll(targetIndex)
    },
    // 使滚动条滚动到当前预览的那一张
    handleXScroll(index) {
      index = index < 4 ? 0 : index - 4
      const imgParentElement = document.querySelector('.preview-footer-thumbs')
      const imgWrapElement = document.querySelector('#thumb-item-' + index)
      imgParentElement.scrollLeft = imgWrapElement.offsetLeft
    },
    // 点击缩略图切换当前预览
    handleClickThumb(item, index) {
      const url = this.imgKey ? item[this.imgKey] : item
      this.currentImg = url
      this.handleXScroll(index)
    },
    // 鼠标滚轮缩放图片
    handerMousewheel(e) {
      // 火狐浏览器为e.detail 其他浏览器均为e.wheelDelta
      if ((e.wheelDelta > 0 || e.detail > 0) && this.imgScale < 4) {
        this.imgScale += 0.1
      } else if ((e.wheelDelta < 0 || e.detail < 0) && this.imgScale > 0.5) {
        this.imgScale += -0.1
      }
    },
    // 按下鼠标开始移动图片
    handleMoveStart(e) {
      const { pageX, pageY } = e
      this.startPageX = pageX - this.imgLeft
      this.startPageY = pageY - this.imgTop
      document.addEventListener('mousemove', this.handleMore, false)
      document.addEventListener('mouseup', this.clearEvent, false)
      e.preventDefault()
    },
    // 移除事件
    clearEvent() {
      document.removeEventListener('mousemove', this.handleMore, false)
    },
    // 按住鼠标移动时的处理
    handleMore(e) {
      const { pageX, pageY } = e
      this.imgTop = pageY - this.startPageY
      this.imgLeft = pageX - this.startPageX
      e.preventDefault()
    },
    // 阻止默认行为
    preventDefault(e) {
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.preview-wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.5);

  li {
    list-style: none;
  }

  .preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    &-content {
      position: relative;
      cursor: move;
      transition: 0.2s transform;
      max-height: 100vh;
    }
    &-footer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      &-tools {
        display: flex;
        justify-content: center;

        li {
          margin-right: 10px;
          padding: 10px;
          border-radius: 50%;
          background: rgba(110, 110, 110, 0.7);
          cursor: pointer;
          > img {
            display: block;
            width: 30px;
            height: 30px;
          }
          &:hover {
            i {
              color: #ef544e;
            }
          }
        }
      }

      &-thumbs {
        margin-top: 20px;
        max-width: 700px;
        overflow-x: auto;
        white-space: nowrap;

        .thumb-item {
          padding: 10px;
          margin-right: 10px;
          display: inline-block;
          background: rgba(102, 102, 102, 0.7);
          border-radius: 5px;
          cursor: pointer;
          img {
            width: 60px;
            height: 60px;
            object-fit: cover;
          }
          &.active {
            background: rgba(239, 84, 78, 0.7);
          }
        }
        &::-webkit-scrollbar {
          height: 10px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: #d2d2d2;
          cursor: pointer;
        }

        &::-webkit-scrollbar-track {
          border-radius: 10px;
          background: #fff;
        }
      }
    }
    .close-icon {
      padding: 10px;
      position: absolute;
      top: 30px;
      right: 30px;
      border-radius: 50%;
      background: rgba(110, 110, 110, 0.7);
      cursor: pointer;
      > img {
        display: block;
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>
