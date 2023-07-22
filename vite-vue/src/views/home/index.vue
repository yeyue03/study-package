<template>
  <div id="pdfIdBox">
    <div>
      <div class="home-title">首页</div>
      <router-link to="/device">
        <a-button type="primary">跳转device</a-button>
      </router-link>
    </div>
    <div style="margin-top: 30px">
      <Xlsx />
    </div>

    <!-- <div>
      <a-button @click="exportPDF">导出pdf</a-button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserApi from "@/api/user.api";
import Xlsx from "./Xlsx.vue";
// import PdfLoader from "@/utils/html2pdf";

export default defineComponent({
  name: "Home",
  components: {
    Xlsx,
  },
  setup() {
    UserApi.GetMenu()
      .then((res: any) => {
        console.log("=== res: ", res);
      })
      .catch((err: any) => {
        console.log("=== err: ", err);
      });

    // const exportPDF = () => {
    //   const pdfIdBox = document.getElementById("pdfIdBox"); // 需要导出部分页面的id名
    //   const pdfDownLoader = new PdfLoader(
    //     pdfIdBox,
    //     "fileName",
    //     "question-table"
    //   ); // fileName -->导出文件名,  question-table -->防止被截断的class名
    //   pdfDownLoader.outPutPdfFn("测试");
    // };

    return {
      // exportPDF,
    };
  },
});
</script>


<style lang="less" scoped>
.home-title {
  background: @bgColor;
}
</style>