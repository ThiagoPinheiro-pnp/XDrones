let produtos = [];

function carregarProdutos() {
    const lista = document.querySelector("#lista-produtos");
    lista.innerHTML = "";

    produtos.forEach(produto => {
        lista.innerHTML += `
            <div class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn comprar" onclick="adicionarAoCarrinho(${produto.id})">
                    Comprar
                </button>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/produtos.json")
        .then(res => res.json())
        .then(data => {
            produtos = data;
            carregarProdutos();
        })
        .catch(err => console.error("Erro ao carregar produtos.json:", err));
});
