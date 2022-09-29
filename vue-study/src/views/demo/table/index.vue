<template>
  <div class="approvalStyle">
    <a-table
      style="margin-top: 20px; background: #fff"
      :columns="columns"
      :dataSource="dataSource"
      :customRow="customRow"
    >
    </a-table>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity';

export default {
  name: "DemoTable",
  components: {
    
  },
  setup() {
    const columns = reactive([
      {
        dataIndex: 'name',
        title: 'name'
      },
      {
        dataIndex: 'address',
        title: 'address'
      },
      {
        dataIndex: 'age',
        title: 'age'
      }
    ])

    const dataSource = reactive([
      {
        name: '一',
        age: 14,
        address: '北京',
        key: 1
      },
      {
        name: '二',
        age: 15,
        address: '南京',
        key: 2
      },
      {
        name: '三',
        age: 16,
        address: '东京',
        key: 3
      },
      {
        name: '四',
        age: 16,
        address: '天津',
        key: 4
      },
      {
        name: '五',
        age: 16,
        address: '上海',
        key: 5
      }
    ])

    let orgIndex = null; // 源目标数据序号
    let aimIndex = null; // 目标数据序号

    const customRow = (record, index) => {
      return {
        props: {
          // draggable: 'true'
        },
        style: {
          cursor: 'pointer'
        },
        // 鼠标移入
        onMouseenter: (event) => {
          // 兼容IE
          var ev = event || window.event;
          ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
        },
        // 开始拖拽
        onDragstart: (event) => {
          // 兼容IE
          var ev = event || window.event;
          // 阻止冒泡
          ev.stopPropagation();
          // 得到源目标数据序号
          orgIndex = index;
        },
        // 拖动元素经过的元素
        onDragover: (event) => {
          // 兼容 IE
          var ev = event || window.event;
          // 阻止默认行为
          ev.preventDefault();
        },
        // 鼠标松开
        onDrop: (event) => {
          // 兼容IE
          var ev = event || window.event;
          // 阻止冒泡
          ev.stopPropagation();
          // 得到目标数据序号
          aimIndex = index;
          // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
          // [dataSource[orgIndex], dataSource[aimIndex]] = [
          //   dataSource[aimIndex],
          //   dataSource[orgIndex]
          // ];

          // 这里是让数据插入当前位置，其他行排序顺延
          const orgRow = dataSource[orgIndex];
          dataSource.splice(aimIndex, 0, orgRow);
          if (orgIndex < aimIndex) {
            dataSource.splice(orgIndex, 1);
          } else if (orgIndex > aimIndex) {
            dataSource.splice(orgIndex + 1, 1);
          }
        }
      };
    }

    return {
      columns,
      dataSource,
      customRow
    }
  }
};

// 参考：https://blog.csdn.net/Wancc123/article/details/123070069
</script>

<style scoped>
.listStyle {
  font-size: 16px;
  padding: 20px;
  background: #fff;
  width: 300px;
  border: 1px solid #efefef;
}
</style>
