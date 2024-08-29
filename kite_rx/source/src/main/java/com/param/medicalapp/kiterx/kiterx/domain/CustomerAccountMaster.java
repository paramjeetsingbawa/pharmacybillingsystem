/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

/**
 *
 * @author Param
 */
public class CustomerAccountMaster implements Comparable<CustomerAccountMaster>{
    
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
    String maxCreditLimit;
    String keywords;
    String followupDateReminder;
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

    public String getMaxCreditLimit() {
        return maxCreditLimit;
    }

    public void setMaxCreditLimit(String maxCreditLimit) {
        this.maxCreditLimit = maxCreditLimit;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getFollowupDateReminder() {
        return followupDateReminder;
    }

    public void setFollowupDateReminder(String followupDateReminder) {
        this.followupDateReminder = followupDateReminder;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
            
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        
        if( ! (obj instanceof CustomerAccountMaster) ){
            return false;
        }
        
        CustomerAccountMaster master = (CustomerAccountMaster) obj;
        
        if(this.name.equalsIgnoreCase(master.name)){
            if(this.isCreditAccount.equalsIgnoreCase(master.isCreditAccount)){
                if(this.id == master.id){
                    return true;
                }
            }
        }
        return false;
    }
    
    public static void main(String[] a){
        Set<CustomerAccountMaster> sets = new TreeSet<>();
        CustomerAccountMaster o1 = new CustomerAccountMaster();
        o1.setName("Param");
        sets.add(o1);
        
        CustomerAccountMaster o2 = new CustomerAccountMaster();
        o2.setName("Param");
        sets.add(o2);
        
        CustomerAccountMaster o3 = new CustomerAccountMaster();
        o3.setName("Param");
        sets.add(o3);
        
        System.out.println(sets.size());
    }    

    @Override
    public int compareTo(CustomerAccountMaster obj) {
        if (obj == null) {
            return -1;
        }
        
        if( ! (obj instanceof CustomerAccountMaster) ){
            return -1;
        }
        
        CustomerAccountMaster master = (CustomerAccountMaster) obj;
        
        if(this.name.equalsIgnoreCase(master.name)){
            return 0;
        }
        return -1;
    }
}
