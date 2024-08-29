var count = 0;
            $(document).ready(function () {		               
			
			
					setInterval(function(){
  
  
					var v1 = Math.floor((Math.random() * 99999) + 1);
					var v2 = Math.floor((Math.random() * 99999) + 1);
					var v3 = Math.floor((Math.random() * 99999) + 1);
					var v4 = Math.floor((Math.random() * 99999) + 1);
					var v5 = Math.floor((Math.random() * 99999) + 1);
					var v6 = Math.floor((Math.random() * 99999) + 1);
					var v7 = Math.floor((Math.random() * 99999) + 1);
					var v8 = Math.floor((Math.random() * 99999) + 1);
					
					
    
					
					
					
					var s1 = [[2002, v1], [2003, v2],
					[2004, v3],[2005, v4],[2006, v5]];
					var s2 = [[2002, v1], [2003, v2],
					[2004, v3],[2005, v4],[2006, v5]];
				
				    
						//
					
					if( count != 0){
						plot1.destroy();					
					}else{
						count++;
					}
					
						plot1 = $.jqplot("chart1", [s2, s1],{
							animate: true,
                    // Will animate plot on calls to plot1.replot({resetAxes:true})
                    animateReplot: true,
                    cursor: {
                        show: true,
                        zoom: true,
                        looseZoom: true,
                        showTooltip: false
                    }			
						
						,
                    series:[
                        {
                            pointLabels: {
                                show: false
                            },
                            renderer: $.jqplot.DateAxisRenderer,
                            showHighlight: false,
                            yaxis: 'y2axis',
                            rendererOptions: {
                                // Speed up the animation a little bit.
                                // This is a number of milliseconds.  
                                // Default for bar series is 3000.  
                                animation: {
                                    speed: 500
                                },
                                barWidth: 15,
                                barPadding: -15,
                                barMargin: 0,
                                highlightMouseOver: false
                            }
                        }, 
                        {
                            rendererOptions: {
                                // speed up the animation a little bit.
                                // This is a number of milliseconds.
                                // Default for a line series is 2500.
                                animation: {
                                    speed: 500
                                }
                            }
                        }
                    ],
                    axesDefaults: {
                        pad: 0
                    },
                    axes: {
                        // These options will set up the x axis like a category axis.
                        xaxis: {
                            tickInterval: 1,
                            drawMajorGridlines: true,
                            drawMinorGridlines: true,
                            drawMajorTickMarks: true,
                            rendererOptions: {
                                tickInset: 0.5,
                                minorTicks: 1
                            }
                        },
                        yaxis: {
                            tickOptions: {
                                formatString: ""
                            },
                            rendererOptions: {
                                forceTickAt0: true
                            }
                        },
                        y2axis: {
                            tickOptions: {
                                formatString: ""
                            },
                            rendererOptions: {
                                // align the ticks on the y2 axis with the y axis.
                                alignTicks: true,
                                forceTickAt0: true
                            }
                        }
                    },
                    highlighter: {
                        show: true, 
                        showLabel: true, 
                        tooltipAxes: 'y',
                        tooltipLocation : 'ne'
                    }
                });
				
				
				
			}, 4000);
			
			
			
            });