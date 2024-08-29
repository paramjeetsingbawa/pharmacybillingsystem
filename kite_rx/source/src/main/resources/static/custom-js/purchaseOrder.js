/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var orderGenerated = -1;
var finalBilling = 0;
var summary;
var updatingProductId = 0;
var updatingProductName = '';
var isSearchedProduct = 0;
var tableRowRountInst = 0;
var tabActivityListTableRowRountInst = 0;
var tableRowCountBpelProcesses = 0;

var pageNumber = 0;
var tabActivityListPageNumber = 0;
var totalRowCountInstSum = 0;
var pageNumberInstSum = 0;

var totalBPELInstances = 0;
var totalBPELNewInst = 0;
var totalServiceAssemblies = 0;

var totalBPELProcess = 0;
var totalBPELNewProcess = 0;

var map = new Object(); // or var map = {};

var bpelNameServiceMap = new Object();
var bpelIdAndNameMap = new Object();
var bpelIdAndVariableValue = new Object();
var totalForThisBpel = 0;

$(function () {
    $('#vertical-ticker').totemticker({
        row_height: '255px',
        next: '#ticker-next',
        previous: '#ticker-previous',
        stop: '#stop',
        start: '#start',
        mousestop: true,
    });
});

function get(k) {
    return map[k];
}
var serviceBpelMap = new Object();
var countServiceMap = new Object();
var totalTarget = 0;
var serviceAssembliesStatusMap = new Object();



function getAllBpelServiceAssembly() {
    $.ajax({
        url: "/AvonMedicalService/rest/CoreService/bpeldetails"
    }).then(function (data) {
        if (data && data.serviceUnit) {
            var summary = data.serviceUnit;
            if (!summary.bpelData) {

                $.each(summary, function (i, theItem) {
                    var s = theItem.serviceAssembly;
                    serviceBpelMap["BPEL Name : " + theItem.bpelData.bpelId] = s;
                    var ur = "/AvonMedicalService/rest/CoreService/getBpelInstanceCount?bpelId=" + theItem.bpelData.bpelId + "";
                    var c = encodeURI(ur);


                    $.ajax({
                        url: c
                    }).then(function (data) {
                        var v = data.total;

                        if (!countServiceMap[s]) {
                            countServiceMap[s] = v;
                        } else {
                            var c = countServiceMap[s]
                            countServiceMap[s] = c + v;
                        }
                    });
                });


                var d = document.getElementById("compAppList");

                //if(d){
                //  d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' +  s + '</a><br><strong>Status:</strong> <span class="label label-warning">undeployed</span> <br><strong>Target :</strong>N/A  <br>  <strong>Message Count:</strong> ' +  countServiceMap[s] + '</span> </li>';
                //}

                $.ajax({
                    url: "/AvonMedicalService/rest/openjbiservice/service_assemblies_details"
                }).then(function (data) {

                    var summary = data.serviceAssemblyTargetDetails;
                    if (summary.serviceAssembly) {

                        var s = summary.serviceAssembly;
                        var state = summary.state;
                        var target = summary.target;

                        //var d = document.getElementById("" + s + "_li");
                        //d.innerHTML = "";

                        if (d) {
                            if (state == "Started") {
                                d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label label-success">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';
                            } else {
                                d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';
                            }
                            totalBPELProcess++;
                            //alert("inserted");
                        }

                        //alert(serviceBpelMap.bpelID);

                    } else {
                        $.each(summary, function (i, theItem) {
                            var s = theItem.serviceAssembly;
                            var state = theItem.state;
                            var target = theItem.target;

                            //var d = document.getElementById("" + s + "_li");
                            //d.innerHTML = "";

                            if (d) {
                                if (state == "Started") {
                                    d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label label-success">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';

                                } else {
                                    d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';
                                }
                                totalBPELProcess++;

                            }

                            //alert(serviceBpelMap.bpelID);
                        });
                    }



                });

                //alert(serviceBpelMap.bpelID);





                $('#myModal').modal('hide');
            } else {
                var s = summary.serviceAssembly;
                serviceBpelMap["BPEL Name : " + summary.bpelData.bpelId] = s;
                var ur = "/AvonMedicalService/rest/CoreService/getBpelInstanceCount?bpelId=" + summary.bpelData.bpelId + "";
                var c = encodeURI(ur);


                $.ajax({
                    url: c
                }).then(function (data) {
                    var v = data.total;

                    if (!countServiceMap[s]) {
                        countServiceMap[s] = v;
                    } else {
                        var c = countServiceMap[s]
                        countServiceMap[s] = c + v;
                    }


                    var d = document.getElementById("compAppList");

                    //if(d){
                    //  d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' +  s + '</a><br><strong>Status:</strong> <span class="label label-warning">undeployed</span> <br><strong>Target :</strong>N/A  <br>  <strong>Message Count:</strong> ' +  countServiceMap[s] + '</span> </li>';
                    //}

                    $.ajax({
                        url: "/AvonMedicalService/rest/openjbiservice/service_assemblies_details"
                    }).then(function (data) {

                        var summary = data.serviceAssemblyTargetDetails;
                        if (summary.serviceAssembly) {

                            var s = summary.serviceAssembly;
                            var state = summary.state;
                            var target = summary.target;

                            //var d = document.getElementById("" + s + "_li");
                            //d.innerHTML = "";
                            if (d) {
                                if (state == "Started") {
                                    d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label label-success">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';

                                } else {
                                    d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';
                                }
                                totalBPELProcess++;

                            }

                            //alert(serviceBpelMap.bpelID);

                        } else {
                            $.each(summary, function (i, theItem) {
                                var s = theItem.serviceAssembly;
                                var state = theItem.state;
                                var target = theItem.target;

                                //var d = document.getElementById("" + s + "_li");
                                //d.innerHTML = "";

                                if (d) {
                                    if (state == "Started") {
                                        d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label label-success">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';

                                    } else {
                                        d.innerHTML += '<li id="' + s + '_li"><a href="#"><strong>Service Assembly :</strong> <a href="#">' + s + '</a><br><strong>Status:</strong> <span class="label">' + state + '</span> <br><strong>Target :</strong> ' + target + '  <br>  <strong>Message Count:</strong> ' + countServiceMap[s] + '</span> </li>';
                                    }
                                    totalBPELProcess = totalBPELProcess + 1;

                                }

                                //alert(serviceBpelMap.bpelID);
                            });
                        }



                    });


                });

                $('#myModal').modal('hide');

            }

        } else {
            $('#myModal').modal('hide');
        }



    });
}

//Function for getting the InstanceSummary

function getInstanceSummaryList() {

    //Get Data from web service 

    $.ajax({
        url: "/AvonMedicalService/rest/CoreService/getInstanceSummaryList"
    }).then(function (data) {

        if (data && data.instanceSummary) {
            var summary = data.instanceSummary;

            if (!summary.bpelId) {

                $.each(summary, function (i, theItem) {

                    totalBPELProcess = summary.length;

                    if (document.getElementById("totalBPELProcDiv")) {
                        document.getElementById("totalBPELProcDiv").innerHTML = totalBPELProcess;
                    }

                    var props2 = [
                        'bpelname',
                        'completedCount',
                        'faultedCount',
                        'lastUpdatedTime',
                        "runningCount",
                        "suspendedCount",
                        "terminatedCount"
                    ];

                    var date = new Date(theItem.lastUpdatedTime);
                    //alert(date);
                    var todaysDate = new Date();

                    var p = daysBetween(date, todaysDate);
                    //alert("Date differenct from current : " + p);
                    if (p < 1) {
                        totalBPELNewProcess++;
                    }



                    var rowid = theItem.bpelId;
                    var row = $("<tr id='" + rowid + "'></tr>");
                    //for (var i in props2) { 

                    //alert(theItem.bpelname);
                    for (var i = 0; i < props2.length; i++)
                    {
                        row.append($("<td id='" + rowid + "_TDBPELNAME'>").text(theItem[props2[i]]));
                        //alert(theItem[props2[i]);

                    }

                    row.append($('<td class="center"><button class="btn btn-small"><i class="icon-star"></i>Instance Detail</button></td>'));

                    $("#tabBpelInstSum").append(row);



                    //map[theItem.id] = theItem.bpelId;
                });
            } else {

                if (summary.bpelId) {

                    totalBPELProcess = 1;


                    if (document.getElementById("totalBPELProcDiv")) {
                        document.getElementById("totalBPELProcDiv").innerHTML = totalBPELProcess;
                    }

                    var props2 = [
                        'bpelname',
                        'completedCount',
                        'faultedCount',
                        'lastUpdatedTime',
                        "runningCount",
                        "suspendedCount",
                        "terminatedCount"
                    ];




                    var date = new Date(summary.lastUpdatedTime);
                    //alert(date);
                    var todaysDate = new Date();

                    var p = daysBetween(date, todaysDate);
                    //alert("Date differenct from current : " + p);
                    if (p < 1) {
                        totalBPELNewProcess++;
                    }



                    var rowid = summary.bpelId;
                    var row = $("<tr id='" + rowid + "'></tr>");
                    for (var i = 0; i < props2.length; i++)
                    {
                        row.append($("<td id='" + rowid + "_TDBPELNAME'>").text(summary[props2[i]]));

                    }

                    row.append($('<td class="center"><button class="btn btn-small"><i class="icon-star"></i>Track Messages</button></td>'));

                    $("#tabBpelInstSum").append(row);
                } else {
                    totalBPELProcess = 1;


                    if (document.getElementById("totalBPELProcDiv")) {
                        document.getElementById("totalBPELProcDiv").innerHTML = totalBPELProcess;
                    }
                }

                //map[theItem.id] = theItem.bpelId;

            }
            if (document.getElementById("totalBPELNewProcDiv")) {
                document.getElementById("totalBPELNewProcDiv").innerHTML = totalBPELNewProcess + "Updates";
            }


            $('#myTable').pageMe({
                pagerSelector: '#myPager',
                showPrevNext: true,
                hidePageNumbers: false,
                perPage: 10
            });

            $('#tabBpelInstSum tr').click(function (e) {



                $("#trackingFlowDisplay").animate({
                    width: "0px"
                }, 20);
                trid = $(this).attr('id'); // table row ID 

                //alert("Hi");
                $('#myModal').modal('show');
                getBpelInstancesForBpel(trid);





                e.preventDefault();
                $('#myMessageTrackingWindow').modal('show');




                $('#bpelID').text(trid);

                //getBpelInstancesS(trid);

                var t = document.getElementById(trid + '_TDBPELNAME');

                var r = t.innerHTML;

                $('#bpelName').text(r);





            });
        } else {

        }



    });

}

function loginf() {
    alert("loginf");
}

function targetChanged(e) {

    alert(e);
    alert(e.innerHTML);

}


$.fn.pageMe = function (opts) {

    var $this = this,
            defaults = {
                perPage: 7,
                showPrevNext: false,
                hidePageNumbers: false
            },
            settings = $.extend(defaults, opts);

    var listElement = $this;
    var perPage = settings.perPage;
    var children = listElement.children();
    var pager = $('.pager');

    if (typeof settings.childSelector != "undefined") {
        children = listElement.find(settings.childSelector);
    }

    if (typeof settings.pagerSelector != "undefined") {
        pager = $(settings.pagerSelector);
    }

    var numItems = children.size();
    var numPages = Math.ceil(numItems / perPage);

    pager.data("curr", 0);

    if (settings.showPrevNext) {
        $('<li><a href="#" class="prev_link">�</a></li>').appendTo(pager);
    }

    var curr = 0;
    while (numPages > curr && (settings.hidePageNumbers == false)) {
        $('<li><a href="#" class="page_link">' + (curr + 1) + '</a></li>').appendTo(pager);
        curr++;
    }

    if (settings.showPrevNext) {
        $('<li><a href="#" class="next_link">�</a></li>').appendTo(pager);
    }

    pager.find('.page_link:first').addClass('active');
    pager.find('.prev_link').hide();
    if (numPages <= 1) {
        pager.find('.next_link').hide();
    }
    pager.children().eq(1).addClass("active");

    children.hide();
    children.slice(0, perPage).show();

    pager.find('li .page_link').click(function () {
        var clickedPage = $(this).html().valueOf() - 1;
        goTo(clickedPage, perPage);
        return false;
    });
    pager.find('li .prev_link').click(function () {
        previous();
        return false;
    });
    pager.find('li .next_link').click(function () {
        next();
        return false;
    });

    function previous() {
        var goToPage = parseInt(pager.data("curr")) - 1;
        goTo(goToPage);
    }

    function next() {
        goToPage = parseInt(pager.data("curr")) + 1;
        goTo(goToPage);
    }

    function goTo(page) {
        var startAt = page * perPage,
                endOn = startAt + perPage;

        children.css('display', 'none').slice(startAt, endOn).show();

        if (page >= 1) {
            pager.find('.prev_link').show();
        } else {
            pager.find('.prev_link').hide();
        }

        if (page < (numPages - 1)) {
            pager.find('.next_link').show();
        } else {
            pager.find('.next_link').hide();
        }

        pager.data("curr", page);
        pager.children().removeClass("active");
        pager.children().eq(page + 1).addClass("active");

    }
};



function getCompositeAppAndBPEL() {
    $.ajax({
        url: "/AvonMedicalService/rest/CoreService/serviceassemblies"
    }).then(function (data) {


        if (data && data.serviceUnit) {

            var summary = data.serviceUnit;

            if (!summary.bpel) {

                $.each(summary, function (i, theItem) {

                    totalServiceAssemblies = summary.length;

                    if (document.getElementById("totalServiceAssembliesDiv")) {
                        document.getElementById("totalServiceAssembliesDiv").innerHTML = totalServiceAssemblies;
                    }



                    //alert( "OOI New : " + theItem.bpelId );


                    var props = [
                        'bpel',
                        'serviceAssembly'
                    ];

                    var row = $("<tr></tr>");

                    //var d = document.getElementById("compAppList");
                    //if(d){
                    //    d.innerHTML += '<li id="' +  theItem['serviceAssembly']  + '_li" ><a href="#"><strong>Service Assembly :</strong> <a href="#">' +  theItem['serviceAssembly'] + '</a><br>Status:</strong> <span class="label label-warning">Undeployed</span> <br> <strong>Target :</strong>N/A<br>  <strong>Message Count:</strong>N/A </li>';
                    //  }
                    for (var i = 0; i < props.length; i++)
                    {
                        row.append($("<td>").text(theItem[props[i]]));
                    }

                    row.append($('<td class="center">Server</td>'));

                    $("#bpelProcessSummayTab").append(row);


                    //map[theItem.id] = theItem.bpelId;
                });
            } else {
                totalServiceAssemblies = 1;

                if (document.getElementById("totalServiceAssembliesDiv")) {
                    document.getElementById("totalServiceAssembliesDiv").innerHTML = totalServiceAssemblies;
                }

                var props = [
                    'bpel',
                    'serviceAssembly'
                ];

                var row = $("<tr></tr>");

                //var d = document.getElementById("compAppList");
                // if(d){
                //    d.innerHTML += '<li><a href="#"><strong>Service Assembly :</strong> <a href="#">' +  summary['serviceAssembly'] + '</a><br><strong>Since:</strong> 02/06/2014<br><strong>Status:</strong> <span class="label label-warning">Idle</span> <br>  <strong>Message Count:</strong>' +  parseInt(Math.random() * 50) + '</span> </li>';
                //}
                for (var i = 0; i < props.length; i++)
                {
                    row.append($("<td>").text(summary[props[i]]));
                }


                row.append($('<td class="center">Server</td>'));

                $("#bpelProcessSummayTab").append(row);

                if (document.getElementById("totalBPELProcDiv")) {
                    document.getElementById("totalBPELProcDiv").innerHTML = totalServiceAssemblies + "";
                }

                //map[theItem.id] = theItem.bpelId;
            }

            $('#bpelProcessSummayTabBody').pageMe({
                pagerSelector: '#bpelProcessSummayTabBodyPager',
                showPrevNext: true,
                hidePageNumbers: false,
                perPage: 10
            });
        }
    });
}


function daysBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

function secondsBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_sec = 1000;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_sec);
}



//Function for getting BPEL instances
function getBpelInstancesForBpel(id) {

    document.getElementById("testInstBody").innerHTML = "";
    var ur = "/AvonMedicalService/rest/CoreService/getBPELInstancesWithFilter?bpelId=" + id + "&maxrecord=1000";
    var c = encodeURI(ur);

    $.ajax({
        url: c
    }).then(function (data) {
        var summary = data.bpInstnaceList;
        $('#myModal').modal('hide');
        var statusChecked = 0;
        if (!summary.id) {
            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                //alert( "OOI New : " + theItem.bpelId );

                if (id == theItem.bpelId) {

                    totalForThisBpel++;
                    //alert(totalForThisBpel);


                    var props = [
                        'id',
                        'status',
                        'startTime',
                        'endTime',
                        'lastUpdateTime',
                    ];

                    var date = new Date(theItem.startTime);
                    //alert(date);
                    var todaysDate = new Date();

                    var p = daysBetween(date, todaysDate);
                    // alert("Date differenct from current : " + p);
                    if (p > 10 && statusChecked == 0) {
                        status = "InActive";
                        document.getElementById("messageStatusSpan").innerHTML = "DEAD : Not active since " + p + " days.";
                        document.getElementById("messageStatusSpan").style.backgroundColor = "RED";
                    } else if (statusChecked == 0) {
                        if (p == 0) {
                            document.getElementById("messageStatusSpan").innerHTML = "Excellent : Last received today.";
                        } else {
                            document.getElementById("messageStatusSpan").innerHTML = "Active : Last received in " + p + " days.";
                        }

                        document.getElementById("messageStatusSpan").style.backgroundColor = "Green";
                    }
                    statusChecked = 1;

                    var rowid = theItem.id;
                    var row = $("<tr id='" + rowid + "'></tr>");

                    row.append($("<td>").text(theItem["id"]));
                    row.append($("<td>").text(theItem["status"]));
                    row.append($("<td>").text(theItem["startTime"]));
                    row.append($("<td>").text(theItem["endTime"]));
                    row.append($("<td>").text(theItem["lastUpdateTime"]));

                    $("#testInst").append(row);
                    map[theItem.id] = theItem.bpelId;
                }
            });

            if (document.getElementById("totalBPELNewInstDiv")) {
                document.getElementById("totalBPELNewInstDiv").innerHTML = totalBPELNewInst + "New";
            }

        } else {
            totalBPELInstances = 1;

            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            if (document.getElementById("totalBPELNewInstDiv")) {
                document.getElementById("totalBPELNewInstDiv").innerHTML = totalBPELNewInst + "New";
            }

            tableRowRountInst++;

            //alert( "OOI New : " + theItem.bpelId );

            if (id == summary.bpelId) {

                totalForThisBpel++;
                //alert(totalForThisBpel);


                var props = [
                    'id',
                    'status',
                    'startTime',
                    'endTime',
                    'lastUpdateTime',
                ];

                var date = new Date(summary.startTime);
                //alert(date);
                var todaysDate = new Date();

                var p = daysBetween(date, todaysDate);
                // alert("Date differenct from current : " + p);
                if (p > 10 && statusChecked == 0) {
                    status = "InActive";
                    document.getElementById("messageStatusSpan").innerHTML = "DEAD : Not active since " + p + " days.";
                    document.getElementById("messageStatusSpan").style.backgroundColor = "RED";
                } else if (statusChecked == 0) {
                    if (p == 0) {
                        document.getElementById("messageStatusSpan").innerHTML = "Excellent : Last received today.";
                    } else {
                        document.getElementById("messageStatusSpan").innerHTML = "Active : Last received in " + p + " days.";
                    }

                    document.getElementById("messageStatusSpan").style.backgroundColor = "Green";
                }
                statusChecked = 1;

                var rowid = summary.id;
                var row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td>").text(summary["id"]));
                row.append($("<td>").text(summary["status"]));
                row.append($("<td>").text(summary["startTime"]));
                row.append($("<td>").text(summary["endTime"]));
                row.append($("<td>").text(summary["lastUpdateTime"]));



                $("#testInst").append(row);



                map[summary.id] = summary.bpelId;
            }


        }



        var seqno = 0;
        //Click on testInst table
        ////alert(data.instanceSummary.bpelId);
    });


}



$("#formulaFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getBpelInstances();
    }
});

$("#deleteProductTxt").bind('keypress', function (e) {
    if (e.which == 13) {
        if (confirm('Are you sure you want to delete this product from database?')) {
            deleteProduct();
        } else {
            // Do nothing!
        }

    }
});



$("#batchNoFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getBpelInstances();
    }
});

$("#companyFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getBpelInstances();
    }
});

$("#productNameFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {
        getBpelInstances();
    }
});

$("#searchProductTop").bind('keypress', function (e) {
    if (e.which == 13) {
        var statusFilterTxtValue2 = document.getElementById("searchProductTop");
        var statusFilterTxtValue = document.getElementById("productNameFilterTxt");
        if (statusFilterTxtValue) {
            statusFilterTxtValue.value = statusFilterTxtValue2.value;
        }
        getBpelInstances();
    }
});

$("#addQuantityForBillingTxt").bind('keypress', function (e) {
    if (e.which == 13) {
        addProductForBilling();
    }
});

$("#additionalDicount").bind('keyup', function (e) {
    //if (e.which == 13) {
    try {
        var totalAmount = document.getElementById('amountTotalForFill').innerHTML;
        var additionalDiscount = document.getElementById("additionalDicount").value;

        if (additionalDiscount !== "") {
            var totalAmountFinal = totalAmount - parseFloat(additionalDiscount).toFixed(2);
        }

        var gA = parseFloat(totalAmountFinal).toFixed(2);
        document.getElementById("amountTotalForFillWithDiscount").innerHTML = gA;
    } catch (err) {

    }
    //}
});

$("#mrpAddTxt").bind('keyup', function (e) {

    try {
        var totalAmount = document.getElementById('mrpAddTxt').value;
        var packing = document.getElementById("packingAddTxt").value;

        if (packing.indexOf(" ") !== -1) {
            var c = totalAmount / packing.substring(0, packing.indexOf(" "));

            document.getElementById("amountAddTxt").value = c.toFixed(2);
        } else {
            var c = totalAmount / packing;
            document.getElementById("amountAddTxt").value = c.toFixed(2);
        }

    } catch (err) {

    }

});

$("#addQuantityForBillingTxt").bind('keypress', function (e) {
    if (e.which == 13) {
        addProductForBilling();
    }
});

$("#custNameFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getCustomerInstances();
    }
});

$("#custMobileFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getCustomerInstances();
    }
});


$("#productIdForUpdate").bind('keypress', function (e) {
    if (e.which == 13) {

        fetchData();
    }
});






var productIdsForBilling = [];
var quantityListForBilling = [];
var amountPerUnitListForBilling = [];
var amountTotalListForBilling = [];
var cgstArr = [];
var sgstArr = [];
var billInit = 0;
var deleteId = -1;

function addProductForBilling() {

    var row;
    var rowid = updatingProductId;
    var productName = updatingProductName;

    orderGenerated = 0;
    var quantity = document.getElementById("quantityAddTxt").value;
    var amountPerUnit = document.getElementById("amountAddTxt").value;
    var cgstPrice;
    var sgstPrice;
    var igstPrice;
    var productDiscountPrice;
    if (document.getElementById("cgstAddTxt")) {
        var v = document.getElementById("cgstAddTxt").value;

        if (v.indexOf("%") > 0) {
            cgstPrice = v.substring(0, v.indexOf("%"));

        }
        var v2 = document.getElementById("sgstAddTxt").value;

        if (v2.indexOf("%") > 0) {
            sgstPrice = v.substring(0, v2.indexOf("%"));

        }
        var v3 = document.getElementById("igstAddTxt").value;

        if (v3.indexOf("%") > 0) {
            igstPrice = v3.substring(0, v3.indexOf("%"));

        }
    }

    if (document.getElementById("discountAddTxt")) {
        var v4 = document.getElementById("discountAddTxt").value;
        if (v4.indexOf("%") > 0) {
            productDiscountPrice = v4.substring(0, v4.indexOf("%"));

        }
    }


    //sgst = document.getElementById("vatForProduct").innerHTML;

    //var quantityInShop = document.getElementById("quantity").innerHTML;



    if (isNaN(quantity)) {
        alert("Invalid input, please type a valid number(0..9)!");
        return;
    }

    if (parseFloat(quantity).toFixed(2) === 0.00 || isNaN(quantity) || isNaN(amountPerUnit)) {
        if (parseFloat(quantity).toFixed(2) === 0.00) {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Quantity can not be zero!</b>";
        } else if (isNaN(quantity)) {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Quantity entered is not a valid number!</b>";
        } else if (isNaN(amountPerUnit)) {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Amount Per Unit is not a valid number!</b>";
        }


        $("#myMessageTrackingWindow").animate({
            backgroundColor: "red"
        }, 200, function () {

            $("#myMessageTrackingWindow").animate({
                backgroundColor: "white"
            }, 200, function () {

                $("#myMessageTrackingWindow").animate({
                    backgroundColor: "red"
                }, 200, function () {

                    $("#myMessageTrackingWindow").animate({
                        backgroundColor: "white"
                    }, 200, function () {
                    });

                });

            });

        });
        alert("Product quantity not available in stock !! " + " Available quantity = " + quantityInShop + ", Order quantity = " + quantity);
        return;
    }

//    if ((quantityInShop - quantity) < 0) {
//        document.getElementById("errorInQuantitySpn").innerHTML = "<b>Product quantity not available in stock !! " + " Available quantity = " + quantityInShop + ", Order quantity = " + quantity + "</b>";
//
//
//        $("#myMessageTrackingWindow").animate({
//            backgroundColor: "red"
//        }, 200, function () {
//
//            $("#myMessageTrackingWindow").animate({
//                backgroundColor: "white"
//            }, 200, function () {
//
//                $("#myMessageTrackingWindow").animate({
//                    backgroundColor: "red"
//                }, 200, function () {
//
//                    $("#myMessageTrackingWindow").animate({
//                        backgroundColor: "white"
//                    }, 200, function () {
//                    });
//
//                });
//
//            });
//
//        });
//        //alert("Product quantity not available in stock !! " + " Available quantity = " +  quantityInShop + ", Order quantity = " + quantity);
//        return;
//    }

    deleteId++;
    row = $("<tr id='billingrow_" + deleteId + "'></tr>");
    //row.append($("<td id='billing_" +rowid + "_productName" + "'>").text(productName));		
    row.append($("<td id='billing_" + deleteId + "" + "'>").html("<button class='btn btn-danger' id='delete_" + deleteId + "' onclick='deleteProductFromSales(this)'> Delete </button>"));
    row.append($("<td id='billing_" + rowid + "_productName" + "'>").text(productName));
    row.append($("<td id='billing_" + rowid + "_quantity" + "'>").text(quantity));
    row.append($("<td id='billing_" + rowid + "_amount" + "'>").text(amountPerUnit));
    row.append($("<td id='billing_" + rowid + "_cgst" + "'>").text(cgstPrice));
    row.append($("<td id='billing_" + rowid + "_sgst" + "'>").text(sgstPrice));

    var i1 = parseFloat(amountPerUnit).toFixed(2);
    cgst = parseFloat(cgstPrice).toFixed(2);
    sgst = parseFloat(sgstPrice).toFixed(2);
    var igst;
    if (igst != "") {
        igst = parseFloat(igstPrice).toFixed(2);
    } else {
        igst = 0.0;
    }

    var pd;
    if (pd != "") {
        pd = parseFloat(productDiscountPrice).toFixed(2);
    } else {
        pd = 0.0;
    }

    var totalTempam = 0.0;

    try {
        totalTempam = (parseFloat(amountPerUnit) * parseFloat(quantity)).toFixed(2);

    } catch (error) {
        totalTempam = 0.0;
        alert("Problem while calculating total.. cancelling the billing");
    }


    //var ti = ((totalTempam * cgst) / 100) + ((totalTempam * sgst) / 100) + ((totalTempam * igst) / 100) + totalTempam;
    var ti = parseFloat(totalTempam);

    row.append($("<td id='billing_" + rowid + "_total" + "'>").text(ti.toFixed(2)));
    if ($("<td id='billing_" + rowid + "_total" + "'>").text === "NaN") {
        alert("Problem while calculating total.. cancelling the billing");
    }
    /*if (billInit != 0) {
     productIdsForBilling = productIdsForBilling + "," + rowid;
     quantityListForBilling = quantityListForBilling + "," + quantity;
     amountTotalListForBilling = amountTotalListForBilling + "," + ti;
     amountPerUnitListForBilling = amountPerUnitListForBilling + "," + amountPerUnit;
     cgstArr = cgstArr + "," + gstPrice;
     sgstArr = sgstArr + "," + gstPrice;;
     } else {
     productIdsForBilling = rowid;
     quantityListForBilling = quantity;
     amountTotalListForBilling = ti;
     amountPerUnitListForBilling = amountPerUnit;
     cgstArr =  gstPrice;
     sgstArr = gstPrice;
     billInit = 1;
     }*/
    productIdsForBilling.push(rowid);
    quantityListForBilling.push(quantity);
    amountTotalListForBilling.push(ti);
    amountPerUnitListForBilling.push(amountPerUnit);
    cgstArr.push(cgstPrice);
    sgstArr.push(sgstPrice);

    $("#tableForOrder").append(row);

    document.getElementById("spnCartCount").innerHTML = "#" + productIdsForBilling.length;
    $('#myMessageTrackingWindow').modal('hide');

    document.getElementById("salesDivSummary").style.backgroundColor = "#FFC237";
    document.getElementById("btnGenerateBill").style.visibility = "visible";

    totalProductForBill++;

    //totalPriceForBill = totalPriceForBill + (parseFloat(amountPerUnit) * parseFloat(quantity));
    totalPriceForBill = totalPriceForBill + ti;


}

function deleteProductFromSales(btn) {

    var index = btn.id.substring(btn.id.indexOf("delete_") + 7);
    //alert(productIdsForBilling);

    var i1 = parseFloat(amountPerUnitListForBilling[index]);
    //cgstT = parseFloat(cgstArr[index]);
    //sgstT = parseFloat(sgstArr[index]);

    var totalTempam = (amountPerUnitListForBilling[index] * parseFloat(quantityListForBilling[index]));

    //var ti = ((totalTempam * cgstT) / 100) + ((totalTempam * sgstT) / 100) + totalTempam;

    totalPriceForBill = totalPriceForBill - totalTempam;

    productIdsForBilling.splice(index, 1);
    quantityListForBilling.splice(index, 1);
    amountTotalListForBilling.splice(index, 1);
    amountPerUnitListForBilling.splice(index, 1);
    cgstArr.splice(index, 1);
    sgstArr.splice(index, 1);

    document.getElementById("spnCartCount").innerHTML = "#" + productIdsForBilling.length;

    document.getElementById("billingrow_" + index + "").style.display = "none";

}

function print_specific_div_content()
{
    if (orderGenerated === 0) {
        var custName = document.getElementById("custNameForBillingTxt").value;
        var custMobile = document.getElementById("custNameMobileNumberTxt").value;
        var custAddress = document.getElementById("tdCustAddressTxt").value;

        var totalAmount = document.getElementById('amountTotalForFill').innerHTML;

        var billNo = document.getElementById('billNo').innerHTML;
        var billDate = document.getElementById("billDate").innerHTML;
        var urlString = "/AvonMedicalService/rest/CoreService/addPurchaseOrderDetail?";

        urlString += "&customerName=" + custName;
        urlString += "&customerMobileNumber=" + custMobile;
        urlString += "&custAddress=" + custAddress;
        urlString += "&billNo=" + billNo;
        urlString += "&billDate=" + billDate;
        urlString += "&totalAmount=" + totalAmount;
        urlString += "&productIds=" + productIdsForBilling;
        urlString += "&quantityPurchased=" + quantityListForBilling;
        urlString += "&amount=" + amountTotalListForBilling;
        urlString += "&cgst=" + cgstArr;
        urlString += "&sgst=" + sgstArr;
        urlString += "&amountPerUnit=" + amountPerUnitListForBilling;

        urlString = encodeURI(urlString);

        $.ajax({
            url: urlString
        }).then(function (data) {
            if (data == "true") {
                orderGenerated = 1;
                alert("Purchase order generated successfully...");
                window.open("/AvonMedicalService/purchaseOrderPrinting.html?billNo=" + billNo);
                $('#myMessageTrackingWindow').modal('hide');
                window.location.reload();
                isSearchedProduct = 0;
            } else {
                orderGenerated = 1;
                isSearchedProduct = 0;
                alert("Purchase order generated successfully..Page will be refereshed automatically after you close this window");
                $('#myMessageTrackingWindow').modal('hide');
                isSearchedProduct = 0;
                window.open("/AvonMedicalService/purchaseOrderPrinting.html?billNo=" + billNo);
                window.location.reload();
            }
        });


        if (document.getElementById("tdCustName")) {
            document.getElementById("tdCustName").innerHTML = document.getElementById("custNameForBillingTxt").value;
        }

        if (document.getElementById("btnGenerateFinalBill")) {
            document.getElementById("btnGenerateFinalBill").style.display = "none";
        }

        if (document.getElementById("btnGenerateFinalBill2")) {
            document.getElementById("btnGenerateFinalBill2").style.display = "none";
        }

        document.getElementById("billFooter").style.visibility = "visible";
        //document.getElementById("custNameForBillingTxt").style.display = 'none';
        document.getElementById("tdCustMobile").innerHTML = document.getElementById("custNameMobileNumberTxt").value;
        //document.getElementById("custNameMobileNumberTxt").style.display = 'none';

        var content = '<html>\n<link href="css/bootstrap-responsive.css" rel="stylesheet">\n        <link href="css/charisma-app.css" rel="stylesheet">\n        <linkhref="css/jquery-ui-1.8.21.custom.css" rel="stylesheet">\n        <link href="css/fullcalendar.css" rel="stylesheet"> \n       <link href="css/fullcalendar.print.css"rel="stylesheet"  media="print"> \n       <link href="css/chosen.css" rel="stylesheet">    \n    <link href="css/uniform.default.css" rel="stylesheet">   \n     <link href="cs/colorbox.css" rel="stylesheet"> \n       <link href="css/jquery.cleditor.css" rel="stylesheet">  \n      <link href="css/jquery.noty.css" rel="stylesheet">  \n      <link href=css/noty_theme_default.css" rel="stylesheet">   \n     <link href="css/elfinder.min.css" rel="stylesheet">   \n     <link href="css/elfinder.theme.css" rel="stylesheet">   \n     <link href="css/jquery.iphone.toggle.css" rel="stylesheet">    \n    <link href="css/opa-icons.css" rel="stylesheet"> \n       <link href="css/uploadify.css" rel"stylesheet">   \n     <link href="css/style.css" rel="stylesheet">\n<body>';
        content += document.getElementById("billingDivMainTopFinalBill").innerHTML;
        content += "</body>";
        content += "</html>";


        //var printWin = window.open('', '', 'left=0,top=0,width=1000,height=500,toolbar=0,scrollbars=0,status =0');

        //printWin.document.write(content);
//printWin.document.close();
//printWin.focus();
//printWin.print();
//printWin.close();
    } else {
        alert("Sales entry can not be done. Please try again!");
        //window.location.reload();
    }

}

function generateBill() {
    var rowid = "finalTotal";
    if (document.getElementById("addQuantityForBillingTxt")) {
        document.getElementById("addQuantityForBillingTxt").value = "";
    }

    if (document.getElementById("btnGenerateFinalBill")) {
        document.getElementById("btnGenerateFinalBill").style.display = "block";
    }

    if (document.getElementById("btnGenerateFinalBill2")) {
        document.getElementById("btnGenerateFinalBill2").style.display = "block";
    }

    document.getElementById("billFooter").style.visibility = "hidden";

    finalBilling = 1;
    $('#myMessageTrackingWindow').modal('show');

    /*
     //document.getElementById('tabActivityListAsGraphBody').innerHTML=""; 
     
     trid = $(this).attr('id'); // table row ID 
     
     trid = trid.substring(0,trid.lastIndexOf("_"));
     
     
     $('#myMessageTrackingWindow').modal('show');	   
     $('#bpelID').text( trid );   
     
     
     
     document.getElementById("bpelName").innerHTML = document.getElementById(trid + "_productName").innerHTML;
     
     document.getElementById("quantity").innerHTML = document.getElementById(trid + "_quantityInShop").innerHTML;
     
     document.getElementById("amountPerUnit").innerHTML = document.getElementById(trid + "_amountPerUnit").innerHTML;
     
     
     document.getElementById("addQuantityForBillingTxt").focus();
     
     var r= map[trid]; 	  */


    var thediv = document.getElementById('myMessageTrackingWindow');

    thediv.style.visibility = "visible";


    //thediv.animate({ height: "200px" });

    if (document.getElementById("billingDivMainTop")) {
        document.getElementById("billingDivMainTop").style.display = "none";
    }



    document.getElementById("billingDivMainTopFinalBill").style.visibility = "visible";

    document.getElementById("tableForFinalOrder").innerHTML = document.getElementById("tableForOrder").innerHTML;

    //alert(totalProductForBill);

    document.getElementById('productForBill').innerHTML = totalProductForBill;

    document.getElementById('amountTotalForFill').innerHTML = totalPriceForBill;
    document.getElementById('amountTotalForFill2').innerHTML = totalPriceForBill;
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];

    var id = components.join("");

    document.getElementById('billNo').innerHTML = id;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    document.getElementById("billDate").innerHTML = today;

//document.getElementById('billDate').innerHTML = new Date();




}





var bpelIdsortorder = "ASC";
var instanceIdsortorder = "ASC";
var statussortorder = "ASC";
var startTimesortorder = "DESC";
var endtimesortorder = "ASC";

var totalProductForBill = 0;
var totalPriceForBill = 0;

$('#testInst th').click(function () {
    var id = $(this).attr('id'); // table row ID 
    var sortVar = id.substr(id.lastIndexOf("_") + 1);
    if (document.activeElement.id) {
        //Stop executing this sorting function when focus is in text field
    } else {

        document.getElementById("STARTTIME_sortimg").style.visibility = 'hidden';
        document.getElementById("BPELID_sortimg").style.visibility = 'hidden';
        document.getElementById("INSTANCEID_sortimg").style.visibility = 'hidden';
        document.getElementById("STATUS_sortimg").style.visibility = 'hidden';
        document.getElementById("STARTTIME_sortimg").style.visibility = 'hidden';
        document.getElementById("ENDTIME_sortimg").style.visibility = 'hidden';
        document.getElementById(sortVar + "_sortimg").style.visibility = 'visible';

        if (sortVar == 'STARTTIME') {
            if (startTimesortorder == "DESC") {
                startTimesortorder = "ASC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortUp.png";
            } else if (startTimesortorder == "ASC") {
                startTimesortorder = "DESC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortDown.png";
            }
            getBpelInstances(sortVar, startTimesortorder);
        }

        if (sortVar == 'BPELID') {
            if (bpelIdsortorder == "DESC") {
                bpelIdsortorder = "ASC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortUp.png";
            } else if (bpelIdsortorder == "ASC") {
                bpelIdsortorder = "DESC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortDown.png";
            }
            getBpelInstances(sortVar, bpelIdsortorder);
        }

        if (sortVar == 'INSTANCEID') {
            if (instanceIdsortorder == "DESC") {
                instanceIdsortorder = "ASC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortUp.png";
            } else if (instanceIdsortorder == "ASC") {
                instanceIdsortorder = "DESC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortDown.png";
            }
            getBpelInstances(sortVar, instanceIdsortorder);
        }

        if (sortVar == 'STATUS') {
            if (statussortorder == "DESC") {
                statussortorder = "ASC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortUp.png";
            } else if (statussortorder == "ASC") {
                statussortorder = "DESC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortDown.png";
            }
            getBpelInstances(sortVar, statussortorder);
        }

        if (sortVar == 'ENDTIME') {
            if (endtimesortorder == "DESC") {
                endtimesortorder = "ASC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortUp.png";
            } else if (endtimesortorder == "ASC") {
                endtimesortorder = "DESC";
                document.getElementById(sortVar + "_sortimg").src = "img/sortDown.png";
            }
            getBpelInstances(sortVar, endtimesortorder);
        }



    }





});

function confirmedUpdate(updatePurchase) {

    var i = 0;

    var urlString = "/AvonMedicalService/rest/CoreService/updateProductDetail?";

    if (document.getElementById("packingAddTxt").value === "") {

        swal({title: "Valiation Error", text: "'Packing' should only be number(0..9 digits)!"}, function () {
            document.getElementById("packingAddTxt").style.backgroundColor = "red";
            document.getElementById("packingAddTxt").focus();

        });
        return;

    } else {
        document.getElementById("packingAddTxt").style.backgroundColor = "white";
        if (document.getElementById("packingAddTxt").value === "") {
            document.getElementById("packingAddTxt").value = "1";
        }
    }

    if (!allnumeric(document.getElementById("quantityAddTxt"))) {

        swal({title: "Valiation Error", text: "'Quantity' should only be number(0..9 digits)!"}, function () {
            document.getElementById("quantityAddTxt").style.backgroundColor = "red";
            document.getElementById("quantityAddTxt").focus();
            return;
        });

        return;
    } else {
        document.getElementById("quantityAddTxt").style.backgroundColor = "white";
    }

    if (document.getElementById("freeAddTxt").value !== "" && (!allnumeric(document.getElementById("freeAddTxt")))) {
        swal({title: "Valiation Error", text: "'Free' should only be number(0..9 digits)!"}, function () {
            document.getElementById("freeAddTxt").style.backgroundColor = "red";
            document.getElementById("freeAddTxt").focus();
            return;
        });
        return;
    } else {
        document.getElementById("freeAddTxt").style.backgroundColor = "white";
        if (document.getElementById("freeAddTxt").value === "") {
            document.getElementById("freeAddTxt").value = "0";
        }
    }

    if (!allnumeric(document.getElementById("mrpAddTxt"))) {
        swal({title: "Valiation Error", text: "'MRP' should only be number(0..9 digits)!"}, function () {
            document.getElementById("mrpAddTxt").style.backgroundColor = "red";
            document.getElementById("mrpAddTxt").focus();
            return;
        });
        return;

    } else {
        document.getElementById("mrpAddTxt").style.backgroundColor = "white";
    }
    var mrpt = document.getElementById("mrpAddTxt").value;
    var packingt = document.getElementById("packingAddTxt").value;

    document.getElementById("amountAddTxt").value = (parseFloat(mrpt) / parseFloat(packingt)).toFixed(2);

//    if (document.getElementById("cgstAddTxt").value !== "" && !allnumeric(document.getElementById("cgstAddTxt"))) {
//        alert("'CGST' should only be number(0..9 digits)!");
//        document.getElementById("cgstAddTxt").style.backgroundColor = "red";
//        document.getElementById("cgstAddTxt").focus();
//        return;
//    } else {
//        document.getElementById("cgstAddTxt").style.backgroundColor = "white";
//        if (document.getElementById("cgstAddTxt").value === "") {
//            document.getElementById("cgstAddTxt").value = "0";
//        }
//        document.getElementById("cgstAddTxt").value = "" + document.getElementById("cgstAddTxt").value + "%";
//    }
//
//    if (document.getElementById("sgstAddTxt").value !== "" && !allnumeric(document.getElementById("sgstAddTxt"))) {
//        alert("'SGST' should only be number(0..9 digits)!");
//        document.getElementById("sgstAddTxt").style.backgroundColor = "red";
//        document.getElementById("sgstAddTxt").focus();
//        return;
//    } else {
//        document.getElementById("sgstAddTxt").style.backgroundColor = "white";
//        if (document.getElementById("sgstAddTxt").value === "") {
//            document.getElementById("sgstAddTxt").value = "0";
//        }
//        document.getElementById("sgstAddTxt").value = "" + document.getElementById("sgstAddTxt").value + "%";
//    }

    if (document.getElementById("discountAddTxt").value !== "" && !allnumeric(document.getElementById("discountAddTxt"))) {
        swal({title: "Valiation Error", text: "'Discount' should only be number(0..9 digits)!"}, function () {
            document.getElementById("discountAddTxt").style.backgroundColor = "red";
            document.getElementById("discountAddTxt").focus();
            return;
        });
        return;
    } else {
        document.getElementById("discountAddTxt").style.backgroundColor = "white";
        if (document.getElementById("discountAddTxt").value === "") {
            document.getElementById("discountAddTxt").value = "0";
        }
    }

    var productIdForUpdateValue = document.getElementById("productIdForUpdate");

    if (productIdForUpdateValue) {
        if ($.trim(productIdForUpdateValue.value) !== "") {
            urlString += "&productId=" + productIdForUpdateValue.value;
        }
        //productIdForUpdateValue.value = "";
    } else {
        if (updatingProductId === 0) {
            alert("Invalid product update command!! No product selected to update");

            swal({title: "Valiation Error", text: "Invalid product update command!! No product selected to update"}, function () {
                //return;
            });

            return;
        } else {
            urlString += "&productId=" + updatingProductId;
        }
    }

    var statusFilterTxtValue = document.getElementById("productNameAddTxt");
    if (statusFilterTxtValue) {
        if ($.trim(statusFilterTxtValue.value) != "") {
            urlString += "&productName=" + statusFilterTxtValue.value;
            i++;
        }
        //statusFilterTxtValue.value = "";
    }

    var bpelFilterTxtValue = document.getElementById("companyAddTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&company=" + bpelFilterTxtValue.value;
        }
        //bpelFilterTxtValue.value = "";
    }

    var formulaAddTxtValue = document.getElementById("formulaAddTxt");
    if (formulaAddTxtValue) {
        if ($.trim(formulaAddTxtValue.value) != "") {
            urlString += "&formula=" + formulaAddTxtValue.value;
        }
        //formulaAddTxtValue.value = "";
    }

    var batchNoAddTxtValue = document.getElementById("batchNoAddTxt");
    if (batchNoAddTxtValue) {
        if ($.trim(batchNoAddTxtValue.value) != "") {
            urlString += "&batchNo=" + batchNoAddTxtValue.value;
        }
        //batchNoAddTxtValue.value = "";
    }

    /*var ManDateAddTxtValue = document.getElementById("ManDateAddTxt");
     if (ManDateAddTxtValue) {
     if ($.trim(ManDateAddTxtValue.value) != "") {
     urlString += "&manfactureDate=" + ManDateAddTxtValue.value;
     }
     ManDateAddTxtValue.value = "";
     }*/


    var ExpiryDateAddTxtValue = document.getElementById("ExpiryDateAddTxt");
    if (ExpiryDateAddTxtValue) {
        if ($.trim(ExpiryDateAddTxtValue.value) != "") {
            urlString += "&expiryDate=" + ExpiryDateAddTxtValue.value;
        }
        //ExpiryDateAddTxtValue.value = "";
    }

    var quantityAddTxtValue = document.getElementById("quantityAddTxt");
    if (quantityAddTxtValue) {
        if ($.trim(quantityAddTxtValue.value) != "") {
            urlString += "&quantity=" + quantityAddTxtValue.value;
        }
        //quantityAddTxtValue.value = "";
    }

    var amountAddTxtValue = document.getElementById("amountAddTxt");
    if (amountAddTxtValue) {
        if ($.trim(amountAddTxtValue.value) != "") {
            urlString += "&amount=" + amountAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }

    var disNameAddTxtValue = document.getElementById("disNameAddTxt");
    if (disNameAddTxtValue) {
        if ($.trim(disNameAddTxtValue.value) != "") {
            urlString += "&disName=" + disNameAddTxtValue.value;
        }
        //disNameAddTxtValue.value = "";
    }

    var disNoAddTxtValue = document.getElementById("disNoAddTxt");
    if (disNoAddTxtValue) {
        if ($.trim(disNoAddTxtValue.value) != "") {
            urlString += "&disNo=" + disNoAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }
    var discountAddTxtValue = document.getElementById("discountAddTxt");
    if (discountAddTxtValue) {
        if ($.trim(discountAddTxtValue.value) != "") {
            urlString += "&discount=" + discountAddTxtValue.value;
        }
        //discountAddTxtValue.value = "";
    }
//    var cgstAddTxtValue = document.getElementById("cgstAddTxt");
//    if (cgstAddTxtValue) {
//        if ($.trim(cgstAddTxtValue.value) != "") {
//            urlString += "&cgst=" + cgstAddTxtValue.value.substring(0, cgstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //cgstAddTxtValue.value = "";
//    }
//    var sgstAddTxtValue = document.getElementById("sgstAddTxt");
//    if (sgstAddTxtValue) {
//        if ($.trim(sgstAddTxtValue.value) != "") {
//            urlString += "&sgst=" + sgstAddTxtValue.value.substring(0, sgstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //sgstAddTxtValue.value = "";
//    }
//    var igstAddTxtValue = document.getElementById("igstAddTxt");
//    if (igstAddTxtValue) {
//        if ($.trim(igstAddTxtValue.value) != "") {
//            urlString += "&igst=" + igstAddTxtValue.value.substring(0, igstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //igstAddTxtValue.value = "";
//    }
    var mrpAddTxtValue = document.getElementById("mrpAddTxt");
    if (mrpAddTxtValue) {
        if ($.trim(mrpAddTxtValue.value) != "") {
            urlString += "&mrp=" + mrpAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }
    var freeAddTxtValue = document.getElementById("freeAddTxt");
    if (freeAddTxtValue) {
        if ($.trim(freeAddTxtValue.value) != "") {
            urlString += "&free=" + freeAddTxtValue.value;
        }
        //mrpAddTxtValue.value = "";
    }
    var packingAddTxtValue = document.getElementById("packingAddTxt");
    if (packingAddTxtValue) {
        if ($.trim(packingAddTxtValue.value) != "") {
            urlString += "&packing=" + packingAddTxtValue.value;
        }
        //packingAddTxtValue.value = "";
    }

    var dateAddTxtValue = document.getElementById("dateAddTxt");
    if (dateAddTxtValue) {
        if ($.trim(dateAddTxtValue.value) != "") {
            urlString += "&date=" + dateAddTxtValue.value;
        }
        //dateAddTxtValue.value = "";
    }

    var scheduleAddTxt = document.getElementById("scheduleAddTxt");
    if (scheduleAddTxt) {
        if ($.trim(scheduleAddTxt.value) != "") {
            urlString += "&schedule=" + scheduleAddTxt.value;
        }
        scheduleAddTxt.value = "";
    }

    var prateAddTxt = document.getElementById("prateAddTxt");
    if (prateAddTxt) {
        if ($.trim(prateAddTxt.value) !== "") {
            urlString += "&pRate=" + prateAddTxt.value;
        }
        prateAddTxt.value = "";
    }

    var marginTxt = document.getElementById("marginTxt");
    if (marginTxt) {
        if ($.trim(marginTxt.value) !== "") {
            urlString += "&margin=" + marginTxt.value;
        }
        //prateAddTxt.value = "";
    }

    var taxesAddTxt = document.getElementById("taxesAddTxt");
    if (taxesAddTxt) {
        if ($.trim(taxesAddTxt.value) !== "") {
            var taxes = taxesAddTxt.value;

            if (taxes !== '0') {
                var i = parseInt(taxes);
                var f = parseFloat(i / 2);
                urlString += "&cgst=" + f;
                urlString += "&sgst=" + f;
                //urlString += "&igst=" + i;
            } else {
                urlString += "&cgst=0";
                urlString += "&sgst=0";
            }
            //urlString += "&taxes=" + prateAddTxt.value;
        }
        //prateAddTxt.value = "";
    }

    urlString += "&updatePurchase=" + updatePurchase;
    
    

    if (i > 0) {
        var urlStringFinal = encodeURI(urlString);
        $.ajax({
            url: urlStringFinal
        }).then(function (data) {
            swal({title: "Success", text: "Product detail updated successfully."}, function () {
                $('#myMessageTrackingWindow').modal('hide');
                addProductForBilling();
            });
        });
    } else {
        swal({title: "Error", text: "No data to upate!!"}, function () {
            $('#myMessageTrackingWindow').modal('hide');
            addProductForBilling();
        });
    }

}

function updateProduct() {

    swal({
        title: "Want to update purchase details too?",
        text: "If you choose yes, the entry in purchase report will also be modified with these updated values.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, update in purchase report!",
        cancelButtonText: "No, just update product entry!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
            function (isConfirm) {
                if (isConfirm) {
                    confirmedUpdate(1);
                } else {
                    confirmedUpdate(0);
                }
            });
}

function allnumeric(inputtxt)
{
    //var numbers = /^[0-9]+$/;  
    var numbers = "[+-]?([0-9]*[.])?[0-9]+";
    if (inputtxt && inputtxt.value.match(numbers))
    {
        return true;
    } else
    {
        return false;
    }
}

function addProduct() {


    var urlString = "/AvonMedicalService/rest/CoreService/addProductDetail?";


    //if (document.getElementById("packingAddTxt").value !== "" && (!allnumeric(document.getElementById("packingAddTxt")))) {
    if (document.getElementById("packingAddTxt").value === "") {
        alert("'Packing' should only be number(0..9 digits)!");
        document.getElementById("packingAddTxt").style.backgroundColor = "red";
        document.getElementById("packingAddTxt").focus();
        return;
    } else {
        document.getElementById("packingAddTxt").style.backgroundColor = "white";
        if (document.getElementById("packingAddTxt").value === "") {
            document.getElementById("packingAddTxt").value = "1";
        }
    }

    if (!allnumeric(document.getElementById("quantityAddTxt"))) {
        alert("'Quantity' should only be number(0..9 digits)!");
        document.getElementById("quantityAddTxt").style.backgroundColor = "red";
        document.getElementById("quantityAddTxt").focus();
        return;
    } else {
        document.getElementById("quantityAddTxt").style.backgroundColor = "white";
    }

    if (document.getElementById("freeAddTxt").value !== "" && (!allnumeric(document.getElementById("freeAddTxt")))) {
        alert("'Free' should only be number(0..9 digits)!");
        document.getElementById("freeAddTxt").style.backgroundColor = "red";
        document.getElementById("freeAddTxt").focus();
        return;
    } else {
        document.getElementById("freeAddTxt").style.backgroundColor = "white";
        if (document.getElementById("freeAddTxt").value === "") {
            document.getElementById("freeAddTxt").value = "0";
        }
    }

    if (!allnumeric(document.getElementById("mrpAddTxt"))) {
        alert("'MRP' should only be number(0..9 digits)!");
        document.getElementById("mrpAddTxt").style.backgroundColor = "red";
        document.getElementById("mrpAddTxt").focus();
        return;
    } else {
        document.getElementById("mrpAddTxt").style.backgroundColor = "white";
    }
    var mrpt = document.getElementById("mrpAddTxt").value;
    var packingt = document.getElementById("packingAddTxt").value;

    document.getElementById("amountAddTxt").value = (parseFloat(mrpt) / parseFloat(packingt)).toFixed(2);

//    if (document.getElementById("cgstAddTxt").value !== "" && !allnumeric(document.getElementById("cgstAddTxt"))) {
//        alert("'CGST' should only be number(0..9 digits)!");
//        document.getElementById("cgstAddTxt").style.backgroundColor = "red";
//        document.getElementById("cgstAddTxt").focus();
//        return;
//    } else {
//        document.getElementById("cgstAddTxt").style.backgroundColor = "white";
//        if (document.getElementById("cgstAddTxt").value === "") {
//            document.getElementById("cgstAddTxt").value = "0";
//        }
//        document.getElementById("cgstAddTxt").value = "" + document.getElementById("cgstAddTxt").value + "%";
//    }
//
//    if (document.getElementById("sgstAddTxt").value !== "" && !allnumeric(document.getElementById("sgstAddTxt"))) {
//        alert("'SGST' should only be number(0..9 digits)!");
//        document.getElementById("sgstAddTxt").style.backgroundColor = "red";
//        document.getElementById("sgstAddTxt").focus();
//        return;
//    } else {
//        document.getElementById("sgstAddTxt").style.backgroundColor = "white";
//        if (document.getElementById("sgstAddTxt").value === "") {
//            document.getElementById("sgstAddTxt").value = "0";
//        }
//        document.getElementById("sgstAddTxt").value = "" + document.getElementById("sgstAddTxt").value + "%";
//    }

    if (document.getElementById("discountAddTxt").value !== "" && !allnumeric(document.getElementById("discountAddTxt"))) {
        alert("'Discount' should only be number(0..9 digits)!");
        document.getElementById("discountAddTxt").style.backgroundColor = "red";
        document.getElementById("discountAddTxt").focus();
        return;
    } else {
        document.getElementById("discountAddTxt").style.backgroundColor = "white";
        if (document.getElementById("discountAddTxt").value === "") {
            document.getElementById("discountAddTxt").value = "0";
        }
    }

    var statusFilterTxtValue = document.getElementById("productNameAddTxt");
    if (statusFilterTxtValue) {
        if ($.trim(statusFilterTxtValue.value) != "") {
            urlString += "&productName=" + statusFilterTxtValue.value;
        }
        //statusFilterTxtValue.value = "";
    }

    var bpelFilterTxtValue = document.getElementById("companyAddTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&company=" + bpelFilterTxtValue.value;
        }
        //bpelFilterTxtValue.value = "";
    }

    var formulaAddTxtValue = document.getElementById("formulaAddTxt");
    if (formulaAddTxtValue) {
        if ($.trim(formulaAddTxtValue.value) != "") {
            urlString += "&formula=" + formulaAddTxtValue.value;
        }
        //formulaAddTxtValue.value = "";
    }

    var batchNoAddTxtValue = document.getElementById("batchNoAddTxt");
    if (batchNoAddTxtValue) {
        if ($.trim(batchNoAddTxtValue.value) != "") {
            urlString += "&batchNo=" + batchNoAddTxtValue.value;
        }
        //batchNoAddTxtValue.value = "";
    }

    /*var ManDateAddTxtValue = document.getElementById("ManDateAddTxt");
     if (ManDateAddTxtValue) {
     if ($.trim(ManDateAddTxtValue.value) != "") {
     urlString += "&manfactureDate=" + ManDateAddTxtValue.value;
     }
     ManDateAddTxtValue.value = "";
     }*/


    var ExpiryDateAddTxtValue = document.getElementById("ExpiryDateAddTxt");
    if (ExpiryDateAddTxtValue) {
        if ($.trim(ExpiryDateAddTxtValue.value) != "") {
            urlString += "&expiryDate=" + ExpiryDateAddTxtValue.value;
        }
        //ExpiryDateAddTxtValue.value = "";
    }

    var quantityAddTxtValue = document.getElementById("quantityAddTxt");
    if (quantityAddTxtValue) {
        if ($.trim(quantityAddTxtValue.value) != "") {
            urlString += "&quantity=" + quantityAddTxtValue.value;
        }
        //quantityAddTxtValue.value = "";
    }

    var amountAddTxtValue = document.getElementById("amountAddTxt");
    if (amountAddTxtValue) {
        if ($.trim(amountAddTxtValue.value) != "") {
            urlString += "&amount=" + amountAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }

    var disNameAddTxtValue = document.getElementById("disNameAddTxt");
    if (disNameAddTxtValue) {
        if ($.trim(disNameAddTxtValue.value) != "") {
            urlString += "&disName=" + disNameAddTxtValue.value;
        }
        //disNameAddTxtValue.value = "";
    }

    var disNoAddTxtValue = document.getElementById("disNoAddTxt");
    if (disNoAddTxtValue) {
        if ($.trim(disNoAddTxtValue.value) != "") {
            urlString += "&disNo=" + disNoAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }
    var discountAddTxtValue = document.getElementById("discountAddTxt");
    if (discountAddTxtValue) {
        if ($.trim(discountAddTxtValue.value) != "") {
            urlString += "&discount=" + discountAddTxtValue.value;
        }
        //discountAddTxtValue.value = "";
    }
//    var cgstAddTxtValue = document.getElementById("cgstAddTxt");
//    if (cgstAddTxtValue) {
//        if ($.trim(cgstAddTxtValue.value) != "") {
//            urlString += "&cgst=" + cgstAddTxtValue.value.substring(0, cgstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //cgstAddTxtValue.value = "";
//    }
//    var sgstAddTxtValue = document.getElementById("sgstAddTxt");
//    if (sgstAddTxtValue) {
//        if ($.trim(sgstAddTxtValue.value) != "") {
//            urlString += "&sgst=" + sgstAddTxtValue.value.substring(0, sgstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //sgstAddTxtValue.value = "";
//    }
//    var igstAddTxtValue = document.getElementById("igstAddTxt");
//    if (igstAddTxtValue) {
//        if ($.trim(igstAddTxtValue.value) != "") {
//            urlString += "&igst=" + igstAddTxtValue.value.substring(0, igstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        //igstAddTxtValue.value = "";
//    }
    var mrpAddTxtValue = document.getElementById("mrpAddTxt");
    if (mrpAddTxtValue) {
        if ($.trim(mrpAddTxtValue.value) != "") {
            urlString += "&mrp=" + mrpAddTxtValue.value;
        }
        //amountAddTxtValue.value = "";
    }
    var freeAddTxtValue = document.getElementById("freeAddTxt");
    if (freeAddTxtValue) {
        if ($.trim(freeAddTxtValue.value) != "") {
            urlString += "&free=" + freeAddTxtValue.value;
        }
        //mrpAddTxtValue.value = "";
    }
    var packingAddTxtValue = document.getElementById("packingAddTxt");
    if (packingAddTxtValue) {
        if ($.trim(packingAddTxtValue.value) != "") {
            urlString += "&packing=" + packingAddTxtValue.value;
        }
        //packingAddTxtValue.value = "";
    }

    var dateAddTxtValue = document.getElementById("dateAddTxt");
    if (dateAddTxtValue) {
        if ($.trim(dateAddTxtValue.value) != "") {
            urlString += "&date=" + dateAddTxtValue.value;
        }
        //dateAddTxtValue.value = "";
    }

    var scheduleAddTxt = document.getElementById("scheduleAddTxt");
    if (scheduleAddTxt) {
        if ($.trim(scheduleAddTxt.value) != "") {
            urlString += "&schedule=" + scheduleAddTxt.value;
        }
        scheduleAddTxt.value = "";
    }

    var prateAddTxt = document.getElementById("prateAddTxt");
    if (prateAddTxt) {
        if ($.trim(prateAddTxt.value) !== "") {
            urlString += "&pRate=" + prateAddTxt.value;
        }
        prateAddTxt.value = "";
    }

    var marginTxt = document.getElementById("marginTxt" + idSuffix);
    if (marginTxt) {
        if ($.trim(marginTxt.value) !== "") {
            urlString += "&margin=" + marginTxt.value;
        }
        //prateAddTxt.value = "";
    }

    var taxesAddTxt = document.getElementById("taxesAddTxt" + idSuffix);
    if (taxesAddTxt) {
        if ($.trim(taxesAddTxt.value) !== "") {
            var taxes = taxesAddTxt.value;

            if (taxes !== '0') {
                var i = parseInt(taxes);
                var f = parseFloat(i / 2);
                urlString += "&cgst=" + f;
                urlString += "&sgst=" + f;
                //urlString += "&igst=" + i;
            } else {
                urlString += "&cgst=0";
                urlString += "&sgst=0";
            }
            //urlString += "&taxes=" + prateAddTxt.value;
        }
        //prateAddTxt.value = "";
    }

    var urlStringFinal = encodeURI(urlString);
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        //alert("Product detail inserted successfully as new product entry.");

        swal({title: "Success", text: "Product detail inserted successfully as new product entry."}, function () {
            $('#myMessageTrackingWindow').modal('hide');
            //addProductForBilling();
        });
    });
}




function getCustomerInstances(sortField, sortOrder) {
    if (document.getElementById("testInstCustBody")) {
        document.getElementById("testInstCustBody").innerHTML = "";

    }

    if (document.getElementById("tabBpelVariableListBody")) {
        document.getElementById("tabBpelVariableListBody").innerHTML = "";

    }




    var urlString = "/AvonMedicalService/rest/CoreService/getCustomerBillingDetail?";

    var statusFilterTxtValue = document.getElementById("custNameFilterTxt");
    if (statusFilterTxtValue) {
        if ($.trim(statusFilterTxtValue.value) != "") {
            urlString += "&custNameFilter=" + statusFilterTxtValue.value;
        }
        statusFilterTxtValue.value = "";
    }

    var bpelFilterTxtValue = document.getElementById("custMobileFilterTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&custMobileFilter=" + bpelFilterTxtValue.value;
        }
        bpelFilterTxtValue.value = "";
    }


    var urlStringFinal = encodeURI(urlString);

    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        //alert(data);
        if (data) {
            var summary = data;


            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                //alert( "OOI New : " + theItem.bpelId );





                var rowid = theItem.billNo;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='" + rowid + "_custName" + "'>").text(theItem["custName"]));
                row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["cusMobile"]));
                row.append($("<td id='" + rowid + "_billNo" + "'>").text(theItem["billNo"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["billDate"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["totalAmountPaid"]));

                $("#testInstCust").append(row);



                //map[theItem.id] = theItem.bpelId;


            });

            $('#testInstCust').DataTable();

            $('#myModal').modal('hide');

            //}	



            var seqno = 0;
            //Click on testInst table


            $('#testInstCust').on('click', 'td', function () {



                document.getElementById('tabBpelVariableListBody').innerHTML = "";



                trid = $(this).attr('id'); // table row ID 

                trid = trid.substring(0, trid.lastIndexOf("_"));


                $('#bpelID').text(trid);
                document.getElementById('saleidspan').innerHTML = " , For sale id : " + trid;

                var r = map[trid];

                var popup_height = document.getElementById('popup').offsetHeight;
                var popup_width = document.getElementById('popup').offsetWidth;
                $(".popup").css('top', (($(window).height() - popup_height) / 2));
                $(".popup").css('left', (($(window).width() - popup_width) / 2));

                tabActivityListTableRowRountInst = 0;
                tabActivityListPageNumber = 0;
                seqno = 0;

                var urlString = "/AvonMedicalService/rest/CoreService/getBillingDetailWithProducts?";
                urlString += "&billNo=" + trid;

                $("#tabBpelVariableListBody").innerHTML = "";

                var urlStringFinal = encodeURI(urlString);
                $.ajax({
                    url: urlStringFinal
                }).then(function (data) {
                    //alert(data);
                    if (data) {

                        var summary = data;


                        totalBPELInstances = summary.length;
                        if (document.getElementById("totalBPELInstDiv")) {
                            document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
                        }
                        $.each(summary, function (i, theItem) {

                            tableRowRountInst++;

                            var rowid = theItem.billNo;
                            var row;
                            row = $("<tr id='" + rowid + "'></tr>");

                            row.append($("<td id='" + rowid + "productName" + "'>").text(theItem["productName"]));
                            row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                            row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["quantityPurchased"]));
                            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["amount"]));

                            $("#tabBpelVariableListBody").append(row);


                        });

                    }
                });
                var target = "#tabBpelVariableList";
                if (topSet == 0) {
                    topSet = $(target).offset().top - 4;
                }


                $('html, body').animate({
                    scrollTop: topSet
                }, 2000);

            });





            if (document.getElementById("divPopupTableView")) {
                $('#myModal').modal('hide');
            }

        } else {
            $('#myModal').modal('hide');
        }

    });


}



function getSalesData() {
    if (document.getElementById("salesDataPTableBody")) {
        document.getElementById("salesDataPTableBody").innerHTML = "";

    }

    if (document.getElementById("salesDataTableBody")) {
        document.getElementById("salesDataTableBody").innerHTML = "";

    }




    var urlString = "/AvonMedicalService/rest/CoreService/getSalesData";

    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        if (data) {
            var summary = data;

            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var rowid = theItem.billNo;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["billDate"]));
                row.append($("<td id='" + rowid + "_productId" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_sq" + "'>").text(theItem["sq"]));
                row.append($("<td id='" + rowid + "_sa" + "'>").text(theItem["sa"]));


                $("#salesDataPTableBody").append(row);



            });

            $('#salesDataPTable').DataTable();

            $('#myModal').modal('hide');



        } else {
            $('#myModal').modal('hide');
        }

    });


    var urlString = "/AvonMedicalService/rest/CoreService/getSalesDataPerDay";

    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        if (data) {
            var summary = data;

            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var rowid = theItem.billNo;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='11" + rowid + "_billDate" + "'>").text(theItem["billDate"]));

                row.append($("<td id='11" + rowid + "_sq" + "'>").text(theItem["sq"]));
                row.append($("<td id='11" + rowid + "_sa" + "'>").text(theItem["sa"]));


                $("#salesDataTableBody").append(row);



            });

            $('#testTable').DataTable();

            $('#myModal').modal('hide');

        } else {
            $('#myModal').modal('hide');
        }

    });


}



function refreshBill() {

    document.getElementById("salesDivSummary").style.backgroundColor = "#323030";
    document.getElementById("billingDivMainTop").style.display = "block";
    document.getElementById("tdCustName").innerHTML = "<input type = 'text' id='custNameForBillingTxt' style = 'width:200px;height:20px'  />";
    document.getElementById("tdCustMobile").innerHTML = "<input type = 'text' id='custNameMobileNumberTxt' style = 'width:200px;height:20px'  />";
    totalPriceForBill = 0;
    document.getElementById("billingDivMainTopFinalBill").style.visibility = "hidden";
    document.getElementById("tableForOrder").innerHTML = "<thead><tr><th align='left'>Name </th>                                <th align='left'>Quantity </th>                                <th align='left'>Amount</th>														                            </tr>                        </thead>                        <tbody id='bpelInstSummayTabBody'>                        </tbody>";
    totalProductForBill = 0;
    document.getElementById('amountTotalForFill').innerHTML = 0;
    document.getElementById('amountTotalForFill2').innerHTML = 0;
    document.getElementById('billNo').innerHTML = "";


    document.getElementById("btnGenerateFinalBill").style.display = "block";
    document.getElementById("btnGenerateFinalBill2").style.display = "block";
    document.getElementById("billFooter").style.visibility = "hidden";
    document.getElementById("billDate").innerHTML = "";
    document.getElementById("custNameForBillingTxt").value = "";
    document.getElementById("custNameMobileNumberTxt").value = "";

    productIdsForBilling = "";
    billInit = 0;
    quantityListForBilling = "";
    amountPerUnitListForBilling = "";
    document.getElementById("btnGenerateBill").style.visibility = "hidden";

}

//Function for getting BPEL instances

function deleteProduct() {

    $('#myModal').modal('show');

    var urlString = "/AvonMedicalService/rest/CoreService/deleteProductDetail?";

    var bpelFilterTxtValue = document.getElementById("deleteProductTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&productId=" + bpelFilterTxtValue.value;
            filterset = 1;
        }
        //bpelFilterTxtValue.value = "";
    }

    var urlStringFinal = encodeURI(urlString);
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {

        $('#myModal').modal('hide');
        alert("Request for deletion sent to server.. server responded if delete status : " + data);
    });

    bpelFilterTxtValue.value = "";

    //deleteProductDetail
}
var productDetailDT;

function getBpelInstances(sortField, sortOrder) {
    var filterset = 0;
    tableRowRountInst = 0;
    isSearchedProduct = 0;

    $('#myModal').modal('show');

    if (productDetailDT) {
        productDetailDT.destroy();
    }

    if (document.getElementById("bpelInstSummayTabBody3")) {
        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
    }
    if (document.getElementById("bpelProcessSummayTabBodyPager2")) {
        document.getElementById("bpelProcessSummayTabBodyPager2").innerHTML = "";

    }

    var urlString = "/AvonMedicalService/rest/CoreService/getProductDetail?";

    var expDateFiltertxtValue = document.getElementById("expDateFiltertxt");
    if (expDateFiltertxtValue) {
        if ($.trim(expDateFiltertxtValue.value) != "") {
            urlString += "&expireDate=" + expDateFiltertxtValue.value;
            filterset = 1;
        }
        //expDateFiltertxtValue.value = "";
    }

    var statusFilterTxtValue = document.getElementById("productNameFilterTxt");
    if (statusFilterTxtValue) {
        if ($.trim(statusFilterTxtValue.value) != "") {
            urlString += "&productName=" + statusFilterTxtValue.value;
            filterset = 1;
        }
        //statusFilterTxtValue.value = "";
    }

    var bpelFilterTxtValue = document.getElementById("companyFilterTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&company=" + bpelFilterTxtValue.value;
            filterset = 1;
        }
        //bpelFilterTxtValue.value = "";
    }

    var instanceFilterTxtValue = document.getElementById("formulaFilterTxt");
    if (instanceFilterTxtValue) {
        if ($.trim(instanceFilterTxtValue.value) != "") {
            urlString += "&formula=" + instanceFilterTxtValue.value;
            filterset = 1;
        }
        //instanceFilterTxtValue.value = "";
    }

    var batchNoFilterTxtValue = document.getElementById("batchNoFilterTxt");
    if (batchNoFilterTxtValue) {
        if ($.trim(batchNoFilterTxtValue.value) != "") {
            urlString += "&batchNo=" + batchNoFilterTxtValue.value;
            filterset = 1;
        }
        //batchNoFilterTxtValue.value = "";
    }

    if (sortField) {
        if (sortOrder) {
            urlString += "&sortColumn=" + sortField + "&sortFilter=" + sortOrder;
        } else {
            urlString += "&sortColumn=" + sortField;
        }
    }
    if (filterset == 0) {
        alert("Full databse search is not allowed, Becuase of UI performance, Please add atleast one filter criteria!!");
        $('#myModal').modal('hide');
        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
        var table = $('#testInst').DataTable();
        table.destroy();
        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
        return;
    }

    var urlStringFinal = encodeURI(urlString);
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        //alert(data);
        if (data) {
            document.getElementById("expDateFiltertxt").value = '';
            document.getElementById("demo").classList.remove('in');
            document.getElementById("demo").style.height = '0px';
            var summary = data;
            isSearchedProduct = 1;
            currentTab = 0;

            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;
                isSearchedProduct = 1;

                var props = [
                    'productName',
                    'productId',
                    'company',
                    'formula',
                    'batchNo',
                    'manufactureDate',
                    'expireDate',
                    'quantityInShop',
                    'amountPerUnit',
                    'packing',
                    'free',
                    'mrp',
                    'vat',
                    'discount',
                    'distributerName',
                    'distributerNumber',
                    'date'
                ];


                var rowid = theItem.productId;
                var row;

                var q = theItem["quantityInShop"];
                var pac = theItem["packing"];
                var q2;
                if (pac !== "") {
                    q2 = parseFloat(q) * parseFloat(pac);
                } else {
                    q2 = parseFloat(q);
                }


                if (q2 > 50) {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                } else if (q2 > 20) {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                } else {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                }



                row.append($("<td id='" + rowid + "_action" + "'>").html("<button class='btn btn-primary'>Action</button>"));
                row.append($("<td id='" + rowid + "_date" + "'>").text(theItem["date"]));
                row.append($("<td id='" + rowid + "_productName" + "'>").text(theItem["productName"]));
                row.append($("<td id='" + rowid + "_packing" + "'>").text(theItem["packing"]));
                row.append($("<td id='" + rowid + "_quantityInShop" + "'>").text(parseFloat(theItem["quantityInShop"]).toFixed(2)));
                if (theItem["free"] === '') {
                    theItem["free"] = '0';
                    row.append($("<td id='" + rowid + "_free" + "'>").text(parseFloat(theItem["free"]).toFixed(2)));
                } else {
                    row.append($("<td id='" + rowid + "_free" + "'>").text(parseFloat(theItem["free"]).toFixed(2)));
                }
                row.append($("<td id='" + rowid + "_batchNo" + "'>").text(theItem["batchNo"]));
                row.append($("<td id='" + rowid + "_expireDate" + "'>").text(theItem["expireDate"]));
                row.append($("<td id='" + rowid + "_mrp" + "'>").text(parseFloat(theItem["mrp"]).toFixed(2)));

                if (theItem["purchaseRate"] !== null && theItem["purchaseRate"] !== '') {
                    row.append($("<td id='" + rowid + "_purchaseRate" + "'>").text(parseFloat(theItem["purchaseRate"]).toFixed(2)));
                } else {
                    row.append($("<td id='" + rowid + "_purchaseRate" + "'>").text('---'));
                }

                if (theItem["margin"] !== null && theItem["margin"] !== '') {
                    row.append($("<td id='" + rowid + "_margin" + "'>").text(parseFloat(theItem["margin"]).toFixed(4)));
                } else {
                    row.append($("<td id='" + rowid + "_margin" + "'>").text('---'));
                }

//                if (theItem["packing"].indexOf(" ") !== -1) {
//                    var c = theItem["mrp"] / theItem["packing"].substring(0, theItem["packing"].indexOf(" "));
//                    row.append($("<td id='" + rowid + "_amountPerUnit" + "'>").text(c.toFixed(2)));
//                } else {
//                    //
//
//                    var str = theItem["packing"];
//                    var finalStr = "";
//                    var unitStr = "";
//                    for (var i = 0; i < str.length; i++) {
//
//                        if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
//                            finalStr = finalStr + str[i];
//                        } else if (str.charCodeAt(i) === 46) {
//                            finalStr = finalStr + str[i];
//                        } else if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
//                            unitStr = unitStr + str[i];
//                        } else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
//                            unitStr = unitStr + str[i];
//                        }
//
//                    }
//
//                    var packing = parseFloat(finalStr);
//                    var c = theItem["mrp"] / packing;
//                    row.append($("<td id='" + rowid + "_amountPerUnit" + "'>").text(c.toFixed(2)));
//                }


//                if (theItem["cgst"] === null || !parseFloat(theItem["cgst"])) {
//                    row.append($("<td id='" + rowid + "_cgst" + "'>").text("0%"));
//                } else {
//                    row.append($("<td id='" + rowid + "_cgst" + "'>").text(theItem["cgst"] + "%"));
//                }
//                if (theItem["sgst"] === null || !parseFloat(theItem["sgst"])) {
//                    row.append($("<td id='" + rowid + "_sgst" + "'>").text("0%"));
//                } else {
//                    row.append($("<td id='" + rowid + "_sgst" + "'>").text(theItem["sgst"] + "%"));
//                }
//                if (theItem["igst"] === null || !parseFloat(theItem["igst"])) {
//                    row.append($("<td id='" + rowid + "_igst" + "'>").text("0%"));
//                } else {
//                    row.append($("<td id='" + rowid + "_igst" + "'>").text(theItem["igst"] + "%"));
//                }

                if (theItem["drugSchedule"] === '' || theItem["drugSchedule"] === null || theItem["drugSchedule"] === 'null') {
                    row.append($("<td id='" + rowid + "_drugSchedule" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_drugSchedule" + "'>").text(theItem["drugSchedule"]));
                }


                if (!parseFloat(theItem["discount"])) {
                    row.append($("<td id='" + rowid + "_productDiscount" + "'>").text("0%"));
                } else {
                    row.append($("<td id='" + rowid + "_productDiscount" + "'>").text(theItem["discount"] + "%"));
                }
                /*if( theItem["free"] === "" || theItem["free"] === null) {
                 theItem["free"] = 0;
                 }*/
                //row.append($("<td id='" + rowid + "_discount" + "'>").text(theItem["discount"]));
//                if (theItem["total"] === "null" || theItem["total"] === null) {
//                    //row.append($("<td id='" + rowid + "_total" + "'>").text("0")); //**
//
//                    if (theItem["packing"].indexOf(" ") !== -1) {
//                        var a = theItem["packing"].substring(0, theItem["packing"].indexOf(" ")) * theItem["quantityInShop"];
//                        //var c = ( a * theItem["quantityInShop"] ) + theItem["free"]; 
//                        if (theItem["free"] !== null || theItem["free"] !== "") {
//                            a = a + (theItem["free"] * theItem["packing"].substring(0, theItem["packing"].indexOf(" ")));
//                        }
//                        row.append($("<td id='" + rowid + "_total" + "'>").text(a));
//                    } else {
//                        var a = theItem["packing"] * theItem["quantityInShop"];
//                        if (theItem["free"] !== null || theItem["free"] !== "") {
//                            a = a + (theItem["free"] * theItem["packing"]);
//                        }
//                        //var c = theItem["packing"] * theItem["quantityInShop"] + theItem["free"];
//                        row.append($("<td id='" + rowid + "_total" + "'>").text(a));
//                    }
//
//                } else {
//                    row.append($("<td id='" + rowid + "_total" + "'>").text(theItem["total"])); //**
//                }
                var free1 = 0.0;
                var quantity1 = parseFloat(theItem["quantityInShop"]);
                if (theItem["free"] !== null || theItem["free"] !== "") {
                    free1 = parseFloat(theItem["free"]);
                }
                if (isNaN(quantity1)) {
                    quantity1 = 0.0;
                }
                var finalTotal = free1 + quantity1;
                row.append($("<td id='" + rowid + "_total" + "'>").text(finalTotal.toFixed(2)));
                //row.append($("<td id='" + rowid + "_company" + "'>").text(theItem["company"]));

                if (theItem["company"] === '' || theItem["company"] === null) {
                    row.append($("<td id='" + rowid + "_company" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_company" + "'>").text(theItem["company"]));
                }

                if (theItem["distributerName"] === '' || theItem["distributerName"] === null) {
                    row.append($("<td id='" + rowid + "_distributerName" + "'>").text('---'));
                } else {
                    row.append($("<td id='" + rowid + "_distributerName" + "'>").text(theItem["distributerName"]));
                }

                if (theItem["distributerNumber"] === '' || theItem["distributerNumber"] === null) {
                    row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text('---'));
                } else {
                    row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text(theItem["distributerNumber"]));
                }

                //row.append($("<td id='" + rowid + "_distributerName" + "'>").text(theItem["distributerName"]));
                //row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text(theItem["distributerNumber"]));
                $("#testInst").append(row);
            });

            $('#myModal').modal('hide');

            productDetailDT = $('#testInst').DataTable({
                "lengthMenu": [[100, 150, 200, "All"], [100, 150, 200, "All"]]
            });

            var seqno = 0;
            //Click on testInst table
            $('#testInst').on('click', 'td', function () {




                if (document.getElementById("billingDivMainTop")) {
                    document.getElementById("billingDivMainTop").style.display = "block";
                    document.getElementById("billingDivMainTop").style.visibility = "visible";
                }

                if (document.getElementById("billingDivMainTopFinalBill")) {
                    document.getElementById("billingDivMainTopFinalBill").style.visibility = "hidden";
                }

                if (document.getElementById("addQuantityForBillingTxt")) {
                    document.getElementById("addQuantityForBillingTxt").value = "";
                }
                finalBilling = 0;
                currentTab = 2;

                trid = $(this).attr('id'); // table row ID 
                trid = trid.substring(0, trid.lastIndexOf("_"));

                $('#myMessageTrackingWindow').modal('show');

                fetchData(trid);

                updatingProductId = trid;

                try {
                    document.getElementById("modalHeader").style.backgroundColor = '#ffffff';
                    $('#bpelID').text(trid);

                    var packing;
                    if (document.getElementById(trid + "_packing").innerHTML.indexOf(" ") > 0) {
                        packing = document.getElementById(trid + "_packing").innerHTML.substring
                                (0, document.getElementById(trid + "_packing").innerHTML.indexOf(" "));
                    } else {
                        packing = document.getElementById(trid + "_packing").innerHTML;
                    }

                    var str = document.getElementById(trid + "_packing").innerHTML;
                    var finalStr = "";
                    var unitStr = "";
                    for (var i = 0; i < str.length; i++) {

                        if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
                            finalStr = finalStr + str[i];
                        } else if (str.charCodeAt(i) === 46) {
                            finalStr = finalStr + str[i];
                        } else if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
                            unitStr = unitStr + str[i];
                        } else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
                            unitStr = unitStr + str[i];
                        }

                    }

                    packing = parseFloat(finalStr);

                    var free = 0;

                    try {
                        if (document.getElementById(trid + "_free").innerHTML.indexOf(" ") !== -1) {
                            free = document.getElementById(trid + "_free").innerHTML.substring(0, document.getElementById(trid + "_free").innerHTML.indexOf(" "));
                        } else {
                            free = document.getElementById(trid + "_free").innerHTML;
                        }
                    } catch (err) {

                    }
                    free = parseFloat(free);
                    if (isNaN(free)) {
                        free = 0;
                    }

                    document.getElementById("bpelName").innerHTML = document.getElementById(trid + "_productName").innerHTML;



                    //document.getElementById("quantity").innerHTML = parseFloat((document.getElementById(trid + "_quantityInShop").innerHTML)) * (packing + free);
                    if (!isNaN(packing)) {
                        if (unitStr === 'TAB'
                                || unitStr === 'TA'
                                || unitStr === 'T'
                                || unitStr === 'CAP'
                                || unitStr === 'CAPSURLE'
                                || unitStr === 'CAPS'
                                || unitStr === 'CAPSU'
                                || unitStr === 'CAPSULE'
                                || unitStr === 'CA'
                                || unitStr === 'CPSULE'
                                || unitStr === 'PCI'
                                || unitStr === 'PIC'
                                || unitStr === 'PC'
                                ) {

                            var a1 = parseFloat(document.getElementById(trid + "_quantityInShop").innerHTML);
                            var a2 = parseFloat(free);
                            var a3 = a1 + a2;
                            document.getElementById("quantity").innerHTML = parseFloat(a3 * packing).toFixed(1);

                        } else {

                            var a1 = parseFloat(document.getElementById(trid + "_quantityInShop").innerHTML);
                            var a2 = parseFloat(free);
                            var a3 = a1 + a2;
                            document.getElementById("quantity").innerHTML = parseFloat(a3).toFixed(1);

                        }
                    } else {
                        var a1 = parseFloat(document.getElementById(trid + "_quantityInShop").innerHTML);
                        var a2 = parseFloat(free);
                        var a3 = a1 + a2;
                        document.getElementById("quantity").innerHTML = parseFloat(a3).toFixed(1);
                    }

                    document.getElementById("packingInfo").innerHTML = " Packing Size : " + document.getElementById(trid + "_packing").innerHTML;

                    if (document.getElementById(trid + "_purchaseRate")) {
                        document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_purchaseRate").innerHTML;
                    }

                    //document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_amountPerUnit").innerHTML;
                    document.getElementById("errorInQuantitySpn").innerHTML = "";

                    //var a = document.getElementById(trid + "_amountPerUnit").innerHTML;

                    var v = document.getElementById(trid + "_cgst").innerHTML;

                    if (v.indexOf("%") > 0) {
                        v = v.substring(0, v.indexOf("%"));

                    }
                    var defaultdiscount = parseFloat(document.getElementById(trid + "_productDiscount").innerHTML);



                    //if (isNaN(parseFloat(a)) ){
                    var mrp1 = document.getElementById(trid + "_mrp").innerHTML;
                    if (unitStr === 'TAB'
                            || unitStr === 'TA'
                            || unitStr === 'T'
                            || unitStr === 'CAP'
                            || unitStr === 'CAPSURLE'
                            || unitStr === 'CAPS'
                            || unitStr === 'CAPSU'
                            || unitStr === 'CAPSULE'
                            || unitStr === 'CA'
                            || unitStr === 'CPSULE'
                            || unitStr === 'PCI'
                            || unitStr === 'PIC'
                            || unitStr === 'PC'
                            ) {
                        document.getElementById("amountPerUnit").value = mrp1 / packing;
                        if (!isNaN(defaultdiscount) && defaultdiscount !== 0) {
                            document.getElementById("amountPerUnit").value = parseFloat(mrp1 / packing).toFixed(2) - parseFloat(parseFloat(defaultdiscount * mrp1) / 100)
                                    .toFixed(2);
                        } else {
                            document.getElementById("amountPerUnit").value = parseFloat(mrp1 / packing).toFixed(2);
                        }
                    } else {
                        document.getElementById("amountPerUnit").value = mrp1;
                        if (!isNaN(defaultdiscount) && defaultdiscount !== 0) {
                            document.getElementById("amountPerUnit").value = mrp1 - parseFloat(parseFloat(defaultdiscount * mrp1) / 100).toFixed(2);
                        } else {
                            document.getElementById("amountPerUnit").value = parseFloat(mrp1).toFixed(2);
                        }
                    }
                    //} else{
                    //  document.getElementById("amountPerUnit").value = (parseFloat(a));
                    //}
                    if (document.getElementById(trid + "_rate")) {
                        document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_rate").innerHTML;
                    }
                    document.getElementById("mrpForProduct").innerHTML = document.getElementById(trid + "_mrp").innerHTML;
                    document.getElementById("cgstForProduct").innerHTML = document.getElementById(trid + "_cgst").innerHTML;
                    document.getElementById("sgstForProduct").innerHTML = document.getElementById(trid + "_sgst").innerHTML;
                    document.getElementById("igstForProduct").innerHTML = document.getElementById(trid + "_igst").innerHTML;
                    document.getElementById("productDiscount").innerHTML = document.getElementById(trid + "_productDiscount").innerHTML;

                    //document.getElementById("expForProduct").innerHTML = document.getElementById(trid + "_expireDate").innerHTML;

                    document.getElementById("addQuantityForBillingTxt").focus();

                    var r = map[trid];

                    var thediv = document.getElementById('myMessageTrackingWindow');

                    thediv.style.visibility = "visible";




                    $("#divPopupTableView").animate({
                        width: "100%"
                    }, 500, function () {
                    });




                    //thediv.animate({ height: "200px" });


                    tabActivityListTableRowRountInst = 0;
                    tabActivityListPageNumber = 0;
                    seqno = 0;

                } catch (err) {

                }






            });


            if (document.getElementById("divPopupTableView")) {
                $('#myModal').modal('hide');
            }



        } else {
            $('#myModal').modal('hide');
        }

    });


}



function fetchData(productId) {

    var urlString = "/AvonMedicalService/rest/CoreService/getProductDetail?";


    urlString += "&productId=" + productId;


    var urlStringFinal = encodeURI(urlString);

    $.ajax({
        url: urlStringFinal
    }).then(function (data) {

        if (data) {
            var summary = data;
            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var props = [
                    'productName',
                    'productId',
                    'company',
                    'formula',
                    'batchNo',
                    'manufactureDate',
                    'expireDate',
                    'quantityInShop',
                    'amountPerUnit',
                    'packing',
                    'free',
                    'mrp',
                    'vat',
                    'discount',
                    'distributerName',
                    'distributerNumber',
                    'date'
                ];


                var rowid = theItem.productId;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                //$("productNameAddTxt").value(theItem["productName"]));
                document.getElementById("productNameAddTxt").value = theItem["productName"];
                document.getElementById("packingAddTxt").value = theItem["packing"];
                document.getElementById("quantityAddTxt").value = parseFloat(theItem["quantityInShop"]).toFixed(1);
                document.getElementById("freeAddTxt").value = theItem["free"];
                document.getElementById("batchNoAddTxt").value = theItem["batchNo"];
                document.getElementById("ExpiryDateAddTxt").value = theItem["expireDate"];
                document.getElementById("mrpAddTxt").value = theItem["mrp"];
                var packing = theItem["packing"];
                if (theItem["packing"].indexOf(" ") !== -1) {
                    var c = theItem["mrp"] / theItem["packing"].substring(0, theItem["packing"].indexOf(" "));
                    document.getElementById("amountAddTxt").value = c.toFixed(2);
                } else {
                    var str = theItem["packing"];
                    var finalStr = "";
                    var unitStr = "";
                    for (var i = 0; i < str.length; i++) {
                        if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
                            finalStr = finalStr + str[i];
                        } else if (str.charCodeAt(i) === 46) {
                            finalStr = finalStr + str[i];
                        } else if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
                            unitStr = unitStr + str[i];
                        } else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
                            unitStr = unitStr + str[i];
                        }
                    }

                    packing = parseFloat(finalStr);

                    var c = theItem["mrp"] / packing;
                    document.getElementById("amountAddTxt").value = c.toFixed(2);
                }



//                document.getElementById("cgstAddTxt").value = theItem["cgst"] + "";
//                document.getElementById("sgstAddTxt").value = theItemdocument.getElementById("cgstAddTxt").value["sgst"] + "";
//                document.getElementById("igstAddTxt").value = theItem["igst"] + "";

                document.getElementById("scheduleAddTxt").value = theItem["drugSchedule"] + "";
                document.getElementById("discountAddTxt").value = theItem["discount"];
                document.getElementById("companyAddTxt").value = theItem["company"];
                document.getElementById("formulaAddTxt").value = theItem["formula"];
                document.getElementById("disNameAddTxt").value = theItem["distributerName"];
                document.getElementById("disNoAddTxt").value = theItem["distributerNumber"];

            });




        } else {
            $('#myModal').modal('hide');
        }

    });



}



var ibpv = 0;
var sbpv;
var previdbpv;
function showVariableValue(a) {


    if (!previdbpv && previdbpv == null) {
        sbpv = document.getElementById(a.id + "_td").innerHTML;
        previdbpv = a.id;
    } else {
        document.getElementById(previdbpv + "_td").innerHTML = sbpv;
    }
    if (ibpv == 0) {
        a.innerHTML = "HIDE VARIABLE VALUE";
        document.getElementById(a.id + "_td").innerHTML += "<br /> <hr color='black'/>  <textarea rows='10' cols='150'>" + bpelIdAndVariableValue[a.id] + "</textarea> <hr color='black'/>";
        ibpv = 1;

    } else {
        ibpv = 0;
        previdbpv = null;
    }

}

function login() {

    if (document.getElementById("username").value === "admin" &&
            document.getElementById("password").value === "avonadmin") {
        document.getElementById("myForm").submit();
    } else {

        $("#ddd1").animate({
            backgroundColor: "red"
        }, 200, function () {

            $("#ddd1").animate({
                backgroundColor: "white"
            }, 200, function () {

                $("#ddd1").animate({
                    backgroundColor: "red"
                }, 200, function () {

                    $("#ddd1").animate({
                        backgroundColor: "white"
                    }, 200, function () {
                    });

                });

            });

        });

        document.getElementById("loginDivAlert").className = "alert alert-block";
        document.getElementById("loginDivAlert").innerHTML = "Login Failed!! Please try again with correct username and password..."
    }
}
/*
 $("#mrpAddTxt").bind('keyup', function (e) {
 
 try {
 var totalAmount = document.getElementById('mrpAddTxt').value;
 var packing = document.getElementById("packingAddTxt").value;
 
 if (packing.indexOf(" ") !== -1) {
 var c = totalAmount / packing.substring(0, packing.indexOf(" "));
 
 document.getElementById("amountAddTxt").value = c.toFixed(2);
 } else {
 var c = totalAmount / packing;
 document.getElementById("amountAddTxt").value = c.toFixed(2);
 }
 
 } catch (err) {
 
 }
 
 });
 
 */


//$(".myMrpListenerParam").bind('keyup', function (e) {
function keychangemrp(id) {
    var idr = id.id;
    var rown = '';
    //var unitStr
    try {
        if (idr.indexOf('_') > 0) {
            rown = idr.substring(idr.indexOf('_'));
        }
    } catch (err) {
        alert(err);
    }
    //alert(rown);
    try {
        var totalAmount = document.getElementById("mrpAddTxt" + rown).value;
        var packing = document.getElementById("packingAddTxt" + rown).value;

        if (totalAmount === "" || totalAmount === "0") {
            return;
        }

        if (packing.indexOf(" ") !== -1) {
            var str = packing
            var finalStr = "";
            var unitStr = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
                    finalStr = finalStr + str[i];
                } else if (str.charCodeAt(i) === 46) {
                    finalStr = finalStr + str[i];
                } else if (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) {
                    unitStr = unitStr + str[i];
                } else if (str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
                    unitStr = unitStr + str[i];
                }

            }

            var c = "";

            if (unitStr === 'TAB'
                    || unitStr === 'TA'
                    || unitStr === 'T'
                    || unitStr === 'CAP'
                    || unitStr === 'CAPSURLE'
                    || unitStr === 'CAPS'
                    || unitStr === 'CAPSU'
                    || unitStr === 'CAPSULE'
                    || unitStr === 'CA'
                    || unitStr === 'CPSULE'
                    || unitStr === 'PCI'
                    || unitStr === 'PIC'
                    || unitStr === 'PC'
                    ) {
                var t1 = parseFloat(totalAmount);
                c = t1 / parseFloat(packing.substring(0, packing.indexOf(" ")));
            } else {
                c = totalAmount;
            }

            document.getElementById("amountAddTxt" + rown).value = c;
        } else {
            var c = parseFloat(totalAmount);
            document.getElementById("amountAddTxt" + rown).value = c.toFixed(2);
        }

    } catch (err) {

    }
    onchangetax(id);
}


function onchangetax(id) {
    var idr = id.id;
    var rown = '';
    //var unitStr
    try {
        if (idr.indexOf('_') > 0) {
            rown = idr.substring(idr.indexOf('_'));
        }
    } catch (err) {
        alert(err);
    }
    //alert(rown);
    try {
        var totalTax = document.getElementById("taxesAddTxt" + rown).value;
        var prateAddTxt = document.getElementById("prateAddTxt" + rown).value;
        var mrpText = document.getElementById("mrpAddTxt" + rown).value;
        if (prateAddTxt !== '') {
            //Purchase + GST = 112
            //Total = MRP - (Purchase + GST);   150- 112 = 38
            //Total = rate * x / 100;
            //38 = 150X/100;
            //38 = 1.5X;
            //x = 38 / 1.5
            //x= 25.33
            var a1 = parseFloat(totalTax);
            var aR = parseFloat(prateAddTxt);
            var a2_1 = (aR * a1) / 100;

            var a2 = a2_1 + aR;
            // alert(a2);

            var aM = parseFloat(mrpText);
            //alert(a2);

            var a3 = aM - a2;
            var a4 = a3 / (aM / 100);
            //alert(a4);
            document.getElementById("marginTxt" + rown).value = a4 + "%";

        }



    } catch (err) {

    }

}




function fetchData(productId) {

    var urlString = "/AvonMedicalService/rest/CoreService/getProductDetail?";


    urlString += "&productId=" + productId;


    var urlStringFinal = encodeURI(urlString);

    $.ajax({
        url: urlStringFinal
    }).then(function (data) {

        if (data) {
            var summary = data;
            document.getElementById("deleteProductTxt").value = productId;
            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var props = [
                    'productName',
                    'productId',
                    'company',
                    'formula',
                    'batchNo',
                    'manufactureDate',
                    'expireDate',
                    'quantityInShop',
                    'amountPerUnit',
                    'packing',
                    'free',
                    'mrp',
                    'vat',
                    'discount',
                    'distributerName',
                    'distributerNumber',
                    'date'
                ];


                var rowid = theItem.productId;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                //$("productNameAddTxt").value(theItem["productName"]));
                document.getElementById("productNameAddTxt").value = theItem["productName"];
                updatingProductName = theItem["productName"];
                document.getElementById("packingAddTxt").value = theItem["packing"];
                document.getElementById("quantityAddTxt").value = parseFloat(theItem["quantityInShop"]).toFixed(1);
                document.getElementById("freeAddTxt").value = theItem["free"];
                document.getElementById("batchNoAddTxt").value = theItem["batchNo"];
                document.getElementById("ExpiryDateAddTxt").value = theItem["expireDate"];
                //document.getElementById("dateAddTxt").value = theItem["date"];
                document.getElementById("mrpAddTxt").value = theItem["mrp"];
                document.getElementById("taxesAddTxt").value = parseFloat(theItem["cgst"]) + parseFloat(theItem["sgst"]);

                if (theItem["packing"].indexOf(" ") !== -1) {
                    var c = theItem["mrp"] / theItem["packing"].substring(0, theItem["packing"].indexOf(" "));
                    document.getElementById("amountAddTxt").value = c.toFixed(2);
                } else {
                    var c = theItem["mrp"] / theItem["packing"];
                    document.getElementById("amountAddTxt").value = c.toFixed(2);
                }

//                if (theItem["cgst"] !== null && theItem["cgst"] !== '') {
//                    document.getElementById("cgstAddTxt").value = theItem["cgst"] + "";
//                } else {
//                    document.getElementById("cgstAddTxt").value = "0";
//                }
//
//                if (theItem["sgst"] !== null && theItem["sgst"] !== '') {
//                    document.getElementById("sgstAddTxt").value = theItem["sgst"] + "";
//                } else {
//                    document.getElementById("sgstAddTxt").value = "0";
//                }
//
//                if (theItem["igst"] !== null && theItem["igst"] !== '') {
//                    document.getElementById("igstAddTxt").value = theItem["igst"] + "";
//                } else {
//                    document.getElementById("igstAddTxt").value = "0";
//                }
                document.getElementById("discountAddTxt").value = theItem["discount"];
                document.getElementById("companyAddTxt").value = theItem["company"];
                document.getElementById("formulaAddTxt").value = theItem["formula"];
                document.getElementById("disNameAddTxt").value = theItem["distributerName"];
                document.getElementById("disNoAddTxt").value = theItem["distributerNumber"];
                document.getElementById("scheduleAddTxt").value = theItem["drugSchedule"] + "";
                document.getElementById("prateAddTxt").value = theItem["purchaseRate"] + "";

                keychangemrp(document.getElementById("mrpAddTxt"));

            });




        } else {
            $('#myModal').modal('hide');
        }

    });



}

$(document).ready(function () {

    //var urlStringFinal = "";
    var urlStringFinal = "/AvonMedicalService/rest/CoreService/isValidLicece?dummy=1";
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        if (data["state"] > 0) {
            if (data["state"] <= 2) {
                alert("Your License is getting expired in two days, Please renew it, otherwise software will not work");
            }
        } else {
            //alert("Your licence is expired, Kindly send request for renewal");
            document.write("<font style='color:red;font-weight:700;'>Your licence is expired, Kindly \n\
    send request for renewal to BTech Software or call +919986881500 for support!</font>");
        }
    });


    //requestFullScreen();
    $('#myModal').modal('show');
    $('#myModal').modal('hide');

    window.moveTo(0, 0);


    if (document.all) {
        top.window.resizeTo(screen.availWidth, screen.availHeight);
    } else if (document.layers || document.getElementById) {
        if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
            top.window.outerHeight = screen.availHeight;
            top.window.outerWidth = screen.availWidth;
        }
    }


    if (document.getElementById("dateAddTxt")) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = dd + '-' + mm + '-' + yyyy;
        document.getElementById("dateAddTxt").value = today;

    }



    var processed_json = new Array();
    $.getJSON('/AvonMedicalService/rest/CoreService/json', function (data) {

        // Populate series
        for (i = 0; i < data.student_data.length; i++) {
            processed_json.push([data.student_data[i].key, parseInt(data.student_data[i].value)]);
        }

        // draw chart
        $('#container').highcharts({
            chart: {
                type: "column"
            },
            title: {
                text: "Student data"
            },
            xAxis: {
                allowDecimals: false,
                title: {
                    text: "Branch of studies"
                }
            },
            yAxis: {
                title: {
                    text: "Number of students"
                }
            },
            series: [{
                    data: processed_json
                }]
        });
    });



    function DropDown(el) {
        this.dd = el;
        this.placeholder = this.dd.children('span');
        this.opts = this.dd.find('ul.dropdown > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }
    DropDown.prototype = {
        initEvents: function () {
            var obj = this;

            obj.dd.on('click', function (event) {
                $(this).toggleClass('active');
                return false;
            });

            obj.opts.on('click', function () {
                var opt = $(this);
                obj.val = opt.text();
                obj.index = opt.index();
                obj.placeholder.text(obj.val);
            });
        },
        getValue: function () {
            return this.val;
        },
        getIndex: function () {
            return this.index;
        }
    }

    $(function () {

        var dd = new DropDown($('#dd'));

        $(document).click(function () {
            // all dropdowns
            $('.wrapper-dropdown-3').removeClass('active');
        });

    });


    jQuery.fn.center = function () {
        this.css("position", "absolute");
        this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
        this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
        return this;
    }

    var bid, trid;
    var counter = 0;
    var timer = null;
    var yourInterval;

    //ajax menu checkbox
    $('#is-ajax').click(function (e) {
        $.cookie('is-ajax', $(this).prop('checked'), {
            expires: 365
        });
    });
    $('#is-ajax').prop('checked', $.cookie('is-ajax') === 'true' ? true : false);

    //disbaling some functions for Internet Explorer
    /*if($.browser.msie)
     {
     $('#is-ajax').prop('checked',false);
     $('#for-is-ajax').hide();
     $('#toggle-fullscreen').hide();
     $('.login-box').find('.input-large').removeClass('span10');
     
     }*/


    //highlight current / active link
    $('ul.main-menu li a').each(function () {
        if ($($(this))[0].href == String(window.location))
            $(this).parent().addClass('active');
    });

    //establish history variables
    var
            History = window.History, // Note: We are using a capital H instead of a lower h
            State = History.getState(),
            $log = $('#log');

    //bind to State Change
    History.Adapter.bind(window, 'statechange', function () { // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        $.ajax({
            url: State.url,
            success: function (msg) {
                $('#content').html($(msg).find('#content').html());
                $('#loading').remove();
                $('#content').fadeIn();
                var newTitle = $(msg).filter('title').text();
                $('title').text(newTitle);
                docReady();
            }
        });
    });

    //ajaxify menus
    $('a.ajax-link').click(function (e) {
        if ($.browser.msie)
            e.which = 1;
        if (e.which != 1 || !$('#is-ajax').prop('checked') || $(this).parent().hasClass('active'))
            return;
        e.preventDefault();
        if ($('.btn-navbar').is(':visible'))
        {
            $('.btn-navbar').click();
        }
        $('#loading').remove();
        $('#content').fadeOut().parent().append('<div id="loading" class="center">Loading...<div class="center"></div></div>');
        var $clink = $(this);
        History.pushState(null, null, $clink.attr('href'));
        $('ul.main-menu li.active').removeClass('active');
        $clink.parent('li').addClass('active');
    });

    //animating menus on hover
    $('ul.main-menu li:not(.nav-header)').hover(function () {
        $(this).animate({
            'margin-left': '+=5'
        }, 300);
    },
            function () {
                $(this).animate({
                    'margin-left': '-=5'
                }, 300);
            });

    //other things to do on document ready, seperated for ajax calls
    docReady();
});


function docReady() {
    //prevent # links from moving to top
    $('a[href="#"][data-top!=true]').click(function (e) {
        e.preventDefault();
    });

    //rich text editor
    $('.cleditor').cleditor();

    //datepicker
    $('.datepicker').datepicker();

    //notifications
    $('.noty').click(function (e) {
        e.preventDefault();
        var options = $.parseJSON($(this).attr('data-noty-options'));
        noty(options);
    });


    //uniform - styler for checkbox, radio and file input
    $("input:checkbox, input:radio, input:file").not('[data-no-uniform="true"],#uniform-is-ajax').uniform();

    //chosen - improves select
    $('[data-rel="chosen"],[rel="chosen"]').chosen();

    //tabs
    $('#myTab a:first').tab('show');
    $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //makes elements soratble, elements that sort need to have id attribute to save the result
    $('.sortable').sortable({
        revert: true,
        cancel: '.btn,.box-content,.nav-header',
        update: function (event, ui) {
            //line below gives the ids of elements, you can make ajax call here to save it to the database
            //console.log($(this).sortable('toArray'));
        }
    });

    //slider
    $('.slider').slider({
        range: true,
        values: [10, 65]
    });

    //tooltip
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({
        "placement": "bottom",
        delay: {
            show: 400,
            hide: 200
        }
    });

    //auto grow textarea
    $('textarea.autogrow').autogrow();

    //popover
    $('[rel="popover"],[data-rel="popover"]').popover();

    //file manager
    var elf = $('.file-manager').elfinder({
        url: 'misc/elfinder-connector/connector.php'  // connector URL (REQUIRED)
    }).elfinder('instance');

    //iOS / iPhone style toggle switch
    $('.iphone-toggle').iphoneStyle();

    //star rating
    $('.raty').raty({
        score: 4 //default stars
    });

    //uploadify - multiple uploads
    $('#file_upload').uploadify({
        'swf': 'misc/uploadify.swf',
        'uploader': 'misc/uploadify.php'
                // Put your options here
    });

    //gallery controlls container animation
    $('ul.gallery li').hover(function () {
        $('img', this).fadeToggle(1000);
        $(this).find('.gallery-controls').remove();
        $(this).append('<div class="well gallery-controls">' +
                '<p><a href="#" class="gallery-edit btn"><i class="icon-edit"></i></a> <a href="#" class="gallery-delete btn"><i class="icon-remove"></i></a></p>' +
                '</div>');
        $(this).find('.gallery-controls').stop().animate({
            'margin-top': '-1'
        }, 400, 'easeInQuint');
    }, function () {
        $('img', this).fadeToggle(1000);
        $(this).find('.gallery-controls').stop().animate({
            'margin-top': '-30'
        }, 200, 'easeInQuint', function () {
            $(this).remove();
        });
    });


    //gallery image controls example
    //gallery delete
    $('.thumbnails').on('click', '.gallery-delete', function (e) {
        e.preventDefault();
        //get image id
        //alert($(this).parents('.thumbnail').attr('id'));
        $(this).parents('.thumbnail').fadeOut();
    });
    //gallery edit
    $('.thumbnails').on('click', '.gallery-edit', function (e) {
        e.preventDefault();
        //get image id
        //alert($(this).parents('.thumbnail').attr('id'));
    });

    //gallery colorbox
    $('.thumbnail a').colorbox({
        rel: 'thumbnail a',
        transition: "elastic",
        maxWidth: "95%",
        maxHeight: "95%"
    });

    //gallery fullscreen
    $('#toggle-fullscreen').button().click(function () {
        var button = $(this), root = document.documentElement;
        if (!button.hasClass('active')) {
            $('#thumbnails').addClass('modal-fullscreen');
            if (root.webkitRequestFullScreen) {
                root.webkitRequestFullScreen(
                        window.Element.ALLOW_KEYBOARD_INPUT
                        );
            } else if (root.mozRequestFullScreen) {
                root.mozRequestFullScreen();
            }
        } else {
            $('#thumbnails').removeClass('modal-fullscreen');
            (document.webkitCancelFullScreen ||
                    document.mozCancelFullScreen ||
                    $.noop).apply(document);
        }
    });

    //tour
    if ($('.tour').length && typeof (tour) == 'undefined')
    {
        var tour = new Tour();
        tour.addStep({
            element: ".span10:first", /* html element next to which the step popover should be shown */
            placement: "top",
            title: "Custom Tour", /* title of the popover */
            content: "You can create tour like this. Click Next." /* content of the popover */
        });
        tour.addStep({
            element: ".theme-container",
            placement: "left",
            title: "Themes",
            content: "You change your theme from here."
        });
        tour.addStep({
            element: "ul.main-menu a:first",
            title: "Dashboard",
            content: "This is your dashboard from here you will find highlights."
        });
        tour.addStep({
            element: "#for-is-ajax",
            title: "Ajax",
            content: "You can change if pages load with Ajax or not."
        });
        tour.addStep({
            element: ".top-nav a:first",
            placement: "bottom",
            title: "Visit Site",
            content: "Visit your front end from here."
        });

        tour.restart();
    }

    //datatable
    $('.datatable').dataTable({
        "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'i><'span12 center'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        }
    });
    $('.btn-close').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().parent().fadeOut();
    });
    $('.btn-minimize').click(function (e) {
        e.preventDefault();
        var $target = $(this).parent().parent().next('.box-content');
        if ($target.is(':visible'))
            $('i', $(this)).removeClass('icon-chevron-up').addClass('icon-chevron-down');
        else
            $('i', $(this)).removeClass('icon-chevron-down').addClass('icon-chevron-up');
        $target.slideToggle();
    });
    $('.btn-setting').click(function (e) {
        e.preventDefault();
        $('#myModal').modal('show');
    });




    //initialize the external events for calender

    $('#external-events div.external-event').each(function () {

        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });


    //initialize the calendar
    $('#calendar').fullCalendar({
        dayClick: function (date, allDay, jsEvent, view) {
            $('#myModal').modal('show');
            if (allDay) {
                var s = "" + date.getFullYear() + "";
                var eyear = s.substring(2, 4);
                var emonth;
                if (date.getMonth() == 0) {
                    emonth = "JAN";
                } else if (date.getMonth() == 1) {
                    emonth = "FEB";
                } else if (date.getMonth() == 2) {
                    emonth = "MAR";
                } else if (date.getMonth() == 3) {
                    emonth = "APR";
                } else if (date.getMonth() == 4) {
                    emonth = "MAY";
                } else if (date.getMonth() == 5) {
                    emonth = "JUN";
                } else if (date.getMonth() == 6) {
                    emonth = "JULY";
                } else if (date.getMonth() == 7) {
                    emonth = "AUG";
                } else if (date.getMonth() == 8) {
                    emonth = "SEP";
                } else if (date.getMonth() == 9) {
                    emonth = "OCT";
                } else if (date.getMonth() == 10) {
                    emonth = "NOV";
                } else if (date.getMonth() == 11) {
                    emonth = "DEC";
                }

                document.getElementById("expDateFiltertxt").value = emonth + "-" + eyear;

                var table = $('#testInst').DataTable();

                table.destroy();
                //$('#testInst').empty(); // empty in case the columns change


                //document.getElementById("testInstDiv").innerHTML = "";

                getBpelInstances();
                // Clicked on the entire day
                // alert("Date : " + date.getDate() + ", Month : " + date.getMonth());
                //$('#showExpFilterBtn').click();



                var target = "#testInst";
                var topset = 0;

                //topSet = $(target).offset().top - 4;



                $('html, body').animate({
                    scrollTop: $(target).offset().top - 10
                }, 2000);
                /*$('#calendar')
                 .fullCalendar('changeView', 'agendaDay')
                 .fullCalendar('gotoDate',
                 date.getFullYear(), date.getMonth(), date.getDate());*/

                $('#myModal').modal('hide');
            }
        },
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        }
    });



    //chart with points
    if ($("#sincos").length)
    {
        var sin = [], cos = [];

        for (var i = 0; i < 14; i += 0.5) {
            sin.push([i, Math.sin(i) / i]);
            cos.push([i, Math.cos(i)]);
        }

        var plot = $.plot($("#sincos"),
                [{
                        data: sin,
                        label: "sin(x)/x"
                    }, {
                        data: cos,
                        label: "cos(x)"
                    }], {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                hoverable: true,
                clickable: true,
                backgroundColor: {
                    colors: ["#fff", "#eee"]
                }
            },
            yaxis: {
                min: -1.2,
                max: 1.2
            },
            colors: ["#539F2E", "#3C67A5"]
        });

        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 5,
                border: '1px solid #fdd',
                padding: '2px',
                'background-color': '#dfeffc',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#sincos").bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY,
                            item.series.label + " of " + x + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });



        $("#sincos").bind("plotclick", function (event, pos, item) {
            if (item) {
                $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
                plot.highlight(item.series, item.datapoint);
            }
        });
    }

    //flot chart
    if ($("#flotchart").length)
    {
        var d1 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25)
            d1.push([i, Math.sin(i)]);

        var d2 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.25)
            d2.push([i, Math.cos(i)]);

        var d3 = [];
        for (var i = 0; i < Math.PI * 2; i += 0.1)
            d3.push([i, Math.tan(i)]);

        $.plot($("#flotchart"), [
            {
                label: "sin(x)",
                data: d1
            },
            {
                label: "cos(x)",
                data: d2
            },
            {
                label: "tan(x)",
                data: d3
            }
        ], {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                ticks: [0, [Math.PI / 2, "\u03c0/2"], [Math.PI, "\u03c0"], [Math.PI * 3 / 2, "3\u03c0/2"], [Math.PI * 2, "2\u03c0"]]
            },
            yaxis: {
                ticks: 10,
                min: -2,
                max: 2
            },
            grid: {
                backgroundColor: {
                    colors: ["#fff", "#eee"]
                }
            }
        });
    }

    //stack chart
    if ($("#stackchart").length)
    {
        var d1 = [];
        for (var i = 0; i <= 10; i += 1)
            d1.push([i, parseInt(Math.random() * 30)]);

        var d2 = [];
        for (var i = 0; i <= 10; i += 1)
            d2.push([i, parseInt(Math.random() * 30)]);

        var d3 = [];
        for (var i = 0; i <= 10; i += 1)
            d3.push([i, parseInt(Math.random() * 30)]);

        var stack = 0, bars = true, lines = false, steps = false;

        function plotWithOptions() {
            $.plot($("#stackchart"), [d1, d2, d3], {
                series: {
                    stack: stack,
                    lines: {
                        show: lines,
                        fill: true,
                        steps: steps
                    },
                    bars: {
                        show: bars,
                        barWidth: 0.6
                    }
                }
            });
        }

        plotWithOptions();

        $(".stackControls input").click(function (e) {
            e.preventDefault();
            stack = $(this).val() == "With stacking" ? true : null;
            plotWithOptions();
        });
        $(".graphControls input").click(function (e) {
            e.preventDefault();
            bars = $(this).val().indexOf("Bars") != -1;
            lines = $(this).val().indexOf("Lines") != -1;
            steps = $(this).val().indexOf("steps") != -1;
            plotWithOptions();
        });
    }

    //pie chart
    var data = [
        {
            label: "Internet Explorer",
            data: 12
        },
        {
            label: "Mobile",
            data: 27
        },
        {
            label: "Safari",
            data: 85
        },
        {
            label: "Opera",
            data: 64
        },
        {
            label: "Firefox",
            data: 90
        },
        {
            label: "Chrome",
            data: 112
        }
    ];

    if ($("#piechart").length)
    {
        $.plot($("#piechart"), data,
                {
                    series: {
                        pie: {
                            show: true
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    },
                    legend: {
                        show: false
                    }
                });

        function pieHover(event, pos, obj)
        {
            if (!obj)
                return;
            percent = parseFloat(obj.series.percent).toFixed(2);
            $("#hover").html('<span style="font-weight: bold; color: ' + obj.series.color + '">' + obj.series.label + ' (' + percent + '%)</span>');
        }
        $("#piechart").bind("plothover", pieHover);
    }

    //donut chart
    if ($("#donutchart").length)
    {
        $.plot($("#donutchart"), data,
                {
                    series: {
                        pie: {
                            innerRadius: 0.5,
                            show: true
                        }
                    },
                    legend: {
                        show: false
                    }
                });
    }




    // we use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [], totalPoints = 300;
    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);

        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0)
                y = 0;
            if (y > 100)
                y = 100;
            data.push(y);
        }

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i)
            res.push([i, data[i]])
        return res;
    }

    // setup control widget
    var updateInterval = 30;
    $("#updateInterval").val(updateInterval).change(function () {
        var v = $(this).val();
        if (v && !isNaN(+v)) {
            updateInterval = +v;
            if (updateInterval < 1)
                updateInterval = 1;
            if (updateInterval > 2000)
                updateInterval = 2000;
            $(this).val("" + updateInterval);
        }
    });

    //realtime chart
    if ($("#realtimechart").length)
    {
        var options = {
            series: {
                shadowSize: 1
            }, // drawing is faster without shadows
            yaxis: {
                min: 0,
                max: 100
            },
            xaxis: {
                show: false
            }
        };
        var plot = $.plot($("#realtimechart"), [getRandomData()], options);
        function update() {
            plot.setData([getRandomData()]);
            // since the axes don't change, we don't need to call plot.setupGrid()
            plot.draw();

            setTimeout(update, updateInterval);
        }

        update();
    }
}


//additional functions for data table
$.fn.dataTableExt.oApi.fnPagingInfo = function (oSettings)
{
    return {
        "iStart": oSettings._iDisplayStart,
        "iEnd": oSettings.fnDisplayEnd(),
        "iLength": oSettings._iDisplayLength,
        "iTotal": oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
        "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
    };
}
$.extend($.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function (oSettings, nPaging, fnDraw) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function (e) {
                e.preventDefault();
                if (oSettings.oApi._fnPageChange(oSettings, e.data.action)) {
                    fnDraw(oSettings);
                }
            };

            $(nPaging).addClass('pagination').append(
                    '<ul>' +
                    '<li class="prev disabled"><a href="#">&larr; ' + oLang.sPrevious + '</a></li>' +
                    '<li class="next disabled"><a href="#">' + oLang.sNext + ' &rarr; </a></li>' +
                    '</ul>'
                    );
            var els = $('a', nPaging);
            $(els[0]).bind('click.DT', {
                action: "previous"
            }, fnClickHandler);
            $(els[1]).bind('click.DT', {
                action: "next"
            }, fnClickHandler);
        },
        "fnUpdate": function (oSettings, fnDraw) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf = Math.floor(iListLength / 2);

            if (oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            } else if (oPaging.iPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (oPaging.iPage >= (oPaging.iTotalPages - iHalf)) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for (i = 0, iLen = an.length; i < iLen; i++) {
                // remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // add the new list items and their event handlers
                for (j = iStart; j <= iEnd; j++) {
                    sClass = (j == oPaging.iPage + 1) ? 'class="active"' : '';
                    $('<li ' + sClass + '><a href="#">' + j + '</a></li>')
                            .insertBefore($('li:last', an[i])[0])
                            .bind('click', function (e) {
                                e.preventDefault();
                                oSettings._iDisplayStart = (parseInt($('a', this).text(), 10) - 1) * oPaging.iLength;
                                fnDraw(oSettings);
                            });
                }

                // add / remove disabled classes from the static elements
                if (oPaging.iPage === 0) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if (oPaging.iPage === oPaging.iTotalPages - 1 || oPaging.iTotalPages === 0) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});




jQuery.fn.center = function (absolute) {
    return this.each(function () {
        var t = jQuery(this);

        t.css({
            position: absolute ? 'absolute' : 'fixed',
            left: '50%',
            top: '50%',
            zIndex: '99'
        }).css({
            marginLeft: '-' + (t.outerWidth() / 2) + 'px',
            marginTop: '-' + (t.outerHeight() / 2) + 'px'
        });

        if (absolute) {
            t.css({
                marginTop: parseInt(t.css('marginTop'), 10) + jQuery(window).scrollTop(),
                marginLeft: parseInt(t.css('marginLeft'), 10) + jQuery(window).scrollLeft()
            });
        }
    });
};


function readFile(file) {
    var loader = new FileReader();
    var def = $.Deferred(), promise = def.promise();

    //--- provide classic deferred interface
    loader.onload = function (e) {
        def.resolve(e.target.result);
    };
    loader.onprogress = loader.onloadstart = function (e) {
        def.notify(e);
    };
    loader.onerror = loader.onabort = function (e) {
        def.reject(e);
    };
    promise.abort = function () {
        return loader.abort.apply(loader, arguments);
    };

    loader.readAsBinaryString(file);

    return promise;
}



$(':file').change(function () {
    var file = this.files[0];
    var name = file.name;
    var size = file.size;
    var type = file.type;
//Your validation
});

$('#uploadButton').click(function () {

    var dd = document.getElementById("uploadFile");

    var file = dd.value;

    document.getElementById("fileName").value = file;


    if (file) {
        document.getElementById("pr1").style.visibility = "visible";
        var type = file.substr(file.indexOf('.') + 1);
        if (type == "csv" || type == "CSV") {
            var formData = new FormData($('form')[0]);
            $.ajax({
                url: '/AvonMedicalService/rest/CoreService/upload?', //Server script to process data
                type: 'POST',
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { // Check if upload property exists
                        myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                //Ajax events
                beforeSend: beforeSendHandler,
                success: completeHandler,
                error: errorHandler,
                // Form data
                data: formData,
                //Options to tell jQuery not to process data or worry about content-type.
                cache: false,
                contentType: false,
                processData: false
            });

        } else {
            alert('Hey!! File can only be of type CSV.. you are uploding a ' + type + ' file, which application can not read, Please upload CSV file [Comma seperated],  Upload aborted!!');

        }
    } else {
        alert("No file choosen for upload !! Upload aborted!!");
    }
});

function beforeSendHandler() {

}

function get_filename(obj) {

    var file = obj.value;

    var type = file.substr(file.indexOf('.') + 1);


    if (type == "csv" || type == "CSV") {
        document.getElementById("fileName").value = file;
    } else {

        alert('Hey!! File can only be of type CSV.. you are uploding a ' + type + ' file, which application can not read, Please upload CSV file [Comma seperated]');

    }

}

function completeHandler() {
    alert("file uploaded successfully..Refreshing your page after this!");
    document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
    document.getElementById("pr1").style.visibility = "hidden";
    getBpelInstances();
    getCustomerInstances();

}
function errorHandler() {

}

function progressHandlingFunction(e) {
    if (e.lengthComputable) {
        $('progress').attr({
            value: e.loaded,
            max: e.total
        });
    }
}
