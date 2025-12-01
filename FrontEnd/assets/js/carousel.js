function inicializarSwipers() {
    const params = {
        init: false,
        // 🛑 MUDANÇA CRUCIAL AQUI:
        slidesPerView: 'auto', // "Auto" diz para o Swiper: "Leia a largura do CSS"
        spaceBetween: 30,
        loop: false,
        observer: true, 
        observeParents: true,
        
        // Remova os breakpoints complexos que mudam o slidesPerView numérico
        // Mantenha apenas o spaceBetween se quiser mudar o espaçamento
        breakpoints: {
            992: { 
                 slidesPerView: 'auto', // Mantém auto no tablet
                 spaceBetween: 30 
            },
            1400: { 
                 slidesPerView: 'auto', // Mantém auto no desktop
                 spaceBetween: 30 
            }
        }
    };

    function makeSwiper(containerSelector, nextSel, prevSel) {
        const swiper = new Swiper(containerSelector, {
            ...params,
            navigation: { nextEl: nextSel, prevEl: prevSel }
        });

        // Função que aplica visibilidade com checagem de existência do elemento
        function updateArrows() {
            const nextEl = document.querySelector(nextSel);
            const prevEl = document.querySelector(prevSel);
            if (!nextEl || !prevEl) return;

            // mostra/esconde com estilo (use opacity/pointerEvents)
            nextEl.style.opacity = swiper.isEnd ? '0' : '1';
            nextEl.style.pointerEvents = swiper.isEnd ? 'none' : 'auto';
            prevEl.style.opacity = swiper.isBeginning ? '0' : '1';
            prevEl.style.pointerEvents = swiper.isBeginning ? 'none' : 'auto';
        }

        // Atualiza no init e em cada mudança de slide
        swiper.on('init', updateArrows);
        swiper.on('slideChange', updateArrows);
        swiper.on('reachEnd', updateArrows);
        swiper.on('reachBeginning', updateArrows);
        swiper.init(); // Garante que o evento 'init' seja disparado

        return swiper;
    }

    makeSwiper('.linha-produtos-agricultura', '.swiper-next-agricultura', '.swiper-prev-agricultura');
    makeSwiper('.linha-produtos-industria',    '.swiper-next-industria',  '.swiper-prev-industria');
    makeSwiper('.linha-produtos-seguranca',   '.swiper-next-seguranca',  '.swiper-prev-seguranca');
}