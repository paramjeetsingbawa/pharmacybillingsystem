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
public class PurchaseOrderMaster implements Serializable {
    
    private String billSerialNumber;
    private String productId;
    private String quantityPurchased;
    private String amount;
    String productName;
    String amountPerUnit;
    String cgst;
    String sgst;
    String igst;
    String distName;
    String distNo;
    String company;
    String mrp;
    String batch;
    String expiry;
    String entryDate;
    String free;
    
    
           
    
    String productDiscount;
    String additionalDiscount;
    
    String customerName;
    String customerContact;
    String customerAddress;
    String prescriberName;
    String prescriptionDate;

    public String getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    public String getFree() {
        return free;
    }

    public void setFree(String free) {
        this.free = free;
    }

    
    
    public String getDistName() {
        return distName;
    }

    public void setDistName(String distName) {
        this.distName = distName;
    }

    public String getDistNo() {
        return distNo;
    }

    public void setDistNo(String distNo) {
        this.distNo = distNo;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getMrp() {
        return mrp;
    }

    public void setMrp(String mrp) {
        this.mrp = mrp;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }

    public String getExpiry() {
        return expiry;
    }

    public void setExpiry(String expiry) {
        this.expiry = expiry;
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
    
    public PurchaseOrderMaster() {
    }

    public PurchaseOrderMaster(String billSerialNumber) {
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
        if (!(object instanceof PurchaseOrderMaster)) {
            return false;
        }
        PurchaseOrderMaster other = (PurchaseOrderMaster) object;
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
