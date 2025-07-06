/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package Servlets;
import Modelo.OrdenServicio;
import DAO.OrdenServicioDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
/**
 *
 * @author milag
 */
@WebServlet("/OrdenServicioServlet")
public class OrdenServicioServlet extends HttpServlet{
 
  @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        int idCoti = Integer.parseInt(request.getParameter("id_coti")); // pasado desde formulario oculto
        String fechaOrden = request.getParameter("fecha_orden");
        String estado = request.getParameter("estado");
        String observaciones = request.getParameter("observaciones");

        OrdenServicio orden = new OrdenServicio();
        orden.setIdCoti(idCoti);
        orden.setFechaOrden(fechaOrden);
        orden.setEstado(estado);
        orden.setObservaciones(observaciones);

        OrdenServicioDAO dao = new OrdenServicioDAO();
        dao.guardar(orden);

        response.sendRedirect("Factura.html"); // luego de generar orden, ir a factura
    }
    
}
