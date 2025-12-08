// IMPORTANTE: Verifica a porta que o teu Backend está a usar (ex: 7001, 5000, 7152)
// Podes ver isso no browser quando corres o Swagger ou no ficheiro launchSettings.json
const API_URL = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/Auth/register"; 

// Função de abas
function trocarEtapa(numero) {
    const etapas = document.querySelectorAll(".cadastro-etapa");
    const tabs = document.querySelectorAll(".tab");

    etapas.forEach(etapa => etapa.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    document.getElementById(`etapa${numero}`).classList.add("active");
    tabs[numero - 1].classList.add("active");
}

// Evento de Envio do Formulário
document.getElementById("cadastroForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // 1. Capturar dados do HTML (Etapa 1)
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // 2. Validação básica
    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    // 3. Montar objeto para o Backend
    // Nota: O backend Usuario.cs ainda não tem campos de endereço, então enviamos apenas os dados da conta.
    const usuarioDTO = {
        nome: nome,
        email: email,
        senha: senha,
        role: "Cliente"
    };

    try {
        // 4. Enviar requisição POST
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioDTO)
        });

        // 5. Tratar resposta
        if (response.ok) {
            // Sucesso (Status 200-299)
            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html"; // Redireciona para login
        } else {
            // Erro (Status 400, 500, etc)
            const erroData = await response.json(); // Tenta ler a mensagem de erro da API
            alert("Erro ao cadastrar: " + (erroData.mensagem || "Verifique os dados."));
        }
    } catch (error) {
        console.error("Erro na comunicação:", error);
        alert("Não foi possível conectar ao servidor. Verifique se a API está rodando.");
    }
});