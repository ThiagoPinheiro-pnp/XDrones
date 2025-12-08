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

  // ===== LÓGICA DO HEADER TRANSPARENTE =====
  if (banner) {
    header.classList.add("transparente");

    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.remove("transparente");
      } else {
        header.classList.add("transparente");
      }
    });
  } else {
    header.classList.remove("transparente");
    document.body.style.paddingTop = header.offsetHeight + "px";
  }

  // ===== 🚀 ATIVAÇÃO DO MENU HAMBÚRGUER (AQUI É O SEGREDO) =====
  const btnMenu = document.querySelector(".menu-hamburger");
  const menuMobile = document.getElementById("menu-mobile");
  const overlayMenu = document.getElementById("menu-overlay");
  const btnFecharMenu = document.querySelector(".fechar-menu");

  if (!btnMenu || !menuMobile || !overlayMenu || !btnFecharMenu) {
    console.error("Menu mobile não encontrado no DOM");
    return;
  }

  btnMenu.addEventListener("click", () => {
    menuMobile.classList.add("aberto");
    overlayMenu.classList.add("ativo");
    document.body.style.overflow = "hidden";
  });

  function fecharMenu() {
    menuMobile.classList.remove("aberto");
    overlayMenu.classList.remove("ativo");
    document.body.style.overflow = "auto";
  }

  btnFecharMenu.addEventListener("click", fecharMenu);
  overlayMenu.addEventListener("click", fecharMenu);
}

// ✅ DROPDOWN MOBILE APENAS PARA O USER (SEM ATRAPALHAR O CARRINHO)
document.querySelectorAll(".dropdown > a").forEach(botao => {
  botao.addEventListener("click", (e) => {

    // ❗ Se for o botão do CARRINHO, NÃO bloqueia (deixa abrir a sidebar)
    if (botao.id === "header-cart-btn") return;

    // Só ativa dropdown por clique no mobile
    if (window.innerWidth <= 900) {
      e.preventDefault();

      const menu = botao.nextElementSibling;
      const aberto = menu.classList.contains("aberto");

      // Fecha todos
      document.querySelectorAll(".dropdown-menu").forEach(m => {
        m.classList.remove("aberto");
      });

      // Abre apenas o clicado
      if (!aberto) {
        menu.classList.add("aberto");
      }
    }
  });
});

// ✅ FECHAR DROPDOWNS AO CLICAR FORA
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
      menu.classList.remove("aberto");
    });
  }
});

// Inicia tudo quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", carregarComponentes);

