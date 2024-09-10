document.addEventListener('DOMContentLoaded', function () {
    // Mostrar los chequeos guardados y la última actualización cuando se carga la página
    mostrarChequeos();
    mostrarUltimaActualizacion();
    console.log('DOM fully loaded and parsed');

    // Configurar el buscador de servicios
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', buscarServicio);
    }

    // Configurar los formularios de chequeo
    const sanBernardoForm = document.getElementById('sanBernardoForm');
    const papaFranciscoForm = document.getElementById('papaFranciscoForm');
    const milagroForm = document.getElementById('milagroForm');

    if (sanBernardoForm) {
        sanBernardoForm.addEventListener('submit', function (event) {
            event.preventDefault();
            guardarChequeo('sanBernardo', sanBernardoForm);
        });
    }

    if (papaFranciscoForm) {
        papaFranciscoForm.addEventListener('submit', function (event) {
            event.preventDefault();
            guardarChequeo('papaFrancisco', papaFranciscoForm);
        });
    }

    if (milagroForm) {
        milagroForm.addEventListener('submit', function (event) {
            event.preventDefault();
            guardarChequeo('milagro', milagroForm);
        });
    }
});

// Nombres de los servicios para cada hospital
const serviceNames = {
    // San Bernardo
    cardioSB: 'Cardiología',
    cabezaCuelloSB: 'Cabeza y cuello',
    cirGralSB: 'Cirugía general',
    citoSB: 'Citodiagnóstico',
    cliMedSB: 'Clínica médica',
    dermaSB: 'Dermatología',
    gastroSB: 'Gastroenterología',
    ginecoSB: 'Ginecología',
    nefroSB: 'Nefrología',
    neuroCirSB: 'Neurocirugía',
    neuroSB: 'Neurología',
    oftaSB: 'Oftalmología',
    oncoSB: 'Oncología',
    orlSB: 'Otorrinolaringología (ORL)',
    proctoSB: 'Proctología',
    quemadosSB: 'Quemados',
    traumatoSB: 'Traumatología',
    urologiaSB: 'Urología',
    vascularSB: 'Cirugía vascular',

    // Papa Francisco
    CabezaCuelloPf: 'Cabeza y cuello',
    CardioPf: 'Cardiología (Mayores de 15)',
    cirGralPf: 'Cirugía general',
    dbtPf: 'Diabetes',
    endocrinoPf: 'Endocrinología',
    infectoPf: 'Infectología',
    neuroPf: 'Neurología',
    pediaPf: 'Pediatría',
    traumatoPf: 'Traumatología',
    uroPf: 'Urología',

    // Milagro
    alergiaSM: 'Alergia',
    cardioSM: 'Cardiología',
    dermaSM: 'Dermatología',
    dbtSM: 'Diabetes',
    gastroSM: 'Gastroenterología',
    ginecoSM: 'Ginecología',
    nefroSM: 'Nefrología',
    oftalmoSM: 'Oftalmología',
    orlSM: 'Otorrinolaringología (ORL)',
};

// Función para guardar el chequeo en localStorage
function guardarChequeo(hospitalKey, form) {
    const formData = new FormData(form);
    const timestamp = new Date().toLocaleString(); // Fecha y hora actual

    let tableContent = '';
    let habilitacionDate = 'No disponible'; // Valor predeterminado para la fecha de habilitación

    // Ajustamos el nombre del campo para capturar la fecha de habilitación
    const habilitacionFieldName = `habilitacion${hospitalKey.charAt(0).toUpperCase() + hospitalKey.slice(1)}`;
    if (formData.has(habilitacionFieldName)) {
        habilitacionDate = formData.get(habilitacionFieldName) || 'No disponible';
    }

    const observaciones = {};

    // Capturar las observaciones
    formData.forEach((value, key) => {
        if (key.startsWith('obs')) {
            const serviceKey = key.replace('obs', ''); // Elimina el prefijo 'obs' para obtener la clave del servicio
            observaciones[serviceKey] = value || '-';  // Asocia la observación con la clave del servicio
        }
    });

    // Procesar los servicios y sus observaciones
    formData.forEach((value, key) => {
        if (!key.startsWith('obs') && key !== habilitacionFieldName) {
            const serviceName = serviceNames[key] || key; // Usa la clave del servicio o el nombre real
            const obsValue = observaciones[key] || '-';   // Busca la observación correspondiente a la clave del servicio
            tableContent += `<tr><td>${serviceName}</td><td>${value}</td><td>${obsValue}</td></tr>`;
        }
    });

    const hospitalData = {
        tableContent: tableContent,
        timestamp: timestamp,
        habilitacionDate: habilitacionDate
    };

    localStorage.setItem(`${hospitalKey}Data`, JSON.stringify(hospitalData));

    alert('Chequeo actualizado con éxito!');
    form.reset();
    mostrarChequeos();
}


// Función para mostrar los chequeos guardados
function mostrarChequeos() {
    const hospitales = ['sanBernardo', 'papaFrancisco', 'milagro'];

    hospitales.forEach(hospitalKey => {
        const data = JSON.parse(localStorage.getItem(`${hospitalKey}Data`));
        const tableBody = document.querySelector(`#${hospitalKey}Table tbody`);
        const timestampElement = document.getElementById(`${hospitalKey}Timestamp`);
        const habilitacionElement = document.getElementById(`${hospitalKey}Habilitacion`);

        if (tableBody && timestampElement && habilitacionElement) {
            if (data) {
                tableBody.innerHTML = data.tableContent;
                timestampElement.textContent = `Última actualización: ${data.timestamp}`;
                habilitacionElement.textContent = `Fecha de habilitación: ${data.habilitacionDate}`;
            } else {
                console.warn(`No hay datos guardados para ${hospitalKey}.`);
            }
        } else {
            console.log(`Elemento(s) faltante(s) en el DOM para ${hospitalKey}.`);
        }
    });
}


// Función para mostrar la última actualización
function mostrarUltimaActualizacion() {
    const hospitales = ['sanBernardo', 'papaFrancisco', 'milagro'];

    hospitales.forEach(hospitalKey => {
        const data = JSON.parse(localStorage.getItem(`${hospitalKey}Data`));
        const timestampElement = document.getElementById(`${hospitalKey}Timestamp`);

        if (data) {
            if (timestampElement) {
                timestampElement.textContent = `Última actualización: ${data.timestamp}`;
            } else {
                console.error(`Elemento timestamp para ${hospitalKey} no encontrado.`);
            }
        } else {
            if (timestampElement) {
                timestampElement.textContent = 'Última actualización: No disponible';
            }
        }
    });
}

// Función para buscar un servicio específico en las tablas
function buscarServicio(event) {
    const searchTerm = event.target.value.toLowerCase();
    const hospitales = ['sanBernardo', 'papaFrancisco', 'milagro'];

    hospitales.forEach(hospitalKey => {
        const tableRows = document.querySelectorAll(`#${hospitalKey}Table tbody tr`);
        let hasResults = false;

        tableRows.forEach(row => {
            const serviceName = row.querySelector('td').textContent.toLowerCase();
            if (serviceName.includes(searchTerm)) {
                row.style.display = '';
                hasResults = true;
            } else {
                row.style.display = 'none';
            }
        });

        const noResultElement = document.getElementById(`${hospitalKey}NoResult`);
        if (noResultElement) {
            noResultElement.style.display = hasResults ? 'none' : '';
        }
    });
}

if (window.location.pathname.endsWith('check.html')) {
    mostrarChequeos();
}

if (window.location.pathname.endsWith('index.html')) {
    mostrarUltimaActualizacion();
}
