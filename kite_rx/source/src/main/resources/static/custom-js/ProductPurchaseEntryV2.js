/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var onlyPending = 0;
var idForBilling = 0;
var updateWindow = 0;
var currentTab = 0;
var currenModal = 0;
var currenNameListIndex1 = 0
var currenNameListIndex2 = 0
var currenNameListIndex = 0;


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



$("#productNameFilterTxt").on('focusout', function (e) {

    try {
        //document.getElementById("nameListDiv").style.visibility = "hidden";
    } catch (err) {
    }
});

$("#productNameFilterTxt").on('focus', function (e) {

    try {
        updateWindow = -1;
    } catch (err) {
    }
});

$("#productNameFilterTxt").on('focusout', function (e) {

    try {
        //  updateWindow = 0;
    } catch (err) {
    }
});

$("#productNameFilterTxt").bind('keyup', function (e) {

    try {
        if (e.which === 13) {
            getCustomerInstances();
        } else {
            var arrowPressed = false;
            if (e.keyCode === 38 || e.keyCode === 40) {
                arrowPressed = true;
            }

            if (e.ctrlKey && e.which === 71) {
                $('#myMessageTrackingWindow').modal('show');
                arrowPressed = true;
                gCmd = 1;
                $("#btnGenerateBill").click();
                window.scrollTo(0, 0);
                return false;
            }

            if (!arrowPressed) {
                console.log("Getting names...");
                if (document.getElementById("productNameFilterTxt").value !== '') {
                    getAllProductNames1(e);
                    document.getElementById("nameListDiv1").style.visibility = "visible";
                }
            } else {
                document.getElementById("nameListDiv1").style.visibility = "hidden";
            }
        }
    } catch (err) {
    }
});

$("#custBatchFilterTxt").bind('keypress', function (e) {
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


function getCustomerInstances(isExported) {

    $('#myModal').modal('hide');
    document.getElementById("productNameFilterTxt").focus();

}


$('#tabReportBody').on('keyup', 'td', function (e) {
    if (e.keyCode === 13) {
        trid = $(this).attr('id');
        trid = trid.substring(0, trid.indexOf("_"));
        tableClicked(trid);
    }
});


function tableClicked(trid) {

    getAllCustomerNames();
    oldSelectedId = trid;

    var name = document.getElementById(trid + "_NAME").innerHTML;
    name = name.substring(name.indexOf('>') + 1);

    name = name.substr(0, name.indexOf('</a>'));

    var urlString = "/AvonMedicalService/rest/LadgerService/getCustomers?id=" + document.getElementById(trid + "_ID").innerHTML + "";
    var value = document.getElementById(trid + "_IMG").children[0].getAttribute("src");
    document.getElementById("userImgUp").setAttribute("src", value);


    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        var summary = data;
        if (data) {
            $.each(summary, function (i, theItem) {

                var today = new Date(theItem["CREATED_AT"]);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();


                document.getElementById("entryDate").innerHTML = dd + "/" + mm + "/" + yyyy;
                document.getElementById("custNameAs").innerHTML = name;
                document.getElementById("idAs").innerHTML = theItem["ID"];
                document.getElementById("customerNameUp").value = name;
                document.getElementById("contactNameUp").value = name;
                document.getElementById("addressUp").value = theItem["ADDRESS"];
                document.getElementById("emailUp").value = theItem["EMAIL"];
                document.getElementById("phoneUp").value = theItem["MOBILE"];
                document.getElementById("phone2Up").value = theItem["PHONE_1"];
                document.getElementById("totalBillUp").value = theItem["TOTAL_BILL_AMOUNT"];
                document.getElementById("totalCreditUp").value = theItem["TOTAL_CREDIT_ASOFNOW"];
                document.getElementById("maxCreditAllowedUp").value = theItem["MAX_CREDIT_AMOUNT"];
                document.getElementById("defaultDiscountUp").value = theItem["DEFAULT_DISCOUNT"];
                document.getElementById("customerType").value = theItem["TTYPE"];
                document.getElementById("accountType").value = theItem["IS_CREDIT_ACCOUNT"];
                document.getElementById("GSTIN").value = theItem["GSTIN"];
                document.getElementById("KEYWORDS").value = theItem["KEYWORDS"];
            });
        }
    });




    //document.getElementById("custNameAs").value = document.getElementById(trid + "_NAME").innerHTML;

    document.getElementById("popupasideBack").style.display = "block";
    updateWindow = 1;
    $("#popupaside").animate({left: '0px'});
    //document.getElementById("customerNameUp").style.backgroundColor = "#00ff00";
    document.getElementById("customerNameUp").focus();
    //window.open("Invoice.html?billNo=" + trid, "_blank");
}



function asideHelp3() {
    alert("Hell");
    document.getElementById("popupasideBack").style.display = "none";

    $("#popupaside").animate({left: '-2000px'});
    $("#popupasidepayment").animate({left: '10000px'});

    document.getElementById("idAs").innerHTML = "";
    document.getElementById("customerNameUp").value = "";
    document.getElementById("contactNameUp").value = "";
    document.getElementById("phoneUp").value = "";
    document.getElementById("addressUp").value = "";
    document.getElementById("emailUp").value = "";
    document.getElementById("accountType").value = "";
    document.getElementById("phone2Up").value = "";
    document.getElementById("customerType").value = "";
    document.getElementById("GSTIN").value = "";
    document.getElementById("KEYWORDS").value = "";

    document.getElementById("totalBillUp").value = "";
    document.getElementById("totalCreditUp").value = "";
    document.getElementById("paymentRsUp").value = "";
    document.getElementById("chequeNoUp").value = "";
    document.getElementById("cardNup").value = "";
    document.getElementById("ddNoUp").value = "";


    updateWindow = 0;
}

function asideClose() {
    document.getElementById("popupasideBack").style.display = "none";
    $("#popupaside").animate({left: '-2000px'});




    updateWindow = 0;
}

function showPaymentAside() {
    asideClose();
    document.getElementById("popupasideBack").style.display = "block";
    document.getElementById("popupasidepayment").style.display = "block";
    $("#popupasidepayment").animate({left: '0px'});
    document.getElementById("tabPayReportBody").innerHTML = "";
    var urlString = "/AvonMedicalService/rest/LadgerService/getCustomerPayments?id=" + document.getElementById("idAs").innerHTML + "&name=" + document.getElementById("customerNameUp").value;
    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        if (data) {
            updateWindow = 0;
            var summary = data;
            totalBPELInstances = summary.length;
            if (document.getElementById("totalBPELInstDiv")) {
                document.getElementById("totalBPELInstDiv").innerHTML = totalBPELInstances;
            }
            var sno = 1;
            var totalPrice = 0.0;
            var totalCGST = 0.0;
            var totalSGST = 0.0;
            var totalIGST = 0.0;
            $.each(summary, function (i, theItem) {

                tableRowRountInst++;

                //alert( "OOI New : " + theItem.bpelId );

                var rowid = theItem.ID;
                var row;

                row = $("<tr id='" + rowid + "' style='background-color:white;color:black;'></tr>");

                row.append($("<td id='" + rowid + "_ID" + "'>").text(theItem["CUSTOMER_ID"]));
                row.append($("<td id='" + rowid + "_NAME" + "'><a href='#' class='btn btn-link' style='color:black;'>" + theItem["NAME"] + "</a>"));


                row.append($("<td id='" + rowid + "_PAY_TYPE" + "'>").text(theItem["PAY_TYPE"]));
                if (theItem["PAYMENT_AGAINST_BILLNO"] !== null && theItem["PAYMENT_AGAINST_BILLNO"] !== '') {
                    row.append($("<td id='" + rowid + "_PAYMENT_AGAINST_BILLNO" + "'><a target='_blank' href='Invoice.html?billNo=" + theItem["PAYMENT_AGAINST_BILLNO"] + "' style='font-weight:700;color: Blue;'>" + theItem["PAYMENT_AGAINST_BILLNO"] + "</a>"));
                } else {
                    row.append($("<td id='" + rowid + "_PAYMENT_AGAINST_BILLNO" + "'><a href='#' style='font-weight:700;color: Blue;'></a>"));
                }
                row.append($("<td id='" + rowid + "_CHEQUE_NO" + "'>").text(theItem["CHEQUE_NO"]));
                row.append($("<td id='" + rowid + "_CARD_NO" + "'>").text(theItem["CARD_NO"]));
                row.append($("<td id='" + rowid + "_DD_NO" + "'>").text(theItem["DD_NO"]));
                var amt = parseFloat(theItem["PAYMENT_AMOUNT"]).toFixed(2);
                var bal = parseFloat(theItem["CREDIT_BALANCE"]).toFixed(2);
                row.append($("<td id='" + rowid + "_PAYMENT_AMOUNT" + "'>").text(amt));
                row.append($("<td id='" + rowid + "_CREDIT_BALANCE" + "'>").text(bal));

                var today = new Date(theItem["CREATED_AT"]);
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();

                row.append($("<td id='" + rowid + "CREATED_AT" + "' align='right'>").text(dd + "/" + mm + "/" + yyyy));

                $("#tabPayReportBody").append(row);
                //map[theItem.id] = theItem.bpelId;
            });

            //$("#tabReportBody").append(row);

            $('#myModal').modal('hide');

        } else {
            $('#myModal').modal('hide');
        }

    });

    updateWindow = 2;
}

function hidePaymentAside() {

    //document.getElementById("popupasidepayment").style.display = "none";
    $("#popupasidepayment").animate({left: '10000px'});

    if (document.getElementById("idAs").innerHTML !== '') {
        document.getElementById("popupaside").style.display = "block";
        $("#popupaside").animate({left: '0px'});
        updateWindow = 1;
    } else {
        document.getElementById("popupasideBack").style.display = "none";
    }

}

function removeNameList1() {
    document.getElementById("nameListDiv1").style.visibility = "hidden";

}

function removeBatchList1() {
    document.getElementById("batchListDiv1").style.visibility = "hidden";
}

function hideBatchdiv() {
    document.getElementById("batchListDiv1").style.visibility = "hidden";
    updateWindow = -1;
}
function getAllProductNames1(evnt) {
    document.getElementById("loadingNamesImg").style.display = "block";
    var urlString = "/AvonMedicalService/rest/CoreService/getProductNames?";
    var i1 = document.getElementById("productNameFilterTxt").value;
    if (i1 !== '') {
        urlString = urlString + "name=" + i1;
    }
    document.getElementById("batchListDiv1").style.visibility = "hidden";
    document.getElementById("custNameList1").innerHTML = "";
    document.getElementById("custBatchList1Body").innerHTML = "";

    currenNameListIndex = 0;
    currenNameListIndex1 = 0;
    currenNameListIndex2 = 0;

    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        var summary = data;
        if (data) {
            $.each(summary, function (i, theItem) {
                var row;
                row = $("<tr id='" + i + "'></tr>");
                //row.append($("<td id='" + theItem["NAME"] + "' onclick='selectCustomer1(this)'><a href='#' style='font-weight:700;color: white;' >" + theItem["NAME"] + "</a>"));

                row.append($("<td id='" + theItem["PRODUCT_NAME"] + "' onclick='selectCustomer1(this)'><a href='#' style='font-weight:700;color: white;' >" + theItem["PRODUCT_NAME"] + "</a>"));
                //row.append($("<td id='" + theItem["PRODUCT_NAME"] + "_ID'>" + theItem["PRODUCT_NAME"] + "").text("" + theItem["PRODUCT_NAME"] + ""));

                $("#custNameList1").append(row);

            });
            document.getElementById("loadingNamesImg").style.display = "none";

        }

        if (evnt.keyCode === 40) {
            currenNameListIndex1++;
        }

        if (evnt.keyCode === 38) {
            currenNameListIndex1--;
        }

        for (var i1 = 0; i1 < document.getElementById("custNameList1").children.length; i1++) {
            document.getElementById("custNameList1").children[i1].style.border = "";
            document.getElementById("custNameList1").children[i1].style.backgroundColor = "#21584e";
            //document.getElementById("bpelInstSummayTabBody3").children[currentTab - 1].style.fontSize = '14px';
        }

        if (evnt.keyCode === 40 || evnt.keyCode === 38) {

            document.getElementById("custNameList1").children[currenNameListIndex - 1].children[0].children[0].focus();

            document.getElementById("custNameList1").children[currenNameListIndex - 1].style.border = '0.2em solid black';
            document.getElementById("custNameList1").children[currenNameListIndex - 1].style.backgroundColor = '	#006400';
        }

    });
}

function updateQuantityZero() {
    var idArr = [];
    for (var i1 = 0; i1 < document.getElementById("custBatchList1Body").children.length; i1++) {
        if (document.getElementById("custBatchList1Body").children[i1].children[0].children[0].checked) {
            var ids = document.getElementById("custBatchList1Body").children[i1].children[0].children[0].id;
            ids = ids.substring(0, ids.indexOf('_chk'));
            idArr.push(ids);
        }
    }

    console.log(idArr);

    swal({
        title: "Are you sure to update product Quantity to 0 ?",
        text: "Your will not be able to recover this update!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, update this product quantity to 0",
        closeOnConfirm: true
    },
            function () {
                var data2;
                var kdone = 0;
                for (var i = 0; i < idArr.length; i++) {
                    var prodID = idArr[i];
                    var urlString = "/AvonMedicalService/rest/CoreService/updateProductDetailQuantityZero?productId=" + prodID;
                    $.ajax({
                        url: urlString
                    }).then(function (data) {
                        data2 = data;
                        if (data2 === true || data2 === 'true') {
                            document.getElementById("" + prodID + "_QUANTITY_IN_SHOP").innerHTML = '0.00';
                        }



                    });


                    if (i === (idArr.length - 1)) {
                        helloKeyboard();
                        kdone = 1;
                        swal({title: "Update Quantity to 0 ", text: "Product Data updated"});
                        document.getElementById("productNameFilterTxt").focus();
                        document.getElementById("productNameFilterTxt").select();
                        currenNameListIndex1 = 0;
                        document.getElementById("nameListDiv1").style.visibility = "hidden";
                        document.getElementById("batchListDiv1").style.visibility = "hidden";
                    }

                }

                document.getElementById("productNameFilterTxt").focus();
                document.getElementById("productNameFilterTxt").select();
                currenNameListIndex1 = 0;
                document.getElementById("nameListDiv1").style.visibility = "hidden";
                document.getElementById("batchListDiv1").style.visibility = "hidden";
                if (kdone === 0) {
                    helloKeyboard();
                    document.getElementById("productNameFilterTxt").focus();
                    document.getElementById("productNameFilterTxt").select();
                    currenNameListIndex1 = 0;
                    document.getElementById("nameListDiv1").style.visibility = "hidden";
                    document.getElementById("batchListDiv1").style.visibility = "hidden";
                }

                // if (data2 === true || data2 === 'true') {
                //swal({title: "Update Quantity to 0 ", text: "Product Data updated"});
                // } else {
                //     swal({title: "Not Updated!", text: "Product Data Not updated Due to some error!!"});
                //  }


            });



}


function deleteBulkProduct() {
    var idArr = [];
    for (var i1 = 0; i1 < document.getElementById("custBatchList1Body").children.length; i1++) {
        if (document.getElementById("custBatchList1Body").children[i1].children[0].children[0].checked) {
            var ids = document.getElementById("custBatchList1Body").children[i1].children[0].children[0].id;
            ids = ids.substring(0, ids.indexOf('_chk'));
            idArr.push(ids);
        }
    }

    console.log(idArr);

    swal({
        title: "Are you sure to delete entry?",
        text: "Your will not be able to recover this product!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete this product!",
        closeOnConfirm: true
    },
            function () {
                var data2;
                var kdone = 0;
                for (var i = 0; i < idArr.length; i++) {
                    var prodID = idArr[i];
                    var urlString = "/AvonMedicalService/rest/CoreService/deleteProductDetail?productId=" + prodID;
                    $.ajax({
                        url: urlString
                    }).then(function (data) {
                        data2 = data;
                        if (data2 === true || data2 === 'true') {

                        }

                    });

                    document.getElementById("" + prodID + "").style.color = 'silver';
                    document.getElementById("" + prodID + "").innerHTML = '';
                    document.getElementById("" + prodID + "_QUANTITY_IN_SHOP").innerHTML = '';
                    document.getElementById("" + prodID + "_MRP").innerHTML = '';
                    document.getElementById("" + prodID + "_PACKING").innerHTML = '';
                    document.getElementById("" + prodID + "_EXPIRE_DATE").innerHTML = '';
                    document.getElementById("" + prodID + "_QUANTITY_IN_SHOP").innerHTML = '';
                    document.getElementById("" + prodID + "_COMPANY").innerHTML = '';
                    document.getElementById("" + prodID + "_cgst").innerHTML = '';
                    document.getElementById("" + prodID + "_sgst").innerHTML = '';
                    document.getElementById("" + prodID + "_DRUG_SCHEDULE").innerHTML = '';
                    document.getElementById("" + prodID + "_DISTUBUTER_NAME").innerHTML = '';
                    document.getElementById("" + prodID + "CREATED_AT").innerHTML = '';
                    document.getElementById("" + prodID + "_FREE").innerHTML = '';
                    document.getElementById("" + prodID + "_PURCHASE_RATE").innerHTML = '';
                    document.getElementById("" + prodID + "_BATCH").innerHTML = '';
                    document.getElementById("" + prodID + "_MARGIN").innerHTML = '';
                    document.getElementById("" + prodID + "_chk").checked = false;
                    document.getElementById("" + prodID + "_chk").style.display = "none";

                    document.getElementById("productNameFilterTxt").focus();
                    document.getElementById("productNameFilterTxt").select();
                    currenNameListIndex1 = 0;
                    document.getElementById("nameListDiv1").style.visibility = "hidden";
                    document.getElementById("batchListDiv1").style.visibility = "hidden";
                    if (i === (idArr.length - 1)) {
                        helloKeyboard();
                        kdone = 1;
                        swal({title: "Deleted", text: "Product Data deleted from database"});
                    }

                }

                // if (data2 === true || data2 === 'true') {

                document.getElementById("productNameFilterTxt").focus();
                document.getElementById("productNameFilterTxt").select();
                currenNameListIndex1 = 0;
                document.getElementById("nameListDiv1").style.visibility = "hidden";
                document.getElementById("batchListDiv1").style.visibility = "hidden";
                if (kdone === 0) {
                    helloKeyboard();
                }
                // } else {
                //     swal({title: "Not Updated!", text: "Product Data Not updated Due to some error!!"});
                //  }


            });



}



var tooglechk = 0;
function selectAllCheck() {

    if (tooglechk === 0) {
        for (var i1 = 0; i1 < document.getElementById("custBatchList1Body").children.length; i1++) {
            document.getElementById("custBatchList1Body").children[i1].children[0].children[0].checked = true;
            //document.getElementById("bpelInstSummayTabBody3").children[currentTab - 1].style.fontSize = '14px';
        }
        tooglechk = 1;
    } else {
        for (var i1 = 0; i1 < document.getElementById("custBatchList1Body").children.length; i1++) {
            document.getElementById("custBatchList1Body").children[i1].children[0].children[0].checked = false;
            //document.getElementById("bpelInstSummayTabBody3").children[currentTab - 1].style.fontSize = '14px';
        }
        tooglechk = 0;
    }



}

var selectedProductName = '';
function getAllProductBatches1(evnt) {
    var urlString = "/AvonMedicalService/rest/CoreService/getProductBatches?";
    var i1 = document.getElementById("productNameFilterTxt").value;
    if (i1 !== '') {
        urlString = urlString + "name=" + i1;
    }

    document.getElementById("custBatchList1Body").innerHTML = "";
    $.ajax({
        url: urlString
    }).then(function (data) {
        //alert(data);
        var summary = data;
        var count = 0;
        if (data) {
            updateWindow = -2;

            $.each(summary, function (i, theItem) {
                var row;

                row = $("<tr id='" + i + "'></tr>");
                //row.append($("<td id='" + theItem["NAME"] + "' onclick='selectCustomer1(this)'><a href='#' style='font-weight:700;color: white;' >" + theItem["NAME"] + "</a>"));
                var rowid = theItem["PRODUCT_ID"];

                row.append($("<td><input type='checkbox' id='" + rowid + "_chk' /><a id='" + rowid + "' href='#' style='font-weight:700;color: white;'  onclick='selectBatch1(this)'>" + theItem["PRODUCT_NAME"] + "</a>"));

                //row.append($("<td id='" + rowid + "_BATCH'>").text("" + theItem["BATCH_NO"] + ""));
                row.append($("<td id='" + rowid + "CREATED_AT" + "'>").text(theItem["DATE"]));
                row.append($("<td id='" + rowid + "_BATCH" + "'>").text(theItem["BATCH_NO"]));
                row.append($("<td id='" + rowid + "_PACKING" + "'>").text(theItem["PACKING"]));
                while (theItem["MRP"].includes(",")) {
                    theItem["MRP"] = theItem["MRP"].replace(",", "");
                }
                row.append($("<td id='" + rowid + "_MRP" + "'>").text(theItem["MRP"]));
                row.append($("<td id='" + rowid + "_PURCHASE_RATE" + "'>").text(theItem["PURCHASE_RATE"]));
                row.append($("<td id='" + rowid + "_EXPIRE_DATE" + "'>").text(theItem["EXPIRE_DATE"]));

                var qa = "";

                try {
                    qa = parseFloat(theItem["QUANTITY_IN_SHOP"]).toFixed(2);
                } catch (Error) {

                }

                row.append($("<td id='" + rowid + "_QUANTITY_IN_SHOP" + "'>").text(qa));

                var FREE = "";

                try {
                    FREE = parseFloat(theItem["FREE"]).toFixed(2);
                } catch (Error) {

                }

                row.append($("<td id='" + rowid + "_FREE" + "'>").text(FREE));
                row.append($("<td id='" + rowid + "_COMPANY" + "'>").text(theItem["COMPANY"]));
                row.append($("<td id='" + rowid + "_DISTUBUTER_NAME" + "'>").text(theItem["DISTUBUTER_NAME"]));
                row.append($("<td id='" + rowid + "_DRUG_SCHEDULE" + "'>").text(theItem["DRUG_SCHEDULE"]));
                
//                if (theItem["cgst"] === '' || theItem["cgst"] === null || theItem["cgst"] === 'null') {
//                    row.append($("<td id='" + rowid + "_cgst" + "'>").text("0.00"));
//                } else {
//                    row.append($("<td id='" + rowid + "_cgst" + "'>").text(theItem["cgst"]));
//                }
//
//                if (theItem["sgst"] === '' || theItem["sgst"] === null || theItem["sgst"] === 'null') {
//                    row.append($("<td id='" + rowid + "_sgst" + "'>").text("0.00"));
//                } else {
//                    row.append($("<td id='" + rowid + "_sgst" + "'>").text(theItem["sgst"]));
//                }
                
                if (!theItem["CGST"]) {
                    row.append($("<td id='" + rowid + "_cgst" + "'>").text("0.00"));
                } else if (theItem["CGST"] === '' || theItem["CGST"] === null || theItem["CGST"] === 'null') {
                    row.append($("<td id='" + rowid + "_cgst" + "'>").text("0.00"));
                } else {
                    
                    row.append($("<td id='" + rowid + "_cgst" + "'>").text(theItem["CGST"]));
                }

                if (!theItem["SGST"]) {
                    row.append($("<td id='" + rowid + "_sgst" + "'>").text("0.00"));
                } else if (theItem["SGST"] === '' || theItem["SGST"] === null || theItem["SGST"] === 'null') {
                    row.append($("<td id='" + rowid + "_sgst" + "'>").text("0.00"));
                } else {
                    row.append($("<td id='" + rowid + "_sgst" + "'>").text(theItem["SGST"]));
                }

                var margin = "";

                try {
                    margin = parseFloat(theItem["MARGIN"]).toFixed(2);
                } catch (Error) {

                }
                if (isNaN(margin) || margin === 'NaN') {
                    row.append($("<td id='" + rowid + "_MARGIN" + "'>").text("--"));
                } else {
                    row.append($("<td id='" + rowid + "_MARGIN" + "'>").text(margin));
                }

                count++;
                $("#custBatchList1Body").append(row);

            })
        }

        if (evnt.keyCode === 40) {
            currenNameListIndex2++;
        }

        if (evnt.keyCode === 38) {
            currenNameListIndex2--;
        }

        for (var i1 = 0; i1 < document.getElementById("custBatchList1").children.length; i1++) {
            document.getElementById("custBatchList1").children[i1].style.border = "";
            document.getElementById("custBatchList1").children[i1].style.backgroundColor = "#21584e";
            //document.getElementById("bpelInstSummayTabBody3").children[currentTab - 1].style.fontSize = '14px';
        }

        if (evnt.keyCode === 40 || evnt.keyCode === 38) {

            document.getElementById("custBatchList1").children[currenNameListIndex2 - 1].children[0].children[0].focus();

            document.getElementById("custNameList1").children[currenNameListIndex2 - 1].style.border = '0.2em solid black';
            document.getElementById("custNameList1").children[currenNameListIndex2 - 1].style.backgroundColor = '	#006400';
        }

    });
}

function getProductReport() {
    var urlString = "/AvonMedicalService/rest/CoreService/getBillingDetailForProduct?maxrecord=2000";

    var productNameFilterTxt = document.getElementById("productNameFilterTxt");
    var someFilterSet = false;
    if (productNameFilterTxt) {
        if ($.trim(productNameFilterTxt.value) !== "") {
            urlString += "&productName=" + productNameFilterTxt.value;
            someFilterSet = true;
        }

    }

    var custBatchFilterTxt = document.getElementById("custBatchFilterTxt");
    if (custBatchFilterTxt) {
        if ($.trim(custBatchFilterTxt.value) !== "") {
            urlString += "&batch=" + custBatchFilterTxt.value;
            someFilterSet = true;
        }
    }

    var yearTxtValue = document.getElementById("Year");
    if (yearTxtValue) {
        if ($.trim(yearTxtValue.value) !== "") {
            var monthTxtValue = document.getElementById("Month");
            if (monthTxtValue) {
                if ($.trim(monthTxtValue.value) !== "") {
                    var dateTxtValue = document.getElementById("Date");
                    if (dateTxtValue) {
                        if ($.trim(dateTxtValue.value) !== "") {
                            urlString += "&dateFilter=" + dateTxtValue.value + "/" + monthTxtValue.value + "/" + yearTxtValue.value;
                            someFilterSet = true;
                        } else {
                            urlString += "&dateFilter=" + monthTxtValue.value + "/" + yearTxtValue.value;
                            someFilterSet = true;
                        }
                    } else {
                        urlString += "&dateFilter=" + monthTxtValue.value + "/" + yearTxtValue.value;
                        someFilterSet = true;
                    }
                }
            }
            //bpelFilterTxtValue.value = "";
        }
    }

    //getBillingDetailForProduct
    if (!someFilterSet) {
        swal({title: "Please select a product", text: "type name in name filter"});
        document.getElementById("productNameFilterTxt").focus();
    }

    //document.getElementById("filterSpn").innerHTML = "<b> Name : " + document.getElementById("productNameFilterTxt").value + ", Batch : " + document.getElementById("custBatchFilterTxt").value + "</b>"; 
    document.getElementById("tabReportBody").innerHTML = "";
    $.ajax({
        url: urlString
    }).then(function (data) {
        if (data.length === 0) {
            swal({title: "No sales record found for selected filters ! ", text: "type name in name filter"}, function () {
                document.getElementById("productNameFilterTxt").focus();
            });
            //
        }
        if (data) {
            // console.log(data);
            var sno = 1;
            var totalAmountBill = 0.0;
            $.each(data, function (i, theItem) {
                var rowid = theItem.billSerialNumber;
                var row;
                row = $("<tr id='" + rowid + "'></tr>");
                row.append($("<td id='" + rowid + "_custName" + "'>").text(sno++));
                row.append($("<td id='" + rowid + "_billNo" + "'><a href='Invoice.html?billNo=" + theItem["billSerialNumber"] + "'>" + theItem["billSerialNumber"] + "</a>"));
                row.append($("<td id='" + rowid + "_billPrintNo" + "'>").text(theItem["billPrintNo"]));
                row.append($("<td id='" + rowid + "_billDate" + "'>").text(theItem["billDate"]));
                row.append($("<td id='" + rowid + "_paymentType" + "'>").text(theItem["paymentType"]));
                row.append($("<td id='" + rowid + "_customerName" + "'>").text(theItem["customerName"]));
                row.append($("<td id='" + rowid + "_creditStatus" + "'>").text(theItem["creditStatus"]));
                row.append($("<td id='" + rowid + "_productName" + "'>").text(theItem["productName"]));
                row.append($("<td id='" + rowid + "_batchNumber" + "'>").text(theItem["batchNumber"]));
                row.append($("<td id='" + rowid + "_packing" + "'>").text(theItem["packing"]));
                row.append($("<td id='" + rowid + "_expiryDate" + "'>").text(theItem["expiryDate"]));
                row.append($("<td id='" + rowid + "_quantityPurchased" + "'>").text(theItem["quantityPurchased"]));
                while (theItem["mrp"].includes(",")) {
                    theItem["mrp"] = theItem["mrp"].replace(",", "");
                }
                row.append($("<td id='" + rowid + "_mrp" + "'>").text(theItem["mrp"]));
                row.append($("<td id='" + rowid + "_totalAmount" + "' style='text-align:right;'>").text(theItem["totalAmount"]));
                totalAmountBill = totalAmountBill + parseFloat(theItem["totalAmount"]);
                $("#tabReportBody").append(row);
            });


            var userRole = localStorage.getItem("userRole");

            if (userRole !== 'superadmin') {
                document.getElementById("totalSaleSpn").innerHTML = " #OnlyForAdmin#";
            } else {
                document.getElementById("totalSaleSpn").innerHTML = " Total Sale Amount : " + parseFloat(totalAmountBill).toFixed(2);
            }


            var rowid = 'grand';
            row = $("<tr id='" + rowid + "'></tr>");
            row.append($("<td id='" + rowid + "_custName" + "'>").text(""));
            row.append($("<td id='" + rowid + "_billNo" + "'><a href='Invoice.html?billNo=" + "" + "'></a>"));
            row.append($("<td id='" + rowid + "_billPrintNo" + "'>").text(""));
            row.append($("<td id='" + rowid + "_billDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_paymentType" + "'>").text(""));
            row.append($("<td id='" + rowid + "_customerName" + "'>").text(""));
            row.append($("<td id='" + rowid + "_creditStatus" + "'>").text(""));
            row.append($("<td id='" + rowid + "_productName" + "'>").text(""));
            row.append($("<td id='" + rowid + "_batchNumber" + "'>").text(""));
            row.append($("<td id='" + rowid + "_packing" + "'>").text(""));
            row.append($("<td id='" + rowid + "_expiryDate" + "'>").text(""));
            row.append($("<td id='" + rowid + "_quantityPurchased" + "'>").text(""));
            row.append($("<td id='" + rowid + "_mrp" + "'>").text(""));
            row.append($("<td id='" + rowid + "_totalAmount" + "' style='font-size:20px;font-weight:700;color:red;'>").text(parseFloat(totalAmountBill).toFixed(2)));

            $("#tabReportBody").append(row);


        }
    });


}

$(document).ready(function () {

});

var productAdded = 0;
function selectBatch1(ref) {
    
    if(productAdded > 0){
        addNewProductEntryRowV2();
    }
    
    idForBilling = ref.id;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[18].children[0].value = idForBilling;
    var a = ref.innerHTML;
    a = a.substring(a.indexOf('>') + 1);

    a = a.substr(0, a.indexOf('</a>'));

    //alert(document.getElementById("" + idForBilling).innerHTML);

    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].children[0].value = document.getElementById("" + idForBilling).innerHTML;

    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[10].children[0].value = document.getElementById("" + idForBilling + "_PURCHASE_RATE").innerHTML;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[2].children[0].value = document.getElementById("" + idForBilling + "_PACKING").innerHTML;
    trid = idForBilling; // table row ID 
    finalBilling = 0;

    var packing;
    if (document.getElementById(trid + "_PACKING").innerHTML.indexOf(" ") > 0) {
        packing = document.getElementById(trid + "_PACKING").innerHTML.substring
                (0, document.getElementById(trid + "_PACKING").innerHTML.indexOf(" "));
    } else {
        packing = document.getElementById(trid + "_PACKING").innerHTML;
    }

    var str = document.getElementById(trid + "_PACKING").innerHTML;
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
        if (document.getElementById(trid + "_FREE").innerHTML.indexOf(" ") !== -1) {
            free = document.getElementById(trid + "_FREE").innerHTML.substring(0, document.getElementById(trid + "_FREE").innerHTML.indexOf(" "));
        } else {
            free = document.getElementById(trid + "_FREE").innerHTML;
        }
    } catch (err) {

    }
    free = parseFloat(free);
    if (isNaN(free)) {
        free = 0;
    }
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[9].children[0].value = document.getElementById(trid + "_DRUG_SCHEDULE").innerHTML;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[4].children[0].value = free;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[5].children[0].value = document.getElementById(trid + "_BATCH").innerHTML;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[6].children[0].value = document.getElementById(trid + "_EXPIRE_DATE").innerHTML;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[14].children[0].value = document.getElementById(trid + "_COMPANY").innerHTML;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[3].children[0].value = document.getElementById(trid + "_QUANTITY_IN_SHOP").innerHTML

    var mrp1 = document.getElementById(trid + "_MRP").innerHTML;
    var pRate1 = document.getElementById(trid + "_PURCHASE_RATE").innerHTML;

    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[8].children[0].value = parseFloat(mrp1 / packing).toFixed(4);
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[10].children[0].value = parseFloat(pRate1 / packing).toFixed(4);

    var totalTax = 0.00;
    if (document.getElementById(trid + "_cgst")) {
        document.getElementById("cgstTaxInfo").innerHTML = document.getElementById(trid + "_cgst").innerHTML;
        var c = document.getElementById(trid + "_cgst").innerHTML;
        totalTax += parseInt(c);
    }

    if (document.getElementById(trid + "_sgst")) {
        document.getElementById("sgstTaxInfo").innerHTML = document.getElementById(trid + "_sgst").innerHTML;
        var s = document.getElementById(trid + "_sgst").innerHTML;
        totalTax += parseInt(s);
    }

    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[11].children[0].value = totalTax;
    try {
        document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[16].children[0].value = document.getElementById(trid + "_DISTUBUTER_NAME").innerHTML;
        
        
    } catch (err) {

    }

    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[7].children[0].value = mrp1;

    currenNameListIndex1 = 0;
    currenNameListIndex2 = 0;
    updateWindow = 0;
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].children[0].focus();
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].style.border = '0.3em solid black';
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].style.backgroundColor = '#6DFD2A';
    document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].children[0].select();

    removeBatchList1();
    productAdded++;
}


function addNewProductEntryRowV2() {

    for (var i = 0; i < document.getElementById("bpelInstSummayTabBody3").children.length; i++) {
        var arr = [];
        for (var j = 0; j < document.getElementById("bpelInstSummayTabBody3").children[i].children.length; j++) {
            arr[j] = document.getElementById("bpelInstSummayTabBody3").children[i].children[j].children[0].value;
        }
        tempMapHolderValue[i] = arr;
    }

    if (isFirstTimePlus === 0) {
        firstRowRefAdded = document.getElementById("bpelInstSummayTabBody3").innerHTML;
        isFirstTimePlus = 1;
    }

    rowNumber++;
    document.getElementById("bpelInstSummayTabBody3").innerHTML += firstRowRefAdded;

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

    for (var i = 0; i < document.getElementById("bpelInstSummayTabBody3").children.length; i++) {
        if (i === rowNumber) {
            //alert(document.getElementById("bpelInstSummayTabBody3").children[i].children.length);

            for (var j = 0; j < document.getElementById("bpelInstSummayTabBody3").children[i].children.length; j++) {
                document.getElementById("bpelInstSummayTabBody3").children[i].children[j].children[0].id = "" + document.getElementById("bpelInstSummayTabBody3").children[i].children[j].children[0].id + "_" + rowNumber;
            }

        }
        if (document.getElementById("dateAddTxt_" + i)) {
            document.getElementById("dateAddTxt_" + i).value = today;
        } else if (i === 0) {
            if (document.getElementById("dateAddTxt")) {
                document.getElementById("dateAddTxt").value = today;
            }
        }
    }

    for (var j1 = 0; j1 < document.getElementById("bpelInstSummayTabBody3").children.length; j1++) {
        for (var i1 = 0; i1 < document.getElementById("bpelInstSummayTabBody3").children[j1].children.length; i1++) {
            document.getElementById("bpelInstSummayTabBody3").children[j1].children[i1].style.border = "";
            document.getElementById("bpelInstSummayTabBody3").children[j1].children[i1].style.backgroundColor = "#ffffff";

            if (tempMapHolderValue[j1]) {
                var arr = tempMapHolderValue[j1];
                document.getElementById("bpelInstSummayTabBody3").children[j1].children[i1].children[0].value = arr[i1];
            }

        }
    }
    currentRowIndex++;
    try {
        document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].children[0].focus();
        document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].style.border = '0.3em solid black';
        document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].style.backgroundColor = '#6DFD2A';
        document.getElementById("bpelInstSummayTabBody3").children[currentRowIndex].children[1].children[0].select();
    } catch (err) {
        //alert(err);
    }
    currentTab = 2;
    console.log("Loging values..");
}



function selectCustomer1(ref) {
    idForBilling = ref.id;
    var a = ref.innerHTML;
    a = a.substring(a.indexOf('>') + 1);

    a = a.substr(0, a.indexOf('</a>'));

    document.getElementById("productNameFilterTxt").value = a;
    document.getElementById("productNameFilterTxt").style.border = '';
    document.getElementById("custBatchFilterTxt").focus();

    //document.getElementById("custBatchFilterTxt").style.border = '0.17em solid orange';

    //document.getElementById("creditReportDiv").style.display = "block";
    //fetchCreditReport(document.getElementById("custNameForBillingTxt").value);

    //Call BatchNo .. 

    console.log("Getting batches...");
    getAllProductBatches1();
    document.getElementById("batchListDiv1").style.visibility = "visible";


    currenNameListIndex1 = 0;

    //currentTab++;

    removeNameList1();
}

function removeBatchList() {
    document.getElementById("batchListDiv1").style.visibility = "hidden";
}

