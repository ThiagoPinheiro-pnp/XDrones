// 1. URL BASE (Apenas a raiz da API, sem endpoints específicos)
// Nota: Removi o final "/Pedidos/usuario/..." que estava causando o erro
const API_BASE_URL = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api"; 

document.addEventListener("DOMContentLoaded", async () => {
    const listaDiv = document.getElementById("lista-pedidos");
    
    // 2. Recuperar dados da sessão
    const usuarioId = localStorage.getItem("usuario_id");
    const usuarioToken = localStorage.getItem("usuario_token");

    // 3. Verificações de Segurança
    if (!usuarioToken) {
        window.location.href = "login.html"; 
        return;
    }

    if (!usuarioId) {
        alert("Sessão antiga detectada. Por favor, faça login novamente.");
        localStorage.clear(); 
        window.location.href = "login.html";
        return;
    }

    // 4. Buscar Pedidos na API
    try {
        // AGORA A MÁGICA ACONTECE AQUI:
        // Base + Controller + Endpoint + ID
        // Resultado: .../api/Pedidos/usuario/15
        const response = await fetch(`${API_BASE_URL}/Pedidos/usuario/${usuarioId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + usuarioToken
            }
        });
        
        if (response.ok) {
            const pedidos = await response.json();

            // Cenário: Sem pedidos
            if (pedidos.length === 0) {
                listaDiv.innerHTML = `
                    <div style="text-align:center; padding:30px;">
                        <i class="fa-solid fa-box-open" style="font-size: 30px; color: #ccc;"></i>
                        <p>Você ainda não fez compras.</p>
                        <a href="index.html" style="color:blue; text-decoration:underline;">Ir para a loja</a>
                    </div>`;
                return;
            }

            // Cenário: Com pedidos
            listaDiv.innerHTML = ""; 
            
            pedidos.forEach(pedido => {
                const dataFormatada = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
                const totalFormatado = pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                listaDiv.innerHTML += `
                    <div class="pedido-card">
                        <div class="pedido-info">
                            <h3>Pedido #${pedido.id}</h3>
                            <p>Data: ${dataFormatada}</p>
                            <p>Pagamento: ${pedido.formaPagamento}</p>
                        </div>
                        <div style="text-align:right;">
                            <div class="pedido-total">${totalFormatado}</div>
                            <span class="pedido-status">Aprovado</span>
                        </div>
                    </div>
                `;
            });

        } else {
            console.error("Erro API:", response.status);
            // Mostra o erro na tela para ajudar
            listaDiv.innerHTML = `<p style='color:red; text-align:center'>Erro ao carregar (Status: ${response.status})</p>`;
        }
    } catch (error) {
        console.error("Erro Fetch:", error);
        listaDiv.innerHTML = "<p style='text-align:center'>Não foi possível conectar ao servidor.</p>";
    }
});

// Carregador de Header/Footer
if (typeof loadHTML === 'undefined') {
    function loadHTML(selector, url) {
        fetch(url).then(r => r.text()).then(d => document.querySelector(selector).innerHTML = d);
    }
    loadHTML('div[data-include="components/header.html"]', 'components/header.html');
    loadHTML('div[data-include="components/footer.html"]', 'components/footer.html');
}