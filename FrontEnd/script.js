function addCart(produto) {
    alert(produto + " foi adicionado ao carrinho!");
}
let cart = [];

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");

    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
}

function addCart(produtoNome, preco = 89.90, img = "https://via.placeholder.com/250") {
    const produto = {
        nome: produtoNome,
        preco: preco,
        img: img,
    };

    cart.push(produto);
    updateCart();
    toggleCart();  // Abrir Carrinho AUTOMATICAMENTE
}

function updateCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    const cartTotalSpan = document.getElementById("cartTotal");

    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.preco;

        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" />
                <div class="cart-info">
                    <strong>${item.nome}</strong>
                    <div class="cart-price">R$ ${item.preco.toFixed(2)}</div>
                </div>
                <button onclick="removeItem(${index})" style="font-size:22px;background:none;border:none;">🗑️</button>
            </div>
        `;
    });

    cartTotalSpan.textContent = "R$ " + total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}
