<?php

namespace App\Http\Controllers\Application\Project;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\CrisisItem;
use App\Activity;
use App\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
class CrisisCenterController extends Controller
{
    public function getItems(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();
        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);
    }

    public function create(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();

        $item = CrisisItem::create([
            'name' => $request->item_title,
            'project_id' => $project->id,
            'priority' => $request->item_priority,
            'description' => $request->item_description,
            'user_id' => Auth::user()->id,
        ]);

        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 26,
            'content' => 0,
        ]);

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);
    }

    public function setSolved(Request $request) {
        $item = CrisisItem::findOrFail($request->id);
        if(!$item->solved) {
            $item->solved = 1;
            $item->user_id = Auth::user()->id;
            $item->solvedTime = Carbon::now()->toDateTimeString();
            $item->save();
        }


        $project = Project::where('url', '=', $request->project)->first();
        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 29,
            'content' => 0,
        ]);

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);
    }

    public function setProgress(Request $request) {
        $item = CrisisItem::findOrFail($request->id);

        if($item->solved) {
            $item->solved = 0;
            $item->user_id = Auth::user()->id;
            $item->solvedTime = Carbon::now()->toDateTimeString();
            $item->save();
        }


        $project = Project::where('url', '=', $request->project)->first();
        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 30,
            'content' => 0,
        ]);

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);
    }

    public function deleteItem(Request $request) {
        CrisisItem::destroy($request->id);

        $project = Project::where('url', '=', $request->project)->first();
        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 27,
            'content' => 0,
        ]);

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);

    }

    public function editItem(Request $request) {
        $item = CrisisItem::findOrFail($request->id);
        $item->name = $request->item_title;
        $item->description = $request->item_description;
        $item->priority = $request->item_priority;
        $item->save();

        $project = Project::where('url', '=', $request->project)->first();
        $progress = CrisisItem::where([['project_id', '=', $project->id], ['solved', false]])->with('user')->orderBy('id', 'desc')->get();
        $solved = CrisisItem::where([['project_id', '=', $project->id], ['solved', true]])->with('user')->orderBy('id', 'desc')->get();

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 28,
            'content' => 0,
        ]);

        return response()->json([
            'progress' => $progress,
            'solved' => $solved,
        ]);
    }

    public function getWidget(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();
        $numbers = [];

        $numbers[0] = CrisisItem::where([['project_id', $project->id], ['priority', 0], ['solved', false]])->count();
        $numbers[1] = CrisisItem::where([['project_id', $project->id], ['priority', 1], ['solved', false]])->count();
        $numbers[2] = CrisisItem::where([['project_id', $project->id], ['priority', 2], ['solved', false]])->count();

        return $numbers;

    }

}
