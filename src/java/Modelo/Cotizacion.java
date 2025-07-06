/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Modelo;


public class Cotizacion {
    private int id;
private String motivo;
private String solicitante;
private String rucDni;
private String ubicacion;
private String fecha;
private String tipoCliente;
private String tiempoEjecucion;
private String formaPago;
private String tipoMoneda;


// Getters y Setters
public int getId() { return id; }
public void setId(int id) { this.id = id; }

public String getMotivo() { return motivo; }
public void setMotivo(String motivo) { this.motivo = motivo; }

public String getSolicitante() { return solicitante; }
public void setSolicitante(String solicitante) { this.solicitante = solicitante; }

public String getRucDni() { return rucDni; }
public void setRucDni(String rucDni) { this.rucDni = rucDni; }

public String getUbicacion() { return ubicacion; }
public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

public String getFecha() { return fecha; }
public void setFecha(String fecha) { this.fecha = fecha; }

public String getTipoCliente() { return tipoCliente; }
public void setTipoCliente(String tipoCliente) { this.tipoCliente = tipoCliente; }

public String getTiempoEjecucion() { return tiempoEjecucion; }
public void setTiempoEjecucion(String tiempoEjecucion) { this.tiempoEjecucion = tiempoEjecucion; }

public String getFormaPago() { return formaPago; }
public void setFormaPago(String formaPago) { this.formaPago = formaPago; }

public String getTipoMoneda() { return tipoMoneda; }
public void setTipoMoneda(String tipoMoneda) { this.tipoMoneda = tipoMoneda; }

    
}