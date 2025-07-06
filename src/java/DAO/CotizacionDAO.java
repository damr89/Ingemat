package DAO;

import Modelo.Cotizacion;
import Conexion.Conexion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.ArrayList;

public class CotizacionDAO {

    public void guardar(Cotizacion c) {
        String sql = "INSERT INTO cotiz_adc (Motivo, Solicitante, DNI_RUC, Ubicacion, Fecha_Coti, Tipo_Cliente, Tiempo_Ejec, Forma_Pago, Tipo_Moneda) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection cn = Conexion.conectar();
             PreparedStatement ps = cn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, c.getMotivo());
            ps.setString(2, c.getSolicitante());
            ps.setString(3, c.getRucDni());
            ps.setString(4, c.getUbicacion());
            ps.setString(5, c.getFecha());
            ps.setString(6, c.getTipoCliente());
            ps.setString(7, c.getTiempoEjecucion());
            ps.setString(8, c.getFormaPago());
            ps.setString(9, c.getTipoMoneda());

            int affectedRows = ps.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        int idGenerado = rs.getInt(1);
                        c.setId(idGenerado); // Actualiza el objeto con el ID generado
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Error al guardar cotización: " + e.getMessage());
            e.printStackTrace();
        }
    }
public void actualizar(Cotizacion c) {
    String sql = "UPDATE cotiz_adc SET Motivo = ?, Solicitante = ?, DNI_RUC = ?, Ubicacion = ?, Fecha_Coti = ?, Tipo_Cliente = ?, Tiempo_Ejec = ?, Forma_Pago = ?, Tipo_Moneda = ? WHERE ID_Coti = ?";
    try (Connection cn = Conexion.conectar(); PreparedStatement ps = cn.prepareStatement(sql)) {
        ps.setString(1, c.getMotivo());
        ps.setString(2, c.getSolicitante());
        ps.setString(3, c.getRucDni());
        ps.setString(4, c.getUbicacion());
        ps.setString(5, c.getFecha());
        ps.setString(6, c.getTipoCliente());
        ps.setString(7, c.getTiempoEjecucion());
        ps.setString(8, c.getFormaPago());
        ps.setString(9, c.getTipoMoneda());
        ps.setInt(10, c.getId());
        ps.executeUpdate();
    } catch (Exception e) {
        e.printStackTrace();
    }
}

    public void guardarDetalleServicio(int idCoti, int idServicio) {
        String sql = "INSERT INTO detalle_cotizacion_servicio (id_cotizacion, id_servicio) VALUES (?, ?)";

        try (Connection cn = Conexion.conectar();
             PreparedStatement ps = cn.prepareStatement(sql)) {

            ps.setInt(1, idCoti);
            ps.setInt(2, idServicio);
            ps.executeUpdate();

        } catch (Exception e) {
            System.err.println("Error al guardar detalle de servicio: " + e.getMessage());
            e.printStackTrace();
        }
    }
public void eliminar(int id) {
    String sql = "DELETE FROM cotiz_adc WHERE ID_Coti = ?";
    try (Connection cn = Conexion.conectar(); PreparedStatement ps = cn.prepareStatement(sql)) {
        ps.setInt(1, id);
        ps.executeUpdate();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
public Cotizacion buscarPorId(int id) {
    String sql = "SELECT * FROM cotiz_adc WHERE ID_Coti = ?";
    try (Connection cn = Conexion.conectar(); PreparedStatement ps = cn.prepareStatement(sql)) {
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            Cotizacion c = new Cotizacion();
            c.setId(rs.getInt("ID_Coti"));
            c.setMotivo(rs.getString("Motivo"));
            // ... setea el resto
            return c;
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return null;
}
public boolean guardarConDetalles(Cotizacion c, List<Integer> listaIdServicios) {
    String sqlCotizacion = "INSERT INTO cotiz_adc (Motivo, Solicitante, DNI_RUC, Ubicacion, Fecha_Coti, Tipo_Cliente, Tiempo_Ejec, Forma_Pago, Tipo_Moneda) " +
                           "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    String sqlDetalle = "INSERT INTO detalle_cotizacion_servicio (id_cotizacion, id_servicio) VALUES (?, ?)";

    try (Connection cn = Conexion.conectar()) {
        cn.setAutoCommit(false); // 🔒 Inicia la transacción

        // 1. Guardar cotización
        try (PreparedStatement psCoti = cn.prepareStatement(sqlCotizacion, Statement.RETURN_GENERATED_KEYS)) {
            psCoti.setString(1, c.getMotivo());
            psCoti.setString(2, c.getSolicitante());
            psCoti.setString(3, c.getRucDni());
            psCoti.setString(4, c.getUbicacion());
            psCoti.setString(5, c.getFecha());
            psCoti.setString(6, c.getTipoCliente());
            psCoti.setString(7, c.getTiempoEjecucion());
            psCoti.setString(8, c.getFormaPago());
            psCoti.setString(9, c.getTipoMoneda());
            psCoti.executeUpdate();

            try (ResultSet rs = psCoti.getGeneratedKeys()) {
                if (rs.next()) {
                    c.setId(rs.getInt(1));
                } else {
                    cn.rollback();
                    return false;
                }
            }
        }

        // 2. Guardar detalles
        try (PreparedStatement psDet = cn.prepareStatement(sqlDetalle)) {
            for (Integer idServicio : listaIdServicios) {
                psDet.setInt(1, c.getId());
                psDet.setInt(2, idServicio);
                psDet.addBatch();
            }
            psDet.executeBatch();
        }

        cn.commit(); // ✅ Todo bien, confirmamos los cambios
        return true;

    } catch (Exception e) {
        e.printStackTrace();
        try (Connection rollbackConn = Conexion.conectar()) {
            rollbackConn.rollback(); // ⚠️ Revertimos si falla algo
        } catch (Exception rollbackEx) {
            rollbackEx.printStackTrace();
        }
        return false;
    }
}

    public List<Cotizacion> listar() {
        List<Cotizacion> lista = new ArrayList<>();
        String sql = "SELECT * FROM cotiz_adc";

        try (Connection cn = Conexion.conectar();
             Statement st = cn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                Cotizacion c = new Cotizacion();
                c.setId(rs.getInt("ID_Coti"));
                c.setMotivo(rs.getString("Motivo"));
                c.setSolicitante(rs.getString("Solicitante"));
                c.setRucDni(rs.getString("DNI_RUC"));
                c.setUbicacion(rs.getString("Ubicacion"));
                c.setFecha(rs.getString("Fecha_Coti"));
                c.setTipoCliente(rs.getString("Tipo_Cliente"));
                c.setTiempoEjecucion(rs.getString("Tiempo_Ejec"));
                c.setFormaPago(rs.getString("Forma_Pago"));
                c.setTipoMoneda(rs.getString("Tipo_Moneda"));
                lista.add(c);
            }

        } catch (Exception e) {
            System.err.println("Error al listar cotizaciones: " + e.getMessage());
            e.printStackTrace();
        }

        return lista;
    }
}
