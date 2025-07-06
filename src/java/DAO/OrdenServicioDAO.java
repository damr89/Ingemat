/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO;

import Modelo.OrdenServicio;
import java.sql.Connection;
import java.sql.PreparedStatement;
import Conexion.conexion;
/**
 *
 * @author milag
 */
public class OrdenServicioDAO {
    
  public void guardar(OrdenServicio orden) {
        try (Connection cn = conexion.conectar()) {
            String sql = "INSERT INTO orden_servicio (id_coti, fecha_orden, estado, observaciones) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = cn.prepareStatement(sql);
            ps.setInt(1, orden.getIdCoti());
            ps.setString(2, orden.getFechaOrden());
            ps.setString(3, orden.getEstado());
            ps.setString(4, orden.getObservaciones());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
