<template>
  <div class="container">
    <div class="top-btn">
      <a-button type="primary" @click="amplify">放大</a-button>
      <a-button type="primary" @click="reduce">缩小</a-button>
      <a-button @click="restore">还原</a-button>
    </div>

    <div class="box-wrap">
      <div class="change" :style="changStyle">
        <div class="content">
          变更盒子即内容
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'DemoScale',
  setup() {
    
    const styleObj = reactive({
      width: 100,
      height: 100,
      scale: 1
    })

    const changStyle = computed(() => {
      const width = styleObj.width < 100 ? 100 : styleObj.width;
      const height = styleObj.height < 100 ? 100 : styleObj.height;

      return {
        width: `${width}%`,
        height: `${height}%`,
        transform: `scale(${styleObj.scale})`
      }
    })

    const amplify = () => {
      styleObj.width *= 0.8;
      styleObj.height *= 0.8;
      styleObj.scale *= 1.25;
    }

    const reduce = () => {
      // styleObj.width *= 1.25;
      // styleObj.height *= 1.25;
      styleObj.scale *= 0.8;
    }

    const restore = () => {
      styleObj.width = 100;
      styleObj.height = 100;
      styleObj.scale = 1;

      // getAI();
    }

    const aiKey = ref('key');
    const headers = new Headers({
      accept: 'text/event-stream',
      'content-type': 'application/json;',
      'response-type': 'text/event-stream;',
      'Sec-Fetch-Mode': 'cors',
      Authorization: aiKey.value,
    });

    const getAI = () => {
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          stream: true,
          max_tokens: 3000,
          messages: [
            {
              role: 'user',
              content: '叫爸爸',
            },
          ],
        }),
        headers: headers,
      }).then(res => {
        console.log("=== res: ", res);
      }).catch(err => {
        console.log("=== err: ", err);
      })
    }

    return {
      changStyle,
      amplify,
      reduce,
      restore
    }
  },
})
</script>

<style lang="less" scoped>
.top-btn {
  display: flex;
  .ant-btn {
    margin: 0 8px;
  }
}

.box-wrap {
  position: relative;
  margin: 1em;
  height: 400px;
  width: 400px;
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 20px, linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 20px 20px;
  border: 1px solid blue;
  overflow: auto;
}
.change {
  padding-top: 1px;
  transform-origin: left top;
  background: #f5f5f5;
  box-sizing: border-box;
}
.content {
  margin-top: 20px;
  width: 500px;
  height: 200px;
  border: solid 1px #000;
  background: yellow;
}
</style>