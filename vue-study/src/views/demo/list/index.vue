<template>
  <div class="list">
    <div class="operation-wrap">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="全部"></a-tab-pane>
        <a-tab-pane key="2" tab="已批"></a-tab-pane>
        <a-tab-pane key="3" tab="未批"></a-tab-pane>
      </a-tabs>

      <div class="operaion-btns">
        <a-button type="primary" ghost>新增</a-button>
        <a-button type="primary">导出</a-button>
      </div>
    </div>

    <div class="search-wrap">
      <a-form
        ref="formRef"
        name="advanced_search"
        class="ant-advanced-search-form"
        layout="inline"
        :model="formState"
        :labelCol="{ style: { width: '110px' } }"
        :wrapperCol="{ style: { width: '150px' } }"
        @finish="onFinish"
      >
        <a-form-item
          name="name"
          label="名称"
          :rules="[{ required: true, message: '请输入' }]"
        >
          <a-input
            v-model:value="formState['name']"
            placeholder="placeholder"
          ></a-input>
        </a-form-item>

        <a-form-item name="name" label="年龄（测试）">
          <a-input
            v-model:value="formState['age']"
            placeholder="placeholder"
          ></a-input>
        </a-form-item>
      </a-form>

      <div class="search-btns">
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button style="margin: 0 8px" @click="() => formRef.resetFields()"
          >清空</a-button
        >
        <a style="font-size: 12px" @click="expand = !expand">
          <template v-if="expand">
            <UpOutlined />
          </template>
          <template v-else>
            <DownOutlined />
          </template>
          折叠
        </a>
      </div>
    </div>

    <div class="table-wrap">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :scroll="{ x: 700, y: true }"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, nextTick } from "vue";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "DemoList",
  components: {
    DownOutlined,
    UpOutlined,
  },
  setup() {
    const activeKey = ref("1");
    const expand = ref(false);
    const formRef = ref();
    const formState = reactive({});
    const onFinish = (values) => {
      console.log("Received values of form: ", values);
      console.log("formState: ", formState);
    };

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
        width: 80,
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address 1",
        ellipsis: true,
      },
      {
        title: "Long Column Long Column Long Column",
        dataIndex: "address",
        key: "address 2",
        ellipsis: true,
      },
      {
        title: "Long Column Long Column",
        dataIndex: "address",
        key: "address 3",
        ellipsis: true,
      },
      {
        title: "Long Column",
        dataIndex: "address",
        key: "address 4",
        ellipsis: true,
      },
    ];

    const dataSource = [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 2 Lake Park, London No. 2 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ];

    const computedHeight = () => {
      const tbody = document.querySelector('.table-wrap .ant-table-body')
      const othersHeight = 300 + 32;
      tbody.style.height = `calc(100vh - ${othersHeight}px)`;
    }
    nextTick(() => {
      computedHeight();
    })

    return {
      activeKey,
      formRef,
      formState,
      expand,
      columns,
      dataSource,
      onFinish,
    };
  },
});
</script>

<style lang="less" scoped>
.operation-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  :deep(.ant-tabs-nav) {
    height: 45px;
    margin: 0;
  }
}

.search-wrap {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
