//Function for getting BPEL instances

 // or var map = {};

var bpelNameServiceMap = new Object();
var bpelIdAndNameMap = new Object();


var arrayIds = [];

function get(k) {
    return map[k];
}

function getSystemProperties(){
   var map = new Object();
    var bpelDefined=0;
var rowFlag = 0;
var prevRowRef;

var g_top1=5;
var g_left1=5;

var g_top2=15;
var g_left2=5;
var firstGChild = 0;
var largestID;
	
	//document.getElementById('tableSystemPropHeader').innerHTML = "";
	
	//http://localhost:8081/OpenEsbMonitoringRestService-1.0-SNAPSHOT_New/rest/jvm/memory
	
	
	//http://localhost:8081/OpenEsbMonitoringRestService-1.0-SNAPSHOT_New/rest/jvm/jvmInfo
	
	document.getElementById("tableSystemPropHeader").innerHTML = "";
    
	var ur = "/BPELMonitorAndMessageTracker-1.0/rest/jvm/jvmInfo";
    var c = encodeURI(ur);
	
    $.ajax({
        url: c
    }).then(function(data) {
	    var rCount = 0;
        var summary= data[0];
		

		
        console.log("Summary : ");
        console.log(summary);
        var obj = jQuery.parseJSON( summary );
        console.log(summary.name);
		
		
		
		var rowR;
		var row = 0;
		
		 for (var i in summary) { 		 	
				rowR = $("<tr></tr>");
				rowR.append($("<td>").text(i));			
				rowR.append($("<td>").text(summary[i]));	

                if( i != 'system.properties'){
				
					$("#tableSystemPropHeader").append(rowR);			
				}
         }
		 
		 
		
		
        if( summary["system.properties"] ){		    
            
            
            				
						    
                var theItem = summary["system.properties"];
				
				var rowR1;
		var row1 = 0;
		
		 for (var i in theItem) { 		 	
				rowR1 = $("<tr></tr>");
				rowR1.append($("<td>").text(i));			
				rowR1.append($("<td>").text(theItem[i]));	

                
					$("#tabActivityList").append(rowR1);			
				
         }
				

				
                
					
            
			
			
						
        }	
		
		
		
        
	
	
    });

	
	//alert(document.getElementById("arrowIMG_" + largestID));

}
 




function param(){

				
			$( "#Div" ).animate({
        width: "0px"
    }, 500, function() {	
		var thedivs=document.getElementById('msgTrackingAsSimpleTbl');
        thedivs.style.visibility = "hidden";						
        var thediv=document.getElementById('msgTrackingFlowDiagram');	
        thediv.style.visibility = "visible";		
	});	

	
}

$(document).ready(function(){

	
	
	
	getSystemProperties();
	
    //getInstanceSummaryList();
});

function paramAsComponentFlowBack(){

	
		var thedivs=document.getElementById('msgTrackingFlowDiagram');
        thedivs.style.visibility = "hidden";						
        var thediv=document.getElementById('msgTrackingAsSimpleTbl');	
        thediv.style.visibility = "visible";	

			for( var i in arrayIds ){		
			var dd = document.getElementById(arrayIds[i]);
			//alert(dd);
			
			$( "#" + arrayIds[i] +"_Div" ).animate({
        width: "440px"
    }, 500, function() {	});


		
	}	

	}



function param() {
    /*$( "#divPopupTableView" ).animate({        
        width: "0%"
    }, 500, function() {*/
	
	document.getElementById('trackingTable').innerHTML = '';
							
							
    getBpelInstancesS(document.getElementById('bpelID').innerHTML);
	//alert(document.getElementById('bpelID').innerHTML);

						
    
		
		
        			
   /* });	*/
}

function messageTrackingWindowDiagramBack() {
    /*$( "#myMessageTrackingWindowDiagram" ).animate({
        width: "0%"
    }, 20, function() {*/
	
	
	var thedivs1=document.getElementById('msgTrackingFlowDiagram');
    thedivs1.style.visibility = "hidden";			
	
	
	thedivs1=document.getElementById('msgTrackingAsSimpleTbl');
    thedivs1.style.visibility = "visible";	
		
	for( var i in arrayIds ){		
			var dd = document.getElementById(arrayIds[i]);
			//alert(dd);			
			$( "#" + arrayIds[i] +"_Div" ).animate({
        width: "0px"
    }, 500, function() {
	
		thedivs1=document.getElementById('msgTrackingAsSimpleTbl');
		thedivs1.style.visibility = "hidden";	
		
		var thedivs1=document.getElementById('msgTrackingFlowDiagram');
		thedivs1.style.visibility = "hidden";
		
	
		var thedivs=document.getElementById('myMessageTrackingWindowDiagram');
        thedivs.style.visibility = "hidden";						
        var thediv=document.getElementById('divPopupTableView');	
        thediv.style.visibility = "visible";	
	
	});	
			

		}
						
        			
		
	
						
        
					
   /* });	*/
}


function param2() {

	$( "#divPopupTableView" ).animate({
        width: "100%"
    }, 500, function() {
	});

    $( "#myMessageTrackingWindow" ).animate({
        height: "0%",
        width: "0%"
    }, 500, function() {
						
        var thedivs=document.getElementById('myMessageTrackingWindowDiagram');
        thedivs.style.visibility = "hidden";								
					
    });				
					
		
}








function displayActivityAsDiagram(){


    var thedivBtnOld=document.getElementById('viewActivityAsList');			
	
    $( "#paramdivtest" ).animate({
        width : "0px",
        height: "0px"
        
    }, 500, function() {
						
        var thedivs=document.getElementById('tabActivityList');
        thedivs.style.display = "none";
						
        var thediv=document.getElementById('tabActivityListAsGraph');
		
        var thedivBtn=document.getElementById('viewActivityAsPic');
        thedivBtn.style.display = "block";
	
        thediv.style.display = "block";
        thedivBtnOld.style.display = "none";
		
						
		
        $( "#tabActivityListAsGraph" ).animate({
            width : "90%",
            height: "100%"
            
        }, 1000, function() {
            // Animation complete.
            });
					
    });
	
    thedivBtnOld.style.display = "none";	
	
	
}

function clearView(){
    
    $( "#tabActivityListAsGraph" ).animate({
        width : "0%",
        height: "0%"
        
    }, 500, function() {
        var thedivs=document.getElementById('tabActivityListAsGraph');
        thedivs.style.display = "none";
						
        var thediv=document.getElementById('tabActivityList');	
        thediv.style.display = "block";						
						
        var thedivBtn=document.getElementById('viewActivityAsPic');
        thedivBtn.style.display = "none";        
						
        var thedivBtnOld=document.getElementById('viewActivityAsList');			
						
        thedivBtnOld.style.display = "block";	
        $( "#paramdivtest" ).animate({
            width : "100%",
            height: "500px"
            
        }, 500, function() {
            
            });
    });
}



function displayActivityAsDiagramTableView(){

    $( "#tabActivityListAsGraph" ).animate({
        width : "0%",
        height: "0%"
        
    }, 1, function() {
						
        var thedivs=document.getElementById('tabActivityListAsGraph');
        thedivs.style.display = "none";
						
        var thediv=document.getElementById('tabActivityList');
	  
	
        thediv.style.display = "block";
						
						
						
        var thedivBtn=document.getElementById('viewActivityAsPic');
        thedivBtn.style.display = "none";
        
						
        var thedivBtnOld=document.getElementById('viewActivityAsList');			
						
        thedivBtnOld.style.display = "block";	
						
        $( "#paramdivtest" ).animate({
            width : "100%",
            height: "500px"
            
        }, 300, function() {
            // Animation complete.
            });
					
    });
	
	
}
