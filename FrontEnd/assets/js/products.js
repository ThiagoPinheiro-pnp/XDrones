let produtos = [];

/**
 * Carrega os produtos da API, filtra pela categoria e injeta o HTML 
 * nos containers correspondentes.
 */
function carregarProdutos() {
    // 1. Limpa os containers
    const containerAgro = document.querySelector("#produtos-agricultura");
    const containerInd = document.querySelector("#produtos-industria");
    const containerSeg = document.querySelector("#produtos-seguranca");

    if (containerAgro) containerAgro.innerHTML = "";
    if (containerInd) containerInd.innerHTML = "";
    if (containerSeg) containerSeg.innerHTML = "";

    produtos.forEach(produto => {
        let containerId = '';

        // 2. Define a categoria (Case insensitive e à prova de nulos)
        const categoria = produto.categoria ? produto.categoria.toLowerCase() : '';

        if (categoria.includes('agricultura')) {
            containerId = '#produtos-agricultura';
        } else if (categoria.includes('industria')) {
            containerId = '#produtos-industria';
        } else if (categoria.includes('seguranca') || categoria.includes('defesa')) {
            containerId = '#produtos-seguranca';
        } else {
            return; // Pula sem categoria
        }

        const container = document.querySelector(containerId);
        if (!container) return;

        // Formatação de preço e imagem
        const precoFormatado = produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const imagemUrl = produto.imagem || 'assets/img/drone-placeholder.png';

        // 3. HTML do Card (Usando o botão de Modal que veio do merge)
        const cardHTML = `
            <div class="card-produto-novo swiper-slide"> 
                <div class="card-imagem">
                    <img src="${imagemUrl}" alt="${produto.nome}">
                </div>
                
                <div class="card-conteudo">
                    <h3 class="titulo-drone">${produto.nome}</h3>
                    <p class="descricao">${produto.descricao || 'Alta performance e tecnologia.'}</p>
                    
                    <p class="preco">${precoFormatado}</p>

                    <div class="botoes-produto">
                        <button onclick="abrirModal(${produto.id})" class="btn-detalhes-info">
                            <i class="fa-solid fa-circle-info"></i> Detalhes
                        </button>

                        <button class="btn-comprar-acao" onclick="adicionarAoCarrinho(${produto.id})">
                            Comprar <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += cardHTML;
    });
}

// Adiciona ao carrinho (Conecta com cart.js)
function adicionarAoCarrinho(id) {
    const produtoEncontrado = produtos.find(p => Number(p.id) === Number(id));

    if (produtoEncontrado) {
        if (typeof addCart === 'function') {
            addCart(produtoEncontrado.nome, Number(produtoEncontrado.preco), produtoEncontrado.imagem);
        } else {
            console.error("Função addCart não encontrada.");
        }
    }
}

// --- LÓGICA DO MODAL (Nova funcionalidade) ---
function abrirModal(id) {
    // Busca o produto pelo ID na lista carregada da API
    const produto = produtos.find(p => Number(p.id) === Number(id));
    if (!produto) return;

    // Preenche o Modal
    document.getElementById("modal-imagem").src = produto.imagem || 'assets/img/drone-placeholder.png';
    document.getElementById("modal-nome").textContent = produto.nome;
    document.getElementById("modal-descricao").textContent = produto.descricao;
    document.getElementById("modal-preco").textContent = produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // Configura o botão de comprar do modal
    document.getElementById("modal-comprar").onclick = () => {
        adicionarAoCarrinho(produto.id);
        document.getElementById("modal-produto").classList.add("hidden"); // Fecha ao comprar
    };

    // Mostra o modal
    document.getElementById("modal-produto").classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Trava o scroll do fundo
}

// Fechar Modal
document.querySelector(".modal-fechar").addEventListener("click", () => {
    document.getElementById("modal-produto").classList.add("hidden");
    document.body.style.overflow = "auto";
});

// Fechar clicando fora
document.getElementById("modal-produto").addEventListener("click", (e) => {
    if (e.target.id === "modal-produto") {
        document.getElementById("modal-produto").classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});


// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {

    // URL DA API (Certifique-se de que a porta está correta, ex: 7155)
    // Se o link do Codespaces mudar, este é o local para atualizar!
    const url_api = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/products"; 

    console.log("Buscando produtos de:", url_api);

    fetch(url_api)
        .then(res => {
            if (!res.ok) throw new Error("Erro na API");
            return res.json();
        })
        .then(data => {
            console.log("Produtos carregados:", data);
            produtos = data;

            // 1. Gera o HTML
            carregarProdutos();

            // 2. Inicia o Carrossel (Swiper)
            setTimeout(() => {
                if (typeof inicializarSwipers === 'function') {
                    inicializarSwipers();
                }
            }, 100);
        })
        .catch(err => {
            console.error("Erro ao carregar produtos:", err);
            // Fallback opcional: alert("Erro ao carregar produtos. Verifique o Backend.");
        });
});