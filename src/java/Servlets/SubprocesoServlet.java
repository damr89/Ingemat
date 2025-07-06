package Servlets; // Asegúrate de que este sea tu paquete de servlets

import Modelo.Subproceso;
import DAO.SubprocesoDAO; // Asegúrate de que esta importación sea correcta
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/subprocesos") // ¡URL API para este servlet!
public class SubprocesoServlet extends HttpServlet {

    private SubprocesoDAO subprocesoDAO; // <<-- ¡Aquí está la instancia correcta del DAO!
    private Gson gson = new Gson();

    @Override
    public void init() throws ServletException {
        try {
            subprocesoDAO = new SubprocesoDAO(); // <<-- Se inicializa 'subprocesoDAO'
        } catch (RuntimeException e) {
            System.err.println("Error al inicializar SubprocesoDAO en Servlet: " + e.getMessage());
            e.printStackTrace();
            throw new ServletException("Fallo al inicializar SubprocesoServlet", e);
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // --- Petición GET: Obtener subprocesos por idFormato ---
    // URL esperada: /INGEMAT_1/api/subprocesos?idFormato=X
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String idFormatoParam = request.getParameter("idFormato");
        if (idFormatoParam == null || idFormatoParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            out.print(gson.toJson(new ErrorResponse("ID de formato no proporcionado para buscar subprocesos.")));
            out.flush();
            return;
        }

        try {
            int idFormato = Integer.parseInt(idFormatoParam);
            // <<-- CAMBIO AQUÍ: Usar 'subprocesoDAO' en lugar de 'subprocesoQBO'
            List<Subproceso> subprocesos = subprocesoDAO.obtenerSubprocesosPorFormato(idFormato);
            out.print(gson.toJson(subprocesos));
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            out.print(gson.toJson(new ErrorResponse("ID de formato inválido.")));
            System.err.println("NumberFormat Error en SubprocesoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al obtener subprocesos: " + e.getMessage())));
            System.err.println("SQL Error en SubprocesoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print(gson.toJson(new ErrorResponse("Error inesperado al obtener subprocesos: " + e.getMessage())));
            System.err.println("General Error en SubprocesoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición POST: Agregar un nuevo subproceso ---
    // El cuerpo debe ser JSON: {"idFormato": 1, "nombre": "Subproceso X"}
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Subproceso nuevoSubproceso = gson.fromJson(request.getReader(), Subproceso.class);

            // Validaciones
            if (nuevoSubproceso == null || nuevoSubproceso.getIdFormato() == 0 || nuevoSubproceso.getNombre() == null || nuevoSubproceso.getNombre().trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("Datos de subproceso incompletos o inválidos.")));
                return;
            }

            boolean exito = subprocesoDAO.agregarSubproceso(nuevoSubproceso); // <<-- Usar 'subprocesoDAO'

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201
                out.print(gson.toJson(new MessageResponse("Sub Proceso agregado con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
                out.print(gson.toJson(new ErrorResponse("No se pudo agregar el sub proceso a la base de datos.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al agregar sub proceso: " + e.getMessage())));
            System.err.println("SQL Error en SubprocesoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en SubprocesoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición POST de sub proceso: " + e.getMessage())));
            System.err.println("General Error en SubprocesoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición PUT: Actualizar un subproceso existente ---
    // El cuerpo debe ser JSON: {"id": 1, "idFormato": 1, "nombre": "Subproceso Y"}
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Subproceso subprocesoActualizar = gson.fromJson(request.getReader(), Subproceso.class);

            // Validaciones
            if (subprocesoActualizar == null || subprocesoActualizar.getId() == 0 || subprocesoActualizar.getNombre() == null || subprocesoActualizar.getNombre().trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("Datos de sub proceso incompletos o inválidos para actualizar.")));
                return;
            }

            boolean exito = subprocesoDAO.actualizarSubproceso(subprocesoActualizar); // <<-- Usar 'subprocesoDAO'

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK); // 200
                out.print(gson.toJson(new MessageResponse("Sub Proceso actualizado con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
                out.print(gson.toJson(new ErrorResponse("No se encontró el sub proceso para actualizar o no hubo cambios.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al actualizar sub proceso: " + e.getMessage())));
            System.err.println("SQL Error en SubprocesoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en SubprocesoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición PUT de sub proceso: " + e.getMessage())));
            System.err.println("General Error en SubprocesoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición DELETE: Deshabilitar un subproceso ---
    // URL esperada: /INGEMAT_1/api/subprocesos?id=X
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String idParam = request.getParameter("id");
            if (idParam == null || idParam.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("ID de sub proceso no proporcionado para deshabilitar.")));
                return;
            }
            int idSubproceso = Integer.parseInt(idParam);

            boolean exito = subprocesoDAO.deshabilitarSubproceso(idSubproceso); // <<-- Usar 'subprocesoDAO'

            if (exito) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // 204
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
                out.print(gson.toJson(new ErrorResponse("No se encontró el sub proceso para deshabilitar o ya estaba deshabilitado.")));
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("ID de sub proceso inválido.")));
            System.err.println("NumberFormat Error en SubprocesoServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al deshabilitar sub proceso: " + e.getMessage())));
            System.err.println("SQL Error en SubprocesoServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición DELETE de sub proceso: " + e.getMessage())));
            System.err.println("General Error en SubprocesoServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (response.getStatus() != HttpServletResponse.SC_NO_CONTENT) {
                 out.flush();
            }
        }
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    private static class MessageResponse {
        String message;
        public MessageResponse(String message) { this.message = message; }
    }

    private static class ErrorResponse {
        String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}