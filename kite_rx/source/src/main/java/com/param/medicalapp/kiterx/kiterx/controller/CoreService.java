/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.controller;

/**
 *
 * @author Param
 */
import au.com.bytecode.opencsv.CSVParser;
import com.connection.ConnectionManager;

import com.param.medicalapp.kiterx.kiterx.dao.MonitoringDao;
import com.param.medicalapp.kiterx.kiterx.domain.BillMaster;
import com.param.medicalapp.kiterx.kiterx.domain.CustomerBillingDetails;
import com.param.medicalapp.kiterx.kiterx.domain.LicenceExpireResponse;
import com.param.medicalapp.kiterx.kiterx.domain.ProductMaster;
import com.param.medicalapp.kiterx.kiterx.domain.ProductSalesChart;
import com.param.medicalapp.kiterx.kiterx.domain.PurchaseOrderMaster;
import com.param.medicalapp.kiterx.kiterx.domain.SaleChartMaster;
import com.param.medicalapp.kiterx.kiterx.domain.SalesChart;


import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.logging.Level;

import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.apache.poi.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/rest/CoreService")
public class CoreService {

    private static Logger logger = Logger.getLogger(CoreService.class.getCanonicalName());
    
    
    private static HashMap<String, List<CustomerBillingDetails>> salesData = new HashMap<>();

    private static MonitoringDao monitordao;
    
    
    @PostConstruct
    public void init() {    
        try {
            System.out.println("**************** iinit ");
            monitordao = new MonitoringDao();
            monitordao.setDataSource(ConnectionManager.getConnectionManager().getDataSource());
            System.out.println("**************** iinit 22");
            logger.info("Data base created dao object : " + monitordao);
            
        } catch (Exception ex) {
            ex.printStackTrace();
            Logger.getLogger(CoreService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
   

    @RequestMapping(value = "/getProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<ProductMaster> getProductDetail(
            @RequestParam(name = "productId", required = false) String productId,
            @RequestParam(name = "expireDate", required = false) String expireDate,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "company", required = false) String company, 
            @RequestParam(name = "formula", required = false) String formula, 
            @RequestParam(name = "quantity", required = false) String quantity,
            @RequestParam(name = "batchNo", required = false) String batchNo, 
            @RequestParam(name = "schedule", required = false) String schedule, 
            @RequestParam(name = "sortColumn", required = false) String sortColumn,
            @RequestParam(name = "sortFilter", required = false) String sortFilter) {

        

        if (expireDate != null && expireDate.trim().length() > 0) {
            expireDate = getWellFormedExpDate(expireDate);
        }
        if (productName != null) {
            productName = productName.toUpperCase();
        }

        if (company != null) {
            company = company.toUpperCase();
        }

        if (batchNo != null) {
            batchNo = batchNo.toUpperCase();
        }
        List<ProductMaster> productList = monitordao.getProductDetail(productId, expireDate, productName, company, formula, batchNo, schedule,
                quantity, sortColumn, sortFilter, null, true);
        return productList;
    }

    @RequestMapping(value = "/getAboutToExpireProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<ProductMaster> getAboutToExpireProductDetail(
            @RequestParam(name = "productId", required = false) String productId,
            @RequestParam(name = "expireDate", required = false) String expireDate,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "company", required = false) String company, @RequestParam(name = "formula", required = false) String formula, @RequestParam(name = "quantity", required = false) String quantity,
            @RequestParam(name = "batchNo", required = false) String batchNo, @RequestParam(name = "sortColumn", required = false) String sortColumn,
            @RequestParam(name = "sortFilter", required = false) String sortFilter) {

        

        Calendar c = Calendar.getInstance();
        c.setTime(new Date());

        StringBuilder builder = new StringBuilder();
        builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
        builder.append("-");

        //logger.info(c.get(Calendar.MONTH));
        int month = c.get(Calendar.MONTH) + 1;

        if (month <= 9) {
            builder.append("0" + month);
        } else {
            builder.append(month);
        }

        builder.append("-");
        builder.append(c.get(Calendar.YEAR));

        SimpleDateFormat format1 = new SimpleDateFormat("dd-MM-yyyy");
        Date date = null;
        try {
            date = format1.parse(builder.toString());
        } catch (ParseException ex) {
            Logger.getLogger(CoreService.class.getName()).log(Level.SEVERE, null, ex);
        }

        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yy");

        String str = format.format(date);

        expireDate = str;

        List<ProductMaster> productList = monitordao.getProductDetail(productId, expireDate, productName, company, formula, batchNo, null, quantity, sortColumn, sortFilter, null, false);
        return productList;
    }

    @RequestMapping(value = "/getExpireProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<ProductMaster> getExpireProductDetail(
            @RequestParam(name = "productId", required = false) String productId,
            @RequestParam(name = "expireDate", required = false) String expireDate,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "company", required = false) String company, @RequestParam(name = "formula", required = false) String formula, @RequestParam(name = "quantity", required = false) String quantity,
            @RequestParam(name = "batchNo", required = false) String batchNo, @RequestParam(name = "sortColumn", required = false) String sortColumn,
            @RequestParam(name = "sortFilter", required = false) String sortFilter) {

        

        Calendar aCalendar = Calendar.getInstance();
// add -1 month to current month
        aCalendar.add(Calendar.MONTH, -1);
// set DATE to 1, so first date of previous month
        aCalendar.set(Calendar.DATE, 1);

        Date firstDateOfPreviousMonth = aCalendar.getTime();

// set actual maximum date of previous month
        aCalendar.set(Calendar.DATE, aCalendar.getActualMaximum(Calendar.DAY_OF_MONTH));
//read it
        Date lastDateOfPreviousMonth = aCalendar.getTime();

        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yy");

        String str = format.format(lastDateOfPreviousMonth);

        expireDate = str;

        List<ProductMaster> productList = monitordao.getProductDetail(productId, expireDate, productName, company, formula, batchNo, null, quantity, sortColumn, sortFilter, null, false);
        return productList;
    }

    @RequestMapping(value = "/deleteProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean deleteProductDetail(
            @RequestParam(name = "productId", required = false) String productId
    ) {

        

        boolean productList = monitordao.deleteProductDetail(productId);
        return productList;
    }

    @RequestMapping(value = "/updateProductDetailQuantityZero", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean updateProductDetailQuantityZero(
            @RequestParam(name = "productId", required = false) String productId
    ) {

        

        boolean productList = monitordao.updateProductDetailQuantityZero(productId);
        return productList;
    }

    @RequestMapping(value = "/updateCustomerBillingDetail", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<CustomerBillingDetails> updateCustomerBillingDetail(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord,
            @RequestParam(name = "custNameFilter", required = false) String custNameFilter,
            @RequestParam(name = "dateFilter", required = false) String dateFilter,
            @RequestParam(name = "paymentType", required = false) String paymentType,
            @RequestParam(name = "creditAmount", required = false) String creditAmount,
            @RequestParam(name = "paymentAmount", required = false) String paymentAmount,
            @RequestParam(name = "paymentAmount1", required = false) String paymentAmount1,
            @RequestParam(name = "paymentAmount2", required = false) String paymentAmount2,
            @RequestParam(name = "paymentAmount3", required = false) String paymentAmount3,
            @RequestParam(name = "creditStatus", required = false) String creditStatus,
            @RequestParam(name = "custMobileFilter", required = false) String custMobileFilter,
            @RequestParam(name = "prescriberNameFilter", required = false) String prescriberNameFilter,
            @RequestParam(name = "prescriptionDate", required = false) String prescriptionDate,
            @RequestParam(name = "billNo", required = false) String billNo
    ) {

        logger.info("***dateFilter : " + dateFilter);
        logger.info("***custNameFilter : " + custNameFilter);
        logger.info("***custMobileFilter : " + custMobileFilter);
        

        monitordao.updateCustomerBillingDetail(maxrecord, custNameFilter, custMobileFilter, false, dateFilter,
                paymentType, paymentAmount, paymentAmount1, paymentAmount2, paymentAmount3, creditAmount, creditStatus, billNo, prescriberNameFilter, prescriptionDate);

        return null;
    }

    @RequestMapping(value = "/getCustomerBillingDetail", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<CustomerBillingDetails> getCustomerBillingDetail(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord,
            @RequestParam(name = "custNameFilter", required = false) String custNameFilter,
            @RequestParam(name = "custIdFilter", required = false) String custIdFilter,
            @RequestParam(name = "paymentType", required = false) String paymentType,
            @RequestParam(name = "dateFilter", required = false) String dateFilter,
            @RequestParam(name = "custMobileFilter", required = false) String custMobileFilter,
            @RequestParam(name = "hiddenFlag", required = false) String hiddenFlag,
            @RequestParam(name = "pageNo", required = false) String pageNo,
            @RequestParam(name = "pageSize", required = false) String pageSize) {

        

        final List<CustomerBillingDetails> custBillList = monitordao.getCustomerBillingDetail(maxrecord, custNameFilter, custIdFilter,
                custMobileFilter, false, dateFilter, paymentType, "%", "desc", hiddenFlag, pageNo, pageSize);

        if (Integer.parseInt(pageNo) == 0) {
            salesData.clear();
            salesData.put("salesReport", custBillList);
        } else {
            List<CustomerBillingDetails> list2 = salesData.get("salesReport");
            list2.addAll(custBillList);
            salesData.clear();
            salesData.put("salesReport", list2);
        }

//        new Thread(new Runnable() {
//            @Override
//            public void run() {
        //}
//        }).start();
        return custBillList;
    }

    @RequestMapping(value = "/updateBilling", method = RequestMethod.GET, produces = {"text/plain"})
    @ResponseBody
    public List<PurchaseOrderMaster> updateBilling() {

        try {
            List<CustomerBillingDetails> custBillList2 = monitordao.getCustomerBillingDetail2(null, null, null,
                    null, false, null, null, "%", "desc", "", null, null);

            for (CustomerBillingDetails detail : custBillList2) {
                logger.info("updating billing for : " + detail.getBillNo() + ", Bill date : " + detail.getBillDate());
                int count = monitordao.getBillTaxInfo(detail.getBillNo());
                if (count == 0) {
                    List<BillMaster> billProducts = getBillingDetailWithProducts(1000000, detail.getBillNo());
                    if (billProducts != null) {
                        //Need to add billing tax information
                        //if (detail.getBillDate().contains("201")) {
                        // continue;
                        //}
                        double totalCGSTPaidD = 0.0, totalSGSTPaidD = 0.0, totalIGSTPaidD = 0.0,
                                totalProductDiscountD = 0.0, totalTaxableAmountD = 0.0, total;

                        double totalCgst6Amount = 0.0;
                        double totalCgst9Amount = 0.0;
                        double totalCgst14Amount = 0.0;
                        double totalCgst2_5Amount = 0.0;
                        double totalCgst0Amount = 0.0;

                        int totalCgst6Count = 0;
                        int totalCgst9Count = 0;
                        int totalCgst14Count = 0;
                        int totalCgst2_5Count = 0;
                        int totalCgst0Count = 0;

                        double totalTaxableAmount6PerGST = 0;
                        double totalTaxableAmount9PerGST = 0;
                        double totalTaxableAmount14PerGST = 0;
                        double totalTaxableAmount2_5PerGST = 0;
                        double totalTaxableAmount0PerGST = 0;

                        String returnString;

                        for (BillMaster billMaster : billProducts) {
                            logger.info("Adding pending billing tax detail.....");

                            double t1 = Double.parseDouble(billMaster.getQuantityPurchased()) * Double.parseDouble(billMaster.getAmountPerUnit());
                            String sgstArrVal = "";
                            totalTaxableAmountD = totalTaxableAmountD + 1;
                            try {
                                if (billMaster.getSgst().endsWith("%")) {
                                    sgstArrVal = billMaster.getSgst().substring(0, billMaster.getSgst().indexOf('%'));
                                } else {
                                    sgstArrVal = billMaster.getSgst();
                                }
                            } catch (Exception e) {

                            }

                            String cgstArrVal = "";
                            try {
                                if (billMaster.getCgst().endsWith("%")) {
                                    cgstArrVal = billMaster.getCgst().substring(0, billMaster.getCgst().indexOf('%'));
                                } else {
                                    cgstArrVal = billMaster.getCgst();
                                }
                            } catch (Exception e) {

                            }

                            try {
                                totalSGSTPaidD = totalSGSTPaidD + ((Double.parseDouble(sgstArrVal) * t1 / 100));
                            } catch (Exception e) {

                            }

                            try {
                                totalCGSTPaidD = totalCGSTPaidD + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                            } catch (Exception e) {

                            }

                            if (cgstArrVal.startsWith("6")) {
                                totalCgst6Count++;
                                totalCgst6Amount = totalCgst6Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                                totalTaxableAmount6PerGST = totalTaxableAmount6PerGST + t1;

                            }
                            if (cgstArrVal.startsWith("9")) {
                                totalCgst9Count++;
                                totalCgst9Amount = totalCgst9Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                                totalTaxableAmount9PerGST = totalTaxableAmount9PerGST + t1;
                            }
                            if (cgstArrVal.startsWith("14")) {
                                totalCgst14Count++;
                                totalCgst14Amount = totalCgst14Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                                totalTaxableAmount14PerGST = totalTaxableAmount14PerGST + t1;
                            }
                            if (cgstArrVal.startsWith("2.5")) {
                                totalCgst2_5Count++;
                                totalCgst2_5Amount = totalCgst2_5Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                                totalTaxableAmount2_5PerGST = totalTaxableAmount2_5PerGST + t1;
                            }
                            if (cgstArrVal.startsWith("0")) {
                                totalCgst0Count++;
                                totalCgst0Amount = totalCgst0Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                                totalTaxableAmount0PerGST = totalTaxableAmount0PerGST + t1;
                            }
                        }

                        double totalTaxableAmount = Double.parseDouble(detail.getTotalAmountPaid()) - (totalCGSTPaidD + totalSGSTPaidD);

                        try {
                            String added = monitordao.addBillingTaxInformation(detail.getBillNo(), detail.getBillPrintNo(), detail.getBillDate(),
                                    Double.parseDouble(detail.getTotalAmountPaid()), totalTaxableAmount, (totalCGSTPaidD + totalSGSTPaidD), detail.getAdditionalDiscount(),
                                    totalCGSTPaidD, totalSGSTPaidD, totalCgst6Count, totalCgst9Count, totalCgst14Count, totalCgst2_5Count, totalCgst0Count,
                                    totalCgst6Amount, totalCgst9Amount, totalCgst14Amount, totalCgst2_5Amount, totalCgst0Amount, totalTaxableAmount0PerGST,
                                    totalTaxableAmount6PerGST, totalTaxableAmount9PerGST, totalTaxableAmount14PerGST, totalTaxableAmount2_5PerGST);
                            logger.log(Level.INFO, "************** Tax information added for this billing : {0} : ", added);
                        } catch (Exception e) {
                            logger.log(Level.INFO, "Error while inserting tax information : {0}", e.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/getPurchaseDetail", method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<PurchaseOrderMaster> getPurchaseDetail(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord,
            @RequestParam(name = "distributerName", required = false) String distributerName,
            @RequestParam(name = "dateFilter", required = false) String dateFilter,
            @RequestParam(name = "batch", required = false) String batch,
            @RequestParam(name = "company", required = false) String company,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "pageNo", required = false) String pageNo,
            @RequestParam(name = "pageSize", required = false) String pageSize) {

        logger.info("***dateFilter : " + dateFilter);

        

        List<PurchaseOrderMaster> custBillList = monitordao.getPurchaseOrderDetailWithProducts(maxrecord,
                distributerName, batch, company, productName, dateFilter, pageNo, pageSize);
        return custBillList;
    }

    @RequestMapping(value = "/getCustomerBillingDetailForPO", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<CustomerBillingDetails> getCustomerBillingDetailForPO(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "custNameFilter", required = false) String custName,
            @RequestParam(name = "dateFilter", required = false) String dateFilter,
            @RequestParam(name = "custMobileFilter", required = false) String custMobile, @RequestParam(name = "pageNo", required = false) String pageNo,
            @RequestParam(name = "pageSize", required = false) String pageSize) {

        

        List<CustomerBillingDetails> custBillList = monitordao.getCustomerBillingDetail(maxrecord, custName, "", custMobile,
                true, dateFilter, null, "%", "desc", "1", pageNo, pageSize);
        return custBillList;
    }

    @RequestMapping(value = "/deleteCustomerBillingDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean deleteCustomerBillingDetail(
            @RequestParam(name = "billId", required = false) String billId) {

        

        boolean custBillList = monitordao.deleteCustomerBillingDetail(billId);
        return custBillList;
    }

    @RequestMapping(value = "/getPurchaseOrderDetailWithProducts", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<PurchaseOrderMaster> getPurchaseOrderDetailWithProducts(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo) {

        

        // List<PurchaseOrderMaster> custBillList = monitordao.getPurchaseOrderDetailWithProducts(maxrecord, billNo);
        return null;
    }

    @RequestMapping(value = "/getBillingDetailWithProducts", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<BillMaster> getBillingDetailWithProducts(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo) {

        
        List<BillMaster> custBillList = monitordao.getBillingDetailWithProducts(maxrecord, billNo);
        return custBillList;
    }

    @RequestMapping(value = "/getBillingDetailForProduct", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<BillMaster> getBillingDetailForProduct(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "batch", required = false) String batch, @RequestParam(name = "company", required = false) String company, @RequestParam(name = "dateFilter", required = false) String dateFilter,
            @RequestParam(name = "pageNo", required = false) String pageNo,
            @RequestParam(name = "pageSize", required = false) String pageSize) {

        

        List<BillMaster> custBillList = monitordao.getBillingDetailForProduct(maxrecord,
                productName, batch, company, dateFilter, pageNo, pageSize);
        return custBillList;
    }

    @RequestMapping(value = "/getProductNames",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<Map<String, Object>> getProductNames(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "batch", required = false) Optional<String> batch
    ) {

        

        String sql = "select distinct TRIM(UCASE(PRODUCT_NAME)) as PRODUCT_NAME from PRODUCT_MASTER ";
        boolean executeAnd = false;

        if (name != null && name.trim().length() > 0) {
            if (name.trim().length() > 2) {
                if (executeAnd) {
                    sql = sql + " and TRIM(UCASE(PRODUCT_NAME)) like '%" + name.toUpperCase().trim() + "%' ";
                } else {
                    sql = sql + " where TRIM(UCASE(PRODUCT_NAME)) like '%" + name.toUpperCase().trim() + "%' ";
                }
                executeAnd = true;
            } else {
                if (executeAnd) {
                    sql = sql + " and TRIM(UCASE(PRODUCT_NAME)) like '" + name.toUpperCase().trim() + "%'";
                } else {
                    sql = sql + " where TRIM(UCASE(PRODUCT_NAME)) like '" + name.toUpperCase().trim() + "%'";
                }
                executeAnd = true;
            }

        } else {
            return null;
        }

        if (batch != null && batch.isPresent() && batch.get().trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and TRIM(UCASE(BATCH_NO)) like '%" + batch.get().toUpperCase().trim() + "%'";
            } else {
                sql = sql + " where TRIM(UCASE(BATCH_NO)) like '%" + batch.get().toUpperCase().trim() + "%'";
            }
            executeAnd = true;
        }

        if (executeAnd) {
            sql = sql + " order by PRODUCT_NAME";
            
            logger.info("  monitordao : " + monitordao);
            
            return monitordao.queryForList(sql);
        } else {
            return null;
        }

    }

    @RequestMapping(value = "/getProductBatches",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<Map<String, Object>> getProductBatches(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "batch", required = false) String batch
    ) {

        

        String sql = "select TRIM(UCASE(PRODUCT_NAME)) as PRODUCT_NAME,PRODUCT_ID,BATCH_NO, MRP,PURCHASE_RATE,EXPIRE_DATE,"
                + "COMPANY,DISTUBUTER_NAME,DISTIBUTER_NUMBER,CREATED_AT,DATE,"
                + "DRUG_SCHEDULE,AMOUNT_PER_UNIT,QUANTITY_IN_SHOP,PACKING,MARGIN,FREE,CGST as cgst, SGST as sgst from PRODUCT_MASTER  ";
        boolean executeAnd = false;

        if (name != null && name.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and TRIM(UCASE(PRODUCT_NAME)) = '" + name.toUpperCase().trim() + "'";
            } else {
                sql = sql + " where TRIM(UCASE(PRODUCT_NAME)) = '" + name.toUpperCase().trim() + "'";
            }
            executeAnd = true;
        }

        if (batch != null && batch.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and TRIM(UCASE(BATCH_NO)) = '" + batch.toUpperCase().trim() + "'";
            } else {
                sql = sql + " where TRIM(UCASE(BATCH_NO)) = '" + batch.toUpperCase().trim() + "'";
            }
            executeAnd = true;
        }

        if (executeAnd) {
            sql = sql + " order by PRODUCT_NAME";
            return monitordao.queryForList(sql);
        } else {
            return null;
        }
    }

    @RequestMapping(value = "/deleteSalesData", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String deleteSalesData(
            @RequestParam(name = "billNo", required = false) String billNo) {

        
        if (billNo != null && billNo.trim().length() > 0) {
            return monitordao.deleteSalesData(billNo.trim());
        } else {
            return "false";
        }
    }

    @RequestMapping(value = "/hideSaleEntry", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String hideSaleEntry(
            @RequestParam(name = "billNo", required = false) String billNo) {

        
        if (billNo != null && billNo.trim().length() > 0) {
            return monitordao.hideSaleEntry(billNo.trim());
        } else {
            return "false";
        }
    }

    @RequestMapping(value = "/downloadSalesfile", method = RequestMethod.GET)
    public void downloadSalesfile(@RequestParam(name = "filePath", required = false) String filePath,
            HttpSession session, HttpServletResponse response) throws Exception {

        if (!salesData.containsKey("salesReport")) {
            return;
        }

        filePath = "/home/ec2-user/";
        logger.info("Test");
        List<String> Header = new ArrayList<>();
        Map<String, List<String>> serviceHeaders = new HashMap<>();
        // Key Header
        Header.add("Bill No");
        Header.add("Date");
        Header.add("Customer");
        Header.add("Payment");
        Header.add("#Items");
        Header.add("Taxable Amount");
        Header.add("Total CGST");
        Header.add("Total SGST");
        Header.add("Total Discount");
        Header.add("Total Amount");

        serviceHeaders.put("Sales Data", Header);

        List<String> HeaderCa2 = new ArrayList<>();

        HeaderCa2.add("TAX%");
        HeaderCa2.add("Total Taxable Amount");
        HeaderCa2.add("CGST%");
        HeaderCa2.add("CGST AMT");
        HeaderCa2.add("SGST%");
        HeaderCa2.add("SGST AMT");

        serviceHeaders.put("Tax Summary", HeaderCa2);

        Map<String, List<List<String>>> mapp = new HashMap<>();

        Map<String, Map<String, List<List<String>>>> serviceData = new TreeMap<>();

        List<List<String>> data = new ArrayList<>();

        List<List<String>> data2 = new ArrayList<>();
        Double total2_5PerCGST = 0.0;
        Double total0PerCGST = 0.0;
        Double total6PerCGST = 0.0;
        Double total9PerCGST = 0.0;
        Double total14PerCGST = 0.0;

        Double totalTaxableAmount2_5 = 0.0;
        Double totalTaxableAmount6 = 0.0;
        Double totalTaxableAmount9 = 0.0;
        Double totalTaxableAmount14 = 0.0;
        Double totalTaxableAmount = 0.0;
        Double totalSaleAmount = 0.0;
        Double totalCGSTPaid = 0.0;
        Double totalSGSTPaid = 0.0;
        Double totalTaxPaid = 0.0;

        Double totalTaxableAmount0PerGST = 0.0;
        Double totalTaxableAmount6PerGST = 0.0;
        Double totalTaxableAmount9PerGST = 0.0;
        Double totalTaxableAmount14PerGST = 0.0;
        Double totalTaxableAmount2_5PerGST = 0.0;

        int count = 1;
        String saleDate = null;

        for (CustomerBillingDetails detail : salesData.get("salesReport")) {
            if (count == 1) {
                saleDate = detail.getBillDate();
                count = 2;
            }
            List<String> m1 = new ArrayList<>();
            m1.add(detail.getBillPrintNo());
            m1.add(detail.getBillDate());
            m1.add(detail.getCustName());
            m1.add(detail.getPaymentType());
            m1.add(detail.getTotalNumberOfProducts());
            m1.add(String.format("%.2f", Double.parseDouble(detail.getTaxableAmount())));
            m1.add(String.format("%.2f", Double.parseDouble(detail.getTotalCgstPaid())));
            m1.add(String.format("%.2f", Double.parseDouble(detail.getTotalSgstPaid())));
            try {
                m1.add(String.format("%.2f", Double.parseDouble(detail.getTotalDiscount())));
            } catch (Exception e) {
                m1.add("0.00");
            }
            m1.add(String.format("%.2f", Double.parseDouble(detail.getTotalAmountPaid())));
            data.add(m1);

            try {
                total2_5PerCGST = total2_5PerCGST + Double.parseDouble(detail.getTotalCgst_2_5_amount());
                total6PerCGST = total6PerCGST + Double.parseDouble(detail.getTotalCgst_6_amount());
                total9PerCGST = total9PerCGST + Double.parseDouble(detail.getTotalCgst_9_amount());
                total14PerCGST = total14PerCGST + Double.parseDouble(detail.getTotalCgst_14_amount());
                total0PerCGST = total0PerCGST + Double.parseDouble(detail.getTotalCgst_0_amount());
                totalTaxableAmount = totalTaxableAmount + Double.parseDouble(detail.getTaxableAmount());
                totalSaleAmount = totalSaleAmount + Double.parseDouble(detail.getTotalAmountPaid());
                totalCGSTPaid = totalCGSTPaid + Double.parseDouble(detail.getTotalCgstPaid());
                totalSGSTPaid = totalSGSTPaid + Double.parseDouble(detail.getTotalSgstPaid());
                totalTaxPaid = totalTaxPaid + Double.parseDouble(detail.getTotalTaxPaid());

                totalTaxableAmount0PerGST = totalTaxableAmount0PerGST + Double.parseDouble(detail.getTotalTaxableAmount0PerGST());
                totalTaxableAmount6PerGST = totalTaxableAmount6PerGST + Double.parseDouble(detail.getTotalTaxableAmount6PerGST());
                totalTaxableAmount9PerGST = totalTaxableAmount9PerGST + Double.parseDouble(detail.getTotalTaxableAmount9PerGST());
                totalTaxableAmount2_5PerGST = totalTaxableAmount2_5PerGST + Double.parseDouble(detail.getTotalTaxableAmount2_5PerGST());
                totalTaxableAmount14PerGST = totalTaxableAmount14PerGST + Double.parseDouble(detail.getTotalTaxableAmount14PerGST());

            } catch (Exception e) {

            }
        }

        List<String> m2 = new ArrayList<>();
        m2.add("5%");
        m2.add(String.valueOf(String.format("%.2f", (totalTaxableAmount2_5PerGST - (total2_5PerCGST + total2_5PerCGST)))));
        m2.add(String.valueOf("2.5%"));
        m2.add(String.valueOf(String.format("%.2f", total2_5PerCGST)));
        m2.add(String.valueOf("2.5%"));
        m2.add(String.valueOf(String.format("%.2f", total2_5PerCGST)));
        data2.add(m2);

        List<String> m21 = new ArrayList<>();
        m21.add("12%");
        m21.add(String.valueOf(String.format("%.2f", totalTaxableAmount6PerGST - (total6PerCGST + total6PerCGST) )));
        m21.add(String.valueOf("6%"));
        m21.add(String.valueOf(String.format("%.2f", total6PerCGST)));
        m21.add(String.valueOf("6%"));
        m21.add(String.valueOf(String.format("%.2f", total6PerCGST)));
        data2.add(m21);

        List<String> m22 = new ArrayList<>();
        m22.add("18%");
        m22.add(String.valueOf(String.format("%.2f", totalTaxableAmount9PerGST - (total9PerCGST + total9PerCGST))));
        m22.add(String.valueOf("9%"));
        m22.add(String.valueOf(String.format("%.2f", total9PerCGST)));
        m22.add(String.valueOf("9%"));
        m22.add(String.valueOf(String.format("%.2f", total9PerCGST)));
        data2.add(m22);

        List<String> m23 = new ArrayList<>();
        m23.add("28%");
        m23.add(String.valueOf(String.format("%.2f", totalTaxableAmount14PerGST - (total14PerCGST + total14PerCGST))));
        m23.add(String.valueOf("14%"));
        m23.add(String.valueOf(String.format("%.2f", total14PerCGST)));
        m23.add(String.valueOf("14%"));
        m23.add(String.valueOf(String.format("%.2f", total14PerCGST)));
        data2.add(m23);

        List<String> m24 = new ArrayList<>();
        m24.add("0%");
        m24.add(String.valueOf(String.format("%.2f", totalTaxableAmount0PerGST - (total0PerCGST + total0PerCGST))));
        m24.add(String.valueOf("0%"));
        m24.add(String.valueOf(String.format("%.2f", total0PerCGST)));
        m24.add(String.valueOf("0%"));
        m24.add(String.valueOf(String.format("%.2f", total0PerCGST)));
        data2.add(m24);

        mapp.put("123141431", data);

        Map<String, List<List<String>>> mapp2 = new HashMap<>();

        mapp2.put("123141431", data2);

        serviceData.put("Tax Summary", mapp2);
        serviceData.put("Sales Data", mapp);

        SimpleDateFormat format = new SimpleDateFormat("dd_MM_yyyy_HHmmssS");
        String fileNamePart = "AvonSalesReport_" + format.format(new Date()) + ".pdf";
        String homeFolder = filePath;
        if (!homeFolder.endsWith(File.separator)) {
            homeFolder = homeFolder + File.separator;
        }
        String reportFileName = homeFolder + fileNamePart;

        SimpleDateFormat format2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String providerName = "Paramjeet Singh";

        logger.info("totalCGSTPaid : " + totalCGSTPaid);
        logger.info("totalSGSTPaid : " + totalSGSTPaid);
        logger.info("totalTaxPaid : " + totalTaxPaid);
        logger.info("totalSaleAmount : " + totalSaleAmount);
        logger.info("totalTaxableAmount : " + totalTaxableAmount);
        logger.info("reportFileName : " + reportFileName);

        new SalesPDFReportGenerator().generateReport(reportFileName,
                "AVON", format2.format(new Date()), serviceHeaders,
                serviceData, "Paramjeet", "23/05/1987", "A123",
                "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",
                "SEVERE", "IL", 10.0, totalTaxableAmount, providerName, "8765432", "2019-10-10", "2020-10-10",
                null, totalCGSTPaid, totalSGSTPaid, totalTaxPaid, totalSaleAmount,saleDate);

        logger.info("/download-delegate-excel-file service invoked");
        logger.log(Level.INFO, "File path : {0}", filePath);
        String fileName = filePath.substring(filePath.lastIndexOf(File.separator) + 1);
        logger.log(Level.INFO, "File name : {0}" + fileName);

        try (FileInputStream inputStream = new FileInputStream(reportFileName)) {
            response.setHeader("Content-Disposition", "attachment; filename=" + fileNamePart);
            response.setHeader("Content-Transfer-Encoding", "binary");
            response.setHeader("Cache-Control", "must-revalidate");
            response.setHeader("Pragma", "public");
            IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
            logger.log(Level.INFO, "File downloaded successfully.");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Request could not be completed at this moment. Please try again.", e);
        }
    }

    
    @RequestMapping(value = "/downloadExcelfileFromPath", method = RequestMethod.GET)
    public void downloadExcelfileFromPath(@RequestParam(name = "filePath", required = false) String filePath,
            HttpSession session, HttpServletResponse response) throws Exception {

        try (FileInputStream inputStream = new FileInputStream(filePath)) {
            String fileString = new File(filePath).getName();
            response.setHeader("Content-Disposition", "attachment; filename=" + fileString);
            response.setHeader("Content-Transfer-Encoding", "binary");
            if(filePath.endsWith("csv") || filePath.endsWith("CSV")){
                response.setHeader("Content-Type", "text/csv");
            }else{
                response.setHeader("Content-Type", "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
            response.setHeader("Cache-Control", "must-revalidate");
            response.setHeader("Pragma", "public");
            IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
            logger.log(Level.INFO, "File downloaded successfully.");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Request could not be completed at this moment. Please try again.", e);
        }
    }

    @RequestMapping(value = "/downloadfileFromPath", method = RequestMethod.GET)
    public void downloadfileFromPath(@RequestParam(name = "filePath", required = false) String filePath,
            HttpSession session, HttpServletResponse response) throws Exception {

        try (FileInputStream inputStream = new FileInputStream(filePath)) {
            String fileString = new File(filePath).getName();
            response.setHeader("Content-Disposition", "attachment; filename=" + fileString);
            response.setHeader("Content-Transfer-Encoding", "binary");           
            response.setHeader("Cache-Control", "must-revalidate");
            response.setHeader("Pragma", "public");
            IOUtils.copy(inputStream, response.getOutputStream());
            response.flushBuffer();
            logger.log(Level.INFO, "File downloaded successfully.");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Request could not be completed at this moment. Please try again.", e);
        }
    }
    
    
    @RequestMapping(value = "/unhideSaleEntry", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String unhideSaleEntry(
            @RequestParam(name = "billNo", required = false) String billNo) {

        
        if (billNo != null && billNo.trim().length() > 0) {
            return monitordao.unhideSaleEntry(billNo.trim());
        } else {
            return "false";
        }
    }

    @RequestMapping(value = "/getSalesData", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<SaleChartMaster> getSalesData(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo) {

        

        //List<SaleChartMaster> custBillList = monitordao.getSalesData(maxrecord, billNo);
        return null;
    }

    @RequestMapping(value = "/updateSalesData", method = RequestMethod.GET, headers = "Accept=application/json",
            produces = {"text/plain"})
    @ResponseBody
    public String updateSalesData(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo) {

        

        String custBillList = monitordao.updateSalesData(maxrecord, billNo.trim());
        return custBillList;
    }

    @RequestMapping(value = "/isValidLicece", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public LicenceExpireResponse isValidLicece(
            @RequestParam(name = "dummy", required = false) String billNo) {

        LicenceExpireResponse res = new LicenceExpireResponse();
        
        res.setMessage("Active");
                res.setState(9999999999L);

        return res;

    }

    @RequestMapping(value = "/getProductDataForChart", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<ProductSalesChart> getProductDataForChart(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo,
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate, @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "batch", required = false) String batch) {

        

        List<ProductSalesChart> custBillList = monitordao.getSalesDataForProduct(maxrecord, billNo, startDate, endDate, productName, batch);
        return custBillList;
    }

    @RequestMapping(value = "/getSalesDataForChart", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<SalesChart> getSalesDataForChart(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo, @RequestParam(name = "batch", required = false) String batch,
            @RequestParam(name = "dateFilter", required = false) String dateFilter) {

        

        List<SalesChart> custBillList = monitordao.getSalesDataForChart(maxrecord, billNo, dateFilter, batch);
        return custBillList;
    }

    @RequestMapping(value = "/getSalesDataPerDay", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<SaleChartMaster> getSalesDataPerDay(
            @RequestParam(name = "maxrecord", required = false) Integer maxrecord, @RequestParam(name = "billNo", required = false) String billNo) {

        List<SaleChartMaster> custBillList = monitordao.getSalesDataPerDay(maxrecord, billNo);
        return custBillList;
    }

    @RequestMapping(value = "/addProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String addProductDetail(
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "company", required = false) String company, @RequestParam(name = "formula", required = false) String formula,
            @RequestParam(name = "batchNo", required = false) String batchNo, @RequestParam(name = "manfactureDate", required = false) String manfactureDate,
            @RequestParam(name = "expiryDate", required = false) String expiryDate, @RequestParam(name = "quantity", required = false) String quantity,
            @RequestParam(name = "amount", required = false) String amount, @RequestParam(name = "disName", required = false) String disName,
            @RequestParam(name = "disNo", required = false) String disNo, @RequestParam(name = "discount", required = false) String discount,
            @RequestParam(name = "cgst", required = false) String cgst,
            @RequestParam(name = "sgst", required = false) String sgst,
            @RequestParam(name = "igst", required = false) String igst,
            @RequestParam(name = "mrp", required = false) String mrp,
            @RequestParam(name = "free", required = false) String free,
            @RequestParam(name = "packing", required = false) String packing,
            @RequestParam(name = "date", required = false) String date,
            @RequestParam(name = "schedule", required = false) String schedule,
            @RequestParam(name = "pRate", required = false) String pRate,
            @RequestParam(name = "margin", required = false) String margin
    ) {

        

        String productList = monitordao.addProductDetail(productName, company, formula, batchNo,
                expiryDate, manfactureDate, quantity, amount, disName, disNo, discount, cgst, sgst, igst, mrp, free, packing, date, schedule, pRate, margin);
        return productList;
    }

    @RequestMapping(value = "/updateProductDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String updateProductDetail(
            @RequestParam(name = "productId", required = false) String productId,
            @RequestParam(name = "productName", required = false) String productName,
            @RequestParam(name = "company", required = false) String company, @RequestParam(name = "formula", required = false) String formula,
            @RequestParam(name = "batchNo", required = false) String batchNo, @RequestParam(name = "manfactureDate", required = false) String manfactureDate,
            @RequestParam(name = "expiryDate", required = false) String expiryDate, @RequestParam(name = "quantity", required = false) String quantity,
            @RequestParam(name = "amount", required = false) String amount, @RequestParam(name = "disName", required = false) String disName,
            @RequestParam(name = "disNo", required = false) String disNo, @RequestParam(name = "discount", required = false) String discount,
            @RequestParam(name = "cgst", required = false) String cgst,
            @RequestParam(name = "sgst", required = false) String sgst,
            @RequestParam(name = "igst", required = false) String igst,
            @RequestParam(name = "mrp", required = false) String mrp,
            @RequestParam(name = "free", required = false) String free,
            @RequestParam(name = "packing", required = false) String packing,
            @RequestParam(name = "date", required = false) String date,
            @RequestParam(name = "schedule", required = false) String schedule,
            @RequestParam(name = "pRate", required = false) String pRate,
            @RequestParam(name = "margin", required = false) String margin,
            @RequestParam(name = "updatePurchase", required = false) String updatePurchase
    ) {
        

        String productList = monitordao.updateProductDetail(productId, productName, company, formula, batchNo,
                expiryDate, manfactureDate, quantity, amount, disName, disNo, discount, cgst, sgst, igst, mrp, free, packing, date,
                schedule, pRate, margin, updatePurchase);
        return productList;
    }

    @RequestMapping(value = "/addPurchaseOrderDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String addPurchaseOrderDetail(
            @RequestParam(name = "customerName", required = false) String customerName,
            @RequestParam(name = "customerId", required = false) String customerId,
            @RequestParam(name = "customerMobileNumber", required = false) String customerMobileNumber,
            @RequestParam(name = "custAddress", required = false) String custAddress,
            @RequestParam(name = "billNo", required = false) String billNo,
            @RequestParam(name = "billDate", required = false) String billDate, @RequestParam(name = "totalAmount", required = false) String totalAmount,
            @RequestParam(name = "cgst", required = false) String cgst, @RequestParam(name = "sgst", required = false) String sgst, @RequestParam(name = "igst", required = false) String igst,
            @RequestParam(name = "additionalDiscount", required = false) String additionalDiscount,
            @RequestParam(name = "productIds", required = false) String productIds, @RequestParam(name = "quantityPurchased", required = false) String quantityPurchased,
            @RequestParam(name = "amount", required = false) String amount, @RequestParam(name = "amountPerUnit", required = false) String amountPerUnit,
            @RequestParam(name = "totalCGSTPaid", required = false) String totalCGSTPaid,
            @RequestParam(name = "totalSGSTPaid", required = false) String totalSGSTPaid,
            @RequestParam(name = "totalIGSTPaid", required = false) String totalIGSTPaid,
            @RequestParam(name = "totalProductDiscount", required = false) String totalProductDiscount,
            @RequestParam(name = "productDiscount", required = false) String productDiscount) {

       

        //  String productList = monitordao.addCustomerBillDetail(
        //         customerName, customerMobileNumber, "", "", billNo, billDate, totalAmount, additionalDiscount,"1",totalCGSTPaid
        //        , totalIGSTPaid, totalProductDiscount, totalSGSTPaid);
        String[] productOrdered = productIds.split(",");

        String[] quantityOrdered = quantityPurchased.split(",");

        String[] amountOrdered = amount.split(",");
        String[] cgstArr = cgst.split(",");
        String[] sgstArr = sgst.split(",");
        String[] igstArr = null;
        if (igst != null && igst.trim().length() > 0) {
            igstArr = igst.split(",");
        }
        String[] prodDisArr = null;
        if (productDiscount != null && productDiscount.trim().length() > 0) {
            prodDisArr = productDiscount.split(",");
        }

        double totalCGSTPaidD = 0.0, totalSGSTPaidD = 0.0, totalIGSTPaidD = 0.0, totalProductDiscountD = 0.0, totalTaxableAmountD = 0.0;

        String[] amountPerUnitArr = amountPerUnit.split(",");

        for (int i = 0; i < productOrdered.length; i++) {

            double t1 = Double.parseDouble(quantityOrdered[i]) * Double.parseDouble(amountPerUnitArr[i]);

            totalTaxableAmountD = totalTaxableAmountD + t1;

            String returnString = "";
            if (igstArr != null && prodDisArr != null) {
                returnString = monitordao.addProductBillDetail(billNo, productOrdered[i], quantityOrdered[i],
                        amountOrdered[i], "0", "0", "0", prodDisArr[i], amountPerUnitArr[i], "");
            } else if (igstArr != null) {
                returnString = monitordao.addProductBillDetail(billNo, productOrdered[i], quantityOrdered[i],
                        amountOrdered[i], "0", "0", "0", "0", amountPerUnitArr[i], "");
            } else if (prodDisArr != null) {
                returnString = monitordao.addProductBillDetail(billNo, productOrdered[i], quantityOrdered[i],
                        amountOrdered[i], "0", "0", "0", prodDisArr[i], amountPerUnitArr[i], "");
            } else {
                returnString = monitordao.addProductBillDetail(billNo, productOrdered[i], quantityOrdered[i],
                        amountOrdered[i], "0", "0", "0", "0", amountPerUnitArr[i], "");
            }

            logger.info("Quantity ordered ,rest  : " + quantityOrdered[i]);
            //returnString = monitordao.updateProductQuantityPO(productOrdered[i], quantityOrdered[i]);

            try {
                totalIGSTPaidD = totalIGSTPaidD + ((Double.parseDouble(igstArr[i]) * t1 / 100));
            } catch (Exception e) {

            }

            try {
                totalSGSTPaidD = totalSGSTPaidD + ((Double.parseDouble(sgstArr[i]) * t1 / 100));
            } catch (Exception e) {

            }

            try {
                totalCGSTPaidD = totalCGSTPaidD + ((Double.parseDouble(cgstArr[i]) * t1 / 100));
            } catch (Exception e) {

            }

            try {
                totalProductDiscountD = totalProductDiscountD + ((Double.parseDouble(prodDisArr[i]) * t1 / 100));
            } catch (Exception e) {

            }

            if (!returnString.equalsIgnoreCase("true")) {
                return returnString;
            }

        }

        String productList = monitordao.addCustomerBillDetail(
                customerName, customerId, customerMobileNumber, "", "", billNo, billDate, totalAmount, additionalDiscount, "1", String.valueOf(totalCGSTPaidD),
                String.valueOf(totalIGSTPaidD), String.valueOf(totalProductDiscountD), String.valueOf(totalSGSTPaidD), String.valueOf(totalTaxableAmountD), "", "", "", "");

        return "true";
    }

    @RequestMapping(value = "/addBillingDetail", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"text/plain"})
    @ResponseBody
    public String addBillingDetail(
            @RequestParam(name = "customerName", required = false) String customerName,
            @RequestParam(name = "customerId", required = false) String customerId,
            @RequestParam(name = "customerMobileNumber", required = false) String customerMobileNumber,
            @RequestParam(name = "prescriberName", required = false) String prescriberName,
            @RequestParam(name = "prescriptionDate", required = false) String prescriptionDate,
            @RequestParam(name = "billNo", required = false) String billNo,
            @RequestParam(name = "billDate", required = false) String billDate, 
            @RequestParam(name = "totalAmount", required = false) String totalAmount,
            @RequestParam(name = "cgst", required = false) String cgst, 
            @RequestParam(name = "sgst", required = false) String sgst, 
            @RequestParam(name = "igst", required = false) String igst,
            @RequestParam(name = "additionalDiscount", required = false) String additionalDiscount,
            @RequestParam(name = "productIds", required = false) String productIds, 
            @RequestParam(name = "quantityPurchased", required = false) String quantityPurchased,
            @RequestParam(name = "isProductreturned", required = false) String isProductreturned,
            @RequestParam(name = "amount", required = false) String amount, 
            @RequestParam(name = "amountPerUnit", required = false) String amountPerUnit,
            @RequestParam(name = "totalCGSTPaid", required = false) String totalCGSTPaid,
            @RequestParam(name = "totalSGSTPaid", required = false) String totalSGSTPaid,
            @RequestParam(name = "totalIGSTPaid", required = false) String totalIGSTPaid,
            @RequestParam(name = "totalProductDiscount", required = false) String totalProductDiscount,
            @RequestParam(name = "productDiscount", required = false) String productDiscount,
            @RequestParam(name = "paymentType", required = false) String paymentType,
            @RequestParam(name = "creditAmount", required = false) String creditAmount,
            @RequestParam(name = "creditComment", required = false) String creditComment,
            @RequestParam(name = "totalCreditAsOfNow", required = false) String totalCreditAsOfNow
    ) {
        logger.info("paymentType : " + paymentType);
        logger.info("creditAmount : " + creditAmount);
        logger.info("creditComment : " + creditComment);

        

        //String productList = monitordao.addCustomerBillDetail(
        //        customerName, customerMobileNumber, prescriberName, prescriptionDate, billNo, billDate, totalAmount, additionalDiscount,"0",totalCGSTPaid
        //        , totalIGSTPaid, totalProductDiscount, totalSGSTPaid);
        String[] productIdArray = productIds.split(",");

        String[] quantityOrdered = quantityPurchased.split(",");
        String[] productReturned = isProductreturned.split(",");

        String[] amountOrdered = amount.split(",");
        String[] cgstArr = cgst.split(",");
        String[] sgstArr = sgst.split(",");
        String[] igstArr = null;
        if (igst != null && igst.trim().length() > 0) {
            igstArr = igst.split(",");
        }

        String[] prodDisArr = null;
        if (productDiscount != null && productDiscount.trim().length() > 0) {
            prodDisArr = productDiscount.split(",");
        }
        String[] amountPerUnitArr = amountPerUnit.split(",");

        double totalCGSTPaidD = 0.0, totalSGSTPaidD = 0.0, totalIGSTPaidD = 0.0, totalProductDiscountD = 0.0, totalTaxableAmountD = 0.0, total;
        int printNo = 0;

        try {
            printNo = monitordao.addAndGetPrintNo(billDate);
        } catch (Exception e) {
            e.printStackTrace();
            printNo = 0;
        }
        String billPrintNo = "";
        try {
            billPrintNo = billDate.split(" ")[0];
            billPrintNo = billPrintNo.split("/")[2];
            billPrintNo = billPrintNo + "-" + printNo;
        } catch (Exception e) {
            billPrintNo = "" + printNo;
        }

        if (customerId == null || customerId.equalsIgnoreCase("0")) {

            if (customerName == null) {
                customerName = "";
            }

            if (customerMobileNumber == null) {
                customerMobileNumber = "";
            }

            if (customerName != null && customerName.trim().length() > 0) {
                customerId = monitordao.quickAddCustomerName(customerName.toUpperCase(), customerMobileNumber.toUpperCase());

            } else {
                customerId = "0";
            }
        }

        double totalCgst6Amount = 0.0;
        double totalCgst9Amount = 0.0;
        double totalCgst14Amount = 0.0;
        double totalCgst2_5Amount = 0.0;
        double totalCgst0Amount = 0.0;

        int totalCgst6Count = 0;
        int totalCgst9Count = 0;
        int totalCgst14Count = 0;
        int totalCgst2_5Count = 0;
        int totalCgst0Count = 0;

        double totalTaxableAmount6PerGST = 0;
        double totalTaxableAmount9PerGST = 0;
        double totalTaxableAmount14PerGST = 0;
        double totalTaxableAmount2_5PerGST = 0;
        double totalTaxableAmount0PerGST = 0;

        try {
            for (int i = 0; i < productIdArray.length; i++) {

                String returnString;
                double t1 = Double.parseDouble(quantityOrdered[i]) * Double.parseDouble(amountPerUnitArr[i]);
                String sgstArrVal = "";
                try {
                    if (sgstArr[i].endsWith("%")) {
                        sgstArrVal = sgstArr[i].substring(0, sgstArr[i].indexOf('%'));
                    } else {
                        sgstArrVal = sgstArr[i];
                    }
                } catch (Exception e) {

                }

                String cgstArrVal = "";
                try {
                    if (cgstArr[i].endsWith("%")) {
                        cgstArrVal = cgstArr[i].substring(0, cgstArr[i].indexOf('%'));
                    } else {
                        cgstArrVal = cgstArr[i];
                    }
                } catch (Exception e) {

                }

                if (igstArr != null && prodDisArr != null) {
                    returnString = monitordao.addProductBillDetail(billNo, productIdArray[i], quantityOrdered[i],
                            amountOrdered[i], cgstArrVal, sgstArrVal, "0", "0", amountPerUnitArr[i], billPrintNo);

                } else if (igstArr != null) {
                    returnString = monitordao.addProductBillDetail(billNo, productIdArray[i], quantityOrdered[i],
                            amountOrdered[i], cgstArrVal, sgstArrVal, "0", "0", amountPerUnitArr[i], billPrintNo);
                } else if (prodDisArr != null) {
                    returnString = monitordao.addProductBillDetail(billNo, productIdArray[i], quantityOrdered[i],
                            amountOrdered[i], cgstArrVal, sgstArrVal, "0", "0", amountPerUnitArr[i], billPrintNo);
                } else {
                    returnString = monitordao.addProductBillDetail(billNo, productIdArray[i], quantityOrdered[i],
                            amountOrdered[i], cgstArrVal, sgstArrVal, "0", "0", amountPerUnitArr[i], billPrintNo);
                }

                if (productReturned[i] != null && productReturned[i].equalsIgnoreCase("N")) {
                    totalTaxableAmountD = totalTaxableAmountD + t1;
                    returnString = monitordao.updateProductQuantity(productIdArray[i], quantityOrdered[i]);
                } else if (productReturned[i] != null && productReturned[i].equalsIgnoreCase("Y")) {
                    totalTaxableAmountD = totalTaxableAmountD - t1;
                    returnString = monitordao.updateProductQuantity2(productIdArray[i], quantityOrdered[i]);
                }

                try {
                    totalSGSTPaidD = totalSGSTPaidD + ((Double.parseDouble(sgstArrVal) * t1 / 100));
                } catch (Exception e) {

                }

                try {
                    totalCGSTPaidD = totalCGSTPaidD + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                } catch (Exception e) {

                }

                if (cgstArr[i].startsWith("6")) {
                    totalCgst6Count++;
                    totalCgst6Amount = totalCgst6Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                    totalTaxableAmount6PerGST = totalTaxableAmount6PerGST + t1;
                }
                if (cgstArr[i].startsWith("9")) {
                    totalCgst9Count++;
                    totalCgst9Amount = totalCgst9Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                    totalTaxableAmount9PerGST = totalTaxableAmount9PerGST + t1;
                }
                if (cgstArr[i].startsWith("14")) {
                    totalCgst14Count++;
                    totalCgst14Amount = totalCgst14Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                    totalTaxableAmount14PerGST = totalTaxableAmount14PerGST + t1;
                }
                if (cgstArr[i].startsWith("2.5")) {
                    totalCgst2_5Count++;
                    totalCgst2_5Amount = totalCgst2_5Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                    totalTaxableAmount2_5PerGST = totalTaxableAmount2_5PerGST + t1;
                }
                if (cgstArr[i].startsWith("0")) {
                    totalCgst0Count++;
                    totalCgst0Amount = totalCgst0Amount + ((Double.parseDouble(cgstArrVal) * t1 / 100));
                    totalTaxableAmount0PerGST = totalTaxableAmount0PerGST + t1;
                }

                try {
                    //if (cgstArr[i] != null && !(cgstArr[i].equalsIgnoreCase("0"))) {
                    monitordao.updateProductTaxes(productIdArray[i], cgstArr[i], sgstArr[i]);
                    //}
                } catch (Exception e) {
                    e.printStackTrace();
                }

//            try {
//                totalIGSTPaidD = totalIGSTPaidD + ((Double.parseDouble(igstArr[i]) * t1 / 100));
//            } catch (Exception e) {
//
//            }
//
//            try {
//                totalProductDiscountD = totalProductDiscountD + ((Double.parseDouble(prodDisArr[i]) * t1 / 100));
//            } catch (Exception e) {
//
//            }
                if (!returnString.equalsIgnoreCase("true")) {
                    return returnString;
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("Error : " + e.getStackTrace().toString());
        }

        double totalTaxableAmount = totalTaxableAmountD - (totalCGSTPaidD + totalSGSTPaidD);

        try {
            String added = monitordao.addBillingTaxInformation(billNo, billPrintNo, billDate, totalTaxableAmountD, totalTaxableAmount, (totalCGSTPaidD + totalSGSTPaidD), additionalDiscount,
                    totalCGSTPaidD, totalSGSTPaidD, totalCgst6Count, totalCgst9Count, totalCgst14Count, totalCgst2_5Count,
                    totalCgst0Count,
                    totalCgst6Amount, totalCgst9Amount, totalCgst14Amount, totalCgst2_5Amount, totalCgst0Amount, totalTaxableAmount0PerGST,
                    totalTaxableAmount6PerGST, totalTaxableAmount9PerGST, totalTaxableAmount14PerGST, totalTaxableAmount2_5PerGST);
            logger.info("Tax information added for this billing : " + added);
        } catch (Exception e) {
            logger.info("Error while inserting tax information : " + e.getMessage());
        }

        String productList = monitordao.addCustomerBillDetail(
                customerName, customerId, customerMobileNumber, prescriberName, prescriptionDate, billNo, billDate, totalAmount, additionalDiscount, "0",
                String.valueOf(totalCGSTPaidD),
                String.valueOf(totalIGSTPaidD), String.valueOf(totalProductDiscountD), String.valueOf(totalSGSTPaidD),
                String.valueOf(totalTaxableAmountD), paymentType, creditAmount, creditComment, billPrintNo);
        try {
            if (totalCreditAsOfNow != null && totalCreditAsOfNow.trim().length() > 0) {
                double totalCreditAsOfNowD = 0;
                String status = "PAYMENT-PENDING";
                if (paymentType != null && paymentType.trim().equalsIgnoreCase("PRE-PAID")) {

                    totalCreditAsOfNow = totalCreditAsOfNow.replaceAll("-", "");

                    totalCreditAsOfNowD = Double.parseDouble(totalCreditAsOfNow);

                    logger.info("******************Total Credit : " + totalCreditAsOfNowD);
                    boolean paymentModePending = false;
                    double totalAmountD = Double.parseDouble(totalAmount);
                    if (totalCreditAsOfNowD > totalAmountD) {
                        totalCreditAsOfNowD = totalCreditAsOfNowD - totalAmountD;
                        status = "PAID";
                        this.monitordao.updateCreditForCustomer(customerName.toUpperCase(), customerId, String.valueOf(0), status, billNo);
                    } else if (totalCreditAsOfNowD == totalAmountD) {
                        totalCreditAsOfNowD = 0;
                        status = "PAID";
                        this.monitordao.updateCreditForCustomer(customerName.toUpperCase(), customerId, String.valueOf(0), status, billNo);
                    } else {
                        status = "PAYMENT-PENDING";
                        totalAmountD = totalAmountD - totalCreditAsOfNowD;
                        this.monitordao.updateCreditForCustomer(customerName.toUpperCase(), customerId, String.valueOf(totalAmountD), status, billNo);
                        totalCreditAsOfNowD = totalAmountD;
                        paymentModePending = true;

                    }
                    String totalNow = "0";
                    if (totalCreditAsOfNowD > 0 && !paymentModePending) {
                        totalNow = "-" + totalCreditAsOfNowD;
                    } else if (totalCreditAsOfNowD > 0 && paymentModePending) {
                        totalNow = String.valueOf(totalCreditAsOfNowD);
                    } else if (totalCreditAsOfNowD < 0) {
                        totalNow = String.valueOf(totalCreditAsOfNowD);
                    } else {
                        totalNow = "0";
                    }
                    this.monitordao.updateCreditAccountForCustomer(customerName.toUpperCase(), customerId, totalNow, status);
                } else {

                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "true";
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public @ResponseBody
    String handleFileUpload(
            @RequestParam(name = "file", required = false) MultipartFile file) {
        String name = "test11";

        logger.info("File upload in progress...");

        if (!file.isEmpty()) {

            if (!file.isEmpty()) {
                try {
                    writeToFile(file.getInputStream());
                    logger.info("File upload...finished");

                } catch (IOException ex) {
                    Logger.getLogger(CoreService.class
                            .getName()).log(Level.SEVERE, null, ex);
                }
            }

            BufferedOutputStream stream = null;
            try {
                byte[] bytes = file.getBytes();

                stream = new BufferedOutputStream(new FileOutputStream(new File(name + "-uploaded")));
                stream.write(bytes);
                stream.close();
                return "You successfully uploaded " + name + " into " + name + "-uploaded !";
            } catch (Exception e) {
                return "You failed to upload " + name + " => " + e.getMessage();
            } finally {
                if (stream != null) {
                    try {
                        stream.close();

                    } catch (IOException ex) {
                        Logger.getLogger(CoreService.class
                                .getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }
        } else {
            return "You failed to upload " + name + " because the file was empty.";
        }
    }

// save uploaded file to new location
    private String writeToFile(InputStream uploadedInputStream) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(uploadedInputStream));
        String str = null;
        List<ProductMaster> productList = new ArrayList<ProductMaster>();
        boolean skipHeader = false;
        try {
            while ((str = reader.readLine()) != null) {

                if (skipHeader == false) {
                    skipHeader = true;
                    logger.info(str + "..header skipped");
                    continue;
                }

                logger.info("Reading line : " + str);
                CSVParser parser = new CSVParser(',', '"', '\\', false);

                String[] cols = parser.parseLine(str);
                //String[] cols = str.split(",");
                ProductMaster prod = new ProductMaster();
                //for(int i=0;i<cols.length;i++){
                logger.info(cols[0].trim() + " " + cols[1].trim());

                try {
                    prod.setDate(cols[0].trim());
                } catch (Exception e) {
                    logger.info("Date can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setProductName(cols[1].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("Product name can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setPacking(cols[2].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("Packing can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setQuantityInShop(cols[3].trim());
                } catch (Exception e) {
                    logger.info("QuantityInShop can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setFree(cols[4].trim());
                } catch (Exception e) {
                    logger.info("Free can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setBatchNo(cols[5].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("BatchNo can not be set as, File is not having it..skipped");
                }

                try {
                    String expireDate = cols[6];
                    if (expireDate != null && expireDate.trim().length() > 0) {
                        expireDate = getWellFormedExpDate(expireDate);
                    }
                    prod.setExpireDate(expireDate);
                } catch (Exception e) {
                    logger.info("ExpireDate can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setMrp(cols[7]);
                } catch (Exception e) {
                    logger.info("MRP name can not be set as, File is not having it..skipped");
                }

                try {

                    prod.setPurchaseRate(cols[8].trim());
                    //}
                } catch (Exception e) {
                    logger.info("AmountPerUnit name can not be set as, File is not having it..skipped");
                }

                try {
                    String taxes = cols[9];
                    if (taxes.indexOf('%') > 0) {
                        taxes = taxes.substring(0, taxes.indexOf('%') - 1);
                        double taxesd = Double.parseDouble(taxes) / 2;
                        prod.setCgst(String.valueOf(taxesd) + "%");
                        prod.setSgst(String.valueOf(taxesd) + "%");
                    } else {
                        prod.setCgst(taxes);
                    }
                } catch (Exception e) {
                    logger.info("CGST can not be set as, File is not having it..skipped");
                }

                try {
                    //prod.setSgst(cols[11]);
                } catch (Exception e) {
                    logger.info("SGST can not be set as, File is not having it..skipped");
                }

                try {
                    //prod.setIgst(cols[12]);
                } catch (Exception e) {
                    logger.info("IGST can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setDiscount(cols[10].trim());
                } catch (Exception e) {
                    logger.info("Discount can not be set as, File is not having it..skipped");
                }

                //12 is for total.. sciping as do not need to store in DB
                try {
                    prod.setCompany(cols[12].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("Company can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setDistributerName(cols[14].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("DistributerName can not be set as, File is not having it..skipped");
                }

                try {
                    prod.setDrugSchedule(cols[15].trim().toUpperCase());
                } catch (Exception e) {
                    logger.info("DistributerName can not be set as, File is not having it..skipped");
                }

                //try {
                //   prod.setDistributerNumber(cols[16].trim());
                // } catch (Exception e) {
                //  logger.info("DistributerNumber can not be set as, File is not having it..skipped");
                //}
                productList.add(prod);
            }
        } catch (Exception e) {

        }

        String result = this.monitordao.addProductsFromFile(productList);
        return result;
    }

    private String getWellFormedExpDate(String expireDate) {
        StringBuilder builder = new StringBuilder();

        if (expireDate.trim().toUpperCase().startsWith("JAN")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 0);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("01");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("FEB")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 1);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("02");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("MAR")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 2);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("03");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("APR")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 3);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("04");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("MAY")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 4);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("05");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("JUN")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 5);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("06");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("JUL")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 6);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("07");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("AUG")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 7);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("08");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("SEP")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 8);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("09");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("OCT")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 9);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("10");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("NOV")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 10);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("11");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        } else if (expireDate.trim().toUpperCase().startsWith("DEC")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[expireDateArr.length - 1]));
            c.set(Calendar.MONTH, 11);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("12");
            builder.append("-");
            builder.append(expireDateArr[expireDateArr.length - 1]);
        }

        if (expireDate.trim().toUpperCase().endsWith("JAN")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 0);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("01");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("FEB")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 1);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("02");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("MAR")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 2);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("03");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("APR")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 3);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("04");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("MAY")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 4);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("05");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("JUN")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 5);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("06");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("JUL")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 6);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("07");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("AUG")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 7);
            ///logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("08");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("SEP")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 8);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("09");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("OCT")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 9);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("10");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("NOV")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 10);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("11");
            builder.append("-");
            builder.append(expireDateArr[0]);
        } else if (expireDate.trim().toUpperCase().endsWith("DEC")) {
            String expireDateArr[] = expireDate.trim().split("-");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.YEAR, Integer.parseInt(expireDateArr[0]));
            c.set(Calendar.MONTH, 11);
            //logger.info(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append(c.getActualMaximum(Calendar.DAY_OF_MONTH));
            builder.append("-");
            builder.append("12");
            builder.append("-");
            builder.append(expireDateArr[0]);
        }

        return builder.toString();
    }
}
