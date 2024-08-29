/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.param.medicalapp.kiterx.kiterx.dao;

import java.sql.Connection;
import java.sql.DriverManager;

/**
 *
 * @author param-logicoy-mac
 */
public class JDBCExample {
    
    public static void main(String[] a) { 
        
        String dbURL = "jdbc:derby://localhost:1527/myDB;create=true;user=me;password=mine";
        
        try
        {
            Class.forName("org.apache.derby.jdbc.ClientDriver").newInstance();
            //Get a connection
            Connection conn = DriverManager.getConnection(dbURL); 
        }
        catch (Exception except)
        {
            except.printStackTrace();
        }
        
    }
    
}
