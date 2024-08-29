/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */


import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DerbyToCSVExporter {

    public static void main(String[] args) throws ClassNotFoundException {
        // Database connection URL, username, and password
        
        Class.forName("org.apache.derby.jdbc.ClientDriver");
        
        String url = "jdbc:derby://localhost:1529/avonprodv1"; // Update with your Derby DB path
        String username = ""; // Update if needed
        String password = ""; // Update if needed

        Connection connection = null;

        try {
            // Establish a connection to the database
            connection = DriverManager.getConnection(url);

            // Get metadata to retrieve all table names
            DatabaseMetaData metaData = connection.getMetaData();
            ResultSet tables = metaData.getTables(null, null, "%", new String[]{"TABLE"});

            // Iterate through all tables
            while (tables.next()) {
                try {
                String tableName = tables.getString("TABLE_NAME");
                exportTableToCSV(connection, tableName);
                }catch(Exception e) {
                    System.out.println("Error while exporting table name : " + tables.getString("TABLE_NAME"));
                }
            }

            System.out.println("All tables have been exported successfully.");

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private static void exportTableToCSV(Connection connection, String tableName) {
        String query = "SELECT * FROM " + tableName;
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query);
             FileWriter csvWriter = new FileWriter("/Users/param-logicoy-mac/Downloads/kite_rx/" + tableName + ".csv")) {

            int columnCount = resultSet.getMetaData().getColumnCount();

            // Write header
            for (int i = 1; i <= columnCount; i++) {
                csvWriter.append(resultSet.getMetaData().getColumnName(i));
                if (i < columnCount) {
                    csvWriter.append(",");
                }
            }
            csvWriter.append("\n");

            // Write data
            while (resultSet.next()) {
                for (int i = 1; i <= columnCount; i++) {
                    csvWriter.append(resultSet.getString(i));
                    if (i < columnCount) {
                        csvWriter.append(",");
                    }
                }
                csvWriter.append("\n");
            }

            System.out.println("Table " + tableName + " has been exported to " + tableName + ".csv");

        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
    }
}
