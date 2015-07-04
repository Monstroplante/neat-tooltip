/// <reference path="typings/tsd.d.ts" />
var Tooltip;
(function (_Tooltip) {
    _Tooltip.activeTooltips = [];
    (function (Position) {
        Position[Position["bottom"] = 0] = "bottom";
        Position[Position["top"] = 1] = "top";
    })(_Tooltip.Position || (_Tooltip.Position = {}));
    var Position = _Tooltip.Position;
    (function (Source) {
        //Get tooltip content from title attribute
        Source[Source["title"] = 0] = "title";
        // Get tooltip content from anchor attribute. If anchor starts with #, will searh for element on the page.
        // Else (not yet supported), will load URL
        Source[Source["anchor"] = 1] = "anchor";
    })(_Tooltip.Source || (_Tooltip.Source = {}));
    var Source = _Tooltip.Source;
    (function (ShowOn) {
        ShowOn[ShowOn["hover"] = 0] = "hover";
        ShowOn[ShowOn["click"] = 1] = "click";
    })(_Tooltip.ShowOn || (_Tooltip.ShowOn = {}));
    var ShowOn = _Tooltip.ShowOn;
    function close() {
        for (var i = 0; i < _Tooltip.activeTooltips.length; i++)
            _Tooltip.activeTooltips[i].close();
    }
    //Indicates if a jquery set contains a given DOM node
    function $contains(e, elem, includeSelf) {
        if (includeSelf === void 0) { includeSelf = true; }
        for (var i = 0; i < e.length; i++) {
            if ((includeSelf && e.get(i) == elem) || $.contains(e.get(i), elem))
                return true;
        }
        return false;
    }
    ;
    (function ($) {
        //Display a tooltip once
        $.fn.showTooltip = function (options) {
            return this.each(function () {
                new Tooltip(this, options);
            });
        };
        //Display a tooltip once
        $.fn.closeTooltip = function (options) {
            return this.each(function () {
                var t = $(this).data('_tooltip');
                if (t)
                    t.close();
            });
        };
        //Bind tooltip display to event
        $.fn.tooltip = function (options, showOn) {
            if (showOn === void 0) { showOn = 0 /* hover */; }
            if (showOn == 0 /* hover */) {
                var show = function () {
                    $(this).showTooltip(options);
                };
                this.hover(show, function () {
                    $(this).closeTooltip();
                }).click(show);
            }
            else if (showOn == 1 /* click */) {
                this.click(function () {
                    var e = $(this);
                    if (e.data('_tooltip'))
                        e.closeTooltip();
                    else
                        e.showTooltip(options);
                    return false;
                });
            }
            return this;
        };
        //Hide tooltip on click outside target element and popup
        $('html').click(function (ev) {
            for (var i = 0; i < _Tooltip.activeTooltips.length; i++) {
                var t = _Tooltip.activeTooltips[i];
                var $active = t.tooltip.add(t.target);
                if (t && !$contains($active, ev.target))
                    t.close();
            }
        });
        $(window).resize(function () {
            for (var i = 0; i < _Tooltip.activeTooltips.length; i++) {
                _Tooltip.activeTooltips[i].position();
            }
        });
    })(jQuery);
    var Tooltip = (function () {
        function Tooltip(targetElem, options) {
            var _this = this;
            this.targetElem = targetElem;
            this.options = options;
            this.closeCallback = function () {
                _this.close();
                return false;
            };
            this.options = $.extend({
                position: 0 /* bottom */,
                source: 0 /* title */,
                cssClass: '',
                closeSelector: '.tooltip-close',
                distance: 5,
                allowMultiple: false
            }, options);
            this.target = $(targetElem).addClass('has-tooltip').closeTooltip().data('_tooltip', this);
            this.show();
        }
        Tooltip.prototype.getContent = function () {
            var c = this.options.content;
            if (c) {
                c = $.isFunction(c) ? c() : c;
                return typeof c == 'string' ? $('<div>').html(c) : $(c);
            }
            if (this.options.source == 0 /* title */) {
                var title = this.target.attr('title') || this.target.data('title');
                this.target.attr('title', '').data('title', title);
                return $('<div>').html(title);
            }
            if (this.options.source == 1 /* anchor */) {
                var content = $(this.target.attr('href'));
                return content.length ? content : null;
            }
        };
        Tooltip.prototype.toggle = function () {
            if (this.tooltip)
                this.close();
            else
                this.show();
        };
        Tooltip.prototype.show = function () {
            this.content = this.getContent();
            if (!this.content)
                return;
            if (!this.options.allowMultiple)
                close();
            this.content.off('click', this.closeCallback).on('click', this.options.closeSelector, this.closeCallback);
            var o = this.options;
            this.tooltip = $('<div class="tooltip-frame"/>').addClass(o.cssClass).addClass('tooltip-' + Position[o.position]).append(this.content.show()).append($('<div class="tip"/>')).appendTo('body');
            _Tooltip.activeTooltips.push(this);
            this.position();
        };
        Tooltip.prototype.position = function () {
            var margin = 10;
            var t = this.tooltip;
            var e = this.target;
            var o = this.options;
            if (!t)
                return;
            //Reset so dimentions calculations are correct
            t.removeAttr('style');
            var offset = e.offset();
            var ww = $(window).width();
            var w = t.outerWidth();
            var left = offset.left + e.outerWidth() / 2 - w / 2;
            if (left < margin)
                left = margin;
            var rightOverflow = (left + w) - (ww - margin);
            if (rightOverflow > 0)
                left = Math.max(left - rightOverflow, margin);
            t.css({
                'left': left + 'px',
                'max-width': (ww - left - margin) + 'px'
            }).find('.tip').css('left', offset.left + e.outerWidth() / 2 - left + 'px');
            //Setting width can make height vary. So we set vertical position after.
            var h = t.outerHeight();
            t.css('top', o.position == 1 /* top */ ? offset.top - h - o.distance : offset.top + e.outerHeight() + o.distance);
        };
        Tooltip.prototype.close = function () {
            if (!this.tooltip)
                return;
            if (this.options.source == 1 /* anchor */)
                this.content.hide().appendTo('body');
            this.tooltip.remove();
            this.tooltip = null;
            this.target.data('_tooltip', null);
            _Tooltip.activeTooltips.splice(_Tooltip.activeTooltips.indexOf(this), 1);
        };
        return Tooltip;
    })();
    _Tooltip.Tooltip = Tooltip;
})(Tooltip || (Tooltip = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lYXQtdG9vbHRpcC50cyJdLCJuYW1lcyI6WyJUb29sdGlwIiwiVG9vbHRpcC5Qb3NpdGlvbiIsIlRvb2x0aXAuU291cmNlIiwiVG9vbHRpcC5TaG93T24iLCJUb29sdGlwLmNsb3NlIiwiVG9vbHRpcC4kY29udGFpbnMiLCJUb29sdGlwLlRvb2x0aXAiLCJUb29sdGlwLlRvb2x0aXAuY29uc3RydWN0b3IiLCJUb29sdGlwLlRvb2x0aXAuZ2V0Q29udGVudCIsIlRvb2x0aXAuVG9vbHRpcC50b2dnbGUiLCJUb29sdGlwLlRvb2x0aXAuc2hvdyIsIlRvb2x0aXAuVG9vbHRpcC5wb3NpdGlvbiIsIlRvb2x0aXAuVG9vbHRpcC5jbG9zZSJdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDO0FBd0J6QyxJQUFPLE9BQU8sQ0E2TWI7QUE3TUQsV0FBTyxRQUFPLEVBQUMsQ0FBQztJQUNEQSx1QkFBY0EsR0FBY0EsRUFBRUEsQ0FBQ0E7SUFDMUNBLFdBQVlBLFFBQVFBO1FBQUdDLDJDQUFNQTtRQUFFQSxxQ0FBR0E7SUFBQ0EsQ0FBQ0EsRUFBeEJELGlCQUFRQSxLQUFSQSxpQkFBUUEsUUFBZ0JBO0lBQXBDQSxJQUFZQSxRQUFRQSxHQUFSQSxpQkFBd0JBLENBQUFBO0lBQ3BDQSxXQUFZQSxNQUFNQTtRQUNkRSwwQ0FBMENBO1FBQzFDQSxxQ0FBS0E7UUFDTEEsMEdBQTBHQTtRQUMxR0EsMENBQTBDQTtRQUMxQ0EsdUNBQU1BO0lBQ1ZBLENBQUNBLEVBTldGLGVBQU1BLEtBQU5BLGVBQU1BLFFBTWpCQTtJQU5EQSxJQUFZQSxNQUFNQSxHQUFOQSxlQU1YQSxDQUFBQTtJQUNEQSxXQUFZQSxNQUFNQTtRQUFHRyxxQ0FBS0E7UUFBRUEscUNBQUtBO0lBQUNBLENBQUNBLEVBQXZCSCxlQUFNQSxLQUFOQSxlQUFNQSxRQUFpQkE7SUFBbkNBLElBQVlBLE1BQU1BLEdBQU5BLGVBQXVCQSxDQUFBQTtJQUVuQ0EsU0FBU0EsS0FBS0E7UUFDVkksR0FBR0EsQ0FBQUEsQ0FBQ0Es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UUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDekNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQ3RCQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNwQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLHVCQUFjQSxDQUFDQSxNQUFNQSxDQUFDQSx1QkFBY0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0RBLENBQUNBO1FBQ0xOLGNBQUNBO0lBQURBLENBeEhBTixBQXdIQ00sSUFBQU47SUF4SFlBLGdCQUFPQSxHQUFQQSxPQXdIWkEsQ0FBQUE7QUFDTEEsQ0FBQ0EsRUE3TU0sT0FBTyxLQUFQLE9BQU8sUUE2TWIiLCJmaWxlIjoibmVhdC10b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInR5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIHRvb2x0aXBfb3B0aW9ucyB7XHJcbiAgICBwb3NpdGlvbj86IFRvb2x0aXAuUG9zaXRpb247XHJcbiAgICBzb3VyY2U/OiBUb29sdGlwLlNvdXJjZTtcclxuICAgIGNzc0NsYXNzPzogc3RyaW5nO1xyXG4gICAgY2xvc2VTZWxlY3Rvcj86IHN0cmluZztcclxuICAgIGRpc3RhbmNlPzogbnVtYmVyO1xyXG5cclxuICAgIC8vSWYgZmFsc2UgKGRlZmF1bHQpLCBjbG9zZSBhbnkgb3RoZXIgdmlzaWJsZSB0b29sdGlwIG9uIGRpc3BsYXlcclxuICAgIGFsbG93TXVsdGlwbGU/OiBib29sZWFuO1xyXG5cclxuICAgIC8vQ2FuIGJlIGFuIEhUTUwgc3RyaW5nLCBhbiBlbGVtZW50IG9yIGEgSlF1ZXJ5IG9iamVjdFxyXG4gICAgLy9DYW4gYWxzbyBiZSBhIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgc2FtZSB2YWx1ZSB0eXBlICh0aGlzIHJlZmVyIHRvIHRoZSB0YXJnZXQgZWxlbWVudCkuXHJcbiAgICAvL0lmIHNldCwgc291cmNlIGlzIGlnbm9yZWQuXHJcbiAgICBjb250ZW50PzogYW55O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHRvb2x0aXAob3B0aW9ucz86IHRvb2x0aXBfb3B0aW9ucywgc2hvd09uPzpUb29sdGlwLlNob3dPbik6IEpRdWVyeTtcclxuICAgIHNob3dUb29sdGlwKG9wdGlvbnM/OiB0b29sdGlwX29wdGlvbnMpOiBUb29sdGlwLlRvb2x0aXA7XHJcbiAgICBjbG9zZVRvb2x0aXAoKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5tb2R1bGUgVG9vbHRpcCB7XHJcbiAgICBleHBvcnQgdmFyIGFjdGl2ZVRvb2x0aXBzOiBUb29sdGlwW10gPSBbXTtcclxuICAgIGV4cG9ydCBlbnVtIFBvc2l0aW9uIHsgYm90dG9tLCB0b3AgfVxyXG4gICAgZXhwb3J0IGVudW0gU291cmNlIHtcclxuICAgICAgICAvL0dldCB0b29sdGlwIGNvbnRlbnQgZnJvbSB0aXRsZSBhdHRyaWJ1dGVcclxuICAgICAgICB0aXRsZSxcclxuICAgICAgICAvLyBHZXQgdG9vbHRpcCBjb250ZW50IGZyb20gYW5jaG9yIGF0dHJpYnV0ZS4gSWYgYW5jaG9yIHN0YXJ0cyB3aXRoICMsIHdpbGwgc2VhcmggZm9yIGVsZW1lbnQgb24gdGhlIHBhZ2UuXHJcbiAgICAgICAgLy8gRWxzZSAobm90IHlldCBzdXBwb3J0ZWQpLCB3aWxsIGxvYWQgVVJMXHJcbiAgICAgICAgYW5jaG9yXHJcbiAgICB9XHJcbiAgICBleHBvcnQgZW51bSBTaG93T24geyBob3ZlciwgY2xpY2sgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGFjdGl2ZVRvb2x0aXBzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBhY3RpdmVUb29sdGlwc1tpXS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vSW5kaWNhdGVzIGlmIGEganF1ZXJ5IHNldCBjb250YWlucyBhIGdpdmVuIERPTSBub2RlXHJcbiAgICBmdW5jdGlvbiAkY29udGFpbnMoZTogSlF1ZXJ5LCBlbGVtOiBIVE1MRWxlbWVudCwgaW5jbHVkZVNlbGYgPSB0cnVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICgoaW5jbHVkZVNlbGYgJiYgZS5nZXQoaSkgPT0gZWxlbSkgfHwgJC5jb250YWlucyhlLmdldChpKSwgZWxlbSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICAgLy9EaXNwbGF5IGEgdG9vbHRpcCBvbmNlXHJcbiAgICAgICAgJC5mbi5zaG93VG9vbHRpcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0Rpc3BsYXkgYSB0b29sdGlwIG9uY2VcclxuICAgICAgICAkLmZuLmNsb3NlVG9vbHRpcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gPFRvb2x0aXA+JCh0aGlzKS5kYXRhKCdfdG9vbHRpcCcpO1xyXG4gICAgICAgICAgICAgICAgaWYodClcclxuICAgICAgICAgICAgICAgICAgICB0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQmluZCB0b29sdGlwIGRpc3BsYXkgdG8gZXZlbnRcclxuICAgICAgICAkLmZuLnRvb2x0aXAgPSBmdW5jdGlvbiAob3B0aW9ucywgc2hvd09uID0gU2hvd09uLmhvdmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChzaG93T24gPT0gU2hvd09uLmhvdmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hvdyA9IGZ1bmN0aW9uICgpIHsgJCh0aGlzKS5zaG93VG9vbHRpcChvcHRpb25zKSB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3ZlcihcclxuICAgICAgICAgICAgICAgICAgICBzaG93LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCl7JCh0aGlzKS5jbG9zZVRvb2x0aXAoKX1cclxuICAgICAgICAgICAgICAgICkuY2xpY2soc2hvdyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvd09uID09IFNob3dPbi5jbGljayl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZSA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZS5kYXRhKCdfdG9vbHRpcCcpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLmNsb3NlVG9vbHRpcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5zaG93VG9vbHRpcChvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9IaWRlIHRvb2x0aXAgb24gY2xpY2sgb3V0c2lkZSB0YXJnZXQgZWxlbWVudCBhbmQgcG9wdXBcclxuICAgICAgICAkKCdodG1sJykuY2xpY2soZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGFjdGl2ZVRvb2x0aXBzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciB0OlRvb2x0aXAgPSBhY3RpdmVUb29sdGlwc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciAkYWN0aXZlID0gdC50b29sdGlwLmFkZCh0LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodCAmJiAhJGNvbnRhaW5zKCRhY3RpdmUsIGV2LnRhcmdldCkpXHJcbiAgICAgICAgICAgICAgICAgICAgdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKCgpID0+IHtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8YWN0aXZlVG9vbHRpcHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgYWN0aXZlVG9vbHRpcHNbaV0ucG9zaXRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVG9vbHRpcCB7XHJcbiAgICAgICAgcHVibGljIHRvb2x0aXA6IEpRdWVyeTtcclxuICAgICAgICBwdWJsaWMgdGFyZ2V0OiBKUXVlcnk7XHJcbiAgICAgICAgcHVibGljIGNvbnRlbnQ6IEpRdWVyeTtcclxuICAgICAgICBwcml2YXRlIGNsb3NlQ2FsbGJhY2sgPSAoKSA9PiB7IHRoaXMuY2xvc2UoKTsgcmV0dXJuIGZhbHNlOyB9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRhcmdldEVsZW06IEhUTUxFbGVtZW50LCBwcml2YXRlIG9wdGlvbnM6IHRvb2x0aXBfb3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uYm90dG9tLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBTb3VyY2UudGl0bGUsXHJcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJycsXHJcbiAgICAgICAgICAgICAgICBjbG9zZVNlbGVjdG9yOiAnLnRvb2x0aXAtY2xvc2UnLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IDUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd011bHRpcGxlOiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQodGFyZ2V0RWxlbSkuYWRkQ2xhc3MoJ2hhcy10b29sdGlwJykuY2xvc2VUb29sdGlwKCkuZGF0YSgnX3Rvb2x0aXAnLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldENvbnRlbnQoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLm9wdGlvbnMuY29udGVudDtcclxuICAgICAgICAgICAgaWYgKGMpIHtcclxuICAgICAgICAgICAgICAgIGMgPSAkLmlzRnVuY3Rpb24oYykgPyBjKCkgOiBjO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBjID09ICdzdHJpbmcnID8gICQoJzxkaXY+JykuaHRtbChjKSA6ICQoYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3VyY2UgPT0gU291cmNlLnRpdGxlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnRhcmdldC5hdHRyKCd0aXRsZScpIHx8IHRoaXMudGFyZ2V0LmRhdGEoJ3RpdGxlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5hdHRyKCd0aXRsZScsICcnKS5kYXRhKCd0aXRsZScsIHRpdGxlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkKCc8ZGl2PicpLmh0bWwodGl0bGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc291cmNlID09IFNvdXJjZS5hbmNob3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJCh0aGlzLnRhcmdldC5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQubGVuZ3RoID8gY29udGVudCA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0b2dnbGUoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvb2x0aXApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGVudClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLm9wdGlvbnMuYWxsb3dNdWx0aXBsZSlcclxuICAgICAgICAgICAgICAgIGNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5jbG9zZUNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMub3B0aW9ucy5jbG9zZVNlbGVjdG9yLCB0aGlzLmNsb3NlQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXAgPSAkKCc8ZGl2IGNsYXNzPVwidG9vbHRpcC1mcmFtZVwiLz4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKG8uY3NzQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3Rvb2x0aXAtJyArIFBvc2l0aW9uW28ucG9zaXRpb25dKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZCh0aGlzLmNvbnRlbnQuc2hvdygpKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkKCc8ZGl2IGNsYXNzPVwidGlwXCIvPicpKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5Jyk7XHJcblxyXG4gICAgICAgICAgICBhY3RpdmVUb29sdGlwcy5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBtYXJnaW4gPSAxMDtcclxuXHJcbiAgICAgICAgICAgIHZhciB0ID0gdGhpcy50b29sdGlwO1xyXG4gICAgICAgICAgICB2YXIgZSA9IHRoaXMudGFyZ2V0O1xyXG4gICAgICAgICAgICB2YXIgbyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICAgICAgICAgIGlmICghdClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIC8vUmVzZXQgc28gZGltZW50aW9ucyBjYWxjdWxhdGlvbnMgYXJlIGNvcnJlY3RcclxuICAgICAgICAgICAgdC5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IGUub2Zmc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd3cgPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgdmFyIHcgPSB0Lm91dGVyV2lkdGgoKTtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBvZmZzZXQubGVmdCArIGUub3V0ZXJXaWR0aCgpIC8gMiAtIHcgLyAyO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxlZnQgPCBtYXJnaW4pXHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbWFyZ2luO1xyXG4gICAgICAgICAgICB2YXIgcmlnaHRPdmVyZmxvdyA9IChsZWZ0ICsgdykgLSAod3cgLSBtYXJnaW4pO1xyXG4gICAgICAgICAgICBpZihyaWdodE92ZXJmbG93ID4gMClcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBNYXRoLm1heChsZWZ0IC0gcmlnaHRPdmVyZmxvdywgbWFyZ2luKTtcclxuXHJcbiAgICAgICAgICAgIHQuY3NzKHtcclxuICAgICAgICAgICAgICAgICdsZWZ0JzogbGVmdCArICdweCcsXHJcbiAgICAgICAgICAgICAgICAnbWF4LXdpZHRoJzogKHd3IC0gbGVmdCAtIG1hcmdpbikgKyAncHgnXHJcbiAgICAgICAgICAgIH0pLmZpbmQoJy50aXAnKVxyXG4gICAgICAgICAgICAgICAgLmNzcygnbGVmdCcsIG9mZnNldC5sZWZ0ICsgZS5vdXRlcldpZHRoKCkgLyAyIC0gbGVmdCArICdweCcpO1xyXG5cclxuICAgICAgICAgICAgLy9TZXR0aW5nIHdpZHRoIGNhbiBtYWtlIGhlaWdodCB2YXJ5LiBTbyB3ZSBzZXQgdmVydGljYWwgcG9zaXRpb24gYWZ0ZXIuXHJcbiAgICAgICAgICAgIHZhciBoID0gdC5vdXRlckhlaWdodCgpO1xyXG4gICAgICAgICAgICB0LmNzcygndG9wJywgby5wb3NpdGlvbiA9PSBQb3NpdGlvbi50b3BcclxuICAgICAgICAgICAgICAgID8gb2Zmc2V0LnRvcCAtIGggLSBvLmRpc3RhbmNlXHJcbiAgICAgICAgICAgICAgICA6IG9mZnNldC50b3AgKyBlLm91dGVySGVpZ2h0KCkgKyBvLmRpc3RhbmNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgY2xvc2UoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50b29sdGlwKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZih0aGlzLm9wdGlvbnMuc291cmNlID09IFNvdXJjZS5hbmNob3IpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQuaGlkZSgpLmFwcGVuZFRvKCdib2R5Jyk7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXQuZGF0YSgnX3Rvb2x0aXAnLCBudWxsKTtcclxuICAgICAgICAgICAgYWN0aXZlVG9vbHRpcHMuc3BsaWNlKGFjdGl2ZVRvb2x0aXBzLmluZGV4T2YodGhpcyksIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==