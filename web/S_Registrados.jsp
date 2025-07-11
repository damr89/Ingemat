<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Obtener la sesión existente, no crear una nueva si no existe
    HttpSession sesion = request.getSession(false);

    // Verificar si la sesión es nula o si el atributo "usuario" no existe
    if (sesion == null || sesion.getAttribute("usuario") == null) {
        // Si no hay sesión válida, redirigir al usuario a la página de login
        response.sendRedirect("Login.html?error=sesion_expirada");
        return; // Detener la ejecución del resto de la página JSP
    }

    // Opcional: Obtener el nombre de usuario de la sesión para mostrarlo en la página
    String usuarioLogueado = (String) sesion.getAttribute("usuario");

    // CABECERAS PARA EVITAR EL CACHÉ DEL NAVEGADOR (importante para el botón "Volver")
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setDateHeader("Expires", 0); // Proxies.
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingemat S.A.C - Servicios Registrados</title>
    <link rel="icon" href="Imagenes/Logo.png" type="image/png">
    <link rel="stylesheet" href="CSS/estilo_menu.css">
    <link rel="stylesheet" href="CSS/barra_izquierda.css">
    <link rel="stylesheet" href="CSS/Diseño_Orden_S.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

    <script>
        window.addEventListener('pageshow', function(event) {
            // event.persisted es true si la página se cargó desde el BF Cache
            if (event.persisted) {
                console.log("DEBUG: Página cargada desde BF Cache. Forzando recarga.");
                window.location.reload(); // Forzar una recarga completa
            }
        });
    </script>
</head>
<body>
    <aside class="barra_izq">
        <div class="barra_izq-icono">
            <img src="Imagenes/Usuario.png" alt="Avatar usuario">
        </div>
        <nav class="barra_izq-menu">
            <ul>
                <li><a href="S_Registrados.jsp" class="active"><i class="fas fa-home"></i>Servicios Registrados</a></li>
                <li><a href="Nueva_Coti.html"><i class="fas fa-file-invoice"></i>Nueva Cotización</a></li>
                <li><a href="Formatos.html"><i class="fas fa-file-alt"></i>Formatos</a></li>
                <%-- Enlace de cerrar sesión que apunta al LogoutServlet --%>
                <li class="Cerrar"><a href="Login.html"><i class="fas fa-sign-out-alt"></i>Cerrar sesión</a></li>
            </ul>
        </nav>
    </aside>

    <main class="Contenido">
        <div class="Barra_buscad">
            <i class="fas fa-search Icono_buscar"></i>
            <input type="text" class="diseño_barra" placeholder="Buscar...">
        </div>

        <section class="filtros">
            <div class="filter-group dropdown">
                <button class="filtro-button" id="statusFilterButton">Estado de servicio <i class="fas fa-chevron-down"></i></button>
                <div class="dropdown-menu filter-dropdown-menu" id="statusDropdown">
                    <a href="#" class="dropdown-item" data-status-value="No confirmado">No confirmado</a>
                    <a href="#" class="dropdown-item" data-status-value="En proceso">En proceso</a>
                    <a href="#" class="dropdown-item" data-status-value="Completado">Completado</a>
                </div>
            </div>

            <div class="filter-group dropdown">
                <button class="filtro-button" id="yearFilterButton">Año <i class="fas fa-chevron-down"></i></button>
                <div class="dropdown-menu filter-dropdown-menu" id="yearDropdown">
                    </div>
            </div>

            <div class="filter-group dropdown">
                <button class="filtro-button" id="monthFilterButton">Mes <i class="fas fa-chevron-down"></i></button>
                <div class="dropdown-menu filter-dropdown-menu" id="monthDropdown">
                    </div>
            </div>

            <button class="filtros-clear" id="clearAllFiltersButton" style="display: none;">Borrar filtros</button>
        </section>

        <section class="Lista_proyectos">
            <article class="project-item project-item--open" data-date="2025-06-15" data-status="No confirmado">
                <div class="project-text-content">
                    <h3 class="project-title">Nombre Proyecto 1</h3>
                    <div class="project-info">
                        <span>Código: 001</span> | <span>Fecha: 15/06/2025</span> | <span>Estado: No confirmado</span>
                    </div>
                </div>
                <div class="project-actions">
                    <div class="dropdown">
                        <button class="action-button more-options-button dropdown-toggle" data-project-id="001"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="dropdown-menu">
                            <a href="Nueva_Coti.html" class="dropdown-item" data-action="cotizacion"><i class="fas fa-file-invoice-dollar"></i> Cotización</a>
                            <a href="Orden_Servicio.html" class="dropdown-item" data-action="orden-servicio"><i class="fas fa-clipboard-list"></i> Orden de servicio</a>
                            <a href="#" class="dropdown-item upload-informe-btn" data-project-code="001" data-action="upload-informe"><i class="fas fa-chart-bar"></i> Subir Informe</a>
                            <a href="Factura.html" class="dropdown-item" data-action="factura"><i class="fas fa-receipt"></i> Factura</a>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-item project-item--warning" data-date="2025-06-10" data-status="En proceso">
                <div class="project-text-content">
                    <h3 class="project-title">Nombre Proyecto 2</h3>
                    <div class="project-info">
                        <span>Código: 002</span> | <span>Fecha: 10/06/2025</span> | <span>Estado: En proceso</span>
                    </div>
                </div>
                <div class="project-actions">
                    <div class="dropdown">
                        <button class="action-button more-options-button dropdown-toggle" data-project-id="002"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item" data-action="cotizacion"><i class="fas fa-file-invoice-dollar"></i> Cotización</a>
                            <a href="#" class="dropdown-item" data-action="orden-servicio"><i class="fas fa-clipboard-list"></i> Orden de servicio</a>
                            <a href="#" class="dropdown-item upload-informe-btn" data-project-code="002" data-action="upload-informe"><i class="fas fa-chart-bar"></i> Subir Informe</a>
                            <a href="#" class="dropdown-item" data-action="factura"><i class="fas fa-receipt"></i> Factura</a>
                        </div>
                    </div>
                </div>
            </article>

            <article class="project-item project-item--completed" data-date="2025-01-01" data-status="Completado">
                <div class="project-text-content">
                    <h3 class="project-title">Nombre Proyecto 3</h3>
                    <div class="project-info">
                        <span>Código: 004</span> | <span>Fecha: 01/06/2025</span> | <span>Estado: Completado</span>
                    </div>
                </div>
                <div class="project-actions">
                    <div class="dropdown">
                        <button class="action-button more-options-button dropdown-toggle" data-project-id="004"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item" data-action="cotizacion"><i class="fas fa-file-invoice-dollar"></i> Cotización</a>
                            <a href="#" class="dropdown-item" data-action="orden-servicio"><i class="fas fa-clipboard-list"></i> Orden de servicio</a>
                            <a href="#" class="dropdown-item upload-informe-btn" data-project-code="004" data-action="upload-informe"><i class="fas fa-chart-bar"></i> Subir Informe</a>
                            <a href="#" class="dropdown-item" data-action="factura"><i class="fas fa-receipt"></i> Factura</a>
                        </div>
                    </div>
                </div>
            </article>
        </section>
    </main>

    <input type="file" id="fileInput" style="display: none;" />

    <script src="JS/Filtro.js"></script>
    <script src="JS/Opciones_Proyect.js"></script>
</body>
</html>
