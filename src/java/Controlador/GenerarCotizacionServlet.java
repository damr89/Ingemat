/*@WebServlet("/GenerarCotizacionServlet")
public class GenerarCotizacionServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Datos del formulario
        String cliente = request.getParameter("cliente");
        String servicio = request.getParameter("servicio");
        String precio = request.getParameter("precio");

        // Configurar tipo de respuesta PDF
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"cotizacion.pdf\"");

        try {
            OutputStream out = response.getOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Contenido del PDF
            document.add(new Paragraph("COTIZACIÓN"));
            document.add(new Paragraph("Cliente: " + cliente));
            document.add(new Paragraph("Servicio: " + servicio));
            document.add(new Paragraph("Precio: S/." + precio));
            document.add(new Paragraph("Fecha: " + new Date().toString()));

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
    }
}
*/