var example = 'gauge-solid', 
theme = 'default';

(function($){ // encapsulate jQuery
    $(function () {
	
        var gaugeOptions = {
	
            chart: {
                type: 'solidgauge'
            },
	    
            title: null,
	    
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },

            tooltip: {
                enabled: false
            },
	       
            // the value axis
            yAxis: {
                stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickPixelInterval: 400,
                tickWidth: 0,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }        
            },
        
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: -30,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };
    
        // The speed gauge
        $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Messages'
                }       
            },

            credits: {
                enabled: false
            },
	
            series: [{
                name: 'Target : Domain1',
                data: [80],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' + 
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' + 
                    '<span style="font-size:12px;color:silver">Target : Domain1</span></div>'
                },
                tooltip: {
                    valueSuffix: 'BPEL Instances'
                }
            }]
	
        }));
    
        // The RPM gauge
        $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'BPEL Messages'
                }       
            },
	
            series: [{
                name: 'Target : Domain1',
                data: [1],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' + 
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y} %</span><br/>' + 
                    '<span style="font-size:12px;color:silver">Incoming Rate</span></div>'
                },
                tooltip: {
                    valueSuffix: 'revolutions/min'
                }      
            }]
	
        }));
                               
        // Bring life to the dials
        setInterval(function () {
            // Speed
            var chart = $('#container-speed').highcharts();
            if (chart) {
                var point = chart.series[0].points[0],
                newVal,
                inc = Math.floor((Math.random() * 99) + 1);            
                point.update(inc);
            }

            // RPM
            chart = $('#container-rpm').highcharts();
            var cc;
            if (chart) {
            
                //inc = Math.floor((Math.random() * 99) + 1);

                $.ajax({
                    url: "/BPELMonitorAndMessageTracker-1.0/rest/CoreService/bpelinstances?maxrecord=1000"
                }).then(function(data) {
                    if( data && data.bpInstnaceList){
                        var summary= data.bpInstnaceList;
                        var statusChecked = 0;
                        var num = 0;
                        if( !summary.id ){		    
                            totalBPELInstances = summary.length;	
                            if(document.getElementById("totalBPELInstDiv")){				
                                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
                            }
						
						
                        
                            $.each(summary, function (i, theItem) {						
                                var date = new Date(theItem.startTime);
                                var todaysDate = new Date();
                                var p = secondsBetween(date,todaysDate);
                                if( p < 30 ){
                                    num++;
                                }
                            });
                        }
                    
					
                        if(document.getElementById("ajaxInstanceContaniner")){				
                            document.getElementById("ajaxInstanceContaniner").innerHTML = num;
                        }
						
                        cc = Math.floor((num * 100)/1000);
                        var point = chart.series[0].points[0], newVal,cc;
                        point.update(cc);
                    }
                });
            }
        }, 2000);  
    });
})(jQuery);

var prevCount = 0;
var threshold = 1000;

function secondsBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_sec=1000;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    
    // Convert back to days and return
    return Math.round(difference_ms/one_sec); 
}

function param(){
		

}