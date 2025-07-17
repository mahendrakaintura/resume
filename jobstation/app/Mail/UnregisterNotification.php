<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UnregisterNotification extends Mailable
{
    use SerializesModels;

    public $name;

    public function __construct(?User $user = null)
    {
        $this->name = $user->name;
    }

    public function build()
    {
        return $this->markdown('emails.unregisterNotification')->subject('ジョブステーション退会完了のお知らせ');
    }
}
