document.querySelectorAll("[data-include]").forEach(async (el) => {
    const file = el.getAttribute("data-include");
    const content = await fetch(file).then(r => r.text());
    el.innerHTML = content;
});
//função de scroll aparecer a barra do header branco no site
window.addEventListener("scroll", function () {
    const topo = document.querySelector(".topo");
    topo.classList.toggle("scrolled", window.scrollY > 50);
});