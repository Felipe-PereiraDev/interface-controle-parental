const addMemberBtn = document.getElementById('add-member-btn');
const addChildCard = document.getElementById('add-child-card');
const closeBtn = document.getElementById('close-btn');


addMemberBtn.addEventListener('click', function() {
    addChildCard.style.display = 'block'; 
    setTimeout(() => {
        addChildCard.classList.add('show');
    }, 10); 
});

closeBtn.addEventListener('click', function() {
    addChildCard.classList.remove('show'); 
    setTimeout(() => {
        addChildCard.style.display = 'none'; 
    }, 500); 
});


document.getElementById('add-child-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    alert(`E-mail do filho adicionado: ${email}`);
    addChildCard.classList.remove('show');
    setTimeout(() => {
        addChildCard.style.display = 'none'; 
    }, 500); 
});

// Função para criar o card de cada membro da família com o botão "Gerenciar"
function criarMembro(membro) {
    return `<div class="member-card">
            <div class="avatar">🧸</div>
            <h5>${membro.nome}</h5>
            <p>${membro.email}</p>
            <button class="manage-btn" data-id="${membro.id}" data-nome="${membro.nome}">Gerenciar</button>
        </div>`;
}
// Função para buscar dados da API e renderizar os membros
async function loadFamilyMembers() {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8080/user/r/filhos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Status da Resposta: ", response.status);
        const membros = await response.json();

        const familiaMembrosDiv = document.getElementById('family-members');

        membros.forEach(membro => {
            familiaMembrosDiv.innerHTML += criarMembro(membro);
        });

        document.querySelectorAll('.manage-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userFilhoID = this.getAttribute('data-id');
                const nomeFilho = this.getAttribute('data-nome');
                // salva id e nome no localStorage
                localStorage.removeItem("selectedMemberId");
                localStorage.setItem('selectedMemberId', userFilhoID); 
                localStorage.setItem('selectedMemberNome', nomeFilho);
                window.location.href = '../pages/homepage.html'; 
            });
        });

    } catch (error) {
        console.error('Erro ao carregar membros da família:', error);
    }
}
// Chama a função para carregar os membros quando a página for carregada
window.onload = loadFamilyMembers;
