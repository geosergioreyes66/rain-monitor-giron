// Variables globales
let currentPage = 1;
let rowsPerPage = 10;
let datos = [];

// Función para cargar datos desde el archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('data/rain_data.json');
        datos = await response.json();
        actualizarTablaYGrafica();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarError('Error al cargar los datos. Por favor, intenta más tarde.');
    }
}

function actualizarTablaYGrafica() {
    mostrarFilasFiltradas();
    actualizarGraficaPorPeriodo('mes');
    actualizarUltimaActualizacion();
}

function mostrarFilasFiltradas() {
    const yearFilter = document.getElementById('yearFilter').value;
    const monthFilter = document.getElementById('monthFilter').value;
    const dayFilter = document.getElementById('dayFilter').value;
    
    let datosFiltrados = datos.filter(row => {
        const [year, month, day] = row.fecha.split('-');
        return (!yearFilter || year === yearFilter) &&
               (!monthFilter || month === monthFilter) &&
               (!dayFilter || day === dayFilter);
    });

    actualizarTotalLluvia(datosFiltrados);
    actualizarTabla(datosFiltrados);
    actualizarPaginacion(Math.ceil(datosFiltrados.length / rowsPerPage));
}

function actualizarTotalLluvia(datosFiltrados) {
    const totalLluvia = datosFiltrados.reduce((sum, row) => sum + row.lluvia, 0);
    document.getElementById('totalLluvia').textContent = totalLluvia.toFixed(4);
}

function actualizarTabla(datosFiltrados) {
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = datosFiltrados.slice(start, start + rowsPerPage);

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    paginatedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.fecha}</td>
            <td>${row.hora}</td>
            <td>${row.pulsos}</td>
            <td>${row.lluvia.toFixed(4)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarUltimaActualizacion() {
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('ultima_actualizacion').textContent = fechaFormateada;
}

function mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    
    // Agregar event listeners para filtros
    document.getElementById('yearFilter').addEventListener('change', mostrarFilasFiltradas);
    document.getElementById('monthFilter').addEventListener('change', mostrarFilasFiltradas);
    document.getElementById('dayFilter').addEventListener('change', mostrarFilasFiltradas);
});
