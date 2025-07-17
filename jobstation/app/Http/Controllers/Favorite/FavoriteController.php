<?php

namespace App\Http\Controllers\Favorite;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\UserFavoriteProject;
use Illuminate\Http\JsonResponse;

class FavoriteController extends Controller
{
    public function store(Project $project): JsonResponse
    {
        $exists = UserFavoriteProject::where('user_id', auth()->id())
            ->where('project_id', $project->id)
            ->exists();
        if ($exists) {
            return response()->json(null, 400);
        }

        UserFavoriteProject::create([
            'user_id' => auth()->id(),
            'project_id' => $project->id,
        ]);
        return response()->json(null, 200);
    }

    public function destroy(Project $project): JsonResponse
    {
        $deleted = UserFavoriteProject::where('user_id', auth()->id())
            ->where('project_id', $project->id)
            ->delete();
        if (!$deleted) {
            return response()->json(null, 404);
        }
        return response()->json(null, 200);
    }
}