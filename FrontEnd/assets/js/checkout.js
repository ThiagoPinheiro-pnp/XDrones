/* =======================================================
   LÓGICA DE CHECKOUT (Finalizar Compra)
   ======================================================= */

// 1. SEGURANÇA: Bloqueia se não estiver logado
if (!localStorage.getItem("usuario_token")) {
    alert("Você precisa estar logado para finalizar a compra!");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    
    // 2. CARREGAR DADOS DO CARRINHO (LocalStorage)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalDisplay = document.getElementById("totalDisplay");
    
    // Calcula o total somando o preço de todos os itens
    const total = cart.reduce((sum, item) => sum + item.preco, 0);
    
    // Mostra o total formatado na tela
    if(totalDisplay) {
        totalDisplay.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 3. PREENCHER DADOS DO USUÁRIO AUTOMATICAMENTE
    const usuarioNome = localStorage.getItem("usuario_nome");
    if(usuarioNome) {
        document.getElementById("nomeInput").value = usuarioNome;
    }

    // 3.1 Tentar buscar dados completos do usuário no backend (endereço)
    (async function fetchUserProfile() {
        const token = localStorage.getItem('usuario_token');
        if (!token) return;
        try {
            const meUrl = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/Auth/me";
            const res = await fetch(meUrl, { headers: { 'Authorization': 'Bearer ' + token } });
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.endereco) {
                const enderecoEl = document.getElementById('enderecoInput');
                if (enderecoEl) enderecoEl.value = data.endereco + (data.numero ? (', ' + data.numero) : '');
            }
        } catch (e) {
            console.warn('Não foi possível buscar perfil do usuário:', e);
        }
    })();

    // 4. LÓGICA DE ENVIO DO PEDIDO
    const form = document.getElementById("checkoutForm");
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Não recarrega a página

        if (cart.length === 0) {
            alert("Seu carrinho está vazio! Adicione drones antes de finalizar.");
            return;
        }

        // Monta o objeto que o Backend C# espera
        const pedido = {
            // O ID é 0 porque o banco cria automático
            id: 0, 
            nomeCliente: document.getElementById("nomeInput").value,
            endereco: document.getElementById("enderecoInput").value,
            formaPagamento: document.getElementById("pagamentoInput").value,
            total: total,
            dataPedido: new Date().toISOString(), // Data de hoje
            usuarioId: parseInt(localStorage.getItem("usuario_id")) || 0
        };

        // Feedback visual
        const btn = form.querySelector('button');
        const textoOriginal = btn.innerHTML;
        btn.innerHTML = "Processando...";
        btn.disabled = true;

        try {
            // URL da API (Ajuste a porta se necessário)
            const url_api = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/Pedidos"; 

            const response = await fetch(url_api, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem('usuario_token') },
                body: JSON.stringify(pedido)
            });

            if (response.ok) {
                // SUCESSO!
                alert("Pedido realizado com SUCESSO! 🚁\nObrigado pela compra.");
                
                // Limpa o carrinho e o LocalStorage
                localStorage.removeItem("cart");
                
                // Redireciona para a página de PEDIDOS (Nova)
                window.location.href = "pedidos.html";
            } else {
                alert("Erro ao salvar pedido. Tente novamente.");
                btn.innerHTML = textoOriginal;
                btn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o servidor.");
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }
    });
});