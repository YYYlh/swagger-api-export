<template>
  <div v-if="paths">
    <div v-for="(controller, index) in paths" :key="index">
      <span :class="{isCheck: paths[index].checkAll}" class="check" @click="check(index)"></span>
      <span>{{ index }}--{{ controller.description }}</span>
      <div v-for="(tag, ii) in controller.tagName" :key="ii">
        <span
          :class="{isCheck: paths[index].tagName[ii].check}"
          class="check"
          @click="checkItem(index, tag.path, ii)"
        ></span>
        <span>{{ url + tag.path }}--{{ tag.summary }}</span>
      </div>
    </div>
    <button @click="submit">确定</button>
  </div>
</template>

<script>
export default {
  name: "CheckList",
  props: {
    data: {
      type: Object
    },
    initialPaths: {
      type: Object,
    },
    url: {
      type: String,
    },
  },
  data() {
    return {
      paths: null,
    };
  },
  watch: {
    data(n) {
      console.log(n);
      this.paths = JSON.parse(JSON.stringify(n.initialPaths));
    },
  },
  methods: {
    check(item) {
      this.paths[item].checkAll = !this.paths[item].checkAll;
      for (const tag of this.paths[item].tagName) {
        tag.check = this.paths[item].checkAll;
      }
      if (!this.paths[item].checkAll) {
        this.paths[item].check = false;
      }
    },
    checkItem(controller, item, index) {
      this.paths[controller].tagName[index].check = !this.paths[controller]
        .tagName[index].check;
    },
    submit() {
      // 找到选中的数据
      const tempData = JSON.parse(JSON.stringify(this.data))
      const tempObj = {}
      for (const key in this.paths) {
        const cur = this.paths[key];
        if (cur.checkAll) {
          tempObj[key] = this.paths[key];
        } else {
          const tagName = cur.tagName;
          const tempArr = [];
          for (const item of tagName) {
            if (item.check) {
              tempArr.push(item);
            }
          }
          tempObj[key] = {
            description: this.paths[key].description,
            tagName: tempArr,
          };
        }
      }
      tempData.paths = tempObj
      fetch("http://localhost:520/submitServerData", {
        body: JSON.stringify(tempData),
        headers: {
          "content-type": "application/json",
        },
        mode: "cors",
        method: "POST",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {});
    },
  },
};
</script>

<style>
.check {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: yellow;
}
.isCheck {
  background: red;
}
</style>