package Servlets; // Asegúrate de que este sea tu paquete de servlets

import Modelo.Categoria;
import DAO.CategoriaDAO;
import com.google.gson.Gson; // Necesitas la librería GSON
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/categorias") // ¡Esta es la URL que tu frontend JavaScript llamará!
public class CategoriaServlet extends HttpServlet {

    private CategoriaDAO categoriaDAO;
    private Gson gson = new Gson(); // Objeto Gson para convertir a/desde JSON

    @Override
    public void init() throws ServletException {
        // Se inicializa el DAO cuando el servlet se carga.
        // Si hay un problema de conexión a la BD, esto lanzará una excepción
        // y el servlet no se inicializará correctamente.
        try {
            categoriaDAO = new CategoriaDAO();
        } catch (RuntimeException e) { // Captura RuntimeException lanzada por el DAO si la conexión falla
            System.err.println("Error al inicializar CategoriaDAO en Servlet: " + e.getMessage());
            e.printStackTrace();
            throw new ServletException("Fallo al inicializar CategoriaServlet", e);
        }
    }

    // --- Manejo de CORS (Preflight requests para métodos complejos como POST/PUT/DELETE) ---
    // Este método es llamado por el navegador antes de enviar la petición real
    // para verificar si está permitido el acceso cruzado.
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response); // Configura las cabeceras CORS
        response.setStatus(HttpServletResponse.SC_OK); // Responde con 200 OK
    }

    // --- Petición GET: Obtener todas las categorías ---
    // URL esperada: /INGEMAT_1/api/categorias
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response); // Configura las cabeceras CORS
        response.setContentType("application/json"); // Indica que la respuesta es JSON
        response.setCharacterEncoding("UTF-8"); // Codificación de caracteres
        PrintWriter out = response.getWriter(); // Objeto para escribir la respuesta

        try {
            List<Categoria> categorias = categoriaDAO.obtenerTodasCategorias(); // Llama al DAO
            out.print(gson.toJson(categorias)); // Convierte la lista a JSON y la envía
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al obtener categorías: " + e.getMessage())));
            System.err.println("SQL Error en CategoriaServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500 para errores inesperados
            out.print(gson.toJson(new ErrorResponse("Error inesperado al obtener categorías: " + e.getMessage())));
            System.err.println("General Error en CategoriaServlet.doGet: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush(); // Asegura que los datos se envíen
        }
    }

    // --- Petición POST: Agregar una nueva categoría ---
    // El cuerpo de la petición debe ser JSON: {"nombre": "Nuevo Nombre"}
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            // Convierte el cuerpo JSON de la petición a un objeto Categoria
            Categoria nuevaCategoria = gson.fromJson(request.getReader(), Categoria.class);

            // Validaciones básicas
            if (nuevaCategoria == null || nuevaCategoria.getNombre() == null || nuevaCategoria.getNombre().trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
                out.print(gson.toJson(new ErrorResponse("Nombre de categoría no proporcionado o inválido.")));
                return;
            }

            boolean exito = categoriaDAO.agregarCategoria(nuevaCategoria); // Llama al DAO para insertar

            if (exito) {
                response.setStatus(HttpServletResponse.SC_CREATED); // 201 Created
                out.print(gson.toJson(new MessageResponse("Categoría agregada con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
                out.print(gson.toJson(new ErrorResponse("No se pudo agregar la categoría a la base de datos.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al agregar categoría: " + e.getMessage())));
            System.err.println("SQL Error en CategoriaServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) { // Error si el JSON de entrada es inválido
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en CategoriaServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición POST: " + e.getMessage())));
            System.err.println("General Error en CategoriaServlet.doPost: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición PUT: Actualizar una categoría existente ---
    // El cuerpo de la petición debe ser JSON: {"id": 1, "nombre": "Nombre Actualizado"}
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            Categoria categoriaActualizar = gson.fromJson(request.getReader(), Categoria.class);

            // Validaciones básicas
            if (categoriaActualizar == null || categoriaActualizar.getId() == 0 || categoriaActualizar.getNombre() == null || categoriaActualizar.getNombre().trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("Datos de categoría incompletos o inválidos para actualizar.")));
                return;
            }

            boolean exito = categoriaDAO.actualizarCategoria(categoriaActualizar); // Llama al DAO para actualizar

            if (exito) {
                response.setStatus(HttpServletResponse.SC_OK); // 200 OK
                out.print(gson.toJson(new MessageResponse("Categoría actualizada con éxito.")));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 Not Found si no existe o 500
                out.print(gson.toJson(new ErrorResponse("No se encontró la categoría para actualizar o no hubo cambios.")));
            }
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al actualizar categoría: " + e.getMessage())));
            System.err.println("SQL Error en CategoriaServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (com.google.gson.JsonSyntaxException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            out.print(gson.toJson(new ErrorResponse("Formato JSON inválido en la petición: " + e.getMessage())));
            System.err.println("JSON Syntax Error en CategoriaServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición PUT: " + e.getMessage())));
            System.err.println("General Error en CategoriaServlet.doPut: " + e.getMessage());
            e.printStackTrace();
        } finally {
            out.flush();
        }
    }

    // --- Petición DELETE: Deshabilitar una categoría ---
    // URL esperada: /INGEMAT_1/api/categorias?id=X
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String idParam = request.getParameter("id"); // Obtiene el ID del parámetro de la URL
            if (idParam == null || idParam.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
                out.print(gson.toJson(new ErrorResponse("ID de categoría no proporcionado para deshabilitar.")));
                return;
            }
            int idCategoria = Integer.parseInt(idParam);

            boolean exito = categoriaDAO.deshabilitarCategoria(idCategoria); // Llama al DAO para deshabilitar

            if (exito) {
                response.setStatus(HttpServletResponse.SC_NO_CONTENT); // 204 No Content (respuesta sin cuerpo para DELETE exitoso)
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND); // 404 si no se encontró la categoría
                out.print(gson.toJson(new ErrorResponse("No se encontró la categoría para deshabilitar o ya estaba deshabilitada.")));
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 si el ID no es un número
            out.print(gson.toJson(new ErrorResponse("ID de categoría inválido.")));
            System.err.println("NumberFormat Error en CategoriaServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error de base de datos al deshabilitar categoría: " + e.getMessage())));
            System.err.println("SQL Error en CategoriaServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(new ErrorResponse("Error inesperado al procesar la petición DELETE: " + e.getMessage())));
            System.err.println("General Error en CategoriaServlet.doDelete: " + e.getMessage());
            e.printStackTrace();
        } finally {
            // Solo flush si se envió un cuerpo de respuesta (no para 204 No Content)
            if (response.getStatus() != HttpServletResponse.SC_NO_CONTENT) {
                 out.flush();
            }
        }
    }

    // --- Método auxiliar para configurar las cabeceras CORS ---
    private void setCorsHeaders(HttpServletResponse response) {
        // Permite peticiones desde cualquier origen (para desarrollo).
        // En producción, deberías restringir esto a tu dominio frontend específico.
        response.setHeader("Access-Control-Allow-Origin", "*");
        // Métodos HTTP permitidos
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // Cabeceras HTTP permitidas en las peticiones (Content-Type es común para JSON)
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        // Tiempo en segundos que la respuesta de pre-vuelo (OPTIONS) puede ser cacheada
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    // --- Clases internas para representar respuestas JSON ---
    // (Puedes mover estas clases a un paquete separado si las usas en varios servlets)
    private static class MessageResponse {
        String message;
        public MessageResponse(String message) { this.message = message; }
    }

    private static class ErrorResponse {
        String message;
        public ErrorResponse(String message) { this.message = message; }
    }
}