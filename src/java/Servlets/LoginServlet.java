package Servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String usuario = request.getParameter("usuario");
        String clave = request.getParameter("clave");

        if ((usuario.equals("LoisGallardo") && clave.equals("INGEMAT2025")) ||
            (usuario.equals("admin") && clave.equals("1234"))) {

            HttpSession sesion = request.getSession();
            sesion.setAttribute("usuario", usuario);

            // ✅ Redirigir a la página deseada
            response.sendRedirect("S_Registrados.jsp");

        } else {
            response.sendRedirect("Login.html?error=1");
        }
    }
}
