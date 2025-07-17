<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use App\Models\CheckItemGroup;
use App\Models\PjScale;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Requests\User\UpdateSkillSheetRequest;
use App\Models\User;

class UserSkillSheetController extends Controller
{
    public function edit(): InertiaResponse
    {
        try {
            $pj_scale = PjScale::all()->map(function ($item) {
                $item->display_name = config('constants.pj_scale')[$item->name];
                return $item;
            });

            $constants = [
                'age' => config('constants.basic_info.age'),
                'years_of_experience' => config('constants.basic_info.years_of_experience'),
                'check_items' => array_merge([
                    'price' => config('constants.basic_info.desired_price'),
                    'start' => config('constants.basic_info.desired_start'),
                    'remote' => config('constants.basic_info.desired_remote'),
                    'area' => config('constants.basic_info.desired_area'),
                    'language' => config('constants.check_item.language'),
                    'db' => config('constants.check_item.db'),
                    'os' => config('constants.check_item.os'),
                    'server' => config('constants.check_item.server'),
                    'fw' => config('constants.check_item.fw'),
                    'mw' => config('constants.check_item.mw'),
                    'network' => config('constants.check_item.network'),
                    'tool' => config('constants.check_item.tool'),
                    'environment' => config('constants.check_item.environment'),
                    'others' => config('constants.check_item.others'),
                ], $this->groupCheckItems()->toArray()),
                'pj_scale' => $pj_scale,
                'work_experience' => config('constants.work_experience'),
                'skill_group' => config('constants.skill_group'),
                'personality' => config('constants.personality'),
                'ratings' => range(1, 5),
            ];

            return Inertia::render('Mypage/Skillsheet', [
                'constants' => $constants,
                'user' => auth()->user()->load('workExperiences')
            ]);
        } catch (\Exception $e) {
            Log::error('Error in editSkillsheet', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function update(UpdateSkillSheetRequest $request): HttpResponse
    {
        try {
            Log::info('Update method called', ['request_data' => $request->all()]);

            $this->store($request);
            return redirect()->back()
                ->with('alert', 'スキルシートを更新しました。');
        } catch (\Exception $e) {
            Log::error('Update method error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors([
                'message' => 'スキルシートの更新に失敗しました',
                'system' => $e->getMessage()
            ])->with('error', 'スキルシートの更新に失敗しました');
        }
    }

    public function preview()
    {
        $pj_scale = PjScale::all()->mapWithKeys(function ($item) {
            return [$item->id => config('constants.pj_scale')[$item->name]];
        });
        $user = auth()->user()->load('workExperiences');
        $data = [
            'user' => $user,
            'pj_scale' => $pj_scale,
            'check_items' => $this->groupCheckItems(),
            'skill_score' => $this->populatedSkillScore($user),
            'personality' => $this->populatePersonality($user),
            'self_analysis' => $this->populateSelfAnalysis($user)
        ];
        $pdf = Pdf::loadView('/pdf/skillsheet', $data);
        $pdf->setPaper('a3', 'landscape');
        return Response::make($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="スキルシート.pdf"',
        ]);
    }

    public function store(UpdateSkillSheetRequest $request)
    {
        try {
            Log::info('Store method called', ['user_id' => Auth::id()]);

            DB::beginTransaction();

            $validated = $request->validated();

            $validated['basicInfo']['qualifications'] = array_filter($validated['basicInfo']['qualifications']);

            $validated['experiences'] = collect($validated['experiences'])->filter(function ($experience) {
                return collect($experience)->filter()->isNotEmpty();
            })->values();

            // Keep all skill scores, including 0 values which represent "no skill"
            $validated['skill_score'] = array_map(function ($skillGroup) {
                // Only filter out null/empty string values, keep 0 as valid
                return array_filter($skillGroup, function ($value) {
                    return $value !== null && $value !== '';
                });
            }, $validated['skill_score']);

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

            // Keep all personality values, including 0 which represents valid ratings
            $validated['personality'] = $validated['personality'];
            $validated['self_analysis'] = array_filter($validated['self_analysis'] ?? []);

            $user = Auth::user();

            $isJapanese = filter_var($validated['basicInfo']['is_japanese'], FILTER_VALIDATE_BOOLEAN);

            $user->update([
                'initial' => $validated['basicInfo']['initial'],
                'age' => $validated['basicInfo']['age'],
                'years_of_experience' => $validated['basicInfo']['years_of_experience'],
                'sex' => $validated['basicInfo']['sex'],
                'is_japanese' => $isJapanese,
                'nationality' => $isJapanese ? '日本' : ($validated['basicInfo']['nationality'] ?? ''),
                'education' => $validated['basicInfo']['education'] ?? '',
                'address' => $validated['basicInfo']['address'] ?? '',
                'train_line' => $validated['basicInfo']['train_line'] ?? '',
                'station' => $validated['basicInfo']['station'],
                'qualifications' => array_values($validated['basicInfo']['qualifications']),

                'desired_start' => $validated['preferences']['desired_start'] ? (1 << $validated['preferences']['desired_start'] - 1) : 0,
                'desired_area' => $validated['preferences']['desired_area'] ? (1 << $validated['preferences']['desired_area'] - 1) : 0,
                'desired_price' => $validated['preferences']['desired_price'] ? (1 << $validated['preferences']['desired_price'] - 1) : 0,
                'desired_remote' => $validated['preferences']['desired_remote'] ? (1 << $validated['preferences']['desired_remote'] - 1) : 0,

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

                'personality' => $validated['personality'],
                'self_analysis' => $validated['self_analysis']
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

            DB::commit();
            Log::info('Skillsheet updated successfully', ['user_id' => Auth::id()]);
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Skillsheet store error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            throw $e;
        }
    }

    private function groupCheckItems()
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

    private function populatedSkillScore($user)
    {
        $skill_group = config('constants.skill_group');
        $groupedItems = CheckItemGroup::with('checkItems')->get()->filter(function ($item) use ($skill_group) {
            return array_key_exists($item->name, $skill_group);
        });
        return $groupedItems->mapWithKeys(function ($group) use ($user) {
            return [
                $group->name => $group->checkItems->mapWithKeys(function ($item) use ($user, $group) {
                    return  [
                        $item->name => [
                            'display_name' => $item->display_name,
                            'score' => $user->skill_score->{$group->name}->{$item->name} ?? ''
                        ]
                    ];
                })
            ];
        })->toArray();
    }

    private function populatePersonality($user)
    {
        $personality = config('constants.personality');
        return collect($personality)->mapWithKeys(function ($value, $key) use ($user) {
            return [
                $key => [
                    'display_name' => $value,
                    'score' => $user->personality->{$key} ?? ''
                ]
            ];
        })->toArray();
    }

    private function populateSelfAnalysis($user)
    {
        $self_analysis = config('constants.self_analysis');
        return collect($self_analysis)->mapWithKeys(function ($value, $key) use ($user) {
            return [
                $key => [
                    'display_name' => $value,
                    'score' => $user->self_analysis->{$key} ?? ''
                ]
            ];
        })->toArray();
    }
}
