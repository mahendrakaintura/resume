<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserChangePasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Mypage/ChangePassword');
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            auth()->user()->update([
                'password' => Hash::make($request->password)
            ]);
            return redirect()->back()
                ->with('alert', 'パスワードを変更しました。');
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'パスワードの変更に失敗しました。',
                'system' => $e->getMessage()
            ])->with('error', 'パスワードの変更に失敗しました。');
        }
    }
}
