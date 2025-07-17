<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/Layouts/AppLayout.vue';
import { ref, computed } from 'vue';
import { Eye, EyeOff } from 'lucide-vue-next';

const form = useForm({
    email: '',
    password: '',
});

const showPassword = ref(false);
const isFormValid = computed(() => {
    return form.email && form.password;
});

const submit = () => {
    form.post(route('register'), {
        onSuccess: () => {
            alert('会員登録ありがとうございます。確認メールを送信しましたので、メール内のリンクをクリックして登録を完了してください。');
            router.visit('/');
        },
        onError: () => {
            alert('登録処理中にエラーが発生しました。もう一度お試しください。');
        }
    });
};
</script>

<template>
    <Head title="会員登録" />
    <AppLayout>
        <template #main>
            <GuestLayout class="mx-auto sm:w-[500px] py-28 px-5">
                <form @submit.prevent="submit">
                    <div class="mt-4">
                        <InputLabel for="email" value="メールアドレス" />
                        <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" required
                            autocomplete="username" />
                        <InputError class="mt-2" :message="form.errors.email" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password" value="パスワード" />
                        <div class="relative">
                            <TextInput id="password" :type="showPassword ? 'text' : 'password'"
                                class="mt-1 block w-full" v-model="form.password" required
                                autocomplete="new-password" />
                            <button type="button"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                @click="showPassword = !showPassword">
                                <Eye v-if="!showPassword" class="h-5 w-5" />
                                <EyeOff v-else class="h-5 w-5" />
                            </button>
                        </div>
                        <InputError class="mt-2" :message="form.errors.password" />
                    </div>

                    <div class="flex items-center justify-end mt-4">
                        <PrimaryButton class="ms-4" :class="{ 'opacity-25': form.processing || !isFormValid }"
                            :disabled="form.processing || !isFormValid">
                            登録する
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </template>
    </AppLayout>
</template>