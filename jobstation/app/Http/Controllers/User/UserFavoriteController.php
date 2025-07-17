<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\UserFavoriteProject;
use App\Models\CheckItem;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserFavoriteController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $projects = $user->favoriteProjects()->get()
            ->map(function ($project) {
                return $project->append(['remote_work_display', 'has_entry']);
            });
        return Inertia::render('Mypage/Favorite', [
            'projects' => $projects,
            'remoteOptions' => CheckItem::where('check_item_group_id', 4)
                ->pluck('display_name', 'bit_number')
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_ids' => 'required|array',
            'project_ids.*' => 'integer|exists:projects,id'
        ]);
        $validIds = UserFavoriteProject::whereIn('project_id', $data['project_ids'])->where('user_id', Auth::id())->pluck('project_id');
        $deleted = UserFavoriteProject::whereIn('project_id', $validIds)->delete();
        if ($deleted) {
            return response()->json(['message' => 'お気に入り案件を削除しました。', 'count' => $deleted, 'deletedIds' => $validIds]);
        }
        return response()->json(['message' => 'お気に入り案件を削除できません'], 404);
    }
}
