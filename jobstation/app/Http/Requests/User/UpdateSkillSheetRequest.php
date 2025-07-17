<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillSheetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 基本情報
            'basicInfo' => 'required|array',
            'basicInfo.initial' => 'required|string|max:5',
            'basicInfo.age' => 'required|integer|min:20|max:90',
            'basicInfo.years_of_experience' => 'required|integer|min:0|max:55',
            'basicInfo.sex' => 'required|in:man,woman',
            'basicInfo.is_japanese' => 'required|boolean',
            'basicInfo.nationality' => 'required_if:basicInfo.is_japanese,false|nullable|string|max:40',
            'basicInfo.education' => 'nullable|string|max:40',
            'basicInfo.address' => 'nullable|string|max:40',
            'basicInfo.train_line' => 'nullable|string|max:10',
            'basicInfo.station' => 'required|string|max:15',
            'basicInfo.qualifications' => 'nullable|array|max:5',
            'basicInfo.qualifications.*' => 'nullable|string|max:30',
            // 希望条件
            'preferences.desired_area' => 'nullable|integer|min:0|max:48',
            'preferences.desired_start' => 'nullable|integer|min:0|max:12',
            'preferences.desired_price' => 'nullable|integer|min:0|max:9',
            'preferences.desired_remote' => 'nullable|integer|min:0|max:3',
            // 第一経歴必須入力
            'experiences' => 'required|array|min:1|max:13',
            'experiences.0.period' => 'required|integer|min:0|max:999',
            'experiences.0.business' => 'required|string|max:15',
            'experiences.0.pj_scale_id' => 'required|integer|min:1|max:7',
            'experiences.0.team_size' => 'required|integer|min:0|max:999',
            'experiences.0.position' => 'required|string|max:15',

            'experiences.0.description' => 'required|string|max:500',
            // 第一経歴任意入力＋第二経歴以降
            'experiences.*.period' => 'nullable|integer|min:0|max:999',
            'experiences.*.business' => 'nullable|string|max:15',
            'experiences.*.pj_scale_id' => 'nullable|integer|min:0|max:7',
            'experiences.*.team_size' => 'nullable|integer|min:0|max:999',
            'experiences.*.position' => 'nullable|string|max:15',

            'experiences.*.analysis' => 'nullable|boolean',
            'experiences.*.requirement_definition' => 'nullable|boolean',
            'experiences.*.basic_design' => 'nullable|boolean',
            'experiences.*.detail_design' => 'nullable|boolean',
            'experiences.*.programing' => 'nullable|boolean',
            'experiences.*.unit_test' => 'nullable|boolean',
            'experiences.*.integration_test' => 'nullable|boolean',
            'experiences.*.monitoring' => 'nullable|boolean',
            'experiences.*.maintenance' => 'nullable|boolean',
            'experiences.*.server_design' => 'nullable|boolean',
            'experiences.*.server_construction' => 'nullable|boolean',
            'experiences.*.network_design' => 'nullable|boolean',
            'experiences.*.network_construction' => 'nullable|boolean',

            'experiences.*.description' => 'nullable|string|max:500',

            'experiences.*.language' => 'nullable|string|max:255',
            'experiences.*.os' => 'nullable|string|max:255',
            'experiences.*.db' => 'nullable|string|max:255',
            'experiences.*.fw' => 'nullable|string|max:255',
            'experiences.*.mw' => 'nullable|string|max:255',
            'experiences.*.server' => 'nullable|string|max:255',
            'experiences.*.environment' => 'nullable|string|max:255',
            'experiences.*.tool' => 'nullable|string|max:255',
            'experiences.*.network' => 'nullable|string|max:255',
            'experiences.*.others' => 'nullable|string|max:255',
            // スキルスコア
            'skill_score' => 'nullable|array',
            'skill_score.*' => 'nullable|array',
            'skill_score.*.*' => 'nullable|integer|min:0|max:5',
            // 人物像
            'personality' => 'nullable|array',
            'personality.*' => 'nullable|integer|min:0|max:5',
            // 自己分析
            'self_analysis' => 'nullable|array',
            'self_analysis.*' => 'nullable|integer|min:0|max:5'
        ];
    }
}
