package DAO;

import Modelo.Categoria;
import Conexion.Conexion; // Asegúrate de que esta ruta sea correcta
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CategoriaDAO {
    private Connection con;

    public CategoriaDAO() {
        try {
            con = Conexion.getConnection(); // Obtiene la conexión desde tu clase Conexion
        } catch (SQLException e) {
            System.err.println("Error al conectar a la base de datos en CategoriaDAO: " + e.getMessage());
            e.printStackTrace();
            // Considera lanzar una RuntimeException o manejar el error de otra forma
        }
    }

    // Método para obtener todas las categorías activas
    public List<Categoria> obtenerTodasCategorias() throws SQLException {
        List<Categoria> categorias = new ArrayList<>();
        // Asume una tabla 'categorias' con columnas 'idCategoria', 'nombreCategoria' y 'estado'
        String sql = "SELECT idCategoria, nombreCategoria FROM Categorias WHERE estado = 1 ORDER BY nombreCategoria";
        try (PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Categoria categoria = new Categoria();
                categoria.setId(rs.getInt("idCategoria"));
                categoria.setNombre(rs.getString("nombreCategoria"));
                categorias.add(categoria);
            }
        }
        return categorias;
    }

    // Método para agregar una nueva categoría
    public boolean agregarCategoria(Categoria categoria) throws SQLException {
        // Asume que idCategoria es auto-incremental en la BD
        String sql = "INSERT INTO Categorias (nombreCategoria, estado) VALUES (?, 1)"; // 'estado' para habilitada
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, categoria.getNombre());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    // Método para actualizar una categoría existente
    public boolean actualizarCategoria(Categoria categoria) throws SQLException {
        String sql = "UPDATE Categorias SET nombreCategoria = ? WHERE idCategoria = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, categoria.getNombre());
            ps.setInt(2, categoria.getId());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    // Método para deshabilitar una categoría (cambiar su estado a inactivo)
    public boolean deshabilitarCategoria(int idCategoria) throws SQLException {
        String sql = "UPDATE Categorias SET estado = 0 WHERE idCategoria = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idCategoria);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    // Cierra la conexión cuando el DAO ya no sea necesario (opcional, si manejas conexiones por request)
    public void closeConnection() {
        try {
            if (con != null && !con.isClosed()) {
                con.close();
            }
        } catch (SQLException e) {
            System.err.println("Error al cerrar la conexión en CategoriaDAO: " + e.getMessage());
            e.printStackTrace();
        }
    }
}