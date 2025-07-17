<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>

<template>
  <AppLayout>
    <template v-slot:main>
      <div class="flex flex-col items-center justify-center gap-8 px-4 md:px-16 service-flow">
        <p class="text-center text-sm md:text-base lg:text-lg">
          IT 業界に精通したキャリアアドバイザーが求人紹介から入社までをサポートし、
          <br />
          理想の転職をお手伝いします
        </p>

        <div class="flex flex-wrap justify-center gap-6">
          <div class="flex flex-col items-center max-w-sm">
            <img src="img/service1.jpg" alt="Rectangle Image 1" class="w-full sm:w-72 md:w-96 h-48 object-contain" />
            <p class="text-sm mt-2 text-center">
              業界のトレンドと企業の課題を踏まえ<br />
              <strong>市場価値が高い強みを見抜く</strong>
            </p>
          </div>

          <div class="flex flex-col items-center max-w-sm">
            <img src="img/service2.jpg" alt="Rectangle Image 2" class="w-full sm:w-72 md:w-96 h-48 object-contain" />
            <p class="text-sm mt-2 text-center">
              企業の求人票にはない<strong>現場のリアルな情報</strong> で<br />
              自分に合う職場か事前にわかる
            </p>
          </div>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <div class="flex flex-col items-center max-w-sm">
            <img src="img/service3.jpg" alt="Rectangle Image 3" class="w-full sm:w-72 md:w-96 h-48 object-contain" />
            <p class="text-sm mt-2 text-center">
              IT専門のアドバイザーが<strong>職務経歴の作成</strong>から <br />
              <strong>面接対策</strong>までサポート
            </p>
          </div>

          <div class="flex flex-col items-center max-w-sm">
            <img src="img/service4.jpg" alt="Rectangle Image 4" class="w-full sm:w-72 md:w-96 h-48 object-contain" />
            <p class="text-sm mt-2 text-center">
              19年間積み上げたデータから<br />
              <strong>キャリアアップ・成長できる企業をご提案</strong>
            </p>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style>
.pt-5 {
  padding-top: 2.5rem !important;
}
.service-flow {
  margin-bottom: 60px;
}
</style>
