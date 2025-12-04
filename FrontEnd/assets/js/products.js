let produtos = [];

/**
 * Carrega os produtos do JSON, filtra pela categoria e injeta o HTML 
 * nos containers correspondentes para criar o layout horizontal.
 */
function carregarProdutos() {
    // 1. Limpa todos os containers antes de carregar
    document.querySelector("#produtos-agricultura").innerHTML = "";
    document.querySelector("#produtos-industria").innerHTML = "";
    document.querySelector("#produtos-seguranca").innerHTML = "";

    produtos.forEach(produto => {
        let containerId = '';
        
        // 2. Define o container de destino baseado na categoria
        switch (produto.categoria.toLowerCase()) {
            case 'agricultura':
                containerId = '#produtos-agricultura';
                break;
            case 'industria':
                containerId = '#produtos-industria';
                break;
            case 'seguranca':
            case 'defesa': 
                containerId = '#produtos-seguranca';
                break;
            default:
                console.warn(`Produto ${produto.nome} sem categoria válida. Pulando.`);
                return; 
        }

       // Trecho da função carregarProdutos():

        const container = document.querySelector(containerId);

        // 3. Cria o card de produto com a NOVA ESTRUTURA DE DUAS COLUNAS
        const cardHTML = `
        
            <div class="card-produto-novo swiper-slide"> 
        <div class="card-imagem">
            <img src="${produto.imagem}" alt="${produto.nome}">
        </div>
        
                <div class="card-conteudo">
                    <h3 class="titulo-drone">${produto.nome}</h3>
                    <p class="descricao">${produto.descricao || 'Um drone de alta performance e tecnologia de ponta.'}</p>
                    
                        <p class="preco">
        ${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>

                    <div class="botoes-produto">
                
                <a href="/produto-detalhe.html?id=${produto.id}" class="btn-detalhes-info">
                    <i class="fa-solid fa-circle-info"></i> Detalhes
                </a>

                <button class="btn-comprar-acao" onclick="adicionarAoCarrinho(${produto.id})">
                    Comprar <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
                </div>
            </div>
        `;
        
        
        // 4. Injeta o card
        container.innerHTML += cardHTML;
    });
}

// Função de Ponte: Pega o ID, acha o objeto e manda para o cart.js
function adicionarAoCarrinho(id) {
    const produtoEncontrado = produtos.find(p => p.id === id);
    
    if (produtoEncontrado) {
        // Assume que 'addCart' está disponível via cart.js
        addCart(produtoEncontrado.nome, produtoEncontrado.preco, produtoEncontrado.imagem); 
    } else {
        console.error("Produto não encontrado ID:", id);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/produtos.json")
        .then(res => res.json())
        .then(data => {
            produtos = data;
            
            // 1. CHAMA A FUNÇÃO QUE INJETA O HTML
            carregarProdutos();
            
            // 2. CHAMA A FUNÇÃO QUE INICIALIZA O SWIPER AGORA
            // (Assumindo que sua função principal de inicialização do Swiper
            // está globalmente disponível ou no novo carousel.js)
            if (typeof inicializarSwipers === 'function') {
                 inicializarSwipers(); 
            } else {
                 console.error("Função inicializarSwipers não encontrada. Verifique o carousel.js.");
            }
            
        })
        .catch(err => console.error("Erro ao carregar produtos.json:", err));
});