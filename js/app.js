document.addEventListener('DOMContentLoaded', () => {
  // ── Dynamic Year ──
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ── Loader Hiding ──
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.style.display = 'none', 700);
    }, 2500);
  }

  // ── Cursor Glow ──
  const cursor = document.getElementById('cursorGlow');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  }

  // ── Theme Switcher Widget ──
  const themeToggleBtn = document.getElementById('themeToggle');
  const toggleIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return 'dark'; // Always default to dark theme
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (toggleIcon) {
      if (theme === 'light') {
        toggleIcon.className = 'fa-solid fa-sun';
      } else {
        toggleIcon.className = 'fa-solid fa-moon';
      }
    }
  };

  if (themeToggleBtn) {
    applyTheme(getSavedTheme());
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // ── Custom Lightbox Modal ──
  const lightbox = document.getElementById('customLightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.custom-lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.custom-lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.custom-lightbox-close') : null;

  const openLightbox = (src, caption) => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }, 400);
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ── Dynamic Data Loading & Infinite Scroll ──
  let jsonData = [];
  let itemsPerLoad = 20;
  let currentIndex = 0;
  let isLoading = false;

  const container = document.getElementById('div-blanko');
  const trigger = document.getElementById('load-more-trigger');
  const loadingIndicator = document.getElementById('loading-indicator');

  if (container && trigger) {
    // Event delegation for opening lightbox on click
    container.addEventListener('click', (e) => {
      const link = e.target.closest('.example-image-link');
      if (link) {
        e.preventDefault();
        const imgSrc = link.getAttribute('href');
        const captionText = link.getAttribute('data-lightbox') || '';
        openLightbox(imgSrc, captionText);
      }
    });

    const getSkeletonHTML = (count) => {
      let html = '';
      for (let i = 0; i < count; i++) {
        html += `
          <div class="col-lg-4 col-md-6 mb-4 skeleton-wrapper">
            <div class="skeleton-card">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
        `;
      }
      return html;
    };

    const showLoading = () => {
      if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.classList.add('show');
      }
    };

    const hideLoading = () => {
      if (loadingIndicator) {
        loadingIndicator.classList.remove('show');
        setTimeout(() => {
          if (!isLoading) {
            loadingIndicator.classList.add('hidden');
          }
        }, 300);
      }
    };

    const appendItems = () => {
      if (isLoading || currentIndex >= jsonData.length) return;
      isLoading = true;
      showLoading();

      const remainingCount = jsonData.length - currentIndex;
      const countToLoad = Math.min(itemsPerLoad, remainingCount);

      // Append skeleton screens
      container.insertAdjacentHTML('beforeend', getSkeletonHTML(countToLoad));

      const items = jsonData.slice(currentIndex, currentIndex + countToLoad);
      let html = '';

      items.forEach(item => {
        html += `
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="katalog-card">
              <div class="katalog-card-img-wrapper">
                <a class="example-image-link" href="${item.gambar_blanko}" data-lightbox="${item.nama_blanko}">
                  <img class="katalog-card-img example-image" src="${item.gambar_blanko}" alt="${item.nama_blanko}" loading="lazy" />
                </a>
              </div>
              <div class="katalog-card-body">
                <div>
                  <h3 class="katalog-card-title">
                    <a class="example-image-link" href="${item.gambar_blanko}" data-lightbox="${item.nama_blanko}">${item.nama_blanko}</a>
                  </h3>
                  <ul class="katalog-card-specs">
                    <li>Harga tertera untuk 1 pcs</li>
                    <li>Minimum Order 100 pcs kelipatan 50, contoh 100, 150, 200, 250, dst</li>
                    <li>Harga sudah termasuk plastik OPP dan label nama</li>
                  </ul>
                </div>
                <div class="katalog-card-footer">
                  <p class="katalog-card-price">
                    <span class="font-weight-bold">${item.harga_blanko}</span>
                  </p>
                  <div class="badge katalog-card-badge">New</div>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      // Simulate network request delay (800ms)
      setTimeout(() => {
        // Remove skeleton screens
        const skeletons = container.querySelectorAll('.skeleton-wrapper');
        skeletons.forEach(s => s.remove());

        // Append real items
        container.insertAdjacentHTML('beforeend', html);
        currentIndex += countToLoad;
        isLoading = false;
        hideLoading();

        // If no more items, stop observing and hide trigger
        if (currentIndex >= jsonData.length) {
          observer.unobserve(trigger);
          trigger.style.display = 'none';
        }
      }, 800);
    };

    // Observer setup
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        appendItems();
      }
    }, {
      rootMargin: '150px'
    });

    // Fetch initial list-blanko.json
    fetch('list-blanko.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        jsonData = data;
        appendItems(); // Load first batch immediately
        observer.observe(trigger); // Start observing bottom trigger
      })
      .catch(err => {
        console.error('Error fetching list-blanko.json:', err);
        container.innerHTML = `<div class="col-12 text-center py-5 text-danger"><p>Gagal memuat katalog undangan cetak. Silakan coba muat ulang halaman.</p></div>`;
      });
  }
});
