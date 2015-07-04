/// <reference path="typings/tsd.d.ts" />
var Tooltip;
(function (_Tooltip) {
    _Tooltip.activeTooltips = [];
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
        $.fn.tooltip = function (options, showOn, selector) {
            if (showOn === void 0) { showOn = 'hover'; }
            if (showOn == 'hover') {
                var show = function () {
                    $(this).showTooltip(options);
                };
                this.on('mouseenter', selector, show).on('mouseleave', selector, function () {
                    $(this).closeTooltip();
                }).on('click', selector, show);
            }
            else if (showOn == 'click') {
                this.on('click', selector, function () {
                    var e = $(this);
                    if (e.data('_tooltip'))
                        e.closeTooltip();
                    else
                        e.showTooltip(options);
                    return false;
                });
            }
            else {
                throw 'This value is not supported for argument showOn: ' + showOn;
            }
            return this;
        };
        //Hide tooltip on click outside target element and popup
        $('html').click(function (ev) {
            for (var i = 0; i < _Tooltip.activeTooltips.length; i++) {
                var t = _Tooltip.activeTooltips[i];
                var $active = t.tooltip.add(t.target);
                if (t && t.options.closeOnClickOuside && !$contains($active, ev.target))
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
                position: 'bottom',
                source: 'title',
                cssClass: '',
                closeSelector: '.tooltip-close',
                distance: 5,
                allowMultiple: false,
                closeOnClickOuside: true
            }, options);
            this.target = $(targetElem).addClass('has-tooltip').closeTooltip().data('_tooltip', this);
            this.show();
        }
        Tooltip.prototype.getContent = function () {
            var c = this.options.content;
            if (c) {
                c = $.isFunction(c) ? c() : c;
                return !c ? null : typeof c == 'string' ? $('<div>').html(c) : $(c);
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
        };
        Tooltip.prototype.show = function () {
            this.content = this.getContent();
            if (!this.content)
                return;
            if (!this.options.allowMultiple)
                close();
            this.content.off('click', this.closeCallback).on('click', this.options.closeSelector, this.closeCallback);
            var o = this.options;
            this.tooltip = $('<div class="tooltip-frame"/>').addClass(o.cssClass).addClass('tooltip-' + o.position).append(this.content.show()).append($('<div class="tip"/>')).appendTo('body');
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
            t.css('top', o.position == 'top' ? offset.top - h - o.distance : offset.top + e.outerHeight() + o.distance);
        };
        Tooltip.prototype.close = function () {
            if (!this.tooltip)
                return;
            if (this.options.source == 'anchor')
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lYXQtdG9vbHRpcC50cyJdLCJuYW1lcyI6WyJUb29sdGlwIiwiVG9vbHRpcC5jbG9zZSIsIlRvb2x0aXAuJGNvbnRhaW5zIiwiVG9vbHRpcC5Ub29sdGlwIiwiVG9vbHRpcC5Ub29sdGlwLmNvbnN0cnVjdG9yIiwiVG9vbHRpcC5Ub29sdGlwLmdldENvbnRlbnQiLCJUb29sdGlwLlRvb2x0aXAuc2hvdyIsIlRvb2x0aXAuVG9vbHRpcC5wb3NpdGlvbiIsIlRvb2x0aXAuVG9vbHRpcC5jbG9zZSJdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDO0FBSXpDLElBQU8sT0FBTyxDQWlNYjtBQWpNRCxXQUFPLFFBQU8sRUFBQyxDQUFDO0lBQ0RBLHVCQUFjQSxHQUFjQSxFQUFFQSxDQUFDQTtJQUUxQ0EsU0FBU0EsS0FBS0E7UUFDVkMsR0FBR0EsQ0FBQUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsdUJBQWNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO1lBQ3JDQSx1QkFBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7SUFDbENBLENBQUNBO0lBRURELEFBQ0FBLHFEQURxREE7YUFDNUNBLFNBQVNBLENBQUNBLENBQVNBLEVBQUVBLElBQWlCQSxFQUFFQSxXQUFrQkE7UUFBbEJFLDJCQUFrQkEsR0FBbEJBLGtCQUFrQkE7UUFDL0RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxD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cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcblxyXG5cclxubW9kdWxlIFRvb2x0aXAge1xyXG4gICAgZXhwb3J0IHZhciBhY3RpdmVUb29sdGlwczogVG9vbHRpcFtdID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7IGk8YWN0aXZlVG9vbHRpcHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGFjdGl2ZVRvb2x0aXBzW2ldLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9JbmRpY2F0ZXMgaWYgYSBqcXVlcnkgc2V0IGNvbnRhaW5zIGEgZ2l2ZW4gRE9NIG5vZGVcclxuICAgIGZ1bmN0aW9uICRjb250YWlucyhlOiBKUXVlcnksIGVsZW06IEhUTUxFbGVtZW50LCBpbmNsdWRlU2VsZiA9IHRydWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKChpbmNsdWRlU2VsZiAmJiBlLmdldChpKSA9PSBlbGVtKSB8fCAkLmNvbnRhaW5zKGUuZ2V0KGkpLCBlbGVtKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIChmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICAgICAvL0Rpc3BsYXkgYSB0b29sdGlwIG9uY2VcclxuICAgICAgICAkLmZuLnNob3dUb29sdGlwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vRGlzcGxheSBhIHRvb2x0aXAgb25jZVxyXG4gICAgICAgICQuZm4uY2xvc2VUb29sdGlwID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHQgPSA8VG9vbHRpcD4kKHRoaXMpLmRhdGEoJ190b29sdGlwJyk7XHJcbiAgICAgICAgICAgICAgICBpZih0KVxyXG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9CaW5kIHRvb2x0aXAgZGlzcGxheSB0byBldmVudFxyXG4gICAgICAgICQuZm4udG9vbHRpcCA9IGZ1bmN0aW9uIChvcHRpb25zLCBzaG93T24gPSAnaG92ZXInLCBzZWxlY3Rvcj86c3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChzaG93T24gPT0gJ2hvdmVyJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNob3cgPSBmdW5jdGlvbiAoKSB7ICQodGhpcykuc2hvd1Rvb2x0aXAob3B0aW9ucykgfTtcclxuICAgICAgICAgICAgICAgIHRoaXNcclxuICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXInLCBzZWxlY3Rvciwgc2hvdylcclxuICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUnLCBzZWxlY3RvciwgZnVuY3Rpb24oKXskKHRoaXMpLmNsb3NlVG9vbHRpcCgpfSlcclxuICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgc2VsZWN0b3IsIHNob3cpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaG93T24gPT0gJ2NsaWNrJyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uKCdjbGljaycsIHNlbGVjdG9yLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGUgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGUuZGF0YSgnX3Rvb2x0aXAnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5jbG9zZVRvb2x0aXAoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc2hvd1Rvb2x0aXAob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgJ1RoaXMgdmFsdWUgaXMgbm90IHN1cHBvcnRlZCBmb3IgYXJndW1lbnQgc2hvd09uOiAnICsgc2hvd09uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0hpZGUgdG9vbHRpcCBvbiBjbGljayBvdXRzaWRlIHRhcmdldCBlbGVtZW50IGFuZCBwb3B1cFxyXG4gICAgICAgICQoJ2h0bWwnKS5jbGljayhmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8YWN0aXZlVG9vbHRpcHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIHQ6VG9vbHRpcCA9IGFjdGl2ZVRvb2x0aXBzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyICRhY3RpdmUgPSB0LnRvb2x0aXAuYWRkKHQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmICh0ICYmIHQub3B0aW9ucy5jbG9zZU9uQ2xpY2tPdXNpZGUgJiYgISRjb250YWlucygkYWN0aXZlLCBldi50YXJnZXQpKVxyXG4gICAgICAgICAgICAgICAgICAgIHQuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGFjdGl2ZVRvb2x0aXBzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZVRvb2x0aXBzW2ldLnBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pKGpRdWVyeSk7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRvb2x0aXAge1xyXG4gICAgICAgIHB1YmxpYyB0b29sdGlwOiBKUXVlcnk7XHJcbiAgICAgICAgcHVibGljIHRhcmdldDogSlF1ZXJ5O1xyXG4gICAgICAgIHB1YmxpYyBjb250ZW50OiBKUXVlcnk7XHJcbiAgICAgICAgcHJpdmF0ZSBjbG9zZUNhbGxiYWNrID0gKCkgPT4geyB0aGlzLmNsb3NlKCk7IHJldHVybiBmYWxzZTsgfTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSB0YXJnZXRFbGVtOiBIVE1MRWxlbWVudCwgcHVibGljIG9wdGlvbnM6IHRvb2x0aXBfb3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbScsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6ICd0aXRsZScsXHJcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJycsXHJcbiAgICAgICAgICAgICAgICBjbG9zZVNlbGVjdG9yOiAnLnRvb2x0aXAtY2xvc2UnLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IDUsXHJcbiAgICAgICAgICAgICAgICBhbGxvd011bHRpcGxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNsb3NlT25DbGlja091c2lkZTogdHJ1ZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQodGFyZ2V0RWxlbSkuYWRkQ2xhc3MoJ2hhcy10b29sdGlwJykuY2xvc2VUb29sdGlwKCkuZGF0YSgnX3Rvb2x0aXAnLCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldENvbnRlbnQoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLm9wdGlvbnMuY29udGVudDtcclxuICAgICAgICAgICAgaWYgKGMpIHtcclxuICAgICAgICAgICAgICAgIGMgPSAkLmlzRnVuY3Rpb24oYykgPyBjKCkgOiBjO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFjID8gbnVsbCA6IHR5cGVvZiBjID09ICdzdHJpbmcnID8gICQoJzxkaXY+JykuaHRtbChjKSA6ICQoYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3VyY2UgPT0gJ3RpdGxlJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy50YXJnZXQuYXR0cigndGl0bGUnKSB8fCB0aGlzLnRhcmdldC5kYXRhKCd0aXRsZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQuYXR0cigndGl0bGUnLCAnJykuZGF0YSgndGl0bGUnLCB0aXRsZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGRpdj4nKS5odG1sKHRpdGxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNvdXJjZSA9PSAnYW5jaG9yJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAkKHRoaXMudGFyZ2V0LmF0dHIoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudC5sZW5ndGggPyBjb250ZW50IDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGVudClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLm9wdGlvbnMuYWxsb3dNdWx0aXBsZSlcclxuICAgICAgICAgICAgICAgIGNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5jbG9zZUNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMub3B0aW9ucy5jbG9zZVNlbGVjdG9yLCB0aGlzLmNsb3NlQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXAgPSAkKCc8ZGl2IGNsYXNzPVwidG9vbHRpcC1mcmFtZVwiLz4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKG8uY3NzQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3Rvb2x0aXAtJyArIG8ucG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuY29udGVudC5zaG93KCkpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxkaXYgY2xhc3M9XCJ0aXBcIi8+JykpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVRvb2x0aXBzLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwb3NpdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1hcmdpbiA9IDEwO1xyXG5cclxuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLnRvb2x0aXA7XHJcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy50YXJnZXQ7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgLy9SZXNldCBzbyBkaW1lbnRpb25zIGNhbGN1bGF0aW9ucyBhcmUgY29ycmVjdFxyXG4gICAgICAgICAgICB0LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3dyA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHQub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IG9mZnNldC5sZWZ0ICsgZS5vdXRlcldpZHRoKCkgLyAyIC0gdyAvIDI7XHJcblxyXG4gICAgICAgICAgICBpZiAobGVmdCA8IG1hcmdpbilcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBtYXJnaW47XHJcbiAgICAgICAgICAgIHZhciByaWdodE92ZXJmbG93ID0gKGxlZnQgKyB3KSAtICh3dyAtIG1hcmdpbik7XHJcbiAgICAgICAgICAgIGlmKHJpZ2h0T3ZlcmZsb3cgPiAwKVxyXG4gICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQgLSByaWdodE92ZXJmbG93LCBtYXJnaW4pO1xyXG5cclxuICAgICAgICAgICAgdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBsZWZ0ICsgJ3B4JyxcclxuICAgICAgICAgICAgICAgICdtYXgtd2lkdGgnOiAod3cgLSBsZWZ0IC0gbWFyZ2luKSArICdweCdcclxuICAgICAgICAgICAgfSkuZmluZCgnLnRpcCcpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdsZWZ0Jywgb2Zmc2V0LmxlZnQgKyBlLm91dGVyV2lkdGgoKSAvIDIgLSBsZWZ0ICsgJ3B4Jyk7XHJcblxyXG4gICAgICAgICAgICAvL1NldHRpbmcgd2lkdGggY2FuIG1ha2UgaGVpZ2h0IHZhcnkuIFNvIHdlIHNldCB2ZXJ0aWNhbCBwb3NpdGlvbiBhZnRlci5cclxuICAgICAgICAgICAgdmFyIGggPSB0Lm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHQuY3NzKCd0b3AnLCBvLnBvc2l0aW9uID09ICd0b3AnXHJcbiAgICAgICAgICAgICAgICA/IG9mZnNldC50b3AgLSBoIC0gby5kaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgOiBvZmZzZXQudG9wICsgZS5vdXRlckhlaWdodCgpICsgby5kaXN0YW5jZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudG9vbHRpcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNvdXJjZSA9PSAnYW5jaG9yJylcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5oaWRlKCkuYXBwZW5kVG8oJ2JvZHknKTtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5kYXRhKCdfdG9vbHRpcCcsIG51bGwpO1xyXG4gICAgICAgICAgICBhY3RpdmVUb29sdGlwcy5zcGxpY2UoYWN0aXZlVG9vbHRpcHMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9