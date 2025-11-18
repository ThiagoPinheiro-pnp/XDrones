let produtos = [];

function carregarProdutos() {
    const lista = document.querySelector("#lista-produtos");
    lista.innerHTML = "";

    produtos.forEach(produto => {
        // Ajuste importante: passamos o ID para a função adicionarAoCarrinho
        lista.innerHTML += `
            <div class="produto">
                <div class="card-img-wrapper">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn comprar" onclick="adicionarAoCarrinho(${produto.id})">
                    Comprar
                </button>
            </div>
        `;
    });
}

// Função de Ponte: Pega o ID, acha o objeto e manda para o cart.js
function adicionarAoCarrinho(id) {
    const produtoEncontrado = produtos.find(p => p.id === id);
    
    if (produtoEncontrado) {
        // Chama a função que está no cart.js
        addCart(produtoEncontrado.nome, produtoEncontrado.preco, produtoEncontrado.imagem);
    } else {
        console.error("Produto não encontrado ID:", id);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Certifica-te que o caminho do JSON está correto
    fetch("assets/data/produtos.json")
        .then(res => res.json())
        .then(data => {
            produtos = data;
            carregarProdutos();
        })
        .catch(err => console.error("Erro ao carregar produtos.json:", err));
});