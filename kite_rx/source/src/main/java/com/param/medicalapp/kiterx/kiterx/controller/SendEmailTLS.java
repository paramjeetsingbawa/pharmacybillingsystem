/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.controller;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

/**
 *
 * @author Param
 */
public class SendEmailTLS {
    
    
    public static void sendMail(){
    Properties properties = System.getProperties();
    final String USERNAME = "paramjeetsinghbawa@gmail.com";
    final String PASSWORD = "PNB$2379241";

    properties.put("mail.smtp.starttls.enable", "true");
    properties.put("mail.smtp.host", "smtp.gmail.com");
    properties.put("mail.smtp.user", USERNAME);
    properties.put("mail.smtp.password", PASSWORD);
    properties.put("mail.smtp.port", "587");
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.debug", "true");
    //properties.put("mail.debug", "true");

    Session session = Session.getDefaultInstance(properties);
    try {

        MimeMessage mime = new MimeMessage(session);
        mime.setFrom(new InternetAddress(USERNAME));

        mime.setRecipient(Message.RecipientType.TO, new InternetAddress("paramjeet.singh@logicoy.com"));
        mime.setSubject("");
        mime.setText("");
        Transport transport = session.getTransport("smtps");
        transport.connect("smtp.gmail.com", USERNAME, PASSWORD);
        transport.sendMessage(mime, mime.getAllRecipients());
        transport.close();
    } catch (MessagingException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }   
}

    public static void main(String[] args) {

        sendMail();
    }
}
