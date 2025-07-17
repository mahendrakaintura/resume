<script setup>
import { Head, useForm, router } from '@inertiajs/vue3';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import AppLayout from '@/Layouts/AppLayout.vue';

const props = defineProps({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
        },
        onError: (errors) => {
            console.error(errors);
        }
    });
};
</script>

<template>
    <Head title="パスワード再設定" />
    <AppLayout>
        <template #main>
            <GuestLayout class="mx-auto sm:w-[500px] py-28 px-5">
                <form @submit.prevent="submit">
                    <div>
                        <InputLabel for="email" value="メールアドレス" />
                        <TextInput
                            id="email"
                            type="email"
                            class="mt-1 block w-full"
                            v-model="form.email"
                            required
                            disabled
                        />
                        <InputError :message="form.errors.email" class="mt-2" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password" value="新しいパスワード" />
                        <TextInput
                            id="password"
                            type="password"
                            class="mt-1 block w-full"
                            v-model="form.password"
                            required
                            autocomplete="new-password"
                        />
                        <InputError :message="form.errors.password" class="mt-2" />
                    </div>

                    <div class="mt-4">
                        <InputLabel for="password_confirmation" value="新しいパスワード（確認）" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            class="mt-1 block w-full"
                            v-model="form.password_confirmation"
                            required
                            autocomplete="new-password"
                        />
                        <InputError :message="form.errors.password_confirmation" class="mt-2" />
                    </div>

                    <div class="flex items-center justify-center mt-4">
                        <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                            パスワードを再設定
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </template>
    </AppLayout>
</template>