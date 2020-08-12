<template>
    <div class="search">
      <input type="text" v-model="url">
      <button @click="getServerData">提交</button>
    </div>
    <div class="main">
      <CheckList :data="data" :url="url" ref="checkEl"/>
    </div>
    <button @click="submit" class="submit-button">确定</button>
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
      },
      submit() {
        this.$refs.checkEl.submit()
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
<style>
.search input {
  height: 30px;
  width: 40%;
  padding-left: 20px;
  border-radius: 10px;
  border: 1px solid #dcdfe6;
  color: #606266;
  outline: none;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
input:focus {
  border-color: #409eff;
}
.main {
  margin-top: 10px;
  height: calc(100vh - 125px);
  margin-left: 20%;
}
.submit-button {
  
}
</style>