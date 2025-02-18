// Funciones para manejo de gráficas

function actualizarGraficaPorPeriodo(periodo) {
    const hoy = new Date();
    const datosPorDia = {};
    
    datos.forEach(row => {
        const fechaObj = new Date(row.fecha);
        let incluirDato = false;
        
        switch(periodo) {
            case 'dia':
                incluirDato = row.fecha === hoy.toISOString().split('T')[0];
                break;
            case 'semana':
                const unaSemanaAtras = new Date(hoy);
                unaSemanaAtras.setDate(hoy.getDate() - 7);
                incluirDato = fechaObj >= unaSemanaAtras && fechaObj <= hoy;
                break;
            case 'mes':
                incluirDato = fechaObj.getMonth() === hoy.getMonth() && 
                             fechaObj.getFullYear() === hoy.getFullYear();
                break;
        }
        
        if (incluirDato) {
            if (!datosPorDia[row.fecha]) {
                datosPorDia[row.fecha] = 0;
            }
            datosPorDia[row.fecha] += row.lluvia;
        }
    });

    const fechas = Object.keys(datosPorDia).sort();
    const valores = fechas.map(fecha => datosPorDia[fecha]);
    
    const trace = {
        x: fechas,
        y: valores,
        type: 'bar',
        marker: { 
            color: '#4682B4',
            line: {
                color: '#2E5984',
                width: 1.5
            }
        },
        hovertemplate: '<b>Fecha:</b> %{x}<br>' +
                      '<b>Lluvia:</b> %{y:.2f} mm<br>' +
                      '<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'Lluvia Diaria Total (mm)',
            font: {
                size: 24,
                color: '#333'
            }
        },
        xaxis: { 
            title: 'Fecha',
            tickangle: 45,
            gridcolor: '#eee',
            linecolor: '#999'
        },
        yaxis: { 
            title: 'Lluvia (mm)',
            gridcolor: '#eee',
            linecolor: '#999',
            tickformat: '.2f'
        },
        margin: { 
            b: 100,
            t: 50,
            r: 20,
            l: 60 
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        showlegend: false,
        hovermode: 'closest',
        barmode: 'relative',
        bargap: 0.2
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
            'lasso2d',
            'select2d',
            'toggleSpikelines'
        ]
    };
    
    Plotly.newPlot('grafica', [trace], layout, config);
}

function cambiarPeriodo(periodo) {
    // Remover clase activa de todos los botones
    document.querySelectorAll('.period-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Agregar clase activa al botón seleccionado
    event.target.classList.add('active');
    
    // Actualizar gráfica
    actualizarGraficaPorPeriodo(periodo);
}

function actualizarPaginacion(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    
    // Botón anterior
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            mostrarFilasFiltradas();
        }
    };
    paginationDiv.appendChild(prevButton);

    // Botones de página
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    startPage = Math.max(1, endPage - maxButtons + 1);

    if (startPage > 1) {
        paginationDiv.appendChild(createPageButton(1));
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationDiv.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationDiv.appendChild(createPageButton(i));
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationDiv.appendChild(ellipsis);
        }
        paginationDiv.appendChild(createPageButton(totalPages));
    }

    // Botón siguiente
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            mostrarFilasFiltradas();
        }
    };
    paginationDiv.appendChild(nextButton);
}

function createPageButton(pageNum) {
    const button = document.createElement('button');
    button.textContent = pageNum;
    button.classList.toggle('active', pageNum === currentPage);
    button.onclick = () => {
        currentPage = pageNum;
        mostrarFilasFiltradas();
    };
    return button;
}
