<template>
  <div v-if="paths" class="content">
    <div class="collapse">
      <div v-for="(controller, key) in paths" :key="key" class="root">
      <span :class="{isCheck: paths[key].checkAll}" class="check" @click="check(key)"></span>
        <span class="root-content">{{ key }}   --   {{ controller.description }}</span>
        <div v-for="(tag, ii) in controller.tagName" :key="ii" class="item">
          <span
            :class="{isCheck: paths[key].tagName[ii].check}"
            class="check"
            @click="checkItem(key, tag.path, ii)"
          ></span>
          <span class="item-content">{{ tag.path }}   --   {{ tag.summary }}</span>
        </div>
    </div>
    </div>
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
      checkObj: {},
      pathTagLenObj: {}
    };
  },
  watch: {
    data(n) {
      this.paths = JSON.parse(JSON.stringify(n.initialPaths));
      for (const key in this.paths) {
        this.pathTagLenObj[key] = 0;
        for (const item of this.paths[key].tagName) {
          if (item.check) {
            this.pathTagLenObj[key] += 1
          }
        }
        if (this.pathTagLenObj[key] === this.paths[key].tagName.length) {
          for (const item of this.paths[key].tagName) {
            this.paths[key].checkAll = true
          }
        }
      }
    },
  },
  methods: {
    check(item) {
      this.paths[item].checkAll = !this.paths[item].checkAll;
      for (const tag of this.paths[item].tagName) {
        tag.check = this.paths[item].checkAll
      }
      if (!this.paths[item].checkAll) {
        this.pathTagLenObj[item] = 0
      } else {
        this.pathTagLenObj[item] = this.paths[item].tagName.length
      }
    },
    checkItem(key, item, index) {
      this.paths[key].tagName[index].check = !this.paths[key].tagName[index].check
      if (this.paths[key].tagName[index].check) {
        this.pathTagLenObj[key] += 1
      } else {
        this.pathTagLenObj[key] -= 1
      }
      this.paths[key].checkAll = this.pathTagLenObj[key] === this.paths[key].tagName.length
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
          }
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
  margin-right: 10px;
  transform: translateY(11px);
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  cursor: pointer;
  transition: all .2s cubic-bezier(.645,.045,.355,1);
}
.isCheck {
  background: #409eff;
}
.content {
  height: 100%;
  overflow: hidden;
}
.collapse {
  height: calc(100% - 30px);
  overflow: scroll;
}
span {
  display: inline-block;
  margin: 5px 0;
}
.root {
  text-align: left;
}
.root-content {
  height: 30px;
  font-weight: bold;
  font-size: 18px;
}
.item {
  margin-left: 30px;
}

</style>