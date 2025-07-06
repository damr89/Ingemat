package Servlets;

import Modelo.Cotizacion;
import DAO.CotizacionDAO;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/CotizacionServlet")
public class CotizacionServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Capturar acción del botón (guardar, generar u orden)
        String accion = request.getParameter("accion");

        // Crear y llenar objeto Cotizacion
        Cotizacion c = new Cotizacion();
        c.setMotivo(request.getParameter("motivo"));
        c.setSolicitante(request.getParameter("solicitante"));
        c.setRucDni(request.getParameter("rucDni"));
        c.setUbicacion(request.getParameter("ubicacion"));
        c.setFecha(request.getParameter("fecha"));
        c.setTipoCliente(request.getParameter("tipoCliente"));
        c.setTiempoEjecucion(request.getParameter("tiempoEjecucion"));
        c.setFormaPago(request.getParameter("formaPago"));
        c.setTipoMoneda(request.getParameter("tipoMoneda"));

        // Validación básica
        if (c.getMotivo() == null || c.getMotivo().trim().isEmpty() ||
            c.getSolicitante() == null || c.getSolicitante().trim().isEmpty()) {
            response.sendRedirect("error.html");
            return;
        }

        // Capturar servicios seleccionados
        String[] serviciosSeleccionados = request.getParameterValues("servicios");
        List<Integer> listaServicios = new ArrayList<>();
        if (serviciosSeleccionados != null) {
            for (String servicioId : serviciosSeleccionados) {
                try {
                    listaServicios.add(Integer.parseInt(servicioId));
                } catch (NumberFormatException e) {
                    e.printStackTrace();
                }
            }
        }

        // Guardar con transacción
        CotizacionDAO dao = new CotizacionDAO();
        boolean exito = dao.guardarConDetalles(c, listaServicios);

        // 👉 Manejo especial para petición desde fetch() (orden de servicio)
        if ("orden".equals(accion)) {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            if (exito) {
                String json = "{\"idCotizacion\":" + c.getId() + "}";
                response.getWriter().write(json);
            } else {
                response.getWriter().write("{\"error\":true}");
            }
            return;
        }

        // Redirección normal para guardar o generar
        switch (accion) {
            case "guardar":
                if (exito) {
                    response.sendRedirect("exito.html");
                } else {
                    response.sendRedirect("error.html");
                }
                break;

            case "generar":
                if (exito) {
                    response.sendRedirect("generar_cotizacion.jsp");
                } else {
                    response.sendRedirect("error.html");
                }
                break;
            case "orden":
                    // ya manejado arriba como JSON
                break;

            default:
                response.sendRedirect("error.html");
        }
    }
}
