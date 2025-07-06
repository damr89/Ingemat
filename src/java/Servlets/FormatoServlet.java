package Servlets; // Asegúrate de que este sea tu paquete de servlets

import Modelo.Formato;
import DAO.FormatoDAO;
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

@WebServlet("/api/formatos") // ¡URL API para este servlet!
public class FormatoServlet extends HttpServlet {

    private FormatoDAO formatoDAO;
    private Gson gson = new Gson();

    @Override
    public void init() throws ServletException {
        try {
            formatoDAO = new FormatoDAO();
        } catch (RuntimeException e) {
            System.err.println("Error al inicializar FormatoDAO en Servlet: " + e.getMessage());
            e.printStackTrace();
            throw new ServletException("Fallo al inicializar FormatoServlet", e);
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // --- Petición GET: Obtener formatos por idCategoria ---
    // URL esperada: /INGEMAT_1/api/formatos?idCategoria=X
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String idCategoriaParam = request.getParameter("idCategoria");
        if (idCategoriaParam == null || idCategoriaParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
            out.print(gson.toJson(new ErrorResponse("ID de categoría no proporcionado para buscar formatos.")));
            out.flush();
            return;
        }

        try {
            int idCategoria = Integer.parseInt(idCategoriaParam);
            List<Formato> formatos = formatoDAO.obtenerFormatosPorCategoria(idCategoria);
            out.print(gson.toJson(formatos));
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            out.print(gson.toJson(new ErrorResponse("ID de categoría inválido.")));
            System.err.println("NumberFormat Error en FormatoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al obtener formatos: " + e.getMessage())));
            System.err.println("SQL Error en FormatoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print(gson.toJson(new ErrorResponse("Error inesperado al obtener formatos: " + e.getMessage())));
            System.err.println("General Error en FormatoServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición POST: Agregar un nuevo formato ---
    // El cuerpo debe ser JSON: {"idCategoria": 1, "nombre": "Formato A", "codigo": "F-001", "precio": 100.50}
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Formato nuevoFormato = gson.fromJson(request.getReader(), Formato.class);

            // Validaciones
            if (nuevoFormato == null || nuevoFormato.getIdCategoria() == 0 || nuevoFormato.getNombre() == null || nuevoFormato.getNombre().trim().isEmpty() || nuevoFormato.getCodigo() == null || nuevoFormato.getCodigo().trim().isEmpty() || nuevoFormato.getPrecio() < 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("Datos de formato incompletos o inválidos.")));
                return;
            }

            boolean exito = formatoDAO.agregarFormato(nuevoFormato);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201
                out.print(gson.toJson(new MessageResponse("Formato agregado con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
                out.print(gson.toJson(new ErrorResponse("No se pudo agregar el formato a la base de datos.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al agregar formato: " + e.getMessage())));
            System.err.println("SQL Error en FormatoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en FormatoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición POST de formato: " + e.getMessage())));
            System.err.println("General Error en FormatoServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición PUT: Actualizar un formato existente ---
    // El cuerpo debe ser JSON: {"id": 1, "idCategoria": 1, "nombre": "Formato B", "codigo": "F-002", "precio": 120.00}
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Formato formatoActualizar = gson.fromJson(request.getReader(), Formato.class);

            // Validaciones
            if (formatoActualizar == null || formatoActualizar.getId() == 0 || formatoActualizar.getIdCategoria() == 0 || formatoActualizar.getNombre() == null || formatoActualizar.getNombre().trim().isEmpty() || formatoActualizar.getCodigo() == null || formatoActualizar.getCodigo().trim().isEmpty() || formatoActualizar.getPrecio() < 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("Datos de formato incompletos o inválidos para actualizar.")));
                return;
            }

            boolean exito = formatoDAO.actualizarFormato(formatoActualizar);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK); // 200
                out.print(gson.toJson(new MessageResponse("Formato actualizado con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 si no se encontró
                out.print(gson.toJson(new ErrorResponse("No se encontró el formato para actualizar o no hubo cambios.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al actualizar formato: " + e.getMessage())));
            System.err.println("SQL Error en FormatoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en FormatoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición PUT de formato: " + e.getMessage())));
            System.err.println("General Error en FormatoServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición DELETE: Deshabilitar un formato ---
    // URL esperada: /INGEMAT_1/api/formatos?id=X
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
                out.print(gson.toJson(new ErrorResponse("ID de formato no proporcionado para deshabilitar.")));
                return;
            }
            int idFormato = Integer.parseInt(idParam);

            boolean exito = formatoDAO.deshabilitarFormato(idFormato);

            if (exito) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // 204
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404
                out.print(gson.toJson(new ErrorResponse("No se encontró el formato para deshabilitar o ya estaba deshabilitado.")));
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(new ErrorResponse("ID de formato inválido.")));
            System.err.println("NumberFormat Error en FormatoServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al deshabilitar formato: " + e.getMessage())));
            System.err.println("SQL Error en FormatoServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición DELETE de formato: " + e.getMessage())));
            System.err.println("General Error en FormatoServlet.doDelete: " + e.getMessage());
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