var modalNomeResponsavel = document.querySelector(".modal2-nome-responsavel");
var btnAlterarNomeResponsavel = document.querySelector("#alterar-nome-responsavel");
var settingsItemNomeResponsavel = document.querySelector("#settings-nome-responsavel");
var modalNomeFilho = document.querySelector(".modal2-nome-filho");
var btnAlterarNomeFilho = document.querySelector("#alterar-nome-filho");
var settingsItemNomeFilho = document.querySelector("#settings-nome-filho");
var modalAlterarSenha = document.querySelector(".modal2-senha");
var btnAlterarSenha = document.querySelector("#alterar-senha");
var settingsItemAlterarSenha = document.querySelector("#settings-alterar-senha");

var fecharNomeResponsavel = document.querySelector(".close-nome-responsavel");
var fecharNomeFilho = document.querySelector(".close-nome-filho");
var fecharAlterarSenha = document.querySelector(".close-senha");

settingsItemNomeResponsavel.onclick = function(event) {
    if (event.target !== btnAlterarNomeResponsavel) {
        modalNomeResponsavel.style.display = "block";
    }
};

settingsItemNomeFilho.onclick = function(event) {
    if (event.target !== btnAlterarNomeFilho) {
        modalNomeFilho.style.display = "block";
    }
};

settingsItemAlterarSenha.onclick = function(event) {
    if (event.target !== btnAlterarSenha) {
        modalAlterarSenha.style.display = "block";
    }
};

btnAlterarNomeResponsavel.onclick = function() {
    modalNomeResponsavel.style.display = "block";
};

btnAlterarNomeFilho.onclick = function() {
    modalNomeFilho.style.display = "block";
};

btnAlterarSenha.onclick = function() {
    modalAlterarSenha.style.display = "block";
};

fecharNomeResponsavel.onclick = function() {
    modalNomeResponsavel.style.display = "none";
};

fecharNomeFilho.onclick = function() {
    modalNomeFilho.style.display = "none";
};

fecharAlterarSenha.onclick = function() {
    modalAlterarSenha.style.display = "none";
};

window.onclick = function(event) {
    if (event.target === modalNomeResponsavel) {
        modalNomeResponsavel.style.display = "none";
    } else if (event.target === modalNomeFilho) {
        modalNomeFilho.style.display = "none";
    } else if (event.target === modalAlterarSenha) {
        modalAlterarSenha.style.display = "none";
    }
};





function togglePasswordVisibility(inputId) {
    var passwordField = document.getElementById(inputId);
    var eyeIcon = passwordField.nextElementSibling.querySelector('i');

    if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = "password";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}





async function alterarSenha(senhaAtual, novaSenha) {
    const url = '/alterar-senha';
    
    const data = {
        senhaAtual: senhaAtual,
        novaSenha: novaSenha
    };

    const token = localStorage.getItem("accessToken"); 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Falha ao alterar senha');
        }

        alert('Senha alterada com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao alterar senha');
    }
}

document.querySelector('#form-senha').addEventListener('submit', function(event) {
    event.preventDefault();

    const senhaAtual = document.querySelector('#senha-atual').value;
    const novaSenha = document.querySelector('#nova-senha').value;

    alterarSenha(senhaAtual, novaSenha);
});



async function alterarNomeResponsavel(nome) {
    const url = '/alterar-nome-r';
    
    const data = nome;

    const token = localStorage.getItem("accessToken"); 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Falha ao alterar nome');
        }

        alert('Nome alterado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao alterar nome');
    }
}

document.querySelector('#form-nome-responsavel').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome-responsavel').value;

    alterarNomeResponsavel(nome);
});



async function alterarNomeFilho() {
    const idFilho = localStorage.getItem('selectedMemberId'); 
    const nome = document.querySelector('#nome-filho').value;

    const url = `/alterar-nome-f/${idFilho}`;
    
    const data = nome;

    const token = localStorage.getItem("accessToken"); 

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Falha ao alterar nome do filho');
        }

        alert('Nome do filho alterado com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao alterar nome do filho');
    }
}

document.querySelector('#form-nome-filho').addEventListener('submit', function(event) {
    event.preventDefault();

    alterarNomeFilho();
});

