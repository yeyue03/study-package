<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      :headers="headers"
      @change="handleChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        上传
      </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';
import xlsx from 'xlsx';

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const uploadChange = async (file) => {
      let dataBinary = await readFile(file.raw)
      let workBook = xlsx.read(dataBinary, {type: 'binary', cellDates: true})
      let workSheet = workBook.Sheets[workBook.SheetNames[0]]
      const data = xlsx.utils.sheet_to_json(workSheet)
      console.log(data)
    }

    const handleChange = (info: UploadChangeParam) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    const fileList = ref([]);
    return {
      fileList,
      headers: {
        authorization: 'authorization-text',
      },
      handleChange,
    };
  },
});
</script>

