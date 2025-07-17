<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>
<template>
  <AppLayout>
    <template v-slot:main>
      <div class="contact-info p-20">
          <h2 class="text-lg md:text-xl font-bold mt-6 mb-4 text-center md:text-left">
          お問い合わせ<br />
          <span class="mt-2 mb-6 block text-base md:text-lg">
            ご不明な点は下記までお問い合わせください。
          </span>
        </h2>

        <p class="font-bold mt-4 text-center md:text-left">
          eメールでのお問い合わせ：
          <a href="mailto:sales@jobstation.co.jp?subject=【ジョブステーションお問い合わせ】：&body=氏名：%0A%0A連絡先：%0A%0A問合せ内容：" class="text-blue-600 underline">
            sales@jobstation.co.jp
          </a>
        </p>

        <p class="mt-6 text-sm md:text-base text-start md:text-left">
          ※お問い合わせの際は件名に「ジョブステーション 問合せ］とご記載願います。<br />
          例【ジョブステーション 問合せ】エントリー方法について
        </p>

        <p class="mt-6 text-sm md:text-base text-start md:text-left">
          また、内容により、回答までにお時間をいただく事がございます。ご了承ください。
        </p>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
@media (min-width: 769px){
  .contact-info {
    padding-left: 120px;
    padding-right: 120px;
  }
}
</style>