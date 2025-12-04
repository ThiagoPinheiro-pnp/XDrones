/* =============================================================
   XDrones - Lógica do Carrinho de Compras (Versão Corrigida)
   ============================================================= */

// 1. CARREGAR DADOS
// Tenta pegar o carrinho salvo. Se não existir, cria um array vazio.
let cart = JSON.parse(localStorage.getItem("cart")) || [];
// normaliza: garante qty para itens existentes (compatibilidade com versões antigas)
cart = cart.map(item => ({ ...item, qty: item.qty || 1 }));

// 2. SALVAR DADOS
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 3. ADICIONAR AO CARRINHO
// Chamado pelo products.js
function addCart(nome, preco, img) {
    // procura item igual e add objeto ao array 
    // (identifique por nome; se tiver id, use id)
    const existing = cart.find(i => i.nome === nome);
    if (existing) {
        existing.qty = (existing.qty || 1) + 1;
    } else {
        cart.push({ nome, preco, img, qty: 1 });
    }

    saveCart();
    
    // Atualiza a interface visual
    renderCartSidebar();
    
    // Abre a gaveta para mostrar o feedback ao usuário
    abrirCarrinho();

    //Contagem de produtos da mesma espécie
    updateCartCount();
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

    updateCartCount();
}

function changeQty(index, delta) {
    const item = cart[index];
    if (!item) return;

    item.qty = (item.qty || 1) + delta;

    if (item.qty <= 0) {
        // remove totalmente se zerar
        cart.splice(index, 1);
    }

    saveCart();
    renderCartSidebar();

    if (window.location.pathname.includes("carrinho.html")) {
        loadCartPage();
    }

    updateCartCount();
}

function updateCartCount() {
    const countSpan = document.getElementById("cart-count");
    if (!countSpan) return;
    const totalQty = cart.reduce((s, it) => s + (it.qty || 1), 0);
    countSpan.textContent = totalQty;
}

/* =============================================================
   LÓGICA DA GAVETA LATERAL (SIDEBAR)
   ============================================================= */

// Renderiza os itens dentro da gaveta HTML (que está no footer)
function renderCartSidebar() {
    const itemsDiv = document.getElementById("cart-items-sidebar");
    const totalSpan = document.getElementById("cart-total-sidebar");

    if (!itemsDiv || !totalSpan) return;

    itemsDiv.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        itemsDiv.innerHTML = "<p style='text-align:center; padding:20px; color:#666;'>Seu carrinho está vazio.</p>";
    } else {
        cart.forEach((item, i) => {
            const qty = item.qty || 1;
            total += item.preco * qty;
            itemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.nome}">
                <div class="cart-info">
                    <strong>${item.nome}</strong>
                    <p class="cart-price">
                     ${item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                     </p>

                    <div class="cart-qty">
                        <button class="qty-btn" onclick="changeQty(${i}, -1)" aria-label="Diminuir">−</button>
                        <span class="qty">${qty}</span>
                        <button class="qty-btn" onclick="changeQty(${i}, 1)" aria-label="Aumentar">+</button>
                    </div>
                </div>
                <button onclick="removeCartItem(${i})" title="Remover" style="color:#e63946; border:none; background:none; cursor:pointer; font-size:20px; font-weight:bold;">
                    &times;
                </button>
            </div>`;
        });
    }

    totalSpan.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});
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
            const qty = item.qty || 1;
            total += item.preco * qty;
            itemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" width="80">
                <div>
                    <strong>${item.nome}</strong>
                                <p>
            ${item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} 
            x ${qty} = 
            ${(item.preco * qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
                </div>
                <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
                    <button onclick="changeQty(${i}, -1)" style="cursor:pointer;">−</button>
                    <span>${qty}</span>
                    <button onclick="changeQty(${i}, 1)" style="cursor:pointer;">+</button>
                    <button onclick="removeCartItem(${i})" style="cursor:pointer;">🗑️</button>
                </div>
            </div>`;
        });
    }

    totalSpan.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});
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