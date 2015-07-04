/// <reference path="neat-tooltip.ts" />

$('.tooltip1').tooltip();
$('.tooltip1top').tooltip({ position:'top'});
$('.tooltip2').tooltip({ cssClass:'tooltip-dark'});
$('.tooltip3').tooltip({ cssClass: 'tooltip-pill' });
$('.tooltip4').tooltip({ source: 'anchor' }, 'click');
$('.tooltip5').tooltip({ content: function () { return 'time = ' + new Date().getTime(); } });