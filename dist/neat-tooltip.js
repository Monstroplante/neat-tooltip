/// <reference path="typings/tsd.d.ts" />
var Tooltip;
(function (_Tooltip) {
    _Tooltip.activeTooltips = [];
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
                return typeof c == 'string' ? $('<div>').html(c) : $(c);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lYXQtdG9vbHRpcC50cyJdLCJuYW1lcyI6WyJUb29sdGlwIiwiVG9vbHRpcC5TaG93T24iLCJUb29sdGlwLmNsb3NlIiwiVG9vbHRpcC4kY29udGFpbnMiLCJUb29sdGlwLlRvb2x0aXAiLCJUb29sdGlwLlRvb2x0aXAuY29uc3RydWN0b3IiLCJUb29sdGlwLlRvb2x0aXAuZ2V0Q29udGVudCIsIlRvb2x0aXAuVG9vbHRpcC50b2dnbGUiLCJUb29sdGlwLlRvb2x0aXAuc2hvdyIsIlRvb2x0aXAuVG9vbHRpcC5wb3NpdGlvbiIsIlRvb2x0aXAuVG9vbHRpcC5jbG9zZSJdLCJtYXBwaW5ncyI6IkFBQUEseUNBQXlDO0FBK0J6QyxJQUFPLE9BQU8sQ0F5TWI7QUF6TUQsV0FBTyxRQUFPLEVBQUMsQ0FBQztJQUNEQSx1QkFBY0EsR0FBY0EsRUFBRUEsQ0FBQ0E7SUFDMUNBLFdBQVlBLE1BQU1BO1FBQUdDLHFDQUFLQTtRQUFFQSxxQ0FBS0E7SUFBQ0EsQ0FBQ0EsRUFBdkJELGVBQU1BLEtBQU5BLGVBQU1BLFFBQWlCQTtJQUFuQ0EsSUFBWUEsTUFBTUEsR0FBTkEsZUFBdUJBLENBQUFBO0lBRW5DQSxTQUFTQSxLQUFLQTtRQUNWRSxHQUFHQSxDQUFBQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFDQSx1QkFBY0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7WUFDckNBLHVCQUFjQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFFREYsQUFDQUEscURBRHFEQTthQUM1Q0EsU0FBU0EsQ0FBQ0EsQ0FBU0EsRUFBRUEsSUFBaUJBLEVBQUVBLFdBQWtCQTtRQUFsQkcsMkJBQWtCQSxHQUFsQkEsa0JBQWtCQTtRQUMvREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0Es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Q3BCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNuQ0EsdUJBQWNBLENBQUNBLE1BQU1BLENBQUNBLHVCQUFjQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzREEsQ0FBQ0E7UUFDTE4sY0FBQ0E7SUFBREEsQ0F6SEFKLEFBeUhDSSxJQUFBSjtJQXpIWUEsZ0JBQU9BLEdBQVBBLE9BeUhaQSxDQUFBQTtBQUNMQSxDQUFDQSxFQXpNTSxPQUFPLEtBQVAsT0FBTyxRQXlNYiIsImZpbGUiOiJuZWF0LXRvb2x0aXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgdG9vbHRpcF9vcHRpb25zIHtcclxuXHJcbiAgICAvLyAndG9wJyBvciAnYm90dG9tJyAoZGVmYXVsdClcclxuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xyXG4gICAgLy8gJ3RpdGxlJzogR2V0IHRvb2x0aXAgY29udGVudCBmcm9tIHRpdGxlIGF0dHJpYnV0ZVxyXG4gICAgLy8gJ2FuY2hvcic6IFVzZSBpdCBvbiA8YSBocmVmPVwiI2lkXCI+PC9hPi4gVGhlIGhyZWYgYXR0cmlidXRlIHdpbGwgYmUgdXNlZCBhcyBhIHNlbGVjdG9yLiBUaGUgbWF0Y2hlZCBlbGVtZW50cyB3aWxsIGJlIGFwcGVuZGVkIHRvIHRoZSB0b29sdGlwIGFuZCBtYWRlIHZpc2libGUuXHJcbiAgICBhbmNob3I/OiBzdHJpbmc7XHJcbiAgICBzb3VyY2U/OiBzdHJpbmc7XHJcbiAgICBjc3NDbGFzcz86IHN0cmluZztcclxuICAgIGNsb3NlU2VsZWN0b3I/OiBzdHJpbmc7XHJcbiAgICBkaXN0YW5jZT86IG51bWJlcjtcclxuXHJcbiAgICAvL0lmIGZhbHNlIChkZWZhdWx0KSwgY2xvc2UgYW55IG90aGVyIHZpc2libGUgdG9vbHRpcCBvbiBkaXNwbGF5XHJcbiAgICBhbGxvd011bHRpcGxlPzogYm9vbGVhbjtcclxuXHJcbiAgICAvL0NhbiBiZSBhbiBIVE1MIHN0cmluZywgYW4gZWxlbWVudCBvciBhIEpRdWVyeSBvYmplY3RcclxuICAgIC8vQ2FuIGFsc28gYmUgYSBmdW5jdGlvbiByZXR1cm5pbmcgdGhlIHNhbWUgdmFsdWUgdHlwZSAodGhpcyByZWZlciB0byB0aGUgdGFyZ2V0IGVsZW1lbnQpLlxyXG4gICAgLy9JZiBzZXQsIHNvdXJjZSBpcyBpZ25vcmVkLlxyXG4gICAgY29udGVudD86IGFueTtcclxuXHJcbiAgICBjbG9zZU9uQ2xpY2tPdXNpZGU/OiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHRvb2x0aXAob3B0aW9ucz86IHRvb2x0aXBfb3B0aW9ucywgc2hvd09uPzpzdHJpbmcpOiBKUXVlcnk7XHJcbiAgICBzaG93VG9vbHRpcChvcHRpb25zPzogdG9vbHRpcF9vcHRpb25zKTogVG9vbHRpcC5Ub29sdGlwO1xyXG4gICAgY2xvc2VUb29sdGlwKCk6IEpRdWVyeTtcclxufVxyXG5cclxubW9kdWxlIFRvb2x0aXAge1xyXG4gICAgZXhwb3J0IHZhciBhY3RpdmVUb29sdGlwczogVG9vbHRpcFtdID0gW107XHJcbiAgICBleHBvcnQgZW51bSBTaG93T24geyBob3ZlciwgY2xpY2sgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgIGZvcih2YXIgaT0wOyBpPGFjdGl2ZVRvb2x0aXBzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBhY3RpdmVUb29sdGlwc1tpXS5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vSW5kaWNhdGVzIGlmIGEganF1ZXJ5IHNldCBjb250YWlucyBhIGdpdmVuIERPTSBub2RlXHJcbiAgICBmdW5jdGlvbiAkY29udGFpbnMoZTogSlF1ZXJ5LCBlbGVtOiBIVE1MRWxlbWVudCwgaW5jbHVkZVNlbGYgPSB0cnVlKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICgoaW5jbHVkZVNlbGYgJiYgZS5nZXQoaSkgPT0gZWxlbSkgfHwgJC5jb250YWlucyhlLmdldChpKSwgZWxlbSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICAgICAgLy9EaXNwbGF5IGEgdG9vbHRpcCBvbmNlXHJcbiAgICAgICAgJC5mbi5zaG93VG9vbHRpcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvL0Rpc3BsYXkgYSB0b29sdGlwIG9uY2VcclxuICAgICAgICAkLmZuLmNsb3NlVG9vbHRpcCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZhciB0ID0gPFRvb2x0aXA+JCh0aGlzKS5kYXRhKCdfdG9vbHRpcCcpO1xyXG4gICAgICAgICAgICAgICAgaWYodClcclxuICAgICAgICAgICAgICAgICAgICB0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vQmluZCB0b29sdGlwIGRpc3BsYXkgdG8gZXZlbnRcclxuICAgICAgICAkLmZuLnRvb2x0aXAgPSBmdW5jdGlvbiAob3B0aW9ucywgc2hvd09uID0gJ2hvdmVyJywgc2VsZWN0b3I/OnN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoc2hvd09uID09ICdob3ZlcicpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzaG93ID0gZnVuY3Rpb24gKCkgeyAkKHRoaXMpLnNob3dUb29sdGlwKG9wdGlvbnMpIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgc2VsZWN0b3IsIHNob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgc2VsZWN0b3IsIGZ1bmN0aW9uKCl7JCh0aGlzKS5jbG9zZVRvb2x0aXAoKX0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHNlbGVjdG9yLCBzaG93KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvd09uID09ICdjbGljaycpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbignY2xpY2snLCBzZWxlY3RvciwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihlLmRhdGEoJ190b29sdGlwJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY2xvc2VUb29sdGlwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnNob3dUb29sdGlwKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRocm93ICdUaGlzIHZhbHVlIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIGFyZ3VtZW50IHNob3dPbjogJyArIHNob3dPbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9IaWRlIHRvb2x0aXAgb24gY2xpY2sgb3V0c2lkZSB0YXJnZXQgZWxlbWVudCBhbmQgcG9wdXBcclxuICAgICAgICAkKCdodG1sJykuY2xpY2soZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGFjdGl2ZVRvb2x0aXBzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciB0OlRvb2x0aXAgPSBhY3RpdmVUb29sdGlwc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciAkYWN0aXZlID0gdC50b29sdGlwLmFkZCh0LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodCAmJiB0Lm9wdGlvbnMuY2xvc2VPbkNsaWNrT3VzaWRlICYmICEkY29udGFpbnMoJGFjdGl2ZSwgZXYudGFyZ2V0KSlcclxuICAgICAgICAgICAgICAgICAgICB0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoKCkgPT4ge1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDsgaTxhY3RpdmVUb29sdGlwcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBhY3RpdmVUb29sdGlwc1tpXS5wb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KShqUXVlcnkpO1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUb29sdGlwIHtcclxuICAgICAgICBwdWJsaWMgdG9vbHRpcDogSlF1ZXJ5O1xyXG4gICAgICAgIHB1YmxpYyB0YXJnZXQ6IEpRdWVyeTtcclxuICAgICAgICBwdWJsaWMgY29udGVudDogSlF1ZXJ5O1xyXG4gICAgICAgIHByaXZhdGUgY2xvc2VDYWxsYmFjayA9ICgpID0+IHsgdGhpcy5jbG9zZSgpOyByZXR1cm4gZmFsc2U7IH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdGFyZ2V0RWxlbTogSFRNTEVsZW1lbnQsIHB1YmxpYyBvcHRpb25zOiB0b29sdGlwX29wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20nLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiAndGl0bGUnLFxyXG4gICAgICAgICAgICAgICAgY3NzQ2xhc3M6ICcnLFxyXG4gICAgICAgICAgICAgICAgY2xvc2VTZWxlY3RvcjogJy50b29sdGlwLWNsb3NlJyxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA1LFxyXG4gICAgICAgICAgICAgICAgYWxsb3dNdWx0aXBsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjbG9zZU9uQ2xpY2tPdXNpZGU6IHRydWUsXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSAkKHRhcmdldEVsZW0pLmFkZENsYXNzKCdoYXMtdG9vbHRpcCcpLmNsb3NlVG9vbHRpcCgpLmRhdGEoJ190b29sdGlwJywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRDb250ZW50KCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5vcHRpb25zLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgIGlmIChjKSB7XHJcbiAgICAgICAgICAgICAgICBjID0gJC5pc0Z1bmN0aW9uKGMpID8gYygpIDogYztcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PSAnc3RyaW5nJyA/ICAkKCc8ZGl2PicpLmh0bWwoYykgOiAkKGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc291cmNlID09ICd0aXRsZScpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMudGFyZ2V0LmF0dHIoJ3RpdGxlJykgfHwgdGhpcy50YXJnZXQuZGF0YSgndGl0bGUnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LmF0dHIoJ3RpdGxlJywgJycpLmRhdGEoJ3RpdGxlJywgdGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJzxkaXY+JykuaHRtbCh0aXRsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zb3VyY2UgPT0gJ2FuY2hvcicpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJCh0aGlzLnRhcmdldC5hdHRyKCdocmVmJykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnQubGVuZ3RoID8gY29udGVudCA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB0b2dnbGUoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvb2x0aXApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGVudClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLm9wdGlvbnMuYWxsb3dNdWx0aXBsZSlcclxuICAgICAgICAgICAgICAgIGNsb3NlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJywgdGhpcy5jbG9zZUNhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMub3B0aW9ucy5jbG9zZVNlbGVjdG9yLCB0aGlzLmNsb3NlQ2FsbGJhY2spO1xyXG5cclxuICAgICAgICAgICAgdmFyIG8gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXAgPSAkKCc8ZGl2IGNsYXNzPVwidG9vbHRpcC1mcmFtZVwiLz4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKG8uY3NzQ2xhc3MpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3Rvb2x0aXAtJyArIG8ucG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuY29udGVudC5zaG93KCkpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxkaXYgY2xhc3M9XCJ0aXBcIi8+JykpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcbiAgICAgICAgICAgIGFjdGl2ZVRvb2x0aXBzLnB1c2godGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBwb3NpdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG1hcmdpbiA9IDEwO1xyXG5cclxuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLnRvb2x0aXA7XHJcbiAgICAgICAgICAgIHZhciBlID0gdGhpcy50YXJnZXQ7XHJcbiAgICAgICAgICAgIHZhciBvID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0KVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgLy9SZXNldCBzbyBkaW1lbnRpb25zIGNhbGN1bGF0aW9ucyBhcmUgY29ycmVjdFxyXG4gICAgICAgICAgICB0LnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gZS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB3dyA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICB2YXIgdyA9IHQub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IG9mZnNldC5sZWZ0ICsgZS5vdXRlcldpZHRoKCkgLyAyIC0gdyAvIDI7XHJcblxyXG4gICAgICAgICAgICBpZiAobGVmdCA8IG1hcmdpbilcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBtYXJnaW47XHJcbiAgICAgICAgICAgIHZhciByaWdodE92ZXJmbG93ID0gKGxlZnQgKyB3KSAtICh3dyAtIG1hcmdpbik7XHJcbiAgICAgICAgICAgIGlmKHJpZ2h0T3ZlcmZsb3cgPiAwKVxyXG4gICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgubWF4KGxlZnQgLSByaWdodE92ZXJmbG93LCBtYXJnaW4pO1xyXG5cclxuICAgICAgICAgICAgdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgJ2xlZnQnOiBsZWZ0ICsgJ3B4JyxcclxuICAgICAgICAgICAgICAgICdtYXgtd2lkdGgnOiAod3cgLSBsZWZ0IC0gbWFyZ2luKSArICdweCdcclxuICAgICAgICAgICAgfSkuZmluZCgnLnRpcCcpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdsZWZ0Jywgb2Zmc2V0LmxlZnQgKyBlLm91dGVyV2lkdGgoKSAvIDIgLSBsZWZ0ICsgJ3B4Jyk7XHJcblxyXG4gICAgICAgICAgICAvL1NldHRpbmcgd2lkdGggY2FuIG1ha2UgaGVpZ2h0IHZhcnkuIFNvIHdlIHNldCB2ZXJ0aWNhbCBwb3NpdGlvbiBhZnRlci5cclxuICAgICAgICAgICAgdmFyIGggPSB0Lm91dGVySGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHQuY3NzKCd0b3AnLCBvLnBvc2l0aW9uID09ICd0b3AnXHJcbiAgICAgICAgICAgICAgICA/IG9mZnNldC50b3AgLSBoIC0gby5kaXN0YW5jZVxyXG4gICAgICAgICAgICAgICAgOiBvZmZzZXQudG9wICsgZS5vdXRlckhlaWdodCgpICsgby5kaXN0YW5jZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGNsb3NlKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudG9vbHRpcClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYodGhpcy5vcHRpb25zLnNvdXJjZSA9PSAnYW5jaG9yJylcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC5oaWRlKCkuYXBwZW5kVG8oJ2JvZHknKTtcclxuICAgICAgICAgICAgdGhpcy50b29sdGlwLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRvb2x0aXAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5kYXRhKCdfdG9vbHRpcCcsIG51bGwpO1xyXG4gICAgICAgICAgICBhY3RpdmVUb29sdGlwcy5zcGxpY2UoYWN0aXZlVG9vbHRpcHMuaW5kZXhPZih0aGlzKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9