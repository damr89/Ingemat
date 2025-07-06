package DAO; // Asegúrate de que este sea tu paquete DAO

import Modelo.Subproceso; // Importa tu clase Modelo.Subproceso
import Conexion.Conexion; // Importa tu clase Conexion (con 'C' mayúscula)
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SubprocesoDAO {
    private Connection con;

     public SubprocesoDAO() {
        try {
            // ¡CAMBIO CLAVE AQUÍ! Llama a getConnection() en lugar de conectar()
            con = Conexion.getConnection();
        } catch (SQLException e) {
            System.err.println("Error al conectar a la base de datos en SubprocesoDAO: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("No se pudo inicializar SubprocesoDAO debido a un error de conexión", e);
        }
    }

    /**
     * Obtiene una lista de subprocesos filtrados por el ID de formato.
     *
     * @param idFormato El ID del formato al que pertenecen los subprocesos.
     * @return Una lista de objetos Subproceso.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public List<Subproceso> obtenerSubprocesosPorFormato(int idFormato) throws SQLException {
        List<Subproceso> subprocesos = new ArrayList<>();
        // Adapta los nombres de las columnas a tu BD si son diferentes (ej. 'idSubproceso', 'nombreSubproceso')
        String sql = "SELECT idSubproceso, idFormato, nombreSubproceso FROM Subprocesos WHERE idFormato = ? AND estado = 1 ORDER BY nombreSubproceso";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idFormato); // Establece el parámetro idFormato en la consulta
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Subproceso subproceso = new Subproceso();
                    subproceso.setId(rs.getInt("idSubproceso")); // Asume columna 'idSubproceso'
                    subproceso.setIdFormato(rs.getInt("idFormato")); // Asume columna 'idFormato'
                    subproceso.setNombre(rs.getString("nombreSubproceso")); // Asume columna 'nombreSubproceso'
                    subprocesos.add(subproceso);
                }
            }
        }
        return subprocesos;
    }

    /**
     * Agrega un nuevo subproceso a la base de datos.
     *
     * @param subproceso El objeto Subproceso a agregar.
     * @return true si se agregó con éxito, false en caso contrario.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public boolean agregarSubproceso(Subproceso subproceso) throws SQLException {
        String sql = "INSERT INTO Subprocesos (idFormato, nombreSubproceso, estado) VALUES (?, ?, 1)";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, subproceso.getIdFormato());
            ps.setString(2, subproceso.getNombre());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Actualiza un subproceso existente en la base de datos.
     *
     * @param subproceso El objeto Subproceso con los datos actualizados.
     * @return true si se actualizó con éxito, false en caso contrario.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public boolean actualizarSubproceso(Subproceso subproceso) throws SQLException {
        String sql = "UPDATE Subprocesos SET nombreSubproceso = ? WHERE idSubproceso = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, subproceso.getNombre());
            ps.setInt(2, subproceso.getId());
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Deshabilita (cambia el estado a 0) un subproceso por su ID.
     *
     * @param idSubproceso El ID del subproceso a deshabilitar.
     * @return true si se deshabilitó con éxito, false en caso contrario.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public boolean deshabilitarSubproceso(int idSubproceso) throws SQLException {
        String sql = "UPDATE Subprocesos SET estado = 0 WHERE idSubproceso = ? AND estado = 1";
        try (PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, idSubproceso);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        }
    }
}