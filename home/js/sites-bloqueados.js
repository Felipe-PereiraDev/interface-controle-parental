document.getElementById('site-form').addEventListener('submit', function (event) {
    event.preventDefault(); 
    let siteUrl = document.getElementById('site-url').value; 

    if (siteUrl) {
        console.log('URL enviada:', siteUrl);
        bloquearUrl(siteUrl);
        document.getElementById('site-url').value = '';
    } else {
        console.log('Nenhuma URL foi inserida.');
    }
});


async function bloquearUrl(url) {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem('selectedMemberId');  

    try {
        const response = await fetch(`http://localhost:8080/user/r/${id}/bloquear-url`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ url }) 
        });

        if (!response.ok) {
            throw new Error('Erro ao bloquear URLs');
        }

        // console.log('Resposta:', response);
    } catch (error) {
        console.error('Erro:', error);
    }
}


async function desbloquearUrl(url) {
    const token = localStorage.getItem("accessToken");
    const idFilho = localStorage.getItem('selectedMemberId');

    try {
        const response = await fetch(`http://localhost:8080/user/f/${idFilho}/desbloquear-url`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error('Erro ao desbloquear URL');
        }

        console.log('URL desbloqueada:', url);
    } catch (error) {
        console.error('Erro ao desbloquear URL:', error);
    }
}


// Função para buscar as URLs da API
async function fecthUrlsBlock() {
    try {
        const token = localStorage.getItem("accessToken");
        id = localStorage.getItem('selectedMemberId');

        const response = await fetch(`http://localhost:8080/user/f/${id}/url-bloqueada`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }
        });
        if (!response.ok) {
            throw new Error('Erro ao buscar URLs');
        }
        // console.log(response)
        const data = await response.json();
        // console.log("alo", data);
        preencherTabelaBlock(data);
    } catch (error) {
        console.error('Erro:', error);
    }
}


function preencherTabelaBlock(urls) {
    const tableBody = document.querySelector('#sites-block');
    tableBody.innerHTML = ''; 

    urls.forEach((site, index) => {
        const row = document.createElement('tr');

        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1; 
        row.appendChild(numberCell);

        const cell = document.createElement('td');
        cell.textContent = site.url;
        row.appendChild(cell);

        const actionCell = document.createElement('td');
        const unlockButton = document.createElement('button');
        unlockButton.className = 'btn-desblock';
        unlockButton.innerHTML = `
            <span class="spinner" style="display:none;"></span> 
            <i class="fa-solid fa-unlock-keyhole"></i> Desbloquear
        `;

        unlockButton.addEventListener('click', async () => {
            const spinner = unlockButton.querySelector('.spinner');
            spinner.style.display = 'inline-block'; 
            unlockButton.disabled = true; 

            const urlToUnlock = site.url;
            console.log(`Desbloqueando URL: ${urlToUnlock}`);
            await desbloquearUrl(urlToUnlock);

            spinner.style.display = 'none'; 
            unlockButton.disabled = false;
        });

        actionCell.appendChild(unlockButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}


setInterval(fecthUrlsBlock, 1000);
document.addEventListener('DOMContentLoaded', fecthUrlsBlock);
