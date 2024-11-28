async function fetchAppsAtivos() {
    try {
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem('selectedMemberId'); 
        const response = await fetch(`http://localhost:8080/user/f/${id}/apps-abertos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar apps abertos');
        }
        console.log("lista apps")
        const data = await response.json();
        preencherTabelaAppsAtivos(data); 
    } catch (error) {
        console.error('Erro:', error);
    }
}

function preencherTabelaAppsAtivos(data) {
    const tableBody = document.querySelector('.tabela-apps-ativos tbody');
    tableBody.innerHTML = ''; 

    const now = new Date();

    data.forEach((app) => {
        const row = document.createElement('tr');

        const nomeCell = document.createElement('td');
        nomeCell.textContent = app.nome;
        row.appendChild(nomeCell);

        const horaInicio = new Date(app.hora_inicio); 
        const diffMs = now - horaInicio; 
        const diffMins = Math.floor(diffMs / 60000); 
        const horas = Math.floor(diffMins / 60);
        const minutos = diffMins % 60;
        const tempoUso = `${horas > 0 ? horas + 'h ' : ''}${minutos}min`;

        const tempoCell = document.createElement('td');
        tempoCell.textContent = tempoUso;
        row.appendChild(tempoCell);

        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', fetchAppsAtivos);
