/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.param.medicalapp.kiterx.kiterx.controller;

import com.sun.mail.pop3.POP3SSLStore;
import java.text.SimpleDateFormat;
import java.util.Properties;
import java.util.Vector;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.Store;
import javax.mail.URLName;

/**
 *
 * @author Param
 */
public class EmailQueueDataInserter {

    private static final Logger LOGGER = Logger.getLogger("EmailQueueDataInserter");

    private final SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");

    private volatile int requestSize = 0;

    Thread dataPusher = null;
    
    final String username = "paramjeetsinghbawa@gmail.com";
    final String password = "PNB$2379241";
    
    public boolean sendMail(String to, String subject, 
            String content, String filePath, String cC) throws MessagingException {
        boolean status = false;
        final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

        //Get the session object  
        Properties props = System.getProperties();
        // props.setProperty("mail.smtp.host", "smtp.gmail.com");
        props.setProperty("mail.smtp.host", "smtp.office365.com");
        // props.setProperty("mail.smtp.socketFactory.class", SSL_FACTORY);
        // props.setProperty("mail.smtp.socketFactory.fallback", "false");
        // props.setProperty("mail.smtp.port", "465");
        // props.setProperty("mail.smtp.socketFactory.port", "465");
        props.setProperty("mail.smtp.port", "587");
        //props.setProperty("mail.smtp.socketFactory.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.debug", "true");
        //props.put("mail.store.protocol", "pop3");
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.starttls.enable", "true");
        Session session = Session.getDefaultInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("paramjeet.singh@logicoy.com", "param237924");
            }
        });
        try {
            
            
            
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            if(cC != null && !(cC.isEmpty())) {
                message.addRecipients(Message.RecipientType.CC, cC);
            }
            
            //message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setRecipients(javax.mail.Message.RecipientType.TO, javax.mail.internet.InternetAddress.parse(to, false));
            message.setSubject(subject);

            if (filePath != null && filePath.trim().length() > 0) {
                MimeBodyPart mbp1 = new MimeBodyPart();
                //mbp1.setText(content,"UTF-8","text/html");
                mbp1.setContent(content, "text/html");

                String[] pathArr = filePath.split(",");

                Multipart mp = new MimeMultipart();

                mp.addBodyPart(mbp1);
                
                for (String path : pathArr) {
                    MimeBodyPart mbp2 = new MimeBodyPart();
                    FileDataSource fds = new FileDataSource(path);
                    mbp2.setDataHandler(new DataHandler(fds));
                    String fileName = fds.getName();
                    LOGGER.info("filename is: " + fileName);
                    mbp2.setFileName(fileName);
                    mp.addBodyPart(mbp2);
                }
                message.setContent(mp);
            } else {
                message.setContent(content, "text/html");
            }
            // Send message  
            Transport.send(message);
            LOGGER.info("message sent successfully....");
            status = true;

        } catch (MessagingException mex) {
            LOGGER.info(mex.toString());
        }
        return status;
    }

    private boolean sendMailToMultipleRecipent(String from, String password, String[] EmailTo, String subject, String content) {
        boolean status = false;
        final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

        //Get the session object  
        Properties props = System.getProperties();
        //props.setProperty("mail.smtp.host", "smtp.office365.com");
        props.setProperty("mail.smtp.host", "smtp.office365.com");
        //props.setProperty("mail.smtp.socketFactory.class", SSL_FACTORY);
        // props.setProperty("mail.smtp.socketFactory.fallback", "false");
        // props.setProperty("mail.smtp.port", "465");
        // props.setProperty("mail.smtp.socketFactory.port", "465");
        props.setProperty("mail.smtp.port", "587");
        //props.setProperty("mail.smtp.socketFactory.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.debug", "true");
        //props.put("mail.store.protocol", "pop3");
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.starttls.enable", "true");
        Session session = Session.getDefaultInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        //compose the message  
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            int counter = 0;
            InternetAddress[] recipientAddress = new InternetAddress[EmailTo.length];
            for (String recipient : EmailTo) {
                recipientAddress[counter] = new InternetAddress(recipient.trim());
                counter++;
            }
            message.setRecipients(Message.RecipientType.CC, recipientAddress);
            message.setSubject(subject);
            message.setContent(content, "text/html");

            // Send message  
            Transport.send(message);
            LOGGER.info("message sent successfully....");
            status = true;
        } catch (MessagingException mex) {
            LOGGER.info(mex.toString());
        }
        return status;
    }

}
