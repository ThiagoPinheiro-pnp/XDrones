function trocarEtapa(numero) {
    const etapas = document.querySelectorAll(".cadastro-etapa");
    const tabs = document.querySelectorAll(".tab");

    etapas.forEach(etapa => etapa.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    document.getElementById(`etapa${numero}`).classList.add("active");
    tabs[numero - 1].classList.add("active");
}

document.getElementById("cadastroForm").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Cadastro finalizado com sucesso!");
});