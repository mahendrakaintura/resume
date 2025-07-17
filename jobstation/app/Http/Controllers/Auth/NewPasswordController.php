<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{

    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $messages = [
            'password.required' => 'パスワードを入力してください。',
            'password.confirmed' => 'パスワードと確認用パスワードが一致しません。',
            'password.min' => 'パスワードは8文字以上40文字以下で入力してください。',
            'password.max' => 'パスワードは8文字以上40文字以下で入力してください。',
            'email.required' => 'メールアドレスを入力してください。',
            'email.email' => '有効なメールアドレスを入力してください。',
            'email.exists' => 'アカウントが存在しないため、パスワード再設定ができません。画面を閉じて下さい。',
            'token.required' => 'トークンが必要です。',
        ];

        $request->validate([
            'token' => 'required',
            'email' => ['required', 'exists:users,email'],
            'password' => ['required', 'confirmed', 'min:8', 'max:40'],
            // 'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], $messages);

        try {
            $tokenData = DB::table('user_password_reset_tokens')
                ->where('email', $request->email)
                ->whereRaw('LOWER(token) = ?', [strtolower($request->token)])
                ->first();

            if (!$tokenData) {
                throw ValidationException::withMessages([
                    'email' => 'トークンが無効です。',
                ]);
            }

            if (now()->diffInMinutes($tokenData->created_at) > 60) {
                DB::table('user_password_reset_tokens')
                    ->where('email', $request->email)
                    ->delete();
                throw ValidationException::withMessages([
                    'email' => 'トークンの有効期限が切れています。',
                ]);
            }

            DB::table('users')
                ->where('email', $request->email)
                ->update([
                    'password' => Hash::make($request->password),
                ]);

            DB::table('user_password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return redirect()->route('login')->with('status', 'パスワードを再設定しました。');
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => 'パスワードの再設定に失敗しました。',
            ]);
        }
    }
}
