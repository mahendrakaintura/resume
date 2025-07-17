<?php

namespace App\Http\Controllers\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\CheckItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Project::query();

        if ($request->filled('area')) {
            $bitNumber = (int)$request->get('area');
            if ($bitNumber >= 1 && $bitNumber <= 47) {
                $bitmask = 1 << ($bitNumber - 1);
                $query->whereRaw('area & ? > 0', [$bitmask]);
            }
        }

        if ($request->filled('display_price')) {
            $bitNumber = (int)$request->get('display_price');
            if ($bitNumber >= 1 && $bitNumber <= 9) {
                $bitmask = 1 << ($bitNumber - 1);
                $query->whereRaw('price & ? > 0', [$bitmask]);
            }
        }

        if ($request->filled('skill_search')) {
            $skillSearch = $request->get('skill_search');
            $query->where('skills', 'LIKE', '%' . $skillSearch . '%');
        }

        if ($request->filled('language')) {
            $languageId = (int)$request->get('language');
            if ($languageId >= 1 && $languageId <= 35) {
                $bitmask = 1 << ($languageId - 1);
                $query->whereRaw('language & ? > 0', [$bitmask]);
            }
        }

        if ($request->filled('start')) {
            $bitNumber = (int)$request->get('start');
            if ($bitNumber >= 1 && $bitNumber <= 12) {
                $bitmask = 1 << ($bitNumber - 1);
                $query->whereRaw('start & ? > 0', [$bitmask]);
            }
        }

        if ($request->get('sort') === 'display_price_high') {
            $query->orderByRaw('CAST(REPLACE(REPLACE(display_price, ",", ""), "¥", "") AS UNSIGNED) DESC');
        } else {
            $query->latest('created_at');
        }

        if ($request->filled('last_id')) {
            $lastId = $request->get('last_id');
            $query->where('id', '<', $lastId);
        }

        $projects = $query->with('favoriteUsers')
            ->take(10)
            ->get()
            ->map(function ($project) {
                return $project->append(['is_favorited', 'remote_work_display', 'has_entry']);
            });

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'hasMore' => $projects->count() === 10,
            'filters' => $request->only([
                'area',
                'display_price',
                'language',
                'skill_search',
                'start',
                'sort'
            ]),
            'filterOptions' => [
                'areas' => config('constants.basic_info.desired_area'),
                'prices' => config('constants.basic_info.desired_price'),
                'languages' => config('constants.basic_info.desired_language'),
                'starts' => config('constants.basic_info.desired_start'),
                'remotes' => config('constants.basic_info.desired_remote'),
            ]
        ]);
    }

    public function show(Project $project): Response
    {
        $project->append(['is_favorited', 'remote_work_display', 'has_entry']);
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'remoteOptions' => CheckItem::where('check_item_group_id', 4)
                ->pluck('display_name', 'bit_number')
        ]);
    }
}
