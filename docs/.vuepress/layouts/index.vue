<template>
  <ParentLayout>
    <template #page-bottom>
      <CommentService :darkmode="isDarkMode" />
      <!-- <div style="width: 100%; text-align:center; margin-top: 60px; position: absolute; background: red">
        <a style="color:#a7a7a7; font-size:14px;" href="https://beian.miit.gov.cn">蜀ICP备2023033985号-3 &copy; 玄工科技（四川）有限责任公司</a>
      </div> -->
    </template>
  </ParentLayout>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import ParentLayout from "@vuepress/theme-default/lib/client/layouts/Layout.vue";
const isDarkMode = ref(false);
let observer;
onMounted(() => {
  const html = document.querySelector("html");
  isDarkMode.value = html.classList.contains("dark");
  // watch theme change
  observer = new MutationObserver(() => {
    isDarkMode.value = html.classList.contains("dark");
  });
  observer.observe(html, {
    attributeFilter: ["class"],
    attributes: true,
  });
});
onBeforeUnmount(() => {
  observer.disconnect();
});
</script>