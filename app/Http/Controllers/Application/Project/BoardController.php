<?php

namespace App\Http\Controllers\Application\Project;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\BoardItem;
use App\Project;
use App\Activity;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Column;
use App\Events\Notifications;
use App\Notification;
class BoardController extends Controller
{
    public function getItems(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();

        return $project->boardItems;
    }

    public function getColumns(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();
        $columns = Column::where('project_id', '=', $project->id)->get();

        return $columns->pluck('name');
    }

    public function changeColumn(Request $request) {
        $item = BoardItem::findOrFail($request->id);
        $project = Project::where('url', '=', $request->project)->first();
        $column = Column::where([['name', '=',$request->column], ['project_id', '=', $project->id]])->first();
        $item->column_id = $column->id;
        $item->save();
    }

    public function createItem(Request $request) {
        $project = Project::where('url', '=', $request->project)->first();
        $column = Column::where([['position', '=', 0], ['project_id', '=', $project->id]])->first();
        $created = false;
        $item = BoardItem::create([
            'name' => $request->card_name,
            'description' => $request->card_description,
            'project_id' => $project->id,
            'user_id' => $request->card_user,
            'column_id' => $column->id,
            'color' => $request->card_color,
            'duration' => $request->card_expected,
        ]);

        Activity::create([
            'project_id' => $project->id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 16,
            'content' => 0,
        ]);

        if($request->card_user != 0) {
            $notification = Notification::create([
                'user_id' =>$request->card_user,
                'title' => 'New assigned card',
                'type' => 'far fa-id-card',
                'content' => 'you have a new assigned card in the project ' . $project->name . '.',
            ]);
            $user = User::findOrFail($request->card_user);
            broadcast(new Notifications($notification,$user))->toOthers();
        }
        
        $created = true;
        if($created) {
            return BoardItem::with('column')->orderBy('id', 'desc')->first();

        }
    }

    public function editItem(Request $request) {
        $item = BoardItem::findOrFail($request->editCard_id);
        $item->name = $request->editCard_name;
        $item->description = $request->editCard_description;
        $item->user_id = $request->editCard_user;
        $item->color = $request->editCard_color;
        $item->duration = $request->editCard_expected;
        $item->save();

        Activity::create([
            'project_id' => $item->project_id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 18,
            'content' => 0,
        ]);
    }

    public function deleteItem(Request $request) {
        $item = BoardItem::findOrFail($request->id);
        Activity::create([
            'project_id' => $item->project_id,
            'company_id' => Auth::user()->company_id,
            'user_id' => Auth::user()->id,
            'type' => 17,
            'content' => 0,
        ]);
        BoardItem::destroy($request->id);
    }
}
