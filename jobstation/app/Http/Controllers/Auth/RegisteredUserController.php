<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationConfirmation;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    protected $messages = [
        'email.required' => 'メールアドレスを入力してください',
        'email.string' => 'メールアドレスを正しい形式で入力してください',
        'email.email' => 'メールアドレスを正しい形式で入力してください',
        'email.max' => 'メールアドレスは255文字以内で入力してください',
        'password.required' => 'パスワードを入力してください',
        'password.string' => 'パスワードを正しい形式で入力してください',
        'password.min' => 'パスワードは8文字以上で入力してください'
    ];

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    'unique:' . User::class,
                ],
                'password' => [
                    'required',
                    'string',
                    'min:8'
                ],
            ], $this->messages);

            $userData = [
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ];

            Mail::to($userData['email'])->send(new RegistrationConfirmation($userData));

            return back();

        } catch (\Exception) {
            return back()->withErrors(['email' => '登録処理中にエラーが発生しました。もう一度お試しください。']);
        }
    }
}