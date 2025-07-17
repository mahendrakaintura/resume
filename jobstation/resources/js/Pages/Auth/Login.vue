<script setup>
import { ref, onMounted } from 'vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Eye, EyeOff } from 'lucide-vue-next';
import AppLayout from '@/Layouts/AppLayout.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import axios from 'axios'

const props = defineProps({
    canResetPassword: Boolean,
    status: String,
    hasEntrySession: Boolean
});

const form = useForm({
    email: '',
    password: '',
});

const showPassword = ref(false);

const submit = async () => {
    if (props.hasEntrySession) {
        try {
            const response = await axios.post(route('login'), {
                email: form.email,
                password: form.password,
                remember: form.remember,
            });

            if (response.data.success === false) {
                // Handle duplicate entry error
                window.alert(response.data.message);
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                }
            } else {
                // Handle success case
                if (response.data.message) {
                    window.alert(response.data.message);
                }
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                }
            }

        } catch (error) {
            if (error.response?.status === 422) {
                form.errors = error.response.data.errors || { email: ['ログインに失敗しました'] };
            } else {
                window.alert('ログインエラーが発生しました。もう一度お試しください。');
            }
        }
    } else {
        form.post(route('login'), {
            onSuccess: () => { },
        });
    }
};
</script>

<template>

    <Head title="ログイン" />
    <AppLayout>
        <template #main>
            <GuestLayout class="mx-auto sm:w-[500px] py-28 px-5">
                <div v-if="status" class="mb-4 font-bold text-sm text-green-600">
                    {{ status }}
                </div>

                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="email" value="メールアドレス" />
                        <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" required
                            autofocus autocomplete="username" />
                        <InputError class="mt-2" :message="form.errors.email" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password" value="パスワード" />
                        <div class="relative">
                            <TextInput id="password" :type="showPassword ? 'text' : 'password'"
                                class="mt-1 block w-full" v-model="form.password" required
                                autocomplete="current-password" />
                            <button type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                @click="showPassword = !showPassword">
                                <Eye v-if="!showPassword" class="h-5 w-5" />
                                <EyeOff v-else class="h-5 w-5" />
                            </button>
                        </div>
                        <InputError class="mt-2" :message="form.errors.password" />
                    </div>

                    <div class="block mt-4">
                        <Link v-if="canResetPassword" :href="route('password.request')"
                            class="underline text-sm text-sky-600 hover:text-sky-500 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-nowrap">
                        ログインパスワードを忘れた場合はこちら
                        </Link>
                    </div>

                    <div class="flex items-center justify-end mt-4">
                        <PrimaryButton class="ms-4" :class="{ 'opacity-25': form.processing }"
                            :disabled="form.processing">
                            ログイン
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </template>
    </AppLayout>
</template>