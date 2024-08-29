/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.connection;

import java.sql.Connection;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.sql.DataSource;

/**
 *
 * @author paramjeet
 */
//@Component
public class DbConnection {

    private static final Logger logger = Logger.getLogger(DbConnection.class.getName());
    private Connection dbCon = null;
    private DataSource bpelDBSource = null;

    public Connection getDbConnection() {

        try {
            String dbName = "jdbc/bpelseNonXA";
            InitialContext context = new InitialContext();
            bpelDBSource = (DataSource) context.lookup(dbName);
            dbCon = bpelDBSource.getConnection();
        } catch (Exception ex) {
            Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
        }

        return dbCon;
    }

    public DataSource getDataSource(String jndiName) {
        try {
            String dbName = jndiName;
            InitialContext context = new InitialContext();
            bpelDBSource = (DataSource) context.lookup(dbName);
            // dbCon = bpelDBSource.getConnection();
        } catch (Exception ex) {
            Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
        }

        return bpelDBSource;
    }

    public static Connection getDbConnection(String jndiName) {
         Connection dCon=null;
        try {
            InitialContext context = new InitialContext();
            DataSource  dbSource = (DataSource) context.lookup(jndiName);
            dCon = dbSource.getConnection();
        } catch (Exception ex) {
            Logger.getLogger(DbConnection.class.getName()).log(Level.SEVERE, null, ex);
        }

        return dCon;
    }
}
