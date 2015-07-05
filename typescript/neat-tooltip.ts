/// <reference path="typings/tsd.d.ts" />



module Tooltip {
    var active: Tooltip;

    var close = function(){
        if(active)
            active.close();
    };

    $.tooltip = function(action: string){
        switch(action){
            case 'close' : close(); break;
            case 'get': return active;
            case 'position': if(active) active.position(); break;
            default: throw 'Not supported action ' + action;
        }
    };

    //Indicates if a jquery set contains a given DOM node
    function $contains(e: JQuery, elem: HTMLElement, includeSelf = true) {
        for (var i = 0; i < e.length; i++) {
            if ((includeSelf && e.get(i) == elem) || $.contains(e.get(i), elem))
                return true;
        }
        return false;
    };

    (function ($) {

        //Display a tooltip once
        $.fn.showTooltip = function (options) {
            if(this.length)
                new Tooltip(this.eq(0), options);
        };

        //Display a tooltip once
        $.fn.closeTooltip = function (options) {
            return this.each(function(){
                var t = <Tooltip>$(this).data('_tooltip');
                if(t)
                    t.close();
            });
        };

        //Bind tooltip display to event
        $.fn.tooltip = function (options, showOn = 'hover', selector?:string) {
            if (showOn == 'hover') {
                var show = function () { $(this).showTooltip(options) };
                this
                    .on('mouseenter', selector, show)
                    .on('mouseleave', selector, function(){$(this).closeTooltip();})
                    .on('click', selector, show);

            } else if (showOn == 'click'){
                this.on('click', selector, function () {
                    var e = $(this);
                    if(e.data('_tooltip'))
                        close();
                    else
                        e.showTooltip(options);
                    return false;
                });
            }else{
                throw 'This value is not supported for argument showOn: ' + showOn;
            }

            return this;
        };

        //Hide tooltip on click outside target element and popup
        $('html').click(function (ev) {
            var t = active;
            if (t && t.options.closeOnClickOuside && !$contains(t.tooltip.add(t.target), ev.target))
                t.close();
        });

        $(window).resize(() => {
            $.tooltip('position');
        });
    })(jQuery);

    export class Tooltip {
        public tooltip: JQuery;
        public target: JQuery;
        public content: JQuery;
        private closeCallback = () => { this.close(); return false; };
        private showTimeout;

        constructor(private targetElem: HTMLElement, public options: tooltip_options) {
            this.options = $.extend({
                position: 'bottom',
                source: 'title',
                cssClass: '',
                closeSelector: '.tooltip-close',
                distance: 5,
                closeOnClickOuside: true,
                delay: 200,
                container: window,
                margin: 10,
                appendTo: 'body',
            }, options);

            this.target = $(targetElem).addClass('has-tooltip').data('_tooltip', this);
            this.showTimeout = setTimeout(() => this.show(), this.options.delay);
        }

        private getContent(): JQuery {
            var c = this.options.content;
            if (c) {
                c = $.isFunction(c) ? c.call(this.target) : c;
                return !c ? null : typeof c == 'string' ?  $('<div>').html(c) : $(c);
            }
                
            
            if (this.options.source == 'title') {
                var title = this.target.attr('title') || this.target.data('title');
                this.target.attr('title', '').data('title', title);
                return $('<div>').html(title);
            }
            if (this.options.source == 'anchor') {
                var content = $(this.target.attr('href'));
                return content.length ? content : null;
            }
        }

        private show() {
            this.content = this.getContent();
            if (!this.content)
                return;

            close();

            this.content
                .off('click', this.closeCallback)
                .on('click', this.options.closeSelector, this.closeCallback);

            var o = this.options;

            var appendTo = $(this.options.appendTo).first();

            this.tooltip = $('<div class="tooltip-frame"/>')
                .addClass(o.cssClass)
                .addClass('tooltip-' + o.position)
                .append(this.content.show())
                .append($('<div class="tip"/>'))
                .appendTo(appendTo);

            if(appendTo.css('position') == 'static')
                appendTo.css('position', 'relative');

            this.position();
            active = this;
        }

        public position() {
            var margin = this.options.margin;

            var t = this.tooltip;
            var e = this.target;
            var o = this.options;

            if (!t)
                return;

            //Reset so dimentions calculations are correct
            t.removeAttr('style');
            var offset = e.offset();
            var container = this.options.container;
            var containerLeft = container === window ? 0 : $(container).offset().left
            var minLeft = containerLeft + margin;
            var maxRight = (containerLeft + $(container).outerWidth()) - margin;

            var w = t.outerWidth();

            var left = Math.max(minLeft, offset.left + e.outerWidth() / 2 - w / 2);

            var rightOverflow = (left + w) - maxRight;
            if(rightOverflow > 0)
                left = Math.max(minLeft, left - rightOverflow)

            var parentOffset = t.parent().offset();
            t.css({
                'left': (left - parentOffset.left) + 'px',
                'max-width': (maxRight - left) + 'px'
            }).find('.tip').css('left', offset.left + e.outerWidth() / 2 - left + 'px');
            //Setting width can make height vary. So we set vertical position after.
            var h = t.outerHeight();
            t.css('top', (o.position == 'top' ? offset.top - h - o.distance : offset.top + e.outerHeight() + o.distance) - parentOffset.top);
        }

        public close() {
            clearTimeout(this.showTimeout);
            if (!this.tooltip)
                return;
            if(this.options.source == 'anchor')
                this.content.hide().appendTo('body');
            this.tooltip.remove();
            this.tooltip = null;
            this.target.data('_tooltip', null);
            active = null;
        }
    }
}