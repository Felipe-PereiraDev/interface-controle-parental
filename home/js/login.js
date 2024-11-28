var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var body = document.querySelector("body");

btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js";
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

// Configurações de login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-password").value;

    const data = { email: email, senha: senha };
    console.log(email);
    console.log(senha);

    fetch("http://localhost:8080/auth/login/r", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            const messageElement = document.getElementById("message");
            if (!response.ok) {
                throw new Error("Erro na autenticação");
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("accessToken", data.accessToken); 
            const messageElement = document.getElementById("message");
            messageElement.textContent = "Login bem-sucedido!";
            messageElement.classList.add("success");
            window.location.replace("pages/aba-familia.html")
            console.log(localStorage.getItem("accessToken"))
        })
        .catch(error => {
            const messageElement = document.getElementById("message");
            messageElement.textContent = "Erro: " + error.message;
            messageElement.classList.remove("success");
        });
});


// configurações de cadastro
document.getElementById("cadastro").addEventListener("submit", function (event) {
    event.preventDefault();

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const data = { nome: nome, email: email, senha: senha };

    fetch("http://localhost:8080/auth/user/registrar", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            loader.style.display = "none";
            if (response.status === 201) {
                return response.text().then(text => {
                    if (text) {
                        return JSON.parse(text);
                    } else {
                        return {};
                    }
                });
            } else {
                throw new Error("Erro na autenticação");
            }
        })

        .then(data => {
            sessionStorage.setItem("accessToken", data.token);
            const messageElement = document.getElementById("message");
            messageElement.textContent = "Cadastro bem-sucedido! Verifique sua caixa de entrada para ativar sua conta.";
            messageElement.classList.add("success");
        })
        .catch(error => {
            loader.style.display = "none"; 
            const messageElement = document.getElementById("message");
            messageElement.textContent = "Erro: " + error.message;
            messageElement.classList.remove("success");
        });
});
