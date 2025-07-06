/*import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/FormServlet")
public class FormServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        String usuario = request.getParameter("usuario");
        String clave = request.getParameter("clave");

        // Validación básica
        if (usuario.equals("admin") && clave.equals("123")) {
            // Usuario válido → redirige a otra pantalla
            response.sendRedirect("Nueva_Coti.html");
        } else {
            // Usuario inválido → redirige al login otra vez
            response.sendRedirect("Login.html");
        }
    }
}*/