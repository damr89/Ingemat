document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos de selección de categorías, formatos y CONTENEDOR DE SUB PROCESOS
    const categorySelect = document.getElementById('categorySelect');
    const formatSelect = document.getElementById('formatSelect');
    const subProcessDisplayDiv = document.getElementById('subProcessDisplay'); // div para mostrar subprocesos
    const addSelectedItemButton = document.getElementById('addSelectedItem');    
    const selectedFormatsListDiv = document.getElementById('selectedFormatsList');    

    // Referencias a los elementos de Gastos Adicionales
    const descripcionGastoInput = document.getElementById('descripcionGasto');
    const precioGastoInput = document.getElementById('precioGasto');
    const addGastoAdicionalButton = document.getElementById('addGastoAdicional');
    const listaGastosAdicionalesDiv = document.getElementById('listaGastosAdicionales');
    const totalEconomicaSpan = document.getElementById('totalEconomica');

    // Referencias al elemento de Forma de Pago (se eliminaron las de tipoCliente)
    const formaPagoSelect = document.getElementById('formaPago');

    let selectedFormats = [];    
    let additionalExpenses = [];    
    let categoriesAndFormats = {};

    // --- Funciones Auxiliares ---

    // Función para añadir una opción a un select
    function addOption(selectElement, text, value, disabled = false, selected = false) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        option.disabled = disabled;
        option.selected = selected;
        selectElement.appendChild(option);
    }

    // Función para generar el HTML de la lista de subprocesos
    function generateSubProcessesHtml(subProcesses) {
        if (!subProcesses || subProcesses.length === 0) {
            return '<p>No hay subprocesos definidos para este formato.</p>'; // Mensaje cuando no hay subprocesos
        }
        let html = '<ul class="sub-processes-list">';
        subProcesses.forEach(sub => {
            html += `<li>${sub}</li>`;
        });
        html += '</ul>';
        return html;
    }

    // Función para cargar las categorías y formatos desde localStorage
    function loadCategoriesAndFormatsFromStorage() {
        const storedData = localStorage.getItem('categoriesAndFormats');
        if (storedData) {
            categoriesAndFormats = JSON.parse(storedData);
        } else {
            // Datos por defecto si no hay nada en localStorage
            categoriesAndFormats = {
                "1. FORMATOS PARA RECEPCIÓN DE MUESTRAS Y ETIQUETADO": [
                    {    
                        name: "Recepcion de muestras de suelo,agregados petreos, mezcla asfaltica y aceros de refuerzo",    
                        code: "1.1",    
                        price: 8.00,
                        subProcesses: [
                            "Preparación de muestras para ensayo",
                            "Etiquetado según normativa",
                            "Registro en base de datos"
                        ]
                    },
                    {    
                        name: "Recepcion de tomas de nucleos de concreto",    
                        code: "1.2",    
                        price: 7.00,
                        subProcesses: [
                            "Verificación de integridad del núcleo",
                            "Medición de dimensiones",
                            "Almacenamiento en condiciones controladas",
                            "Ensayo de compresión"    
                        ]
                    }
                ],
                "2. INFORMES TÉCNICOS": [
                    {    
                        name: "Informe de Mecánica de Suelos",    
                        code: "3.1",    
                        price: 150.00,
                        subProcesses: [
                            "Análisis de datos de campo",
                            "Interpretación de resultados de laboratorio",
                            "Elaboración de recomendaciones"
                        ]
                    },
                    {    
                        name: "Informe Geotécnico",    
                        code: "3.2",    
                        price: 200.00,
                        subProcesses: [
                            "Estudio de estabilidad de taludes",
                            "Cálculo de capacidad de carga",
                            "Diseño de cimentaciones"
                        ]
                    }
                ]
            };
            localStorage.setItem('categoriesAndFormats', JSON.stringify(categoriesAndFormats));
        }
    }

    // Función para calcular y actualizar el total económico general
    function updateTotalEconomica() {
        let total = 0;
        selectedFormats.forEach(format => {
            total += parseFloat(format.price) || 0;
        });
        additionalExpenses.forEach(gasto => {
            total += parseFloat(gasto.precio) || 0;
        });
        totalEconomicaSpan.textContent = total.toFixed(2);
    }

    // Función para poblar los comboboxes de categoría y formato
    function populateCategoryAndFormatDropdowns() {
        categorySelect.innerHTML = ''; // Limpiar opciones existentes
        addOption(categorySelect, "Seleccione Categoría", ""); // Opción por defecto para categoría
        formatSelect.innerHTML = '';    
        addOption(formatSelect, "Seleccione Formato", ""); // Opción por defecto para formato
        subProcessDisplayDiv.innerHTML = '<p>Seleccione un formato para ver sus subprocesos.</p>'; // Mensaje inicial del div

        for (const categoryName in categoriesAndFormats) {
            addOption(categorySelect, categoryName, categoryName);
        }
    }

    // --- Lógica para Formatos Seleccionados ---

    // Event listener para el cambio de categoría
    categorySelect.onchange = () => {
        const selectedCategory = categorySelect.value;
        formatSelect.innerHTML = '';    
        addOption(formatSelect, "Seleccione Formato", ""); // Opción por defecto
        subProcessDisplayDiv.innerHTML = '<p>Seleccione un formato para ver sus subprocesos.</p>'; // Limpiar y poner mensaje

        if (selectedCategory && categoriesAndFormats[selectedCategory]) {
            categoriesAndFormats[selectedCategory].forEach(format => {
                const option = document.createElement('option');
                option.value = format.name;    
                option.textContent = `${format.name} (Cód: ${format.code})`;
                option.dataset.code = format.code;    
                option.dataset.price = format.price;    
                option.dataset.category = selectedCategory;    
                formatSelect.appendChild(option);
            });
        }
    };

    // Event listener para el cambio de formato (actualiza el div de subprocesos)
    formatSelect.onchange = () => {
        const selectedCategory = categorySelect.value;
        const selectedFormatName = formatSelect.value;
        subProcessDisplayDiv.innerHTML = ''; // Limpia el div

        if (selectedCategory && selectedFormatName && categoriesAndFormats[selectedCategory]) {
            const selectedFormatData = categoriesAndFormats[selectedCategory].find(
                f => f.name === selectedFormatName
            );

            if (selectedFormatData) {
                // Usamos la función auxiliar para generar el HTML y lo insertamos en el div
                subProcessDisplayDiv.innerHTML = generateSubProcessesHtml(selectedFormatData.subProcesses);
            } else {
                subProcessDisplayDiv.innerHTML = '<p>No se encontraron subprocesos para este formato.</p>';
            }
        } else {
            subProcessDisplayDiv.innerHTML = '<p>Seleccione un formato para ver sus subprocesos.</p>';
        }
    };


    // Función para renderizar (mostrar) la lista de formatos seleccionados
    function renderSelectedFormats() {
        selectedFormatsListDiv.innerHTML = '';    

        if (selectedFormats.length === 0) {
            selectedFormatsListDiv.innerHTML = '<p>No hay formatos seleccionados.</p>';
            updateTotalEconomica();    
            return;
        }

        selectedFormats.forEach((format, index) => {
            const subProcessesHtml = generateSubProcessesHtml(format.subProcesses);    

            const formatItemDiv = document.createElement('div'); // Declarar con const
            formatItemDiv.classList.add('selected-format-item');    
            formatItemDiv.innerHTML = `
                <div class="format-info-group">
                    <div class="format-category-header">${format.category}</div>
                    <div class="format-details-line">
                        <span class="format-name">${format.name}</span>    
                        (<span class="format-code">Cód: ${format.code}</span>) -    
                        <span class="format-price">S/ ${format.price.toFixed(2)}</span>
                    </div>
                    ${subProcessesHtml}    
                </div>
                <button type="button" class="btn btn-danger remove-selected-format" data-index="${index}">Eliminar</button>
            `;
            selectedFormatsListDiv.appendChild(formatItemDiv);
        });
        updateTotalEconomica();    
    }

    // Event listener para el botón "Agregar Formato"
    addSelectedItemButton.addEventListener('click', () => {
        const selectedOption = formatSelect.options[formatSelect.selectedIndex];

        if (selectedOption && selectedOption.value) {
            const selectedCategoryName = selectedOption.dataset.category;
            const selectedFormatName = selectedOption.value;

            const fullFormatData = categoriesAndFormats[selectedCategoryName].find(
                f => f.name === selectedFormatName
            );

            if (fullFormatData) {
                const newFormat = {
                    category: selectedCategoryName,
                    name: fullFormatData.name,
                    code: fullFormatData.code,
                    price: parseFloat(fullFormatData.price),
                    subProcesses: fullFormatData.subProcesses || []    
                };
                selectedFormats.push(newFormat);
                renderSelectedFormats();    

                // Resetear los selects después de agregar
                categorySelect.value = "";
                formatSelect.innerHTML = '';
                addOption(formatSelect, "Seleccione Formato", ""); // Opción por defecto
                subProcessDisplayDiv.innerHTML = '<p>Seleccione un formato para ver sus subprocesos.</p>'; // Resetear el div
            }
        } else {
            alert('Por favor, selecciona una categoría y un formato.');
        }
    });

    // Event listener para eliminar un formato seleccionado
    selectedFormatsListDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-selected-format')) {
            const indexToRemove = parseInt(event.target.dataset.index);
            selectedFormats.splice(indexToRemove, 1);    
            renderSelectedFormats();    
        }
    });


    // --- Lógica para Gastos Adicionales ---

    function renderGastosAdicionales() {
        listaGastosAdicionalesDiv.innerHTML = '';    

        if (additionalExpenses.length === 0) {
            listaGastosAdicionalesDiv.innerHTML = '<p>No hay gastos adicionales registrados.</p>';
            updateTotalEconomica();    
            return;
        }

        const ul = document.createElement('ul');
        additionalExpenses.forEach((gasto, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${gasto.descripcion}: S/ ${gasto.precio.toFixed(2)}</span>
                <button type="button" class="remove-gasto" data-index="${index}">Eliminar</button>
            `;
            ul.appendChild(li);
        });
        listaGastosAdicionalesDiv.appendChild(ul);
        updateTotalEconomica();    
    }

    addGastoAdicionalButton.addEventListener('click', () => {
        const descripcion = descripcionGastoInput.value.trim();
        const precio = parseFloat(precioGastoInput.value);

        if (descripcion && !isNaN(precio) && precio >= 0) {
            additionalExpenses.push({ descripcion, precio });    
            renderGastosAdicionales();    
            descripcionGastoInput.value = '';    
            precioGastoInput.value = '';        
        } else {
            alert('Por favor, ingresa una descripción y un precio válido para el gasto adicional.');
        }
    });

    listaGastosAdicionalesDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-gasto')) {
            const indexToRemove = parseInt(event.target.dataset.index);
            additionalExpenses.splice(indexToRemove, 1);
            renderGastosAdicionales();
        }
    });

    // --- Inicialización al cargar la página ---
    loadCategoriesAndFormatsFromStorage();    
    populateCategoryAndFormatDropdowns();    
    updateTotalEconomica();    
    renderSelectedFormats();    
    renderGastosAdicionales();    
    
    // Poblar el select de Forma de Pago directamente al cargar la página
    // Ya no depende del tipo de cliente, así que se establecen las opciones fijas.
    addOption(formaPagoSelect, "Seleccione una opción", "", true, true); // Opción deshabilitada por defecto
    addOption(formaPagoSelect, 'Por Cuotas (Pagos parciales programados)', 'cuotas');
    addOption(formaPagoSelect, 'Al contado antes del informe', 'contado_antes_informe');
    addOption(formaPagoSelect, 'Contra entrega', 'contra_entrega');
    addOption(formaPagoSelect, 'Al finalizar el proyecto del estado', 'finalizar_proyecto_estado');
});