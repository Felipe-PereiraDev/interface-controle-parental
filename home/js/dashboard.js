// Gráfico de Uso (Aplicativos)
 async function obterDadosAPI() {
    const token = localStorage.getItem("accessToken"); 
   
    const id = localStorage.getItem('selectedMemberId'); 
    try {
        const response = await fetch(`http://localhost:8080/user/f/${id}/grafico-uso-mensal`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados da API');
        }
        
        const dados = await response.json(); 
        return dados;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}

// Função para preencher os dados no dashboard
function atualizarDashboard(dados) {
    if (!dados) {
        console.error('Nenhum dado recebido da API');
        return;
    }

    document.querySelector('#tempo-uso p').textContent = dados.tempoUsoApp;
    
    document.querySelector('#media-diaria p').textContent = dados.mediaDiaria;
    
    const tabelaBody = document.querySelector('#tabela-tempo-uso tbody');
    tabelaBody.innerHTML = ''; 
    
    for (const [app, tempo] of Object.entries(dados.appsESites)) {
        const novaLinha = `
            <tr>
                <td>${app}</td>
                <td>${tempo}</td>
            </tr>
        `;
        tabelaBody.insertAdjacentHTML('beforeend', novaLinha);
    }
}


async function carregarDashboard() {
    const dadosAPI = await obterDadosAPI(); 
    atualizarDashboard(dadosAPI); 
}

document.addEventListener('DOMContentLoaded', carregarDashboard);


var ctx = document.getElementById('appUsageChart').getContext('2d');
var appUsageChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [], 
        datasets: [{
            label: 'Tempo de Uso (Horas)',
            data: [], 
            backgroundColor: ['#6AB0A3', '#70D1B0', '#9AD6C1', '#4FB489'],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


function atualizarGrafico(dados) {
    const apps = Object.keys(dados.appsESites); 

    const temposUso = Object.values(dados.appsESites).map(tempo => {
        let horas = 0;
        let minutos = 0;

        if (tempo.includes('h')) {
            const partes = tempo.split('h');
            horas = parseInt(partes[0].trim()); 
            if (partes[1] && partes[1].includes('min')) {
                minutos = parseInt(partes[1].replace('min', '').trim()); 
            }
        } else {
            minutos = parseInt(tempo.replace('min', '').trim());
        }

        return horas + (minutos / 60); 
    });

    appUsageChart.data.labels = apps;
    appUsageChart.data.datasets[0].data = temposUso;

    appUsageChart.update();
}

const dadosAPI = {
    "appsESites": {
        "Insomnia": "1h 27min",
        "Chrome": "1h 35min",
        "Spotify": "42min",
        "WhatsApp": "28min"
    }
};

atualizarGrafico(dadosAPI);

// Gráfico de Uso (Sites)
var ctx2 = document.getElementById('siteUsageChart').getContext('2d');
var siteUsageChart = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Instagram', 'YouTube', 'Facebook', 'Wikipedia'],
        datasets: [{
            label: 'Quantidade de acessos',
            data: [1, 2, 3, 1],
            backgroundColor: ['#6AB0A3', '#70D1B0', '#9AD6C1', '#4FB489'],
            borderColor: ['#FFFFFF'],
            borderWidth: 3
        }]
    }
});

// tela de gerenciamento de aplicativos 
document.getElementById('data').addEventListener('change', function() {
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

const dropdownItems = document.querySelectorAll('.semana');

dropdownItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();

        const selectedValue = this.getAttribute('data-value');
        
        
        alert('Você selecionou: ' + selectedValue);

        if (selectedValue === 'semana') {
            relatorioSemanal(); 
        } else if (selectedValue === 'mensal') {
            relatorioMensal();
        }
    });
});


async function relatorioMensal(mes) {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem('selectedMemberId'); 

    try {
        const url = mes ? `http://localhost:8080/user/r/${id}/relatorio-mensal?mes=${mes}` : `http://localhost:8080/user/r/${id}/relatorio-mensal`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar relatório mensal');
        }

        console.log('Resposta:', response);
        return response;  

    } catch (error) {
        console.error('Erro:', error);
        throw error;  
    }
}

async function relatorioSemanal() {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem('selectedMemberId'); 

    try {
        const response = await fetch(`http://localhost:8080/user/r/${id}/relatorio-semanal`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar relatório semanal');
        }

        console.log('Resposta:', response);
        return response;  

    } catch (error) {
        console.error('Erro:', error);
        throw error;  
    }
}


document.getElementById("openModal").addEventListener("click", function () {
    document.getElementById("relatorioModal").style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("relatorioModal").style.display = "none";
});

window.addEventListener("click", function (event) {
    const modal = document.getElementById("relatorioModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});



document.getElementById("relatorioForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const loadingSpinner = document.getElementById("loadingSpinner");
    loadingSpinner.style.display = "inline-block";  
    document.getElementById("message").style.display = "none";  
    
    const tipoRelatorio = document.getElementById("tipoRelatorio").value;
    let mesRelatorio = document.getElementById("mesRelatorio").value.replace("2024-", "");
    
    const mesAtual = new Date().getMonth() + 1;  
    
    if (parseInt(mesRelatorio) === mesAtual) {
        mesRelatorio = null;
    }
    
    console.log(`Gerando relatório ${tipoRelatorio} para o mês: ${mesRelatorio}`);
    
    let relatorioFuncao = tipoRelatorio === "semanal" ? relatorioSemanal : () => relatorioMensal(mesRelatorio);
    
    relatorioFuncao()
        .then(() => {
            showMessage('Relatório gerado com sucesso e enviado para o email!', 'success');
        })
        .catch(error => {
            console.error('Erro ao gerar relatório:', error);
            showMessage('Erro ao gerar relatório. Tente novamente.', 'error');
        })
        .finally(() => {
            loadingSpinner.style.display = "none"; 
        });
});

function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.className = type;  
    messageDiv.style.display = "block";  
}


document.getElementById('tipoRelatorio').addEventListener('change', function () {
    const tipoRelatorio = this.value; 
    const mesRelatorioDiv = document.querySelector('.form-group:nth-child(2)'); 

    if (tipoRelatorio === 'mensal') {
        mesRelatorioDiv.style.display = 'block';
    } else {
        mesRelatorioDiv.style.display = 'none'; 
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tipoRelatorio = document.getElementById('tipoRelatorio').value;
    const mesRelatorioDiv = document.querySelector('.form-group:nth-child(2)');
    
    if (tipoRelatorio === 'mensal') {
        mesRelatorioDiv.style.display = 'block';
    } else {
        mesRelatorioDiv.style.display = 'none';
    }
});

