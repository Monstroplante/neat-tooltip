/// <reference path="neat-tooltip.ts" />

$('.tooltip1').tooltip();
$('.tooltip2').tooltip({cssClass:'tooltip-dark'});
$('.tooltip3').tooltip({cssClass:'tooltip-pill'});
$('.tooltip4').tooltip({source:Tooltip.Source.anchor}, Tooltip.ShowOn.click);