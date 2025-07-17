<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Entry;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'hasEntrySession' => session()->has('entry_project_id')
        ]);
    }

    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();
            $request->session()->regenerate();

            config(['session.lottery' => [2, 100]]);
            session()->migrate(true, 21600);

            if (session('entry_project_id')) {
                $user = Auth::user();

                // Check if user has already made an entry for this project
                $existingEntry = Entry::where('user_id', $user->id)
                    ->where('project_id', session('entry_project_id'))
                    ->first();

                if ($existingEntry) {
                    // Clear the entry session and redirect with error
                    session()->forget('entry_project_id');
                    return response()->json([
                        'success' => false,
                        'message' => 'この案件はすでにエントリーされています。再度エントリーはできません。',
                        'redirect' => route('home')
                    ]);
                }

                // Check if user has complete skill sheet using same logic as EntryController
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

                if (!$hasRequiredUserInfo || !$hasRequiredWorkExperience) {
                    return response()->json([
                        'success' => false,
                        'message' => 'スキルシート入力フォームより情報の登録が必要です。『エントリーボタン』を押下してください。',
                        'redirect' => route('entry.skillsheet')
                    ]);
                }

                return redirect()->route('entry.start', ['project' => session('entry_project_id')]);
            }

            return redirect()->intended(route('home'));
        } catch (ValidationException $e) {
            return back()->withErrors([
                'email' => 'メールアドレスまたはパスワードが間違っています'
            ]);
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
