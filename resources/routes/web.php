<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use Illuminate\Support\Facades\Mail;
Route::get('/', function () {
    return view('front.index');
})->name('front_home');

Route::get('/about', function () {
    return view('front.about');
})->name('front_about');

Route::get('/support', function () {
   return view('front.support');
})->name('front_support');


Route::get('/blog', function () {
    return view('front.blog');
})->name('front_blog');


Route::get('/account', function () {
    return view('application.account');
});


Route::post('/posts', 'HomeController@create');

Route::get('/test', function () {
    return view('application.test');
});

/////********************** ONLY ADMIN ********************** /////
Route::group(['middleware' => ['auth', 'owner']], function () {
    Route::get('/company', 'CompanyController@index')->name('front_company');
    Route::get('/company/settings', 'CompanyController@settings')->name('front_settings');
    Route::post('/company/settings', 'CompanyController@update');
    Route::post('/company/logo', 'CompanyController@deleteLogo');
    Route::get('/welcome', 'CompanyController@welcome')->name('app_welcome');
});



/////********************** AUTHORIZATION ********************** /////
Route::get('/{company}/login', 'Auth\CompanyLoginController@index')->name('front_loginCompany');

Route::post('/company/login', 'Auth\CompanyLoginController@store');
Route::get('/login', 'Auth\LoginController@index')->name('front_login');
Route::post('/login', 'Auth\LoginController@store')->name('front_login');
Route::get('/signup', 'Auth\RegisterController@index')->name('front_signup');



Route::get('auth/{provider}', 'Auth\LoginController@redirectToProvider');
Route::get('auth/{provider}/callback', 'Auth\LoginController@handleProviderCallback');

/////********************** ONLY AUTHENTICATED ********************** /////
Route::group(['middleware' => ['auth']], function () {
    Route::get('/logout', 'Auth\LogoutController@index')->name('app_logout');
    Route::get('/no-access', function () {
        return view('front.no-access');
    });
});

/////********************** RIGHT COMPANY & AUTHENTICATED ********************** /////
Route::group(['middleware' => ['auth', 'company', 'verification']], function () {
    Route::get('/{company}/dashboard', 'Application\DashboardController@index')->name('app_dashboard');
    Route::get('/{company}/company', 'Application\CompanyController@index')->name('app_company');
    Route::get('/{company}/account', 'Application\AccountController@index')->name('app_account');
    Route::get('/{company}/calendar', 'Application\CalendarController@index')->name('app_calendar');
    Route::get('/{company}/projects', 'Application\ProjectController@index')->name('app_projects');
    Route::get('/{company}/project', function () {
        return view('application.project.index');
    });
});
/////********************** RIGHT PROJECT & AUTHENTICATED ********************** /////
Route::group(['middleware' => ['auth', 'company', 'verification', 'project']], function () {
    Route::get('/{company}/{project}/project/{path?}', [
        'uses' => 'Application\ProjectController@data',
        'where' => ['path' => '.*']
    ]);
});

/////********************** OTHER PAGES ********************** /////
/// //verification
Route::get('/user/verify/{token}/{id}', 'Application\VerifyUser@index')->name('front_verify');
Route::post('/user/verify/', 'Application\VerifyUser@verify');
//password reset
Route::get('/{company}/password', 'Application\PasswordResetController@index')->name('front_reset');
Route::post('/password', 'Application\PasswordResetController@store');
Route::get('/password/{url}/{token}', 'Application\PasswordResetController@verifyPage');
Route::post('/password/change', 'Application\PasswordResetController@updatePassword');
//invite
Route::group(['middleware' => ['guest']], function () {
  Route::get('/{company}/invite/{token}', 'Application\InviteController@index');
  Route::post('/invite/verify', 'Application\InviteController@createUser');
});


//CLOSED API CALLS
Route::post('/api/user/create', 'Auth\RegisterCompanyController@create');
Route::post('/api/register/check', 'Auth\RegisterCompanyController@check');
Route::get('/api/industries', 'IndustryController@tojson');
Route::get('/api/countries', 'Application\AccountController@getCountries');

Route::group(['middleware' => ['auth']], function () {
Route::post('/api/user/activity', 'UpdateActivity@update');
Route::get('/api/menu/online', 'Application\MenuController@online');
Route::get('/api/menu/notifications', 'Application\MenuController@notifications');
Route::post('/api/menu/notifications', 'Application\MenuController@notificationsRead');
Route::get('/api/menu/test', 'Application\MenuController@newNotification');

Route::get('/api/company/users', 'Application\CompanyController@users');
Route::get('/api/company/invites', 'Application\CompanyController@invites');
Route::get('/api/company/groups', 'Application\CompanyController@groups');

Route::get('/api/notifcations/today', 'Application\DashboardController@notifcationsToday');
Route::get('/api/notifcations/yesterday', 'Application\DashboardController@notificationsYesterday');
Route::get('/api/notifcations/older', 'Application\DashboardController@noticationsOlder');

//account
Route::post('/api/account/update/profile', 'Application\AccountController@updateProfile');
Route::post('/api/account/password/change', 'Application\AccountController@updatePassword');
Route::post('/api/account/avatar/change', 'Application\AccountController@changeAvatar');
Route::post('/api/account/settings/change', 'Application\AccountController@updateSettings');
//new user
Route::post('/api/check/email', 'Application\CreateUserController@checkEmail');
Route::post('/api/user/new', 'Application\CreateUserController@createUser');
});

//new invite
Route::post('/api/invite/new', 'Application\InviteController@createInvite');
Route::post('/api/invite/email', 'Application\InviteController@checkEmail');
//group
Route::post('/api/group/new', 'Application\CreateGroupController@create');

//two step authentication
Route::post('/api/twostep/change', 'Application\TwoStepController@change');
Route::post('api/twostep/sendVerify', 'Application\TwoStepController@sendVerify');
Route::post('api/twostep/verify', 'Application\TwoStepController@verify');
Route::post('api/twostep/updatePhone', 'Application\TwoStepController@updatePhone');

//calendar
Route::post('/api/calendar/new', 'Application\CalendarController@create');
Route::get('/api/calendar/today', 'Application\CalendarController@today');
Route::post('/api/calendar/receive', 'Application\CalendarController@receive');

//Projects
Route::post('/api/project/new', 'Application\ProjectController@create');
Route::get('/api/projects/all', 'Application\ProjectController@getProjects');

/////********************** PROJECT API ********************** /////

//overview
Route::post('/api/project/overview/info', 'Application\Project\OverviewController@getInfo');

//notes
Route::post('/api/project/notes/all', 'Application\Project\NoteController@getNotes');
Route::post('/api/project/notes/create', 'Application\Project\NoteController@create');
Route::post('/api/project/notes/delete', 'Application\Project\NoteController@delete');

//forum
Route::post('/api/project/forum/replies', 'Application\Project\ForumController@getReplies');
Route::post('/api/project/forum/tags', 'Application\Project\ForumController@getTags');
Route::post('/api/project/forum/createPost', 'Application\Project\ForumController@createPost');
Route::post('/api/project/forum/post', 'Application\Project\ForumController@getPost');
Route::post('/api/project/forum/createReply', 'Application\Project\ForumController@createReply');
Route::post('/api/project/forum/editReply', 'Application\Project\ForumController@editReply');
Route::post('/api/project/forum/deleteReply', 'Application\Project\ForumController@deleteReply');










Route::post('/twostep', 'Application\TwoStepController@login');

