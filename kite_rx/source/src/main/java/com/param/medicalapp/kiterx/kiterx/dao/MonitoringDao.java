/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.dao;

import com.param.medicalapp.kiterx.kiterx.domain.BillMaster;
import com.param.medicalapp.kiterx.kiterx.domain.CustomerAccountMaster;
import com.param.medicalapp.kiterx.kiterx.domain.CustomerBillingDetails;
import com.param.medicalapp.kiterx.kiterx.domain.ProductMaster;
import com.param.medicalapp.kiterx.kiterx.domain.ProductSalesChart;
import com.param.medicalapp.kiterx.kiterx.domain.PurchaseOrderMaster;
import com.param.medicalapp.kiterx.kiterx.domain.SaleChartMaster;
import com.param.medicalapp.kiterx.kiterx.domain.SalesChart;
import com.param.medicalapp.kiterx.kiterx.controller.CoreService;
import com.vivsoft.model.ApplicationConfiguration;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.support.JdbcDaoSupport;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

/**
 *
 * @author paramjeet
 */
public class MonitoringDao {

    private static Logger logger = Logger.getLogger(MonitoringDao.class.getCanonicalName());

    private final static String findServiceUnit = "SELECT SUNAME, SUZIPARCHIVE FROM ServiceUnit";

    private JdbcTemplate jdbcTemplate = null;
    private DataSource datasource;

    public void setDataSource(DataSource datasource) {
        this.datasource = datasource;

        logger.info("Data (datasource)  " + datasource);

        this.jdbcTemplate = new JdbcTemplate(datasource);
    }

    public Connection getDBConnection() throws SQLException {
        return this.datasource.getConnection();
    }

    public String getBillingDate(String billingSerialNo) {
        String SQL = "SELECT BILLING_DATE from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "";
        }
        return obj;
    }

    public String getTotalAmountPaid(String billingSerialNo) {
        String SQL = "SELECT TOTAL_AMOUNT from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public String getTotalTaxableAmount(String billingSerialNo) {
        String SQL = "SELECT TAXABLE_AMOUNT from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public Timestamp getCreatedAt(String billingSerialNo) {
        String SQL = "SELECT CREATED_AT from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        Timestamp obj = null;
        try {
            obj = jdbcTemplate.queryForObject(SQL, Timestamp.class);
        } catch (Exception e) {
            obj = null;
        }
        return obj;
    }

    public String getBillPrintNo(String billingSerialNo) {
        String SQL = "SELECT BILL_PRINT_NUMBER from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "";
        }
        return obj;
    }

    public String getIsHidden(String billingSerialNo) {
        String SQL = "SELECT IS_HIDDEN from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public String getAdditionalDiscount(String billingSerialNo) {
        String SQL = "SELECT TOTAL_DISCOUNT from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "'  ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public String getTotalIGST(String billingSerialNo) {
        String SQL = "SELECT TOTAL_IGST_PAID from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public String getTotalSGST(String billingSerialNo) {
        String SQL = "SELECT TOTAL_SGST_PAID from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "' ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public String getTotalCGST(String billingSerialNo) {
        String SQL = "SELECT TOTAL_CGST_PAID from BILL_TAXES where BILL_SERIAL_NUMBER='" + billingSerialNo + "'  ";
        String obj = "";
        try {
            obj = jdbcTemplate.queryForObject(SQL, String.class);
        } catch (Exception e) {
            obj = "";
        }
        if(obj == null) {
            return "0";
        }
        return obj;
    }

    public int getCGST6Count(String billingSerialNo) {
        String SQL = "SELECT count(*) from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' and CGST like '6.0%' ";
        int count = 0;
        try {
            count = jdbcTemplate.queryForObject(SQL, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public int getCGST2_5Count(String billingSerialNo) {
        String SQL = "SELECT count(*) from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' and CGST like '2.5%' ";
        int count = 0;
        try {
            count = jdbcTemplate.queryForObject(SQL, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public int getCGST9Count(String billingSerialNo) {
        String SQL = "SELECT count(*) from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' and CGST like '9.0%' ";
        int count = 0;
        try {
            count = jdbcTemplate.queryForObject(SQL, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public int getCGST14Count(String billingSerialNo) {
        String SQL = "SELECT count(*) from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' and CGST like '14.0%' ";
        int count = 0;
        try {
            count = jdbcTemplate.queryForObject(SQL, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public int getCGST0Count(String billingSerialNo) {
        String SQL = "SELECT count(*) from BILL_MASTER where BILL_SERIAL_NUMBER='" + billingSerialNo + "' and CGST like '0%' ";
        int count = 0;
        try {
            count = jdbcTemplate.queryForObject(SQL, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public String updateProductDetail(String productId, String productName, String company, String formula,
            String batchNo, String expiryDate, String manfactureDate, String quantity,
            String amount, String disName, String disNo, String discount, String cgst, String sgst, String igst,
            String mrp, String free, String packing, String date, String schedule, String pRate, String margin, String updatePurchase) {

        String SQL = "UPDATE PRODUCT_MASTER SET PRODUCT_NAME=? , COMPANY=?  ,FORMULA=?  ,BATCH_NO=?  ,MANUFACTURE_DATE=?  "
                + ",EXPIRE_DATE=?  ,QUANTITY_IN_SHOP=?  ,AMOUNT_PER_UNIT=?, DISTUBUTER_NAME=?, DISTIBUTER_NUMBER=?, DISCOUNT=?, "
                + "CGST=?, SGST=?, IGST=?, MRP=?, FREE=?, PACKING=?, DRUG_SCHEDULE=?, PURCHASE_RATE=?,MARGIN=? WHERE PRODUCT_ID=" + productId;

        logger.info("updateProductDetail executing sql : " + SQL);

        try {
            int i = this.jdbcTemplate.update(SQL, new Object[]{productName, company, formula, batchNo,
                manfactureDate, expiryDate, quantity, amount, disName, disNo, discount, cgst, sgst, igst, mrp, free, packing, schedule, pRate, margin});

            if (updatePurchase.equalsIgnoreCase("1")) {
                String SQL2 = "UPDATE PURCHASE_ORDER_MASTER SET PRODUCT_NAME=?, COMPANY=?, BATCH=? "
                        + ",EXPIRY=? , QUANTITY_PURCHASED=?, DISTRIBUTER_NAME=?, DISTRIBUTER_NO=?, PRODUCT_DISCOUNT=?, "
                        + "CGST=?, SGST=?, IGST=?, MRP=?, FREE=?, PACKING=?, DRUG_SCHEDULE=?, AMOUNT=?, MARGIN=? WHERE PRODUCT_ID=" + productId;

                logger.info("addPurchaseOrderDetail executing sql : " + SQL2);
                try {
                    i = this.jdbcTemplate.update(SQL2, new Object[]{
                        productName, company, batchNo, expiryDate, quantity, disName, disNo, discount, cgst, sgst, igst, mrp, free,
                        packing, schedule, pRate, margin
                    });
                    logger.info("addPurchaseOrderDetail product detail inserted ...success");
                    return "true";

                } catch (Exception e) {
                    e.printStackTrace();
                    return "false";
                }
            } else {
                return "true";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }
    }

    public int addAndGetPrintNo(final String saleDate) {
        String SQL = "INSERT INTO BILL_PRINT_NO (BILL_DATE) VALUES(?)";

        KeyHolder generatedKeyHolder = new GeneratedKeyHolder();

        this.jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection cnctn) throws SQLException {
                PreparedStatement ps = cnctn.prepareStatement(SQL, new String[]{"PRINT_NO"});
                ps.setString(1, saleDate);
                return ps;
            }
        }, generatedKeyHolder);
        return generatedKeyHolder.getKey().intValue();
    }

    public String addProductDetail(final String productName, final String company, final String formula, final String batchNo,
            final String expiryDate, final String manfactureDate, final String quantity, final String amount,
            final String disName, final String disNo, final String discount, final String cgst, final String sgst, final String igst,
            final String mrp, final String free,
            final String packing, final String date, final String schedule, final String pRate, final String margin) {

        String sql1 = "SELECT MAX(PRODUCT_ID) FROM PRODUCT_MASTER";
        Double productID = this.jdbcTemplate.queryForObject(sql1, Double.class);

        final String SQL = "INSERT INTO PRODUCT_MASTER(PRODUCT_NAME  ,COMPANY  ,FORMULA  ,BATCH_NO  ,"
                + "MANUFACTURE_DATE  ,EXPIRE_DATE  ,QUANTITY_IN_SHOP  ,AMOUNT_PER_UNIT, DISTUBUTER_NAME, "
                + "DISTIBUTER_NUMBER, DISCOUNT, CGST, SGST, IGST, MRP, FREE, PACKING, DATE, DRUG_SCHEDULE, PURCHASE_RATE, MARGIN)VALUES "
                + "(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        logger.info("addProductDetail executing sql : " + SQL);
        try {
            productID = productID + 1;

            KeyHolder generatedKeyHolder = new GeneratedKeyHolder();

            this.jdbcTemplate.update(new PreparedStatementCreator() {
                @Override
                public PreparedStatement createPreparedStatement(Connection cnctn) throws SQLException {
                    PreparedStatement ps = cnctn.prepareStatement(SQL, new String[]{"PRODUCT_ID"});
                    ps.setString(1, productName.trim());
                    ps.setString(2, company);
                    ps.setString(3, formula);
                    ps.setString(4, batchNo);
                    ps.setString(5, manfactureDate);
                    ps.setString(6, expiryDate);
                    ps.setString(7, quantity);
                    ps.setString(8, amount);
                    // ps.setTimestamp(9, new Timestamp(new Date().getTime()));
                    ps.setString(9, disName);
                    ps.setString(10, disNo);
                    ps.setString(11, discount);
                    ps.setString(12, cgst);
                    ps.setString(13, sgst);
                    ps.setString(14, igst);
                    ps.setString(15, mrp);
                    ps.setString(16, free);
                    ps.setString(17, packing);
                    ps.setString(18, date);
                    ps.setString(19, schedule);
                    ps.setString(20, pRate);
                    ps.setString(21, margin);
                    return ps;
                }
            }, generatedKeyHolder);

//            int i = this.jdbcTemplate.update(SQL, new Object[]{productID, productName, company, formula, batchNo,
//                manfactureDate, expiryDate, quantity, amount, disName, disNo, discount, cgst, sgst, igst, mrp, free, packing, date, schedule, pRate});
            logger.info(generatedKeyHolder.getKeys() + " generatedKeyHolder ");

            logger.info("addProductDetail product detail inserted ...success : generatedKeyHolder " + generatedKeyHolder.getKey());

            //PURCHASE_ORDER_MASTER 
            String SQL2 = "INSERT INTO PURCHASE_ORDER_MASTER(PRODUCT_ID,SERIAL_NUMBER,PRODUCT_NAME,QUANTITY_PURCHASED  ,"
                    + "AMOUNT, CGST, SGST, PRODUCT_DISCOUNT, DISTRIBUTER_NAME, DISTRIBUTER_NO, COMPANY, MRP, BATCH, EXPIRY, ENTRY_DATE, FREE, MARGIN) "
                    + "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            logger.info("addPurchaseOrderDetail executing sql : " + SQL2);
            try {
                int i = this.jdbcTemplate.update(SQL2, new Object[]{generatedKeyHolder.getKey().intValue(), UUID.randomUUID().toString().split("-")[0],
                    productName, quantity, pRate, cgst, sgst, discount, disName, disNo, company, mrp, batchNo, expiryDate, date, free, margin
                });
                logger.info("addPurchaseOrderDetail product detail inserted ...success");
                return "true";

            } catch (Exception e) {
                e.printStackTrace();
                return "false";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }
    }

    public String addCustomerBillDetail(String customerName, String customerID, String mobile,
            String prescriberName, String prescriptionDate, String billNo, String billDate, String totalAmount, String additionalDiscount,
            String isPurchaseOrder, String totalCGSTPaid,
            String totalIGSTPaid, String totalProductDiscount, String totalSGSTPaid, String totalTaxableAmount, String paymentType,
            String creditAmount, String creditComment, String printNo) {

        String creditStatus = "";
        if (paymentType == null || paymentType.trim().equalsIgnoreCase("") || paymentType.trim().equalsIgnoreCase("CASH")
                || paymentType.trim().equalsIgnoreCase("CARD-PAYMENT")) {
            creditStatus = "PAID";
        } else {
            creditStatus = "PAYMENT-PENDING";
        }
        String SQL = "INSERT INTO CUSTOMER_BILL_MASTER_2"
                + "(CUSTOMER_NAME, CUSTOMER_ID, CUSTOMER_MOBILE_NUMBER, PRESCRIBER_NAME, PRESCRIPTION_DATE ,"
                + "BILL_SERIAL_NUMBER,BILLING_DATE,TOTAL_AMOUNT_PAID, "
                + "ADDITIONAL_DISCOUNT,IS_PURCHASEORDER, TOTALCGSTPAID,TOTALSGSTPAID,TOTALIGSTPAID, TOTALPRODUCTDISCOUNT, "
                + "TOTALTAXABLEAMOUNT, GRAND_TOTAL, GRAPH_DATE,PAYMENT_TYPE,CREDIT_STATUS,CREDIT_NOTES,CREDIT_AMOUNT, BILL_PRINT_NO"
                + ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        //logger.info("addCustomerBillDetail executing sql : " + SQL);

        
        try {

            Double test = Double.parseDouble(totalAmount.trim());
            if (customerName == null) {
                customerName = "";
            }
            if (prescriberName == null) {
                prescriberName = "";
            }
            int i = this.jdbcTemplate.update(SQL, new Object[]{customerName.toUpperCase(), customerID, mobile, prescriberName.toUpperCase(),
                prescriptionDate, billNo, billDate, totalAmount, additionalDiscount, isPurchaseOrder, totalCGSTPaid, totalSGSTPaid,
                totalIGSTPaid, totalProductDiscount, totalTaxableAmount, test, billDate.trim().split(" ")[0], paymentType,
                creditStatus, creditComment, creditAmount, printNo});
            //logger.info("addCustomerBillDetail product detail inserted ...success");

            try {
                updateCustomerMasterData(1, billNo, false, null, null, null, Integer.parseInt(customerID), null, null);
            } catch (Exception e) {
                e.printStackTrace();
            }

            return "true";
        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }

    }

    public String addProductBillDetail(String billNo, String productName, String quantity, String totalAmount,
            String cgst, String sgst, String igst, String prodDis, String perunitPrice, String printNo) {

        //totalAmount = String.valueOf(Double.parseDouble(totalAmount.trim()) * Integer.parseInt(quantity.trim()));
        String SQL = "INSERT INTO BILL_MASTER(BILL_SERIAL_NUMBER,PRODUCT_ID,QUANTITY_PURCHASED,"
                + "AMOUNT, CGST, SGST, IGST, PRODUCT_DISCOUNT, AMOUNT_PER_UNIT,"
                + "PRODUCT_NAME,PRODUCT_BATCH,MRP,EXPIRY,DISTRIBUTER_NAME,DISTRIBUTER_NO,COMPANY,QUANTITY_INT,AMOUNT_INT,BILL_PRINT_NO) "
                + "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        logger.info("addProductBillDetail executing sql : " + SQL);
        try {

            List<ProductMaster> products = getProductDetail(productName, null, null, null, null, null, null, null, null, null, null, false);

            for (ProductMaster p : products) {
                double a1 = 0;
                try {
                    a1 = Double.parseDouble(quantity);
                } catch (Exception e) {
                    a1 = 0;
                }

                double a2 = 0;
                try {
                    a2 = Double.parseDouble(totalAmount);
                } catch (Exception e) {
                    a2 = 0;
                }

                int i = this.jdbcTemplate.update(SQL, new Object[]{billNo, productName, quantity, totalAmount, cgst, sgst, igst,
                    prodDis, perunitPrice, p.getProductName(), p.getBatchNo(), p.getMrp(),
                    p.getExpireDate(), p.getDistributerName(), p.getDistributerNumber(), p.getCompany(), a1, a2, printNo});
                logger.info("addProductBillDetail product detail inserted ...success");
                return "true";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }

        return "false";
    }

    public String addPurchaseOrderDetail(String billNo, String productName, String quantity, String totalAmount,
            String cgst, String sgst, String perunitPrice) {

        //totalAmount = String.valueOf(Double.parseDouble(totalAmount.trim()) * Integer.parseInt(quantity.trim()));
        String SQL = "INSERT INTO PURCHASE_ORDER_MASTER(SERIAL_NUMBER  ,PRODUCT_ID  ,QUANTITY_PURCHASED  ,AMOUNT, CGST, SGST, AMOUNT_PER_UNIT) "
                + "values(?,?,?,?,?,?,?)";

        logger.info("addPurchaseOrderDetail executing sql : " + SQL);
        try {
            int i = this.jdbcTemplate.update(SQL, new Object[]{billNo, productName, quantity, totalAmount, cgst, sgst, perunitPrice
            });
            logger.info("addPurchaseOrderDetail product detail inserted ...success");
            return "true";

        } catch (Exception e) {
            e.printStackTrace();
            return "false";
        }
    }

    public String updateSalesData(Integer maxrecord, String billNo) {
        String sql;

        sql = "select UCASE(CUSTOMER_NAME) as CUSTOMER_NAME,CUSTOMER_MOBILE_NUM,PAYMENT_TYPE,CREDIT_AMOUNT,ADDRESS,CREDIT_STATUS, TOTAL_AMOUNT_PAID "
                + "from CUSTOMER_BILL_MASTER_2 where CUSTOMER_NAME !=''";

        double totalAmount;
        Set<CustomerAccountMaster> customerNames = new TreeSet<>();
        TreeMap<String, Double> totalAmountMap = new TreeMap<>();
        TreeMap<String, Double> totalCreditAmountMap = new TreeMap<>();

        List<CustomerAccountMaster> list2 = this.jdbcTemplate.query(sql, new RowMapper() {
            public CustomerAccountMaster mapRow(ResultSet rs, int Rownum) throws SQLException {
                CustomerAccountMaster master = new CustomerAccountMaster();
                master.setName(rs.getString("CUSTOMER_NAME"));
                master.setMobile(rs.getString("CUSTOMER_MOBILE_NUM"));
                try {
                    String type = rs.getString("PAYMENT_TYPE");
                    if (type != null && type.equalsIgnoreCase("CREDIT")) {
                        master.setIsCreditAccount("1");
                    } else {
                        master.setIsCreditAccount("0");
                    }
                } catch (Exception e) {
                    master.setIsCreditAccount("0");
                }
                customerNames.add(master);
                try {
                    if (!totalAmountMap.containsKey(master.getName())) {
                        totalAmountMap.put(master.getName(), Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")));
                    } else {
                        Double totalAmount = totalAmountMap.get(master.getName());
                        Double t = Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")) + totalAmount;
                        totalAmountMap.put(master.getName(), t);
                    }
                } catch (Exception e) {

                }
                String status = rs.getString("CREDIT_STATUS");
                if (status != null && status.equalsIgnoreCase("PAYMENT-PENDING")) {
                    try {
                        if (!totalCreditAmountMap.containsKey(master.getName())) {
                            totalCreditAmountMap.put(master.getName(), Double.parseDouble(rs.getString("CREDIT_AMOUNT")));
                        } else {
                            Double totalAmount = totalCreditAmountMap.get(master.getName());
                            Double t = Double.parseDouble(rs.getString("CREDIT_AMOUNT")) + totalAmount;
                            totalCreditAmountMap.put(master.getName(), t);
                        }
                    } catch (Exception e) {

                    }
                } else {

                }
                return master;
            }
        });

        logger.info("Total custom : " + customerNames.size());
        for (CustomerAccountMaster master : customerNames) {
            try {
                String sql2 = "insert into CUSTOMER_ACCOUNT_MASTER (NAME, CONTACT_NAME, "
                        + "MOBILE, TOTAL_BILL_AMOUNT, TOTAL_CREDIT_ASOFNOW, IS_CREDIT_ACCOUNT"
                        + ") values(?,?,?,?,?,?)";
                this.jdbcTemplate.update(sql2, new Object[]{master.getName().toUpperCase(), master.getName().toUpperCase(), master.getMobile(),
                    totalAmountMap.get(master.getName()), totalCreditAmountMap.get(master.getName()), master.getIsCreditAccount()
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return "Update Completed";
    }

    public String updateCustomerMasterData(Integer maxrecord, String billNo, boolean paymentRec, Double paymentAmount, Double creditPending,
            String customerName, int customerId, String mobile, Double totalBillAmount) {

        if (!paymentRec) {
            String sql;
            logger.info("Need to update customer data... " + billNo);

            sql = "select CUSTOMER_NAME,CUSTOMER_ID,CUSTOMER_MOBILE_NUM,PAYMENT_TYPE,CREDIT_AMOUNT,ADDRESS,CREDIT_STATUS, TOTAL_AMOUNT_PAID "
                    + "from CUSTOMER_BILL_MASTER_2 where CUSTOMER_NAME !='' and BILL_SERIAL_NUMBER='" + billNo + "'";

            double totalAmount;
            Set<CustomerAccountMaster> customerNames = new TreeSet<>();
            TreeMap<Integer, Double> totalAmountMap = new TreeMap<>();
            TreeMap<Integer, Double> totalCreditAmountMap = new TreeMap<>();

            List<CustomerAccountMaster> list2 = this.jdbcTemplate.query(sql, new RowMapper() {
                public CustomerAccountMaster mapRow(ResultSet rs, int Rownum) throws SQLException {
                    CustomerAccountMaster master = new CustomerAccountMaster();
                    master.setName(rs.getString("CUSTOMER_NAME"));
                    master.setMobile(rs.getString("CUSTOMER_MOBILE_NUM"));
                    master.setId(rs.getInt("CUSTOMER_ID"));
                    try {
                        String type = rs.getString("PAYMENT_TYPE");
                        if (type != null && type.equalsIgnoreCase("CREDIT")) {
                            master.setIsCreditAccount("1");
                        } else {
                            master.setIsCreditAccount("0");
                        }
                    } catch (Exception e) {
                        master.setIsCreditAccount("0");
                    }
                    customerNames.add(master);
                    try {
                        if (!totalAmountMap.containsKey(master.getId())) {
                            totalAmountMap.put(master.getId(), Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")));
                        } else {
                            Double totalAmount = totalAmountMap.get(master.getId());
                            Double t = Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")) + totalAmount;
                            totalAmountMap.put(master.getId(), t);
                        }
                    } catch (Exception e) {

                    }
                    String status = rs.getString("CREDIT_STATUS");
                    if (status != null && status.equalsIgnoreCase("PAYMENT-PENDING")) {
                        try {
                            if (!totalCreditAmountMap.containsKey(master.getId())) {
                                try {
                                    totalCreditAmountMap.put(master.getId(), Double.parseDouble(rs.getString("CREDIT_AMOUNT")));
                                } catch (Exception e) {
                                    totalCreditAmountMap.put(master.getId(), 0D);
                                }
                            } else {
                                Double totalAmount = totalCreditAmountMap.get(master.getId());
                                Double t = Double.parseDouble(rs.getString("CREDIT_AMOUNT")) + totalAmount;
                                totalCreditAmountMap.put(master.getId(), t);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                    }
                    return master;
                }
            });

            logger.info("Total custom : " + customerNames.size());
            logger.info("totalCreditAmountMap custom : " + totalCreditAmountMap);
            logger.info("totalCreditAmountMap custom : " + totalAmountMap);
            logger.info("Total custom : " + customerNames.size());
            for (CustomerAccountMaster master : customerNames) {
                try {
                    String s1 = "select count(*) from CUSTOMER_ACCOUNT_MASTER where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                    if (master.getId() != 0) {
                        s1 = s1 + " AND ID=" + master.getId();
                    }

                    int c = this.jdbcTemplate.queryForObject(s1, Integer.class);

                    if (c == 1) {
                        if (totalCreditAmountMap.containsKey(master.getId())
                                && totalCreditAmountMap.get(master.getId()) != null) {
                            String sql2 = "update CUSTOMER_ACCOUNT_MASTER set "
                                    + "TOTAL_BILL_AMOUNT = TOTAL_BILL_AMOUNT + " + totalAmountMap.get(master.getId())
                                    + ", TOTAL_CREDIT_ASOFNOW = TOTAL_CREDIT_ASOFNOW + "
                                    + totalCreditAmountMap.get(master.getId()) + ", IS_CREDIT_ACCOUNT = '1"
                                    + "' where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                            if (master.getId() != 0) {
                                sql2 = sql2 + " AND ID=" + master.getId();
                            }

                            logger.info("Executing updae : " + sql2);

                            this.jdbcTemplate.update(sql2);
                        } else {
                            String sql2 = "update CUSTOMER_ACCOUNT_MASTER set "
                                    + "TOTAL_BILL_AMOUNT = TOTAL_BILL_AMOUNT + " + totalAmountMap.get(master.getId())
                                    + " where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                            if (master.getId() != 0) {
                                sql2 = sql2 + " AND ID=" + master.getId();
                            }

                            logger.info("Executing updae ********* : " + sql2);

                            this.jdbcTemplate.update(sql2);
                        }
                    } else {
                        String sql2 = "insert into CUSTOMER_ACCOUNT_MASTER (NAME, CONTACT_NAME, "
                                + "MOBILE, TOTAL_BILL_AMOUNT, TOTAL_CREDIT_ASOFNOW, IS_CREDIT_ACCOUNT"
                                + ") values(?,?,?,?,?,?)";

                        Double d = 0.0;
                        if (totalCreditAmountMap.containsKey(master.getId())) {
                            d = totalCreditAmountMap.get(master.getId());
                            if (d == null) {
                                d = 0.0;
                            }
                        }
                        this.jdbcTemplate.update(sql2, new Object[]{master.getName().toUpperCase(),
                            master.getName().toUpperCase(), master.getMobile(),
                            totalAmountMap.get(master.getId()),
                            d, master.getIsCreditAccount()
                        });
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } else {
            String sql;

            sql = "select CUSTOMER_NAME,CUSTOMER_ID,CUSTOMER_MOBILE_NUM,PAYMENT_TYPE,CREDIT_AMOUNT,ADDRESS,CREDIT_STATUS, TOTAL_AMOUNT_PAID "
                    + "from CUSTOMER_BILL_MASTER_2 where CUSTOMER_NAME = '" + customerName.toUpperCase() + "' ";

            if (customerId != 0) {
                sql = sql + " AND CUSTOMER_ID = " + customerId;
            }

            logger.info("Need to update customer data... " + sql);

            double totalAmount;
            Set<CustomerAccountMaster> customerNames = new TreeSet<>();
            TreeMap<Integer, Double> totalAmountMap = new TreeMap<>();
            TreeMap<Integer, Double> totalCreditAmountMap = new TreeMap<>();

            List<CustomerAccountMaster> list2 = this.jdbcTemplate.query(sql, new RowMapper() {
                public CustomerAccountMaster mapRow(ResultSet rs, int Rownum) throws SQLException {
                    CustomerAccountMaster master = new CustomerAccountMaster();
                    master.setName(rs.getString("CUSTOMER_NAME"));
                    master.setMobile(rs.getString("CUSTOMER_MOBILE_NUM"));
                    master.setId(rs.getInt("CUSTOMER_ID"));

                    logger.info("\n\n ID : " + master.getId());

                    try {
                        String type = rs.getString("PAYMENT_TYPE");
                        if (type != null && type.equalsIgnoreCase("CREDIT")) {
                            master.setIsCreditAccount("1");
                        } else {
                            master.setIsCreditAccount("0");
                        }
                    } catch (Exception e) {
                        master.setIsCreditAccount("0");
                    }
                    customerNames.add(master);
                    try {
                        if (!totalAmountMap.containsKey(master.getId())) {
                            totalAmountMap.put(master.getId(), Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")));
                        } else {
                            Double totalAmount = totalAmountMap.get(master.getId());
                            Double t = Double.parseDouble(rs.getString("TOTAL_AMOUNT_PAID")) + totalAmount;
                            totalAmountMap.put(master.getId(), t);
                        }
                    } catch (Exception e) {

                    }
                    String status = rs.getString("CREDIT_STATUS");
                    if (status != null && status.equalsIgnoreCase("PAYMENT-PENDING")) {
                        try {
                            if (!totalCreditAmountMap.containsKey(master.getId())) {
                                totalCreditAmountMap.put(master.getId(), Double.parseDouble(rs.getString("CREDIT_AMOUNT")));
                            } else {
                                Double totalAmount = totalCreditAmountMap.get(master.getId());
                                Double t = Double.parseDouble(rs.getString("CREDIT_AMOUNT")) + totalAmount;
                                totalCreditAmountMap.put(master.getId(), t);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                    }
                    return master;
                }
            });
            String totalCreditAsOfNow = null;
            for (CustomerAccountMaster master : customerNames) {
                try {
                    String s1 = "select count(*) from CUSTOMER_ACCOUNT_MASTER where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                    if (master.getId() != 0) {
                        s1 = s1 + " AND ID=" + master.getId();
                    }

                    logger.info("Exeuting sqlq ((( : " + s1);
                    int c = this.jdbcTemplate.queryForObject(s1, Integer.class);

                    if (c == 1) {
                        if (totalCreditAmountMap.containsKey(master.getId())
                                && totalCreditAmountMap.get(master.getId()) != null) {
                            String sql2 = "update CUSTOMER_ACCOUNT_MASTER set "
                                    + "TOTAL_BILL_AMOUNT = " + totalAmountMap.get(master.getId())
                                    + ", TOTAL_CREDIT_ASOFNOW = "
                                    + totalCreditAmountMap.get(master.getId()) + ", IS_CREDIT_ACCOUNT = '"
                                    + Integer.parseInt(master.getIsCreditAccount())
                                    + "' where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                            if (master.getId() != 0) {
                                sql2 = sql2 + " AND ID=" + master.getId();
                            }

                            logger.info("Executing updae ?????????????????? : " + sql2);
                            totalCreditAsOfNow = String.valueOf(totalCreditAmountMap.get(master.getId()));

                            this.jdbcTemplate.update(sql2);
                        } else {
                            String sql2 = "update CUSTOMER_ACCOUNT_MASTER set "
                                    + "TOTAL_BILL_AMOUNT = " + totalAmountMap.get(master.getId())
                                    + ", TOTAL_CREDIT_ASOFNOW = 0 where UCASE(NAME)='" + master.getName().toUpperCase() + "'";

                            if (master.getId() != 0) {
                                sql2 = sql2 + " AND ID=" + master.getId();
                            }

                            logger.info("Executing updae ************ : " + sql2);
                            totalCreditAsOfNow = "0";
                            this.jdbcTemplate.update(sql2);
                        }
                    } else {
                        String sql2 = "insert into CUSTOMER_ACCOUNT_MASTER (NAME, CONTACT_NAME, "
                                + "MOBILE, TOTAL_BILL_AMOUNT, TOTAL_CREDIT_ASOFNOW, IS_CREDIT_ACCOUNT"
                                + ") values(?,?,?,?,?,?)";

                        Double d = 0.0;
                        if (totalCreditAmountMap.containsKey(master.getId())) {
                            d = totalCreditAmountMap.get(master.getId());
                            if (d == null) {
                                d = 0.0;
                            }
                        }
                        totalCreditAsOfNow = String.valueOf(d);
                        this.jdbcTemplate.update(sql2, new Object[]{master.getName().toUpperCase(),
                            master.getName().toUpperCase(), master.getMobile(),
                            totalAmountMap.get(master.getId()),
                            d, master.getIsCreditAccount()
                        });
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            if (totalCreditAsOfNow != null) {
                return totalCreditAsOfNow;
            } else {
                return "";
            }
        }

        return "Update Completed";
    }

    public List<ProductSalesChart> getSalesDataForProduct(Integer maxrecord, String billNo, String startDate, String endDate, String productName, String batchNumber) {
        StringBuilder getQuantity = new StringBuilder();

        getQuantity.append("select count(*) as c, sum(QUANTITY_INT) as TOTALQUANTITY, sum(AMOUNT_INT) as TOTALSALEAMOUNT, "
                + "b.PRODUCT_NAME, b.BATCH_NO, b.EXPIRE_DATE, b.PACKING, b.MRP, b.DISTUBUTER_NAME, b.COMPANY "
                + "from BILL_MASTER a, PRODUCT_MASTER b where a.PRODUCT_ID=b.PRODUCT_ID ");

        boolean t = true;
        if (startDate != null && startDate.trim().length() > 0
                && endDate != null && endDate.trim().length() > 0) {
            //getQuantity.append(" where CREATED_AT >= '2019-04-26 00:00:00'").append(dateFilter).append("%' ");
            getQuantity.append(" where CREATED_AT >= '").append(startDate).append("' AND CREATED_AT <= '" + endDate + "' ");
            t = true;
        } else if (productName != null && productName.trim().length() > 0) {
            if (t) {
                getQuantity.append(" AND b.PRODUCT_NAME like '%").append(productName.trim()).append("%' ");
            } else {
                getQuantity.append(" where b.PRODUCT_NAME like '%").append(productName.trim()).append("%' ");
            }
            t = true;
        } else if (batchNumber != null && batchNumber.trim().length() > 0) {
            if (t) {
                getQuantity.append(" AND b.BATCH_NO like '%").append(batchNumber.trim()).append("%' ");
            } else {
                getQuantity.append(" where b.BATCH_NO like '%").append(batchNumber.trim()).append("%' ");
            }
            t = true;
        }

        getQuantity.append(" group by b.PRODUCT_NAME, b.BATCH_NO, b.EXPIRE_DATE, b.PACKING, b.MRP, b.DISTUBUTER_NAME, b.COMPANY "
                + "order by TOTALQUANTITY desc");

        try {
            logger.info("Executing query : " + getQuantity.toString());
            List<ProductSalesChart> quantityList = this.jdbcTemplate.query(getQuantity.toString(), new RowMapper() {
                public ProductSalesChart mapRow(ResultSet rs, int Rownum) throws SQLException {
                    ProductSalesChart master = new ProductSalesChart();
                    master.setName(rs.getString("PRODUCT_NAME"));
                    master.setY(rs.getDouble("c"));
                    master.setBatchNo(rs.getString("BATCH_NO"));
                    master.setCompany(rs.getString("COMPANY"));
                    master.setDistubuterName(rs.getString("DISTUBUTER_NAME"));
                    master.setExpireDate(rs.getString("EXPIRE_DATE"));
                    String mrp = rs.getString("MRP");
                    if (mrp.contains(",")) {
                        mrp = mrp.replaceAll(",", "");
                    }
                    master.setMrp(mrp);
                    master.setPacking(rs.getString("PACKING"));
                    master.setTotalAmount(rs.getDouble("TOTALSALEAMOUNT"));
                    master.setTotalQuantity(rs.getDouble("TOTALQUANTITY"));
                    return master;
                }
            });

            return quantityList;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static Date subtractDays(Date date, int days) {
        GregorianCalendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.add(Calendar.DATE, -days);

        return cal.getTime();
    }

    public List<SalesChart> getSalesDataForChart(Integer maxrecord, String billNo, String dateFilter, String batchNo) {
        StringBuilder getQuantity = new StringBuilder();

        if (dateFilter != null && dateFilter.trim().length() > 0) {
            getQuantity.append("select sum(GRAND_TOTAL) as sa, BILLING_DATE as GRAPH_DATE from CUSTOMER_BILL_MASTER_2 ");
            getQuantity.append(" where BILLING_DATE LIKE '%").append(dateFilter).append("%' ");
            getQuantity.append(" group by BILLING_DATE order by BILLING_DATE desc");
        } else if (batchNo != null && batchNo.trim().length() > 0) {
            getQuantity.append("select sum(b.AMOUNT_INT) as sa, GRAPH_DATE from CUSTOMER_BILL_MASTER_2 a, BILL_MASTER b "
                    + "where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER and b.PRODUCT_BATCH = '").append(batchNo.trim()).append("' group by GRAPH_DATE order by GRAPH_DATE desc");
        } else {
            String startDate = new SimpleDateFormat("MM/yyyy").format(new Date());
            getQuantity.append("select sum(GRAND_TOTAL) as sa, GRAPH_DATE from CUSTOMER_BILL_MASTER_2 ");
            getQuantity.append(" where BILLING_DATE LIKE '%").append(startDate).append("%' ");
            getQuantity.append(" group by GRAPH_DATE order by GRAPH_DATE desc");
        }

        try {
            logger.info("Executing query : " + getQuantity.toString());
            List<SalesChart> quantityList = this.jdbcTemplate.query(getQuantity.toString(), new RowMapper() {
                public SalesChart mapRow(ResultSet rs, int Rownum) throws SQLException {
                    SalesChart master = new SalesChart();
                    master.setBillDate(rs.getString("GRAPH_DATE"));
                    master.setSa(rs.getInt("sa"));
                    return master;
                }
            });

            return quantityList;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<SaleChartMaster> getSalesDataPerDay(Integer maxrecord, String billNo) {
        String getQuantity = "select STR_TO_DATE(BILLING_DATE,'%d/%m/%Y') as BILLDATE, SUM(QUANTITY_PURCHASED) sq,SUM(AMOUNT) sa from CUSTOMER_BILL_MASTER_2 a, BILL_MASTER b where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER group by BILLDATE order by BILLDATE DESC";

        try {

            List<SaleChartMaster> quantityList = this.jdbcTemplate.query(getQuantity, new RowMapper() {
                public SaleChartMaster mapRow(ResultSet rs, int Rownum) throws SQLException {
                    SaleChartMaster master = new SaleChartMaster();
                    master.setBillDate(rs.getString("BILLDATE"));

                    master.setSq(rs.getInt("sq"));
                    master.setSa(rs.getInt("sa"));
                    return master;
                }
            });

            return quantityList;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<ApplicationConfiguration> getBackupConfigurations() {
        String getQuantity = "select BACKUP_ZIP_LOCATION, BACKUP_DB_LIB_SRC_LOCATION, EXPORT_FILE_LOCATION,CREATED_AT from APP_CONFIGURATION";

        try {
            List<ApplicationConfiguration> list = this.jdbcTemplate.query(getQuantity, new RowMapper() {
                public ApplicationConfiguration mapRow(ResultSet rs, int Rownum) throws SQLException {
                    ApplicationConfiguration master = new ApplicationConfiguration();
                    master.setBackupDbSrcLibLocation(rs.getString("BACKUP_DB_LIB_SRC_LOCATION"));
                    master.setBackupZipLocation(rs.getString("BACKUP_ZIP_LOCATION"));
                    master.setExportFileLocation(rs.getString("EXPORT_FILE_LOCATION"));
                    master.setCreatedAt(rs.getString("CREATED_AT"));
                    return master;
                }
            });
            return list;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String updateProductTaxes(String productId, String cgst, String sgst) {

        logger.info("Executing query : UPDATE PRODUCT_MASTER SET CGST=?, SGST=? where PRODUCT_ID=? " + productId + ", cgst : " + cgst);

        int i = this.jdbcTemplate.update("UPDATE PRODUCT_MASTER SET CGST=?, SGST=? where PRODUCT_ID=?", new Object[]{cgst, sgst, productId});

        logger.info("Executing query : UPDATE PRODUCT_MASTER SET CGST=?, SGST=? where PRODUCT_ID=?  :::::::::: " + i);

        return "true";
    }

    public String updateProductQuantity2(String productId, String quantity) {

        String getQuantity = "SELECT QUANTITY_IN_SHOP,PACKING,FREE FROM PRODUCT_MASTER WHERE PRODUCT_ID=" + productId;

        String SQL = "UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP = ? WHERE PRODUCT_ID=" + productId;

        String SQL_FREE_UPDATE = "UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP=?, FREE = ? WHERE PRODUCT_ID=" + productId;

        logger.info("updateProductQuantity executing sql : " + SQL);
        try {

            logger.info("updateProductQuantity executing sql : " + getQuantity);
            List<ProductMaster> quantityList = this.jdbcTemplate.query(getQuantity, new RowMapper() {
                public Object mapRow(ResultSet rs, int Rownum) throws SQLException {
                    ProductMaster product = new ProductMaster();
                    logger.info("Quantity ORG : " + rs.getString("QUANTITY_IN_SHOP"));
                    String quantityOrg = Util.trimNumberCustom(rs.getString("QUANTITY_IN_SHOP"));
                    String orgStringPacking = rs.getString("PACKING");

                    String packing = Util.trimNumberCustom(orgStringPacking);

                    String unitStr = Util.getUnit(orgStringPacking);

                    String free = Util.trimNumberCustom(rs.getString("FREE"));
                    product.setPacking(packing);
                    product.setQuantityInShop(quantityOrg);
                    product.setFree(free);
                    product.setUnitStr(unitStr);
                    if (packing != null && packing.trim().length() > 0) {
                        double q = Double.parseDouble(quantityOrg);
                        double total = q;
                        product.setQuantityInShop(String.valueOf(total));
                    } else {
                        product.setQuantityInShop(quantityOrg);
                    }
                    return product;
                }
            });

            for (ProductMaster q : quantityList) {
                double orgquan = Double.parseDouble(q.getQuantityInShop());
                double free = 0;
                if (q.getFree() != null && q.getFree().length() > 0) {
                    free = Double.parseDouble(q.getFree());
                }
                double quan = orgquan;
                double stock = quan + free;
                double backupStock = stock;
                logger.info("Total Stock : " + stock);

                String unitStr = q.getUnitStr();
                boolean isValidTabOrCaps = false;
                logger.info("unitStr = unitStr.trim() : " + unitStr);
                if (unitStr != null && unitStr.length() > 0) {
                    unitStr = unitStr.trim().toUpperCase();
                    if (unitStr.equalsIgnoreCase("TAB")
                            || unitStr.equalsIgnoreCase("TA")
                            || unitStr.equalsIgnoreCase("T")
                            || unitStr.equalsIgnoreCase("CAP")
                            || unitStr.equalsIgnoreCase("CAPSURLE")
                            || unitStr.equalsIgnoreCase("CAPS")
                            || unitStr.equalsIgnoreCase("CAPSU")
                            || unitStr.equalsIgnoreCase("CAPSULE")
                            || unitStr.equalsIgnoreCase("CA")
                            || unitStr.equalsIgnoreCase("CPSULE")
                            || unitStr.equalsIgnoreCase("PCI")
                            || unitStr.equalsIgnoreCase("PIC")
                            || unitStr.equalsIgnoreCase("PC")) {

                        isValidTabOrCaps = true;
                        logger.info(" isValidTabOrCaps : " + isValidTabOrCaps);
                    }
                }
                boolean validQuantity = false;
                boolean freeQuery = false;
                double freeCount = 0;
                double requestedQuantity = Double.parseDouble(quantity.trim());
                double remainingQuantity = 0;
                //if (stock > 0 && stock >= requestedQuantity) {
                logger.info("q.getPacking() : " + q.getPacking());
                if (q.getPacking() == null || !isValidTabOrCaps) {
                    stock = stock + Double.parseDouble(quantity.trim());
                    logger.info("stock 1 : " + stock);
                } else if (q.getPacking() != null && isValidTabOrCaps) {
                    double d1 = Double.parseDouble(q.getPacking());
                    stock = ((stock * d1) + (Double.parseDouble(quantity.trim())));
                    requestedQuantity = requestedQuantity / d1;
                    logger.info("stock 2 : " + stock);
                } else {
                    stock = stock + Double.parseDouble(quantity.trim());
                    logger.info("stock 3 : " + stock);
                }

                if (stock < 0) {
                    throw new Exception("Bill can not be generated, As quantity in shop is less than ordered!!!");
                } else {

                    freeQuery = false;
                    logger.info("! requestedQuantity > orgquan : ");
                    remainingQuantity = orgquan + requestedQuantity;

                }

                logger.info("After salte, stock now Quantity : " + remainingQuantity + ", Free : " + freeCount);
                logger.info("Returned Quantity was : " + requestedQuantity);
                //} else {
                //   throw new Exception("Bill can not be generated, As quantity in shop is less than ordered!!!");
                //}

                if (!freeQuery) {
                    logger.info("updateProductQuantity executing sql : " + SQL);
                    int i = this.jdbcTemplate.update(SQL, new Object[]{remainingQuantity});
                } else {
                    logger.info("updateProductQuantity executing sql : " + SQL_FREE_UPDATE);
                    int i = this.jdbcTemplate.update(SQL_FREE_UPDATE, new Object[]{remainingQuantity, freeCount});
                }
            }

            logger.info("updateProductDetail product detail updated ...success");
            return "true";

        } catch (Exception e) {
            e.printStackTrace();
            return "false : " + e.toString();
        }

    }

    public String updateProductQuantity(String productId, String quantity) {

        String getQuantity = "SELECT QUANTITY_IN_SHOP,PACKING,FREE FROM PRODUCT_MASTER WHERE PRODUCT_ID=" + productId;

        String SQL = "UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP = ? WHERE PRODUCT_ID=" + productId;

        String SQL_FREE_UPDATE = "UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP=?, FREE = ? WHERE PRODUCT_ID=" + productId;

        logger.info("updateProductQuantity executing sql : " + SQL);
        try {

            logger.info("updateProductQuantity executing sql : " + getQuantity);
            List<ProductMaster> quantityList = this.jdbcTemplate.query(getQuantity, new RowMapper() {
                public Object mapRow(ResultSet rs, int Rownum) throws SQLException {
                    ProductMaster product = new ProductMaster();
                    logger.info("Quantity ORG : " + rs.getString("QUANTITY_IN_SHOP"));
                    String quantityOrg = Util.trimNumberCustom(rs.getString("QUANTITY_IN_SHOP"));
                    String orgStringPacking = rs.getString("PACKING");

                    String packing = Util.trimNumberCustom(orgStringPacking);

                    String unitStr = Util.getUnit(orgStringPacking);

                    String free = Util.trimNumberCustom(rs.getString("FREE"));
                    product.setPacking(packing);
                    product.setQuantityInShop(quantityOrg);
                    product.setFree(free);
                    product.setUnitStr(unitStr);
                    if (packing != null && packing.trim().length() > 0) {
                        double q = Double.parseDouble(quantityOrg);
                        double total = q;
                        product.setQuantityInShop(String.valueOf(total));
                    } else {
                        product.setQuantityInShop(quantityOrg);
                    }
                    return product;
                }
            });

            for (ProductMaster q : quantityList) {
                double orgquan = Double.parseDouble(q.getQuantityInShop());
                double free = 0;
                try {
                    if (q.getFree() != null && q.getFree().length() > 0) {
                        free = Double.parseDouble(q.getFree());
                    }
                } catch (Exception e) {
                    free = 0;
                }
                double quan = orgquan;
                double stock = quan + free;
                double backupStock = stock;
                logger.info("Total Stock : " + stock);

                String unitStr = q.getUnitStr();
                boolean isValidTabOrCaps = false;
                logger.info("unitStr = unitStr.trim() : " + unitStr);
                if (unitStr != null && unitStr.length() > 0) {
                    unitStr = unitStr.trim().toUpperCase();
                    if (unitStr.equalsIgnoreCase("TAB")
                            || unitStr.equalsIgnoreCase("TA")
                            || unitStr.equalsIgnoreCase("T")
                            || unitStr.equalsIgnoreCase("CAP")
                            || unitStr.equalsIgnoreCase("CAPSURLE")
                            || unitStr.equalsIgnoreCase("CAPS")
                            || unitStr.equalsIgnoreCase("CAPSU")
                            || unitStr.equalsIgnoreCase("CAPSULE")
                            || unitStr.equalsIgnoreCase("CA")
                            || unitStr.equalsIgnoreCase("CPSULE")
                            || unitStr.equalsIgnoreCase("PCI")
                            || unitStr.equalsIgnoreCase("PIC")
                            || unitStr.equalsIgnoreCase("PC")) {
                        isValidTabOrCaps = true;
                        logger.info(" isValidTabOrCaps : " + isValidTabOrCaps);
                    }
                }
                boolean validQuantity = false;
                boolean freeQuery = false;
                double freeCount = 0;
                double requestedQuantity = Double.parseDouble(quantity.trim());
                double remainingQuantity = 0;
                //if (stock > 0 && stock >= requestedQuantity) {
                logger.info("q.getPacking() : " + q.getPacking());
                logger.info("quantity : " + quantity.trim());
                if (q.getPacking() == null || !isValidTabOrCaps) {
                    stock = stock - Double.parseDouble(quantity.trim());
                    logger.info("stock 1 : " + stock);
                } else if (q.getPacking() != null && isValidTabOrCaps) {
                    double d1 = Double.parseDouble(q.getPacking());
                    double d2 = stock * d1;
                    double d3 = Double.parseDouble(quantity.trim());
                    logger.info("stock 21 : " + Math.ceil(d2));
                    logger.info("stock 22 : " + Math.ceil(d3));
                    stock = Math.ceil(d2) - Math.ceil(d3);
                    requestedQuantity = requestedQuantity / d1;

                    logger.info("stock 2 : " + stock);
                } else {
                    stock = stock - Double.parseDouble(quantity.trim());
                    logger.info("stock 3 : " + stock);
                }

                if (stock <= 0) {
                    //throw new Exception("Bill can not be generated, As quantity in shop is less than ordered!!!");
                    remainingQuantity = 0;
                    logger.info("requestedQuantity > orgquan : ");
                    freeQuery = true;
                    freeCount = 0;
                    remainingQuantity = 0;

                } else {
                    if (orgquan <= 0) {
                        logger.info("requestedQuantity > orgquan : ");
                        freeQuery = true;
                        freeCount = free - requestedQuantity;
                        remainingQuantity = 0;
                    }
                    if (requestedQuantity >= orgquan) {
                        logger.info("requestedQuantity > orgquan : ");
                        freeQuery = true;
                        freeCount = free - (requestedQuantity - orgquan);
                        remainingQuantity = 0;
                    } else {
                        freeQuery = false;
                        logger.info("! requestedQuantity > orgquan : ");
                        remainingQuantity = orgquan - requestedQuantity;
                    }
                }

                logger.info("After salte, stock now Quantity : " + remainingQuantity + ", Free : " + freeCount);
                logger.info("Requested Quantity was : " + requestedQuantity);
                //} else {
                //   throw new Exception("Bill can not be generated, As quantity in shop is less than ordered!!!");
                //}

                if (!freeQuery) {
                    logger.info("updateProductQuantity executing sql : " + SQL);
                    int i = this.jdbcTemplate.update(SQL, new Object[]{remainingQuantity});
                } else {
                    logger.info("updateProductQuantity executing sql : " + SQL_FREE_UPDATE);
                    int i = this.jdbcTemplate.update(SQL_FREE_UPDATE, new Object[]{remainingQuantity, freeCount});
                }
            }

            logger.info("updateProductDetail product detail updated ...success");
            return "true";

        } catch (Exception e) {
            e.printStackTrace();
            return "false : " + e.toString();
        }

    }

    public String updateProductQuantityPO(String productId, String quantity) {

        String getQuantity = "SELECT QUANTITY_IN_SHOP,PACKING,FREE FROM PRODUCT_MASTER WHERE PRODUCT_ID=" + productId;

        String SQL = "UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP = ? WHERE PRODUCT_ID=" + productId;

        logger.info("updateProductQuantity executing sql : " + SQL);
        try {

            logger.info("updateProductQuantity executing sql : " + getQuantity);
            List<ProductMaster> quantityList = this.jdbcTemplate.query(getQuantity, new RowMapper() {
                public Object mapRow(ResultSet rs, int Rownum) throws SQLException {
                    ProductMaster product = new ProductMaster();

                    String quantityOrg = Util.trimNumberCustom(rs.getString("QUANTITY_IN_SHOP"));
                    String packing = Util.trimNumberCustom(rs.getString("PACKING"));
                    product.setPacking(packing);
                    product.setQuantityInShop(quantityOrg);
                    if (packing != null && packing.trim().length() > 0) {
                        double q = Double.parseDouble(quantityOrg);
                        double pack = Double.parseDouble(packing);
                        double total = q * pack;
                        product.setQuantityInShop(String.valueOf(total));

                    } else {
                        product.setQuantityInShop(quantityOrg);
                    }
                    return product;
                }
            });

            for (ProductMaster q : quantityList) {
                double quan = Double.parseDouble(q.getQuantityInShop());
                if (q.getPacking() == null || ((Integer.parseInt(q.getPacking().trim())) <= 1)) {
                    quan = quan + Double.parseDouble(quantity.trim());
                } else {
                    quan = (quan + Double.parseDouble(quantity.trim()));
                }
                logger.info("Quantity now : " + quan);
                logger.info("Ordered Quantity : " + quantity);
                if (quan < 0) {
                    throw new Exception("Bill can not be generated, As quantity in shop is less than ordered!!!");
                }

                logger.info("updateProductQuantity executing sql : " + SQL);
                int i = this.jdbcTemplate.update(SQL, new Object[]{quan});
            }

            logger.info("updateProductDetail product detail updated ...success");
            return "true";

        } catch (Exception e) {
            e.printStackTrace();
            return "false : " + e.toString();
        }

    }

    public List<ProductMaster> getProductDetail(String productId, String expireDate, String productName, String company,
            String formula, String batchNo, String sch, String quantity, String sortColumn, String sortFilter, String entryDate, boolean considerDeletedProd) {

        StringBuffer sbSQL = new StringBuffer("SELECT PRODUCT_ID, PRODUCT_NAME, COMPANY, FORMULA, "
                + "BATCH_NO, MANUFACTURE_DATE, EXPIRE_DATE, QUANTITY_IN_SHOP, "
                + "AMOUNT_PER_UNIT, CREATED_AT, UPDATED_AT, PACKING, FREE, MRP, CGST, SGST, IGST, DISCOUNT, "
                + "DISTUBUTER_NAME, DRUG_SCHEDULE, DISTIBUTER_NUMBER, DATE, PURCHASE_RATE, MARGIN FROM PRODUCT_MASTER WHERE ");

        boolean whereExecuted = false;

        if (considerDeletedProd) {
            sbSQL.append("  IS_DELETED=0 ");
            whereExecuted = true;
        }

        if ((productId != null && productId.trim().length() > 0)
                || (expireDate != null && expireDate.trim().length() > 0)
                || (productName != null && productName.trim().length() > 0)
                || (company != null && company.trim().length() > 0)
                || (formula != null && formula.trim().length() > 0)
                || (batchNo != null && batchNo.trim().length() > 0)
                || (sch != null && sch.trim().length() > 0)
                || (quantity != null && quantity.trim().length() > 0)) {
            sbSQL.append(" ");
        }

        if (productId != null && productId.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }

            sbSQL.append(" PRODUCT_ID = ").append(productId).append(" ");
            whereExecuted = true;
        }

        if (expireDate != null && expireDate.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("EXPIRE_DATE LIKE '%").append(expireDate).append("%' ");
            whereExecuted = true;
        }

        if (productName != null && productName.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(PRODUCT_NAME) LIKE '%").append(productName.toUpperCase().trim()).append("%' ");
            whereExecuted = true;
        }
        if (company != null && company.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(COMPANY) LIKE '%").append(company.toUpperCase().trim()).append("%' ");
            whereExecuted = true;
        }
        if (formula != null && formula.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(FORMULA) LIKE '%").append(formula.toUpperCase().trim()).append("%' ");
            whereExecuted = true;
        }
        if (batchNo != null && batchNo.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(BATCH_NO) LIKE '%").append(batchNo.toUpperCase().trim()).append("%' ");
            whereExecuted = true;
        }

        if (entryDate != null && entryDate.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append(" DATE='").append(entryDate.toUpperCase().trim()).append("' ");
            whereExecuted = true;
        }

        if (quantity != null && quantity.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append(" QUANTITY_IN_SHOP <= ").append(quantity).append("");
            whereExecuted = true;
        }

        if (sch != null && sch.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(DRUG_SCHEDULE) LIKE '%").append(sch.toUpperCase().trim()).append("%' ");
            whereExecuted = true;
        }

        //
        if (sortColumn != null && sortColumn.trim().length() > 0) {
            if (sortFilter != null) {
                sbSQL.append(" ORDER BY ").append(sortColumn).append(" ").append(sortFilter);
            } else {
                sbSQL.append(" ORDER BY ").append(sortColumn);
            }
        } else {
            sbSQL.append(" ORDER BY CREATED_AT ASC ");
        }

        logger.info("getProductDetail executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<ProductMaster> productList = new ArrayList<ProductMaster>();
            int maxLimit = 100;
            int i = 0;
            while (rs.next()) {

                ProductMaster product = new ProductMaster();
                product.setAmountPerUnit(rs.getString("AMOUNT_PER_UNIT"));
                product.setBatchNo(rs.getString("BATCH_NO"));
                product.setFormula(rs.getString("FORMULA"));
                product.setProductId(rs.getInt("PRODUCT_ID"));
                product.setProductName(rs.getString("PRODUCT_NAME"));
                product.setCompany(rs.getString("COMPANY"));
                product.setManufactureDate(rs.getString("MANUFACTURE_DATE"));
                product.setExpireDate(rs.getString("EXPIRE_DATE"));
                product.setQuantityInShop(rs.getString("QUANTITY_IN_SHOP"));
                product.setCreatedAt(rs.getString("CREATED_AT"));
                product.setUpdatedAt(rs.getString("UPDATED_AT"));
                product.setPacking(rs.getString("PACKING"));
                product.setFree(rs.getString("FREE"));
                String mrp = rs.getString("MRP");
                if (mrp.contains(",")) {
                    mrp = mrp.replaceAll(",", "");

                }
                product.setMrp(mrp);
                // product.setMrp(rs.getString("MRP"));
                product.setCgst(rs.getString("CGST"));
                product.setSgst(rs.getString("SGST"));
                product.setIgst(rs.getString("IGST"));
                product.setDiscount(rs.getString("DISCOUNT"));
                product.setDistributerName(rs.getString("DISTUBUTER_NAME"));
                product.setDistributerNumber(rs.getString("DISTIBUTER_NUMBER"));
                product.setDate(rs.getString("DATE"));
                product.setPurchaseRate(rs.getString("PURCHASE_RATE"));
                product.setMargin(rs.getString("MARGIN"));
                product.setDrugSchedule(rs.getString("DRUG_SCHEDULE"));

                try {
                    if ((product.getAmountPerUnit() != null && product.getAmountPerUnit().trim().length() > 0)
                            && (product.getQuantityInShop() != null && product.getQuantityInShop().trim().length() > 0)) {
                        Double value = Double.parseDouble(product.getAmountPerUnit().trim().replaceAll(",", ""));
                        Double quan = Double.parseDouble(product.getQuantityInShop().trim().replaceAll(",", ""));
                        String result = String.format("%.2f", value * quan);
                        product.setTotal(result);
                    }
                } catch (Exception e) {

                    try {
                        if ((product.getAmountPerUnit() != null && product.getAmountPerUnit().trim().length() > 0)
                                && (product.getQuantityInShop() != null && product.getQuantityInShop().trim().length() > 0)) {
                            Double value = Double.parseDouble(product.getAmountPerUnit().trim().replaceAll(",", "").replace("..", "."));
                            Double quan = Double.parseDouble(product.getQuantityInShop().trim().replaceAll(",", ""));
                            String result = String.format("%.2f", value * quan);
                            product.setTotal(result);
                        }
                    } catch (Exception e2) {
                        logger.info("Error in amount and quantity convertion :....... " + product.getAmountPerUnit() + " , Q " + product.getQuantityInShop());
                        e2.printStackTrace();
                    }

                    logger.info("Error in amount and quantity convertion :....... " + product.getAmountPerUnit() + " , Q " + product.getQuantityInShop());
                    e.printStackTrace();
                }

                try {
                    if (product.getCgst() != null && (product.getCgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getCgst());
                        product.setCgst(product.getCgst().substring(0, product.getCgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                try {
                    if (product.getSgst() != null && (product.getSgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getSgst());
                        product.setSgst(product.getSgst().substring(0, product.getSgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                try {
                    if (product.getIgst() != null && (product.getIgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getIgst());
                        product.setIgst(product.getIgst().substring(0, product.getIgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                productList.add(product);
                i++;
                if (i > maxLimit) {
                    break;
                }
            }

            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {

                }

                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {

                }

                try {
                    if (rs != null) {
                        rs.close();

                    }
                } catch (Exception e) {

                }
            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;

    }

    public List<ProductMaster> getProductDetailCurentStock(String productId, int pN, int pS) {

        StringBuffer sbSQL = new StringBuffer("SELECT PRODUCT_ID, PRODUCT_NAME, COMPANY, FORMULA, "
                + "BATCH_NO, MANUFACTURE_DATE, EXPIRE_DATE, QUANTITY_IN_SHOP, "
                + "AMOUNT_PER_UNIT, CREATED_AT, UPDATED_AT, PACKING, FREE, MRP, CGST, SGST, IGST, DISCOUNT, "
                + "DISTUBUTER_NAME, DRUG_SCHEDULE, DISTIBUTER_NUMBER, DATE, PURCHASE_RATE, MARGIN FROM PRODUCT_MASTER WHERE IS_DELETED=0 ");

        sbSQL.append(" ORDER BY CREATED_AT ASC OFFSET " + (pN * pS) + " ROWS FETCH NEXT ").append(pS).append(" ROWS ONLY");

        logger.info("getProductDetailCurentStock executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<ProductMaster> productList = new ArrayList<ProductMaster>();
            int maxLimit = 100;
            int i = 0;
            while (rs.next()) {

                ProductMaster product = new ProductMaster();
                product.setAmountPerUnit(rs.getString("AMOUNT_PER_UNIT"));
                product.setBatchNo(rs.getString("BATCH_NO"));
                product.setFormula(rs.getString("FORMULA"));
                product.setProductId(rs.getInt("PRODUCT_ID"));
                product.setProductName(rs.getString("PRODUCT_NAME"));
                product.setCompany(rs.getString("COMPANY"));
                product.setManufactureDate(rs.getString("MANUFACTURE_DATE"));
                product.setExpireDate(rs.getString("EXPIRE_DATE"));
                product.setQuantityInShop(rs.getString("QUANTITY_IN_SHOP"));
                product.setCreatedAt(rs.getString("CREATED_AT"));
                product.setUpdatedAt(rs.getString("UPDATED_AT"));
                product.setPacking(rs.getString("PACKING"));
                product.setFree(rs.getString("FREE"));
                String mrp = rs.getString("MRP");
                if (mrp.contains(",")) {
                    mrp = mrp.replaceAll(",", "");

                }
                product.setMrp(mrp);
                // product.setMrp(rs.getString("MRP"));
                product.setCgst(rs.getString("CGST"));
                product.setSgst(rs.getString("SGST"));
                product.setIgst(rs.getString("IGST"));
                product.setDiscount(rs.getString("DISCOUNT"));
                product.setDistributerName(rs.getString("DISTUBUTER_NAME"));
                product.setDistributerNumber(rs.getString("DISTIBUTER_NUMBER"));
                product.setDate(rs.getString("DATE"));
                product.setPurchaseRate(rs.getString("PURCHASE_RATE"));
                product.setMargin(rs.getString("MARGIN"));
                product.setDrugSchedule(rs.getString("DRUG_SCHEDULE"));

                try {
                    if ((product.getAmountPerUnit() != null && product.getAmountPerUnit().trim().length() > 0)
                            && (product.getQuantityInShop() != null && product.getQuantityInShop().trim().length() > 0)) {
                        Double value = Double.parseDouble(product.getAmountPerUnit().trim().replaceAll(",", ""));
                        Double quan = Double.parseDouble(product.getQuantityInShop().trim().replaceAll(",", ""));
                        String result = String.format("%.2f", value * quan);
                        product.setTotal(result);
                    }
                } catch (Exception e) {

                    try {
                        if ((product.getAmountPerUnit() != null && product.getAmountPerUnit().trim().length() > 0)
                                && (product.getQuantityInShop() != null && product.getQuantityInShop().trim().length() > 0)) {
                            Double value = Double.parseDouble(product.getAmountPerUnit().trim().replaceAll(",", "").replace("..", "."));
                            Double quan = Double.parseDouble(product.getQuantityInShop().trim().replaceAll(",", ""));
                            String result = String.format("%.2f", value * quan);
                            product.setTotal(result);
                        }
                    } catch (Exception e2) {
                        logger.info("Error in amount and quantity convertion :....... " + product.getAmountPerUnit() + " , Q " + product.getQuantityInShop());
                        e2.printStackTrace();
                    }

                    logger.info("Error in amount and quantity convertion :....... " + product.getAmountPerUnit() + " , Q " + product.getQuantityInShop());
                    e.printStackTrace();
                }

                try {
                    if (product.getCgst() != null && (product.getCgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getCgst());
                        product.setCgst(product.getCgst().substring(0, product.getCgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                try {
                    if (product.getSgst() != null && (product.getSgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getSgst());
                        product.setSgst(product.getSgst().substring(0, product.getSgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                try {
                    if (product.getIgst() != null && (product.getIgst().indexOf('%') >= 0)) {
                        logger.info("Error in VAT convertion :....... " + product.getIgst());
                        product.setIgst(product.getIgst().substring(0, product.getIgst().indexOf('%')));
                    }
                } catch (Exception e) {
                    //e.printStackTrace();
                }

                productList.add(product);
                i++;
                if (i > maxLimit) {
                    break;
                }
            }

            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {

                }

                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {

                }

                try {
                    if (rs != null) {
                        rs.close();

                    }
                } catch (Exception e) {

                }
            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;

    }

    public int updateCustomerBillingDetail(Integer maxrecord,
            String custName, String custMobile, boolean po, String dateFilter,
            String paymentType, String paymentAmount, String chqNo, String cardNo, String ddNo,
            String creditAmount, String creditStatus, String billNo, String doctorName, String prescriptionDate) {

        if (billNo == null || billNo.trim().length() == 0) {
            return 0;
        }

        String sql = "select CREDIT_AMOUNT from CUSTOMER_BILL_MASTER_2 where BILL_SERIAL_NUMBER='" + billNo + "'";
        double amt = 0;

        if (paymentAmount != null && paymentAmount.trim().length() > 0) {
            try {
                try {
                    String amount = this.jdbcTemplate.queryForObject(sql, String.class
                    );
                    if (amount != null && amount.trim().length() > 0) {
                        amt = Double.parseDouble(amount.trim());
                    }
                } catch (Exception e) {
                    amt = 0;
                }

                if (amt < Double.parseDouble(creditAmount.trim()) && Double.parseDouble(creditAmount.trim()) > 0) {
                    amt = Double.parseDouble(creditAmount.trim());
                } else if (amt != 0) {
                    amt = amt - Double.parseDouble(paymentAmount.trim());
                } else if (amt == 0 && Double.parseDouble(creditAmount.trim()) > 0) {
                    amt = Double.parseDouble(creditAmount.trim());
                }
            } catch (Exception e) {
                amt = 0;
            }
        }

        sql = "select CUSTOMER_ID from CUSTOMER_BILL_MASTER_2 where BILL_SERIAL_NUMBER='" + billNo + "'";

        int customerId = 0;

        try {
            customerId = this.jdbcTemplate.queryForObject(sql, Integer.class);
        } catch (Exception e) {
            customerId = 0;
        }

        if (customerId == 0) {
            if (custName == null) {
                custName = "";
            }

            if (custMobile == null) {
                custMobile = "";
            }

            customerId = Integer.parseInt(quickAddCustomerName(custName.toUpperCase(), custMobile.toUpperCase()));
        }

        StringBuffer sbSQL = new StringBuffer("update CUSTOMER_BILL_MASTER_2 set CUSTOMER_NAME='" + custName.toUpperCase() + "', "
                + "CUSTOMER_MOBILE_NUM='" + custMobile + "' "
                + ", PAYMENT_TYPE='" + paymentType + "', CREDIT_STATUS='" + creditStatus + "', CREDIT_AMOUNT='" + amt + "', CUSTOMER_ID=" + customerId + ", PRESCRIBER_NAME='" + doctorName + "', PRESCRIPTION_DATE='" + prescriptionDate + "' where BILL_SERIAL_NUMBER='" + billNo + "'");

        logger.info("updateCustomerBillingDetail executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            int re = st.executeUpdate(sbSQL.toString());

            try {
                if (paymentAmount != null && paymentAmount.trim().length() > 0) {
                    String sql2 = "select TOTAL_AMOUNT_PAID from CUSTOMER_BILL_MASTER_2 where BILL_SERIAL_NUMBER='" + billNo + "'";
                    String amount1 = this.jdbcTemplate.queryForObject(sql2, String.class
                    );
                    String totalCreditAsOfNow = updateCustomerMasterData(1, billNo, true, Double.parseDouble(paymentAmount.trim()),
                            amt, custName, customerId, custMobile, Double.parseDouble(amount1));

                    quickAddCustomerPaymentString(custName, String.valueOf(customerId), String.valueOf(customerId), paymentType,
                            chqNo, cardNo, ddNo, "", "", paymentAmount, totalCreditAsOfNow, billNo);

                } else {
                    String sql2 = "select TOTAL_AMOUNT_PAID from CUSTOMER_BILL_MASTER_2 where BILL_SERIAL_NUMBER='" + billNo + "'";
                    String amount1 = this.jdbcTemplate.queryForObject(sql2, String.class
                    );
                    updateCustomerMasterData(1, billNo, true, 0.0,
                            amt, custName, customerId, custMobile, Double.parseDouble(amount1));
                }
            } catch (Exception e) {

            }

            return re;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");

                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                }
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                }
                try {
                    if (con != null) {
                        con.close();

                    }
                } catch (Exception e) {
                }

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return 0;
    }

    public boolean updateCreditAccountForCustomer(String name, String id, String creditAmout, String status) {
        try {
            String sql = "update CUSTOMER_ACCOUNT_MASTER set TOTAL_CREDIT_ASOFNOW=" + creditAmout
                    + " where UCASE(NAME)='" + name + "'";

            if (id != null && id.trim().length() > 0) {
                sql = sql + " AND ID=" + id;
            }

            logger.info("******************Executing update : " + sql);

            int i = this.jdbcTemplate.update(sql);
            if (i >= 1) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateCreditForCustomer(String name, String id, String creditAmout, String status, String billNo) {
        try {
            String sql = "update CUSTOMER_BILL_MASTER_2 set CREDIT_AMOUNT='" + creditAmout + "', CREDIT_STATUS='" + status + "' "
                    + " where UCASE(CUSTOMER_NAME)='" + name + "' ";

            if (billNo != null && billNo.trim().length() > 0) {
                sql = sql + " AND BILL_SERIAL_NUMBER='" + billNo + "'";
            }

            if (id != null && id.trim().length() > 0) {
                sql = sql + " AND CUSTOMER_ID=" + id;
            }

            logger.info("******************Executing update : " + sql);

            int i = this.jdbcTemplate.update(sql);
            if (i >= 1) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean updateCreditForCustomerInvoice(String name, String id, String creditAmout, String billNo, String status) {
        try {
            String sql = "update CUSTOMER_BILL_MASTER_2 set CREDIT_AMOUNT='" + creditAmout + "', CREDIT_STATUS='" + status + "'"
                    + " where UCASE(CUSTOMER_NAME)='" + name + "' and "
                    + " BILL_SERIAL_NUMBER='" + billNo + "'";

            if (id != null && id.trim().length() > 0) {
                sql = sql + " AND CUSTOMER_ID=" + id;
            }

            logger.info("Executing update : " + sql);
            int i = this.jdbcTemplate.update(sql);
            if (i >= 1) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<CustomerBillingDetails> getCustomerBillingDetail(Integer maxrecord,
            String custName, String customerID, String custMobile, boolean po, String dateFilter,
            String paymentType, String likeOperator, String orderBy, String hidden, String pageNo, String pageSize) {
        StringBuffer sbSQL = null;

        if (hidden.equalsIgnoreCase("0")) {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count , "
                    + " c.TAXABLE_AMOUNT, c.TOTAL_TAX_PAID, c.TOTAL_CGST_PAID, c.TOTAL_SGST_PAID, c.TOTAL_CGST_6_COUNT, c.TOTAL_CGST_9_COUNT, "
                    + " c.TOTAL_CGST_14_COUNT, c.TOTAL_CGST_2_5_COUNT,c.TOTAL_CGST_0_COUNT, c.TOTAL_CGST_6_AMOUNT,c.TOTAL_CGST_9_AMOUNT, "
                    + " c.TOTAL_CGST_14_AMOUNT, c.TOTAL_CGST_2_5_AMOUNT, c.TOTAL_CGST_0_AMOUNT, c.TAXABLE_AMOUNT_6_PER_GST,c.TAXABLE_AMOUNT_9_PER_GST,"
                    + " c.TAXABLE_AMOUNT_2_5_PER_GST,c.TAXABLE_AMOUNT_14_PER_GST,c.TAXABLE_AMOUNT_0_PER_GST "
                    + " FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b , BILL_TAXES c where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER and a.BILL_SERIAL_NUMBER=c.BILL_SERIAL_NUMBER AND a.IS_HIDDEN=" + hidden + " ");
        } else if (hidden.equalsIgnoreCase("1")) {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count , "
                    + " c.TAXABLE_AMOUNT, c.TOTAL_TAX_PAID, c.TOTAL_CGST_PAID, c.TOTAL_SGST_PAID, c.TOTAL_CGST_6_COUNT, c.TOTAL_CGST_9_COUNT, "
                    + " c.TOTAL_CGST_14_COUNT, c.TOTAL_CGST_2_5_COUNT,c.TOTAL_CGST_0_COUNT, c.TOTAL_CGST_6_AMOUNT,c.TOTAL_CGST_9_AMOUNT, "
                    + " c.TOTAL_CGST_14_AMOUNT, c.TOTAL_CGST_2_5_AMOUNT, c.TOTAL_CGST_0_AMOUNT,c.TAXABLE_AMOUNT_6_PER_GST,c.TAXABLE_AMOUNT_9_PER_GST,"
                    + " c.TAXABLE_AMOUNT_2_5_PER_GST,c.TAXABLE_AMOUNT_14_PER_GST,c.TAXABLE_AMOUNT_0_PER_GST "
                    + "  FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b , BILL_TAXES c where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER and a.BILL_SERIAL_NUMBER=c.BILL_SERIAL_NUMBER AND a.IS_HIDDEN=" + hidden + " ");
        } else {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count , c.TAXABLE_AMOUNT, "
                    + " c.TOTAL_TAX_PAID, c.TOTAL_CGST_PAID, c.TOTAL_SGST_PAID, c.TOTAL_CGST_6_COUNT, c.TOTAL_CGST_9_COUNT, "
                    + "  c.TOTAL_CGST_14_COUNT, c.TOTAL_CGST_2_5_COUNT,c.TOTAL_CGST_0_COUNT, c.TOTAL_CGST_6_AMOUNT,c.TOTAL_CGST_9_AMOUNT, "
                    + " c.TOTAL_CGST_14_AMOUNT, c.TOTAL_CGST_2_5_AMOUNT, c.TOTAL_CGST_0_AMOUNT,"
                    + " c.TAXABLE_AMOUNT_6_PER_GST,c.TAXABLE_AMOUNT_9_PER_GST,c.TAXABLE_AMOUNT_2_5_PER_GST,c.TAXABLE_AMOUNT_14_PER_GST,c.TAXABLE_AMOUNT_0_PER_GST "
                    + " FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b , BILL_TAXES c where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER and a.BILL_SERIAL_NUMBER=c.BILL_SERIAL_NUMBER ");
        }

        boolean whereExecuted = true;

        if (po) {
            sbSQL.append("AND a.IS_PURCHASEORDER='1' ");
            whereExecuted = true;
        } else {
            sbSQL.append("AND a.IS_PURCHASEORDER='0' ");
            whereExecuted = true;
        }

        if (custName != null && custName.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append("AND TRIM(UCASE(a.CUSTOMER_NAME)) LIKE '").append(likeOperator).append(custName.toUpperCase().trim()).append(likeOperator)
                        .append("' ");
            }
            whereExecuted = true;
        }

//        if (customerID != null && customerID.trim().length() > 0) {
//            if (whereExecuted) {
//                sbSQL.append(" AND CUSTOMER_ID=").append(customerID.trim());
//            }
//            whereExecuted = true;
//        }
        if (custMobile != null && custMobile.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(a.CUSTOMER_MOBILE_NUMBER) LIKE '%").append(custMobile.toUpperCase()).append("%' ");
            whereExecuted = true;
        }

        if (dateFilter != null && dateFilter.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append(" a.BILLING_DATE LIKE '%").append(dateFilter).append("%' ");
            whereExecuted = true;
        }

        if (paymentType != null && paymentType.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND UCASE(a.PAYMENT_TYPE) LIKE '%").append(paymentType.toUpperCase()).append("%' ");
            }
            whereExecuted = true;
        }

        int maxLimit = 100;

        if (maxrecord != null && maxrecord != 0) {
            maxLimit = maxrecord;
        }

        int pS = Integer.parseInt(pageSize);
        int pN = Integer.parseInt(pageNo);

        sbSQL.append(" ORDER BY a.CREATED_AT " + orderBy + " OFFSET " + (pN * pS) + " ROWS FETCH NEXT ").append(pS).append(" ROWS ONLY");

        logger.info("getCustomerBillingDetail executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<CustomerBillingDetails> productList = new ArrayList<CustomerBillingDetails>();

            int i = 0;
            while (rs.next()) {

                CustomerBillingDetails custBill = new CustomerBillingDetails();
                custBill.setCreatedAt(rs.getString("CREATED_AT"));
                custBill.setBillDate(rs.getString("BILLING_DATE"));
                custBill.setBillNo(rs.getString("BILL_SERIAL_NUMBER"));
                custBill.setCusMobile(rs.getString("CUSTOMER_MOBILE_NUMBER"));
                custBill.setCustName(rs.getString("CUSTOMER_NAME"));
                custBill.setTotalAmountPaid(rs.getString("TOTAL_AMOUNT_PAID"));
                custBill.setPrescriberName(rs.getString("PRESCRIBER_NAME"));
                custBill.setPrescriptionDate(rs.getString("PRESCRIPTION_DATE"));
                custBill.setAdditionalDiscount(rs.getString("ADDITIONAL_DISCOUNT"));
                custBill.setTotalCGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalSGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalIGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalProductDiscount(rs.getString("TOTALPRODUCTDISCOUNT"));
                custBill.setIsPurchaseOrder(rs.getString("IS_PURCHASEORDER"));
                custBill.setTotalTaxableAmount(rs.getString("TOTALTAXABLEAMOUNT"));
                custBill.setCreditStatus(rs.getString("CREDIT_STATUS"));
                custBill.setPaymentType(rs.getString("PAYMENT_TYPE"));
                custBill.setCreditNotes(rs.getString("CREDIT_NOTES"));
                custBill.setCreditAmount(rs.getString("CREDIT_AMOUNT"));
                custBill.setTotalNumberOfProducts(rs.getString("product_count"));
                custBill.setBillPrintNo(rs.getString("BILL_PRINT_NO"));

                custBill.setTaxableAmount(rs.getString("TAXABLE_AMOUNT"));
                custBill.setTotalTaxPaid(rs.getString("TOTAL_TAX_PAID"));

                custBill.setTotalCgstPaid(rs.getString("TOTAL_CGST_PAID"));
                custBill.setTotalSgstPaid(rs.getString("TOTAL_SGST_PAID"));

                custBill.setTotalCgst_6_count(rs.getString("TOTAL_CGST_6_COUNT"));
                custBill.setTotalCgst_9_count(rs.getString("TOTAL_CGST_9_COUNT"));
                custBill.setTotalCgst_2_5_count(rs.getString("TOTAL_CGST_2_5_COUNT"));
                custBill.setTotalCgst_14_count(rs.getString("TOTAL_CGST_14_COUNT"));
                custBill.setTotalCgst_0_count(rs.getString("TOTAL_CGST_0_COUNT"));
                custBill.setTotalCgst_6_amount(rs.getString("TOTAL_CGST_6_AMOUNT"));
                custBill.setTotalCgst_9_amount(rs.getString("TOTAL_CGST_9_AMOUNT"));
                custBill.setTotalCgst_2_5_amount(rs.getString("TOTAL_CGST_2_5_AMOUNT"));
                custBill.setTotalCgst_14_amount(rs.getString("TOTAL_CGST_14_AMOUNT"));
                custBill.setTotalCgst_0_amount(rs.getString("TOTAL_CGST_0_AMOUNT"));

                custBill.setTotalTaxableAmount0PerGST(rs.getString("TAXABLE_AMOUNT_0_PER_GST"));
                custBill.setTotalTaxableAmount2_5PerGST(rs.getString("TAXABLE_AMOUNT_2_5_PER_GST"));
                custBill.setTotalTaxableAmount6PerGST(rs.getString("TAXABLE_AMOUNT_6_PER_GST"));
                custBill.setTotalTaxableAmount9PerGST(rs.getString("TAXABLE_AMOUNT_9_PER_GST"));
                custBill.setTotalTaxableAmount14PerGST(rs.getString("TAXABLE_AMOUNT_14_PER_GST"));

                productList.add(custBill);
                i++;
                if (i > maxLimit) {
                    break;
                }
            }

            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");

                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

    public List<CustomerBillingDetails> getCustomerBillingDetail2(Integer maxrecord,
            String custName, String customerID, String custMobile, boolean po, String dateFilter,
            String paymentType, String likeOperator, String orderBy, String hidden, String pageNo, String pageSize) {
        StringBuffer sbSQL = null;

        if (hidden.equalsIgnoreCase("0")) {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count "
                    + " FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER AND a.IS_HIDDEN=" + hidden + " ");
        } else if (hidden.equalsIgnoreCase("1")) {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count "
                    + "  FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER  AND a.IS_HIDDEN=" + hidden + " ");
        } else {
            sbSQL = new StringBuffer("SELECT  a.CREATED_AT, a.CUSTOMER_NAME, a.CUSTOMER_MOBILE_NUMBER, a.PRESCRIBER_NAME, a.PRESCRIPTION_DATE ,"
                    + " a.BILL_SERIAL_NUMBER, a.BILLING_DATE, a.TOTAL_AMOUNT_PAID,a.ADDITIONAL_DISCOUNT,a.TOTALCGSTPAID,a.TOTALSGSTPAID,"
                    + " a.TOTALIGSTPAID,a.TOTALPRODUCTDISCOUNT,a.IS_PURCHASEORDER,a.TOTALTAXABLEAMOUNT, "
                    + " a.PAYMENT_TYPE, a.CREDIT_STATUS,a.CREDIT_NOTES,a.CREDIT_AMOUNT,a.BILL_PRINT_NO, b.product_count "
                    + " FROM CUSTOMER_BILL_MASTER_2 a, (select BILL_SERIAL_NUMBER, count(*) as product_count from BILL_MASTER group by BILL_SERIAL_NUMBER) "
                    + " b where a.BILL_SERIAL_NUMBER=b.BILL_SERIAL_NUMBER ");
        }

        boolean whereExecuted = true;

        if (po) {
            sbSQL.append("AND a.IS_PURCHASEORDER='1' ");
            whereExecuted = true;
        } else {
            sbSQL.append("AND a.IS_PURCHASEORDER='0' ");
            whereExecuted = true;
        }

        if (custName != null && custName.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append("AND UCASE(a.CUSTOMER_NAME) LIKE '").append(likeOperator).append(custName.toUpperCase()).append(likeOperator)
                        .append("' ");
            }
            whereExecuted = true;
        }

        if (customerID != null && customerID.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND CUSTOMER_ID=").append(customerID.trim());
            }
            whereExecuted = true;
        }

        if (custMobile != null && custMobile.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append("UCASE(a.CUSTOMER_MOBILE_NUMBER) LIKE '%").append(custMobile.toUpperCase()).append("%' ");
            whereExecuted = true;
        }

        if (dateFilter != null && dateFilter.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND ");
            }
            sbSQL.append(" a.BILLING_DATE LIKE '%").append(dateFilter).append("%' ");
            whereExecuted = true;
        }

        if (paymentType != null && paymentType.trim().length() > 0) {
            if (whereExecuted) {
                sbSQL.append(" AND UCASE(a.PAYMENT_TYPE) LIKE '%").append(paymentType.toUpperCase()).append("%' ");
            }
            whereExecuted = true;
        }

        int maxLimit = 100;

        if (maxrecord != null && maxrecord != 0) {
            maxLimit = maxrecord;
        }

        //int pS = Integer.parseInt(pageSize);
        //int pN = Integer.parseInt(pageNo);
        //sbSQL.append(" ORDER BY a.CREATED_AT " + orderBy + " OFFSET " + (pN * pS) + " ROWS FETCH NEXT ").append(pS).append(" ROWS ONLY");
        sbSQL.append(" ORDER BY a.CREATED_AT " + orderBy);
        logger.info("getCustomerBillingDetail executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<CustomerBillingDetails> productList = new ArrayList<CustomerBillingDetails>();

            int i = 0;
            while (rs.next()) {

                CustomerBillingDetails custBill = new CustomerBillingDetails();
                custBill.setCreatedAt(rs.getString("CREATED_AT"));
                custBill.setBillDate(rs.getString("BILLING_DATE"));
                custBill.setBillNo(rs.getString("BILL_SERIAL_NUMBER"));
                custBill.setCusMobile(rs.getString("CUSTOMER_MOBILE_NUMBER"));
                custBill.setCustName(rs.getString("CUSTOMER_NAME"));
                custBill.setTotalAmountPaid(rs.getString("TOTAL_AMOUNT_PAID"));
                custBill.setPrescriberName(rs.getString("PRESCRIBER_NAME"));
                custBill.setPrescriptionDate(rs.getString("PRESCRIPTION_DATE"));
                custBill.setAdditionalDiscount(rs.getString("ADDITIONAL_DISCOUNT"));
                custBill.setTotalCGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalSGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalIGSTPaid(rs.getString("TOTALCGSTPAID"));
                custBill.setTotalProductDiscount(rs.getString("TOTALPRODUCTDISCOUNT"));
                custBill.setIsPurchaseOrder(rs.getString("IS_PURCHASEORDER"));
                custBill.setTotalTaxableAmount(rs.getString("TOTALTAXABLEAMOUNT"));
                custBill.setCreditStatus(rs.getString("CREDIT_STATUS"));
                custBill.setPaymentType(rs.getString("PAYMENT_TYPE"));
                custBill.setCreditNotes(rs.getString("CREDIT_NOTES"));
                custBill.setCreditAmount(rs.getString("CREDIT_AMOUNT"));
                custBill.setTotalNumberOfProducts(rs.getString("product_count"));
                custBill.setBillPrintNo(rs.getString("BILL_PRINT_NO"));

                //custBill.setTaxableAmount(rs.getString("TAXABLE_AMOUNT"));
                // custBill.setTotalTaxPaid(rs.getString("TOTAL_TAX_PAID"));
                // custBill.setTotalCgstPaid(rs.getString("TOTAL_CGST_PAID"));
                // custBill.setTotalSgstPaid(rs.getString("TOTAL_SGST_PAID"));
                //custBill.setTotalCgst_6_count(rs.getString("TOTAL_CGST_6_COUNT"));
//                custBill.setTotalCgst_9_count(rs.getString("TOTAL_CGST_9_COUNT"));
//                custBill.setTotalCgst_2_5_count(rs.getString("TOTAL_CGST_2_5_COUNT"));
//                custBill.setTotalCgst_14_count(rs.getString("TOTAL_CGST_14_COUNT"));
//                custBill.setTotalCgst_0_count(rs.getString("TOTAL_CGST_0_COUNT"));
//                custBill.setTotalCgst_6_amount(rs.getString("TOTAL_CGST_6_AMOUNT"));
//                custBill.setTotalCgst_9_amount(rs.getString("TOTAL_CGST_9_AMOUNT"));
//                custBill.setTotalCgst_2_5_amount(rs.getString("TOTAL_CGST_2_5_AMOUNT"));
//                custBill.setTotalCgst_14_amount(rs.getString("TOTAL_CGST_14_AMOUNT"));
//                custBill.setTotalCgst_0_amount(rs.getString("TOTAL_CGST_0_AMOUNT"));
//
//                custBill.setTotalTaxableAmount0PerGST(rs.getString("TAXABLE_AMOUNT_0_PER_GST"));
//                custBill.setTotalTaxableAmount2_5PerGST(rs.getString("TAXABLE_AMOUNT_2_5_PER_GST"));
//                custBill.setTotalTaxableAmount6PerGST(rs.getString("TAXABLE_AMOUNT_6_PER_GST"));
//                custBill.setTotalTaxableAmount9PerGST(rs.getString("TAXABLE_AMOUNT_9_PER_GST"));
//                custBill.setTotalTaxableAmount14PerGST(rs.getString("TAXABLE_AMOUNT_14_PER_GST"));
                productList.add(custBill);

            }

            return productList;

        } catch (Exception ex) {
            ex.printStackTrace();
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");

                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

    public String deleteSalesData(String billNo) {
        String sql1 = "delete from BILL_MASTER where BILL_SERIAL_NUMBER='" + billNo + "'";
        String sql2 = "delete from CUSTOMER_BILL_MASTER_2 where BILL_SERIAL_NUMBER='" + billNo + "'";

        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            int res = st.executeUpdate(sql1);
            res = st.executeUpdate(sql2);
            if (res > 0) {
                return "true";
            } else {
                return "false";

            }
        } catch (Exception ex) {
            Logger.getLogger(MonitoringDao.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                }
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return "false";
    }

    public String hideSaleEntry(String billNo) {
        String sql1 = "update BILL_MASTER set IS_HIDDEN=1 where BILL_SERIAL_NUMBER='" + billNo + "'";
        String sql2 = "update CUSTOMER_BILL_MASTER_2 set IS_HIDDEN=1 where BILL_SERIAL_NUMBER='" + billNo + "'";

        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            int res = st.executeUpdate(sql1);
            res = st.executeUpdate(sql2);
            if (res > 0) {
                return "true";
            } else {
                return "false";

            }
        } catch (Exception ex) {
            Logger.getLogger(MonitoringDao.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return "false";
    }

    public String unhideSaleEntry(String billNo) {
        String sql1 = "update BILL_MASTER set IS_HIDDEN=0 where BILL_SERIAL_NUMBER='" + billNo + "'";
        String sql2 = "update CUSTOMER_BILL_MASTER_2 set IS_HIDDEN=0 where BILL_SERIAL_NUMBER='" + billNo + "'";

        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            int res = st.executeUpdate(sql1);
            res = st.executeUpdate(sql2);
            if (res > 0) {
                return "true";
            } else {
                return "false";

            }
        } catch (Exception ex) {
            Logger.getLogger(MonitoringDao.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return "false";
    }

    public List<BillMaster> getBillingDetailWithProducts(Integer maxrecord, String billNo) {
        //StringBuffer sbSQL = new StringBuffer("SELECT BILL_SERIAL_NUMBER, a.PRODUCT_ID as PRODUCT_ID, b.PRODUCT_NAME"
        //      + " as PRODUCT_NAME, QUANTITY_PURCHASED, AMOUNT, a.CGST as CGST, a.SGST as SGST, a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT FROM BILL_MASTER a, PRODUCT_MASTER b where a.PRODUCT_ID = b.PRODUCT_ID and a.BILL_SERIAL_NUMBER='" + billNo + "'");

        StringBuilder sbSQL = new StringBuilder("SELECT b.BATCH_NO, b.MRP, b.PACKING, b.COMPANY, c.PAYMENT_TYPE, c.CREDIT_AMOUNT,c.CREDIT_STATUS,c.BILL_PRINT_NO,c.BILLING_DATE as BILLDATE2,c.CREDIT_NOTES,  "
                + " c.CUSTOMER_NAME,c.CUSTOMER_MOBILE_NUMBER,c.PRESCRIBER_NAME,c.PRESCRIPTION_DATE,c.address as ADDRESS, a.BILL_SERIAL_NUMBER as BILL_SERIAL_NUMBER, "
                + "a.PRODUCT_ID as PRODUCT_ID, b.PRODUCT_NAME as PRODUCT_NAME, QUANTITY_PURCHASED, AMOUNT, "
                + "a.CGST as CGST, a.SGST as SGST, a.IGST as IGST , a.PRODUCT_DISCOUNT as PRODUCT_DISCOUNT,"
                + "a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT, a.CREATED_AT as CREATED_AT , c.TOTAL_AMOUNT_PAID as TOTAL_AMOUNT_PAID ,"
                + "c.ADDITIONAL_DISCOUNT as ADDITIONAL_DISCOUNT, "
                + "a.PRODUCT_NAME as PRODUCT_NAME_BKP,  "
                + "a.PRODUCT_BATCH as PRODUCT_BATCH_BKP,  "
                + "a.MRP as MRP_BKP,  "
                + "a.EXPIRY as EXPIRY_BKP,  "
                + "a.DISTRIBUTER_NAME as DISTRIBUTER_NAME_BKP,  "
                + "a.COMPANY as COMPANY_BKP  "
                + "FROM BILL_MASTER a LEFT JOIN PRODUCT_MASTER b ON a.PRODUCT_ID = b.PRODUCT_ID LEFT JOIN CUSTOMER_BILL_MASTER_2 c ON a.BILL_SERIAL_NUMBER=c.BILL_SERIAL_NUMBER"
                + " where a.BILL_SERIAL_NUMBER='" + billNo + "'");
        logger.info("getBillingDetailWithProducts executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<BillMaster> productList = new ArrayList<BillMaster>();
            int maxLimit = 100;
            int i = 0;
            while (rs.next()) {

                BillMaster custBill = new BillMaster();

                custBill.setAmount(rs.getString("AMOUNT"));
                custBill.setTotalAmount(rs.getString("TOTAL_AMOUNT_PAID"));
                custBill.setBillSerialNumber(rs.getString("BILL_SERIAL_NUMBER"));
                custBill.setBillDate(rs.getString("BILLDATE2"));
                custBill.setProductId(rs.getString("PRODUCT_ID"));
                custBill.setProductName(rs.getString("PRODUCT_NAME"));;
                custBill.setQuantityPurchased(rs.getString("QUANTITY_PURCHASED"));
                custBill.setCgst(rs.getString("CGST"));
                custBill.setSgst(rs.getString("SGST"));
                custBill.setIgst(rs.getString("IGST"));
                custBill.setBillPrintNo(rs.getString("BILL_PRINT_NO"));
                custBill.setAmountPerUnit(rs.getString("AMOUNT_PER_UNIT"));
                custBill.setCustomerName(rs.getString("CUSTOMER_NAME"));
                custBill.setCustomerContact(rs.getString("CUSTOMER_MOBILE_NUMBER"));
                custBill.setCustomerAddress(rs.getString("ADDRESS"));
                custBill.setPrescriberName(rs.getString("PRESCRIBER_NAME"));
                custBill.setPrescriptionDate(rs.getString("PRESCRIPTION_DATE"));
                custBill.setProductDiscount(rs.getString("PRODUCT_DISCOUNT"));
                custBill.setAdditionalDiscount(rs.getString("ADDITIONAL_DISCOUNT"));
                custBill.setCreatedAt(rs.getString("BILLDATE2"));
                custBill.setBatchNumber(rs.getString("BATCH_NO"));
                custBill.setCompanyName(rs.getString("COMPANY"));
                String mrp = rs.getString("MRP");
                if (mrp != null && mrp.contains(",")) {
                    mrp = mrp.replaceAll(",", "");
                    custBill.setMrp(mrp);
                } else if (mrp != null) {
                    custBill.setMrp(mrp);
                } else {
                    custBill.setMrp(null);
                }

                //custBill.setMrp(rs.getString("MRP"));
                custBill.setPacking(rs.getString("PACKING"));
                custBill.setCreditStatus(rs.getString("CREDIT_STATUS"));
                custBill.setPaymentType(rs.getString("PAYMENT_TYPE"));
                custBill.setCreditAmount(rs.getString("CREDIT_AMOUNT"));
                custBill.setCreditNotes(rs.getString("CREDIT_NOTES"));

                if (custBill.getProductName() == null || custBill.getProductName().trim().length() == 0) {
                    custBill.setProductName(rs.getString("PRODUCT_NAME_BKP"));
                }

                if (custBill.getBatchNumber() == null || custBill.getBatchNumber().trim().length() == 0) {
                    custBill.setBatchNumber(rs.getString("PRODUCT_BATCH_BKP"));
                }

                if (custBill.getMrp() == null || custBill.getMrp().trim().length() == 0) {
                    String mrpbkp = rs.getString("MRP_BKP");
                    if (mrpbkp != null) {
                        if (mrpbkp != null && mrpbkp.contains(",")) {
                            mrpbkp = mrpbkp.replaceAll(",", "");
                        }
                        custBill.setMrp(mrpbkp);
                    } else {
                        custBill.setMrp("0.00");
                    }
                }

                if (custBill.getExpiryDate() == null || custBill.getExpiryDate().trim().length() == 0) {
                    custBill.setExpiryDate(rs.getString("EXPIRY_BKP"));
                }

                if (custBill.getCompanyName() == null || custBill.getCompanyName().trim().length() == 0) {
                    custBill.setCompanyName(rs.getString("COMPANY_BKP"));
                }

                productList.add(custBill);
                i++;
//                if (i > maxLimit) {
//                    break;
//                }
            }

            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

    public List<BillMaster> getBillingDetailForProduct(Integer maxrecord,
            String productName, String batchNo, String companyName,
            String dateFilter, String pageNo, String pageSize) {
        //StringBuffer sbSQL = new StringBuffer("SELECT BILL_SERIAL_NUMBER, a.PRODUCT_ID as PRODUCT_ID, b.PRODUCT_NAME"
        //      + " as PRODUCT_NAME, QUANTITY_PURCHASED, AMOUNT, a.CGST as CGST, a.SGST as SGST, a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT FROM BILL_MASTER a, PRODUCT_MASTER b where a.PRODUCT_ID = b.PRODUCT_ID and a.BILL_SERIAL_NUMBER='" + billNo + "'");

        StringBuilder sbSQL = new StringBuilder("SELECT b.BATCH_NO, b.MRP, b.PACKING, b.COMPANY, c.PAYMENT_TYPE, c.CREDIT_AMOUNT,c.CREDIT_STATUS,c.BILL_PRINT_NO,c.BILLING_DATE as BILLDATE2,c.CREDIT_NOTES,  "
                + " c.CUSTOMER_NAME,c.CUSTOMER_MOBILE_NUMBER,c.PRESCRIBER_NAME,c.PRESCRIPTION_DATE,c.address as ADDRESS, a.BILL_SERIAL_NUMBER as BILL_SERIAL_NUMBER, "
                + "a.PRODUCT_ID as PRODUCT_ID, b.PRODUCT_NAME as PRODUCT_NAME, QUANTITY_PURCHASED, AMOUNT, "
                + "a.CGST as CGST, a.SGST as SGST, a.IGST as IGST , a.PRODUCT_DISCOUNT as PRODUCT_DISCOUNT,"
                + "a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT, a.CREATED_AT as CREATED_AT , c.TOTAL_AMOUNT_PAID as TOTAL_AMOUNT_PAID ,"
                + "c.ADDITIONAL_DISCOUNT as ADDITIONAL_DISCOUNT, "
                + "a.PRODUCT_NAME as PRODUCT_NAME_BKP,  "
                + "a.PRODUCT_BATCH as PRODUCT_BATCH_BKP,  "
                + "a.MRP as MRP_BKP,  "
                + "a.EXPIRY as EXPIRY_BKP,  "
                + "a.DISTRIBUTER_NAME as DISTRIBUTER_NAME_BKP,  "
                + "a.COMPANY as COMPANY_BKP  "
                + "FROM BILL_MASTER a LEFT JOIN PRODUCT_MASTER b ON a.PRODUCT_ID = b.PRODUCT_ID LEFT JOIN CUSTOMER_BILL_MASTER_2 c ON a.BILL_SERIAL_NUMBER=c.BILL_SERIAL_NUMBER"
                + " where ");

        boolean andExecute = false;

        if (productName != null && productName.trim().length() > 0) {
            sbSQL = sbSQL.append(" UCASE(a.PRODUCT_NAME) like '%").append(productName.toUpperCase()).append("%'");
            andExecute = true;
        }

        if (batchNo != null && batchNo.trim().length() > 0) {

            sbSQL = sbSQL.append(" AND UCASE(a.PRODUCT_BATCH) like '%").append(batchNo.toUpperCase()).append("%'");

            andExecute = true;
        }

        if (dateFilter != null && dateFilter.trim().length() > 0) {

            if (andExecute) {
                sbSQL.append(" AND C.BILLING_DATE like '%" + dateFilter.trim() + "%'");
            } else {
                sbSQL.append(" where C.BILLING_DATE like '%" + dateFilter.trim() + "%'");
            }
            andExecute = true;

        }

        int pS = Integer.parseInt(pageSize);
        int pN = Integer.parseInt(pageNo);

        sbSQL = sbSQL.append(" ORDER BY CREATED_AT desc OFFSET " + (pN * pS)
                + " ROWS FETCH NEXT " + pS + " ROWS ONLY ");

        logger.info("getBillingDetailWithProducts executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<BillMaster> productList = new ArrayList<BillMaster>();
            int maxLimit = 100;
            int i = 0;
            while (rs.next()) {

                BillMaster custBill = new BillMaster();

                custBill.setAmount(rs.getString("AMOUNT"));
                custBill.setTotalAmount(rs.getString("TOTAL_AMOUNT_PAID"));
                custBill.setBillSerialNumber(rs.getString("BILL_SERIAL_NUMBER"));
                custBill.setBillDate(rs.getString("BILLDATE2"));
                custBill.setProductId(rs.getString("PRODUCT_ID"));
                custBill.setProductName(rs.getString("PRODUCT_NAME"));;
                custBill.setQuantityPurchased(rs.getString("QUANTITY_PURCHASED"));
                custBill.setCgst(rs.getString("CGST"));
                custBill.setSgst(rs.getString("SGST"));
                custBill.setIgst(rs.getString("IGST"));
                custBill.setBillPrintNo(rs.getString("BILL_PRINT_NO"));
                custBill.setAmountPerUnit(rs.getString("AMOUNT_PER_UNIT"));
                custBill.setCustomerName(rs.getString("CUSTOMER_NAME"));
                custBill.setCustomerContact(rs.getString("CUSTOMER_MOBILE_NUMBER"));
                custBill.setCustomerAddress(rs.getString("ADDRESS"));
                custBill.setPrescriberName(rs.getString("PRESCRIBER_NAME"));
                custBill.setPrescriptionDate(rs.getString("PRESCRIPTION_DATE"));
                custBill.setProductDiscount(rs.getString("PRODUCT_DISCOUNT"));
                custBill.setAdditionalDiscount(rs.getString("ADDITIONAL_DISCOUNT"));
                custBill.setCreatedAt(rs.getString("BILLDATE2"));
                custBill.setBatchNumber(rs.getString("BATCH_NO"));
                custBill.setCompanyName(rs.getString("COMPANY"));
                //if (custBill.getMrp() == null || custBill.getMrp().trim().length() == 0) {
                String mrpbkp = rs.getString("MRP");
                if (mrpbkp != null && mrpbkp.contains(",")) {
                    mrpbkp = mrpbkp.replaceAll(",", "");
                }
                custBill.setMrp(mrpbkp);
                //}
                //custBill.setMrp(rs.getString("MRP"));
                custBill.setPacking(rs.getString("PACKING"));
                custBill.setCreditStatus(rs.getString("CREDIT_STATUS"));
                custBill.setPaymentType(rs.getString("PAYMENT_TYPE"));
                custBill.setCreditAmount(rs.getString("CREDIT_AMOUNT"));
                custBill.setCreditNotes(rs.getString("CREDIT_NOTES"));

                if (custBill.getProductName() == null || custBill.getProductName().trim().length() == 0) {
                    custBill.setProductName(rs.getString("PRODUCT_NAME_BKP"));
                }

                if (custBill.getBatchNumber() == null || custBill.getBatchNumber().trim().length() == 0) {
                    custBill.setBatchNumber(rs.getString("PRODUCT_BATCH_BKP"));
                }

                if (custBill.getMrp() == null || custBill.getMrp().trim().length() == 0) {
                    String mrpbkp1 = rs.getString("MRP_BKP");
                    if (mrpbkp1.contains(",")) {
                        mrpbkp1 = mrpbkp1.replaceAll(",", "");
                    }
                    custBill.setMrp(mrpbkp1);
                    //custBill.setMrp(rs.getString("MRP_BKP"));
                }

                if (custBill.getExpiryDate() == null || custBill.getExpiryDate().trim().length() == 0) {
                    custBill.setExpiryDate(rs.getString("EXPIRY_BKP"));
                }

                if (custBill.getCompanyName() == null || custBill.getCompanyName().trim().length() == 0) {
                    custBill.setCompanyName(rs.getString("COMPANY_BKP"));
                }

                productList.add(custBill);
                i++;
                if (i > maxLimit) {
                    break;
                }
            }

            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");
                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

    public List<PurchaseOrderMaster> getPurchaseOrderDetailWithProducts(Integer maxrecord,
            String distributerName, String batch, String company, String productName,
            String dateFilter, String pageNo, String pageSize) {
        //StringBuffer sbSQL = new StringBuffer("SELECT BILL_SERIAL_NUMBER, a.PRODUCT_ID as PRODUCT_ID, b.PRODUCT_NAME"
        //      + " as PRODUCT_NAME, QUANTITY_PURCHASED, AMOUNT, a.CGST as CGST, a.SGST as SGST, a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT FROM BILL_MASTER a, PRODUCT_MASTER b where a.PRODUCT_ID = b.PRODUCT_ID and a.BILL_SERIAL_NUMBER='" + billNo + "'");

        StringBuilder sbSQL = new StringBuilder("SELECT a.PRODUCT_NAME , a.QUANTITY_PURCHASED, "
                + "a.AMOUNT, a.CGST as CGST, a.SGST as SGST, a.IGST as IGST, a.PRODUCT_DISCOUNT as PRODUCT_DISCOUNT, "
                + "a.AMOUNT_PER_UNIT as AMOUNT_PER_UNIT, DISTRIBUTER_NAME, DISTRIBUTER_NO, COMPANY, MRP, BATCH, EXPIRY,ENTRY_DATE, FREE "
                + "FROM PURCHASE_ORDER_MASTER a ");

        boolean t = false;
        if (distributerName != null && distributerName.length() > 0) {
            sbSQL.append(" where DISTRIBUTER_NAME like '%" + distributerName.trim() + "%'");
            t = true;
        }

        if (company != null && company.length() > 0) {
            if (t) {
                sbSQL.append(" AND COMPANY like '%" + company.trim() + "%'");
            } else {
                sbSQL.append(" where COMPANY like '%" + company.trim() + "%'");
            }
            t = true;
        }

        if (productName != null && productName.length() > 0) {
            if (t) {
                sbSQL.append(" AND PRODUCT_NAME like '%" + productName.trim() + "%' ");
            } else {
                sbSQL.append(" where PRODUCT_NAME like '%" + productName.trim() + "%' ");
            }
            t = true;
        }

        if (batch != null && batch.length() > 0) {
            if (t) {
                sbSQL.append(" AND BATCH like '%" + batch.trim() + "%' ");
            } else {
                sbSQL.append(" where BATCH like '%" + batch.trim() + "%' ");
            }
            t = true;
        }

        if (dateFilter != null && dateFilter.trim().length() > 0) {

            if (t) {
                sbSQL.append(" AND ENTRY_DATE like '%" + dateFilter.trim() + "%'");
            } else {
                sbSQL.append(" where ENTRY_DATE like '%" + dateFilter.trim() + "%'");
            }
            t = true;

        }

        int pS = Integer.parseInt(pageSize);
        int pN = Integer.parseInt(pageNo);

        sbSQL.append(" ORDER BY a.CREATED_AT DESC OFFSET ").append(pN * pS).append(" ROWS FETCH NEXT ").append(pS).append("  ROWS ONLY");

        logger.info("getPurchaseOrderDetailWithProducts executing sql : " + sbSQL);
        ResultSet rs = null;
        SqlRowSet srs = null;
        Connection con = null;
        Statement st = null;
        try {
            con = this.datasource.getConnection();
            st = con.createStatement();
            rs = st.executeQuery(sbSQL.toString());

            //rs = this.jdbcTemplate.queryForRowSet(sbSQL.toString());
            List<PurchaseOrderMaster> productList = new ArrayList<PurchaseOrderMaster>();
            while (rs.next()) {

                PurchaseOrderMaster custBill = new PurchaseOrderMaster();

                custBill.setAmount(rs.getString("AMOUNT"));
                //custBill.setBillSerialNumber(rs.getString("BILL_SERIAL_NUMBER"));
                //custBill.setProductId(rs.getString("PRODUCT_ID"));
                custBill.setProductName(rs.getString("PRODUCT_NAME"));;
                custBill.setQuantityPurchased(rs.getString("QUANTITY_PURCHASED"));
                custBill.setCgst(rs.getString("CGST"));
                custBill.setSgst(rs.getString("SGST"));
                custBill.setIgst(rs.getString("IGST"));
                custBill.setAmountPerUnit(rs.getString("AMOUNT_PER_UNIT"));
//                custBill.setCustomerName(rs.getString("CUSTOMER_NAME"));
//                custBill.setCustomerContact(rs.getString("CUSTOMER_MOBILE_NUMBER"));
//                custBill.setCustomerAddress(rs.getString("ADDRESS"));
//                custBill.setPrescriberName(rs.getString("PRESCRIBER_NAME"));
//                custBill.setPrescriptionDate(rs.getString("PRESCRIPTION_DATE"));
                custBill.setProductDiscount(rs.getString("PRODUCT_DISCOUNT"));
                custBill.setDistName(rs.getString("DISTRIBUTER_NAME"));
                custBill.setDistNo(rs.getString("DISTRIBUTER_NO"));
                custBill.setCompany(rs.getString("COMPANY"));
                String mrpbkp1 = rs.getString("MRP");
                if (mrpbkp1.contains(",")) {
                    mrpbkp1 = mrpbkp1.replaceAll(",", "");
                }
                custBill.setMrp(mrpbkp1);
                custBill.setBatch(rs.getString("BATCH"));
                custBill.setExpiry(rs.getString("EXPIRY"));
                custBill.setEntryDate(rs.getString("ENTRY_DATE"));
                custBill.setFree(rs.getString("FREE"));

                productList.add(custBill);
            }
            return productList;

        } catch (Exception ex) {
            Logger.getLogger(CoreService.class
                    .getName()).log(Level.SEVERE, null, ex);

        } finally {
            try {
                Logger.getLogger(CoreService.class
                        .getName()).log(Level.SEVERE, null, "Returning Instance summary List by dao");

                try {
                    if (rs != null) {
                        rs.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (st != null) {
                        st.close();
                    }
                } catch (Exception e) {
                };
                try {
                    if (con != null) {
                        con.close();
                    }
                } catch (Exception e) {
                };

            } catch (Exception ex) {
                Logger.getLogger(MonitoringDao.class
                        .getName()).log(Level.SEVERE, null, ex);
            }
        }
        return null;
    }

    public String addProductsFromFile(final List<ProductMaster> productList) {

        String query = "INSERT INTO PRODUCT_MASTER(PRODUCT_NAME,COMPANY,FORMULA,BATCH_NO,MANUFACTURE_DATE,EXPIRE_DATE,"
                + "QUANTITY_IN_SHOP,PURCHASE_RATE,CREATED_AT,PACKING,FREE,MRP,CGST,SGST,IGST,DISCOUNT,DISTUBUTER_NAME,"
                + "DISTIBUTER_NUMBER,DATE,DRUG_SCHEDULE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        try {
            logger.info("Executing query : " + query);
            this.jdbcTemplate.batchUpdate(query, new BatchPreparedStatementSetter() {

                @Override
                public void setValues(PreparedStatement ps, int i) throws SQLException {
                    ProductMaster data = productList.get(i);
                    ps.setString(1, data.getProductName());
                    ps.setString(2, data.getCompany());
                    ps.setString(3, data.getFormula());
                    ps.setString(4, data.getBatchNo());
                    ps.setString(5, data.getManufactureDate());
                    ps.setString(6, data.getExpireDate());
                    ps.setString(7, data.getQuantityInShop());
                    ps.setString(8, data.getPurchaseRate());
                    ps.setTimestamp(9, new Timestamp(new Date().getTime()));
                    ps.setString(10, data.getPacking());
                    ps.setString(11, data.getFree());
                    ps.setString(12, data.getMrp());
                    ps.setString(13, data.getCgst());
                    ps.setString(14, data.getSgst());
                    ps.setString(15, data.getIgst());
                    ps.setString(16, data.getDiscount());
                    ps.setString(17, data.getDistributerName());
                    ps.setString(18, data.getDistributerNumber());
                    ps.setString(19, data.getDate());
                    ps.setString(20, data.getDrugSchedule());

                }

                @Override
                public int getBatchSize() {
                    return productList.size();
                }

            });

            return "true";
        } catch (Exception e) {
            logger.info("Batch insert to batchUpdateCertifyInvoiceData failed!!! " + e.toString());
            return e.toString();
        }
    }

    public boolean deleteProductDetail(String productId) {

        int i = this.jdbcTemplate.update("DELETE FROM PRODUCT_MASTER WHERE PRODUCT_ID=? ", productId);

        return i >= 1;

    }

    public boolean updateProductDetailQuantityZero(String productId) {

        int i = this.jdbcTemplate.update("UPDATE PRODUCT_MASTER SET QUANTITY_IN_SHOP='0', FREE='0' WHERE PRODUCT_ID=? ", productId);

        return i >= 1;

    }

    public boolean deleteCustomerBillingDetail(String billId) {

        logger.info("Executing query " + "DELETE FROM BILL_MASTER WHERE BILL_SERIAL_NUMBER='" + billId + "'");

        int i = this.jdbcTemplate.update("DELETE FROM BILL_MASTER WHERE BILL_SERIAL_NUMBER=? ", billId);

        int j = this.jdbcTemplate.update("DELETE FROM CUSTOMER_BILL_MASTER_2 WHERE BILL_SERIAL_NUMBER=? ", billId);

        return (i >= 1 || j >= 1);
    }

    public List<Map<String, Object>> queryForList(String sql) {
        logger.info("Executing sql : " + sql);
        return this.jdbcTemplate.queryForList(sql);
    }

    public String queryForUserImage(String sql) {
        logger.info("Executing sql : " + sql);
        return this.jdbcTemplate.queryForObject(sql, String.class);
    }

    public int quickDeleteCustomer(String ID) {
        try {
            String sql = "delete from CUSTOMER_ACCOUNT_MASTER where ID=?";
            return this.jdbcTemplate.update(sql, new Object[]{ID});
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int quickAddCustomerPaymentString(String CUSTOMER_NAME,
            String ID,
            String CUSTOMER_ID,
            String PAY_TYPE,
            String CHEQUE_NO,
            String CARD_NO,
            String DD_NO,
            String RECIEVED_BY,
            String RECIEVED_FROM,
            String PAYMENT_AMOUNT,
            String CREDIT_BALANCE,
            String PAYMENT_AGAINST_BILLNO) {

        try {

            if (CHEQUE_NO != null && CHEQUE_NO.trim().length() > 0) {
                PAY_TYPE = "CHEQUE-PAYMENT";
            } else if (CARD_NO != null && CARD_NO.trim().length() > 0) {
                PAY_TYPE = "CARD-PAYMENT";
            } else if (DD_NO != null && DD_NO.trim().length() > 0) {
                PAY_TYPE = "DEMAND-DRAFT";
            }

            String sql = "insert into CUSTOMER_PAYMENT_MASTER(CUSTOMER_NAME,CUSTOMER_ID,PAY_TYPE,"
                    + "CHEQUE_NO,CARD_NO,DD_NO,RECIEVED_BY,RECIEVED_FROM,PAYMENT_AMOUNT,CREDIT_BALANCE, PAYMENT_AGAINST_BILLNO) values(?,?,?,?,?,?,?,?,?,?,?)";
            return this.jdbcTemplate.update(sql, new Object[]{CUSTOMER_NAME.toUpperCase(), CUSTOMER_ID, PAY_TYPE, CHEQUE_NO, CARD_NO, DD_NO,
                RECIEVED_BY, RECIEVED_FROM, PAYMENT_AMOUNT, CREDIT_BALANCE, PAYMENT_AGAINST_BILLNO});
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }

    }

    public int quickUpdateCustomerPaymentString(String CUSTOMER_NAME,
            String ID,
            String CUSTOMER_ID,
            String PAY_TYPE,
            String CHEQUE_NO,
            String CARD_NO,
            String DD_NO,
            String RECIEVED_BY,
            String RECIEVED_FROM,
            String PAYMENT_AMOUNT,
            String CREDIT_BALANCE) {

        try {
            String sql = "uddate CUSTOMER_PAYMENT_MASTER set CUSTOMER_NAME=?,CUSTOMER_ID,PAY_TYPE=?,"
                    + "CHEQUE_NO=?,CARD_NO=?,DD_NO=?,RECIEVED_BY=?,RECIEVED_FROM=?,PAYMENT_AMOUNT=?,CREDIT_BALANCE=? where ID=?";
            return this.jdbcTemplate.update(sql, new Object[]{CUSTOMER_NAME.toUpperCase(), CUSTOMER_ID, PAY_TYPE, CHEQUE_NO, CARD_NO, DD_NO,
                RECIEVED_BY, RECIEVED_FROM, PAYMENT_AMOUNT, CREDIT_BALANCE, ID});
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }

    }

    public int quickAddCustomer(String NAME,
            String ID,
            String CONTACT_NAME,
            String MOBILE,
            String ADDRESS,
            String EMAIL,
            String IS_CREDIT_ACCOUNT,
            String PHONE_1,
            String TTYPE,
            String GSTIN,
            String MAX_CREDIT_AMOUNT,
            String KEYWORDS,
            String FOLLOWUP_DATE_INTERVAL,
            String TOTAL_BILL_AMOUNT,
            String TOTAL_CREDIT_ASOFNOW,
            String DEFAULT_DISCOUNT, String IMAGE) {
        try {
            String sql = "insert into CUSTOMER_ACCOUNT_MASTER(NAME,CONTACT_NAME,MOBILE,"
                    + "ADDRESS,EMAIL,IS_CREDIT_ACCOUNT,PHONE_1,TTYPE,GSTIN,MAX_CREDIT_AMOUNT,KEYWORDS,"
                    + "FOLLOWUP_DATE_INTERVAL,TOTAL_BILL_AMOUNT,TOTAL_CREDIT_ASOFNOW,DEFAULT_DISCOUNT, USER_IMAGE) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            KeyHolder generatedKeyHolder = new GeneratedKeyHolder();

            this.jdbcTemplate.update(new PreparedStatementCreator() {
                @Override
                public PreparedStatement createPreparedStatement(Connection cnctn) throws SQLException {
                    PreparedStatement ps = cnctn.prepareStatement(sql, new String[]{"ID"});
                    ps.setString(1, NAME.toUpperCase());
                    ps.setString(2, CONTACT_NAME.toUpperCase());
                    ps.setString(3, MOBILE.toUpperCase());
                    ps.setString(4, ADDRESS.toUpperCase());
                    ps.setString(5, EMAIL.toUpperCase());
                    ps.setString(6, IS_CREDIT_ACCOUNT.toUpperCase());
                    ps.setString(7, PHONE_1.toUpperCase());
                    ps.setString(8, TTYPE.toUpperCase());
                    ps.setString(9, GSTIN.toUpperCase());
                    ps.setString(10, MAX_CREDIT_AMOUNT.toUpperCase());
                    ps.setString(11, KEYWORDS.toUpperCase());
                    ps.setString(12, FOLLOWUP_DATE_INTERVAL.toUpperCase());
                    ps.setString(13, TOTAL_BILL_AMOUNT.toUpperCase());
                    ps.setString(14, TOTAL_CREDIT_ASOFNOW.toUpperCase());
                    ps.setString(15, DEFAULT_DISCOUNT.toUpperCase());
                    ps.setString(16, IMAGE);
                    return ps;
                }
            }, generatedKeyHolder);
            return generatedKeyHolder.getKey().intValue();

//            return this.jdbcTemplate.update(sql, new Object[]{NAME.toUpperCase(), CONTACT_NAME.toUpperCase(), MOBILE, ADDRESS, EMAIL, IS_CREDIT_ACCOUNT, PHONE_1,
//                TTYPE, GSTIN, MAX_CREDIT_AMOUNT, KEYWORDS, FOLLOWUP_DATE_INTERVAL, TOTAL_BILL_AMOUNT,
//                TOTAL_CREDIT_ASOFNOW, DEFAULT_DISCOUNT, IMAGE});
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public int quickUpdateCustomer(String NAME,
            String ID,
            String CONTACT_NAME,
            String MOBILE,
            String ADDRESS,
            String EMAIL,
            String IS_CREDIT_ACCOUNT,
            String PHONE_1,
            String TTYPE,
            String GSTIN,
            String MAX_CREDIT_AMOUNT,
            String KEYWORDS,
            String FOLLOWUP_DATE_INTERVAL,
            String TOTAL_BILL_AMOUNT,
            String TOTAL_CREDIT_ASOFNOW,
            String DEFAULT_DISCOUNT) {
        try {
            String sql = "update CUSTOMER_ACCOUNT_MASTER set NAME=?, CONTACT_NAME=?, MOBILE=?,ADDRESS =?, EMAIL=?, IS_CREDIT_ACCOUNT=?,"
                    + "PHONE_1=?, TTYPE=?, GSTIN=?, MAX_CREDIT_AMOUNT=?, KEYWORDS=?, FOLLOWUP_DATE_INTERVAL=? , TOTAL_BILL_AMOUNT=?,"
                    + "TOTAL_CREDIT_ASOFNOW=?, DEFAULT_DISCOUNT=? where ID=?";

            return this.jdbcTemplate.update(sql,
                    new Object[]{NAME.toUpperCase(), CONTACT_NAME.toUpperCase(), MOBILE, ADDRESS, EMAIL, IS_CREDIT_ACCOUNT, PHONE_1,
                        TTYPE, GSTIN, MAX_CREDIT_AMOUNT, KEYWORDS, FOLLOWUP_DATE_INTERVAL, TOTAL_BILL_AMOUNT,
                        TOTAL_CREDIT_ASOFNOW, DEFAULT_DISCOUNT, ID});
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public String quickAddCustomerName(final String name, final String mobile) {
        String SQL = "INSERT INTO CUSTOMER_ACCOUNT_MASTER (NAME,MOBILE) VALUES(?,?)";

        KeyHolder generatedKeyHolder = new GeneratedKeyHolder();

        this.jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection cnctn) throws SQLException {
                PreparedStatement ps = cnctn.prepareStatement(SQL, new String[]{"ID"});
                ps.setString(1, name);
                ps.setString(2, mobile);
                return ps;
            }
        }, generatedKeyHolder);
        return String.valueOf(generatedKeyHolder.getKey().intValue());
    }

    public int getBillTaxInfo(String billNo) {
        int count = 0;
        try {
            String sql = "SELECT count(*) from BILL_TAXES where BILL_SERIAL_NUMBER='" + billNo + "'";
            count = jdbcTemplate.queryForObject(sql, Integer.class);
        } catch (Exception e) {
            count = 0;
        }
        return count;
    }

    public String addBillingTaxInformation(String billNo, String billPrintNo, String billDate,
            double totalTaxableAmountD, double totalTaxableAmount, double totalTaxPaid, String additionalDiscount, double totalCGSTPaidD,
            double totalSGSTPaidD, int totalCgst6Count, int totalCgst9Count, int totalCgst14Count, int totalCgst2_5Count,
            int totalCgst0Count, double totalCgst6Amount, double totalCgst9Amount, double totalCgst14Amount,
            double totalCgst2_5Amount, double totalCgst0Amount, double totalTaxableAmount0PerGST,
            double totalTaxableAmount6PerGST, double totalTaxableAmount9PerGST, double totalTaxableAmount14PerGST, double totalTaxableAmount2_5PerGST) {
        String SQL = "INSERT INTO BILL_TAXES( BILL_SERIAL_NUMBER, BILL_PRINT_NUMBER, BILLING_DATE, TOTAL_AMOUNT, TAXABLE_AMOUNT, TOTAL_DISCOUNT, "
                + "TOTAL_CGST_PAID,\n"
                + "TOTAL_SGST_PAID, TOTAL_CGST_6_COUNT, TOTAL_CGST_9_COUNT,TOTAL_CGST_14_COUNT, TOTAL_CGST_2_5_COUNT, TOTAL_CGST_0_COUNT, TOTAL_CGST_6_AMOUNT, \n"
                + "TOTAL_CGST_9_AMOUNT, TOTAL_CGST_14_AMOUNT, TOTAL_CGST_2_5_AMOUNT, TOTAL_CGST_0_AMOUNT, TOTAL_TAX_PAID, "
                + "TAXABLE_AMOUNT_6_PER_GST,TAXABLE_AMOUNT_9_PER_GST,TAXABLE_AMOUNT_2_5_PER_GST,TAXABLE_AMOUNT_14_PER_GST,TAXABLE_AMOUNT_0_PER_GST) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?)";

        try {
            this.jdbcTemplate.update(new PreparedStatementCreator() {
                @Override
                public PreparedStatement createPreparedStatement(Connection cnctn) throws SQLException {
                    PreparedStatement ps = cnctn.prepareStatement(SQL);
                    ps.setString(1, billNo);
                    ps.setString(2, billPrintNo);
                    ps.setString(3, billDate);
                    ps.setString(4, String.valueOf(totalTaxableAmountD));
                    ps.setString(5, String.valueOf(totalTaxableAmount));
                    ps.setString(6, String.valueOf(additionalDiscount));
                    ps.setString(7, String.valueOf(totalCGSTPaidD));
                    ps.setString(8, String.valueOf(totalSGSTPaidD));
                    ps.setString(9, String.valueOf(totalCgst6Count));
                    ps.setString(10, String.valueOf(totalCgst9Count));
                    ps.setString(11, String.valueOf(totalCgst14Count));
                    ps.setString(12, String.valueOf(totalCgst2_5Count));
                    ps.setString(13, String.valueOf(totalCgst0Count));
                    ps.setString(14, String.valueOf(totalCgst6Amount));
                    ps.setString(15, String.valueOf(totalCgst9Amount));
                    ps.setString(16, String.valueOf(totalCgst14Amount));
                    ps.setString(17, String.valueOf(totalCgst2_5Amount));
                    ps.setString(18, String.valueOf(totalCgst0Amount));
                    ps.setString(19, String.valueOf(totalTaxPaid));
                    ps.setString(20, String.valueOf(totalTaxableAmount6PerGST));
                    ps.setString(21, String.valueOf(totalTaxableAmount9PerGST));
                    ps.setString(22, String.valueOf(totalTaxableAmount2_5PerGST));
                    ps.setString(23, String.valueOf(totalTaxableAmount14PerGST));
                    ps.setString(24, String.valueOf(totalTaxableAmount0PerGST));
                    return ps;
                }
            });
            return "added";
        } catch (Exception e) {
            e.printStackTrace();
            return "failed";
        }
    }

    public List<String> getDistinctBillNo() {

        String sql = "select distinct BILL_SERIAL_NUMBER from BILL_MASTER ";

        List<String> ids = this.jdbcTemplate.queryForList(sql, String.class);

        return ids;

    }

}
