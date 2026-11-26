document.addEventListener('DOMContentLoaded', function () {

    /* ================= 1. ДИНАМИЧЕСКАЯ ШАПКА ================= */
    const currentUser = JSON.parse(localStorage.getItem('musical_current_user'));
    const authButtonsContainer = document.getElementById('authButtons');

    if (currentUser && authButtonsContainer) {
        authButtonsContainer.innerHTML = `
            <span class="user-greeting d-none d-xl-block me-2">Привет, <b>${currentUser.name}</b>!</span>
            <button id="logoutBtn" class="btn btn-outline-light btn-nav">Выйти</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('musical_current_user');
            window.location.reload();
        });
    }

    /* ================= 2. ЖИВОЙ ПОИСК + АВТОСКРОЛЛ ================= */
    const searchInput = document.getElementById('searchInput');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const noResults = document.getElementById('noResults');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            let visibleCount = 0;

            catalogItems.forEach(item => {
                const title = item.dataset.title.toLowerCase();
                const text = item.textContent.toLowerCase();

                if (title.includes(query) || text.includes(query)) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (noResults) {
                noResults.classList.toggle('d-none', visibleCount !== 0);
            }

            // Автоскролл к каталогу при вводе
            if (query.length > 1) {
                const catalogSection = document.getElementById('catalog');
                const yOffset = -80; // Отступ под шапку
                const y = catalogSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    }

    /* ================= 3. ЛАЙКИ (ИЗБРАННОЕ) ================= */
    // Добавляем кнопки-сердечки в HTML карточек
    catalogItems.forEach((item, index) => {
        const card = item.querySelector('.release-card');
        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.innerHTML = '<i class="bi bi-heart"></i>';
        
        // Проверяем, лайкнут ли уже
        let likes = JSON.parse(localStorage.getItem('musical_likes')) || [];
        if (likes.includes(index)) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
        }

        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Чтобы не срабатывал клик по карточке
            let currentLikes = JSON.parse(localStorage.getItem('musical_likes')) || [];
            
            if (currentLikes.includes(index)) {
                currentLikes = currentLikes.filter(i => i !== index);
                likeBtn.classList.remove('liked');
                likeBtn.innerHTML = '<i class="bi bi-heart"></i>';
            } else {
                currentLikes.push(index);
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = '<i class="bi bi-heart-fill"></i>';
            }
            localStorage.setItem('musical_likes', JSON.stringify(currentLikes));
        });

        card.appendChild(likeBtn);
    });

    /* ================= 4. ПЛАВАЮЩИЙ ПЛЕЕР ================= */
    const playButtons = document.querySelectorAll('.release-play');
    const floatingPlayer = document.getElementById('floatingPlayer');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const closePlayerBtn = document.getElementById('closePlayer');

    if (floatingPlayer) {
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.release-card');
                const title = card.querySelector('h5').textContent;
                const artist = card.querySelector('.release-artist').textContent;

                playerTitle.textContent = title;
                playerArtist.textContent = artist;
                floatingPlayer.classList.add('active');
            });
        });

        closePlayerBtn.addEventListener('click', () => {
            floatingPlayer.classList.remove('active');
        });
    }

    /* ================= 5. SCROLL REVEAL ================= */
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    /* ================= 6. КНОПКА НАВЕРХ И ХЕДЕР ================= */
    const header = document.querySelector('.site-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        // Эффект шапки
        if (header) {
            header.style.background = window.scrollY > 40 ? 'rgba(13, 5, 24, 0.95)' : 'rgba(13, 5, 24, 0.7)';
        }
        
        // Кнопка наверх
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});