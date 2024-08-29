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
    $('#container-speed_server').highcharts(Highcharts.merge(gaugeOptions, {
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
	
	// The speed gauge
    $('#container-speed_instance1').highcharts(Highcharts.merge(gaugeOptions, {
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
    $('#container-rpm_server').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
        	min: 0,
        	max: 100,
	        title: {
	            text: 'JVM'
	        }       
	    },
	
	    series: [{
	        name: 'JVM',
	        data: [1],
	        dataLabels: {
	        	format: '<div style="text-align:center"><span style="font-size:25px;color:' + 
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' + 
                   	'<span style="font-size:12px;color:silver">JVM Performance</span></div>'
	        },
	        tooltip: {
	            valueSuffix: 'revolutions/min'
	        }      
	    }]
	
	}));
	// The RPM gauge
    $('#container-rpm_instance1').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
        	min: 0,
        	max: 100,
	        title: {
	            text: 'JVM'
	        }       
	    },
	
	    series: [{
	        name: 'JVM',
	        data: [1],
	        dataLabels: {
	        	format: '<div style="text-align:center"><span style="font-size:25px;color:' + 
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' + 
                   	'<span style="font-size:12px;color:silver">JVM Performance</span></div>'
	        },
	        tooltip: {
	            valueSuffix: 'revolutions/min'
	        }      
	    }]
	
	}));
                               
    // Bring life to the dials
    setInterval(function () {
    	// Speed
        var chart = $('#container-speed_server').highcharts();
        if (chart) {
				var point = chart.series[0].points[0],
                newVal,
                inc = Math.floor((Math.random() * 99) + 1);            
				point.update(inc);
        }

        // RPM
        chart = $('#container-rpm_server').highcharts();
        if (chart) {
            var point = chart.series[0].points[0],
                newVal,
                inc = Math.floor((Math.random() * 99) + 1);            
				point.update(inc);
            
            //point.update(newVal);
        }
		var chart = $('#container-speed_instance1').highcharts();
        if (chart) {
				var point = chart.series[0].points[0],
                newVal,
                inc = Math.floor((Math.random() * 99) + 1);            
				point.update(inc);
        }

        // RPM
        chart = $('#container-rpm_instance1').highcharts();
        if (chart) {
            var point = chart.series[0].points[0],
                newVal,
                inc = Math.floor((Math.random() * 99) + 1);            
				point.update(inc);
            
            //point.update(newVal);
        }
    }, 2000);  
    
	
});		})(jQuery);