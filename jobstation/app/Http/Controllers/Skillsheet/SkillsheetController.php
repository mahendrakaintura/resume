<?php

namespace App\Http\Controllers\Skillsheet;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use App\Models\CheckItemGroup;
use App\Models\PjScale;
use App\Models\Entry;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SkillsheetController extends Controller
{
    public function getConfig(): array
    {
        $pj_scale = PjScale::all()->map(function ($item) {
            $item->display_name = config('constants.pj_scale')[$item->name];
            return $item;
        });

        return [
            'check_items' => $this->groupCheckItems(),
            'age' => range(20, 90),
            'years_of_experience' => range(1, 55),
            'pj_scale' => $pj_scale,
            'work_experience' => config('constants.work_experience'),
            'skill_group' => config('constants.skill_group'),
            'personality' => config('constants.personality'),
            'ratings' => range(1, 5)
        ];
    }

    public function show(): InertiaResponse|RedirectResponse
    {
        $temporaryData = session('temporary_skillsheet');
        if ($temporaryData) {
            return redirect()->route('entry.skillsheet');
        }

        return Inertia::render('Entry/Skillsheet', [
            'constants' => $this->getConfig(),
            'user' => auth()->user()->load('workExperiences'),
            'temporaryData' => null
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Debug logging
        Log::info('Skillsheet store method called', [
            'request_data' => $request->all()
        ]);

        try {
            DB::beginTransaction();

            try {
                $validated = $request->validate([
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
                    'experiences.0.pj_scale_id' => 'required|integer|min:1|max:6',
                    'experiences.0.team_size' => 'required|integer|min:0|max:999',
                    'experiences.0.position' => 'required|string|max:15',

                    'experiences.0.description' => 'required|string|max:500',
                    // 第一経歴任意入力＋第二経歴以降
                    'experiences.*.period' => 'nullable|integer|min:0|max:999',
                    'experiences.*.business' => 'nullable|string|max:15',
                    'experiences.*.pj_scale_id' => 'nullable|integer|min:0|max:6',
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
                    'skill_score.*.*' => 'required|integer|min:0|max:5',
                    // 人物像
                    'personality' => 'nullable|array',
                    'personality.*' => 'required|integer|min:0|max:5'

                ]);
            } catch (\Illuminate\Validation\ValidationException $e) {
                Log::error('Validation failed:', [
                    'errors' => $e->errors(),
                    'data' => [
                        'basicInfo' => $request->input('basicInfo'),
                        'preferences' => $request->input('preferences'),
                        'experiences' => $request->input('experiences'),
                        'skill_score' => $request->input('skill_score'),
                        'personality' => $request->input('personality')
                    ]
                ]);
                throw $e;
            }

            $validated['basicInfo']['qualifications'] = array_filter($validated['basicInfo']['qualifications']);

            $validated['experiences'] = collect($validated['experiences'])->filter(function ($experience) {
                return collect($experience)->filter()->isNotEmpty();
            })->values();

            $validated['skill_score'] = array_filter(
                array_map(function ($skillGroup) {
                    $filteredSkills = array_filter($skillGroup, function ($value) {
                        return $value;
                    });
                    return $filteredSkills;
                }, $validated['skill_score'])
            );

            $check_items = $this->groupCheckItems();

            $bitRepresentation = collect($validated['skill_score'])->map(function ($skills, $groupName) use ($check_items) {
                $checkItems = $check_items[$groupName] ?? collect();
                $bitValue = $checkItems->reduce(function ($carry, $item) use ($skills) {
                    if (isset($skills[$item['name']])) {
                        $carry |= (1 << ($item['bit_number'] - 1));
                    }
                    return $carry;
                }, 0);

                return $bitValue;
            });

            $validated['personality'] = array_filter($validated['personality']);

            $user = Auth::user();
            $user->update([
                'initial' => $validated['basicInfo']['initial'],
                'age' => $validated['basicInfo']['age'],
                'years_of_experience' => $validated['basicInfo']['years_of_experience'],
                'sex' => $validated['basicInfo']['sex'],
                'is_japanese' => $validated['basicInfo']['is_japanese'],
                'nationality' => $validated['basicInfo']['is_japanese'] ? '' : ($validated['basicInfo']['nationality'] ?? ''),
                'education' => $validated['basicInfo']['education'] ?? '',
                'address' => $validated['basicInfo']['address'] ?? '',
                'train_line' => $validated['basicInfo']['train_line'] ?? '',
                'station' => $validated['basicInfo']['station'],
                'qualifications' => array_values($validated['basicInfo']['qualifications']),

                'desired_start' => !empty($validated['preferences']['desired_start']) ? (1 << ($validated['preferences']['desired_start'] - 1)) : 0,
                'desired_area' => !empty($validated['preferences']['desired_area']) ? (1 << ($validated['preferences']['desired_area'] - 1)) : 0,
                'desired_price' => !empty($validated['preferences']['desired_price']) ? (1 << ($validated['preferences']['desired_price'] - 1)) : 0,
                'desired_remote' => !empty($validated['preferences']['desired_remote']) ? (1 << ($validated['preferences']['desired_remote'] - 1)) : 0,

                'skill_score' => $validated['skill_score'],

                'skill_business' => $bitRepresentation['business'] ?? 0,
                'skill_work' => $bitRepresentation['work'] ?? 0,
                'skill_frontend' => $bitRepresentation['frontend'] ?? 0,
                'skill_backend' => $bitRepresentation['backend'] ?? 0,
                'skill_framework' => $bitRepresentation['framework'] ?? 0,
                'skill_server' => $bitRepresentation['server'] ?? 0,
                'skill_middleware' => $bitRepresentation['middleware'] ?? 0,
                'skill_os' => $bitRepresentation['os'] ?? 0,
                'skill_database' => $bitRepresentation['database'] ?? 0,
                'skill_environment' => $bitRepresentation['environment'] ?? 0,
                'skill_tool' => $bitRepresentation['tool'] ?? 0,
                'skill_others' => $bitRepresentation['others'] ?? 0,

                'personality' => $validated['personality']
            ]);

            $user->workExperiences()->delete();

            foreach ($validated['experiences'] as $index => $experience) {
                $user->workExperiences()->create([
                    'branch_id' => $index + 1,
                    'display_order' => $index + 1,
                    'period' => $experience['period'] ?? 0,
                    'business' => $experience['business'] ?? '',
                    'pj_scale_id' => max(1, $experience['pj_scale_id'] ?? 1),
                    'team_size' => $experience['team_size'] ?? 0,
                    'position' => $experience['position'] ?? '',

                    'analysis' => $experience['analysis'] ?? false,
                    'requirement_definition' => $experience['requirement_definition'] ?? false,
                    'basic_design' => $experience['basic_design'] ?? false,
                    'detail_design' => $experience['detail_design'] ?? false,
                    'programing' => $experience['programing'] ?? false,
                    'unit_test' => $experience['unit_test'] ?? false,
                    'integration_test' => $experience['integration_test'] ?? false,
                    'monitoring' => $experience['monitoring'] ?? false,
                    'maintenance' => $experience['maintenance'] ?? false,
                    'server_design' => $experience['server_design'] ?? false,
                    'server_construction' => $experience['server_construction'] ?? false,
                    'network_design' => $experience['network_design'] ?? false,
                    'network_construction' => $experience['network_construction'] ?? false,

                    'description' => $experience['description'] ?? '',

                    'language' => $experience['language'] ?? '',
                    'os' => $experience['os'] ?? '',
                    'db' => $experience['db'] ?? '',
                    'fw' => $experience['fw'] ?? '',
                    'mw' => $experience['mw'] ?? '',
                    'server' => $experience['server'] ?? '',
                    'environment' => $experience['environment'] ?? '',
                    'tool' => $experience['tool'] ?? '',
                    'network' => $experience['network'] ?? '',
                    'others' => $experience['others'] ?? ''
                ]);
            }

            $projectId = Session::pull('entry_project_id');
            if ($projectId) {
                // Get the project details
                $project = \App\Models\Project::find($projectId);

                if ($project) {
                    Entry::firstOrCreate(
                        [
                            'user_id' => $user->id,
                            'project_id' => $projectId
                        ],
                        [
                            'status_id' => 1,
                            'project_title' => $project->title,
                            'project_period' => $project->period,
                            'project_working_hours' => $project->working_hours,
                            'project_workplace' => $project->workplace,
                            'project_price' => $project->price,
                            'project_skills' => $project->skills,
                            'project_summary' => $project->summary,
                            'project_head_count' => $project->head_count,
                            'project_monthly_working_hours' => $project->monthly_working_hours
                        ]
                    );
                }
            }

            DB::commit();

            Log::info('Skillsheet saved successfully', [
                'user_id' => $user->id,
                'project_id' => $projectId ?? 'none'
            ]);

            // スキルシートが正常に保存された後、ホームにリダイレクト
            return redirect()->route('home')->with('alert', [
                'message' => 'スキルシートを登録し、エントリーが完了しました。',
                'type' => 'success'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::error('Skillsheet validation error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Skillsheet store error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->with('alert', [
                'message' => 'エラーが発生しました。',
                'type' => 'error'
            ]);
        }
    }

    public function groupCheckItems()
    {
        $groupedItems = CheckItemGroup::with('checkItems')->get();
        return $groupedItems->mapWithKeys(function ($group) {
            return [
                $group->name => $group->checkItems->map(function ($item) {
                    return [
                        'bit_number' => $item->bit_number,
                        'name' => $item->name,
                        'display_name' => $item->display_name
                    ];
                })
            ];
        });
    }
}
