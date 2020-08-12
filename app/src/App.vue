<template>
  <div>
    <div>
      <input type="text" v-model="url">
      <button @click="getServerData">冲</button>
    </div>
    <div>
      <CheckList :data="data" :url="url"/>
    </div>
  </div>
</template>

<script>
import CheckList from './components/checkList.vue'
import { reactive, ref } from 'vue'
export default {
  name: 'App',
  components: {
    CheckList
  },
  setup() {
    const url = ref('http://39.98.70.84:8022/fms-server')
    const data = ref(null)
    const methonds = {
      getServerData() {
        const { value } = url
        fetch('http://localhost:520/getServerData', {
          body: JSON.stringify({url: value}),
          headers: {
            'content-type': 'application/json',
          },
          mode: 'cors',
          method: 'POST',
        }).then(res => {
          return res.json()
        }).then(value => {
          data.value = value   
        })
      }
    }
    return {
      url,
      data,
      ...methonds
    }
  }
}
</script>
