/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.param.medicalapp.kiterx.kiterx.dao;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


public class Util {

    public Util() {
    }

    public static String trimNumberCustom(String str) {
        char[] carr = str.toCharArray();
        StringBuilder builder = new StringBuilder();
        for (char c : carr) {
            int i = (int) c;
            if (i >= 48 && i <= 57) {
                builder.append(c);
            } else if (i == 46) {
                builder.append(c);
            }
            //System.out.println(c + " " + (int) (c));
        }
        return builder.toString();
    }

    public static String getUnit(String str) {
        char[] carr = str.toCharArray();
        StringBuilder builder = new StringBuilder();
        for (char c : carr) {
            int i = (int) c;
            if (i >= 48 && i <= 57) {
                //builder.append(c);
            } else if (i == 46) {
                //builder.append(c);
            } else if (i >= 65 && i <= 90) {
                builder.append(c);
            } else if (i >= 97 && i <= 122) {
                builder.append(c);
            }
            System.out.println(c + " " + (int) (c));
        }
        return builder.toString();
    }

    public static void main(String[] args) {
        
    }

    public static void pack(String sourceDirPath, String zipFilePath) throws IOException {
        
        Path p = Files.createFile(Paths.get(zipFilePath));
        try (ZipOutputStream zs = new ZipOutputStream(Files.newOutputStream(p))) {
            Path pp = Paths.get(sourceDirPath);
            Files.walk(pp)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(path -> {
                        ZipEntry zipEntry = new ZipEntry(pp.relativize(path).toString());
                        try {
                            zs.putNextEntry(zipEntry);
                            Files.copy(path, zs);
                            zs.closeEntry();
                        } catch (IOException e) {
                            System.err.println(e);
                        }
                    });
        }
    }
}
