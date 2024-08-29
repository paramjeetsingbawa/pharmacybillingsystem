/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.domain;

/**
 *
 * @author Param
 */
public class CompanyAccountMaster {
    
    int id;
    String name;
    String contactName;
    String mobile;
    String address;
   
    String email;
    String isCreditAccount;
    String phone1;
    String type;
    String gstin;
    String maxPurchaseLimit;
    String keywords;
    String createdAt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getIsCreditAccount() {
        return isCreditAccount;
    }

    public void setIsCreditAccount(String isCreditAccount) {
        this.isCreditAccount = isCreditAccount;
    }

    public String getPhone1() {
        return phone1;
    }

    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public String getMaxPurchaseLimit() {
        return maxPurchaseLimit;
    }

    public void setMaxPurchaseLimit(String maxPurchaseLimit) {
        this.maxPurchaseLimit = maxPurchaseLimit;
    }

    

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

   

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
            
    
}
