/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.domain;

import java.io.Serializable;


/**
 *
 * @author param
 */
public class BillMaster implements Serializable {
    
    private String billSerialNumber;
    private String billDate;
    private String productId;
    private String quantityPurchased;
    private String amount;
    String productName;
    String amountPerUnit;
    String batchNumber;
    String companyName;
    String mrp;
    String cgst;
    String sgst;
    String igst;
    String productDiscount;
    String additionalDiscount;
    String expiryDate;
    String billPrintNo;
    String totalAmount;
    String customerName;
    String customerContact;
    String customerAddress;
    String prescriberName;
    String prescriptionDate;
    String createdAt;
    String creditAmount;
    String paymentType;
    String creditStatus;
    String creditNotes;
    
    
    
    String packing;

    public String getBillDate() {
        return billDate;
    }

    public void setBillDate(String billDate) {
        this.billDate = billDate;
    }
    
    

    public String getBillPrintNo() {
        return billPrintNo;
    }

    public void setBillPrintNo(String billPrintNo) {
        this.billPrintNo = billPrintNo;
    }
    
    

    public String getCreditAmount() {
        return creditAmount;
    }

    public void setCreditAmount(String creditAmount) {
        this.creditAmount = creditAmount;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public String getCreditStatus() {
        return creditStatus;
    }

    public void setCreditStatus(String creditStatus) {
        this.creditStatus = creditStatus;
    }

    public String getCreditNotes() {
        return creditNotes;
    }

    public void setCreditNotes(String creditNotes) {
        this.creditNotes = creditNotes;
    }

    
    
    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    

    public String getPacking() {
        return packing;
    }

    public void setPacking(String packing) {
        this.packing = packing;
    }
    
    

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getMrp() {
        return mrp;
    }

    public void setMrp(String mrp) {
        this.mrp = mrp;
    }
    
    

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    

    public String getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(String totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    
    

    public String getProductDiscount() {
        return productDiscount;
    }

    public void setProductDiscount(String productDiscount) {
        this.productDiscount = productDiscount;
    }
    
    

    public String getAdditionalDiscount() {
        return additionalDiscount;
    }

    public void setAdditionalDiscount(String additionalDiscount) {
        this.additionalDiscount = additionalDiscount;
    }

    public String getIgst() {
        return igst;
    }

    public void setIgst(String igst) {
        this.igst = igst;
    }
    
    

    public String getPrescriberName() {
        return prescriberName;
    }

    public void setPrescriberName(String prescriberName) {
        this.prescriberName = prescriberName;
    }

    public String getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(String prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }
    
    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }
    
    

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public BillMaster() {
    }

    public BillMaster(String billSerialNumber) {
        this.billSerialNumber = billSerialNumber;
    }

    public String getBillSerialNumber() {
        return billSerialNumber;
    }

    public void setBillSerialNumber(String billSerialNumber) {
        this.billSerialNumber = billSerialNumber;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getQuantityPurchased() {
        return quantityPurchased;
    }

    public void setQuantityPurchased(String quantityPurchased) {
        this.quantityPurchased = quantityPurchased;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (billSerialNumber != null ? billSerialNumber.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof BillMaster)) {
            return false;
        }
        BillMaster other = (BillMaster) object;
        if ((this.billSerialNumber == null && other.billSerialNumber != null) || (this.billSerialNumber != null && !this.billSerialNumber.equals(other.billSerialNumber))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.param.medicalapp.kiterx.kiterx.domain.BillMaster[ billSerialNumber=" + billSerialNumber + " ]";
    }

    public String getAmountPerUnit() {
        return amountPerUnit;
    }

    public void setAmountPerUnit(String amountPerUnit) {
        this.amountPerUnit = amountPerUnit;
    }

    public String getCgst() {
        return cgst;
    }

    public void setCgst(String cgst) {
        this.cgst = cgst;
    }

    public String getSgst() {
        return sgst;
    }

    public void setSgst(String sgst) {
        this.sgst = sgst;
    }
    
    
    
}
