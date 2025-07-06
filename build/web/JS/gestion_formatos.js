document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos HTML (mantener todas, son necesarias) ---
    const inputNombreNuevaCategoria = document.getElementById('nombreNuevaCategoria');
    const btnAgregarCategoria = document.getElementById('btnAgregarCategoria');
    const dropdownCategorias = document.getElementById('dropdownCategorias');
    const btnDeshabilitarCategoria = document.getElementById('btnDeshabilitarCategoria');
    const btnEditarCategoria = document.getElementById('btnEditarCategoria');
    const areaEdicionCategoria = document.getElementById('areaEdicionCategoria');
    const inputNombreEdicionCategoria = document.getElementById('inputNombreEdicionCategoria');
    const btnGuardarNombreCategoria = document.getElementById('btnGuardarNombreCategoria');
    const btnCancelarEdicionCategoria = document.getElementById('btnCancelarEdicionCategoria');

    const mensajeNoCategoriaSeleccionadaParaFormatos = document.getElementById('mensajeNoCategoriaSeleccionadaParaFormatos');
    const areaInputFormato = document.getElementById('areaInputFormato');
    const inputNombreNuevoFormato = document.getElementById('nombreNuevoFormato');
    const btnAgregarFormato = document.getElementById('btnAgregarFormato');
    const dropdownFormatos = document.getElementById('dropdownFormatos');
    const btnDeshabilitarFormato = document.getElementById('btnDeshabilitarFormato');
    const btnEditarFormato = document.getElementById('btnEditarFormato');
    const areaEdicionFormato = document.getElementById('areaEdicionFormato');
    const inputNombreEdicionFormato = document.getElementById('inputNombreEdicionFormato');
    const btnGuardarNombreFormato = document.getElementById('btnGuardarNombreFormato');
    const btnCancelarEdicionFormato = document.getElementById('btnCancelarEdicionFormato');

    const mensajeNoFormatoSeleccionadoParaSubprocesos = document.getElementById('mensajeNoFormatoSeleccionadoParaSubprocesos');
    const areaInputSubproceso = document.getElementById('areaInputSubproceso');
    const inputCodigoSubproceso = document.getElementById('codigoSubproceso');
    const inputNombreSubproceso = document.getElementById('nombreSubproceso');
    const inputPrecioSubproceso = document.getElementById('precioSubproceso');
    const btnAgregarSubproceso = document.getElementById('btnAgregarSubproceso');
    const listaSubprocesosDiv = document.getElementById('listaSubprocesos');

    // --- Estructura de datos ---
    let categoriasFormatosYSubprocesos = {};

    // --- Variables de estado para edición ---
    let estaEditandoCategoria = false;
    let nombreCategoriaEdicionActual = null;

    let estaEditandoFormato = false;
    let nombreFormatoEdicionActual = null;
    let categoriaEdicionFormatoActual = null;

    let estaEditandoSubproceso = false;
    let categoriaEdicionSubprocesoActual = null;
    let formatoEdicionSubprocesoActual = null;
    let indiceEdicionSubprocesoActual = -1;

    // --- Configuración para el salto de línea de nombres de sub procesos ---
    const MAX_CARACTERES_POR_LINEA = 90;

    // --- Funciones de persistencia con localStorage ---
    function guardarEnLocalStorage() {
        localStorage.setItem('categoriasFormatosYSubprocesos', JSON.stringify(categoriasFormatosYSubprocesos));
    }

    function cargarDeLocalStorage() {
        const datosAlmacenados = localStorage.getItem('categoriasFormatosYSubprocesos');
        if (datosAlmacenados) {
            categoriasFormatosYSubprocesos = JSON.parse(datosAlmacenados);
            // Asegurarse de que todos los niveles tengan la propiedad 'activo'
            // Esta sección es necesaria para compatibilidad con datos antiguos que no tenían 'activo'
            for (const catName in categoriasFormatosYSubprocesos) {
                const categoria = categoriasFormatosYSubprocesos[catName];
                if (typeof categoria.activo === 'undefined') {
                    categoria.activo = true;
                }
                for (const formatName in categoria.formatos) {
                    const formato = categoria.formatos[formatName];
                    if (typeof formato.activo === 'undefined') {
                        formato.activo = true;
                    }
                    if (Array.isArray(formato.subprocesos)) {
                        formato.subprocesos.forEach(sub => {
                            if (typeof sub.activo === 'undefined') {
                                sub.activo = true;
                            }
                        });
                    }
                }
            }
        } else {
            // Datos de ejemplo ya con la propiedad 'activo'
            categoriasFormatosYSubprocesos = {
                "1. FORMATOS PARA RECEPCIÓN DE MUESTRAS Y ETIQUETADO": {
                    activo: true,
                    formatos: {
                        "Formato de Recepción General": {
                            activo: true,
                            subprocesos: [
                                { nombre: "(Recepción de muestras de suelo,agregados petreos, mezcla asfaltica y aceros de refuerzo)", codigo: "1.1", precio: 8.00, activo: true },
                                { nombre: "(Recepción de tomas de nucleos de concreto)", codigo: "1.2", precio: 7.00, activo: true }
                            ]
                        }
                    }
                },
                "2. INFORMES TÉCNICOS": {
                    activo: true,
                    formatos: {
                        "Informe Tipo X": {
                            activo: true,
                            subprocesos: [
                                { nombre: "Informe de Mecánica de Suelos", codigo: "3.1", precio: 150.00, activo: true },
                                { nombre: "Informe Geotécnico", codigo: "3.2", precio: 200.00, activo: true }
                            ]
                        },
                        "Informe Tipo Y": {
                            activo: true,
                            subprocesos: [
                                { nombre: "Estudio de Impacto Ambiental", codigo: "4.1", precio: 300.00, activo: true }
                            ]
                        }
                    }
                }
            };
            guardarEnLocalStorage();
        }
    }

    // --- Funciones de ayuda para verificar estado activo ---
    // Estas funciones reducen la repetición de código
    function isCategoryActive(categoryName) {
        return categoriasFormatosYSubprocesos[categoryName]?.activo === true;
    }

    function isFormatActive(categoryName, formatName) {
        return categoriasFormatosYSubprocesos[categoryName]?.formatos?.[formatName]?.activo === true;
    }

    // --- Función para formatear el nombre del sub proceso con saltos de línea ---
    function formatearNombreSubprocesoParaMostrar(nombreSubproceso) {
        if (nombreSubproceso.length <= MAX_CARACTERES_POR_LINEA) {
            return nombreSubproceso;
        }

        let resultado = '';
        let longitudLineaActual = 0;
        const palabras = nombreSubproceso.split(' ');

        for (let i = 0; i < palabras.length; i++) {
            const palabra = palabras[i];
            const espacioNecesario = longitudLineaActual > 0 ? 1 : 0;

            if (longitudLineaActual + palabra.length + espacioNecesario > MAX_CARACTERES_POR_LINEA) {
                resultado += '<br>' + palabra;
                longitudLineaActual = palabra.length;
            } else {
                if (longitudLineaActual > 0) {
                    resultado += ' ';
                    longitudLineaActual += 1;
                }
                resultado += palabra;
                longitudLineaActual += palabra.length;
            }
        }
        return resultado;
    }

    // --- Funciones de Renderizado ---
    function renderizarDropdownCategorias() {
        const categoriaSeleccionadaPrevia = dropdownCategorias.value;
        dropdownCategorias.innerHTML = '<option value="">-- Seleccione una categoría --</option>';
        const categoriasOrdenadas = Object.keys(categoriasFormatosYSubprocesos).sort();

        categoriasOrdenadas.forEach(nombreCategoria => {
            const categoriaObj = categoriasFormatosYSubprocesos[nombreCategoria];
            const opcion = document.createElement('option');
            opcion.value = nombreCategoria;
            opcion.textContent = categoriaObj.activo ? nombreCategoria : `${nombreCategoria} (Deshabilitada)`;
            dropdownCategorias.appendChild(opcion);
        });

        // Restablece la selección o la deja vacía si la categoría no existe
        dropdownCategorias.value = categoriasFormatosYSubprocesos[categoriaSeleccionadaPrevia] ? categoriaSeleccionadaPrevia : '';

        // Dispara el evento change para actualizar los otros dropdowns y listas
        dropdownCategorias.dispatchEvent(new Event('change'));
    }

    function renderizarDropdownFormatos(categoriaSeleccionada) {
        const formatoSeleccionadoPrevio = dropdownFormatos.value;
        dropdownFormatos.innerHTML = '<option value="">-- Seleccione un formato --</option>';

        if (categoriaSeleccionada && categoriasFormatosYSubprocesos[categoriaSeleccionada]) {
            const formatosOrdenados = Object.keys(categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos).sort();
            formatosOrdenados.forEach(nombreFormato => {
                const formatoObj = categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[nombreFormato];
                const opcion = document.createElement('option');
                opcion.value = nombreFormato;
                opcion.textContent = formatoObj.activo ? nombreFormato : `${nombreFormato} (Deshabilitado)`;
                dropdownFormatos.appendChild(opcion);
            });
        }

        // Restablece la selección o la deja vacía
        dropdownFormatos.value = (categoriaSeleccionada && categoriasFormatosYSubprocesos[categoriaSeleccionada]?.formatos?.[formatoSeleccionadoPrevio]) ? formatoSeleccionadoPrevio : '';

        // Dispara el evento change para actualizar la lista de subprocesos
        dropdownFormatos.dispatchEvent(new Event('change'));
    }

    function renderizarListaSubprocesos(categoriaSeleccionada, formatoSeleccionado) {
        listaSubprocesosDiv.innerHTML = '';
        const subprocesos = categoriasFormatosYSubprocesos[categoriaSeleccionada]?.formatos?.[formatoSeleccionado]?.subprocesos;

        if (!subprocesos || subprocesos.length === 0) {
            listaSubprocesosDiv.innerHTML = '<p>No hay sub procesos para este formato o no se ha seleccionado ninguno.</p>';
            return;
        }

        const ul = document.createElement('ul');
        const subprocesosOrdenados = [...subprocesos].sort((a, b) => a.codigo.localeCompare(b.codigo)); // Usar spread para evitar mutar el array original

        subprocesosOrdenados.forEach((subproceso, index) => {
            // Encontrar el índice original para las acciones de edición/habilitación
            // Es crucial que el `data-indice` apunte al índice correcto en el array NO ORDENADO
            const originalIndex = subprocesos.findIndex(s => s.codigo === subproceso.codigo && s.nombre === subproceso.nombre);

            const li = document.createElement('li');
            const nombreFormateado = formatearNombreSubprocesoParaMostrar(subproceso.nombre);

            if (!subproceso.activo) {
                li.classList.add('deshabilitado');
            }

            li.innerHTML = `
                <div class="detalles-subproceso">
                    <span class="nombre-subproceso">
                        ${subproceso.codigo} ${nombreFormateado}
                    </span>
                    <span>Precio: S/ ${parseFloat(subproceso.precio).toFixed(2)}</span>
                </div>
                <div class="acciones-subproceso">
                    <button type="button" class="btn btn-editar-subproceso" data-categoria="${categoriaSeleccionada}" data-formato="${formatoSeleccionado}" data-indice="${originalIndex}">Editar</button>
                    <button type="button" class="btn btn-toggle-subproceso-estado ${subproceso.activo ? 'estado-activo' : 'estado-inactivo'}" data-categoria="${categoriaSeleccionada}" data-formato="${formatoSeleccionado}" data-indice="${originalIndex}">
                        ${subproceso.activo ? 'Deshabilitar' : 'Habilitar'}
                    </button>
                </div>
            `;
            ul.appendChild(li);
        });
        listaSubprocesosDiv.appendChild(ul);
    }

    // --- Funciones de restablecimiento de formularios ---
    function restablecerFormularioEdicionCategoria() {
        areaEdicionCategoria.style.display = 'none';
        inputNombreEdicionCategoria.value = '';
        estaEditandoCategoria = false;
        nombreCategoriaEdicionActual = null;
    }

    function restablecerFormularioEdicionFormato() {
        areaEdicionFormato.style.display = 'none';
        inputNombreEdicionFormato.value = '';
        estaEditandoFormato = false;
        nombreFormatoEdicionActual = null;
        categoriaEdicionFormatoActual = null;
    }

    function restablecerFormularioSubproceso() {
        inputCodigoSubproceso.value = '';
        inputNombreSubproceso.value = '';
        inputPrecioSubproceso.value = '';
        btnAgregarSubproceso.textContent = 'Agregar Sub Proceso';
        btnAgregarSubproceso.classList.remove('btn-warning');
        btnAgregarSubproceso.classList.add('btn-success');
        estaEditandoSubproceso = false;
        categoriaEdicionSubprocesoActual = null;
        formatoEdicionSubprocesoActual = null;
        indiceEdicionSubprocesoActual = -1;
    }

    // --- Lógica de Eventos ---

    // 1. Agregar Nueva Categoría
    btnAgregarCategoria.addEventListener('click', () => {
        const nombreNuevaCategoria = inputNombreNuevaCategoria.value.trim();

        if (!nombreNuevaCategoria) { // Simplificado: '!=' es suficiente para cadena vacía
            alert('Por favor, ingresa un nombre para la nueva categoría.');
            return;
        }
        if (categoriasFormatosYSubprocesos[nombreNuevaCategoria]) {
            alert(`La categoría "${nombreNuevaCategoria}" ya existe.`);
            return;
        }

        categoriasFormatosYSubprocesos[nombreNuevaCategoria] = { activo: true, formatos: {} };
        guardarEnLocalStorage();
        renderizarDropdownCategorias(); // Esto ya dispara el 'change'
        inputNombreNuevaCategoria.value = '';
        restablecerFormularioEdicionCategoria();
    });

    // 2. Selección de Categoría en el Dropdown
    dropdownCategorias.addEventListener('change', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const categoriaActiva = isCategoryActive(categoriaSeleccionada);

        // Control de visibilidad y estado de botones
        const isCategorySelected = !!categoriaSeleccionada; // Convierte a booleano

        mensajeNoCategoriaSeleccionadaParaFormatos.style.display = isCategorySelected ? 'none' : 'block';
        areaInputFormato.style.display = isCategorySelected ? 'block' : 'none';
        btnDeshabilitarCategoria.style.display = isCategorySelected ? 'inline-block' : 'none';
        btnEditarCategoria.style.display = isCategorySelected ? 'inline-block' : 'none';

        if (isCategorySelected) {
            btnDeshabilitarCategoria.textContent = categoriaActiva ? 'Deshabilitar Categoría' : 'Habilitar Categoría';
            btnDeshabilitarCategoria.classList.toggle('btn-danger', categoriaActiva);
            btnDeshabilitarCategoria.classList.toggle('btn-success', !categoriaActiva);
            btnEditarCategoria.disabled = !categoriaActiva;
            btnAgregarFormato.disabled = !categoriaActiva;
        } else {
            // Si no hay categoría seleccionada, asegúrate de que estén deshabilitados
            btnAgregarFormato.disabled = true;
        }

        renderizarDropdownFormatos(categoriaSeleccionada); // Esto ya dispara el 'change' para formatos
        restablecerFormularioEdicionCategoria();
        restablecerFormularioEdicionFormato();
        restablecerFormularioSubproceso();
    });

    // 3. Habilitar/Deshabilitar Categoría
    btnDeshabilitarCategoria.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        if (!categoriaSeleccionada) return;

        const categoriaObj = categoriasFormatosYSubprocesos[categoriaSeleccionada];
        const nuevoEstado = !categoriaObj.activo;

        let mensaje = nuevoEstado ?
            `¿Estás seguro de que quieres HABILITAR la categoría "${categoriaSeleccionada}"? Esto también habilitará sus formatos y subprocesos.` :
            `¿Estás seguro de que quieres DESHABILITAR la categoría "${categoriaSeleccionada}"? Esto también deshabilitará sus formatos y subprocesos.`;

        if (confirm(mensaje)) {
            categoriaObj.activo = nuevoEstado;
            // Recorre y actualiza el estado de formatos y subprocesos
            for (const formatName in categoriaObj.formatos) {
                const formatoObj = categoriaObj.formatos[formatName];
                formatoObj.activo = nuevoEstado;
                formatoObj.subprocesos.forEach(sub => sub.activo = nuevoEstado);
            }
            guardarEnLocalStorage();
            renderizarDropdownCategorias(); // Esto ya se encarga de re-renderizar y seleccionar la categoría
        }
    });

    // Evento para el botón "Editar Categoría"
    btnEditarCategoria.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        if (!categoriaSeleccionada) {
            alert('Por favor, selecciona una categoría para editar.');
            return;
        }
        if (!isCategoryActive(categoriaSeleccionada)) {
            alert('No se puede editar una categoría deshabilitada. Por favor, habilítala primero.');
            return;
        }
        areaEdicionCategoria.style.display = 'block';
        inputNombreEdicionCategoria.value = categoriaSeleccionada;
        inputNombreEdicionCategoria.focus();
        estaEditandoCategoria = true;
        nombreCategoriaEdicionActual = categoriaSeleccionada;
    });

    // Evento para el botón "Guardar Cambios" de categoría
    btnGuardarNombreCategoria.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const nuevoNombre = inputNombreEdicionCategoria.value.trim();

        if (!categoriaSeleccionada || !estaEditandoCategoria) {
            restablecerFormularioEdicionCategoria();
            return;
        }
        if (!nuevoNombre) {
            alert('El nombre de la categoría no puede estar vacío.');
            return;
        }
        if (nuevoNombre === categoriaSeleccionada) {
            restablecerFormularioEdicionCategoria();
            return;
        }
        if (categoriasFormatosYSubprocesos[nuevoNombre]) {
            alert(`Ya existe una categoría con el nombre "${nuevoNombre}".`);
            return;
        }

        // Renombra la categoría manteniendo sus datos
        categoriasFormatosYSubprocesos[nuevoNombre] = categoriasFormatosYSubprocesos[categoriaSeleccionada];
        delete categoriasFormatosYSubprocesos[categoriaSeleccionada];

        guardarEnLocalStorage();
        renderizarDropdownCategorias(); // Re-renderiza y selecciona el nuevo nombre
        dropdownCategorias.value = nuevoNombre; // Asegura la selección
        dropdownCategorias.dispatchEvent(new Event('change')); // Dispara el evento para actualizar dependientes
        restablecerFormularioEdicionCategoria();
    });

    // Evento para el botón "Cancelar" de edición de categoría
    btnCancelarEdicionCategoria.addEventListener('click', () => {
        restablecerFormularioEdicionCategoria();
    });

    // 4. Agregar Nuevo Formato
    btnAgregarFormato.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        if (!categoriaSeleccionada) {
            alert('Por favor, selecciona una categoría antes de agregar un formato.');
            return;
        }
        if (!isCategoryActive(categoriaSeleccionada)) {
            alert('No se puede agregar formatos a una categoría deshabilitada. Por favor, habilítala primero.');
            return;
        }

        const nombreNuevoFormato = inputNombreNuevoFormato.value.trim();
        if (!nombreNuevoFormato) {
            alert('Por favor, ingresa un nombre para el nuevo formato.');
            return;
        }
        if (categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[nombreNuevoFormato]) {
            alert(`El formato "${nombreNuevoFormato}" ya existe en esta categoría.`);
            return;
        }

        categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[nombreNuevoFormato] = { activo: true, subprocesos: [] };
        guardarEnLocalStorage();
        renderizarDropdownFormatos(categoriaSeleccionada); // Re-renderiza y selecciona el formato
        inputNombreNuevoFormato.value = '';
        restablecerFormularioEdicionFormato();
    });

    // 5. Selección de Formato en el Dropdown
    dropdownFormatos.addEventListener('change', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const formatoSeleccionado = dropdownFormatos.value;
        const categoriaActiva = isCategoryActive(categoriaSeleccionada);
        const formatoActivo = isFormatActive(categoriaSeleccionada, formatoSeleccionado);

        const isFormatSelected = !!formatoSeleccionado;

        mensajeNoFormatoSeleccionadoParaSubprocesos.style.display = isFormatSelected ? 'none' : 'block';
        areaInputSubproceso.style.display = isFormatSelected ? 'block' : 'none';
        btnDeshabilitarFormato.style.display = isFormatSelected ? 'inline-block' : 'none';
        btnEditarFormato.style.display = isFormatSelected ? 'inline-block' : 'none';

        if (isFormatSelected) {
            btnDeshabilitarFormato.textContent = formatoActivo ? 'Deshabilitar Formato' : 'Habilitar Formato';
            btnDeshabilitarFormato.classList.toggle('btn-danger', formatoActivo);
            btnDeshabilitarFormato.classList.toggle('btn-success', !formatoActivo);
            btnEditarFormato.disabled = !formatoActivo || !categoriaActiva;
            btnAgregarSubproceso.disabled = !formatoActivo || !categoriaActiva;
        } else {
            // Si no hay formato seleccionado, asegura que estén deshabilitados
            btnAgregarSubproceso.disabled = true;
        }

        renderizarListaSubprocesos(categoriaSeleccionada, formatoSeleccionado);
        restablecerFormularioEdicionFormato();
        restablecerFormularioSubproceso();
    });

    // 6. Habilitar/Deshabilitar Formato
    btnDeshabilitarFormato.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const formatoSeleccionado = dropdownFormatos.value;
        if (!categoriaSeleccionada || !formatoSeleccionado) return;

        const formatoObj = categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[formatoSeleccionado];
        const nuevoEstado = !formatoObj.activo;

        let mensaje = nuevoEstado ?
            `¿Estás seguro de que quieres HABILITAR el formato "${formatoSeleccionado}"? Esto también habilitará sus subprocesos.` :
            `¿Estás seguro de que quieres DESHABILITAR el formato "${formatoSeleccionado}"? Esto también deshabilitará sus subprocesos.`;

        if (confirm(mensaje)) {
            formatoObj.activo = nuevoEstado;
            formatoObj.subprocesos.forEach(sub => sub.activo = nuevoEstado);
            guardarEnLocalStorage();
            renderizarDropdownFormatos(categoriaSeleccionada); // Re-renderiza y selecciona el formato
        }
    });

    // Evento para el botón "Editar Formato"
    btnEditarFormato.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const formatoSeleccionado = dropdownFormatos.value;
        if (!categoriaSeleccionada || !formatoSeleccionado) {
            alert('Por favor, selecciona un formato para editar.');
            return;
        }
        if (!isCategoryActive(categoriaSeleccionada) || !isFormatActive(categoriaSeleccionada, formatoSeleccionado)) {
            alert('No se puede editar un formato deshabilitado o de una categoría deshabilitada. Por favor, habilítalos primero.');
            return;
        }

        areaEdicionFormato.style.display = 'block';
        inputNombreEdicionFormato.value = formatoSeleccionado;
        inputNombreEdicionFormato.focus();
        estaEditandoFormato = true;
        categoriaEdicionFormatoActual = categoriaSeleccionada;
        nombreFormatoEdicionActual = formatoSeleccionado;
    });

    // Evento para el botón "Guardar Cambios" de formato
    btnGuardarNombreFormato.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const formatoSeleccionado = dropdownFormatos.value;
        const nuevoNombre = inputNombreEdicionFormato.value.trim();

        if (!categoriaSeleccionada || !formatoSeleccionado || !estaEditandoFormato) {
            restablecerFormularioEdicionFormato();
            return;
        }
        if (!nuevoNombre) {
            alert('El nombre del formato no puede estar vacío.');
            return;
        }
        if (nuevoNombre === formatoSeleccionado) {
            restablecerFormularioEdicionFormato();
            return;
        }
        if (categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[nuevoNombre]) {
            alert(`Ya existe un formato con el nombre "${nuevoNombre}" en esta categoría.`);
            return;
        }

        // Renombra el formato manteniendo sus datos
        categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[nuevoNombre] = categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[formatoSeleccionado];
        delete categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[formatoSeleccionado];

        guardarEnLocalStorage();
        renderizarDropdownFormatos(categoriaSeleccionada); // Re-renderiza y selecciona el nuevo nombre
        dropdownFormatos.value = nuevoNombre; // Asegura la selección
        dropdownFormatos.dispatchEvent(new Event('change')); // Dispara el evento para actualizar dependientes
        restablecerFormularioEdicionFormato();
    });

    // Evento para el botón "Cancelar" de edición de formato
    btnCancelarEdicionFormato.addEventListener('click', () => {
        restablecerFormularioEdicionFormato();
    });

    // 7. Agregar/Guardar Sub Proceso
    btnAgregarSubproceso.addEventListener('click', () => {
        const categoriaSeleccionada = dropdownCategorias.value;
        const formatoSeleccionado = dropdownFormatos.value;

        if (!categoriaSeleccionada) {
            alert('Por favor, selecciona una categoría antes de agregar un sub proceso.');
            return;
        }
        if (!formatoSeleccionado) {
            alert('Por favor, selecciona un formato antes de agregar un sub proceso.');
            return;
        }
        if (!isCategoryActive(categoriaSeleccionada) || !isFormatActive(categoriaSeleccionada, formatoSeleccionado)) {
            alert('No se puede agregar subprocesos a un formato o categoría deshabilitada. Por favor, habilítalos primero.');
            return;
        }

        const codigo = inputCodigoSubproceso.value.trim();
        const nombre = inputNombreSubproceso.value.trim();
        const precio = parseFloat(inputPrecioSubproceso.value);

        if (!codigo) {
            alert('El código del sub proceso no puede estar vacío.');
            return;
        }
        if (!nombre) {
            alert('El nombre del sub proceso no puede estar vacío.');
            return;
        }
        if (isNaN(precio) || precio < 0) {
            alert('Por favor, ingresa un precio válido (número no negativo).');
            return;
        }

        const subprocesosActuales = categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[formatoSeleccionado].subprocesos;

        if (estaEditandoSubproceso && categoriaEdicionSubprocesoActual === categoriaSeleccionada && formatoEdicionSubprocesoActual === formatoSeleccionado && indiceEdicionSubprocesoActual !== -1) {
            // Al editar, verificar que el nuevo código/nombre no exista en OTRO subproceso
            const subprocesoExiste = subprocesosActuales.some((sp, idx) =>
                (sp.codigo === codigo || sp.nombre === nombre) && idx !== indiceEdicionSubprocesoActual
            );
            if (subprocesoExiste) {
                alert(`Ya existe otro sub proceso con el código "${codigo}" o el nombre "${nombre}" en este formato.`);
                return;
            }

            subprocesosActuales[indiceEdicionSubprocesoActual].codigo = codigo;
            subprocesosActuales[indiceEdicionSubprocesoActual].nombre = nombre;
            subprocesosActuales[indiceEdicionSubprocesoActual].precio = precio;
        } else {
            // Al agregar, verificar que el código/nombre no exista en NINGÚN subproceso
            const subprocesoExiste = subprocesosActuales.some(sp => sp.codigo === codigo || sp.nombre === nombre);
            if (subprocesoExiste) {
                alert(`Ya existe un sub proceso con el código "${codigo}" o el nombre "${nombre}" en este formato.`);
                return;
            }
            categoriasFormatosYSubprocesos[categoriaSeleccionada].formatos[formatoSeleccionado].subprocesos.push({ codigo, nombre, precio, activo: true });
        }

        guardarEnLocalStorage();
        renderizarListaSubprocesos(categoriaSeleccionada, formatoSeleccionado);
        restablecerFormularioSubproceso();
    });

    // --- Funciones para manejar eventos de subprocesos ---
    // Estas funciones separadas mejoran la legibilidad y mantenimiento
    function handleToggleSubprocesoState(event) {
        const objetivo = event.target;
        // Solo actúa si el botón presionado es el de alternar estado
        if (objetivo.classList.contains('btn-toggle-subproceso-estado')) {
            const categoria = objetivo.dataset.categoria;
            const formato = objetivo.dataset.formato;
            const indiceAToggle = parseInt(objetivo.dataset.indice);

            // Verificaciones de existencia y validez
            if (!categoria || !formato || !categoriasFormatosYSubprocesos[categoria]?.formatos?.[formato]?.subprocesos || isNaN(indiceAToggle)) {
                return;
            }

            const subproceso = categoriasFormatosYSubprocesos[categoria].formatos[formato].subprocesos[indiceAToggle];
            if (!subproceso) return; // Asegurar que el subproceso exista

            const nuevoEstado = !subproceso.activo;

            // Restricciones de habilitación/deshabilitación basadas en la jerarquía
            if (!isCategoryActive(categoria)) {
                alert(`No se puede ${nuevoEstado ? 'habilitar' : 'deshabilitar'} este subproceso porque su categoría ("${categoria}") está deshabilitada. Habilita la categoría primero.`);
                return;
            }
            if (!isFormatActive(categoria, formato)) {
                alert(`No se puede ${nuevoEstado ? 'habilitar' : 'deshabilitar'} este subproceso porque su formato ("${formato}") está deshabilitado. Habilita el formato primero.`);
                return;
            }

            let mensajeConfirmacion = nuevoEstado ?
                `¿Estás seguro de que quieres HABILITAR el subproceso "${subproceso.nombre}"?` :
                `¿Estás seguro de que quieres DESHABILITAR el subproceso "${subproceso.nombre}"?`;

            if (confirm(mensajeConfirmacion)) {
                subproceso.activo = nuevoEstado;
                guardarEnLocalStorage();
                renderizarListaSubprocesos(categoria, formato);
                restablecerFormularioSubproceso();
            }
        }
    }

    function handleEditSubproceso(event) {
        const objetivo = event.target;
        // Solo actúa si el botón presionado es el de editar
        if (objetivo.classList.contains('btn-editar-subproceso')) {
            const categoria = objetivo.dataset.categoria;
            const formato = objetivo.dataset.formato;
            const indiceAEditar = parseInt(objetivo.dataset.indice);

            // Verificaciones de existencia y validez
            if (!categoria || !formato || !categoriasFormatosYSubprocesos[categoria]?.formatos?.[formato]?.subprocesos || isNaN(indiceAEditar)) {
                return;
            }

            const subproceso = categoriasFormatosYSubprocesos[categoria].formatos[formato].subprocesos[indiceAEditar];
            if (!subproceso) return; // Asegurar que el subproceso exista

            // Restricciones de edición basadas en el estado de la jerarquía
            if (!isCategoryActive(categoria) || !isFormatActive(categoria, formato) || !subproceso.activo) {
                alert('No se puede editar un subproceso que está deshabilitado o que pertenece a un formato/categoría deshabilitada. Por favor, habilítalos primero.');
                return;
            }

            // Carga los datos del subproceso en el formulario
            inputCodigoSubproceso.value = subproceso.codigo;
            inputNombreSubproceso.value = subproceso.nombre;
            inputPrecioSubproceso.value = subproceso.precio;

            // Cambia el texto y estilo del botón principal de agregar/guardar
            btnAgregarSubproceso.textContent = 'Guardar Cambios Sub Proceso';
            btnAgregarSubproceso.classList.remove('btn-success');
            btnAgregarSubproceso.classList.add('btn-warning');

            // Actualiza las variables de estado para el modo de edición
            estaEditandoSubproceso = true;
            categoriaEdicionSubprocesoActual = categoria;
            formatoEdicionSubprocesoActual = formato;
            indiceEdicionSubprocesoActual = indiceAEditar;
        }
    }

    // 8. Delegación de eventos para los botones de la lista de subprocesos
    listaSubprocesosDiv.addEventListener('click', (event) => {
        handleToggleSubprocesoState(event); // Intenta manejar el cambio de estado
        handleEditSubproceso(event);       // Intenta manejar la edición
    });

    // Cargar datos y renderizar al inicio
    cargarDeLocalStorage();
    renderizarDropdownCategorias(); // Inicia el renderizado de la interfaz
});