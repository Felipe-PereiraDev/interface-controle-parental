function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const nomeFilho = document.querySelectorAll('#nome-filho');


// Função para verificar se o token é válido e ainda não expirou
function isAutenticado() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const payload = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000); 
    return payload.exp > currentTime; 
}



window.onload = function() {
    if (!isAutenticado()) {
        localStorage.removeItem('accessToken'); 
        window.location.href = "../index.html"; 
        console.log("Token expirado ou usuário não autenticado");
    } 
}

document.getElementById('open_btn').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});


const menuItems = document.querySelectorAll('.side-item');

menuItems.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        menuItems.forEach(menu => menu.classList.remove('active'));
        this.classList.add('active');

        const tabId = this.getAttribute('data-tab');
        const contents = document.querySelectorAll('.content');

        localStorage.setItem('activeTab', tabId);

        contents.forEach(content => {
            content.classList.remove('show');
            if (content.id === tabId) {
                content.classList.add('show');
            }
        });
    });
});


window.addEventListener('DOMContentLoaded', () => {
    const activeTab = localStorage.getItem('activeTab');
    const userName = localStorage.getItem('selectedMemberNome');
    if(userName != null) {
        document.querySelector('#nome-filho').textContent = userName;
    }
    if (activeTab) {
        const savedMenuItem = document.querySelector(`.side-item[data-tab="${activeTab}"]`);
        if (savedMenuItem) {
            savedMenuItem.click(); 
        }
    } else {
        // Se não houver aba salva, definir a aba padrão
        const defaultMenuItem = document.querySelector('.side-item[data-tab="grafico-uso"]');
        defaultMenuItem.click();
    }
});


document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('open_btn');

   
    if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
        if (sidebar.classList.contains('open-sidebar')) {
            sidebar.classList.remove('open-sidebar');
        }
    }
});



// deslogar da conta
function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedMemberId");
    localStorage.removeItem("selectedMemberNome");
    localStorage.removeItem("activeTab");


    window.location.replace("../index.html");
}

document.getElementById('logout_btn').addEventListener('click', logout);
