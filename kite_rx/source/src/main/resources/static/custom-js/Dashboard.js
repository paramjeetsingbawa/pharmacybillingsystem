/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var currentRowIndex = 0;
var productIdsForBilling = [];
var quantityListForBilling = [];
var isProductReturnedForBilling = [];
var amountPerUnitListForBilling = [];
var amountTotalListForBilling = [];
var cgstArr = [];
var sgstArr = [];
var igstArr = [];
var productDiscountArr = [];
var billInit = 0;
var deleteId = -1;
var orderGenerated = -1;
var finalBilling = 0;
var isSearchedProduct = 0;
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

    try {
        var profit = calculateProfit();
        document.getElementById("totalEstimatedProfit").innerHTML = profit;
    } catch (err) {

    }

    if (e.which == 13) {
        addProductForBilling();
    }
});

$("#addQuantityForBillingTxt").bind('keyup', function (e) {

    try {
        var profit = calculateProfit();
        document.getElementById("totalEstimatedProfit").innerHTML = profit;
    } catch (err) {
    }
});

$("#amountPerUnit").bind('keyup', function (e) {
    try {
        var profit = calculateProfit();
        document.getElementById("totalEstimatedProfit").innerHTML = profit;
    } catch (err) {
    }
});

var orgProfit = 0.0;
$("#additionalDicount").bind('keyup', function (e) {
    //if (e.which == 13) {
    try {
        var totalAmount = document.getElementById('amountTotalForFill').innerHTML;
        var additionalDiscount = document.getElementById("additionalDicount").value;

        if (additionalDiscount !== "") {
            var totalAmountFinal = totalAmount - parseFloat(additionalDiscount).toFixed(4);
            if (document.getElementById("totalInvProfile")) {
                var totalProfit = orgProfit - parseFloat(additionalDiscount);
                if (totalProfit <= 0) {
                    $("#prfimg").attr("src", "img/sad.png");
                } else {
                    $("#prfimg").attr("src", "img/smile.png");
                }
                document.getElementById("totalInvProfile").innerHTML = totalProfit;
            }
            var gA = parseFloat(totalAmountFinal).toFixed(4);
            document.getElementById("amountTotalForFillWithDiscount").innerHTML = gA;
        } else {
            var totalAmountFinal = totalAmount - parseFloat("0").toFixed(4);
            var gA = parseFloat(totalAmountFinal).toFixed(4);
            document.getElementById("amountTotalForFillWithDiscount").innerHTML = gA;
            document.getElementById("totalInvProfile").innerHTML = orgProfit;
        }


    } catch (err) {

    }
    //}
});




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
        //alert(err);
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

            document.getElementById("amountAddTxt" + rown).value = c.toFixed(4);
        } else {
            var c = parseFloat(totalAmount);
            document.getElementById("amountAddTxt" + rown).value = c.toFixed(4);
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
        //alert(err);
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

            var aM = parseFloat(mrpText);

            var a3 = aM - a2;
            var a4 = a3 / (aM / 100);
            document.getElementById("marginTxt" + rown).value = a4 + "%";

        }



    } catch (err) {

    }

}



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

function calculateProfit() {
    try {
        var quantity = document.getElementById("addQuantityForBillingTxt").value;
        var amountPerUnit = document.getElementById("amountPerUnit").value;
        var pramountPerUnit = document.getElementById("pramountPerUnit").value;
        var pRateInfo = document.getElementById("amountPerUnit1").innerHTML;
        var cgstInfo = document.getElementById("cgstTaxInfo").innerHTML;
        var sgstInfo = document.getElementById("sgstTaxInfo").innerHTML;

        var p1 = parseFloat(pRateInfo);
        var p2 = parseFloat(pramountPerUnit);
        var p3 = parseFloat(amountPerUnit);
        var q1 = parseFloat(quantity);
        var t1 = parseFloat(cgstInfo);
        var t2 = parseFloat(sgstInfo);
        var t3 = t1 + t2;
        var totalValueToMe = p2 * q1;
        totalValueToMe = totalValueToMe + ((totalValueToMe * t3) / 100);
        console.log("totalValueToMe : " + totalValueToMe);

        if (isNaN(totalValueToMe)) {
            document.getElementById("redAlert").style.display = "block";
            document.getElementById("yellowAlert").style.display = "block";
            return "";
        }
        var totalValueToCust = p3 * q1;
        console.log("totalValueToCust : " + totalValueToCust);

        var myProfile = totalValueToCust - totalValueToMe;
        console.log("myProfile : " + myProfile);

        try {
            if (myProfile < 0) {
                document.getElementById("profitDiv").color = "red";
                document.getElementById("redAlert").style.display = "block";
                document.getElementById("yellowAlert").style.display = "none";
                //profitDiv
                //
            } else if (myProfile === 0) {
                document.getElementById("profitDiv").color = "#e68a00";
                document.getElementById("yellowAlert").style.display = "block";
                document.getElementById("redAlert").style.display = "none";
            } else {
                //redAlert
                document.getElementById("profitDiv").color = "seagreen";
                document.getElementById("yellowAlert").style.display = "none";
                document.getElementById("redAlert").style.display = "none";
            }
        } catch (err2) {

        }

        return myProfile;


    } catch (err) {
        document.getElementById("profitDiv").style.display = "none";

    }
}

function calculateProfitRef(quantity, amountPerUnit, pramountPerUnit, pRateInfo, cgstInfo, sgstInfo) {
    try {
        var p1 = parseFloat(pRateInfo);
        var p2 = parseFloat(pramountPerUnit);
        var p3 = parseFloat(amountPerUnit);
        var q1 = parseFloat(quantity);
        var t1 = parseFloat(cgstInfo);
        var t2 = parseFloat(sgstInfo);
        var t3 = t1 + t2;
        var totalValueToMe = p2 * q1;
        totalValueToMe = totalValueToMe + ((totalValueToMe * t3) / 100);
        console.log("totalValueToMe : " + totalValueToMe);

        if (isNaN(totalValueToMe)) {
            document.getElementById("redAlert").style.display = "block";
            document.getElementById("yellowAlert").style.display = "block";
            return "";
        }
        var totalValueToCust = p3 * q1;
        console.log("totalValueToCust : " + totalValueToCust);

        var myProfile = totalValueToCust - totalValueToMe;
        console.log("myProfile : " + myProfile);

        try {
            if (myProfile < 0) {
                document.getElementById("profitDiv").color = "red";
                document.getElementById("redAlert").style.display = "block";
                document.getElementById("yellowAlert").style.display = "none";
                //profitDiv
                //
            } else if (myProfile === 0) {
                document.getElementById("profitDiv").color = "#e68a00";
                document.getElementById("yellowAlert").style.display = "block";
                document.getElementById("redAlert").style.display = "none";
            } else {
                //redAlert
                document.getElementById("profitDiv").color = "seagreen";
                document.getElementById("yellowAlert").style.display = "none";
                document.getElementById("redAlert").style.display = "none";
            }
        } catch (err2) {

        }

        return myProfile;


    } catch (err) {
        document.getElementById("profitDiv").style.display = "none";

    }
}

function addProductForBilling() {

    var row;
    var rowid = document.getElementById("bpelID").innerHTML;
    var productName = document.getElementById("bpelName").innerHTML;
    var packing = document.getElementById("packingInfo").innerHTML;
    var quantity = document.getElementById("addQuantityForBillingTxt").value;
    var amountPerUnit = document.getElementById("amountPerUnit").value;
    var pRateInfo = document.getElementById("amountPerUnit1").innerHTML;
    var cgstInfo = document.getElementById("cgstTaxInfo").innerHTML;
    var sgstInfo = document.getElementById("sgstTaxInfo").innerHTML;

    var q1 = parseFloat(quantity);
    if (quantity === '' || quantity.trim() === '' || isNaN(q1)) {
        swal({title: "Quantity can not be empty !", text: "Please enter a valid quantity"});
        return;
    }

    var profit = calculateProfit();

    if (profit <= 0) {
        if (profit !== '') {
            swal({title: "Profit Risk !", text: "Total Estimated profit : " + profit});
        }
    }


    var isProductRetruned = document.getElementById("isProductReturned").value;

    var cgstPrice;
    var sgstPrice;
    var igstPrice;
    var productDiscountPrice;

    var v4 = document.getElementById("productDiscount").innerHTML;

    if (v4.indexOf("%") > 0) {
        productDiscountPrice = v4.substring(0, v4.indexOf("%"));

    }
    //sgst = document.getElementById("vatForProduct").innerHTML;

    var quantityInShop = document.getElementById("quantity").innerHTML;

    if (!quantity) {
        return;
    }

    if (isNaN(quantity) || parseFloat(quantity).toFixed(4) === '0.00') {
        swal({title: "Validation Error", text: "Invalid input, please type a valid number(1..9)!"});
        return;
    }

    if (parseFloat(quantity).toFixed(4) === '0.00' || isNaN(quantity) || isNaN(quantityInShop) || isNaN(amountPerUnit)) {
        if (parseFloat(quantity).toFixed(4) === '0.00') {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Quantity can not be zero!</b>";
        } else if (isNaN(quantity)) {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Quantity entered is not a valid number!</b>";
        } else if (isNaN(quantityInShop)) {
            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Quantity Available Entry is not a valid number!</b>";
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
        //alert("Product quantity not available in stock !! " + " Available quantity = " +  quantityInShop + ", Order quantity = " + quantity);
        return;
    }

    if ((quantityInShop - quantity) < 0) {

        if (isProductRetruned === "N") {

            document.getElementById("errorInQuantitySpn").innerHTML = "<b>Product quantity not available in stock !! " + " Available quantity = " + quantityInShop + ", Order quantity = " + quantity + "</b>";


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
            //alert("Product quantity not available in stock !! " + " Available quantity = " +  quantityInShop + ", Order quantity = " + quantity);
            return;
        }
    }

    var pramountPerUnit = document.getElementById("pramountPerUnit").value;
    deleteId++;
    row = $("<tr id='billingrow_" + deleteId + "'></tr>");
    //row.append($("<td id='billing_" +rowid + "_productName" + "'>").text(productName));		
    row.append($("<td id='billing_" + deleteId + "" + "'>").html("<button class='btn btn-danger' id='delete_" + deleteId + "' onclick='deleteProductFromSales(this)'> Delete </button>"));
    row.append($("<td id='billing_" + rowid + "_productId" + "'>").text(rowid));
    row.append($("<td id='billing_" + rowid + "_productName" + "'>").text(productName));
    row.append($("<td id='billing_" + rowid + "_packing" + "'>").text(packing));
    row.append($("<td id='billing_" + rowid + "_batchModel1" + "'>").text(document.getElementById("batchModel1").innerHTML));
    row.append($("<td id='billing_" + rowid + "_expiryDateModel1" + "'>").text(document.getElementById("expiryDateModel1").innerHTML));
    row.append($("<td id='billing_" + rowid + "_mrpForProduct" + "'>").text(document.getElementById("mrpForProduct").innerHTML));
    row.append($("<td id='billing_" + rowid + "_pRateForProduct" + "'>").text(document.getElementById("amountPerUnit1").innerHTML));
    row.append($("<td id='billing_" + rowid + "_pramountPerUnit" + "'>").text(pramountPerUnit));
    row.append($("<td id='billing_" + rowid + "_cgstProduct" + "'>").text(cgstInfo));
    row.append($("<td id='billing_" + rowid + "_sgstForProduct" + "'>").text(sgstInfo));

    row.append($("<td id='billing_" + rowid + "_companyModel1" + "'>").text(document.getElementById("companyModel1").innerHTML));
    row.append($("<td id='billing_" + rowid + "_quantity" + "'>").text(quantity));
    row.append($("<td id='billing_" + rowid + "_amount" + "'>").text(amountPerUnit));
    row.append($("<td id='billing_" + rowid + "_isProductRetruned" + "'>").text(isProductRetruned));

    var i1 = parseFloat(amountPerUnit).toFixed(4);
//    cgst = parseFloat(cgstPrice).toFixed(4);
//    sgst = parseFloat(sgstPrice).toFixed(4);
//    var igst;
//    if (igst != "") {
//        igst = parseFloat(igstPrice).toFixed(4);
//    } else {
//        igst = 0.0;
//    }

    var pd = 0.0;
    var totalTempam = 0.0;

    try {
        totalTempam = (parseFloat(amountPerUnit) * parseFloat(quantity)).toFixed(4);
    } catch (error) {
        totalTempam = 0.0;
        swal({title: "Validation Error", text: "Problem while calculating total.. cancelling the billing"});
        return;
    }

    var ti = totalTempam;
    ti = ti - ((ti * pd) / 100);
    if (isProductRetruned === "Y") {
        var titemp = "-" + ti;
        ti = parseFloat(titemp).toFixed(4);
    }

    row.append($("<td id='billing_" + rowid + "_total" + "'>").text(parseFloat(ti).toFixed(4)));
    if ($("<td id='billing_" + rowid + "_total" + "'>").text === "NaN") {
        //alert("Problem while calculating total.. cancelling the billing");
        swal({title: "Validation Error", text: "Problem while calculating total.. cancelling the billing"});
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
//    productIdsForBilling.push(rowid);
//    quantityListForBilling.push(quantity);
//    isProductReturnedForBilling.push(isProductRetruned);
//    amountTotalListForBilling.push(ti);
//    amountPerUnitListForBilling.push(amountPerUnit);
//    cgstArr.push(cgstPrice);
//    sgstArr.push(sgstPrice);
//    igstArr.push(igstPrice);
//    productDiscountArr.push(productDiscountPrice);

    $("#tableForOrder").append(row);

    document.getElementById("spnCartCount").innerHTML = "#" + document.getElementById("tableForOrder").children[1].children.length;

    $('#myMessageTrackingWindow').modal('hide');

    document.getElementById("salesDivSummary").style.backgroundColor = "#ECF1EB";
    document.getElementById("btnGenerateBill").style.visibility = "visible";

    totalProductForBill++;
    orderGenerated = 0;

    //totalPriceForBill = totalPriceForBill + (parseFloat(amountPerUnit) * parseFloat(quantity));
    var a = parseFloat(totalPriceForBill);
    var b = parseFloat(ti);
    totalPriceForBill = a + b;
    document.getElementById("isProductReturned").value = "N";
    try {
        document.getElementById("bpelID").innerHTML = '';
        document.getElementById("bpelName").innerHTML = '';
        document.getElementById("packingInfo").innerHTML = '';
        document.getElementById("addQuantityForBillingTxt").value = '';
        document.getElementById("amountPerUnit").value = '';
        document.getElementById("batchModel1").innerHTML = '';
        document.getElementById("bpelID").innerHTML = '';
        document.getElementById("companyModel1").innerHTML = '';
        document.getElementById("quantity").innerHTML = '';
        document.getElementById("mrpForProduct").innerHTML = '';
        document.getElementById("amountPerUnit1").innerHTML = '';
        document.getElementById("totalTaxInfo").innerHTML = '';
        document.getElementById("cgstTaxInfo").innerHTML = '';
        document.getElementById("sgstTaxInfo").innerHTML = '';
        document.getElementById("distributernameInfo").innerHTML = '';
        document.getElementById("expiryDateModel1").innerHTML = '';
        document.getElementById("productDiscount").innerHTML = '';
        document.getElementById("packingInfo").innerHTML = '';
    } catch (Err) {

    }

}

function deleteProductFromSales(btn) {
    var index = btn.id.substring(btn.id.indexOf("delete_") + 7);
    var i1 = parseFloat(amountPerUnitListForBilling[index]).toFixed(4);
    var totalTempam = (amountPerUnitListForBilling[index] * parseFloat(quantityListForBilling[index]).toFixed(4));
    totalPriceForBill = totalPriceForBill - totalTempam;
    //productIdsForBilling.splice(index, 1);
    document.getElementById("spnCartCount").innerHTML = "#" + productIdsForBilling.length;
    //quantityListForBilling.splice(index, 1);
    // isProductReturnedForBilling.splice(index, 1);
    // amountTotalListForBilling.splice(index, 1);
    //amountPerUnitListForBilling.splice(index, 1);
    // cgstArr.splice(index, 1);
    // sgstArr.splice(index, 1);
    // igstArr.splice(index, 1);
    totalProductForBill--;
    document.getElementById("billingrow_" + index + "").style.display = "none";
    document.getElementById("billingrow_" + index + "").innerHTML = "";
    try {
        var row = document.getElementById("billingrow_" + index + "");
        row.parentNode.removeChild(row);
    } catch (err) {

    }
    try {
        if (document.getElementById("billingrow_" + index + "")) {
            var row = document.getElementById("billingrow_" + index + "");
            var table = row.parentNode;
            while (table && table.tagName != 'TABLE')
                table = table.parentNode;
            if (!table)
                return;
            table.deleteRow(row.rowIndex);
        }
    } catch (err) {

    }

    //Modify the ids of table so that calculation can be good.

    if (document.getElementById("tableForOrder").children[1].children.length >= 1) {

        for (var i1 = 0; i1 < document.getElementById("tableForOrder").children[1].children.length; i1++) {
            document.getElementById("tableForOrder").children[1].children[i1].id = "billingrow_" + i1 + "";
            document.getElementById("tableForOrder").children[1].children[i1].children[0].id = "billing_" + i1 + "";
            document.getElementById("tableForOrder").children[1].children[i1].children[0].children[0].id = "delete_" + i1 + "";
            deleteId = i1;
        }
    }

    console.log("productIdsForBilling");
    console.log(productIdsForBilling);

    console.log("quantityListForBilling");
    console.log(quantityListForBilling);

    console.log("amountTotalListForBilling");
    console.log(amountTotalListForBilling);

    console.log("amountPerUnitListForBilling");
    console.log(amountPerUnitListForBilling);



}

function print_specific_div_content()
{
    if (orderGenerated === 0) {
        var custName = document.getElementById("custNameForBillingTxt").value;
        var custMobile = document.getElementById("custNameMobileNumberTxt").value;

        var prescriberName = document.getElementById("prescriberNameForBillingTxt").value;
        var prescriptionDateTxt = document.getElementById("prescriptionDateTxt").value;

        var totalAmount = document.getElementById('amountTotalForFill').innerHTML;

        var billNo = document.getElementById('billNo').innerHTML;
        var billDate = document.getElementById("billDate").value;
        var additionalDiscount = document.getElementById("additionalDicount").value;
        var paymentType = document.getElementById("paymentType").value;
        var creditAmount = document.getElementById("creditAmount").value;
        var creditComment = document.getElementById("creditComment").value;

        var urlString = "/AvonMedicalService/rest/CoreService/addBillingDetail?";

        if (!additionalDiscount && additionalDiscount === "") {
            additionalDiscount = 0.0;
        }

        var totalAmountFinal = totalAmount - parseFloat(additionalDiscount).toFixed(4);

        //alert();
        swal({title: "Info", text: "Total collective amount after additional discount applied : " + totalAmountFinal}, function () {

            urlString += "&customerName=" + custName;
            urlString += "&customerMobileNumber=" + custMobile;
            urlString += "&prescriberName=" + prescriberName;
            urlString += "&prescriptionDate=" + prescriptionDateTxt;
            urlString += "&billNo=" + billNo;
            urlString += "&billDate=" + billDate;
            urlString += "&totalAmount=" + totalAmountFinal;
            urlString += "&additionalDiscount=" + additionalDiscount;
            urlString += "&productIds=" + productIdsForBilling;
            urlString += "&quantityPurchased=" + quantityListForBilling;
            urlString += "&isProductreturned=" + isProductReturnedForBilling;
            urlString += "&amount=" + amountTotalListForBilling;
            urlString += "&cgst=" + cgstArr;
            urlString += "&sgst=" + sgstArr;
            urlString += "&igst=" + igstArr;
            urlString += "&productDiscount=" + productDiscountArr;
            urlString += "&amountPerUnit=" + amountPerUnitListForBilling;
            urlString += "&paymentType=" + paymentType;
            urlString += "&creditAmount=" + creditAmount;
            urlString += "&creditComment=" + creditComment;

            urlString = encodeURI(urlString);

            $.ajax({
                url: urlString
            }).then(function (data) {
                orderGenerated = 1;
                window.open("/AvonMedicalService/Invoice.html?billNo=" + billNo);
                $('#myMessageTrackingWindow').modal('hide');
                window.location.reload();
                isSearchedProduct = 0;
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

            var content = '<html>\n<link href="css/bootstrap-responsive.css" rel="stylesheet">\n        <link href="css/charisma-app.css" rel="stylesheet">\n        <linkhref="css/jquery-ui-1.8.21.custom.css" rel="stylesheet">\n        <link href="css/fullcalendar.css" rel="stylesheet"> \n       <link href="css/fullcalendar.print.css"rel="stylesheet"  media="print"> \n       <link href="css/chosen.css" rel="stylesheet">    \n    <link href="css/uniform.default.css" rel="stylesheet">   \n     <link href="cs/colorbox.css" rel="stylesheet"> \n       <link href="css/jquery.cleditor.css" rel="stylesheet">  \n      <link href="css/jquery.noty.css" rel="stylesheet">  \n      <link href=css/noty_theme_default.css" rel="stylesheet">   \n     <link href="css/elfinder.min.css" rel="stylesheet">   \n     <link href="css/elfinder.theme.css" rel="stylesheet">   \n     <link href="css/jquery.iphone.toggle.css" rel="stylesheet">    \n    <link href="css/opa-icons.css" rel="stylesheet"> \n       <link href="css/uploadify.css" rel"stylesheet">   \n     <link href="css/style.css" rel="stylesheet">\n<body>';
            content += document.getElementById("billingDivMainTopFinalBill").innerHTML;
            content += "</body>";
            content += "</html>";

        });
    } else {
        swal({title: "Info", text: "Sale entry can not be done. Please try again !"}, function () {
        });
    }
}

$("#buttonAside").click(function () {
    $("#popupaside").animate({left: '0px'});
});

function asideHelp() {
    $("#popupaside").animate({left: '-2000px'});
}

function asideStat() {
    $("#popupasideprodAnalysis").animate({left: '-2000px'});
}

function generateBill() {


    var rowid = "finalTotal";
    document.getElementById("addQuantityForBillingTxt").value = "";

    if (document.getElementById("btnGenerateFinalBill")) {
        document.getElementById("btnGenerateFinalBill").style.display = "block";
    }

    if (document.getElementById("btnGenerateFinalBill2")) {
        document.getElementById("btnGenerateFinalBill2").style.display = "block";
    }

    document.getElementById("billFooter").style.visibility = "hidden";

    finalBilling = 1;
    $('#myMessageTrackingWindow').modal('show');
    document.getElementById("prescriberNameForBillingTxt").focus();

    var thediv = document.getElementById('myMessageTrackingWindow');

    thediv.style.visibility = "visible";

    document.getElementById("billingDivMainTop").style.display = "none";

    document.getElementById("billingDivMainTopFinalBill").style.visibility = "visible";
    document.getElementById("tableForFinalOrder").innerHTML = document.getElementById("tableForOrder").innerHTML;

    document.getElementById('productForBill').innerHTML = totalProductForBill;
    document.getElementById('amountTotalForFill').innerHTML = parseFloat(totalPriceForBill).toFixed(4);
    document.getElementById('amountTotalForFillWithDiscount').innerHTML = parseFloat(totalPriceForBill).toFixed(4);

    //document.getElementById('amountTotalForFill2').innerHTML = parseFloat(totalPriceForBill).toFixed(4);
    document.getElementById('billNo').innerHTML = 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 12 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(12);
    });

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
    var today = dd + '/' + mm + '/' + yyyy + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    document.getElementById("billDate").value = today;

    var totalAudit = 0.0;
    var totalTableRef = document.getElementById("tableForFinalOrder");
    productIdsForBilling = [];
    quantityListForBilling = [];
    isProductReturnedForBilling = [];
    amountTotalListForBilling = [];
    amountPerUnitListForBilling = [];
    productDiscountArr = [];


    var totalProfit = 0.0;

    for (var i1 = 0; i1 < totalTableRef.children[1].children.length; i1++) {
        totalAudit = totalAudit + parseFloat(totalTableRef.children[1].children[i1].children[15].innerHTML);
        totalTableRef.children[1].children[i1].children[0].children[0].setAttribute('disabled', 'disabled');

        productIdsForBilling.push(totalTableRef.children[1].children[i1].children[1].innerHTML);
        quantityListForBilling.push(totalTableRef.children[1].children[i1].children[12].innerHTML);
        isProductReturnedForBilling.push(totalTableRef.children[1].children[i1].children[14].innerHTML);
        amountTotalListForBilling.push(totalTableRef.children[1].children[i1].children[15].innerHTML);
        amountPerUnitListForBilling.push(totalTableRef.children[1].children[i1].children[13].innerHTML);
        //    cgstArr.push(cgstPrice);
        //    sgstArr.push(sgstPrice);
        //    igstArr.push(igstPrice);
        productDiscountArr.push('0.0');

        //quantity, amountPerUnit, pramountPerUnit, pRateInfo, cgstInfo, sgstInfo
        totalProfit = totalProfit + calculateProfitRef(totalTableRef.children[1].children[i1].children[12].innerHTML,
                totalTableRef.children[1].children[i1].children[13].innerHTML,
                totalTableRef.children[1].children[i1].children[8].innerHTML,
                totalTableRef.children[1].children[i1].children[7].innerHTML,
                totalTableRef.children[1].children[i1].children[9].innerHTML,
                totalTableRef.children[1].children[i1].children[10].innerHTML
                );
    }
    console.log("totalProfit : " + totalProfit);

    if (document.getElementById("totalInvProfile")) {

        if (totalProfit <= 0) {
            $("#prfimg").attr("src", "img/sad.png");
        } else {
            $("#prfimg").attr("src", "img/smile.png");
        }

        document.getElementById("totalInvProfile").innerHTML = totalProfit;
        orgProfit = totalProfit;
    }

    console.log("productIdsForBilling");
    console.log(productIdsForBilling);

    console.log("quantityListForBilling");
    console.log(quantityListForBilling);

    document.getElementById('amountTotalForFill').innerHTML = parseFloat(totalAudit).toFixed(4);
    document.getElementById('amountTotalForFillWithDiscount').innerHTML = parseFloat(totalAudit).toFixed(4);
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

    for (var j1 = 0; j1 < document.getElementById("bpelInstSummayTabBody3").children.length; j1++) {
        var idSuffix = "";
        if (j1 === 0) {
            idSuffix = "";
        } else {
            idSuffix = "_" + j1;
        }
        var isLast = "false";
        if (j1 === document.getElementById("bpelInstSummayTabBody3").children.length - 1) {
            isLast = "true";
        }

        var i = 0;

        var urlString = "/AvonMedicalService/rest/CoreService/updateProductDetail?";
        var idSuffix = "";
        if (document.getElementById("packingAddTxt" + idSuffix).value === "") {
            //alert("'Packing' should only be number(0..9 digits)!");
            swal({title: "Validation Error", text: "'Packing' can never be empty!"}, function () {

            });

            document.getElementById("packingAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("packingAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("packingAddTxt" + idSuffix).style.backgroundColor = "white";
            if (document.getElementById("packingAddTxt" + idSuffix).value === "") {
                document.getElementById("packingAddTxt" + idSuffix).value = "1";
            }
        }

        if (!allnumeric(document.getElementById("quantityAddTxt" + idSuffix))) {
            //alert("");
            swal({title: "Validation Error", text: "'Quantity' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("quantityAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("quantityAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("quantityAddTxt" + idSuffix).style.backgroundColor = "white";
        }

        if (document.getElementById("freeAddTxt" + idSuffix).value !== "" && (!allnumeric(document.getElementById("freeAddTxt" + idSuffix)))) {
            //alert("");
            swal({title: "Validation Error", text: "'Free' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("freeAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("freeAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("freeAddTxt" + idSuffix).style.backgroundColor = "white";
            if (document.getElementById("freeAddTxt" + idSuffix).value === "") {
                document.getElementById("freeAddTxt" + idSuffix).value = "0";
            }
        }

        if (!allnumeric(document.getElementById("mrpAddTxt" + idSuffix))) {
            //alert("");
            swal({title: "Validation Error", text: "'MRP' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("mrpAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("mrpAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("mrpAddTxt" + idSuffix).style.backgroundColor = "white";
        }
        var mrpt = document.getElementById("mrpAddTxt" + idSuffix).value;
        var packingt = document.getElementById("packingAddTxt" + idSuffix).value;

        document.getElementById("amountAddTxt" + idSuffix).value = (parseFloat(mrpt) / parseFloat(packingt)).toFixed(4);

        if (document.getElementById("discountAddTxt" + idSuffix).value !== "" && !allnumeric(document.getElementById("discountAddTxt" + idSuffix))) {
            //alert("'Discount' should only be number(0..9 digits)!");
            swal({title: "Validation Error", text: "'Discount' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("discountAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("discountAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("discountAddTxt" + idSuffix).style.backgroundColor = "white";
            if (document.getElementById("discountAddTxt" + idSuffix).value === "") {
                document.getElementById("discountAddTxt" + idSuffix).value = "0";
            }
        }

        if (document.getElementById("productIdForUpdate")) {
            var productIdForUpdateValue = document.getElementById("productIdForUpdate");

            if (productIdForUpdateValue) {
                if ($.trim(productIdForUpdateValue.value) !== "") {
                    urlString += "&productId=" + productIdForUpdateValue.value;
                }
                // productIdForUpdateValue.value = "";
            }
        } else {
            urlString += "&productId=" + document.getElementById("idRef" + idSuffix).value;
        }

        var statusFilterTxtValue = document.getElementById("productNameAddTxt" + idSuffix);
        if (statusFilterTxtValue) {
            if ($.trim(statusFilterTxtValue.value) != "") {
                urlString += "&productName=" + statusFilterTxtValue.value;
                i++;
            }
            //statusFilterTxtValue.value = "";
        }

        var bpelFilterTxtValue = document.getElementById("companyAddTxt" + idSuffix);
        if (bpelFilterTxtValue) {
            if ($.trim(bpelFilterTxtValue.value) != "") {
                urlString += "&company=" + bpelFilterTxtValue.value;
            }
            //bpelFilterTxtValue.value = "";
        }

        var formulaAddTxtValue = document.getElementById("formulaAddTxt" + idSuffix);
        if (formulaAddTxtValue) {
            if ($.trim(formulaAddTxtValue.value) != "") {
                urlString += "&formula=" + formulaAddTxtValue.value;
            }
            //formulaAddTxtValue.value = "";
        }

        var batchNoAddTxtValue = document.getElementById("batchNoAddTxt" + idSuffix);
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


        var ExpiryDateAddTxtValue = document.getElementById("ExpiryDateAddTxt" + idSuffix);
        if (ExpiryDateAddTxtValue) {
            if ($.trim(ExpiryDateAddTxtValue.value) != "") {
                urlString += "&expiryDate=" + ExpiryDateAddTxtValue.value;
            }
            // ExpiryDateAddTxtValue.value = "";
        }

        var quantityAddTxtValue = document.getElementById("quantityAddTxt" + idSuffix);
        if (quantityAddTxtValue) {
            if ($.trim(quantityAddTxtValue.value) != "") {
                urlString += "&quantity=" + quantityAddTxtValue.value;
            }
            //quantityAddTxtValue.value = "";
        }

        var amountAddTxtValue = document.getElementById("amountAddTxt" + idSuffix);
        if (amountAddTxtValue) {
            if ($.trim(amountAddTxtValue.value) != "") {
                urlString += "&amount=" + amountAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }

        var disNameAddTxtValue = document.getElementById("disNameAddTxt" + idSuffix);
        if (disNameAddTxtValue) {
            if ($.trim(disNameAddTxtValue.value) != "") {
                urlString += "&disName=" + disNameAddTxtValue.value;
            }
            //disNameAddTxtValue.value = "";
        }

        var disNoAddTxtValue = document.getElementById("disNoAddTxt" + idSuffix);
        if (disNoAddTxtValue) {
            if ($.trim(disNoAddTxtValue.value) != "") {
                urlString += "&disNo=" + disNoAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }
        var discountAddTxtValue = document.getElementById("discountAddTxt" + idSuffix);
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
//        cgstAddTxtValue.value = "";
//    }
//    var sgstAddTxtValue = document.getElementById("sgstAddTxt");
//    if (sgstAddTxtValue) {
//        if ($.trim(sgstAddTxtValue.value) != "") {
//            urlString += "&sgst=" + sgstAddTxtValue.value.substring(0, sgstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        sgstAddTxtValue.value = "";
//    }
//    var igstAddTxtValue = document.getElementById("igstAddTxt");
//    if (igstAddTxtValue) {
//        if ($.trim(igstAddTxtValue.value) != "") {
//            urlString += "&igst=" + igstAddTxtValue.value.substring(0, igstAddTxtValue.value.indexOf("%"));
//            ;
//        }
//        igstAddTxtValue.value = "";
//    }
        var mrpAddTxtValue = document.getElementById("mrpAddTxt" + idSuffix);
        if (mrpAddTxtValue) {
            if ($.trim(mrpAddTxtValue.value) != "") {
                urlString += "&mrp=" + mrpAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }
        var freeAddTxtValue = document.getElementById("freeAddTxt" + idSuffix);
        if (freeAddTxtValue) {
            if ($.trim(freeAddTxtValue.value) != "") {
                urlString += "&free=" + freeAddTxtValue.value;
            }
            //mrpAddTxtValue.value = "";
        }
        var packingAddTxtValue = document.getElementById("packingAddTxt" + idSuffix);
        if (packingAddTxtValue) {
            if ($.trim(packingAddTxtValue.value) != "") {
                urlString += "&packing=" + packingAddTxtValue.value;
            }
            //packingAddTxtValue.value = "";
        }

        var dateAddTxtValue = document.getElementById("dateAddTxt" + idSuffix);
        if (dateAddTxtValue) {
            if ($.trim(dateAddTxtValue.value) != "") {
                urlString += "&date=" + dateAddTxtValue.value;
            }
            dateAddTxtValue.value = "";
        }

        var scheduleAddTxt = document.getElementById("scheduleAddTxt" + idSuffix);
        if (scheduleAddTxt) {
            if ($.trim(scheduleAddTxt.value) != "") {
                urlString += "&schedule=" + scheduleAddTxt.value;
            }
            //scheduleAddTxt.value = "";
        }

        var prateAddTxt = document.getElementById("prateAddTxt" + idSuffix);
        if (prateAddTxt) {
            if ($.trim(prateAddTxt.value) != "") {
                urlString += "&pRate=" + prateAddTxt.value;
            }
            //prateAddTxt.value = "";
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

        urlString += "&updatePurchase=" + updatePurchase;
        if (i > 0) {
            var urlStringFinal = encodeURI(urlString);
            $.ajax({
                url: urlStringFinal
            }).then(function (data) {

                swal({title: "Success", text: "Product detail updated successfully."}, function () {
                    if (isLast === "true") {
                        window.location.reload();
                    }
                });
            });
        } else {
            alert("No data to update!!");
        }

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

var isFirstTimePlus = 0;
var firstRowRefAdded;
var rowNumber = 0;
var tempMapHolderValue = {};

function addNewProductEntryRow() {

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



function removeNewProductEntryRow() {

    var ind = document.getElementById("bpelInstSummayTabBody3").children.length - 1;

    try {
        var row = document.getElementById("bpelInstSummayTabBody3").children[ind];
        row.parentNode.removeChild(row);
        rowNumber--;
    } catch (err) {

    }
}

function addProduct() {
    var urlStringArr = [];
    for (var j1 = 0; j1 < document.getElementById("bpelInstSummayTabBody3").children.length; j1++) {
        var idSuffix = "";
        if (j1 === 0) {
            idSuffix = "";
        } else {
            idSuffix = "_" + j1;
        }
        var isLast = "false";
        if (j1 === document.getElementById("bpelInstSummayTabBody3").children.length - 1) {
            isLast = "true";
        }

        var urlString = "/AvonMedicalService/rest/CoreService/addProductDetail?";

        //if (document.getElementById("packingAddTxt").value !== "" && (!allnumeric(document.getElementById("packingAddTxt")))) {

        if (document.getElementById("productNameAddTxt" + idSuffix).value === "") {
            swal({title: "Validation Error", text: "'Product name' can never be empty!"}, function () {

            });
            document.getElementById("productNameAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("productNameAddTxt" + idSuffix).style.color = "white";
            document.getElementById("productNameAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("productNameAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("productNameAddTxt" + idSuffix).style.color = "black";
        }

        if (document.getElementById("packingAddTxt" + idSuffix).value === "") {
            swal({title: "Validation Error", text: "'Packing' can never be empty!"}, function () {

            });
            document.getElementById("packingAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("packingAddTxt" + idSuffix).style.color = "white";
            document.getElementById("packingAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("packingAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("packingAddTxt" + idSuffix).style.color = "black";
            if (document.getElementById("packingAddTxt" + idSuffix).value === "") {
                document.getElementById("packingAddTxt" + idSuffix).value = "1";
            }
        }

        if (!allnumeric(document.getElementById("quantityAddTxt" + idSuffix))) {
            //alert("");
            swal({title: "Validation Error", text: "'Quantity' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("quantityAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("quantityAddTxt" + idSuffix).style.color = "white";
            document.getElementById("quantityAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("quantityAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("quantityAddTxt" + idSuffix).style.color = "black";
        }

        if (document.getElementById("freeAddTxt" + idSuffix).value !== "" && (!allnumeric(document.getElementById("freeAddTxt")))) {
            //alert("");
            swal({title: "Validation Error", text: "'Free' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("freeAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("freeAddTxt" + idSuffix).style.color = "white";
            document.getElementById("freeAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("freeAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("freeAddTxt" + idSuffix).style.color = "black";
            if (document.getElementById("freeAddTxt" + idSuffix).value === "") {
                document.getElementById("freeAddTxt" + idSuffix).value = "0";
            }
        }

        if (!allnumeric(document.getElementById("mrpAddTxt" + idSuffix))) {
            swal({title: "Validation Error", text: "'MRP' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("mrpAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("mrpAddTxt" + idSuffix).style.color = "white";
            document.getElementById("mrpAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("mrpAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("mrpAddTxt" + idSuffix).style.color = "black";
        }

        if (document.getElementById("discountAddTxt" + idSuffix).value !== "" && !allnumeric(document.getElementById("discountAddTxt" + idSuffix))) {
            //alert("'Discount' should only be number(0..9 digits)!");
            swal({title: "Validation Error", text: "'Discount' should only be number(0..9 digits)!"}, function () {

            });
            document.getElementById("discountAddTxt" + idSuffix).style.backgroundColor = "red";
            document.getElementById("discountAddTxt" + idSuffix).style.color = "white";
            document.getElementById("discountAddTxt" + idSuffix).focus();
            return;
        } else {
            document.getElementById("discountAddTxt" + idSuffix).style.backgroundColor = "white";
            document.getElementById("discountAddTxt" + idSuffix).style.color = "black";
            if (document.getElementById("discountAddTxt" + idSuffix).value === "") {
                document.getElementById("discountAddTxt" + idSuffix).value = "0";
            }
        }

        var statusFilterTxtValue = document.getElementById("productNameAddTxt" + idSuffix);
        if (statusFilterTxtValue) {
            if ($.trim(statusFilterTxtValue.value) !== "") {
                urlString += "&productName=" + statusFilterTxtValue.value;
            }
            //statusFilterTxtValue.value = "";
        }

        var bpelFilterTxtValue = document.getElementById("companyAddTxt" + idSuffix);
        if (bpelFilterTxtValue) {
            if ($.trim(bpelFilterTxtValue.value) !== "") {
                urlString += "&company=" + bpelFilterTxtValue.value;
            }
            //bpelFilterTxtValue.value = "";
        }

        var formulaAddTxtValue = document.getElementById("formulaAddTxt" + idSuffix);
        if (formulaAddTxtValue) {
            if ($.trim(formulaAddTxtValue.value) !== "") {
                urlString += "&formula=" + formulaAddTxtValue.value;
            }
            //formulaAddTxtValue.value = "";
        }

        var batchNoAddTxtValue = document.getElementById("batchNoAddTxt" + idSuffix);
        if (batchNoAddTxtValue) {
            if ($.trim(batchNoAddTxtValue.value) !== "") {
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


        var ExpiryDateAddTxtValue = document.getElementById("ExpiryDateAddTxt" + idSuffix);
        if (ExpiryDateAddTxtValue) {
            if ($.trim(ExpiryDateAddTxtValue.value) !== "") {
                urlString += "&expiryDate=" + ExpiryDateAddTxtValue.value;
            }
            //ExpiryDateAddTxtValue.value = "";
        }

        var quantityAddTxtValue = document.getElementById("quantityAddTxt" + idSuffix);
        if (quantityAddTxtValue) {
            if ($.trim(quantityAddTxtValue.value) !== "") {
                urlString += "&quantity=" + quantityAddTxtValue.value;
            }
            //quantityAddTxtValue.value = "";
        }

        var amountAddTxtValue = document.getElementById("amountAddTxt" + idSuffix);
        if (amountAddTxtValue) {
            if ($.trim(amountAddTxtValue.value) !== "") {
                urlString += "&amount=" + amountAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }

        var disNameAddTxtValue = document.getElementById("disNameAddTxt" + idSuffix);
        if (disNameAddTxtValue) {
            if ($.trim(disNameAddTxtValue.value) !== "") {
                urlString += "&disName=" + disNameAddTxtValue.value;
            }
            //disNameAddTxtValue.value = "";
        }

        var disNoAddTxtValue = document.getElementById("disNoAddTxt" + idSuffix);
        if (disNoAddTxtValue) {
            if ($.trim(disNoAddTxtValue.value) !== "") {
                urlString += "&disNo=" + disNoAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }
        var discountAddTxtValue = document.getElementById("discountAddTxt" + idSuffix);
        if (discountAddTxtValue) {
            if ($.trim(discountAddTxtValue.value) !== "") {
                urlString += "&discount=" + discountAddTxtValue.value;
            }
            //discountAddTxtValue.value = "";
        }

        var mrpAddTxtValue = document.getElementById("mrpAddTxt" + idSuffix);
        if (mrpAddTxtValue) {
            if ($.trim(mrpAddTxtValue.value) !== "") {
                urlString += "&mrp=" + mrpAddTxtValue.value;
            }
            //amountAddTxtValue.value = "";
        }
        var freeAddTxtValue = document.getElementById("freeAddTxt" + idSuffix);
        if (freeAddTxtValue) {
            if ($.trim(freeAddTxtValue.value) !== "") {
                urlString += "&free=" + freeAddTxtValue.value;
            }
            //mrpAddTxtValue.value = "";
        }
        var packingAddTxtValue = document.getElementById("packingAddTxt" + idSuffix);
        if (packingAddTxtValue) {
            if ($.trim(packingAddTxtValue.value) !== "") {
                urlString += "&packing=" + packingAddTxtValue.value;
            }
            //packingAddTxtValue.value = "";
        }

        var dateAddTxtValue = document.getElementById("dateAddTxt" + idSuffix);
        if (dateAddTxtValue) {
            if ($.trim(dateAddTxtValue.value) !== "") {
                urlString += "&date=" + dateAddTxtValue.value;
            }
            //dateAddTxtValue.value = "";
        }

        var scheduleAddTxt = document.getElementById("scheduleAddTxt" + idSuffix);
        if (scheduleAddTxt) {
            if ($.trim(scheduleAddTxt.value) !== "") {
                urlString += "&schedule=" + scheduleAddTxt.value;
            }
            //scheduleAddTxt.value = "";
        }

        var prateAddTxt = document.getElementById("prateAddTxt" + idSuffix);
        if (prateAddTxt) {
            if ($.trim(prateAddTxt.value) !== "") {
                urlString += "&pRate=" + prateAddTxt.value;
            }
            //prateAddTxt.value = "";
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

        urlStringArr.push(urlString);
    }

    try {
        $('#myModal').modal('show');
        for (var u = 0; u < urlStringArr.length; u++) {
            var isLast = "false";
            if (u === (urlStringArr.length - 1)) {
                isLast = "true";
            }
            finalizeAdd(urlStringArr[u], isLast);
        }
    } catch (err) {
        alert(err);
    }


    //Add more

}

function finalizeAdd(urlString, isLast) {
    var urlStringFinal = encodeURI(urlString);
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        $('#myModal').modal('hide');
        swal({title: "Success", text: "Product detail inserted successfully as new product entry."}, function () {
            if (isLast === "true") {
                window.location.reload();
            }
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
    //document.getElementById('amountTotalForFill2').innerHTML = 0;
    document.getElementById('billNo').innerHTML = "";
    document.getElementById("btnGenerateFinalBill").style.display = "block";
    document.getElementById("btnGenerateFinalBill2").style.display = "block";
    document.getElementById("billFooter").style.visibility = "hidden";
    document.getElementById("billDate").value = "";
    document.getElementById("custNameForBillingTxt").value = "";
    document.getElementById("custNameMobileNumberTxt").value = "";

    productIdsForBilling = "";
    billInit = 0;
    quantityListForBilling = "";
    amountPerUnitListForBilling = "";
    document.getElementById("btnGenerateBill").style.visibility = "hidden";

}

function deleteProduct() {

    $('#myModal').modal('show');

    var urlString = "/AvonMedicalService/rest/CoreService/deleteProductDetail?";

    var bpelFilterTxtValue = document.getElementById("deleteProductTxt");
    if (bpelFilterTxtValue) {
        if ($.trim(bpelFilterTxtValue.value) !== "") {
            urlString += "&productId=" + bpelFilterTxtValue.value;
            filterset = 1;
        } else {
            bpelFilterTxtValue = document.getElementById("productIdForUpdate");
            if (bpelFilterTxtValue) {
                if ($.trim(bpelFilterTxtValue.value) !== "") {
                    urlString += "&productId=" + bpelFilterTxtValue.value;
                    filterset = 1;
                }
            }

        }
        //bpelFilterTxtValue.value = "";
    }

    var urlStringFinal = encodeURI(urlString);
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        $('#myModal').modal('hide');

        swal({title: "Success", text: "Request for deletion sent to server.. server responded if delete status : " + data}, function () {

        });
    });

    bpelFilterTxtValue.value = "";


}

var productDetailDT;

function getBpelInstances(sortField, sortOrder) {
    var filterset = 0;
    isSearchedProduct = 0;
    tableRowRountInst = 0;

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
//        alert("Full databse search is not allowed, Becuase of UI performance, Please add atleast one filter criteria!!");
//        $('#myModal').modal('hide');
//        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
//        var table = $('#testInst').DataTable();
//        table.destroy();
//        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
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

                //Quantity color
                if (q2 > 50) {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                } else if (q2 > 20) {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                } else {
                    row = $("<tr id='" + rowid + "' style='background-color:#ffffff'></tr>");
                }

                row.append($("<td id='" + rowid + "_action" + "'>").html("<button class='btn btn-primary' style='width:0px;font-size:0px;'></button>"));
                row.append($("<td id='" + rowid + "_date" + "'>").text(theItem["date"]));
                row.append($("<td id='" + rowid + "_productName" + "'>").text(theItem["productName"]));
                row.append($("<td id='" + rowid + "_packing" + "'>").text(theItem["packing"]));
                row.append($("<td id='" + rowid + "_quantityInShop" + "'>").text(parseFloat(theItem["quantityInShop"]).toFixed(4)));
                if (theItem["free"] === '') {
                    theItem["free"] = '0';
                    row.append($("<td id='" + rowid + "_free" + "'>").text(theItem["free"]));
                } else {
                    row.append($("<td id='" + rowid + "_free" + "'>").text(parseFloat(theItem["free"]).toFixed(4)));
                }
                row.append($("<td id='" + rowid + "_batchNo" + "'>").text(theItem["batchNo"]));
                row.append($("<td id='" + rowid + "_expireDate" + "'>").text(theItem["expireDate"]));
                row.append($("<td id='" + rowid + "_mrp" + "'>").text(parseFloat(theItem["mrp"]).toFixed(4)));

                if (theItem["purchaseRate"] !== null && theItem["purchaseRate"] !== '') {
                    row.append($("<td id='" + rowid + "_purchaseRate" + "'>").text(parseFloat(theItem["purchaseRate"]).toFixed(4)));
                } else {
                    row.append($("<td id='" + rowid + "_purchaseRate" + "'>").text('---'));
                }

                if (theItem["margin"] !== null && theItem["margin"] !== '') {
                    row.append($("<td id='" + rowid + "_margin" + "'>").text(parseFloat(theItem["margin"]).toFixed(4)));
                } else {
                    row.append($("<td id='" + rowid + "_margin" + "'>").text('---'));
                }

                if (theItem["drugSchedule"] === '' || theItem["drugSchedule"] === null || theItem["drugSchedule"] === 'null') {
                    row.append($("<td id='" + rowid + "_drugSchedule" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_drugSchedule" + "'>").text(theItem["drugSchedule"]));
                }

                if (theItem["cgst"] === '' || theItem["cgst"] === null || theItem["cgst"] === 'null') {
                    row.append($("<td id='" + rowid + "_cgst" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_cgst" + "'>").text(theItem["cgst"]));
                }

                if (theItem["sgst"] === '' || theItem["sgst"] === null || theItem["sgst"] === 'null') {
                    row.append($("<td id='" + rowid + "_sgst" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_sgst" + "'>").text(theItem["sgst"]));
                }

//                if (!parseFloat(theItem["discount"])) {
//                    row.append($("<td id='" + rowid + "_productDiscount" + "'>").text("0%"));
//                } else {
//                    row.append($("<td id='" + rowid + "_productDiscount" + "'>").text(theItem["discount"] + "%"));
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

                row.append($("<td id='" + rowid + "_total" + "'>").text(finalTotal.toFixed(4)));

                if (theItem["company"] === '' || theItem["company"] === null || theItem["company"] === 'null') {
                    row.append($("<td id='" + rowid + "_company" + "'>").text("---"));
                } else {
                    row.append($("<td id='" + rowid + "_company" + "'>").text(theItem["company"]));
                }

                if (theItem["distributerName"] === '' || theItem["distributerName"] === null || theItem["distributerName"] === 'null') {
                    row.append($("<td id='" + rowid + "_distributerName" + "'>").text('---'));
                } else {
                    row.append($("<td id='" + rowid + "_distributerName" + "'>").text(theItem["distributerName"]));
                }

                if (theItem["distributerNumber"] === '' || theItem["distributerNumber"] === null || theItem["distributerNumber"] === 'null') {
                    row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text('---'));
                } else {
                    row.append($("<td id='" + rowid + "_distributerNumber" + "'>").text(theItem["distributerNumber"]));
                }
                //alert(finalTotal.toFixed(4));
                if (finalTotal.toFixed(4) > 0) {
                    $("#testInst").append(row);
                }

            });

            $('#myModal').modal('hide');

//            productDetailDT = $('#testInst').DataTable({
//                "lengthMenu": [[100, 150, 200, "All"], [100, 150, 200, "All"]]
//            });

            var seqno = 0;
            //Click on testInst table
            $('#testInst').on('click', 'td', function () {

                document.getElementById("billingDivMainTop").style.display = "block";
                document.getElementById("billingDivMainTop").style.visibility = "visible";
                document.getElementById("billingDivMainTopFinalBill").style.visibility = "hidden";
                document.getElementById("addQuantityForBillingTxt").value = "";



                trid = $(this).attr('id'); // table row ID 
                trid = trid.substring(0, trid.lastIndexOf("_"));

                finalBilling = 0;

                $('#myMessageTrackingWindow').modal('show');

                if (document.getElementById("modalHeader")) {
                    document.getElementById("modalHeader").style.backgroundColor = "#ffffff";
                }
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
                document.getElementById("batchModel1").innerHTML = document.getElementById(trid + "_batchNo").innerHTML;
                document.getElementById("expiryDateModel1").innerHTML = document.getElementById(trid + "_expireDate").innerHTML;
                document.getElementById("companyModel1").innerHTML = document.getElementById(trid + "_company").innerHTML;

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

                document.getElementById("packingInfo").innerHTML = "" + document.getElementById(trid + "_packing").innerHTML;

                if (document.getElementById("errorInQuantitySpn")) {
                    document.getElementById("errorInQuantitySpn").innerHTML = "";
                }

                var mrp1 = document.getElementById(trid + "_mrp").innerHTML;
                var pRate1 = document.getElementById(trid + "_purchaseRate").innerHTML;
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
                    document.getElementById("amountPerUnit").value = parseFloat(mrp1 / packing).toFixed(4);

                    document.getElementById("pramountPerUnit").value = pRate1 / packing;
                    document.getElementById("pramountPerUnit").value = parseFloat(pRate1 / packing).toFixed(4);

                } else {
                    document.getElementById("amountPerUnit").value = mrp1;
                    document.getElementById("amountPerUnit").value = parseFloat(mrp1).toFixed(4);

                    document.getElementById("pramountPerUnit").value = pRate1;
                    document.getElementById("pramountPerUnit").value = parseFloat(pRate1).toFixed(4);
                }
                if (document.getElementById(trid + "_purchaseRate")) {
                    document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_purchaseRate").innerHTML;
                }

                if (document.getElementById(trid + "_purchaseRate")) {
                    document.getElementById("amountPerUnit1").innerHTML = document.getElementById(trid + "_purchaseRate").innerHTML;
                }

                var totalTax = 0.00;
                if (document.getElementById(trid + "_cgst")) {
                    document.getElementById("cgstTaxInfo").innerHTML = document.getElementById(trid + "_cgst").innerHTML;
                    var c = document.getElementById(trid + "_cgst").innerHTML;
                    totalTax += parseFloat(c);
                }

                if (document.getElementById(trid + "_sgst")) {
                    document.getElementById("sgstTaxInfo").innerHTML = document.getElementById(trid + "_sgst").innerHTML;
                    var s = document.getElementById(trid + "_sgst").innerHTML;
                    totalTax += parseFloat(s);
                }

                document.getElementById("totalTaxInfo").innerHTML = totalTax;

                document.getElementById("distributernameInfo").innerHTML = document.getElementById(trid + "_distributerName").innerHTML;


                document.getElementById("mrpForProduct").innerHTML = document.getElementById(trid + "_mrp").innerHTML;
                document.getElementById("productDiscount").innerHTML = "0%";

                var r = map[trid];

                var thediv = document.getElementById('myMessageTrackingWindow');

                thediv.style.visibility = "visible";

//                $("#divPopupTableView").animate({
//                    width: "100%"
//                }, 500, function () {
//                    document.getElementById("addQuantityForBillingTxt").focus();
//                    //document.getElementById("addQuantityForBillingTxt").style.border = '0.2em solid black';
//
//                });

                tabActivityListTableRowRountInst = 0;
                tabActivityListPageNumber = 0;
                seqno = 0;
                document.getElementById("addQuantityForBillingTxt").focus();
                //document.getElementById("addQuantityForBillingTxt").style.border = '0.2em solid black';
                document.getElementById("addQuantityForBillingTxt").select();
                document.getElementById("addQuantityForBillingTxt").focus();
                document.getElementById("addQuantityForBillingTxt").focus();
                document.getElementById("addQuantityForBillingTxt").focus();
                document.getElementById("addQuantityForBillingTxt").focus();



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
                document.getElementById("quantityAddTxt").value = theItem["quantityInShop"];
                document.getElementById("freeAddTxt").value = theItem["free"];
                document.getElementById("batchNoAddTxt").value = theItem["batchNo"];
                document.getElementById("ExpiryDateAddTxt").value = theItem["expireDate"];
                document.getElementById("mrpAddTxt").value = theItem["mrp"];
                document.getElementById("taxesAddTxt").value = parseFloat(theItem["cgst"]) + parseFloat(theItem["sgst"]);

                if (theItem["packing"].indexOf(" ") !== -1) {
                    var c = theItem["mrp"] / theItem["packing"].substring(0, theItem["packing"].indexOf(" "));
                    document.getElementById("amountAddTxt").value = c.toFixed(4);
                } else {
                    var c = theItem["mrp"] / theItem["packing"];
                    document.getElementById("amountAddTxt").value = c.toFixed(4);
                }

//                document.getElementById("cgstAddTxt").value = theItem["cgst"] + "";
//                document.getElementById("sgstAddTxt").value = theItem["sgst"] + "";
//                document.getElementById("igstAddTxt").value = theItem["igst"] + "";
                document.getElementById("scheduleAddTxt").value = theItem["drugSchedule"] + "";
                document.getElementById("prateAddTxt").value = theItem["purchaseRate"] + "";
                document.getElementById("discountAddTxt").value = theItem["discount"];
                document.getElementById("companyAddTxt").value = theItem["company"];
                document.getElementById("formulaAddTxt").value = theItem["formula"];
                document.getElementById("disNameAddTxt").value = theItem["distributerName"];
                document.getElementById("disNoAddTxt").value = theItem["distributerNumber"];
                keychangemrp(document.getElementById("mrpAddTxt"));
            });




        } else {
            $('#myModal').modal('hide');
        }

    });



}

function requestFullScreen() {

    var
            el = document.documentElement
            , rfs =
            el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            ;
    rfs.call(el);
}

$(document).ready(function () {

    //var urlStringFinal = "";
    var urlStringFinal = "/AvonMedicalService/rest/CoreService/isValidLicece?dummy=1";
    $.ajax({
        url: urlStringFinal
    }).then(function (data) {
        if (data["state"] > 0) {
            if (data["state"] <= 2) {
                swal({title: "Info", text: "Your License is getting expired in two days, Please renew it, otherwise software will not work"});
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


    try {
        //alert(document.getElementById("productNameAddTxt").parentNode);
        document.getElementById("productNameAddTxt").focus();
        document.getElementById("productNameAddTxt").parentNode.style.border = '0.3em solid black';
        document.getElementById("productNameAddTxt").parentNode.style.backgroundColor = '#6DFD2A';
        document.getElementById("productNameAddTxt").select();
        currentTab = 2;
    } catch (err) {
        //alert(err);
    }


    var processed_json = new Array();

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
        },
        "bLengthChange": false,
        "bInfo": false
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

                getBpelInstances();
                var target = "#testInst";
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
            $("#x").text(pos.x.toFixed(4));
            $("#y").text(pos.y.toFixed(4));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(4),
                            y = item.datapoint[1].toFixed(4);

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
            percent = parseFloat(obj.series.percent).toFixed(4);
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
            document.getElementById("uploadButton").disabled = true;
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
            swal({title: "Error", text: 'Hey!! File can only be of type CSV.. you are uploding a ' + type + ' file, which application can not read, Please upload CSV file [Comma seperated],  Upload aborted!!'});
        }
    } else {
        swal({title: "Error", text: "No file choosen for upload !! Upload aborted!!"});
    }
});

function beforeSendHandler() {

}

function get_filename(obj) {

    var file = obj.value;

    var type = file.substr(file.indexOf('.') + 1);


    if (type == "csv" || type == "CSV") {
        document.getElementById("fileName").value = file.substring(file.indexOf("C:\\fakepath\\") + 12);
    } else {

        swal({title: "Info", text: 'Hey!! File can only be of type CSV.. you are uploding a ' + type + ' file, which application can not read, Please upload CSV file [Comma seperated]'});

    }

}

function completeHandler() {
    //alert("file uploaded successfully..Refreshing your page after this!");
    swal({title: "Success", text: "file uploaded successfully..Refreshing your page after this!"}, function () {
        document.getElementById("uploadButton").disabled = false;
        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
        document.getElementById("pr1").style.visibility = "hidden";
    });


}
function errorHandler() {

    swal({title: "Error", text: "Error while uploading file, please try again after sometime."}, function () {
        document.getElementById("uploadButton").disabled = false;
        document.getElementById("bpelInstSummayTabBody3").innerHTML = "";
        document.getElementById("pr1").style.visibility = "hidden";
    });

}

function progressHandlingFunction(e) {
    if (e.lengthComputable) {
        $('progress').attr({
            value: e.loaded,
            max: e.total
        });
    }
}
