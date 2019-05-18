@extends('front.layouts.app')
@section('title', '- about')
@section('content')
    <section class="header header-small">
        <div class="header-menu">
            <ul class="header-menu-left">
                <li><a class="header-name" href="{{route('front_home')}}">{{ config('app.name') }}</a></li>
                <li><a href="{{route('front_about')}}">@lang('About us')</a></li>
                {{--<li><a href="">@lang('Products')</a></li>--}}
                <li><a href="{{route('front_options')}}">@lang('Our options')</a></li>
                <li><a href="{{route('front_blog')}}">Blog</a></li>
                <li><a href="{{route('front_support')}}">Support</a></li>

            @if( App::getLocale() == "nl")
                    <a  href="{{route('lang_set', "en")}}">
                        <img src="https://cdn.countryflags.com/thumbs/united-kingdom/flag-waving-250.png" width="35px" class="float-right" style="margin-top: 5px; margin-right: 8px"/>
                    </a>
                @else
                    <a  href="{{route('lang_set', "nl")}}">
                        <img src="https://cdn.countryflags.com/thumbs/netherlands/flag-waving-250.png" width="35px" class="float-right" style="margin-top: 5px; margin-right: 8px"/>
                    </a>
                @endif
            </ul>
            <ul class="header-menu-right hidden-mobile">
                @if(Auth::check() && Auth::user()->owner)
                    <li class="button button-small button-second uppercase"><a href="{{route('front_company')}}">@lang('Manage', ["company" => Auth::user()->company->name]) </a></li>
                    <li class="button button-small button-primary"><a href="{{route('app_logout')}}">@lang('Logout')</a></li>
                @elseif(Auth::check())
                    <li class="button button-small button-second uppercase"><a href="{{route('app_dashboard', Auth::user()->company->url)}}">GO TO {{{Auth::user()->company->name}}}</a></li>
                    <li class="button button-small button-primary"><a href="{{route('app_logout')}}">Logout</a></li>
                @else
                    <li class="button button-small button-second"><a href="{{route('front_login')}}">Log in</a></li>
                    <li class="button button-small button-primary"><a href="{{route('front_signup')}}">Sign Up</a></li>
                @endif
            </ul>
        </div>
    </section>
    <div class="header-basic">
        <h1 class="header-basic--title">About {{config('app.name')}}</h1>
    </div>

    <section class="dark about">
        <h3>About us</h3>
        <div class="about-text">
            <p>
                Project-Together started development in 2018. The first version was published in the summer of 2019. Originally, Project-Together was an end work for an IT  direction in the secondary school called <a href="http://busleydenatheneum.be/campussen/%E2%8C%82-campus-zandpoort">Busleyden Atheneum Campus Zandpoort</a> that's located in Malines, Belgium.
            </p>
            <p>
                Project-Together is designed to help companies and groups organize their projects. We offer them various options to easily collaborate in a well-organized manner.
                Our most important asset is to give the little man a chance by offering a free version that has the same functionality as the pro version. Project-Together is the first project management tool that can be used for free.
            </p>
        </div>
    </section>
    <section class="values">
        <h3>Our values</h3>
        <div class="row">
            <div class="three columns">
                <div class="value">
                    <i class="far fa-smile-beam"></i>
                    <p>We want to make you happy with our products</p>
                </div>
            </div>
            <div class="three columns">
                <div class="value">
                    <i class="fas fa-hands-helping"></i>
                    <p>We want our products easy to use so that we can be friends</p>
                </div>
            </div>
            <div class="three columns">
                <div class="value">
                    <i class="fas fa-clock"></i>
                    <p>We want to be buzzy and bring new features to our costumers</p>
                </div>
            </div>
            <div class="three columns">
                <div class="value">
                    <i class="fas fa-lock"></i>
                    <p>We want our products so safe as possible so that you don't have to worry</p>
                </div>
            </div>
        </div>
    </section>
    <section class="founder dark">
        <h3>Meet our team</h3>
        <div class="row">
            <div class="four columns">
                <img src="images/DSCN3583.JPG" class="founder-image" />
            </div>
            <div class="eight columns">
                <div class="founder-body">
                    <h5>Willem Vansteyvoort</h5>
                    <p>Hello, my name is Willem Vansteyvoort.</p>
                    <p>
                        I was born on January 1 in 2001. That means that I am 18 years old.  I live in the province of Antwerp in Belgium. In September I will study Applied Informatics at Howest in Bruges. I'm the Project-Together developer, which was my end work in secondary school. If you want to contact me, you can do that via email.
                    </p>
                    <i class="fas fa-envelope"></i> <a href="mailto:willem@project-together.com">willem@project-together.com</a>
                </div>
            </div>
        </div>
    </section>
@endsection