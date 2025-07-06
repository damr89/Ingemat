document.addEventListener('DOMContentLoaded', () => {
    // Referencias para los filtros
    const statusFilterButton = document.getElementById('statusFilterButton');
    const statusDropdown = document.getElementById('statusDropdown');
    const statusDropdownItems = statusDropdown.querySelectorAll('.dropdown-item');
    const statusFilterGroup = statusFilterButton.closest('.filter-group'); // Obtener el grupo de filtro padre

    const yearFilterButton = document.getElementById('yearFilterButton');
    const yearDropdown = document.getElementById('yearDropdown');
    const yearFilterGroup = yearFilterButton.closest('.filter-group'); // Obtener el grupo de filtro padre


    const monthFilterButton = document.getElementById('monthFilterButton');
    const monthDropdown = document.getElementById('monthDropdown');
    const monthFilterGroup = monthFilterButton.closest('.filter-group'); // Obtener el grupo de filtro padre


    const clearAllFiltersButton = document.getElementById('clearAllFiltersButton');
    const projectItems = document.querySelectorAll('.project-item');

    // Objeto para llevar el control de los filtros activos
    const activeFilters = {
        status: null,
        year: null,
        month: null
    };

    // Nombres de los meses para generar dinámicamente
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // --- Funciones de utilidad ---

    function updateClearAllButtonVisibility() {
        const hasActiveFilter = Object.values(activeFilters).some(filter => filter !== null);
        clearAllFiltersButton.style.display = hasActiveFilter ? 'inline-block' : 'none';
    }

    /**
     * Actualiza el estado visual de un botón de filtro (activo/inactivo, texto y botón de borrar).
     * @param {HTMLElement} button - El botón principal del filtro (ej. statusFilterButton).
     * @param {boolean} isActive - True si el filtro está activo, false si está inactivo.
     * @param {string|null} textContent - El texto a mostrar en el botón cuando está activo (ej. "Estado: Completado"). Si es null, se restaura el texto original.
     * @param {string|null} originalIconClass - La clase CSS del ícono original (ej. 'fa-chevron-down').
     */
    function toggleFilterButtonState(button, isActive, textContent = null, originalIconClass = null) {
        button.classList.toggle('filtro-button--active', isActive);

        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent.trim();
        }

        button.querySelectorAll('i').forEach(icon => icon.remove());

        if (textContent !== null) {
            button.textContent = textContent + ' ';
        } else {
            button.textContent = button.dataset.originalText + ' ';
        }

        if (!isActive && originalIconClass) {
            const iconElement = document.createElement('i');
            iconElement.classList.add('fas', originalIconClass);
            button.appendChild(iconElement);
        }
        // Ya no hay clear-filter-standalone-button, así que esta parte se elimina
        updateClearAllButtonVisibility();
    }

    // --- Generación de años y meses dinámicamente ---
    function populateYearDropdown() {
        const currentYear = new Date().getFullYear();
        // Podemos generar años desde un rango razonable, por ejemplo, los últimos 5 años y los próximos 2
        const startYear = currentYear - 5;
        const endYear = currentYear + 2;
        yearDropdown.innerHTML = ''; // Limpiar dropdown

        for (let year = startYear; year <= endYear; year++) {
            const a = document.createElement('a');
            a.href = '#';
            a.classList.add('dropdown-item');
            a.dataset.yearValue = year;
            a.textContent = year;
            yearDropdown.appendChild(a);
        }

        // Añadir listeners a los nuevos ítems
        yearDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const selectedYear = parseInt(item.dataset.yearValue);
                activeFilters.year = selectedYear;
                toggleFilterButtonState(yearFilterButton, true, `Año: ${selectedYear}`, 'fa-chevron-down');
                yearDropdown.classList.remove('active');
                yearFilterGroup.classList.remove('active-dropdown-parent'); // Eliminar clase cuando se selecciona un ítem
                applyFilters(); // Aplicar todos los filtros
            });
        });
    }

    function populateMonthDropdown() {
        monthDropdown.innerHTML = ''; // Limpiar dropdown

        monthNames.forEach((name, index) => {
            const monthValue = index + 1; // Enero es 1, Febrero es 2, etc.
            const a = document.createElement('a');
            a.href = '#';
            a.classList.add('dropdown-item');
            a.dataset.monthValue = monthValue;
            a.textContent = name;
            monthDropdown.appendChild(a);
        });

        // Añadir listeners a los nuevos ítems
        monthDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const selectedMonth = parseInt(item.dataset.monthValue);
                activeFilters.month = selectedMonth;
                toggleFilterButtonState(monthFilterButton, true, `Mes: ${monthNames[selectedMonth - 1]}`, 'fa-chevron-down');
                monthDropdown.classList.remove('active');
                monthFilterGroup.classList.remove('active-dropdown-parent'); // Eliminar clase cuando se selecciona un ítem
                applyFilters(); // Aplicar todos los filtros
            });
        });
    }

    // --- Lógica de aplicación de filtros ---
    function applyFilters() {
        projectItems.forEach(item => {
            const itemStatus = item.dataset.status;
            const itemDate = new Date(item.dataset.date); // Convertir la fecha a objeto Date
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth() + 1; // getMonth() es base 0

            let isVisible = true;

            // Filtrar por estado
            if (activeFilters.status && itemStatus !== activeFilters.status) {
                isVisible = false;
            }

            // Filtrar por año
            if (activeFilters.year && itemYear !== activeFilters.year) {
                isVisible = false;
            }

            // Filtrar por mes
            if (activeFilters.month && itemMonth !== activeFilters.month) {
                isVisible = false;
            }

            item.style.display = isVisible ? 'flex' : 'none'; // Mostrar u ocultar
        });
        updateClearAllButtonVisibility(); // Actualizar visibilidad del botón "Borrar filtros"
    }

    // --- Lógica para abrir/cerrar dropdowns ---
    statusFilterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        statusDropdown.classList.toggle('active');
        statusFilterGroup.classList.toggle('active-dropdown-parent', statusDropdown.classList.contains('active'));

        yearDropdown.classList.remove('active'); // Cerrar otros
        yearFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
        monthDropdown.classList.remove('active'); // Cerrar otros
        monthFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
    });

    yearFilterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        yearDropdown.classList.toggle('active');
        yearFilterGroup.classList.toggle('active-dropdown-parent', yearDropdown.classList.contains('active'));

        statusDropdown.classList.remove('active'); // Cerrar otros
        statusFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
        monthDropdown.classList.remove('active'); // Cerrar otros
        monthFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
    });

    monthFilterButton.addEventListener('click', (event) => {
        event.stopPropagation();
        monthDropdown.classList.toggle('active');
        monthFilterGroup.classList.toggle('active-dropdown-parent', monthDropdown.classList.contains('active'));

        statusDropdown.classList.remove('active'); // Cerrar otros
        statusFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
        yearDropdown.classList.remove('active'); // Cerrar otros
        yearFilterGroup.classList.remove('active-dropdown-parent'); // Quitar clase de otro grupo
    });


    statusDropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const selectedStatus = item.dataset.statusValue;
            activeFilters.status = selectedStatus;
            toggleFilterButtonState(statusFilterButton, true, `Estado: ${selectedStatus}`, 'fa-chevron-down');
            statusDropdown.classList.remove('active');
            statusFilterGroup.classList.remove('active-dropdown-parent'); // Eliminar clase cuando se selecciona un ítem
            applyFilters();
        });
    });

    // --- Funciones para borrar filtros específicos ---
    function clearStatusFilter() {
        activeFilters.status = null;
        toggleFilterButtonState(statusFilterButton, false, null, 'fa-chevron-down');
    }

    function clearYearFilter() {
        activeFilters.year = null;
        toggleFilterButtonState(yearFilterButton, false, null, 'fa-chevron-down');
    }

    function clearMonthFilter() {
        activeFilters.month = null;
        toggleFilterButtonState(monthFilterButton, false, null, 'fa-chevron-down');
    }


    // --- Manejo de clics fuera de los elementos para cerrar dropdowns ---
    document.addEventListener('click', (event) => {
        // Cerrar dropdown de estado
        if (!statusFilterButton.contains(event.target) && !statusDropdown.contains(event.target)) {
            statusDropdown.classList.remove('active');
            statusFilterGroup.classList.remove('active-dropdown-parent');
        }
        // Cerrar dropdown de año
        if (!yearFilterButton.contains(event.target) && !yearDropdown.contains(event.target)) {
            yearDropdown.classList.remove('active');
            yearFilterGroup.classList.remove('active-dropdown-parent');
        }
        // Cerrar dropdown de mes
        if (!monthFilterButton.contains(event.target) && !monthDropdown.contains(event.target)) {
            monthDropdown.classList.remove('active');
            monthFilterGroup.classList.remove('active-dropdown-parent');
        }
    });

    // --- Lógica del botón Borrar todos los filtros ---
    clearAllFiltersButton.addEventListener('click', () => {
        clearStatusFilter();
        clearYearFilter();
        clearMonthFilter();
        applyFilters(); // Re-aplicar filtros para mostrar todo
        console.log('Todos los filtros han sido borrados.');
    });

    // --- Lógica para los Dropdowns de acciones de proyecto (mantener como está o integrar con upload_informe.js) ---
    // (Este bloque se asume que está en upload_informe.js o en un script separado)
    const moreOptionsButtons = document.querySelectorAll('.more-options-button');

    moreOptionsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdownMenu = button.closest('.dropdown').querySelector('.dropdown-menu');
            document.querySelectorAll('.dropdown-menu.active-dropdown').forEach(openMenu => {
                if (openMenu !== dropdownMenu) {
                    openMenu.classList.remove('active-dropdown');
                }
            });
            // Cerrar todos los desplegables de filtro si están abiertos al abrir un desplegable de acción
            statusDropdown.classList.remove('active');
            statusFilterGroup.classList.remove('active-dropdown-parent');
            yearDropdown.classList.remove('active');
            yearFilterGroup.classList.remove('active-dropdown-parent');
            monthDropdown.classList.remove('active');
            monthFilterGroup.classList.remove('active-dropdown-parent');

            dropdownMenu.classList.toggle('active-dropdown');
        });
    });

    document.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown-menu.active-dropdown').forEach(openMenu => {
            const parentDropdown = openMenu.closest('.dropdown');
            if (parentDropdown && !parentDropdown.contains(event.target)) {
                openMenu.classList.remove('active-dropdown');
            }
        });
        // Si los desplegables de filtro no se cerraron por su propia lógica, asegúrate de cerrarlos aquí.
        if (!statusFilterButton.contains(event.target) && !statusDropdown.contains(event.target)) {
            statusDropdown.classList.remove('active');
            statusFilterGroup.classList.remove('active-dropdown-parent');
        }
        if (!yearFilterButton.contains(event.target) && !yearDropdown.contains(event.target)) {
            yearDropdown.classList.remove('active');
            yearFilterGroup.classList.remove('active-dropdown-parent');
        }
        if (!monthFilterButton.contains(event.target) && !monthDropdown.contains(event.target)) {
            monthDropdown.classList.remove('active');
            monthFilterGroup.classList.remove('active-dropdown-parent');
        }
    });

    // --- Inicialización al cargar la página ---
    // Guardar el texto original de los botones de filtro
    statusFilterButton.dataset.originalText = statusFilterButton.textContent.trim();
    yearFilterButton.dataset.originalText = yearFilterButton.textContent.trim();
    monthFilterButton.dataset.originalText = monthFilterButton.textContent.trim();

    populateYearDropdown(); // Generar años al inicio
    populateMonthDropdown(); // Generar meses al inicio
    applyFilters(); // Aplicar filtros iniciales (mostrar todo)
});