/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var serviceInvoking = 0;
var updateWindow = 1;
var currenNameListIndex = 0;
var customerIDForBilling = 0;
var summary;
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

function removeNameList() {
    document.getElementById("nameListDiv").style.visibility = "hidden";
}

function getAllCustomerNames(evnt) {
    var urlString = "/AvonMedicalService/rest/LadgerService/getCustomerNames?";
    var i1 = document.getElementById("custNameFilterTxt").value;
    if (i1 !== '') {
        urlString = urlString + "name=" + i1;
    }

    document.getElementById("custNameList").innerHTML = "";
    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        var summary = data;
        if (data) {
            updateWindow = 1;
            currentTab = 0;
            currenNameListIndex = 0;
            currenNameListIndex1 = 0;
            currenNameListIndex2 = 0;
            $.each(summary, function (i, theItem) {
                var row;
                row = $("<tr id='" + i + "'></tr>");
                //row.append($("<td id='" + theItem["NAME"] + "' onclick='selectCustomer(this)'><a href='#' style='font-weight:700;color: white;' >" + theItem["NAME"] + "</a>"));
                row.append($("<td id='" + theItem["ID"] + "' onclick='selectCustomer(this)'><a href='#' style='font-weight:700;color: white;' >" + theItem["NAME"] + "</a>"));
                row.append($("<td id='" + theItem["ID"] + "_ID'>" + theItem["ID"] + "").text("" + theItem["ID"] + ""));
                $("#custNameList").append(row);
            })
        }

        if (evnt.keyCode === 40) {
            currenNameListIndex++;
        }

        if (evnt.keyCode === 38) {
            currenNameListIndex--;
        }

        for (var i1 = 0; i1 < document.getElementById("custNameList").children.length; i1++) {
            document.getElementById("custNameList").children[i1].style.border = "";
            document.getElementById("custNameList").children[i1].style.backgroundColor = "#21584e";
            //document.getElementById("bpelInstSummayTabBody3").children[currentTab - 1].style.fontSize = '14px';
        }

        if (evnt.keyCode === 40 || evnt.keyCode === 38) {

            document.getElementById("custNameList").children[currenNameListIndex - 1].children[0].children[0].focus();

            document.getElementById("custNameList").children[currenNameListIndex - 1].style.border = '0.2em solid black';
            document.getElementById("custNameList").children[currenNameListIndex - 1].style.backgroundColor = '	#006400';
        }

    });
}

function selectCustomer(ref) {
    customerIDForBilling = ref.id;
    var a = ref.innerHTML;
    a = a.substring(a.indexOf('>') + 1);

    a = a.substr(0, a.indexOf('</a>'));

    document.getElementById("custNameFilterTxt").value = a;
    document.getElementById("custNameFilterTxt").style.border = '';
    document.getElementById("custMobileFilterTxt").focus();

    //document.getElementById("custMobileFilterTxt").style.border = '0.17em solid orange';

    //document.getElementById("creditReportDiv").style.display = "block";
    //fetchCreditReport(document.getElementById("custNameForBillingTxt").value);
    currenNameListIndex = 0;

    //currentTab++;

    removeNameList();
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

$("#formulaFilterTxt").bind('keypress', function (e) {
    if (e.which == 13) {

        getBpelInstances();
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

$("#custNameFilterTxt").on('focusout', function (e) {

    try {
        //document.getElementById("nameListDiv").style.visibility = "hidden";
    } catch (err) {
    }
});

$("#custNameFilterTxt").bind('keyup', function (e) {

    try {
        if (e.which === 13) {
            getCustomerInstances();
        }


        var arrowPressed = false;
        if (e.keyCode === 38 || e.keyCode === 40) {
            arrowPressed = true;
        }

        if (!arrowPressed) {
            console.log("Getting names...");
            getAllCustomerNames(e);
            document.getElementById("nameListDiv").style.visibility = "visible";
        } else {
            document.getElementById("nameListDiv").style.visibility = "hidden";
        }
    } catch (err) {
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

var bpelIdsortorder = "ASC";
var instanceIdsortorder = "ASC";
var statussortorder = "ASC";
var startTimesortorder = "DESC";
var endtimesortorder = "ASC";

var totalProductForBill = 0;
var totalPriceForBill = 0;


function swalParam(jsonData) {
    //alert(jsonData.title);
    //alert(document.getElementById("mySwalWindow"));
    document.getElementById("mySwalWindow").style.display = "block";
    //alert("Hell");
    document.getElementById("mySwalTitle").innerHTML = jsonData.title;
    if (jsonData.text) {
        document.getElementById("mySwalMessage").innerHTML = jsonData.text;
    } else {
        document.getElementById("mySwalMessage").innerHTML = "";
    }
    document.getElementById("mySwalAction").focus();
    document.getElementById("mySwalAction").style.border = '0.3em solid red';
}

var billNoInAction = '';
function hideMySwal() {
    document.getElementById("mySwalTitle").innerHTML = "";
    document.getElementById("mySwalMessage").innerHTML = "";
    document.getElementById("mySwalWindow").style.display = "none";

    try {
        if (billNoInAction === '') {
            return;
        }
        orderGenerated = 1;
        window.open("/AvonMedicalService/Invoice.html?billNo=" + billNoInAction);
        $('#myMessageTrackingWindow').modal('hide');
        currentTab = 0;
        currenModal = 0;
        gCmd = 0;
        finalBilling = 0;

        if (document.getElementById("tdCustName")) {
            document.getElementById("tdCustName").innerHTML = document.getElementById("custNameForBillingTxt").value;
        }

        if (document.getElementById("btnGenerateFinalBill")) {
            // document.getElementById("btnGenerateFinalBill").style.display = "none";
        }

        if (document.getElementById("btnGenerateFinalBill2")) {
            //  document.getElementById("btnGenerateFinalBill2").style.display = "none";
        }

        document.getElementById("billFooter").style.visibility = "visible";

        var content = '<html>\n<link href="css/bootstrap-responsive.css" rel="stylesheet">\n        <link href="css/charisma-app.css" rel="stylesheet">\n        <linkhref="css/jquery-ui-1.8.21.custom.css" rel="stylesheet">\n        <link href="css/fullcalendar.css" rel="stylesheet"> \n       <link href="css/fullcalendar.print.css"rel="stylesheet"  media="print"> \n       <link href="css/chosen.css" rel="stylesheet">    \n    <link href="css/uniform.default.css" rel="stylesheet">   \n     <link href="cs/colorbox.css" rel="stylesheet"> \n       <link href="css/jquery.cleditor.css" rel="stylesheet">  \n      <link href="css/jquery.noty.css" rel="stylesheet">  \n      <link href=css/noty_theme_default.css" rel="stylesheet">   \n     <link href="css/elfinder.min.css" rel="stylesheet">   \n     <link href="css/elfinder.theme.css" rel="stylesheet">   \n     <link href="css/jquery.iphone.toggle.css" rel="stylesheet">    \n    <link href="css/opa-icons.css" rel="stylesheet"> \n       <link href="css/uploadify.css" rel"stylesheet">   \n     <link href="css/style.css" rel="stylesheet">\n<body>';
        content += document.getElementById("billingDivMainTopFinalBill").innerHTML;
        content += "</body>";
        content += "</html>";

        window.location.reload();
        isSearchedProduct = 0;
    } catch (err) {
    }
}

var oldrowid;
var oldSelectedId = '';
var pageNo = 0;
var pageSize = 50;

var sno = 1;
var totalPrice = 0.0;
var totalTax = 0.0;
var totalTaxableAmount = 0.0;
var totalCGST = 0.0;
var totalSGST = 0.0;
var totalIGST = 0.0;
var totalDiscount = 0.0;
var totalCreditAmout = 0.0;
var row;

var responseLength = 0;

function getCustomerInstances(isExported) {

    if (isExported !== 10) {
        document.getElementById("tabReportBody").innerHTML = "";
        document.getElementById("totalSale").innerHTML = "";
        document.getElementById("totalCreditPending").innerHTML = "";

        totalPrice = 0.0;
        totalCGST = 0.0;
        totalSGST = 0.0;
        totalIGST = 0.0;
        totalCreditAmout = 0.0;
        totalPrice = 0;
        totalTaxableAmount = 0;
        totalTax = 0;
        totalCGST = 0;
        totalSGST = 0;
        totalDiscount = 0;
        pageNo = 0;
    }

    if (document.getElementById("testInstCustBody")) {
        document.getElementById("testInstCustBody").innerHTML = "";

    }

    if (document.getElementById("tabBpelVariableListBody")) {
        document.getElementById("tabBpelVariableListBody").innerHTML = "";

    }

    var hiddenFlag = 0;
    if (document.getElementById("hiddenCheckBox1") && document.getElementById("hiddenCheckBox1").checked) {
        hiddenFlag = 1;
    }

    if (document.getElementById("hiddenCheckBox3") && document.getElementById("hiddenCheckBox3").checked) {
        hiddenFlag = 3;
    }

    var urlString = "/AvonMedicalService/rest/CoreService/getCustomerBillingDetail?maxrecord=100&hiddenFlag=" + hiddenFlag + "&pageNo=" + pageNo + "&pageSize=" + pageSize;
    var someFilterSet = false;
    var statusFilterTxtValue = document.getElementById("custNameFilterTxt");
    if (statusFilterTxtValue) {
        if ($.trim(statusFilterTxtValue.value) != "") {
            urlString += "&custNameFilter=" + statusFilterTxtValue.value;
            someFilterSet = true;
        }
        //statusFilterTxtValue.value = "";
    }

    var bpelFilterTxtValue = document.getElementById("custMobileFilterTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) != "") {
            urlString += "&custMobileFilter=" + bpelFilterTxtValue.value;
            someFilterSet = true;
        }
        //bpelFilterTxtValue.value = "";
    }

    var paymentTypeTxt = document.getElementById("paymentTypeTxt");
    if (paymentTypeTxt) {
        if ($.trim(paymentTypeTxt.value) != "") {
            urlString += "&paymentType=" + paymentTypeTxt.value;
            someFilterSet = true;
        }
        //bpelFilterTxtValue.value = "";
    }

    var datepickerNoOfMonths = document.getElementById("datepickerNoOfMonths");
    if (datepickerNoOfMonths) {
        if ($.trim(datepickerNoOfMonths.value) !== "") {
            urlString += "&dateFilter=" + datepickerNoOfMonths.value;
            someFilterSet = true;
        }
    }

    if (!someFilterSet) {
        var location = window.location.href;
        try {
            var locationA = location.split("?custNameFilter=");
            if (locationA[1] && locationA[1] !== '' && locationA[1] !== 'undefined') {
                urlString += "&custNameFilter=" + locationA[1];
                document.getElementById("custNameFilterTxt").value = decodeURI(locationA[1]);
                someFilterSet = true;
            } else {

            }

        } catch (Err) {
        }
    }


    if (!someFilterSet) {
        var location = window.location.href;
        try {
            var locationA = location.split("?paymentTypeFilter=");
            if (locationA[1] && locationA[1] !== '' && locationA[1] !== 'undefined') {
                urlString += "&paymentType=" + locationA[1];
                if (locationA[1] === 'CREDIT') {
                    document.getElementById("paymentTypeTxt").value = locationA[1];
                } else if (locationA[1] === 'CREDIT#') {
                    document.getElementById("paymentTypeTxt").value = 'CREDIT';
                }
                someFilterSet = true;
            } else {

            }

        } catch (Err) {
        }
    }

    if (!someFilterSet) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '/' + mm + '/' + yyyy;
        urlString += "&dateFilter=" + today;
        document.getElementById("filterSpn").innerHTML = " (Default Current Date Sale : " + today + ")";
    } else {
        document.getElementById("filterSpn").innerHTML = " For Selected filter (Max 2000 Sales Record)";
    }

    if (customerIDForBilling != 0) {
        urlString += "&custIdFilter=" + customerIDForBilling;
    }



    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        //
        if (data) {
            var summary = data;
            totalBPELInstances = summary.length;
            responseLength = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }

            if (responseLength <= 0) {
                document.getElementById("tabReportBodyFinal").innerHTML = "";
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:20px;color:green;'>").text("Grand Total (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:20px;color:green;' align='right'>").text(totalPrice.toFixed(2)));
                $("#tabReportBodyFinal").append(row);
                var userRole = localStorage.getItem("userRole");

                if (userRole !== 'superadmin') {
                    document.getElementById("totalSale").innerHTML = " #OnlyForAdmin#";
                } else {
                    document.getElementById("totalSale").innerHTML = totalPrice.toFixed(2);
                }

                document.getElementById("totalCreditPending").innerHTML = totalCreditAmout.toFixed(2);
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index2" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName2" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "' style='font-weight:700;font-size:20px;color:green;'>").text("Payment Pending (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "' style='font-weight:700;font-size:20px;color:green;' align='right'>").text(totalCreditAmout.toFixed(2)));
                $("#tabReportBodyFinal").append(row);
                document.getElementById("pageLoadingImg").style.display = "none";
            }

            $.each(summary, function (i, theItem) {

                tableRowRountInst++;
                //alert( "OOI New : " + theItem.bpelId );

                var rowid = theItem.billNo;

                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='" + rowid + "_custName" + "'><input type='checkbox' />" + sno++));
                row.append($("<td id='" + rowid + "_billPrintNo" + "'>").text(theItem["billPrintNo"]));
                row.append($("<td id='" + rowid + "_billNo" + "'><a target='_blank' href='Invoice.html?billNo=" + theItem["billNo"] + "'>" + theItem["billNo"] + "</a>"));


                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["billDate"]));

                if ((!theItem["totalNumberOfProducts"]) || theItem["totalNumberOfProducts"] === "") {
                    row.append($("<td id='" + rowid + "_totalNumberOfProducts" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_custName" + "'>").text(theItem["totalNumberOfProducts"]));
                }

                if ((!theItem["paymentType"]) || theItem["paymentType"] === "") {
                    row.append($("<td id='" + rowid + "_paymentType" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_paymentType" + "'>").text(theItem["paymentType"]));
                }

                if ((!theItem["creditStatus"]) || theItem["creditStatus"] === "") {
                    row.append($("<td id='" + rowid + "_creditStatus" + "'>").text("---"));
                } else {

                    if (theItem["creditStatus"] === 'PAYMENT-PENDING') {
                        row.append($("<td id='" + rowid + "_creditStatus" + "' style='color:red;font-weight:700;width:150px;'>").text(theItem["creditStatus"]));
                        var ty1 = 0.0;
                        try {
                            var ty2 = parseFloat(theItem["creditAmount"]);
                            if (ty2 > 0.0) {
                                ty1 = ty2;
                            }
                        } catch (Err) {

                        }

                        totalCreditAmout = totalCreditAmout + ty1;

                    } else {
                        row.append($("<td id='" + rowid + "_creditStatus" + "' style='color:green;font-weight:700;'>").text(theItem["creditStatus"]));
                    }
                }

                if ((!theItem["creditAmount"]) || theItem["creditAmount"] === "") {
                    row.append($("<td id='" + rowid + "_creditAmount" + "'>").text("---"));
                } else {

                    row.append($("<td id='" + rowid + "_creditAmount" + "'>").text(theItem["creditAmount"]));
                }

                if ((!theItem["custName"]) || theItem["custName"] === "") {
                    row.append($("<td id='" + rowid + "_custName" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_custName" + "'>").text(theItem["custName"]));
                }

                row.append($("<td id='" + rowid + "_billNo" + "' align='right'>").text(parseFloat(theItem["taxableAmount"]).toFixed(2)));
                row.append($("<td id='" + rowid + "_billNo" + "' align='right'>").text(parseFloat(theItem["totalCgstPaid"]).toFixed(2)));
                row.append($("<td id='" + rowid + "_billNo" + "' align='right'>").text(parseFloat(theItem["totalSgstPaid"]).toFixed(2)));
                row.append($("<td id='" + rowid + "_billNo" + "' align='right'>").text(theItem["additionalDiscount"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:14px;' align='right'>").text(parseFloat(theItem["totalAmountPaid"]).toFixed(2)));

                totalPrice = totalPrice + parseFloat(theItem["totalAmountPaid"]);
                totalTaxableAmount = totalTaxableAmount + parseFloat(theItem["taxableAmount"]);
                totalTax = totalTax + parseFloat(theItem["totalTaxPaid"]);
                totalCGST = totalCGST + parseFloat(theItem["totalCgstPaid"]);
                totalSGST = totalSGST + parseFloat(theItem["totalSgstPaid"]);
                totalDiscount = totalDiscount + parseFloat(theItem["additionalDiscount"]);
                //totalIGST = totalIGST + parseFloat(theItem["totalIGSTPaid"]);
                $("#tabReportBody").append(row);

                var userRole = localStorage.getItem("userRole");

                if (userRole !== 'superadmin') {
                    document.getElementById("totalSale").innerHTML = " #OnlyForAdmin#";
                } else {
                    document.getElementById("totalSale").innerHTML = totalPrice.toFixed(2);
                }

                document.getElementById("totalCreditPending").innerHTML = totalCreditAmout.toFixed(2);

                //map[theItem.id] = theItem.bpelId;
            });

            if (responseLength === pageSize) {
                pageNo++;
                getCustomerInstances(10);
                document.getElementById("pageLoadingImg").style.display = "block";
            } else {
                document.getElementById("tabReportBodyFinal").innerHTML = "";

                //Total
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));

                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Total Taxable Amount (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalTaxableAmount.toFixed(2)));
                $("#tabReportBodyFinal").append(row);


                //2
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Total CGST (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalCGST.toFixed(2)));
                $("#tabReportBodyFinal").append(row);

                //3
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Total SGST (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalSGST.toFixed(2)));
                $("#tabReportBodyFinal").append(row);

                //4
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Total Tax Paid (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalTax.toFixed(2)));
                $("#tabReportBodyFinal").append(row);

                //5
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Total Discount (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalDiscount.toFixed(2)));
                $("#tabReportBodyFinal").append(row);

                //6
                row = $("<tr id='" + rowid + "'></tr>");
                var rowid = "row_unit_total";
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Grand Total (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalPrice.toFixed(2)));
                $("#tabReportBodyFinal").append(row);



                var userRole = localStorage.getItem("userRole");

                if (userRole !== 'superadmin') {
                    document.getElementById("totalSale").innerHTML = " #OnlyForAdmin#";
                } else {
                    document.getElementById("totalSale").innerHTML = totalPrice.toFixed(2);
                }

                document.getElementById("totalCreditPending").innerHTML = totalCreditAmout.toFixed(2);
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "index2" + "'>").text(""));
                row.append($("<td id='" + rowid + "productName2" + "'>").text(""));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                //row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "'>").text(""));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "' style='font-weight:700;font-size:16px;color:green;'>").text("Payment Pending (Rs)"));
                row.append($("<td id='" + rowid + "_totalAmountPaid2" + "' style='font-weight:700;font-size:16px;color:green;' align='right'>").text(totalCreditAmout.toFixed(2)));
                $("#tabReportBodyFinal").append(row);
                document.getElementById("pageLoadingImg").style.display = "none";

            }

            $('#testInst').on('click', 'td', function () {
                trid = $(this).attr('id');
                trid = trid.substring(0, trid.lastIndexOf("_"));
                if (oldSelectedId != '') {
                    document.getElementById(oldSelectedId).style.backgroundColor = "white";
                }
                document.getElementById(trid).style.backgroundColor = "#00ff00";

                oldSelectedId = trid;

                // window.open("Invoice.html?billNo=" + trid, "_blank");
            });

        } else {

        }

    });



}

function viewInvoice() {

    window.open("/AvonMedicalService/Invoice.html?billNo=" + oldrowid);

}

function getInvoice() {

    var location = window.location.href;

    var locationA = location.split("?billNo=")

    var urlString = "/AvonMedicalService/rest/CoreService/getBillingDetailWithProducts?";
    if (!locationA[1]) {
        return;
    }

    urlString += "&billNo=" + locationA[1];

    $("#tabBpelVariableListBody").innerHTML = "";

    $.ajax({
        url: urlString
    }).then(function (data) {
        if (data) {

            var summary = data;


            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            var totalPrice = 0.0;
            var totalCGST = 0.0;
            var totalSGST = 0.0;
            var totalIGST = 0.0;
            var totalPd = 0.0;
            var totalUnitPrice = 0.0;
            var index = 1;
            var additionalDiscount = 0.0;
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var rowid = theItem.billNo;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='" + rowid + "index" + "'>").text(index++));
                row.append($("<td id='" + rowid + "productName" + "'>").text(theItem["productName"]));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["quantityPurchased"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["amountPerUnit"]));

                var c = parseFloat(theItem["quantityPurchased"]) * parseFloat(theItem["amountPerUnit"]);
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(c));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["cgst"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["sgst"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["igst"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["productDiscount"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right'>").text(parseFloat(theItem["amount"]).toFixed(2)));

                additionalDiscount = theItem["additionalDiscount"];

                $("#tabBpelVariableListBody").append(row);
                var temp = parseFloat(theItem["amountPerUnit"]) * parseFloat(theItem["quantityPurchased"]);
                totalUnitPrice = totalUnitPrice + (temp);

                totalPrice = parseFloat(theItem["totalAmount"]);
                totalCGST = totalCGST + ((temp * parseFloat(theItem["cgst"])) / 100);
                totalSGST = totalSGST + ((temp * parseFloat(theItem["sgst"])) / 100);
                totalIGST = totalIGST + ((temp * parseFloat(theItem["igst"])) / 100);
                totalPd = totalPd + ((temp * parseFloat(theItem["productDiscount"])) / 100);
                document.getElementById("custname").innerHTML = theItem["customerName"];
                document.getElementById("prescribername").innerHTML = theItem["prescriberName"];
                document.getElementById("custmobile").innerHTML = theItem["customerContact"];
                document.getElementById("prescriptionDate").innerHTML = theItem["prescriptionDate"];
                document.getElementById("custaddress").innerHTML = theItem["customerAddress"];
                document.getElementById("invoicenumber").innerHTML = theItem["billSerialNumber"];


            });

            var rowid = "row_unit_total";
            var row;
            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Total Unit Base Price (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:500;'>").text(totalUnitPrice.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_PD_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Total Product Discount (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:500;'>").text(totalPd.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_AddDis_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Additional Discount"));
            var c = parseFloat(additionalDiscount).toFixed(0);
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:500;'>").text("" + c + ""));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_CGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Total CGST PAID (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:500;'>").text(totalCGST.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_SGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Total SGST PAID (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;' align='right'>").text(totalSGST.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_IGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Total IGST PAID (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;' align='right'>").text(totalIGST.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_SGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;'>").text("Grand Total (Rs)"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:500;' align='right'>").text(totalPrice.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

        }
    });


}



function getPurchaseOrder() {

    var location = window.location.href;

    var locationA = location.split("?billNo=")

    var urlString = "/AvonMedicalService/rest/CoreService/getBillingDetailWithProducts?";
    urlString += "&billNo=" + locationA[1];

    $("#tabBpelVariableListBody").innerHTML = "";

    $.ajax({
        url: urlString
    }).then(function (data) {
        if (data) {

            var summary = data;


            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            var totalPrice = 0.0;
            var totalCGST = 0.0;
            var totalSGST = 0.0;
            var totalUnitPrice = 0.0;
            var index = 1;
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                var rowid = theItem.billNo;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");

                row.append($("<td id='" + rowid + "index" + "'>").text(index++));
                row.append($("<td id='" + rowid + "productName" + "'>").text(theItem["productName"]));
                // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["quantityPurchased"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["amountPerUnit"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["cgst"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(theItem["sgst"]));
                row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right'>").text(theItem["amount"]));

                $("#tabBpelVariableListBody").append(row);
                var temp = parseFloat(theItem["amountPerUnit"]) * parseFloat(theItem["quantityPurchased"]);
                totalUnitPrice = totalUnitPrice + (temp);
                totalPrice = totalPrice + parseFloat(theItem["amount"]);
                totalCGST = totalCGST + ((temp * parseFloat(theItem["cgst"])) / 100);
                totalSGST = totalSGST + ((temp * parseFloat(theItem["sgst"])) / 100);

            });

            var rowid = "row_unit_total";
            var row;
            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;'>").text("Total Unit Base Price"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:700;'>").text(totalUnitPrice.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_CGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;'>").text("Total CGST PAID"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' align='right' style='font-weight:700;'>").text(totalCGST.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_SGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;'>").text("Total SGST PAID"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;' align='right'>").text(totalSGST.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

            rowid = "row_SGST_total";

            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "index" + "'>").text(""));
            row.append($("<td id='" + rowid + "productName" + "'>").text(""));
            // row.append($("<td id='" + rowid + "_cusMobile" + "'>").text(theItem["productId"]));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;'>").text("Grand Total"));
            row.append($("<td id='" + rowid + "_totalAmountPaid" + "' style='font-weight:700;' align='right'>").text(totalPrice.toFixed(2)));
            $("#tabBpelVariableListBody").append(row);

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

    document.getElementById("billingDivMainTop").style.display = "block";
    document.getElementById("tdCustName").innerHTML = "<input type = 'text' id='custNameForBillingTxt' style = 'width:200px;height:20px'  />";
    document.getElementById("tdCustMobile").innerHTML = "<input type = 'text' id='custNameMobileNumberTxt' style = 'width:200px;height:20px'  />";
    totalPriceForBill = 0;
    document.getElementById("billingDivMainTopFinalBill").style.visibility = "hidden";
    document.getElementById("tableForOrder").innerHTML = "<thead>                            <tr>                                <th align='left'>Name </th>                                <th align='left'>Quantity </th>                                <th align='left'>Amount</th>														                            </tr>                        </thead>                        <tbody id='bpelInstSummayTabBody'>                        </tbody>";
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

function getBpelInstances(sortField, sortOrder) {
    var filterset = 0;
    $('#myModal').modal('show');

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

    $.ajax({
        url: urlString
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

                row.append($("<td id='" + rowid + "_date" + "'>").text(theItem["date"]));
                row.append($("<td id='" + rowid + "_productName" + "'>").text(theItem["productName"]));
                row.append($("<td id='" + rowid + "_packing" + "'>").text(theItem["packing"]));
                row.append($("<td id='" + rowid + "_quantityInShop" + "'>").text(theItem["quantityInShop"]));
                row.append($("<td id='" + rowid + "_free" + "'>").text(theItem["free"]));
                row.append($("<td id='" + rowid + "_batchNo" + "'>").text(theItem["batchNo"]));
                row.append($("<td id='" + rowid + "_expireDate" + "'>").text(theItem["expireDate"]));
                row.append($("<td id='" + rowid + "_mrp" + "'>").text(theItem["mrp"]));
                row.append($("<td id='" + rowid + "_amountPerUnit" + "'>").text(theItem["amountPerUnit"]));
                row.append($("<td id='" + rowid + "_vat" + "'>").text(theItem["vat"] + "%"));
                row.append($("<td id='" + rowid + "_discount" + "'>").text(theItem["discount"]));
                row.append($("<td id='" + rowid + "_total" + "'>").text(theItem["total"])); //**
                row.append($("<td id='" + rowid + "_company" + "'>").text(theItem["company"]));
                row.append($("<td id='" + rowid + "_distributerName" + "'>").text(theItem["distributerName"]));
                row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text(theItem["distributerNumber"]));
                $("#testInst").append(row);
            });

            $('#myModal').modal('hide');

            $('#testInst').DataTable();

            var seqno = 0;
            //Click on testInst table
            $('#testInst').on('click', 'td', function () {
                document.getElementById("addQuantityForBillingTxt").value = "";
                var trackingWindow = document.getElementById('myMessageTrackingWindow');
                //trackingWindow.style.width = "0%";
                trackingWindow.style.height = "0%";

                trid = $(this).attr('id'); // table row ID 
                trid = trid.substring(0, trid.lastIndexOf("_"));

                $('#myMessageTrackingWindow').modal('show');
                $('#bpelID').text(trid);

                document.getElementById("bpelName").innerHTML = document.getElementById(trid + "_productName").innerHTML;
                document.getElementById("quantity").innerHTML = document.getElementById(trid + "_quantityInShop").innerHTML;
                document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_amountPerUnit").innerHTML;
                document.getElementById("errorInQuantitySpn").innerHTML = "";

                var a = document.getElementById(trid + "_amountPerUnit").innerHTML;
                var v = document.getElementById(trid + "_vat").innerHTML;

                if (v.indexOf("%") > 0) {
                    v = v.substring(0, v.indexOf("%"));

                }

                document.getElementById("amountPerUnit").value = parseFloat(a) + parseFloat(a * (v / 100));

                var tmp = document.getElementById("amountPerUnit").value;

                if (tmp.indexOf(".") > 0) {
                    tmp = tmp.substring(0, (tmp.indexOf(".") + 3));
                }

                document.getElementById("amountPerUnit").value = tmp;
                document.getElementById("mrpForProduct").innerHTML = document.getElementById(trid + "_mrp").innerHTML;
                document.getElementById("vatForProduct").innerHTML = document.getElementById(trid + "_vat").innerHTML;
                //document.getElementById("expForProduct").innerHTML = document.getElementById(trid + "_expireDate").innerHTML;

                document.getElementById("addQuantityForBillingTxt").focus();

                var r = map[trid];

                var thediv = document.getElementById('myMessageTrackingWindow');

                thediv.style.visibility = "visible";

                var popup_height = document.getElementById('popup').offsetHeight;
                var popup_width = document.getElementById('popup').offsetWidth;
                $(".popup").css('top', (($(window).height() - popup_height) / 2));
                $(".popup").css('left', (($(window).width() - popup_width) / 2));


                $("#divPopupTableView").animate({
                    width: "100%"
                }, 500, function () {
                });
                $('#myMessageTrackingWindow').animate({
                    scrollTop: 0
                }, 1);


                $("#myMessageTrackingWindow").animate({
                    height: "50%"
                }, 500, "", function () {

                });
                //thediv.animate({ height: "200px" });


                tabActivityListTableRowRountInst = 0;
                tabActivityListPageNumber = 0;
                seqno = 0;








            });


            if (document.getElementById("divPopupTableView")) {
                $('#myModal').modal('hide');
            }



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


function fetchData() {

    var urlString = "/AvonMedicalService/rest/CoreService/getProductDetail?";

    var productIdForUpdateValue = document.getElementById("productIdForUpdate");
    if (productIdForUpdateValue) {
        if ($.trim(productIdForUpdateValue.value) != "") {
            urlString += "&productId=" + productIdForUpdateValue.value;
        }
        //productIdForUpdateValue.value = "";
    }



    $.ajax({
        url: urlString
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
                document.getElementById("quantityAddTxt").value = theItem["quantityInShop"];
                document.getElementById("freeAddTxt").value = theItem["free"];
                document.getElementById("batchNoAddTxt").value = theItem["batchNo"];
                document.getElementById("ExpiryDateAddTxt").value = theItem["expireDate"];
                document.getElementById("mrpAddTxt").value = theItem["mrp"];
                document.getElementById("amountAddTxt").value = theItem["amountPerUnit"];
                document.getElementById("vatAddTxt").value = theItem["vat"] + "%";
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

$(document).ready(function () {

    //var urlStringFinal = "";
    var urlStringFinal = "/AvonMedicalService/rest/CoreService/isValidLicece?dummy=1";
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        if (data["state"] > 0) {
            if (data["state"] <= 2) {
                alert("Your License is getting expired in " + data["state"] + " days, Please renew it, otherwise software will not work");
            }
        } else {
            //alert("Your licence is expired, Kindly send request for renewal");
            document.write("<font style='color:red;font-weight:700;'>Your licence is expired, Kindly \n\
    send request for renewal to BTech Software or call +919986881500 for support!</font>");
        }
    });

    $('#myModal').modal('show');

    //getInstanceSummaryList();
    //getBpelInstances();
    getCustomerInstances();
    //getSalesData();
    //getAllBpelServiceAssembly();
    //getCompositeAppAndBPEL();    
    //getAllServiceAssemblies();





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