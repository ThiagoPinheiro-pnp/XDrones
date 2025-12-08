// 1. VERIFICAÇÃO DE SEGURANÇA (No topo do arquivo)
// Se o usuário já tem o "crachá" (token), manda ele direto para o perfil.
if (localStorage.getItem("usuario_token")) {
    window.location.href = "perfil.html";
}

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const msgErro = document.getElementById('msgErro');

    // URL do teu Backend (Endereço do Codespaces)
    const url_api = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/Auth/login"; 

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede a página de recarregar sozinha

        // 2. Pega os valores dos inputs
        const email = document.getElementById('emailInput').value;
        const senha = document.getElementById('senhaInput').value;

        // Limpa mensagens antigas e dá feedback visual
        msgErro.style.color = "#333";
        msgErro.innerText = "Processando...";

        try {
            // 3. Envia para o Backend
            const response = await fetch(url_api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            });

            // 4. Processa a resposta (transforma JSON em objeto JS)
            const data = await response.json();

            if (response.ok) {
                // --- SUCESSO! ---
                
                // Salva os dados no navegador (LocalStorage)
                localStorage.setItem("usuario_token", data.token);
                localStorage.setItem("usuario_nome", data.usuario);
                
                // --- NOVO: SALVAR O ID DO USUÁRIO PARA O CHECKOUT ---
                // Se o backend mandar o ID, a gente salva. Se não, salva 0 por segurança.
                if (data.id) {
                    localStorage.setItem("usuario_id", data.id);
                } else {
                    console.warn("Backend não retornou o ID. Checkout pode falhar.");
                }
                
                // Se o backend mandar a 'role' (tipo de usuário), salva também
                if (data.tipo) localStorage.setItem("usuario_role", data.tipo);

                alert("Login realizado com sucesso! Bem-vindo, " + data.usuario);

                // Redireciona para a Home
                window.location.href = "index.html"; 
            } else {
                // --- ERRO (Senha errada ou usuário não existe) ---
                msgErro.style.color = "red";
                msgErro.innerText = data.mensagem || "Erro ao fazer login. Verifique seus dados.";
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            msgErro.style.color = "red";
            msgErro.innerText = "Erro de conexão. Verifique se o Backend está rodando.";
        }
    });
});