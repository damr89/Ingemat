// JS/upload_informe.js

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    let currentOpenDropdown = null; // Variable para almacenar la referencia al menú abierto

    document.body.addEventListener('click', (event) => {
        const uploadButton = event.target.closest('.upload-informe-btn');
        const moreOptionsButton = event.target.closest('.more-options-button'); // Obtener el botón de los 3 puntos

        // Lógica para abrir/cerrar los dropdowns existentes (si no la tienes ya en filtro.js)
        if (moreOptionsButton) {
            const dropdownMenu = moreOptionsButton.nextElementSibling;
            // Cierra cualquier otro dropdown abierto
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('active');
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                }
            });

            // Alterna la visibilidad del dropdown clicado
            dropdownMenu.classList.toggle('active');
            if (dropdownMenu.classList.contains('active')) {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                currentOpenDropdown = dropdownMenu; // Almacena el dropdown que se acaba de abrir
            } else {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                currentOpenDropdown = null; // No hay dropdown abierto
            }
        } else if (uploadButton) { // Si se hizo clic en "Subir Informe"
            event.preventDefault(); // Evita el comportamiento por defecto del enlace

            const projectCode = uploadButton.dataset.projectCode;
            console.log(`Abriendo explorador de archivos para el Proyecto: ${projectCode}`);

            // Guarda el menú desplegable actual antes de abrir el explorador de archivos
            // 'uploadButton' está dentro de 'dropdown-menu', así que buscamos su padre
            currentOpenDropdown = uploadButton.closest('.dropdown-menu');

            // Activa el input de tipo file oculto
            fileInput.click();

            // Opcional: Si quieres hacer algo cuando se selecciona un archivo
            fileInput.onchange = (e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                    console.log(`Archivo seleccionado para el Proyecto ${projectCode}:`, selectedFile.name);
                    // Aquí podrías enviar el archivo a un servidor, mostrar su nombre, etc.
                }
                // Limpia el valor del input file para que el evento 'change' se dispare
                // si se selecciona el mismo archivo de nuevo
                fileInput.value = '';

                // Importante: Vuelve a abrir el dropdown después de la selección (o cancelación)
                if (currentOpenDropdown) {
                    currentOpenDropdown.classList.add('active'); // Asegura la clase active
                    currentOpenDropdown.style.opacity = '1';
                    currentOpenDropdown.style.visibility = 'visible';
                }
            };
        } else {
            // Si el clic no fue en un botón de los 3 puntos ni en un ítem "Subir Informe", cierra los dropdowns
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
            currentOpenDropdown = null; // No hay dropdown abierto
        }
    });

    // Asegúrate de que el clic fuera del dropdown lo cierre
    document.addEventListener('click', function(event) {
        // Excluye los clics dentro de cualquier dropdown o en los botones de "más opciones"
        const isClickInsideDropdown = event.target.closest('.dropdown-menu');
        const isClickOnToggle = event.target.closest('.dropdown-toggle');
        
        if (!isClickInsideDropdown && !isClickOnToggle) {
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                menu.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
            currentOpenDropdown = null;
        }
    });
});