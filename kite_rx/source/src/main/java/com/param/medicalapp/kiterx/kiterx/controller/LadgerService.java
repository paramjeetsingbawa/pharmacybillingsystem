/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.controller;

/**
 *
 * @author Param
 */

import com.connection.ConnectionManager;
import com.param.medicalapp.kiterx.kiterx.domain.CustomerBillingDetails;
import com.param.medicalapp.kiterx.kiterx.domain.ProductMaster;

import com.param.medicalapp.kiterx.kiterx.dao.MonitoringDao;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/rest/LadgerService")
public class LadgerService {

    private static Logger logger = Logger.getLogger(LadgerService.class.getCanonicalName());
    
    
    private static MonitoringDao monitordao;
    
    @PostConstruct
    public void init() {
        try {
            DataSource data = ConnectionManager.getConnectionManager().getDataSource();
            monitordao = new MonitoringDao();
            monitordao.setDataSource(ConnectionManager.getConnectionManager().getDataSource());
        } catch (Exception ex) {
            Logger.getLogger(CoreService.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    

    @RequestMapping(value = "/getCustomerDetail",
            method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public List<ProductMaster> getCustomerDetail(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "phone", required = false) String phone,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "contact", required = false) String formula, @RequestParam(name = "contact", required = false) String quantity,
            @RequestParam(name = "isCreditSearch", required = false) String batchNo) {

       

//        List<ProductMaster> productList = monitordao.getProductDetail(productId, expireDate, productName, company, formula, batchNo,schedule,
//                quantity, sortColumn, sortFilter, null);
        return null;
    }

    @RequestMapping(value = "/getCustomerImage",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public Map<String, String> getCustomerImage(
            @RequestParam(name = "id", required = false) String id) {
        String sql = "select USER_IMAGE from CUSTOMER_ACCOUNT_MASTER where id=" + id;
        Map<String, String> map = new HashMap<>();
        String str = monitordao.queryForUserImage(sql);
        map.put("id", id);
        map.put("image", str);
        return map;
    }

    @RequestMapping(value = "/getCustomers",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<Map<String, Object>> getCustomers(
            @RequestParam(name = "id", required = false) String id,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "mobile", required = false) String mobile,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "contact", required = false) String contact,
            @RequestParam(name = "isCreditSearch", required = false) String isCreditSearch,
            @RequestParam(name = "onlyPending", required = false) String onlyPending, @RequestParam(name = "pageNo", required = false) String pageNo,
            @RequestParam(name = "pageSize", required = false) String pageSize) {

      

        String sql = "select UCASE(NAME) as NAME,ID,CONTACT_NAME,MOBILE,ADDRESS,EMAIL,IS_CREDIT_ACCOUNT,PHONE_1,TTYPE,GSTIN,MAX_CREDIT_AMOUNT,"
                + "KEYWORDS,FOLLOWUP_DATE_INTERVAL,TOTAL_BILL_AMOUNT,"
                + "TOTAL_CREDIT_ASOFNOW,DEFAULT_DISCOUNT,CREATED_AT from CUSTOMER_ACCOUNT_MASTER ";
        boolean executeAnd = false;
        if (isCreditSearch != null && isCreditSearch.equalsIgnoreCase("1")) {
            sql = sql + " where IS_CREDIT_ACCOUNT='1'";
            executeAnd = true;
        } else if (isCreditSearch != null && isCreditSearch.equalsIgnoreCase("0")) {
            sql = sql + " where IS_CREDIT_ACCOUNT='0'";
            executeAnd = true;
        }

        if (name != null && name.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(NAME) like '%" + name.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(NAME) like '%" + name.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (mobile != null && mobile.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(MOBILE) like '%" + mobile.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(MOBILE) like '%" + mobile.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (id != null && id.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and ID =" + id.trim() + "";
            } else {
                sql = sql + " where ID =" + id.trim() + "";
            }
            executeAnd = true;
        }

        if (onlyPending != null && onlyPending.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and TOTAL_CREDIT_ASOFNOW > 0";
            } else {
                sql = sql + " where TOTAL_CREDIT_ASOFNOW > 0";
            }
            executeAnd = true;
        }
        int pS = 100;
        try {
            pS = Integer.parseInt(pageSize);
        } catch (Exception e) {

        }
        int pN = 0;
        try {
            pN = Integer.parseInt(pageNo);
        } catch (Exception e) {

        }
        //sql = sql + " order by NAME";

        sql = sql + " ORDER BY CREATED_AT desc OFFSET " + (pN * pS) + " ROWS FETCH NEXT " + pS + " ROWS ONLY";

        return monitordao.queryForList(sql);
    }

    @RequestMapping(value = "/getCustomerPayments",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<Map<String, Object>> getCustomerPayments(
            @RequestParam(name = "id", required = false) String id,
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "checqueno", required = false) String checqueno,
            @RequestParam(name = "cardno", required = false) String cardno,
            @RequestParam(name = "ddno", required = false) String ddno,
            @RequestParam(name = "paytype", required = false) String paytype,
            @RequestParam(name = "billNo", required = false) String billNo
    ) {

       

        String sql = "select UCASE(CUSTOMER_NAME) as NAME, CUSTOMER_ID,ID,PAY_TYPE,CHEQUE_NO,CARD_NO,DD_NO,RECIEVED_BY,RECIEVED_FROM,"
                + "PAYMENT_AMOUNT,CREDIT_BALANCE,CREATED_AT,PAYMENT_AGAINST_BILLNO from CUSTOMER_PAYMENT_MASTER ";
        boolean executeAnd = false;

        /*if(name == null || name.trim().length() == 0){
            return null;
        }*/
        if (name != null && name.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(CUSTOMER_NAME) like '%" + name.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(CUSTOMER_NAME) like '%" + name.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (id != null && id.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and CUSTOMER_ID=" + id + "";
            } else {
                sql = sql + " where CUSTOMER_ID=" + id + "";
            }
            executeAnd = true;
        }

        if (checqueno != null && checqueno.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(CHEQUE_NO) like '%" + checqueno.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(CHEQUE_NO) like '%" + checqueno.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (cardno != null && cardno.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(CARD_NO) like '%" + cardno.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(CARD_NO) like '%" + cardno.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (ddno != null && ddno.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(DD_NO) like '%" + ddno.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(DD_NO) like '%" + ddno.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        if (paytype != null && paytype.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(PAY_TYPE) like '%" + paytype.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(PAY_TYPE) like '%" + paytype.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        sql = sql + " order by CREATED_AT desc OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY";
        return monitordao.queryForList(sql);
    }

    @RequestMapping(value = "/getCustomerNames",
            method = RequestMethod.GET, produces = {"application/json"})
    @ResponseBody
    public List<Map<String, Object>> getCustomerNames(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "email", required = false) String email,
            @RequestParam(name = "mobile", required = false) String mobile,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "contact", required = false) String contact,
            @RequestParam(name = "isCreditSearch", required = false) String isCreditSearch) {

        

        String sql = "select UCASE(NAME) as NAME,ID  from CUSTOMER_ACCOUNT_MASTER where NAME != ''  ";
        logger.info("************* name : " + name);
        if (name == null || name.trim().length() == 0) {
            return null;
        }

        boolean executeAnd = true;
        if (isCreditSearch != null && isCreditSearch.equalsIgnoreCase("1")) {
            sql = "select UCASE(NAME) as NAME,ID  from CUSTOMER_ACCOUNT_MASTER where IS_CREDIT_ACCOUNT='1' ";
            executeAnd = true;
        }

        if (name != null && name.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and TRIM(UCASE(NAME)) like '%" + name.toUpperCase().trim() + "%'";
            } else {
                sql = sql + " where TRIM(UCASE(NAME)) like '%" + name.toUpperCase().trim() + "%'";
            }
            executeAnd = true;
        }

        if (mobile != null && mobile.trim().length() > 0) {
            if (executeAnd) {
                sql = sql + " and UCASE(MOBILE) like '%" + mobile.toUpperCase() + "%'";
            } else {
                sql = sql + " where UCASE(MOBILE) like '%" + mobile.toUpperCase() + "%'";
            }
            executeAnd = true;
        }

        sql = sql + " order by NAME OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY";
        return monitordao.queryForList(sql);
    }

    @RequestMapping(value = "/quickAddCustomer",
            method = RequestMethod.POST)
    @ResponseBody
    public boolean quickAddCustomer(
            @RequestParam(name = "userImg", required = false) String userImg,
            @RequestParam(name = "NAME", required = false) String NAME,
            @RequestParam(name = "ID", required = false) String ID,
            @RequestParam(name = "CONTACT_NAME", required = false) String CONTACT_NAME,
            @RequestParam(name = "MOBILE", required = false) String MOBILE,
            @RequestParam(name = "ADDRESS", required = false) String ADDRESS,
            @RequestParam(name = "EMAIL", required = false) String EMAIL,
            @RequestParam(name = "IS_CREDIT_ACCOUNT", required = false) String IS_CREDIT_ACCOUNT,
            @RequestParam(name = "PHONE_1", required = false) String PHONE_1,
            @RequestParam(name = "TTYPE", required = false) String TTYPE,
            @RequestParam(name = "GSTIN", required = false) String GSTIN,
            @RequestParam(name = "MAX_CREDIT_AMOUNT", required = false) String MAX_CREDIT_AMOUNT,
            @RequestParam(name = "KEYWORDS", required = false) String KEYWORDS,
            @RequestParam(name = "FOLLOWUP_DATE_INTERVAL", required = false) String FOLLOWUP_DATE_INTERVAL,
            @RequestParam(name = "TOTAL_BILL_AMOUNT", required = false) String TOTAL_BILL_AMOUNT,
            @RequestParam(name = "TOTAL_CREDIT_ASOFNOW", required = false) String TOTAL_CREDIT_ASOFNOW,
            @RequestParam(name = "DEFAULT_DISCOUNT", required = false) String DEFAULT_DISCOUNT
    ) {
        System.out.println("File : " + userImg);
        byte[] bytes = null;
        try {
            bytes = userImg.getBytes();
        } catch (Exception e) {

        }

        if (bytes != null) {
            System.out.println("User image is supplied in request : " + bytes.length);
        }

       

        int inserted = monitordao.quickAddCustomer(NAME, ID, CONTACT_NAME, MOBILE, ADDRESS, EMAIL,
                IS_CREDIT_ACCOUNT, PHONE_1, TTYPE, GSTIN, MAX_CREDIT_AMOUNT, KEYWORDS, FOLLOWUP_DATE_INTERVAL, TOTAL_BILL_AMOUNT,
                TOTAL_CREDIT_ASOFNOW, DEFAULT_DISCOUNT, userImg);
        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/quickDeleteCustomer", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean quickDeleteCustomer(
            @RequestParam(name = "ID", required = false) String ID) {
        
        int inserted = monitordao.quickDeleteCustomer(ID);
        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/quickAddCustomerPayment", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean quickAddCustomerPayment(
            @RequestParam(name = "CUSTOMER_NAME", required = false) String CUSTOMER_NAME,
            @RequestParam(name = "ID", required = false) String ID,
            @RequestParam(name = "CUSTOMER_ID", required = false) String CUSTOMER_ID,
            @RequestParam(name = "PAY_TYPE", required = false) String PAY_TYPE,
            @RequestParam(name = "CHEQUE_NO", required = false) String CHEQUE_NO,
            @RequestParam(name = "CARD_NO", required = false) String CARD_NO,
            @RequestParam(name = "DD_NO", required = false) String DD_NO,
            @RequestParam(name = "RECIEVED_BY", required = false) String RECIEVED_BY,
            @RequestParam(name = "RECIEVED_FROM", required = false) String RECIEVED_FROM,
            @RequestParam(name = "PAYMENT_AMOUNT", required = false) String PAYMENT_AMOUNT,
            @RequestParam(name = "CREDIT_BALANCE", required = false) String CREDIT_BALANCE
    ) {

        

        int inserted = monitordao.quickAddCustomerPaymentString(CUSTOMER_NAME, ID, CUSTOMER_ID, PAY_TYPE, CHEQUE_NO, CARD_NO, DD_NO, RECIEVED_BY, RECIEVED_FROM, PAYMENT_AMOUNT, CREDIT_BALANCE, "");
        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/quickUpdateCustomerPayment", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean quickUpdateCustomerPayment(
            @RequestParam(name = "CUSTOMER_NAME", required = false) String CUSTOMER_NAME,
            @RequestParam(name = "ID", required = false) String ID,
            @RequestParam(name = "CUSTOMER_ID", required = false) String CUSTOMER_ID,
            @RequestParam(name = "PAY_TYPE", required = false) String PAY_TYPE,
            @RequestParam(name = "CHEQUE_NO", required = false) String CHEQUE_NO,
            @RequestParam(name = "CARD_NO", required = false) String CARD_NO,
            @RequestParam(name = "DD_NO", required = false) String DD_NO,
            @RequestParam(name = "RECIEVED_BY", required = false) String RECIEVED_BY,
            @RequestParam(name = "RECIEVED_FROM", required = false) String RECIEVED_FROM,
            @RequestParam(name = "PAYMENT_AMOUNT", required = false) String PAYMENT_AMOUNT,
            @RequestParam(name = "CREDIT_BALANCE", required = false) String CREDIT_BALANCE
    ) {

        

        int inserted = monitordao.quickUpdateCustomerPaymentString(CUSTOMER_NAME, ID, CUSTOMER_ID, PAY_TYPE, CHEQUE_NO, CARD_NO, DD_NO, RECIEVED_BY, RECIEVED_FROM, PAYMENT_AMOUNT, CREDIT_BALANCE);
        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/quickUpdateCustomer", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean quickUpdateCustomer(
            @RequestParam(name = "NAME", required = false) String NAME,
            @RequestParam(name = "ID", required = false) String ID,
            @RequestParam(name = "CONTACT_NAME", required = false) String CONTACT_NAME,
            @RequestParam(name = "MOBILE", required = false) String MOBILE,
            @RequestParam(name = "ADDRESS", required = false) String ADDRESS,
            @RequestParam(name = "EMAIL", required = false) String EMAIL,
            @RequestParam(name = "IS_CREDIT_ACCOUNT", required = false) String IS_CREDIT_ACCOUNT,
            @RequestParam(name = "PHONE_1", required = false) String PHONE_1,
            @RequestParam(name = "TTYPE", required = false) String TTYPE,
            @RequestParam(name = "GSTIN", required = false) String GSTIN,
            @RequestParam(name = "MAX_CREDIT_AMOUNT", required = false) String MAX_CREDIT_AMOUNT,
            @RequestParam(name = "KEYWORDS", required = false) String KEYWORDS,
            @RequestParam(name = "FOLLOWUP_DATE_INTERVAL", required = false) String FOLLOWUP_DATE_INTERVAL,
            @RequestParam(name = "TOTAL_BILL_AMOUNT", required = false) String TOTAL_BILL_AMOUNT,
            @RequestParam(name = "TOTAL_CREDIT_ASOFNOW", required = false) String TOTAL_CREDIT_ASOFNOW,
            @RequestParam(name = "DEFAULT_DISCOUNT", required = false) String DEFAULT_DISCOUNT,
            @RequestParam(name = "paymentRsUp", required = false) String paymentRsUp,
            @RequestParam(name = "chequeNoUp", required = false) String chequeNoUp,
            @RequestParam(name = "cardNup", required = false) String cardNup,
            @RequestParam(name = "ddNoUp", required = false) String ddNoUp,
            @RequestParam(name = "againstBillNo", required = false) String againstBillNo
    ) {

        

        try {

            Double d1 = Double.parseDouble(TOTAL_CREDIT_ASOFNOW);
            Double d2 = Double.parseDouble(paymentRsUp);

            TOTAL_CREDIT_ASOFNOW = String.valueOf(d1 - d2);

        } catch (Exception e) {
            // e.printStackTrace();
        }

        int inserted = monitordao.quickUpdateCustomer(NAME, ID, CONTACT_NAME, MOBILE, ADDRESS, EMAIL,
                IS_CREDIT_ACCOUNT, PHONE_1, TTYPE, GSTIN, MAX_CREDIT_AMOUNT, KEYWORDS, FOLLOWUP_DATE_INTERVAL,
                TOTAL_BILL_AMOUNT, TOTAL_CREDIT_ASOFNOW, DEFAULT_DISCOUNT);

        String payTrype = "CASH";

        if (chequeNoUp != null && chequeNoUp.trim().length() > 0) {
            payTrype = "CHEQUE";
        }

        if (cardNup != null && cardNup.trim().length() > 0) {
            payTrype = "CARD-PAYMENT";
        }

        if (ddNoUp != null && ddNoUp.trim().length() > 0) {
            payTrype = "DEMAND-DRAFT";
        }

        try {

            if (paymentRsUp != null && paymentRsUp.trim().length() > 0) {
                monitordao.quickAddCustomerPaymentString(NAME.toUpperCase(),
                        ID, ID, payTrype, chequeNoUp, cardNup, ddNoUp, "", "", paymentRsUp, TOTAL_CREDIT_ASOFNOW, againstBillNo);
            }

        } catch (Exception e) {
            //  e.printStackTrace();
        }

        //Updating invoices 
        /**
         *
         * Auto Clearence of Invoice : 1) Search all invoices where customer
         * name is ? and payment type is pending order by Billing data asc
         *
         * if( Total credit pending == 0 ){ update all invoice data to set
         * credit amount as 0, and status to PAID }
         *
         * if(total credit pending < original credit amount){ for each invoice
         * record { if(total credit pending <  original credit amount of invoice){
         * //Set the original credit amount of invoice = original credit amount of invoice - total credit pending
         *
         * break;
         * //Do not update status, as payment still need to come
         * }else if(total credit pending == original credit amount of invoice){
         * set the original credit amount of invoice = 0 and change status to PAID
         * }else if(total credit pending > original credit amount of invoice){
         * set the original credit amount of invoice = 0 and change status to
         * PAID total credit pending = total credit pending - original credit
         * amount of invoice }
         *
         * }
         * }
         *
         *
         */
        List<CustomerBillingDetails> customerInvoices = monitordao.getCustomerBillingDetail(10000, NAME.toUpperCase(), ID,
                "", false, "", "", "", "asc", "3", "0", String.valueOf(Integer.MAX_VALUE));

        logger.info("Total records need to bulk update : " + customerInvoices);

        Double d = Double.parseDouble(TOTAL_CREDIT_ASOFNOW);

        if (d <= 0) {
            monitordao.updateCreditForCustomer(NAME.toUpperCase(), ID, "0", "PAID", "");
        } else {
            try {
                d = Double.parseDouble(paymentRsUp);
                for (CustomerBillingDetails invoice : customerInvoices) {

                    if (d <= 0.0) {
                        break;
                    }

                    try {
                        Double orgCreditAmount = Double.parseDouble(invoice.getCreditAmount());

                        Double pendingCreditAmount = d;

                        logger.info("orgCreditAmount : " + orgCreditAmount);
                        logger.info("pendingCreditAmount : " + pendingCreditAmount);

                        if (Double.compare(pendingCreditAmount, orgCreditAmount) < 0) {
                            orgCreditAmount = orgCreditAmount - pendingCreditAmount;
                            monitordao.updateCreditForCustomerInvoice(NAME.toUpperCase(), ID,
                                    String.valueOf(orgCreditAmount),
                                    invoice.getBillNo(), "PAYMENT-PENDING");
                            d = 0.0;
                        } else if (Double.compare(pendingCreditAmount, orgCreditAmount) == 0) {
                            monitordao.updateCreditForCustomerInvoice(NAME.toUpperCase(), ID,
                                    String.valueOf(0),
                                    invoice.getBillNo(), "PAID");
                            d = 0.0;
                        } else if (Double.compare(pendingCreditAmount, orgCreditAmount) > 0) {
                            d = d - orgCreditAmount;
                            monitordao.updateCreditForCustomerInvoice(NAME.toUpperCase(), ID,
                                    String.valueOf(0),
                                    invoice.getBillNo(), "PAID");
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } catch (Exception e) {

            }

        }

        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    @RequestMapping(value = "/quickAddCompany", method = RequestMethod.GET, headers = "Accept=application/json", produces = {"application/json"})
    @ResponseBody
    public boolean quickAddCompany(
            @RequestParam(name = "name", required = false) String name
    ) {

        
        int inserted = 0;//monitordao.quickAddCompany(name);
        if (inserted > 0) {
            return true;
        } else {
            return false;
        }
    }

}
