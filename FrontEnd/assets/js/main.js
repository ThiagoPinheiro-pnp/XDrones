// MAIN.JS
// Funções gerais usadas em todas as páginas

console.log("main.js carregado corretamente!");

/* ---------------------------
   SCROLL SUAVE ENTRE SEÇÕES
----------------------------*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: "smooth"
            });
        }
    });
});

/* ---------------------------
    MENU MOBILE (caso precise)
----------------------------*/
const mobileMenuBtn = document.querySelector(".menu-mobile-btn");
const mobileMenu = document.querySelector(".menu-mobile");

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });
}

/* ---------------------------
   EFEITO DE SOMBRA NO HEADER
----------------------------*/
window.addEventListener("scroll", () => {
    const header = document.querySelector(".topo");
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ---------------------------
   BOTÃO VOLTAR AO TOPO
----------------------------*/
const btnTopo = document.createElement("div");
btnTopo.classList.add("btn-topo");
btnTopo.innerHTML = "↑";
document.body.appendChild(btnTopo);

btnTopo.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    background: #0057ff;
    color: #fff;
    border-radius: 50%;
    display: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 22px;
    z-index: 999;
`;

window.addEventListener("scroll", () => {
    btnTopo.style.display = window.scrollY > 300 ? "flex" : "none";
});

btnTopo.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* ---------------------------
   FUNÇÃO DE TESTE GLOBAL
----------------------------*/
function iniciarSite() {
    console.log("Site carregado com sucesso!");
}

document.addEventListener("DOMContentLoaded", iniciarSite);
