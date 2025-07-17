<script setup>
import AppLayout from '@/Layouts/AppLayout.vue';
</script>

<template>
  <AppLayout>
    <template v-slot:main>
      <div class="flex flex-col items-center gap-8 pt-24 px-12 pb-16 sm:px-20 w-full">

        <div class="flex flex-col items-center md:flex-row mb-12 relative">

          <div class="relative">

            <div
              class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-transparent border border-blue-500 rounded-md z-10 flex justify-center items-center px-3 py-1 text-xs sm:text-sm md:text-base text-black whitespace-nowrap">
              <p>組合員限定</p>
            </div>

            <div
              class="mt-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden flex justify-center items-center">
              <img src="img/icon1.png" alt="Image 1" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="p-4 mt-4 md:mt-0 md:ml-5 text-gray-800 max-w-lg">
            <p class="font-bold">
              法律や税金、銀行融資、助成金のこと、右も左もわからない・・
            </p>
            <p>
              そんなフリーランスの皆さんを助けるために、なんでも相談できる社会保険労務士・地理士さんのご紹介をさせていただきます！
            </p>
            <p><strong>融資などの金融コンサルタント、法人の設立サポートや確定申告などの税務</strong>についてご相談できる接隣との連携もしております。</p>
            <div class="flex justify-center items-center gap-4 flex-wrap">

              <img src="img/sample1.png" alt="Image 1" class="w-48 h-auto rounded-md sm:w-40" />

              <img src="img/sample2.png" alt="Image 2" class="w-48 h-auto rounded-md sm:w-40" />
            </div>

          </div>
        </div>


        <div class="flex flex-col items-center md:flex-row mb-12 relative">

          <div class="relative">
            <div
              class="mt-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden flex justify-center items-center">
              <img src="img/icon2.png" alt="Image 2" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="p-4 mt-4 md:mt-0 md:ml-5 text-gray-800 max-w-lg">
            <p class="font-bold">
              中央ICTではエンドユーザー・大手企業様からの高単価案件を多数保有しています。
            </p>
            <p>
              北海道〜沖縄まで全国各地の案件を保有しており、リモートワークの案件もございます。
            </p>
            <p class="font-bold">
              会員費・登録料などは一切発生せず、手数料として入金金額の10%のみ頂戴しております。
            </p>
            <p>
              中央ICTは非営利団体であるため、組合運営費を除いた受注金額の90%を還元できます。
            </p>
          </div>
        </div>


        <div class="flex flex-col items-center md:flex-row mb-12 relative">

          <div class="relative">
            <div
              class="mt-4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden flex justify-center items-center">
              <img src="img/icon3.png" alt="Image 3" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="p-4 mt-4 md:mt-0 md:ml-5 text-gray-800 max-w-lg">
            <p class="font-bold">
              キャリアアップのための資格取得支援セミナー等を開催しています。
            </p>
            <p>
              その他にも他のフリーランス組合員の方とも交流できるイベントを随時開催しております。
            </p>
            <div
              class="border border-black bg-transparent px-2 py-2 flex justify-center items-center w-fit rounded-md mt-5 mb-5">
              <p>イベント例</p>
            </div>
            <ul class="list-disc list-inside text-gray-800">
              <li>ビジネスキャリア資格講座</li>
              <li>ノーコードなどの競新技術セミナー</li>
              <li>エンジニア女子会</li>
              <li>お花見食事会など…</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style>
@media (min-width: 640px) {
  .sm\:pt-10 {
    padding-top: 0 !important;
  }
}

.pt-5 {
  padding-top: 0 !important;
}
</style>
