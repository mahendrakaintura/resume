<script setup>
import { Head, useForm } from '@inertiajs/vue3';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import { ref } from 'vue';

const form = useForm({
    password: '',
    password_confirmation: '',
});

const submit = () => {
    const errors = validatePassword();
    if (errors.length > 0) {
        window.alert('- ' + errors.join('\n- '));
        return;
    }
    form.post(route('mypage.password.store'), {
        onSuccess: () => {
            form.reset();
            window.alert('パスワードを変更しました。')
        },
        onError: (errors) => {
            window.alert(`${errors.message}\n- ${errors.system}`)
        }
    });
};

const validatePassword = () => {
    const errors = [];
    if (form.password.length < 8) errors.push('パスワードは8文字以上で入力してください。');
    if (form.password !== form.password_confirmation) errors.push('確認用パスワードが一致しません。');
    return errors;
};

const showPassword = ref(false);
const showPasswordConfirmation = ref(false);
</script>

<template>
    <Head title="パスワード変更" />
    <AppLayout>
        <template #main>
            <div class="py-12">
                <div class="max-w-5xl mx-auto px-6">
                    <form @submit.prevent="submit" class="bg-white py-10 shadow rounded-lg flex flex-col gap-4">
                        <div class="flex flex-col sm:grid grid-cols-2 justify-center mb-4 gap-4 items-center">
                            <div class="flex items-center gap-2 sm:gap-11 justify-self-end pl-6 sm:pl-0">
                                <InputLabel for="password" value="新しいパスワード" />
                                <span class="text-red-500">必須</span>
                            </div>
                            <div class="flex items-center gap-2 pl-8 sm:pl-0">
                                <TextInput
                                    id="password"
                                    :type="showPassword ? 'text' : 'password'"
                                    class="self-center"
                                    v-model="form.password"
                                    required
                                    autocomplete="new-password"
                                />
                                <button
                                    type="button"
                                    class="toggle-password"
                                    @click="showPassword = !showPassword"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M0 0h24v24H0V0z" fill="none"/>
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="block sm:hidden"></div>
                            <div class="flex items-center gap-2 justify-self-end pl-6 sm:pl-0">
                                <InputLabel for="password_confirmation" value="新しいパスワード（確認用）" />
                                <span class="text-red-500">必須</span>
                            </div>
                            <div class="flex items-center gap-2 pl-8 sm:pl-0">
                                <TextInput
                                    id="password_confirmation"
                                    :type="showPasswordConfirmation ? 'text' : 'password'"
                                    class="self-center"
                                    v-model="form.password_confirmation"
                                    required
                                    autocomplete="new-password"
                                />
                                <button
                                    type="button"
                                    class="toggle-password"
                                    @click="showPasswordConfirmation = !showPasswordConfirmation"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M0 0h24v24H0V0z" fill="none"/>
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center justify-center mt-4">
                            <button type="submit" 
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                変更する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </AppLayout>
</template>