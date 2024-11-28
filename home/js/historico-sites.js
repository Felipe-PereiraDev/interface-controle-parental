async function fetchURLs() {
    try {
            const dateValue = document.getElementById('data-historico').value || new Date().toISOString().split('T')[0];
            console.log(dateValue);

            const dataObj = new Date(dateValue);
            const ano = dataObj.getFullYear();
            const mes = String(dataObj.getMonth()+ 1).padStart(2, '0'); 
            const dia = String(dataObj.getDate()).padStart(2, '0');
            const dataFormatada = `${ano}-${mes}-${dia}`;
            console.log("data formataaaaaaaaaaaaaa", dataFormatada);


        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem('selectedMemberId'); 
        const response = await fetch(`http://localhost:8080/user/f/${id}/historico-sites/${dataFormatada}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar URLs');
        }
        const data = await response.json();
        preencherTabelaHistorico(data); 
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para popular a tabela com os dados da API
function preencherTabelaHistorico(data) {
    const tableBody = document.querySelector('#tabela-historico tbody');
    tableBody.innerHTML = ''; 
    data.forEach((site) => {
        const row = document.createElement('tr');

        const urlCell = document.createElement('td');
        urlCell.textContent = site.url;
        urlCell.classList.add("limited-text");
        row.appendChild(urlCell);

        const contentCell = document.createElement('td');
        contentCell.textContent = site.conteudo;
        row.appendChild(contentCell);

        const [data, hora] = site.dataVisitada.split("T");

        const dataCell = document.createElement('td');
        dataCell.textContent = data.split("-").reverse().join("/");
        row.appendChild(dataCell);

        const horaCell = document.createElement('td');
        horaCell.textContent = hora.substring(0, 5); 
        row.appendChild(horaCell);

        tableBody.appendChild(row); 
    });
}

document.getElementById('data-historico').addEventListener('change', function() {
    fetchURLs(); 
});

document.addEventListener('DOMContentLoaded', fetchURLs); 
function getDate() {
    const dateValue = document.querySelector('.calendar-container .date-picker').value;
    console.log(dateValue); 
    alert('Data selecionada: ' + dateValue); 
}
document.addEventListener('DOMContentLoaded', fetchURLs);

document.getElementById('data-historico').addEventListener('change', function() {
    var dataSelecionada = this.value;
    var linhasHistorico = document.querySelectorAll('#historico-body tr');
    
    linhasHistorico.forEach(function(linha) {
        var dataLinha = linha.cells[2].textContent;
        if (dataSelecionada && dataLinha !== dataSelecionada.split('-').reverse().join('/')) {
            linha.style.display = 'none';
        } else {
            linha.style.display = '';
        }
    });
});