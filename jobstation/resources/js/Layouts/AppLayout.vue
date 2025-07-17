<script setup>
import { ref } from 'vue'
import { Link, router } from '@inertiajs/vue3'
import MypageMenu from '@/Components/User/MypageMenu.vue';
import Modal from '@/Components/Modal.vue'

const isOpen = ref(false)
const showLogoutModal = ref(false)

const logout = () => {
    router.post(route('logout'))
    showLogoutModal.value = false
}
const confirmLogout = () => {
    showLogoutModal.value = true
}

function isCurrentPath(path) {
    const currentPath = window.location.pathname;
    if (path.startsWith('/mypage')) {
        return currentPath.startsWith('/mypage');
    }
    return currentPath === path;
}
</script>

<template>
    <div class="flex flex-col min-h-screen">
        <header>
            <nav class="border-b border-gray-300 bg-blue-600 fixed top-0 w-full z-50">
                <div class="px-2 sm:px-6 lg:px-8">
                    <div class="relative h-16 flex items-center justify-between">

                        <Link href="/" class="flex-shrink-0">
                        <img src="/img/logo.png" class="h-12" alt="ロゴ">
                        </Link>

                        <div class="hidden lg:flex items-center justify-end space-x-4">
                            <Link href="/about" class="text-white font-bold hover:text-gray-200">ジョブステーションとは</Link>
                            <Link href="/service" class="text-white font-bold hover:text-gray-200">サービスの流れ</Link>

                            <template v-if="$page.props.auth.user">
                                <Link href="/recommend"
                                    class="rounded border border-gray-200 hover:bg-blue-400 text-white font-bold p-2">
                                レコメンド</Link>
                                <Link href="/mypage/favorites"
                                    class="rounded border border-gray-200 hover:bg-blue-400 text-white font-bold p-2">
                                マイページ</Link>
                                <button @click="confirmLogout"
                                    class="rounded border border-gray-200 hover:bg-blue-400 text-white font-bold p-2">
                                    ログアウト
                                </button>
                            </template>
                            <template v-else>
                                <Link href="/register"
                                    class="rounded border border-gray-200 hover:bg-blue-400 text-white font-bold p-2">
                                会員登録</Link>
                                <Link href="/login"
                                    class="rounded border border-gray-200 hover:bg-blue-400 text-white font-bold p-2">
                                ログイン</Link>
                            </template>

                            <Link href="/contact" class="rounded border text-center text-sm text-white font-bold p-1">
                            企業様の<br>お問い合わせはこちら</Link>
                        </div>

                        <div class="flex lg:hidden">
                            <button type="button" @click="isOpen = !isOpen"
                                class="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-500 focus:outline-none">
                                <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g v-show="!isOpen">
                                        <rect y="4" width="24" height="2" rx="1" />
                                        <rect y="11" width="24" height="2" rx="1" />
                                        <rect y="18" width="24" height="2" rx="1" />
                                    </g>
                                    <g v-show="isOpen">
                                        <path d="M6.343 6.343l11.314 11.314" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" />
                                        <path d="M17.657 6.343L6.343 17.657" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="fixed top-16 right-0 h-full w-64 bg-blue-600 transform transition-transform duration-300 ease-in-out lg:hidden"
                    :class="isOpen ? 'translate-x-0' : 'translate-x-full'">
                    <div class="py-2">
                        <Link href="/" :class="{ 'bg-blue-700': isCurrentPath('/') }"
                            class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-t border-b border-blue-400"
                            @click="isOpen = false">
                        ホーム
                        </Link>
                        <Link href="/about" :class="{ 'bg-blue-700': isCurrentPath('/about') }"
                            class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                            @click="isOpen = false">
                        ジョブステーションとは
                        </Link>
                        <Link href="/service" :class="{ 'bg-blue-700': isCurrentPath('/service') }"
                            class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                            @click="isOpen = false">
                        サービスの流れ
                        </Link>

                        <template v-if="$page.props.auth.user">
                            <Link href="/recommend" :class="{ 'bg-blue-700': isCurrentPath('/recommend') }"
                                class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                                @click="isOpen = false">
                            レコメンド</Link>
                            <Link href="/mypage/favorites" :class="{ 'bg-blue-700': isCurrentPath('/mypage/') }"
                                class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                                @click="isOpen = false">
                            マイページ
                            </Link>
                            <button @click="confirmLogout"
                                class="w-full text-left px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400">
                                ログアウト
                            </button>
                        </template>
                        <template v-else>
                            <Link href="/register" :class="{ 'bg-blue-700': isCurrentPath('/register') }"
                                class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                                @click="isOpen = false">
                            会員登録
                            </Link>
                            <Link href="/login" :class="{ 'bg-blue-700': isCurrentPath('/login') }"
                                class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                                @click="isOpen = false">
                            ログイン
                            </Link>
                        </template>

                        <Link href="/contact" :class="{ 'bg-blue-700': isCurrentPath('/contact') }"
                            class="block px-4 py-3 text-base font-medium text-white hover:bg-blue-500 border-b border-blue-400"
                            @click="isOpen = false">
                        企業様のお問い合わせはこちら
                        </Link>
                    </div>
                </div>
            </nav>
        </header>

        <main class="bg-blue-50 mt-16 flex-grow">
            <MypageMenu />
            <slot name="main"></slot>
        </main>

        <footer>
            <div class="copyright bottom-0 w-full font-bold text-center text-white bg-black p-1">
                <p>© 2025 JobStation</p>
            </div>
        </footer>

        <Modal :show="showLogoutModal" @close="showLogoutModal = false">
            <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900">
                    ログアウトの確認
                </h2>
                <div class="mt-4 text-sm text-gray-600">
                    ログアウトしてもよろしいですか？
                </div>
                <div class="mt-6 flex justify-end space-x-4">
                    <button
                        class="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                        @click="showLogoutModal = false"
                    >
                        キャンセル
                    </button>
                    <button
                        class="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        @click="logout"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>