package Conexion;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.swing.JOptionPane;

public class Conexion {

    // 🌐 Datos de Clever Cloud
    private static final String URL = "jdbc:mysql://brqrvozypjmdzitcl9wd-mysql.services.clever-cloud.com:3306/brqrvozypjmdzitcl9wd";
    private static final String USER = "udp4vclzxnl6gk3q";
    private static final String PASSWORD = "jP50rDJN4sAqsu4Lpeky";

    // 🔵 Método para aplicaciones de escritorio (con JOptionPane)
    public static Connection conectar() {
        try {
            Connection cn = DriverManager.getConnection(URL, USER, PASSWORD);
            JOptionPane.showMessageDialog(null, "✅ Conexión exitosa a la base de datos");
            return cn;
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(null, "❌ Error en la conexión: '" + ex.toString() + "'");
        }
        return null;
    }

    // 🔁 Conexión singleton para web
    private static Connection connectionSingleton = null;

    public static Connection getConnection() throws SQLException {
        if (connectionSingleton == null || connectionSingleton.isClosed()) {
            try {
                connectionSingleton = DriverManager.getConnection(URL, USER, PASSWORD);
                System.out.println("✅ Conexión exitosa a la base de datos (Web).");
            } catch (SQLException ex) {
                System.err.println("❌ Error en la conexión a la base de datos (Web): '" + ex.getMessage() + "'");
                ex.printStackTrace();
                throw ex;
            }
        }
        return connectionSingleton;
    }

    // 🔚 Método para cerrar conexión singleton
    public static void closeConnection() {
        if (connectionSingleton != null) {
            try {
                if (!connectionSingleton.isClosed()) {
                    connectionSingleton.close();
                    System.out.println("Conexión a la base de datos (Web) cerrada.");
                }
            } catch (SQLException ex) {
                System.err.println("Error al cerrar la conexión a la base de datos (Web): " + ex.getMessage());
                ex.printStackTrace();
            }
        }
    }

    // 🧪 Métodos de prueba
    public static void main(String[] args) {
        System.out.println("--- Probando conectar() original ---");
        Connection originalCon = Conexion.conectar();
        if (originalCon != null) {
            try {
                originalCon.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        System.out.println("\n--- Probando getConnection() para web ---");
        try {
            Connection webCon = Conexion.getConnection();
            if (webCon != null) {
                System.out.println("Prueba de getConnection() exitosa.");
            }
        } catch (SQLException e) {
            System.err.println("Falló la prueba de getConnection(): " + e.getMessage());
        }
    }
}
