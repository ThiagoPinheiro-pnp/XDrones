const produtos = [
    {
        id: 1,
        nome: "DJI Mini 4 Pro",
        preco: 4590,
        imagem: "assets/img/mini4.jpg"
    },
    {
        id: 2,
        nome: "DJI Air 3",
        preco: 7990,
        imagem: "assets/img/air3.jpg"
    }
];

function carregarProdutos() {
    const lista = document.querySelector("#lista-produtos");
    lista.innerHTML = "";

    produtos.forEach(produto => {
        lista.innerHTML += `
            <div class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toLocaleString()}</p>
                <button class="btn comprar" onclick="adicionarAoCarrinho(${produto.id})">
                    Comprar
                </button>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", carregarProdutos);
