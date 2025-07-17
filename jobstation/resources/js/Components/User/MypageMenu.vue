<script setup>
import { ref } from 'vue'
import { Link } from '@inertiajs/vue3'

const isOpen = ref(false)

function isMypagePath(subPath="") {
    const path = window.location.pathname;
    const fullPath = subPath ? `/mypage/${subPath}` : "/mypage";
    return path === fullPath || path.startsWith(`${fullPath}/`);
}
</script>

<template>
    <nav v-if="isMypagePath()">
        <div class="hidden sm:flex fixed inset-x-0 flex gap-4 p-5 text-center max-w-5xl mx-auto">
            <Link 
                href="/mypage/favorites"
                :class="isMypagePath('favorites') ? 'bg-blue-500' : 'bg-gray-300'"
                class="border-2 border-blue-50 rounded-lg hover:bg-blue-500 font-bold p-2 grow"
            >
                お気に入り
            </Link>
            <Link 
                href="/mypage/entries"
                :class="isMypagePath('entries') ? 'bg-blue-500' : 'bg-gray-300'"
                class="border-2 border-blue-50 rounded-lg hover:bg-blue-500 font-bold p-2 grow"
            >
                応募履歴
            </Link>
            <Link 
                href="/mypage/skillsheet/edit"
                :class="isMypagePath('skillsheet') ? 'bg-blue-500' : 'bg-gray-300'"
                class="border-2 border-blue-50 rounded-lg hover:bg-blue-500 font-bold p-2 grow"
            >
                スキルシート更新
            </Link>
            <Link 
                href="/mypage/password"
                :class="isMypagePath('password') ? 'bg-blue-500' : 'bg-gray-300'"
                class="border-2 border-blue-50 rounded-lg hover:bg-blue-500 font-bold p-2 grow"
            >
                パスワード変更
            </Link>
            <Link 
                href="/mypage/unregister"
                :class="isMypagePath('unregister') ? 'bg-blue-500' : 'bg-gray-300'"
                class="border-2 border-blue-50 rounded-lg hover:bg-blue-500 font-bold p-2 grow"
            >
                退会
            </Link>
        </div>
        <div class="fixed left-10 flex sm:hidden pt-4 w-44">
            <div class="flex flex-col bg-blue-500 font-bold p-2 grow border-2 border-blue-50 rounded-lg">
                <button class="text-white flex" @click="isOpen = !isOpen">
                    <svg class="text-white h-6 w-6 fill-current">
                        <path v-show="!isOpen" d="M6.5,8.5l6,7l6-7H6.5z"/>
                        <path v-show="isOpen" d="M18.5,15.5l-6-7l-6,7H18.5z"/>
                    </svg>
                    <div class="w-full text-center">
                        {{ isMypagePath('favorites') ? 'お気に入り' : isMypagePath('entries') ? '応募履歴' : isMypagePath('skillsheet') ? 'スキルシート更新' : isMypagePath('password') ? 'パスワード変更' : '退会' }}
                    </div>
                </button>
                <div :class="isOpen ? 'block' : 'hidden'">
                    <div class="overflow-hidden px-2 pb-5 pt-2 flex flex-col items-start">
                        <Link
                            href="/mypage/favorites"
                            :class="isMypagePath('favorites') ? 'text-white' : 'text-black'"
                            class="hover:text-white"
                        >
                            お気に入り
                        </Link>
                        <Link
                            href="/mypage/entries"
                            :class="isMypagePath('entries') ? 'text-white' : 'text-black'"
                            class="hover:text-white"
                        >
                            応募履歴
                        </Link>
                        <Link
                            href="/mypage/skillsheet/edit"
                            :class="isMypagePath('skillsheet') ? 'text-white' : 'text-black'"
                            class="hover:text-white"
                        >
                            スキルシート更新
                        </Link>
                        <Link
                            href="/mypage/password"
                            :class="isMypagePath('password') ? 'text-white' : 'text-black'"
                            class="hover:text-white"
                        >
                            パスワード変更
                        </Link>
                        <Link
                            href="/mypage/unregister"
                            :class="isMypagePath('unregister') ? 'text-white' : 'text-black'"
                            class="hover:text-white"
                        >
                            退会
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <div class="pt-5 sm:pt-10"></div>
</template>