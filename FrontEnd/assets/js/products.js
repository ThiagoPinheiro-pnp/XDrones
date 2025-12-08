let produtos = [];

/**
 * Carrega os produtos da API, filtra pela categoria e injeta o HTML 
 * nos containers correspondentes para criar o layout horizontal.
 */
function carregarProdutos() {
    // 1. Limpa todos os containers antes de carregar
    const containerAgro = document.querySelector("#produtos-agricultura");
    const containerInd = document.querySelector("#produtos-industria");
    const containerSeg = document.querySelector("#produtos-seguranca");

    if(containerAgro) containerAgro.innerHTML = "";
    if(containerInd) containerInd.innerHTML = "";
    if(containerSeg) containerSeg.innerHTML = "";

    produtos.forEach(produto => {
        let containerId = '';
        
        // 2. Define o container de destino baseado na categoria (Case insensitive)
        const categoria = produto.categoria ? produto.categoria.toLowerCase() : '';

        if (categoria.includes('agricultura')) {
            containerId = '#produtos-agricultura';
        } else if (categoria.includes('industria')) {
            containerId = '#produtos-industria';
        } else if (categoria.includes('seguranca') || categoria.includes('defesa')) {
            containerId = '#produtos-seguranca';
        } else {
            console.warn(`Produto ${produto.nome} sem categoria válida (${categoria}).`);
            return; 
        }

        const container = document.querySelector(containerId);
        if (!container) return; // Segurança extra

        // 3. Cria o card de produto
        // ATENÇÃO: Ajustei para garantir que valores nulos não quebrem o layout
        const precoFormatado = produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const imagemUrl = produto.imagem || 'assets/img/drone-placeholder.png'; // Fallback de imagem

        const cardHTML = `
            <div class="card-produto-novo swiper-slide"> 
                <div class="card-imagem">
                    <img src="${imagemUrl}" alt="${produto.nome}">
                </div>
                
                <div class="card-conteudo">
                    <h3 class="titulo-drone">${produto.nome}</h3>
                    <p class="descricao">${produto.descricao || 'Um drone de alta performance e tecnologia de ponta.'}</p>
                    
                    <p class="preco">${precoFormatado}</p>

                    <div class="botoes-produto">
                        <a href="#" class="btn-detalhes-info" onclick="alert('Detalhes em breve!')">
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
    // Garante comparação de números (API pode mandar ID como número, JSON as vezes como string)
    const produtoEncontrado = produtos.find(p => Number(p.id) === Number(id));
    
    if (produtoEncontrado) {
        if (typeof addCart === 'function') {
            addCart(produtoEncontrado.nome, Number(produtoEncontrado.preco), produtoEncontrado.imagem); 
        } else {
            console.error("Erro: Função addCart não encontrada no escopo.");
        }
    } else {
        console.error("Produto não encontrado ID:", id);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- MUDANÇA PRINCIPAL: URL DA API ---
    // Use o link do seu Codespaces ou localhost
    const url_api = "https://cautious-waddle-6q4p4wjwxxwc5j4r-5071.app.github.dev/api/products"; 
    // SE ESTIVER NO CODESPACES, USE O LINK PÚBLICO:
    // const url_api = "https://SEU-LINK-DO-CODESPACES/api/products";

    console.log("Buscando produtos de:", url_api);

    fetch(url_api)
        .then(res => {
            if (!res.ok) throw new Error("Erro na resposta da API");
            return res.json();
        })
        .then(data => {
            console.log("Produtos carregados:", data);
            produtos = data;
            
            // 1. Injeta o HTML dos cards
            carregarProdutos();
            
            // 2. Inicializa o Carrossel (Swiper)
            // Espera um pouquinho para o DOM atualizar antes de ligar o carrossel
            setTimeout(() => {
                if (typeof inicializarSwipers === 'function') {
                    inicializarSwipers(); 
                } else {
                    console.warn("Função inicializarSwipers não encontrada. O carrossel pode não rodar.");
                }
            }, 100);
            
        })
        .catch(err => {
            console.error("Erro ao carregar produtos:", err);
            // Opcional: Mostrar mensagem de erro na tela para o usuário
        });
});