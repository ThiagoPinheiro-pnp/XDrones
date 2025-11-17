document.querySelectorAll("[data-include]").forEach(async (el) => {
    const file = el.getAttribute("data-include");
    const content = await fetch(file).then(r => r.text());
    el.innerHTML = content;
});
