<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        return $this->processVerification($request);
    }

    private function processVerification(Request $request)
    {
        try {
            if (!$request->hasValidSignature()) {
                throw new \Exception('Invalid signature');
            }

            $userData = decrypt($request->data);
            $user = User::where('email', $userData['email'])->first();

            if (!$user) {
                $user = User::create([
                    'email' => $userData['email'],
                    'password' => $userData['password'],
                ]);
            } else {
                $user->markEmailAsVerified();
            }

            Auth::login($user);

            return redirect()
                ->route('mypage.skillsheet.edit', ['registered' => 'true']);
        } catch (\Exception) {
            return redirect()
                ->route('login')
                ->with('error', 'メール認証に失敗しました。もう一度お試しください。');
        }
    }
}