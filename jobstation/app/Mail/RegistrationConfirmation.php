<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class RegistrationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $userData;
    public $verificationUrl;

    public function __construct(array $userData)
    {
        $this->userData = $userData;
        $id = Str::random(32);
        $hash = sha1($userData['email']);

        $this->verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $id,
                'hash' => $hash,
                'data' => encrypt($userData)
            ]
        );
    }

    public function build()
    {
        return $this->markdown('emails.registconfirm')
                    ->subject('会員登録のご案内');
    }
}
