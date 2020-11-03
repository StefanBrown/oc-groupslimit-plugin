/*
* Plugin: GroupsLimit
* Author: Stefan Brown
* Repo: https://github.com/StefanBrown/oc-groupslimit-plugin
* */

(function ($) {

    const GroupsLimit = function (element) {
        this.groups = this.init(element);
        element.data('groupsLimit', this);
        this.update(element);
    }


    GroupsLimit.prototype.init = function (element) {
        element.on('click', '> .field-repeater > .field-repeater-add-item', this.showPopover);
        return this.getGroups(element);
    }


    GroupsLimit.prototype.getGroups = function (element) {
        const regExFindGroups = /limit-(\S+)-(\d+)(\S+)?/g;
        return [...element.attr("class").matchAll(regExFindGroups)]
            .map((group) => ({
                    selector: group[0],
                    name: group[1],
                    maxItems: group[2],
                    isBadge: (group[3] === '-badge')
                })
            );
    }


    GroupsLimit.prototype.addEventsRemoveItem = function (buttons) {
        buttons.not('[data-request-success]').each(function () {
            $(this).data("request-success", "setTimeout(function(){$(\".data-groups-limit\").groupsLimit('update')},1)");
        })
    }


    GroupsLimit.prototype.update = function (element) {
        const buttons = element.find('> .field-repeater > .field-repeater-items > li > .repeater-item-remove button');
        this.addEventsRemoveItem(buttons);

        const items = buttons.map(function () {
            return $(this).data('request-data').match(/'_repeater_group': '(\S+)'/)[1];
        }).get();

        element.data('groupsLimit').groups.map(function (group, i) {
            group.items = items.filter((item) => item === group.name).length;
            return group;
        });

        if ($('.control-popover').length) this.showPopover(null, element);
    }


    GroupsLimit.prototype.showPopover = function (target, fixFreeze) {

        const groups = (fixFreeze || $(this).parent('.field-repeater').parent('.data-groups-limit')).data('groupsLimit').groups;

        const popoverList = $('.control-popover .control-filelist ul > li');

        popoverList.each(function () {
            const li = $(this);
            const a = li.find('a');
            const group = a.data('request-data').match(/_repeater_group: '(\S+)'/)[1];
            const dataGroup = groups.filter((g) => g.name === group)[0];

            if (!dataGroup) return;

            a.data('request-success', '$(".data-groups-limit").groupsLimit("update");');

            const count = (dataGroup.maxItems - dataGroup.items);
            const isDisable = (count <= 0);

            if (isDisable) li.append("<div class='groups-limit__overlay-link'></div>");

            if (dataGroup.isBadge) {
                a.append("<span class='groups-limit__badge " + (isDisable
                    ? 'groups-limit__badge_disable'
                    : 'groups-limit__badge_enable') + "'>" + count + "</span>");
            }

            a.addClass('groups-limit__link ' + (isDisable
                ? 'groups-limit__link_disable'
                : 'groups-limit__link_enable'));

        });
    }


    $.fn.groupsLimit = function (method) {
        return this.each(function () {
            const repeater = $(this);
            let groupsLimit = repeater.data('groupsLimit');
            if (!groupsLimit) groupsLimit = new GroupsLimit(repeater);
            if (method === "update") groupsLimit.update(repeater);
        });
    };


})(jQuery);

$(document).ready(function () {
    $(".data-groups-limit").groupsLimit();
});