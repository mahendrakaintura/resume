<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class ResetPassword extends Mailable
{
    use SerializesModels;

    public $token;
    public $email;
    public $user;
    public $resetUrl;

    public function __construct($token, $email, ?User $user = null)
    {
        $this->token = $token;
        $this->email = $email;
        $this->user = $user;
        $this->resetUrl = route('password.reset', [
            'token' => $this->token,
            'email' => $this->email,
        ]);
    }

    public function build()
    {
        return $this->markdown('emails.reset-password')
                    ->subject('パスワード再設定のご案内');
    }
}