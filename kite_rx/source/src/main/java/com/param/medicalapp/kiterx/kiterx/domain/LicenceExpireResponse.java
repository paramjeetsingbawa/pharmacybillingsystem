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
public class LicenceExpireResponse {
    
    long state;
    String message;

    public long getState() {
        return state;
    }

    public void setState(long state) {
        this.state = state;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    
}
