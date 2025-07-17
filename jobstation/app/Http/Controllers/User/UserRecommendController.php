<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\CheckItemGroup;
use Inertia\Response;
use Inertia\Inertia;

class UserRecommendController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $userExperiencedframework = $this->calculateFrameworkBitmask();

        $projects = Project::selectRaw("
            projects.*,
            (
                IF(? > b'0' AND projects.price > b'0' AND ? <= projects.price, 20, 0) +
                IF(? > b'0' AND projects.start > b'0' AND (? & projects.start) > 0, 20, 0) +
                IF(? > b'0' AND projects.area > b'0' AND (? & projects.area) > 0, 20, 0) +
                IF(? > b'0' AND projects.remote > b'0' AND (? = b'1' OR projects.remote = b'1' OR (? & projects.remote) > 0), 20, 0) +
                IF(? > b'0' AND projects.framework > b'0' AND (? & projects.framework) > 0, 20, 0)
            ) AS match_score
        ", [
            $user->desired_price, $user->desired_price,
            $user->desired_start, $user->desired_start,
            $user->desired_area, $user->desired_area,
            $user->desired_remote, $user->desired_remote, $user->desired_remote,
            $userExperiencedframework, $userExperiencedframework
        ])
        ->withCount(['entries as has_entry' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->having('match_score', '>', 0)
        ->orderByDesc('match_score')
        ->get();
        
        return Inertia::render('Projects/Recommend', [
            'projects' => $projects
        ]);
    }
    
    private function groupCheckItems()
    {
        $groupedItems = CheckItemGroup::with('checkItems')->where('name', 'framework')->first();
        return $groupedItems->checkItems->mapWithKeys(function ($item) {
            return [strtolower($item->display_name) => $item->bit_number];
        })->toArray();
    }

    private function frameworkFromExperienceToBits()
    {
        $user = auth()->user();
        $userframeworks = $user->workExperiences
            ->pluck('fw')
            ->filter()
            ->flatMap(function ($fw) {
                return array_map(function ($framework) {
                    return strtolower(trim($framework));
                }, explode(',', $fw));
            })
            ->unique()
            ->values()
            ->all();
        return $userframeworks;
    }

    private function isSimilar($input, $target)
    {
        $normalizedInput = preg_replace('/[^a-z0-9]/', '', $input);
        $normalizedTarget = preg_replace('/[^a-z0-9]/', '', $target);

        return $normalizedInput === $normalizedTarget || levenshtein($normalizedInput, $normalizedTarget) <= 2;
    }

    private function calculateFrameworkBitmask()
    {
        $frameworkMapping = $this->groupCheckItems();
        $userFrameworks = $this->frameworkFromExperienceToBits();

        $bitmask = 0;

        foreach ($userFrameworks as $framework) {
            foreach ($frameworkMapping as $targetFramework => $bitNumber) {
                if ($this->isSimilar($framework, $targetFramework)) {
                    $bitmask |= (1 << ($bitNumber - 1));
                    break;
                }
            }
        }
        return $bitmask;
    }
}