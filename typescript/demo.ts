/// <reference path="neat-tooltip.ts" />

$('.tooltip1').tooltip();
$('.tooltip1top').tooltip({ position:'top'});
$('.tooltip2').tooltip({ cssClass:'tooltip-dark'});
$('.tooltip3').tooltip({ cssClass: 'tooltip-pill' });
$('.tooltip4').tooltip({ source: 'anchor', cssClass: 'tooltip-large'}, 'click');
$('.tooltip5').tooltip({ content: function () { return 'time = ' + new Date().getTime(); } });

$('#demo_delegation').tooltip({}, 'hover', 'span')
$('#demo_delegation button').click(function(){
   $('<span>')
        .text('New span ')
        .attr('title', 'Tooltip content')
        .appendTo('#demo_delegation');
});

$('.demo6 button').click(function () {
    $('#demo6-target').showTooltip({content:'Display for 1s'});
    setTimeout(() => $('#demo6-target').closeTooltip(), 1000);
    return false;
});

$('.demo7 a').tooltip({ source: 'anchor', cssClass: 'tooltip-large', container: '.demo7'}, 'click');

$('.demo8 a').tooltip({appendTo: '.demo8 p'}, 'click');