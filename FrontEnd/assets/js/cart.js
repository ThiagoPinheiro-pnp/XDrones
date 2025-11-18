/* =============================================================
   XDrones - Lógica do Carrinho de Compras (Versão Corrigida)
   ============================================================= */

// 1. CARREGAR DADOS
// Tenta pegar o carrinho salvo. Se não existir, cria um array vazio.
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 2. SALVAR DADOS
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 3. ADICIONAR AO CARRINHO
// Chamado pelo products.js
function addCart(nome, preco, img) {
    // Adiciona o objeto ao array
    cart.push({ nome, preco, img });
    saveCart();
    
    // Atualiza a interface visual
    renderCartSidebar();
    
    // Abre a gaveta para mostrar o feedback ao usuário
    abrirCarrinho();
}

// 4. REMOVER ITEM
// Funciona tanto para a gaveta quanto para a página separada
function removeCartItem(index) {
    cart.splice(index, 1); // Remove o item pelo índice
    saveCart();
    
    renderCartSidebar(); // Atualiza a gaveta
    
    // Se o usuário estiver na página 'carrinho.html', atualiza ela também
    if (window.location.pathname.includes("carrinho.html")) {
        loadCartPage();
    }
}

/* =============================================================
   LÓGICA DA GAVETA LATERAL (SIDEBAR)
   ============================================================= */

// Renderiza os itens dentro da gaveta HTML (que está no footer)
function renderCartSidebar() {
    const itemsDiv = document.getElementById("cart-items-sidebar");
    const totalSpan = document.getElementById("cart-total-sidebar");
    
    // Segurança: Só tenta rodar se o footer já tiver carregado a gaveta
    if (!itemsDiv || !totalSpan) return;

    itemsDiv.innerHTML = ""; // Limpa o conteúdo atual
    let total = 0;

    if (cart.length === 0) {
        itemsDiv.innerHTML = "<p style='text-align:center; padding:20px; color:#666;'>Seu carrinho está vazio.</p>";
    } else {
        cart.forEach((item, i) => {
            total += item.preco;
            itemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.nome}">
                <div class="cart-info">
                    <strong>${item.nome}</strong>
                    <p class="cart-price">R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button onclick="removeCartItem(${i})" title="Remover" style="color:#e63946; border:none; background:none; cursor:pointer; font-size:20px; font-weight:bold;">
                    &times;
                </button>
            </div>`;
        });
    }

    totalSpan.textContent = "R$ " + total.toFixed(2);
}

// --- FUNÇÕES DE ABRIR/FECHAR (ATUALIZADAS COM NOVOS NOMES) ---

function abrirCarrinho() {
    const sidebar = document.getElementById("cart-sidebar");
    // MUDANÇA: Busca o novo ID
    const overlay = document.getElementById("fundo-escuro-carrinho");
    
    if(sidebar && overlay) {
        sidebar.classList.add("open"); 
        // MUDANÇA: Usa a nova classe 'mostrar'
        overlay.classList.add("mostrar"); 
    }
}

function fecharCarrinho() {
    const sidebar = document.getElementById("cart-sidebar");
    // MUDANÇA: Busca o novo ID
    const overlay = document.getElementById("fundo-escuro-carrinho");
    
    if(sidebar && overlay) {
        sidebar.classList.remove("open");
        // MUDANÇA: Remove a nova classe 'mostrar'
        overlay.classList.remove("mostrar"); 
    }
}

/* =============================================================
   EVENTOS E INICIALIZAÇÃO
   ============================================================= */

// Quando a página carrega...
document.addEventListener("DOMContentLoaded", () => {
    // Tenta renderizar a gaveta imediatamente
    renderCartSidebar();
    
    // Se estivermos na página carrinho.html, carrega a tabela grande
    if (window.location.pathname.includes("carrinho.html")) {
        loadCartPage();
    }
});

// DELEGAÇÃO DE EVENTOS PARA O HEADER E OVERLAY
document.addEventListener('click', function(e) {
    
    // 1. Botão do Header
    const btnHeader = e.target.closest('#header-cart-btn');
    if (btnHeader) {
        e.preventDefault(); 
        renderCartSidebar(); 
        abrirCarrinho();     
    }

    // 2. Fechar ao clicar no fundo escuro (USANDO O NOVO ID)
    if (e.target.id === 'fundo-escuro-carrinho') {
        fecharCarrinho();
    }
});

/* =============================================================
   SUPORTE LEGADO (Página carrinho.html separada)
   ============================================================= */
function loadCartPage() {
    const itemsDiv = document.getElementById("cartItems");
    const totalSpan = document.getElementById("cartTotal");

    if (!itemsDiv) return; 

    let total = 0;
    itemsDiv.innerHTML = "";

    if (cart.length === 0) {
        itemsDiv.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        cart.forEach((item, i) => {
            total += item.preco;
            itemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" width="80">
                <div>
                    <strong>${item.nome}</strong>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button onclick="removeCartItem(${i})" style="margin-left:auto; cursor:pointer;">🗑️ Remover</button>
            </div>`;
        });
    }

    if (totalSpan) {
        totalSpan.textContent = "R$ " + total.toFixed(2);
    }
}

// Garante que o CSS do carrinho seja carregado
(function ensureCartCSS() {
    if (!document.querySelector('link[href*="cart.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'assets/css/cart.css'; 
        document.head.appendChild(link);
    }
})();