/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.vivsoft.model;

/**
 *
 * @author Param
 */
public class ApplicationConfiguration {
    
    
    String backupZipLocation;
    String backupDbSrcLibLocation;
    String exportFileLocation;
    
    String createdAt;
    
    public String getBackupZipLocation() {
        return backupZipLocation;
    }

    public void setBackupZipLocation(String backupZipLocation) {
        this.backupZipLocation = backupZipLocation;
    }

    public String getBackupDbSrcLibLocation() {
        return backupDbSrcLibLocation;
    }

    public void setBackupDbSrcLibLocation(String backupDbSrcLibLocation) {
        this.backupDbSrcLibLocation = backupDbSrcLibLocation;
    }

    public String getExportFileLocation() {
        return exportFileLocation;
    }

    public void setExportFileLocation(String exportFileLocation) {
        this.exportFileLocation = exportFileLocation;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
    
    
    
    
}
