/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Modelo;

/**
 *
 * @author milag
 */
public class OrdenServicio {
  
  private int id;
    private int idCoti;
    private String fechaOrden;
    private String estado;
    private String observaciones;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getIdCoti() { return idCoti; }
    public void setIdCoti(int idCoti) { this.idCoti = idCoti; }

    public String getFechaOrden() { return fechaOrden; }
    public void setFechaOrden(String fechaOrden) { this.fechaOrden = fechaOrden; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    
}
