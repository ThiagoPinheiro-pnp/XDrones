function inicializarSwipers() {
    const params = {
        // 🛑 MUDANÇA: Use slidesPerView: 1 como padrão (mobile first)
        slidesPerView: 1, 
        slidesPerGroup: 1, // Adicionado para navegação 1 a 1
        spaceBetween: 30,
        loop: false,
        cssMode: false,
        breakpoints: {
            992: { 
                 slidesPerView: 1.5, 
                 slidesPerGroup: 1, // Avança 2 slides
                 spaceBetween: 30 
            },
            1400: { 
                 slidesPerView: 2.5, 
                 slidesPerGroup: 1, // Avança 2 slides
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