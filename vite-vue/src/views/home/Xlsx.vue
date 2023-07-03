<template>
  <a-upload
    v-model:file-list="fileList"
    name="file"
    :before-upload="() => false"
    :showUploadList="false"
    @change="handleChange"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      导入xls
    </a-button>
  </a-upload>

  <a-table :dataSource="dataSource" :columns="columns" />
</template>

<script>
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import * as XLSX from 'xlsx';

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const columns = ref([]);
    const dataSource = ref([]);

    const handleChange = (info) => {
      console.log("===== 文件状态：", info.file.status);
      
      if (info.file.status !== 'uploading') {
        importExcel(info.file);
        // console.log(info.file, info.fileList);
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);

      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    // 上传导入excle文件
    const importExcel = (file) => {
      const types = file.name.split('.')[1];
      // 定义上传文件类型
      const fileType = ['xlsx', 'xls', 'csv'].some(
        item => item === types
      );
      if (!fileType) {
        console.log('文件格式错误！请重新选择');
        return;
      }
      // 执行处理excle文件内容
      file2Xce(file).then(excelList => {
        if (excelList && excelList.length > 0) {
          console.log('excelList ~~~', excelList);

          const firstTableList = excelList[0]?.sheet; // 取第一张表的数据
          if (firstTableList && firstTableList.length) {
            let cols = [];
            for (const key in firstTableList[0]) {
              cols.push({
                title: key,
                dataIndex: key,
                key: key,
              })
            }

            columns.value = cols;
            dataSource.value = firstTableList;
          }
        }
      });
    }

    // 获取 excel 文件内容
    const file2Xce = async (file) => {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = e.target.result;
          // 工作簿 原始数据
          const workbook = XLSX.read(data, {
            type: 'binary'
          });

          const result = [];
          workbook.SheetNames.forEach(sheetName => {
            result.push({
              sheetName: sheetName,
              // 调用：sheet_to_json 方法，将文件内容解析成 json 格式
              sheet: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
            });
          });
          
          resolve(result);
        };
        // debugger
        reader.readAsBinaryString(file);
      });
    }

    const fileList = ref([]);
    return {
      fileList,
      columns,
      dataSource,
      handleChange,
    };
  },
});
</script>

