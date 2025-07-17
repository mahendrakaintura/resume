<?php

namespace App\Http\Controllers\Entry;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Http\Controllers\Skillsheet\SkillsheetController;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Support\Facades\Log;


class EntryController extends Controller
{

    public function start(Request $request, Project $project): RedirectResponse|JsonResponse
    {
        $request->session()->put('entry_project_id', $project->id);

        if (Auth::check()) {
            $user = Auth::user();
            $hasRequiredUserInfo = $user->initial &&
                $user->age &&
                $user->sex &&
                ($user->is_japanese || $user->nationality) &&
                $user->station;

            $workExperiences = $user->workExperiences;
            $firstExperience = $workExperiences->sortBy('display_order')->first();

            $hasRequiredWorkExperience = $firstExperience &&
                !is_null($firstExperience->period) &&
                $firstExperience->period > 0 &&
                !is_null($firstExperience->business) &&
                strlen($firstExperience->business) > 0 &&
                !is_null($firstExperience->pj_scale_id) &&
                $firstExperience->pj_scale_id > 0 &&
                !is_null($firstExperience->team_size) &&
                $firstExperience->team_size > 0 &&
                !is_null($firstExperience->position) &&
                strlen($firstExperience->position) > 0 &&
                !is_null($firstExperience->description) &&
                strlen($firstExperience->description) > 0;

            if ($hasRequiredUserInfo && $hasRequiredWorkExperience) {
                // Check if user has already made an entry for this project
                $existingEntry = \App\Models\Entry::where('user_id', $user->id)
                    ->where('project_id', $project->id)
                    ->first();

                if ($existingEntry) {
                    session()->forget('entry_project_id');
                    return response()->json([
                        'success' => false,
                        'message' => 'この案件には既にエントリー済みです。',
                        'redirect' => route('mypage.entries.index')
                    ]);
                }

                try {
                    $entry = new \App\Models\Entry([
                        'user_id' => $user->id,
                        'project_id' => $project->id,
                        'status_id' => 1,
                        'entry_date' => now(),
                        'project_title' => $project->title,
                        'project_period' => $project->period,
                        'project_working_hours' => $project->working_hours,
                        'project_workplace' => $project->workplace,
                        'project_price' => $project->price,
                        'project_skills' => $project->skills,
                        'project_summary' => $project->summary,
                        'project_head_count' => $project->head_count,
                        'project_monthly_working_hours' => $project->monthly_working_hours
                    ]);

                    $entry->save();
                    session()->forget('entry_project_id');

                    return response()->json([
                        'success' => true,
                        'message' => '応募が完了しました',
                        'redirect' => route('mypage.entries.index')
                    ]);
                } catch (\Exception $e) {
                    Log::error('Entry creation failed:', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'project_id' => $project->id,
                        'user_id' => Auth::id()
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'エントリーの登録に失敗しました'
                    ]);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'エントリーを開始します。スキルシートを登録してください。',
                'redirect' => route('entry.skillsheet')
            ]);
        }

        return redirect()->route('login');
    }

    public function startRegister(Request $request, Project $project): RedirectResponse
    {
        $request->session()->put('entry_project_id', $project->id);
        return redirect()->route('register');
    }

    public function temporarySave(Request $request): JsonResponse
    {
        $data = $request->validate([
            'skillsheet' => 'required|array'
        ]);

        session()->put('temporary_skillsheet', $data['skillsheet']);
        session()->save();

        return response()->json([
            'success' => true,
            'message' => '入力内容を一時保存しました。'
        ]);
    }

    public function showSkillSheet(): InertiaResponse|RedirectResponse
    {
        $projectId = session('entry_project_id');
        if (!$projectId) {
            return redirect()->route('home')->with('error', '応募情報が見つかりません。');
        }

        $temporaryData = session('temporary_skillsheet');
        if (!$temporaryData) {
            return redirect()->route('skillsheet.show');
        }

        $skillsheetController = new SkillsheetController();
        return Inertia::render('Entry/Skillsheet', [
            'project' => Project::findOrFail($projectId),
            'user' => auth()->user()->load('workExperiences'),
            'constants' => $skillsheetController->getConfig(),
            'temporaryData' => $temporaryData
        ]);
    }

    public function submit(Request $request): RedirectResponse
    {
        try {
            $projectId = session('entry_project_id');
            if (!$projectId) {
                throw new \Exception('Project ID not found in session');
            }

            // Delegate skillsheet processing to SkillsheetController
            $skillsheetController = new SkillsheetController();
            return $skillsheetController->store($request);
        } catch (\Exception $e) {
            Log::error('Entry submit error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->with('alert', [
                'message' => 'エントリーの登録に失敗しました',
                'type' => 'error'
            ]);
        }
    }

    public function backToProject(): RedirectResponse
    {
        $projectId = session('entry_project_id');
        if (!$projectId) {
            return redirect()->route('home');
        }
        return redirect()->route('projects.show', $projectId);
    }
}
