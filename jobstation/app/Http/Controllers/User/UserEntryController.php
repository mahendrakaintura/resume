<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Response;
use Inertia\Inertia;

class UserEntryController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        if (!$user) {
            return Inertia::render('Mypage/Entry', [
                'entries' => collect([])
            ]);
        }

        $entries = $user->entries()->get();
        $offers = $user->offers()->get();
        $combined = $entries->concat($offers);

        return Inertia::render('Mypage/Entry', [
            'entries' => $combined->sortByDesc('created_at')->values()
        ]);
    }

    public function cancel(Request $request): JsonResponse
    {
        $data = $request->validate(['entry_id' => 'required|integer']);
        $user = auth()->user();
        $cancelled = $user->entries()
            ->where('id', $data['entry_id'])
            ->where('status_id', 1)
            ->update(['status_id' => 2]);
        if ($cancelled) {
            return response()->json(['message' => 'エントリーを取り消しました。']);
        }
        return response()->json(['message' => 'エントリーが見つかりません。'], 404);
    }
}
