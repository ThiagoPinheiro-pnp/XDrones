let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addCart(nome, preco, img) {
    cart.push({ nome, preco, img });
    saveCart();
    alert("Produto adicionado!");
}

function loadCartPage() {
    const itemsDiv = document.getElementById("cartItems");
    const totalSpan = document.getElementById("cartTotal");

    let total = 0;
    itemsDiv.innerHTML = "";

    cart.forEach((item, i) => {
        total += item.preco;

        itemsDiv.innerHTML += `
        <div class="cart-item">
            <img src="${item.img}">
            <div>
                <strong>${item.nome}</strong>
                <p>R$ ${item.preco.toFixed(2)}</p>
            </div>
            <button onclick="removeItem(${i})">🗑️</button>
        </div>`;
    });

    totalSpan.textContent = "R$ " + total.toFixed(2);
}

function removeItem(i) {
    cart.splice(i, 1);
    saveCart();
    loadCartPage();
}

if (window.location.pathname.includes("carrinho.html")) {
    loadCartPage();
}
