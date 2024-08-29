//Function for getting BPEL instances

// or var map = {};

var bpelNameServiceMap = new Object();
var bpelIdAndNameMap = new Object();

var messageTrackingMap = new Object();
var serviceBpelMap = new Object();

var arrayIds = [];

function get(k) {
    return map[k];
}

function getAllBpelServiceAssembly(){
    
    $.ajax({
        url: "/BPELMonitorAndMessageTracker-1.0/rest/CoreService/bpeldetails"		
    }).then(function(data) {
        
        var summary= data.serviceUnit;
        if( ! summary.bpelData ) {
        $.each(summary, function (i, theItem) {	
            var s = theItem.serviceAssembly;
            serviceBpelMap["BPEL Name : " + theItem.bpelData.bpelId] = s;		
        //alert(serviceBpelMap.bpelID);
        });
		}else{
		    var s = summary.serviceAssembly;
			serviceBpelMap["BPEL Name : " + summary.bpelData.bpelId] = s;		
		}
		
    });
    
}


$(document).ready(function(){
    getAllBpelServiceAssembly();
})


function getBpelInstancesS(bpelId){



    var s = serviceBpelMap[document.getElementById('bpelName').innerHTML];
	

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
	
    var payloadDiv=document.getElementById('paramPayload');	
    var endpointDiv=document.getElementById('paramEndpoint');			
    var endpointDivURL=document.getElementById('paramEndpointURL');			
    payloadDiv.innerHTML = "";
    endpointDiv.innerHTML = "";
    endpointDivURL.innerHTML = "";
    topSet = 0;
	
    $('#myMessageTrackingWindow').animate({
        scrollTop: topSet
    }, 2000);
	
    document.getElementById('msgTrackingGraphTable').innerHTML = "";
    
    $.ajax({
        url: "/BPELMonitorAndMessageTracker-1.0/rest/messagetracking/getmessagetracking?process_id=" + bpelId + "&suname=" + s		
    }).then(function(data) {
        var summary= data.messageTracking;
        if( !summary.id ){		    
            totalBPELInstances = summary.length;	
            if(document.getElementById("totalBPELInstDiv")){				
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {						
						    
                tableRowRountInst++;
                                         
               
                var props = [
                'COMPONENT_NAME',     
                'ENDPOINT_SERVICE_NAME', 
                'MSG_EXCHANGE_ID', 
                'MSG_FLOW_DIRECTION', 
                'TRACKING_ID',     
                ];
  
  
                messageTrackingMap[theItem.ID] = theItem;
  
                var rowid = theItem.ID;
				
                arrayIds.push(rowid);
				
                var row ;
				
                //alert( theItem.COMPONENT_NAME); 
                if( rowFlag < 2 ){
				    
                    if( rowFlag == 0){
					   
                        row = $("<tr></tr>");
                        prevRowRef = row;
                        var td = "<td id='" + theItem.ID +"' align='left'><div style='left:1em;position:absolute;cursor:pointer' onclick='getPayloads(" + theItem.ID + ")'></div> <div class='well' style='width:0px' id='" + theItem.ID + "_Div'> <h4> "  +  theItem.COMPONENT_NAME  + "</h4> <h6>" + theItem.MSG_FLOW_DIRECTION + " Request ID[ " + theItem.MSG_EXCHANGE_ID + " ]</h6> </div></td>";
						
                        prevRowRef.append(td);							
						
						
						var itd = "<td id='" + theItem.ID + "_IMG' align='center'><img width='40px' height='30px'  src='img/ForwardArrow.png' /></td>";
                        prevRowRef.append(itd);
						
                        var itd = "<td id='" + theItem.ID + "_IMG' align='center'><div style='cursor:pointer' onclick='getPayloads(" + theItem.ID + ")'>	NMR  </div></td>";
                        prevRowRef.append(itd);
						
						var itd = "<td id='" + theItem.ID + "_IMG' align='center'><img width='40px' height='30px'  src='img/ForwardArrow.png' /></td>";
                        prevRowRef.append(itd);
						
                        rowFlag++;
						
                    }else{
					   
                        var td = "<td id='" + theItem.ID + "' align='right'><div style='left:0em;position:relative;cursor:pointer' onclick='getPayloads(" + theItem.ID + ")'></div> <div class='well' style='width:0px' align='left' id='" + theItem.ID + "_Div'>  <h4> "  +  theItem.COMPONENT_NAME  + "</h4> <h6>" + theItem.MSG_FLOW_DIRECTION + " Request ID[ " + theItem.MSG_EXCHANGE_ID + " ]</h6> </div>	</td>";
                        prevRowRef.append(td);							
                        rowFlag = 0;
                    }
										
                }else{
                    rowFlag = 0;
                }
        			
             
                $("#trackingTable").append(prevRowRef);								
				
				

                if( ! map[theItem.ENDPOINT_SERVICE_NAME] ){						
                    //alert("" + theItem.ENDPOINT_SERVICE_NAME + "...Not exist..Creating new");
                    map[theItem.ENDPOINT_SERVICE_NAME] = theItem.COMPONENT_NAME;
                    //alert(theItem.COMPONENT_NAME);
                    if( bpelDefined == 0 && theItem.COMPONENT_NAME == 'sun-bpel-engine' ){	
                        bpelDefined = 1;
                        //alert('Creating new comp bpel: ' + theItem.COMPONENT_NAME);
                        var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + theItem.COMPONENT_NAME + "</h4><h6>Outgoing Request ID[ " + theItem.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + theItem.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div></td></tr>";
							
                        g_top1 = g_top1 + 7;
                        g_top2 = g_top2 + 7;
                        if( g_left1 < 15 ){
                            g_left1 = g_left1 + 5;
                        }
                        if( g_left2 < 10 ){
                            g_left2 = g_left2 + 5;
                        }	
							
                        $("#msgTrackingGraphTable").append(tRow);
                        largestID = theItem.ID;
							
                    }else if(theItem.COMPONENT_NAME != 'sun-bpel-engine'){						
                        //alert('Creating new comp : ' + theItem.COMPONENT_NAME);		

                        if( firstGChild == 0 ){
                            //As first graph
                            var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + theItem.COMPONENT_NAME + "</h4><h6>" + theItem.MSG_FLOW_DIRECTION + " Request ID[ " + theItem.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + theItem.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div><div style='left:" + (g_left1-1) + "em;top:" + g_top1 + "em;position:absolute'><img height='1000px'  src='img/vline.gif' /></div></td></tr>";
                            firstGChild = 1; 
                            largestID = theItem.ID;
                        }else{
                            var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + theItem.COMPONENT_NAME + "</h4><h6>" + theItem.MSG_FLOW_DIRECTION + " Request ID[ " + theItem.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + theItem.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div></td></tr>";
                            largestID = theItem.ID;
								
                        }
                        g_top1 = g_top1 + 7;
                        g_top2 = g_top2 + 7;
                        if( g_left1 < 15 ){
                            g_left1 = g_left1 + 5;
                        }
                        if( g_left2 < 10 ){
                            g_left2 = g_left2 + 5;
                        }	
                        $("#msgTrackingGraphTable").append(tRow);
                    }
						
						
                }else{
                //alert("" + theItem.ENDPOINT_SERVICE_NAME + "...Already exist");
                }
                
					
            });
            if(document.getElementById('arrowIMG_' + largestID)){
                document.getElementById('arrowIMG_' + largestID).style.display = "none";
            }
        //alert(largestID);
			
						
        }	else{
            totalBPELInstances = 1;		
			
			
            tableRowRountInst++;
                                         
               
            var props = [
            'COMPONENT_NAME',     
            'ENDPOINT_SERVICE_NAME', 
            'MSG_EXCHANGE_ID', 
            'MSG_FLOW_DIRECTION', 
            'TRACKING_ID',     
            ];
  
  
            messageTrackingMap[summary.ID] = summary;
  
            var rowid = summary.ID;
				
            arrayIds.push(rowid);
				
            var row ;
				
            //alert( summary.COMPONENT_NAME); 
            if( rowFlag < 2 ){
				    
                if( rowFlag == 0){
					   
                    row = $("<tr></tr>");
                    prevRowRef = row;
                    var td = "<td id='" + summary.ID +"' align='left'><div style='left:1em;position:absolute;cursor:pointer' onclick='getPayloads(" + summary.ID + ")'></div> <div class='well' style='width:0px' id='" + summary.ID + "_Div'> <h4> "  +  summary.COMPONENT_NAME  + "</h4> <h6>" + summary.MSG_FLOW_DIRECTION + " Request ID[ " + summary.MSG_EXCHANGE_ID + " ]</h6> </div></td>";
						
                    prevRowRef.append(td);							
						
					var itd = "<td id='" + theItem.ID + "_IMG' align='center'><img width='40px' height='30px'  src='img/ForwardArrow.png' /></td>";
                        prevRowRef.append(itd);
						
                        var itd = "<td id='" + theItem.ID + "_IMG' align='center'><div style='left:-2em;position:relative;cursor:pointer' onclick='getPayloads(" + theItem.ID + ")'><span id='totalBPELNewInstDiv' class='notification'>+</span></div>	NMR </td>";
                        prevRowRef.append(itd);
						
						var itd = "<td id='" + theItem.ID + "_IMG' align='center'><img width='40px' height='30px'  src='img/ForwardArrow.png' /></td>";
                        prevRowRef.append(itd);
						
                    rowFlag++;
						
                }else{
					   
                    var td = "<td id='" + summary.ID + "' align='right'><div style='left:0em;position:relative;cursor:pointer' onclick='getPayloads(" + summary.ID + ")'></div> <div class='well' style='width:0px' align='left' id='" + summary.ID + "_Div'>  <h4> "  +  summary.COMPONENT_NAME  + "</h4> <h6>" + summary.MSG_FLOW_DIRECTION + " Request ID[ " + summary.MSG_EXCHANGE_ID + " ]</h6> </div>	</td>";
                    prevRowRef.append(td);							
                    rowFlag = 0;
                }
										
            }else{
                rowFlag = 0;
            }
        
							
             
            $("#trackingTable").append(prevRowRef);								
				
				

            if( ! map[summary.ENDPOINT_SERVICE_NAME] ){						
                //alert("" + summary.ENDPOINT_SERVICE_NAME + "...Not exist..Creating new");
                map[summary.ENDPOINT_SERVICE_NAME] = summary.COMPONENT_NAME;
                //alert(summary.COMPONENT_NAME);
                if( bpelDefined == 0 && summary.COMPONENT_NAME == 'sun-bpel-engine' ){	
                    bpelDefined = 1;
                    //alert('Creating new comp bpel: ' + summary.COMPONENT_NAME);
                    var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + summary.COMPONENT_NAME + "</h4><h6>Outgoing Request ID[ " + summary.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + summary.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div></td></tr>";
							
                    g_top1 = g_top1 + 7;
                    g_top2 = g_top2 + 7;
                    if( g_left1 < 15 ){
                        g_left1 = g_left1 + 5;
                    }
                    if( g_left2 < 10 ){
                        g_left2 = g_left2 + 5;
                    }	
							
                    $("#msgTrackingGraphTable").append(tRow);
                    largestID = summary.ID;
							
                }else if(summary.COMPONENT_NAME != 'sun-bpel-engine'){						
                    //alert('Creating new comp : ' + summary.COMPONENT_NAME);		

                    if( firstGChild == 0 ){
                        //As first graph
                        var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + summary.COMPONENT_NAME + "</h4><h6>" + summary.MSG_FLOW_DIRECTION + " Request ID[ " + summary.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + summary.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div><div style='left:" + (g_left1-1) + "em;top:" + g_top1 + "em;position:absolute'><img height='1000px'  src='img/vline.gif' /></div></td></tr>";
                        firstGChild = 1; 
                        largestID = summary.ID;
                    }else{
                        var tRow = "<tr><td text-align='right'><div id='paramdiv111' class='well' style='width:440px;left:" + g_left1 + "em;top:" + g_top1 +"em;position:absolute'><h4>" + summary.COMPONENT_NAME + "</h4><h6>" + summary.MSG_FLOW_DIRECTION + " Request ID[ " + summary.MSG_EXCHANGE_ID +" ]</h6></div><div style='left:" + g_left2 + "em;top:" + (g_top2-2) + "em;position:absolute'><img id='arrowIMG_"  + summary.ID + "' width='70px' height='40px'  src='img/ForwardArrow.png' /></div></td></tr>";
                        largestID = summary.ID;
								
                    }
                    g_top1 = g_top1 + 7;
                    g_top2 = g_top2 + 7;
                    if( g_left1 < 15 ){
                        g_left1 = g_left1 + 5;
                    }
                    if( g_left2 < 10 ){
                        g_left2 = g_left2 + 5;
                    }	
                    $("#msgTrackingGraphTable").append(tRow);
                }
						
						
            }else{
            //alert("" + theItem.ENDPOINT_SERVICE_NAME + "...Already exist");
            }
			
			
        }
		
	
	
        var thedivs=document.getElementById('divPopupTableView');
        thedivs.style.visibility = "hidden";						
        var thediv=document.getElementById('myMessageTrackingWindowDiagram');	
        thediv.style.visibility = "visible";				
						
        thedivs1=document.getElementById('msgTrackingAsSimpleTbl');
        thedivs1.style.visibility = "visible";	
        for( var i in arrayIds ){		
            var dd = document.getElementById(arrayIds[i]);
            //alert(dd);
			
            $( "#" + arrayIds[i] +"_Div" ).animate({
                width: "440px"
            }, 1000, function() {
                });	
			

        }
	
	
    });

	
//alert(document.getElementById("arrowIMG_" + largestID));

}
 



function paramAsComponentFlow(){

    for( var i in arrayIds ){		
        var dd = document.getElementById(arrayIds[i]);
        //alert(dd);
			
        $( "#" + arrayIds[i] +"_Div" ).animate({
            width: "0px"
        }, 500, function() {	
            var thedivs=document.getElementById('msgTrackingAsSimpleTbl');
            thedivs.style.visibility = "hidden";						
            var thediv=document.getElementById('msgTrackingFlowDiagram');	
            thediv.style.visibility = "visible";		
        });	

    }
}



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
	var thedivBtnOldBPV=document.getElementById('tabBpelVariableList');			
	
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
		thedivBtnOldBPV.style.display = "none";
						
		
        $( "#tabActivityListAsGraph" ).animate({
            width : "90%",
            height: "100%"
            
        }, 1000, function() {
            // Animation complete.
            });
					
    });
	
    thedivBtnOld.style.display = "none";	
	
	
}


function displayActivityAsDiagram(){


    var thedivBtnOld=document.getElementById('viewActivityAsList');			
	var thedivBtnOldBPV=document.getElementById('tabBpelVariableList');			
	
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
		thedivBtnOldBPV.style.display = "none";
								
		
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
		
		var thedivsbv=document.getElementById('tabBpelVariableList');
        thedivsbv.style.display = "none";
		
		
						
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

function getPayloads(id){
    //alert("Need to display the message payload for " + id );
	
    var p = messageTrackingMap[id];
	
    var thedivBtnOld=document.getElementById('paramPayload');			
		
    thedivBtnOld.innerHTML = "<td> <textarea style='width:600px;height:800px;font-family:thoma'> " + formatXml(p.MESSAGE_PAYLOAD_INCOMING)  + "</textarea></td>";
    if( p.MESSAGE_PAYLOAD_OUTGOING == "" ){
	    
        thedivBtnOld.innerHTML +="<td><textarea style='width:600px;height:800px;font-family:thoma'> " +  "N/A" + "</textarea></td>";
    }else{
        thedivBtnOld.innerHTML +="<td><textarea style='width:600px;height:800px;font-family:thoma'>  " +  formatXml(p.MESSAGE_PAYLOAD_OUTGOING) + " </textarea></td>";
    }
	
    var thedivBtnOld1=document.getElementById('paramEndpoint');			
		
    thedivBtnOld1.innerHTML = "<td> <span style='width:600px;height:50px;font-family:thoma'> " + p.ENDPOINT_SERVICE_NAME  + "</span></td>";
	
	    
    thedivBtnOld1.innerHTML +="<td><span style='width:600px;height:50px;font-family:thoma'> " +  p.ENDPOINT_NAME + "</span></td>";
	
    var thedivBtnOld11=document.getElementById('paramEndpointURL');			
		
    if( ! p.ADDRESS_URL ){
        thedivBtnOld11.innerHTML = "<td> <span style='width:600px;height:50px;font-family:thoma'> " + "N/A"  + "</span></td>";
    }else{
        thedivBtnOld11.innerHTML = "<td> <span style='width:600px;height:50px;font-family:thoma'> " + p.ADDRESS_URL  + "</span></td>";
    }
	

    //$("#myMessageTrackingWindow").scrollTo('#trackingTableForPayload');
	
    /*$('#myMessageTrackingWindow').animate({
        scrollTo: $("#trackingTableForPayloadDiv")},
        'slow');
		*/
    var target = "#trackingTableForPayloadDiv";
    if(topSet == 0){
        topSet = $(target).offset().top - 4;
    }
		
		
    $('#myMessageTrackingWindow').animate({
        scrollTop: topSet
    }, 2000);
	
//thedivBtnOld.style.display = "block";
//thedivBtnOld.style.visibility = "visible";
	
}

var topSet = 0;

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

function displayBpelVariableTable(){
	
	var thedivBtnOld=document.getElementById('viewActivityAsList');			
	
    $( "#paramdivtest" ).animate({
        width : "0px",
        height: "0px"
        
    }, 500, function() {
						
        var thedivs=document.getElementById('tabActivityList');
        thedivs.style.display = "none";
						
        var thediv=document.getElementById('tabBpelVariableList');
		
        var thedivBtn=document.getElementById('viewActivityAsPic');
        thedivBtn.style.display = "block";
	
        thediv.style.display = "block";
        thedivBtnOld.style.display = "none";
		
						
		
        $( "#tabBpelVariableList" ).animate({
            width : "100%",
            height: "100%"
            
        }, 1000, function() {
            // Animation complete.
            });
					
    });
	
    thedivBtnOld.style.display = "none";	
	

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
						
						
	    var thedivsbv=document.getElementById('tabBpelVariableList');
        thedivsbv.style.display = "none";
						
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
