package DAO;

import Modelo.Formato;
import Conexion.Conexion; // Asegúrate de que esta ruta sea correcta
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FormatoDAO {
    private Connection con;

    public FormatoDAO() {
        try {
            con = Conexion.getConnection();
        } catch (SQLException e) {
            System.err.println("Error al conectar a la base de datos en FormatoDAO: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("No se pudo inicializar FormatoDAO debido a un error de conexión", e);
        }
    }

    public List<Formato> obtenerFormatosPorCategoria(int idCategoria) throws SQLException {
        List<Formato> formatos = new ArrayList<>();
        // Adapta los nombres de las columnas a tu BD
        String sql = "SELECT idFormato, idCategoria, nombreFormato, codigoFormato, precioFormato FROM Formatos WHERE idCategoria = ? AND estado = 1 ORDER BY nombreFormato";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idCategoria);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Formato formato = new Formato();
                    formato.setId(rs.getInt("idFormato"));
                    formato.setIdCategoria(rs.getInt("idCategoria"));
                    formato.setNombre(rs.getString("nombreFormato"));
                    formato.setCodigo(rs.getString("codigoFormato"));
                    formato.setPrecio(rs.getDouble("precioFormato"));
                    formatos.add(formato);
                }
            }
        }
        return formatos;
    }

    public boolean agregarFormato(Formato formato) throws SQLException {
        String sql = "INSERT INTO Formatos (idCategoria, nombreFormato, codigoFormato, precioFormato, estado) VALUES (?, ?, ?, ?, 1)";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, formato.getIdCategoria());
            ps.setString(2, formato.getNombre());
            ps.setString(3, formato.getCodigo());
            ps.setDouble(4, formato.getPrecio());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    public boolean actualizarFormato(Formato formato) throws SQLException {
        String sql = "UPDATE Formatos SET nombreFormato = ?, codigoFormato = ?, precioFormato = ? WHERE idFormato = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, formato.getNombre());
            ps.setString(2, formato.getCodigo());
            ps.setDouble(3, formato.getPrecio());
            ps.setInt(4, formato.getId());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    public boolean deshabilitarFormato(int idFormato) throws SQLException {
        String sql = "UPDATE Formatos SET estado = 0 WHERE idFormato = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idFormato);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }
}