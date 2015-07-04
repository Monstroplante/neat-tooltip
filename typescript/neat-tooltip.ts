/// <reference path="typings/tsd.d.ts" />



module Tooltip {
    export var activeTooltips: Tooltip[] = [];

    function close() {
        for(var i=0; i<activeTooltips.length; i++)
            activeTooltips[i].close();
    }

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
            return this.each(function(){
                new Tooltip(this, options);
            });
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
                    .on('mouseleave', selector, function(){$(this).closeTooltip()})
                    .on('click', selector, show);

            } else if (showOn == 'click'){
                this.on('click', selector, function () {
                    var e = $(this);
                    if(e.data('_tooltip'))
                        e.closeTooltip();
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
            for(var i=0; i<activeTooltips.length; i++){
                var t:Tooltip = activeTooltips[i];
                var $active = t.tooltip.add(t.target);
                if (t && t.options.closeOnClickOuside && !$contains($active, ev.target))
                    t.close();
            }

        });

        $(window).resize(() => {
            for(var i=0; i<activeTooltips.length; i++){
                activeTooltips[i].position();
            }
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
                allowMultiple: false,
                closeOnClickOuside: true,
                delay: 200,
                container: window,
            }, options);

            this.target = $(targetElem).addClass('has-tooltip').closeTooltip().data('_tooltip', this);
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

            if(!this.options.allowMultiple)
                close();

            this.content
                .off('click', this.closeCallback)
                .on('click', this.options.closeSelector, this.closeCallback);

            var o = this.options;

            this.tooltip = $('<div class="tooltip-frame"/>')
                .addClass(o.cssClass)
                .addClass('tooltip-' + o.position)
                .append(this.content.show())
                .append($('<div class="tip"/>'))
                .appendTo('body');

            activeTooltips.push(this);
            this.position();
        }

        public position() {
            var margin = 10;

            var t = this.tooltip;
            var e = this.target;
            var o = this.options;

            if (!t)
                return;

            //Reset so dimentions calculations are correct
            t.removeAttr('style');

            var offset = e.offset();

            var container = this.options.container;

            var cw = $(container).width();
            var cl = container ===  window ? 0 : $(container).offset().left;
            var cr = cl + cw;
            var w = t.outerWidth();
            var left = offset.left + e.outerWidth() / 2 - w / 2;

            if (left - margin < cl)
                left = cl + margin;
            var rightOverflow = (left + w) - (cr - margin);
            if(rightOverflow > 0)
                left = Math.max(left - rightOverflow, cl + margin);

            t.css({
                'left': left + 'px',
                'max-width': (cr - left - margin) + 'px'
            }).find('.tip')
                .css('left', offset.left + e.outerWidth() / 2 - left + 'px');

            //Setting width can make height vary. So we set vertical position after.
            var h = t.outerHeight();
            t.css('top', o.position == 'top'
                ? offset.top - h - o.distance
                : offset.top + e.outerHeight() + o.distance
            );
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
            activeTooltips.splice(activeTooltips.indexOf(this), 1);
        }
    }
}