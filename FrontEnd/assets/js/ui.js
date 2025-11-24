/* --------------------------------------------------------------------------
   CARREGAMENTO DE COMPONENTES E LÓGICA DO HEADER
--------------------------------------------------------------------------- */

async function carregarComponentes() {
    const includes = document.querySelectorAll("[data-include]");
    
    // Carrega todos os componentes (Header, Footer, etc)
    const promises = Array.from(includes).map(async (el) => {
        const file = el.getAttribute("data-include");
        try {
            const response = await fetch(file);
            if (response.ok) {
                const content = await response.text();
                el.innerHTML = content;
            } else {
                console.error(`Erro ao carregar ${file}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Erro na requisição de ${file}:`, error);
        }
    });

    // Espera tudo carregar para rodar a lógica do site
    await Promise.all(promises);
    iniciarLogicaHeader();
}

function iniciarLogicaHeader() {
    const header = document.querySelector(".topo");
    const banner = document.querySelector(".banner");

    if (!header) return;

    // LÓGICA: Se existir um Banner (Estamos na Home)
    if (banner) {
        header.classList.add("transparente"); // Começa transparente

        window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
                header.classList.remove("transparente"); // Fica branco ao descer
            } else {
                header.classList.add("transparente"); // Volta a ser transparente no topo
            }
        });
    } 
    // LÓGICA: Se NÃO existir Banner (Páginas internas: Contato, Produtos)
    else {
        header.classList.remove("transparente"); // Garante que é sólido
        // Adiciona padding ao body para o conteúdo não ficar escondido atrás do menu fixo
        document.body.style.paddingTop = header.offsetHeight + "px";
    }
}

// Inicia tudo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarComponentes);