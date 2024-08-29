/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.connection;

import com.zaxxer.hikari.HikariConfig;

import javax.sql.DataSource;

import com.zaxxer.hikari.HikariDataSource;

/**
 *
 * @author Param
 */
public class ConnectionManager {

    private static HikariDataSource dataSource;
    private static HikariConfig config = new HikariConfig();

    static {
        try {
            config.setJdbcUrl("jdbc:derby://localhost:1529/avonprodv1");
            config.setDriverClassName("org.apache.derby.jdbc.ClientDriver");
            //config.setDataSourceClassName(className);
            //config.setUsername("database_username");
            //config.setPassword("database_password");
            config.addDataSourceProperty("cachePrepStmts", "true");
            config.addDataSourceProperty("prepStmtCacheSize", "250");
            config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
            dataSource = new HikariDataSource(config);

            int minIdleI = 5;
            int maxPoolSizeI = 50;

            dataSource.setMinimumIdle(minIdleI);
            dataSource.setMaximumPoolSize(maxPoolSizeI);//The maximum number of connections, idle or busy, that can be present in the pool.
            //dataSource.setAutoCommit(false);
            dataSource.setLoginTimeout(60);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private ConnectionManager() {
    }

    public DataSource getDataSource() {
        return dataSource;
    }

    /**
     * Singleton Helper, only loads when required
     */
    private static class SingletonHelper {

        private static final ConnectionManager INSTANCE = new ConnectionManager();
    }

    /**
     * Thread safe get Instance implementation
     *
     * @return
     */
    public static synchronized ConnectionManager getConnectionManager() {
        return SingletonHelper.INSTANCE;
    }
}
