/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.controller;

import com.connection.ConnectionManager;
import com.param.medicalapp.kiterx.kiterx.dao.MonitoringDao;
import java.sql.Timestamp;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;

/**
 *
 * @author Param
 */
public class MainTest {

    public static void main(String[] a) {
        MonitoringDao monitordao;
        try {
            System.out.println("**************** iinit ");
            monitordao = new MonitoringDao();
            monitordao.setDataSource(ConnectionManager.getConnectionManager().getDataSource());
            System.out.println("**************** iinit 22");
            System.out.println("Data base created dao object : " + monitordao);

            List<String> billNumbers = monitordao.getDistinctBillNo();

            for (String billNo : billNumbers) {

                try {
                    System.out.println("Bill no : " + billNo);

                    String CUSTOMER_NAME = "WALK-IN";
                    String CUSTOMER_MOBILE_NUM = "";
                    String BILL_SERIAL_NUMBER = billNo;
                    String BILLING_DATE = monitordao.getBillingDate(billNo);
                    String TOTAL_AMOUNT_PAID = monitordao.getTotalAmountPaid(billNo);
                    String ADDRESS = "";
                    String PRESCRIBER_NAME = "SELF";
                    String PRESCRIPTION_DATE = "";
                    String ADDITIONAL_DISCOUNT = monitordao.getAdditionalDiscount(billNo);;
                    String TOTALCGSTPAID = monitordao.getTotalCGST(billNo);
                    String TOTALIGSTPAID = monitordao.getTotalIGST(billNo);
                    String TOTALSGSTPAID = monitordao.getTotalSGST(billNo);
                    String TOTALPRODUCTDISCOUNT = "0";
                    String ISPURCHASEORDER = "0";
                    String IS_PURCHASEORDER = "0";
                    String TOTALTAXABLEAMOUNT = monitordao.getTotalTaxableAmount(billNo);
                    Timestamp CREATED_AT = monitordao.getCreatedAt(billNo);
                    String PAYMENT_TYPE = "CASH";
                    String CREDIT_STATUS = "PAID";
                    String CREDIT_NOTES = "";
                    String CREDIT_AMOUNT = "0";
                    String FIELD_1 = "";
                    String FIELD_2 = "";
                    String FIELD_3 = "";
                    String FIELD_4 = "";
                    String GRAND_TOTAL = String.valueOf(Double.parseDouble(TOTAL_AMOUNT_PAID) - Double.parseDouble(ADDITIONAL_DISCOUNT));
                    String GRAPH_DATE = "";
                    String BILL_PRINT_NO = monitordao.getBillPrintNo(billNo);
                    String CUSTOMER_ID = "1";
                    String IS_HIDDEN = monitordao.getIsHidden(billNo);

                    

                    monitordao.addCustomerBillDetail(CUSTOMER_NAME, CUSTOMER_ID, "", "SELF", "", billNo, BILLING_DATE, TOTAL_AMOUNT_PAID, ADDITIONAL_DISCOUNT, ISPURCHASEORDER, TOTALCGSTPAID, TOTALIGSTPAID, TOTALPRODUCTDISCOUNT, TOTALSGSTPAID, TOTALTAXABLEAMOUNT, PAYMENT_TYPE, CREDIT_AMOUNT, "", BILL_PRINT_NO);

                } catch (Exception e) {
                    System.out.println("**Error while inserting customer data for bill : " + billNo);
                }
                
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            Logger.getLogger(CoreService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
