<?php namespace Brown\Groupslimit;

use System\Classes\PluginBase;
use App;
use Event;

/**
 * Groupslimits Plugin Information File
 */
class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'GroupsLimit',
            'description' => 'The ability to limit the number of objects from a specific group.',
            'author' => 'Stefan Brown',
            'icon' => 'icon-th-list'
        ];
    }


    public function boot()
    {

        if (!App::runningInBackend()) {
            return;
        }

        Event::listen('backend.page.beforeDisplay', function ($controller) {
            $controller->addCss('/plugins/brown/groupslimit/assets/css/groups-limit.css');
            $controller->addJs('/plugins/brown/groupslimit/assets/js/groups-limit.js');
        });
    }
}
