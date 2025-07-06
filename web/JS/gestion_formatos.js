document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const nombreNuevaCategoriaInput = document.getElementById('nombreNuevaCategoria');
    const btnAgregarCategoria = document.getElementById('btnAgregarCategoria');
    const dropdownCategorias = document.getElementById('dropdownCategorias');
    const btnEditarCategoria = document.getElementById('btnEditarCategoria');
    const btnDeshabilitarCategoria = document.getElementById('btnDeshabilitarCategoria');
    const areaEdicionCategoria = document.getElementById('areaEdicionCategoria');
    const inputNombreEdicionCategoria = document.getElementById('inputNombreEdicionCategoria');
    const btnGuardarNombreCategoria = document.getElementById('btnGuardarNombreCategoria');
    const btnCancelarEdicionCategoria = document.getElementById('btnCancelarEdicionCategoria');

    const mensajeNoCategoriaSeleccionadaParaFormatos = document.getElementById('mensajeNoCategoriaSeleccionadaParaFormatos');
    const areaInputFormato = document.getElementById('areaInputFormato');
    const nombreNuevoFormatoInput = document.getElementById('nombreNuevoFormato');
    // NOTA: Los inputs 'codigoSubproceso' y 'precioSubproceso' están en el HTML en el panel de subprocesos.
    // Sin embargo, lógicamente pertenecen al formato. Los usaré aquí para agregar formato.
    const codigoFormatoInput = document.getElementById('codigoSubproceso');
    const precioFormatoInput = document.getElementById('precioSubproceso');

    const btnAgregarFormato = document.getElementById('btnAgregarFormato');
    const dropdownFormatos = document.getElementById('dropdownFormatos');
    const btnEditarFormato = document.getElementById('btnEditarFormato');
    const btnDeshabilitarFormato = document.getElementById('btnDeshabilitarFormato');
    const areaEdicionFormato = document.getElementById('areaEdicionFormato');
    const inputNombreEdicionFormato = document.getElementById('inputNombreEdicionFormato');
    const btnGuardarNombreFormato = document.getElementById('btnGuardarNombreFormato');
    const btnCancelarEdicionFormato = document.getElementById('btnCancelarEdicionFormato');

    const mensajeNoFormatoSeleccionadoParaSubprocesos = document.getElementById('mensajeNoFormatoSeleccionadoParaSubprocesos');
    const areaInputSubproceso = document.getElementById('areaInputSubproceso');
    // NOTA: Reutilizo codigoSubprocesoInput y precioSubprocesoInput para formato.
    // El subproceso solo tiene 'nombreSubproceso' según tu estructura lógica del panel.
    const nombreSubprocesoInput = document.getElementById('nombreSubproceso');
    const btnAgregarSubproceso = document.getElementById('btnAgregarSubproceso');
    const listaSubprocesosDiv = document.getElementById('listaSubprocesos');

    let currentSelectedCategoryId = null;
    let currentSelectedFormatId = null;

    // --- Configuración de la URL base para el API ---
    // Ajusta 'INGEMAT_1' al nombre de tu proyecto si es diferente al desplegar en Tomcat
    const API_BASE_URL = '/INGEMAT_1/api'; // (asumiendo INGEMAT_1 es el nombre de tu proyecto web)

    // --- Funciones para interacciones con el Backend (API) ---

    async function fetchData(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (response.status === 204) { // No Content
                return {}; // O null, dependiendo de lo que esperes para DELETE/PUT sin cuerpo
            }
            if (!response.ok) {
                // Intenta leer el mensaje de error del backend
                const errorBody = await response.json().catch(() => response.text());
                const errorMessage = typeof errorBody === 'object' && errorBody.message ? errorBody.message : (typeof errorBody === 'string' ? errorBody : 'Error desconocido.');
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
            }
            return response.json(); // Parsea la respuesta JSON
        } catch (error) {
            console.error('Fetch error:', error);
            alert(`Error al comunicarse con el servidor: ${error.message}`);
            return null;
        }
    }

    // --- Funciones de Carga Inicial y Renderizado ---

    async function loadCategorias() {
        dropdownCategorias.innerHTML = '<option value="">-- Seleccione una categoría --</option>'; //
        const categorias = await fetchData(`${API_BASE_URL}/categorias`);
        if (categorias) {
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id; // Guarda el ID de la categoría
                option.textContent = cat.nombre;
                dropdownCategorias.appendChild(option);
            });
        }
        // Resetear formatos y subprocesos al cargar categorías
        resetFormatos();
        resetSubprocesos();
        currentSelectedCategoryId = null; // Asegurarse de que no haya una categoría seleccionada
        dropdownCategorias.value = ""; // Deseleccionar cualquier opción
    }

    async function loadFormatos(idCategoria) {
        dropdownFormatos.innerHTML = '<option value="">-- Seleccione un formato --</option>';
        listaSubprocesosDiv.innerHTML = '<p>No hay sub procesos para este formato o no se ha seleccionado ninguno.</p>'; //
        currentSelectedFormatId = null;

        if (!idCategoria) {
            mensajeNoCategoriaSeleccionadaParaFormatos.style.display = 'block'; //
            areaInputFormato.style.display = 'none';
            btnEditarFormato.style.display = 'none';
            btnDeshabilitarFormato.style.display = 'none';
            areaEdicionFormato.style.display = 'none';
            return;
        }

        mensajeNoCategoriaSeleccionadaParaFormatos.style.display = 'none';
        areaInputFormato.style.display = 'block';

        const formatos = await fetchData(`${API_BASE_URL}/formatos?idCategoria=${idCategoria}`);
        if (formatos) {
            formatos.forEach(fmt => {
                const option = document.createElement('option');
                option.value = fmt.id; // Guarda el ID del formato
                option.textContent = `${fmt.nombre} (Cód: ${fmt.codigo || 'N/A'}) - S/ ${fmt.precio ? parseFloat(fmt.precio).toFixed(2) : '0.00'}`;
                option.dataset.nombre = fmt.nombre;
                option.dataset.codigo = fmt.codigo;
                option.dataset.precio = fmt.precio;
                dropdownFormatos.appendChild(option);
            });
        }
        dropdownFormatos.value = ""; // Deseleccionar cualquier opción
    }

    async function loadSubprocesos(idFormato) {
        listaSubprocesosDiv.innerHTML = ''; // Limpiar lista
        if (!idFormato) {
            mensajeNoFormatoSeleccionadoParaSubprocesos.style.display = 'block'; //
            areaInputSubproceso.style.display = 'none';
            return;
        }

        mensajeNoFormatoSeleccionadoParaSubprocesos.style.display = 'none';
        areaInputSubproceso.style.display = 'block';

        const subprocesos = await fetchData(`${API_BASE_URL}/subprocesos?idFormato=${idFormato}`);
        if (subprocesos && subprocesos.length > 0) {
            const ul = document.createElement('ul');
            ul.classList.add('subproceso-list'); // Añadir clase para estilos
            subprocesos.forEach(sub => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${sub.nombre}</span>
                    <div>
                        <button type="button" class="btn btn-sm btn-outline-warning btn-edit-subproceso" data-id="${sub.id}" data-nombre="${sub.nombre}">Editar</button>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-delete-subproceso" data-id="${sub.id}">Eliminar</button>
                    </div>
                `;
                ul.appendChild(li);
            });
            listaSubprocesosDiv.appendChild(ul);
        } else {
            listaSubprocesosDiv.innerHTML = '<p>No hay sub procesos para este formato.</p>';
        }
    }

    function resetFormatos() {
        dropdownFormatos.innerHTML = '<option value="">-- Seleccione un formato --</option>';
        mensajeNoCategoriaSeleccionadaParaFormatos.style.display = 'block';
        areaInputFormato.style.display = 'none';
        btnEditarFormato.style.display = 'none';
        btnDeshabilitarFormato.style.display = 'none';
        areaEdicionFormato.style.display = 'none';
        nombreNuevoFormatoInput.value = '';
        codigoFormatoInput.value = ''; // Limpiar campo de código
        precioFormatoInput.value = ''; // Limpiar campo de precio
    }

    function resetSubprocesos() {
        listaSubprocesosDiv.innerHTML = '<p>No hay sub procesos para este formato o no se ha seleccionado ninguno.</p>'; //
        mensajeNoFormatoSeleccionadoParaSubprocesos.style.display = 'block';
        areaInputSubproceso.style.display = 'none';
        nombreSubprocesoInput.value = '';
    }

    // --- Event Listeners ---

    // Categorías
    btnAgregarCategoria.addEventListener('click', async () => {
        const nombre = nombreNuevaCategoriaInput.value.trim(); //
        if (nombre) {
            const result = await fetchData(`${API_BASE_URL}/categorias`, 'POST', { nombre: nombre });
            if (result) {
                alert('Categoría agregada con éxito.');
                nombreNuevaCategoriaInput.value = '';
                loadCategorias(); // Recargar la lista de categorías
            }
        } else {
            alert('Por favor, ingrese un nombre para la categoría.');
        }
    });

    dropdownCategorias.addEventListener('change', () => { //
        currentSelectedCategoryId = dropdownCategorias.value ? parseInt(dropdownCategorias.value) : null;
        if (currentSelectedCategoryId) {
            btnEditarCategoria.style.display = 'inline-block';
            btnDeshabilitarCategoria.style.display = 'inline-block';
            loadFormatos(currentSelectedCategoryId);
        } else {
            btnEditarCategoria.style.display = 'none';
            btnDeshabilitarCategoria.style.display = 'none';
            resetFormatos();
            resetSubprocesos();
        }
        areaEdicionCategoria.style.display = 'none'; // Ocultar edición al cambiar selección
    });

    btnEditarCategoria.addEventListener('click', () => {
        if (currentSelectedCategoryId) {
            const selectedText = dropdownCategorias.options[dropdownCategorias.selectedIndex].textContent;
            inputNombreEdicionCategoria.value = selectedText;
            areaEdicionCategoria.style.display = 'block';
        } else {
            alert('Por favor, seleccione una categoría para editar.');
        }
    });

    btnGuardarNombreCategoria.addEventListener('click', async () => {
        const nuevoNombre = inputNombreEdicionCategoria.value.trim();
        if (currentSelectedCategoryId && nuevoNombre) {
            const result = await fetchData(`${API_BASE_URL}/categorias`, 'PUT', { id: currentSelectedCategoryId, nombre: nuevoNombre });
            if (result) {
                alert('Categoría actualizada con éxito.');
                areaEdicionCategoria.style.display = 'none';
                loadCategorias();
            }
        } else {
            alert('Por favor, ingrese un nuevo nombre para la categoría.');
        }
    });

    btnCancelarEdicionCategoria.addEventListener('click', () => {
        areaEdicionCategoria.style.display = 'none';
    });

    btnDeshabilitarCategoria.addEventListener('click', async () => {
        if (currentSelectedCategoryId && confirm('¿Está seguro de que desea deshabilitar esta categoría y todos sus formatos/subprocesos asociados?')) {
            const result = await fetchData(`${API_BASE_URL}/categorias?id=${currentSelectedCategoryId}`, 'DELETE');
            if (result) {
                alert('Categoría deshabilitada con éxito.');
                loadCategorias();
            }
        } else if (!currentSelectedCategoryId) {
            alert('Por favor, seleccione una categoría para deshabilitar.');
        }
    });

    // Formatos
    btnAgregarFormato.addEventListener('click', async () => {
        if (!currentSelectedCategoryId) {
            alert('Primero debe seleccionar una categoría.');
            return;
        }

        const nombre = nombreNuevoFormatoInput.value.trim();
        const codigo = codigoFormatoInput.value.trim();
        const precio = parseFloat(precioFormatoInput.value);

        if (nombre && !isNaN(precio) && precio >= 0) {
            const newFormatData = {
                idCategoria: currentSelectedCategoryId,
                nombre: nombre,
                codigo: codigo,
                precio: precio
            };
            const result = await fetchData(`${API_BASE_URL}/formatos`, 'POST', newFormatData);
            if (result) {
                alert('Formato agregado con éxito.');
                nombreNuevoFormatoInput.value = '';
                codigoFormatoInput.value = '';
                precioFormatoInput.value = '';
                loadFormatos(currentSelectedCategoryId);
            }
        } else {
            alert('Por favor, ingrese un nombre, código y precio válido para el formato.');
        }
    });

    dropdownFormatos.addEventListener('change', () => {
        currentSelectedFormatId = dropdownFormatos.value ? parseInt(dropdownFormatos.value) : null;
        if (currentSelectedFormatId) {
            btnEditarFormato.style.display = 'inline-block';
            btnDeshabilitarFormato.style.display = 'inline-block';
            loadSubprocesos(currentSelectedFormatId);
        } else {
            btnEditarFormato.style.display = 'none';
            btnDeshabilitarFormato.style.display = 'none';
            resetSubprocesos();
        }
        areaEdicionFormato.style.display = 'none'; // Ocultar edición al cambiar selección
    });

    btnEditarFormato.addEventListener('click', () => {
        if (currentSelectedFormatId) {
            const selectedOption = dropdownFormatos.options[dropdownFormatos.selectedIndex];
            inputNombreEdicionFormato.value = selectedOption.dataset.nombre;
            // Si tuvieras campos de edición para código y precio en el área de edición, los cargarías aquí
            areaEdicionFormato.style.display = 'block';
        } else {
            alert('Por favor, seleccione un formato para editar.');
        }
    });

    btnGuardarNombreFormato.addEventListener('click', async () => {
        const nuevoNombre = inputNombreEdicionFormato.value.trim();
        if (currentSelectedFormatId && currentSelectedCategoryId && nuevoNombre) {
            const selectedOption = dropdownFormatos.options[dropdownFormatos.selectedIndex];
            const currentCodigo = selectedOption.dataset.codigo;
            const currentPrecio = parseFloat(selectedOption.dataset.precio);

            const updatedFormatData = {
                id: currentSelectedFormatId,
                idCategoria: currentSelectedCategoryId, // Necesario para el PUT en el backend
                nombre: nuevoNombre,
                codigo: currentCodigo, // Mantener el código actual si no se edita
                precio: currentPrecio // Mantener el precio actual si no se edita
            };
            const result = await fetchData(`${API_BASE_URL}/formatos`, 'PUT', updatedFormatData);
            if (result) {
                alert('Formato actualizado con éxito.');
                areaEdicionFormato.style.display = 'none';
                loadFormatos(currentSelectedCategoryId);
            }
        } else {
            alert('Por favor, ingrese un nuevo nombre para el formato.');
        }
    });

    btnCancelarEdicionFormato.addEventListener('click', () => {
        areaEdicionFormato.style.display = 'none';
    });

    btnDeshabilitarFormato.addEventListener('click', async () => {
        if (currentSelectedFormatId && confirm('¿Está seguro de que desea deshabilitar este formato y todos sus subprocesos asociados?')) {
            const result = await fetchData(`${API_BASE_URL}/formatos?id=${currentSelectedFormatId}`, 'DELETE');
            if (result) {
                alert('Formato deshabilitado con éxito.');
                loadFormatos(currentSelectedCategoryId);
            }
        } else if (!currentSelectedFormatId) {
            alert('Por favor, seleccione un formato para deshabilitar.');
        }
    });

    // Subprocesos
    btnAgregarSubproceso.addEventListener('click', async () => {
        if (!currentSelectedFormatId) {
            alert('Primero debe seleccionar un formato.');
            return;
        }

        const nombre = nombreSubprocesoInput.value.trim();

        if (nombre) {
            const newSubProcesoData = {
                idFormato: currentSelectedFormatId,
                nombre: nombre
            };
            const result = await fetchData(`${API_BASE_URL}/subprocesos`, 'POST', newSubProcesoData);
            if (result) {
                alert('Sub Proceso agregado con éxito.');
                nombreSubprocesoInput.value = '';
                loadSubprocesos(currentSelectedFormatId);
            }
        } else {
            alert('Por favor, ingrese un nombre para el sub proceso.');
        }
    });

    listaSubprocesosDiv.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-delete-subproceso')) {
            const subprocesoId = parseInt(event.target.dataset.id);
            if (confirm('¿Está seguro de que desea deshabilitar este sub proceso?')) {
                const result = await fetchData(`${API_BASE_URL}/subprocesos?id=${subprocesoId}`, 'DELETE');
                if (result) {
                    alert('Sub proceso deshabilitado con éxito.');
                    loadSubprocesos(currentSelectedFormatId);
                }
            }
        } else if (event.target.classList.contains('btn-edit-subproceso')) {
            const subprocesoId = parseInt(event.target.dataset.id);
            const currentName = event.target.dataset.nombre;
            const newName = prompt('Ingrese el nuevo nombre para el sub proceso:', currentName);
            if (newName !== null && newName.trim() !== '') {
                const updatedSubProceso = {
                    id: subprocesoId,
                    nombre: newName.trim()
                };
                const result = await fetchData(`${API_BASE_URL}/subprocesos`, 'PUT', updatedSubProceso);
                if (result) {
                    alert('Sub proceso actualizado con éxito.');
                    loadSubprocesos(currentSelectedFormatId);
                }
            } else if (newName !== null) {
                alert('El nombre del sub proceso no puede estar vacío.');
            }
        }
    });

    // Inicialización
    loadCategorias();
});