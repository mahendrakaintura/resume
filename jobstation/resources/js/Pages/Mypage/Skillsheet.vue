<script setup>
import { ref, watch } from 'vue'
import { useForm } from '@inertiajs/vue3'
import { onMounted, onUnmounted } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue'
import InputLabel from '@/Components/InputLabel.vue'
import TextInput from '@/Components/TextInput.vue'
import SelectInput from '@/Components/SelectInput.vue'
import Checkbox from '@/Components/Checkbox.vue';

const screenWidth = ref(window.innerWidth);

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        alert('会員登録が完了しました');
    }
    window.addEventListener("resize", updateWidth);
    const buttonContainer = document.querySelector(".sticky");
    if (buttonContainer) {
        const rect = buttonContainer.getBoundingClientRect();
        buttonContainer.style.setProperty("--initial-position", `${rect.top}px`);
    }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

const getColumns = () => {
    if (screenWidth.value >= 1280) return 4;
    if (screenWidth.value >= 1024) return 3;
    if (screenWidth.value >= 640) return 2;
    return 1;
};

const updateWidth = () => {
  screenWidth.value = window.innerWidth;
};

const props = defineProps({
    constants: {
        type: Object,
        default: {}
    },
    user: {
        type: Object,
        required: true
    }
});

const experienceForm = {
    period: null,
    business: '',
    pj_scale_id: 0,
    team_size: null,
    position: '',
    analysis: false,
    requirement_definition: false,
    basic_design: false,
    detail_design: false,
    programing: false,
    unit_test: false,
    integration_test: false,
    monitoring: false,
    maintenance: false,
    server_design: false,
    server_construction: false,
    network_design: false,
    network_construction: false,
    description: '',
    language: '',
    os: '',
    db: '',
    fw: '',
    mw: '',
    server: '',
    environment: '',
    tool: '',
    network: '',
    others: '',
};

const form = useForm({
    basicInfo: {
        initial: props.user?.initial ?? '',
        age: props.user?.age ?? 0,
        years_of_experience: props.user?.years_of_experience ?? 0,
        sex: props.user?.sex ?? '',
        is_japanese: props.user?.is_japanese !== null && props.user?.is_japanese !== undefined ? Boolean(props.user.is_japanese) : true,
        nationality: props.user?.nationality ?? '',
        education: props.user?.education ?? '',
        address: props.user?.address ?? '',
        train_line: props.user?.train_line ?? '',
        station: props.user?.station ?? '',
        qualifications: (props.user?.qualifications ?? []).concat(Array(5).fill('')).slice(0, 5),
    },

    preferences: (() => {
        const getBitNumber = (value) => {
            return value ? Math.log2(value) + 1 : 0;
        }
        
        const getDefaultedBitNumber = (userValue, optionsObject) => {
            let bitNum = getBitNumber(userValue);
            if (bitNum === 0 && optionsObject && Object.keys(optionsObject).length > 0) {
                return Object.keys(optionsObject)[0];
            }
            return bitNum;
        }

        return {
            desired_area: getDefaultedBitNumber(props.user?.desired_area, props.constants?.check_items?.area),
            desired_start: getDefaultedBitNumber(props.user?.desired_start, props.constants?.check_items?.start),
            desired_price: getDefaultedBitNumber(props.user?.desired_price, props.constants?.check_items?.price),
            desired_remote: getDefaultedBitNumber(props.user?.desired_remote, props.constants?.check_items?.remote),
        }
    })(),

    experiences: (() => {
        const experiences = props.user?.work_experiences?.length ? props.user.work_experiences : [{ ...experienceForm }];
        const defaultExperience = { ...experienceForm };
        if (props.constants?.pj_scale?.length > 0) {
            defaultExperience.pj_scale_id = props.constants.pj_scale[0].id;
        }
        experiences.forEach(exp => {
            if (!exp.pj_scale_id && props.constants?.pj_scale?.length > 0) {
                exp.pj_scale_id = props.constants.pj_scale[0].id;
            }
        });
        experiences.push(...Array.from({ length: Math.max(0, 3 - experiences.length) }, () => (defaultExperience)));
        return experiences;
    })(),
    
    skill_score:  (() => {
        const skillScoreData = {};
        for (const skillGroup in props.constants.skill_group) {
            skillScoreData[skillGroup] = props.user?.skill_score?.[skillGroup] ?? {};
            const skills = props.constants.check_items[skillGroup] || [];
            if (Array.isArray(skills)) {
                for (const skill of skills) {
                    if (skill && skill.name) {
                        skillScoreData[skillGroup][skill.name] = props.user?.skill_score?.[skillGroup]?.[skill.name] ?? 0;
                    }
                }
            }
        }
        return skillScoreData;
    })(),

    personality: (() => {
        const personalityData = {};
        for (const key in props.constants.personality) {
            personalityData[key] = props.user?.personality?.[key] ?? 0;
        }
        return personalityData;
    })(),
});

watch(() => form.basicInfo.is_japanese, (newValue) => {
    if (newValue) form.basicInfo.nationality = '日本';
    else form.basicInfo.nationality = (n => n && n != '日本' ? n : '')(props.user?.nationality);
});

const addExperience = () => {
    if (form.experiences.length >= 13) return;
    form.experiences.push({ ...experienceForm });
};

const removeExperience = (index) => {
    if (form.experiences.length > 1) {
        form.experiences.splice(index, 1);
    }
};

const formErrors = ref({});

const update = () => {
    form.post(route('mypage.skillsheet.update'), {
        onSuccess: () => {
            alert('スキルシートを更新しました。');
        },
        onError: (errors) => {
            formErrors.value = errors;
            let errorMessage = '以下のエラーが発生しました：\n';
            if (errors.basicInfo) {
                Object.entries(errors.basicInfo).forEach(([field, message]) => {
                    errorMessage += `- ${getFieldLabel(field)}: ${message}\n`;
                });
            }
            alert(errorMessage);
        }
    })
};

const limitInitialInput = (event, numCharacter, updateValue) => {
    let value = event.target.value
    value = value.replace(/[^a-zA-Z・.]/g, '');
    value = value.slice(0, numCharacter);
    event.target.value = value;
    updateValue(value);
}

const limitNumberInput = (event, numDigit, updateValue) => {
    let value = event.target.value
    value = value.replace(/[^0-9]/g, '');
    value = value.slice(0, numDigit);
    event.target.value = value;
    updateValue(value);
}
</script>

<template>
    <AppLayout>
        <template #main>
            <div class="py-12">
                <div class="max-w-7xl mx-auto px-6">
                    <form @submit.prevent="update" class="bg-white p-6 shadow rounded-lg">
                        <div class="sticky top-[85vh] sm:top-[20vh] flex justify-center sm:justify-end gap-4 text-center">
                            <button type="submit" 
                                class="bg-blue-500 text-white px-2 py-2 hover:bg-blue-600 border-2 border-blue-50 rounded-lg w-28">
                                登録
                            </button>
                            <a
                                :href="route('mypage.skillsheet.preview')"
                                target="_blank"
                                :class="user.initial === '' ? 'pointer-events-none bg-gray-500 text-white px-2 py-2 border-2 border-blue-50 rounded-lg w-28' : 'bg-blue-500 text-white px-2 py-2 hover:bg-blue-600 border-2 border-blue-50 rounded-lg w-28'"
                            >
                                プレビュー
                            </a>
                        </div>
                        <h2 class="text-lg font-medium mb-6">基本情報</h2>
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
                            <div class="col-span-2">
                                <InputLabel value="名前(イニシャル)" required tips="英文字(記号・.含む)"/>
                                <TextInput v-model="form.basicInfo.initial" type="text" class="mt-1 block w-full"
                                    required @input="limitInitialInput($event, 5, (value) => form.basicInfo.initial = value)" placeholder="Y・T"/>
                            </div>
                            <div>
                                <InputLabel value="年齢" required />
                                <SelectInput v-model="form.basicInfo.age" class="mt-1 block w-full"
                                    required>
                                    <option v-for="year in constants?.age" :key="year" :value="year">
                                        {{ year }}歳
                                    </option>
                                </SelectInput>
                            </div>
                            <div>
                                <InputLabel value="経験年数" />
                                <SelectInput v-model="form.basicInfo.years_of_experience" class="mt-1 block w-full">
                                    <option v-for="year in constants?.years_of_experience" :key="year" :value="year">
                                        {{ year }}年
                                    </option>
                                </SelectInput>
                            </div>
                            <div class="col-span-2">
                                <InputLabel value="性別" required />
                                <div class="mt-1 space-x-4">
                                    <label class="inline-flex items-center">
                                        <input type="radio" v-model="form.basicInfo.sex" value="man" name="sex" required class="mr-2">
                                        男性
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" v-model="form.basicInfo.sex" value="woman" name="sex"class="mr-2">
                                        女性
                                    </label>
                                </div>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <InputLabel value="国籍" required />
                                <div class="mt-1 space-x-4">
                                    <label class="inline-flex items-center">
                                        <input type="radio" v-model="form.basicInfo.is_japanese" :value="true" name="is_japanese" required class="mr-2">
                                        日本
                                    </label>
                                    <label class="inline-flex items-center">
                                        <input type="radio" v-model="form.basicInfo.is_japanese" :value="false" name="is_japanese" class="mr-2">
                                        その他
                                    </label>
                                </div>
                                <TextInput v-if="!form.basicInfo.is_japanese" v-model="form.basicInfo.nationality" type="text" class="mt-6 block w-full"
                                    :required="!form.basicInfo.is_japanese" maxlength="40" placeholder="アメリカ合衆国"/>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <InputLabel value="最終学歴" />
                                <TextInput v-model="form.basicInfo.education" type="text" class="mt-1 block w-full" maxlength="40" placeholder="令和大学　情報処理学部" />
                            </div>
                            <div class="col-span-2">
                                <InputLabel value="現在所" />
                                <TextInput v-model="form.basicInfo.address" type="text" class="mt-1 block w-full"
                                    maxlength="40" placeholder="東京都千代田区丸の内１丁目　○○ビル2階"/>
                            </div>
                            <InputLabel value="最寄り駅" class="col-span-2"/>
                            <div class="col-span-2 flex flex-col sm:flex-row gap-4 w-full">
                                <div class="flex items-center gap-4 w-full">
                                    <InputLabel value="沿線名" class="min-w-[45px]"/>
                                    <TextInput v-model="form.basicInfo.train_line" type="text" class="w-4/5"
                                        maxlength="10" placeholder="総武線"/>線
                                </div>
                                <div class="flex items-center gap-4 w-full">
                                    <InputLabel required class="min-w-[45px]"/>
                                    <TextInput v-model="form.basicInfo.station" type="text" class="w-4/5"
                                        required maxlength="15" placeholder="錦糸町"/>駅
                                </div>
                            </div>
                            <div class="col-span-2">
                                <InputLabel value="資格" />
                                <div v-for="(item, index) in 5" :key="index" class="flex items-center gap-4">
                                    {{ index + 1 }}
                                    <TextInput v-model="form.basicInfo.qualifications[index]" :modelValue="form.basicInfo.qualifications[index] ?? ''"
                                        type="text" class="mt-1 block w-full" maxlength="30" :placeholder="index === 0 ? 'ITパスポート' : (index === 1 ? '基本情報技術者試験' : '')"/>
                                </div>
                            </div>
                        </div>
                        <h2 class="text-lg font-medium my-6">希望条件</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="月単価" />
                                <SelectInput v-model="form.preferences.desired_price" class="mt-1 block w-full">
                                    <option v-for="(price, key) in constants?.check_items.price" :key="key" :value="key">
                                        {{ price }}
                                    </option>
                                </SelectInput>
                            </div>
                            <div>
                                <InputLabel value="稼働時期" />
                                <SelectInput v-model="form.preferences.desired_start" class="mt-1 block w-full">
                                    <option v-for="(month, key) in constants?.check_items.start" :key="key" :value="key">
                                        {{ month }}
                                    </option>
                                </SelectInput>
                            </div>
                            <div>
                                <InputLabel value="リモート勤務のご希望" />
                                <SelectInput v-model="form.preferences.desired_remote" class="mt-1 block w-full">
                                    <option v-for="(remote, key) in constants?.check_items.remote" :key="key" :value="key">
                                        {{ remote }}
                                    </option>
                                </SelectInput>
                            </div>
                            <div>
                                <InputLabel value="エリア" />
                                <SelectInput v-model="form.preferences.desired_area" class="mt-1 block w-full">
                                    <option v-for="(area, key) in constants?.check_items.area" :key="key" :value="key">
                                        {{ area }}
                                    </option>
                                </SelectInput>
                            </div>
                        </div>
                        <div class="mt-8">
                            <h2 class="text-lg font-medium mb-6">業務経歴 <span class="text-blue-500">※直近、13経歴まで最大追加可能</span></h2>
                            <div v-for="(experience, index) in form.experiences" :key="index"
                                class="mb-8 p-6 border rounded-lg">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-md font-medium">経歴 {{ index + 1 }}</h3>
                                    <button type="button" @click="removeExperience(index)"
                                        class="text-red-600 hover:text-red-800" v-if="form.experiences.length > 1">
                                        削除
                                    </button>
                                </div>
                                <div class="grid grid-cols-2 gap-6">
                                    <div class="col-span-2">
                                        <InputLabel value="期間" :required="!index"/>
                                        <div class="flex items-center gap-4">
                                            <TextInput v-model="experience.period" type="number" class="mt-1 block w-1/2"
                                                :required="!index" @input="limitNumberInput($event, 3, (value) => experience.period = value)" :placeholder="8"/>
                                                <span class="min-w-[30px]">ヵ月</span>
                                        </div>
                                    </div>
                                    <div class="col-span-2">
                                        <InputLabel value="業種" :required="!index"/>
                                        <TextInput v-model="experience.business" type="text" class="mt-1 block w-full"
                                            :required="!index" maxlength="15" placeholder="金融業"/>
                                    </div>
                                    <div>
                                        <InputLabel value="PJ規模" :required="!index"/>
                                        <SelectInput v-model="experience.pj_scale_id" class="mt-1 block w-full" :required="!index">
                                            <option v-for="(pj_scale, key) in constants?.pj_scale" :key="key" :value="pj_scale.id">
                                                {{ pj_scale.display_name }}
                                            </option>
                                        </SelectInput>
                                    </div>
                                    <div>
                                        <InputLabel value="チーム人数" :required="!index"/>
                                        <TextInput v-model="experience.team_size" type="number" class="mt-1 block w-full"
                                            :required="!index" @input="limitNumberInput($event, 3, (value) => experience.team_size = value)" :placeholder="28" />
                                    </div>
                                    <div class="col-span-2" :required="!index">
                                        <InputLabel value="立場" :required="!index"/>
                                        <TextInput v-model="experience.position" type="text" class="mt-1 block w-full"
                                            :required="!index" maxlength="15" placeholder="PG"/>
                                    </div>
                                    <div class="col-span-2">
                                        <InputLabel value="工程" tips="プロジェクトで経験した工程を選択してください。複数選択可"/>
                                        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mt-2">
                                            <div v-for="(display_name, name) in props.constants.work_experience.work" class="flex gap-2" :key="name">
                                                <Checkbox v-model="experience[name]" :checked="experience[name]"></Checkbox>
                                                <InputLabel :value="display_name"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-2">
                                        <InputLabel value="業務内容" :required="!index"/>
                                        <textarea v-model="experience.description"
                                            class="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="3" :required="!index" maxlength="500" placeholder="■総合管理システム開発支援・社員用Webページの作成"></textarea>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 gap-4 mt-4">
                                    <div v-for="(display, name) in props.constants.work_experience.tech">
                                        <InputLabel :value="display.display_name" />
                                        <TextInput v-model="experience[name]" class="mt-1 block w-full" maxlength="255" :placeholder="display.placeholder"/>
                                    </div>
                                </div>
                            </div>
                            <button type="button" @click="addExperience"
                                class="mt-4 text-indigo-600 hover:text-indigo-800" v-if="form.experiences.length < 13">
                                ＋ 経歴を追加
                            </button>
                        </div>

                        <div class="mt-8">
                            <h2 class="text-lg font-medium">保有スキル</h2>
                            <h2 class="flex flex-wrap text-lg justify-center gap-x-6"><span>1：独学</span><span>2：指示が必要</span><span>3：確認が必要</span><span>4：一人称でできる</span><span>5：指導できる</span></h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <div class="mt-10" v-for="(displayName, name) in props.constants.skill_group" :key="name">
                                    <div class="flex items-center justify-center gap-4 mb-2">
                                        <span class="text-lg font-semibold min-w-[135px]">{{ displayName }}</span>
                                        <span class="text-center w-24">自己評価</span>
                                    </div>
                                    <div v-for="(item, itemIndex) in props.constants.check_items[name]" :key="itemIndex">
                                        <div class="flex items-center justify-center gap-4 mt-6">
                                            <span class="min-w-[135px]">{{ item.display_name }}</span>
                                            <SelectInput class="w-24" v-model="form.skill_score[name][item.name]">
                                                <option v-for="n in constants.ratings" :key="n" :value="n">{{ n }}</option>
                                            </SelectInput>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 mb-20">
                            <h2 class="text-lg font-medium">自己分析</h2>
                            <h2 class="flex flex-wrap text-lg justify-center gap-x-6"><span>1：できない</span><span>2：少しできる</span><span>3：普通</span><span>4：できる</span><span>5：良くできる</span></h2>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <div v-for="(item, index) in getColumns()" :key="index">
                                    <div class="flex items-center justify-center gap-4 mt-4">
                                        <span class="min-w-[135px]"></span>
                                        <span class="text-center w-24">自己評価</span>
                                    </div>
                                </div>
                                <template v-for="(label, key) in constants.personality" :key="key">
                                    <div class="flex items-center justify-center gap-4 mt-4">
                                        <span class="min-w-[135px]">{{ label }}</span>
                                        <SelectInput class="w-24" v-model="form.personality[key]">
                                            <option v-for="n in constants.ratings" :key="n" :value="n">{{ n }}</option>
                                        </SelectInput>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </template>
    </AppLayout>
</template>