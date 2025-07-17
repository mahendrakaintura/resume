<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserDeletionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Mypage/Unregister');
    }

    public function destroy(): RedirectResponse
    {
        auth()->user()->delete();
        auth()->logout();
        return redirect()->route('home');
    }
}
