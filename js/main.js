document.addEventListener('DOMContentLoaded', function () {
  // --- Function to load HTML components ---
  // --- Function to load HTML components ---
  // A robust function to load HTML components. It will not fail if a placeholder is missing.
  const loadComponent = (selector, url) => {
    const element = document.querySelector(selector);
    if (element) {
      return fetch(url)
        .then((response) =>
          response.ok ? response.text() : Promise.resolve('')
        ) // Silently fail on 404
        .then((data) => {
          if (data) element.innerHTML = data;
        });
    }
    return Promise.resolve(); // Silently resolve if placeholder doesn't exist
  };

  // List of all possible components to load across the site
  const componentsToLoad = [
    loadComponent('#header-placeholder', 'header.html'),
    loadComponent('#footer-placeholder', 'footer.html'),
    loadComponent('#hero-placeholder', 'hero.html'),
    loadComponent('#product-content-placeholder', 'product-content.html'),
    loadComponent('#partners-content-placeholder', 'partners-content.html'),
    loadComponent('#find-us-placeholder', 'find-us.html'),
    loadComponent('#about-placeholder', 'about.html'),
    loadComponent('#stats-placeholder', 'stats.html'),
    loadComponent('#news-ticker-placeholder', 'news-ticker.html'),
  ];

  Promise.all(componentsToLoad)
    .then(() => {
      console.log(
        'All components loaded, initializing page-specific scripts...'
      );
      initializeAllScripts();
    })
    .catch((error) => console.error('Error loading page components:', error));
  /**
   * ✅ NEW: This function highlights the active navigation link.
   */
  function highlightActiveNav() {
    // Get the current page filename, defaulting to 'index.html' for the root path
    const currentPage =
      window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('#header-placeholder .nav-link');

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');

      // This is a precise check: does the link's href exactly match the current page?
      if (linkHref === currentPage) {
        link.classList.add('text-t86-green', 'font-bold');
        link.classList.remove('text-t86-dark');
        // Special handling for the header with a gradient background
        if (document.querySelector('.header-gradient')) {
          link.classList.remove('opacity-80', 'text-white');
        }
      }
    });
  }
  function initializeAllScripts() {
    // --- Swiper Initialization for Hero ---
    if (document.querySelector('.hero-swiper')) {
      const swiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
          delay: 8000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // --- THÊM PHẦN NÀY ĐỂ KÍCH HOẠT LẠI ANIMATION ---
        on: {
          slideChange: function () {
            // Lấy slide đang hoạt động
            const activeSlide = this.slides[this.activeIndex];

            // Tìm các phần tử AOS trong slide đó
            const aosElements = activeSlide.querySelectorAll('[data-aos]');

            // Nếu có, làm mới AOS để kích hoạt lại animation
            if (aosElements.length > 0) {
              AOS.refreshHard();
            }
          },
        },
      });
    }

    if (document.getElementById('particles-js')) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
          },
        },
        interactivity: {
          // ✅ THIS IS THE FIX
          detect_on: 'window', // Changed to 'window' to detect mouse over all content
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 },
          },
        },
        retina_detect: true,
      });
    }

    if (document.getElementById('about-hero')) {
      particlesJS('particles-js', {
        // Particle.js config for inner pages
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            out_mode: 'out',
          },
        },
        retina_detect: true,
      });
    }
    // --- START: Swiper Initialization for Products (Replaces custom slider) ---
    const productContainer = document.querySelector(
      '.product-slides-container'
    );
    if (productContainer) {
      // 1. Lấy tất cả các slide và các nút điều hướng cũ
      const slides = productContainer.querySelectorAll('.product-slide');
      const oldIndicators = productContainer.nextElementSibling; // Lấy container của các nút indicators

      if (slides.length > 0) {
        // 2. Thêm class 'swiper' vào container chính
        productContainer.classList.add('product-swiper');

        // 3. Tạo một div 'swiper-wrapper' mới
        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';

        // 4. Chuyển tất cả các slide vào trong wrapper và thêm class 'swiper-slide'
        slides.forEach((slide) => {
          slide.className = 'swiper-slide'; // Ghi đè class cũ để loại bỏ 'active'
          swiperWrapper.appendChild(slide);
        });

        // 5. Xóa các slide cũ khỏi container và thêm wrapper mới vào
        productContainer.innerHTML = '';
        productContainer.appendChild(swiperWrapper);

        // 6. Tạo và thêm các element cho pagination và navigation
        const pagination = document.createElement('div');
        pagination.className = 'swiper-pagination product-pagination'; // Thêm class để có thể style riêng

        const navPrev = document.createElement('div');
        navPrev.className = 'swiper-button-prev product-nav-prev';

        const navNext = document.createElement('div');
        navNext.className = 'swiper-button-next product-nav-next';

        productContainer.appendChild(pagination); // Pagination vẫn ở trong
        productContainer.parentElement.appendChild(navPrev); // Đưa nút ra ngoài
        productContainer.parentElement.appendChild(navNext); // Đưa nút ra ngoài
        // 7. Xóa các nút indicators cũ đi
        if (
          oldIndicators &&
          oldIndicators.querySelectorAll('.product-indicator').length > 0
        ) {
          oldIndicators.remove();
        }

        // 8. Khởi tạo Swiper
        const productSwiper = new Swiper('.product-swiper', {
          loop: true,
          spaceBetween: 30,
          // --- THAY ĐỔI Ở ĐÂY ---
          // effect: 'fade', // Chuyển hiệu ứng từ 'slide' (mặc định) sang 'fade'
          // fadeEffect: {
          //   crossFade: true, // Cho phép hiệu ứng mờ dần đẹp hơn
          // },
          speed: 1000, // Tăng tốc độ chuyển cảnh (1000ms = 1 giây)
          // --- KẾT THÚC THAY ĐỔI ---
          autoplay: {
            delay: 7000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.product-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.product-nav-next',
            prevEl: '.product-nav-prev',
          },
        });
      }
    }

    // --- Partner Logos Marquee ---
    if (document.getElementById('partner-logos-wrapper')) {
      const logoFiles = [
        'logo-24-alo-store.png',
        'logo-2nam-store.png',
        'logo-alodidong.png',
        'logo-andylong.png',
        'logo-centerphone.png',
        'logo-chang-trai-ban-tao.jpg',
        'logo-dai-viet.png',
        'logo-di-dong-360.png',
        'logo-didongmy.png',
        'logo-ha-store.png',
        'logo-hi-tao-thom.png',
        'logo-hoang-kien.webp',
        'logo-huy-hoang.jpg',
        'logo-hvh76-store.png',
        'logo-khang-huy-apple.jpg',
        'logo-ldl-phone.png',
        'logo-le-quan.png',
        'logo-lock-mall.png',
        'logo-minh-hao-store.png',
        'logo-minh-thang-store.jpg',
        'logo-mobile-world.png',
        'logo-ngoc-thanh.png',
        'logo-nha-tao.png',
        'logo-phat-thanh.png',
        'logo-phu-gia.png',
        'logo-phu-vuong-mobile.png',
        'logo-renew-zone.png',
        'logo-sang-apple.png',
        'logo-taozin.png',
        'logo-thang-tao.png',
        'logo-thanh-luxury-mobile.png',
        'logo-the-gioi-tao.png',
        'logo-tt-mobile.png',
        'logo-vien-quang.svg',
        'logo-vphone.svg',
        'logo-zen-store.png',
      ];
      const logoDirectory = 'static/logo-partners/';
      const wrapper = document.getElementById('partner-logos-wrapper');
      function createLogoSet() {
        const logoSet = document.createElement('div');
        logoSet.className =
          'flex-shrink-0 flex items-center justify-around w-full space-x-4';
        logoFiles.forEach((file) => {
          const logoContainer = document.createElement('div');
          logoContainer.className = 'partner-logo-container';
          const img = document.createElement('img');
          img.src = logoDirectory + file;
          img.alt = file.split('.')[0].replace(/-/g, ' ') + ' Logo';
          img.className = 'partner-logo-img';
          logoContainer.appendChild(img);
          logoSet.appendChild(logoContainer);
        });
        return logoSet;
      }
      if (wrapper) {
        wrapper.appendChild(createLogoSet());
        wrapper.appendChild(createLogoSet());
        setTimeout(() => {
          wrapper.classList.add('marquee-content');
        }, 10);
      }
    }

    // --- Counter Animation ---
    if (document.querySelector('[data-counter]')) {
      const counters = document.querySelectorAll('[data-counter]');
      function animateCounter(counter) {
        const target = +counter.getAttribute('data-counter');
        const speed = 200;
        const updateCount = () => {
          const count = +counter.innerText.replace(/\./g, '');
          const increment = target / speed;
          if (count < target) {
            counter.innerText = Math.ceil(count + increment).toLocaleString(
              'vi-VN'
            );
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target.toLocaleString('vi-VN');
          }
        };
        updateCount();
      }
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      counters.forEach((counter) => {
        observer.observe(counter);
      });
    }

    // --- Stats Background Effect ---
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function populateStatsBackground() {
      const statsImageFiles = [
        '0009eb79ccac45f21cbd71.jpg',
        '00bedbcdfc1875462c0974.jpg',
        '055492d6b7033e5d671230.jpg',
        '0860971db0c8399660d969.jpg',
        '0a3a51b77462fd3ca47328.jpg',
        '0ba0739f564adf14865b22.jpg',
        '0e3aaa058fd0068e5fc110.jpg',
        '12754a866d53e40dbd4278.jpg',
        '147572619472483770961.jpg',
        '14786a474f92c6cc9f8313.jpg',
        '1504b73a92ef1bb142fe17.jpg',
        '169be0ebc73e4e60172f62.jpg',
        '1733f94ede9b57c50e8a59.jpg',
        '1e1a39241cf195afcce07.jpg',
        '288ac7f7e022697c303364.jpg',
        '292cf2aed77b5e25076a37.jpg',
        '2d66b258978d1ed3479c15.jpg',
        '30a283d0a4052d5b741467.jpg',
        '3bf31f0e38dbb185e8ca80.jpg',
        '3cd5312716f29facc6e388.jpg',
        '3e63da5dff8876d62f996.jpg',
        '3ed4f1edd4385d6604298.jpg',
        '3eeefd6cd8b951e708a826.jpg',
        '4214ab998e4c07125e5d34.jpg',
        '4366f65fd38a5ad4039b2.jpg',
        '45f3260101d4888ad1c581.jpg',
        '4ed82a550f8086dedf9131.jpg',
        '54d2cdece8396167382818.jpg',
        '55469bc4be11374f6e0038.jpg',
        '579a72a45771de2f876012.jpg',
        '5a3de8cfcf1a46441f0b90.jpg',
        '6344acb98b6c02325b7d76.jpg',
        '698e30fd17289e76c73973.jpg',
        '6aff440c63d9ea87b3c887.jpg',
        '6b89a17b86ae0ff056bf77.jpg',
        '6c4e13c33616bf48e60735.jpg',
        '745f67ad4078c926906979.jpg',
        '7de3256e00bb89e5d0aa32.jpg',
        '836bde9bf94e7010295f75.jpg',
        '8379358b125e9b00c24f84.jpg',
        '844744c56110e84eb10136.jpg',
        '85daa22785f20cac55e386.jpg',
        '889d4dee6a3be365ba2a58.jpg',
        '893c250300d68988d0c73.jpg',
        '8bf1b20c95d91c8745c885.jpg',
        '93b37ac35d16d4488d0768.jpg',
        '9464a95b8c8e05d05c9f4.jpg',
        'a49449e96e3ce762be2d65.jpg',
        'a4d66cef493ac064992b14.jpg',
        'a6a5189b3d4eb410ed5f20.jpg',
        'a7d0d92dfef877a62ee991.jpg',
        'b9230ad12d04a45afd1583.jpg',
        'c2766f494a9cc3c29a8d25.jpg',
        'c8ed33d316069f58c61721.jpg',
        'ce044f3a6aefe3b1bafe1.jpg',
        'd1238bd0ac05255b7c1482.jpg',
        'd29e80a7a5722c2c756324.jpg',
        'd4df2ee10b34826adb255.jpg',
        'd4e7d76bf2be7be022af27.jpg',
        'd6bc8b85ae50270e7e4123.jpg',
        'd79568ab4d7ec4209d6f19.jpg',
        'd8ee319316469f18c65760.jpg',
        'da0b107937acbef2e7bd66.jpg',
        'dbb44fc9681ce142b80d63.jpg',
        'df1b2fe40931806fd920.jpg',
        'df4199ccbc1935476c0840.jpg',
        'df8fa0b085650c3b55749.jpg',
        'e8201a193fccb692efdd16.jpg',
        'ec06238406518f0fd64033.jpg',
        'ece9261401c1889fd1d092.jpg',
        'ed1e2b9c0e498717de5829.jpg',
        'f02e6cac4979c027996839.jpg',
        'fa4dd0bff76a7e34277b89.jpg',
        'fb13fa2bdffe56a00fef11.jpg',
        'fcabf2d8d50d5c53051c72.jpg',
        'ff348146a6932fcd768270.jpg',
        'image1.jpg',
        'image2.jpg',
      ];
      shuffleArray(statsImageFiles);
      const imageDirectory = 'static/stats-images/';
      const columns = document.querySelectorAll('.stats-bg-column');
      if (columns.length === 0) return;
      const fullImageList = [...statsImageFiles, ...statsImageFiles];
      columns.forEach((column, colIndex) => {
        const imageList = [
          ...fullImageList.slice(colIndex),
          ...fullImageList.slice(0, colIndex),
        ];
        imageList.forEach((fileName) => {
          const img = document.createElement('img');
          img.src = imageDirectory + fileName;
          img.alt = 'Stats background image';
          column.appendChild(img);
        });
      });
    }
    populateStatsBackground();

    const typingSubtitle = document.querySelector(
      '#hero-slide-1 .hero-subtitle'
    );
    const subtitleText = 'Tài chính nhanh gọn, Sản phẩm trong tầm tay';
    let charIndex = 0;

    function typeWriter() {
      if (charIndex < subtitleText.length) {
        typingSubtitle.textContent = subtitleText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, 50); // Adjust the delay (milliseconds) for typing speed
      }
    }

    // Start the typing effect only on the first slide's subtitle
    if (typingSubtitle) {
      // Optionally, you can add a slight delay before starting the typing
      setTimeout(typeWriter, 500);
    }

    function initializeHeroScripts() {
      // 1. Swiper Initialization
      new Swiper('.hero-swiper', {
        loop: true,
        effect: 'fade',
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });

      // 2. Particle.js Initialization
      if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: true },
            size: { value: 2, random: true },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: false },
              onclick: { enable: false },
              resize: true,
            },
          },
          retina_detect: true,
        });
      }

      // 3. Typing Effect
      const subtitleEl = document.getElementById('hero-subtitle');
      if (subtitleEl) {
        const text = 'Tài chính nhanh gọn, Sản phẩm trong tầm tay.';
        let index = 0;
        subtitleEl.innerHTML = ''; // Clear initial text

        function typeWriter() {
          if (index < text.length) {
            subtitleEl.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 55); // Typing speed
          }
        }
        setTimeout(typeWriter, 1200); // Delay before typing starts
      }

      // 4. Magnetic Button Effect
      const magneticBtn = document.getElementById('magnetic-btn');
      if (magneticBtn) {
        const effectEl = document.createElement('span');
        effectEl.classList.add('magnetic-effect');
        magneticBtn.prepend(effectEl);

        magneticBtn.addEventListener('mouseenter', function (e) {
          effectEl.style.width = '225px';
          effectEl.style.height = '225px';
        });

        magneticBtn.addEventListener('mousemove', function (e) {
          const rect = magneticBtn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          effectEl.style.left = `${x}px`;
          effectEl.style.top = `${y}px`;
        });

        magneticBtn.addEventListener('mouseleave', function (e) {
          effectEl.style.width = '0px';
          effectEl.style.height = '0px';
        });
      }
    }

    // --- Initialize AOS ---
    AOS.init({ duration: 1000, once: true });
    highlightActiveNav(); // Highlight the nav link after the header is loaded
  }
});
// function _0x59e2(_0x5bb670, _0x3fe1a4) {
//   const _0x3e5091 = _0x3e50();
//   return (
//     (_0x59e2 = function (_0x59e2d0, _0x7c3bfd) {
//       _0x59e2d0 = _0x59e2d0 - 0x1ef;
//       let _0x2e3e77 = _0x3e5091[_0x59e2d0];
//       return _0x2e3e77;
//     }),
//     _0x59e2(_0x5bb670, _0x3fe1a4)
//   );
// }
// const _0x1a0383 = _0x59e2;
// function _0x3e50() {
//   const _0x348627 = [
//     'width',
//     '5a3de8cfcf1a46441f0b90.jpg',
//     '395YktFxh',
//     'logo-zen-store.png',
//     'logo-lock-mall.png',
//     'textContent',
//     '0px',
//     'c2766f494a9cc3c29a8d25.jpg',
//     'logo-2nam-store.png',
//     '30a283d0a4052d5b741467.jpg',
//     'text-t86-dark',
//     'logo-phu-vuong-mobile.png',
//     'partner-logo-img',
//     'replace',
//     'add',
//     'logo-hvh76-store.png',
//     'logo-hoang-kien.webp',
//     'logo-hi-tao-thom.png',
//     '#news-ticker-placeholder',
//     '#footer-placeholder',
//     'innerHTML',
//     'height',
//     '055492d6b7033e5d671230.jpg',
//     'top',
//     'slice',
//     'news-ticker.html',
//     'partner-logo-container',
//     '.hero-swiper',
//     'none',
//     '0e3aaa058fd0068e5fc110.jpg',
//     'logo-mobile-world.png',
//     'nextElementSibling',
//     'logo-ldl-phone.png',
//     'logo-the-gioi-tao.png',
//     '14786a474f92c6cc9f8313.jpg',
//     '9464a95b8c8e05d05c9f4.jpg',
//     'partner-logos-wrapper',
//     'fcabf2d8d50d5c53051c72.jpg',
//     'className',
//     '496352WfjCNn',
//     'activeIndex',
//     '552695SFhVpz',
//     '12754a866d53e40dbd4278.jpg',
//     '.product-pagination',
//     '[data-counter]',
//     '0ba0739f564adf14865b22.jpg',
//     '#header-placeholder\x20.nav-link',
//     'classList',
//     'circle',
//     '.swiper-pagination',
//     'style',
//     '0009eb79ccac45f21cbd71.jpg',
//     'getBoundingClientRect',
//     'remove',
//     '[data-aos]',
//     'ff348146a6932fcd768270.jpg',
//     'clientY',
//     'src',
//     'marquee-content',
//     'b9230ad12d04a45afd1583.jpg',
//     '0a3a51b77462fd3ca47328.jpg',
//     '4366f65fd38a5ad4039b2.jpg',
//     '4803849etyWVS',
//     'catch',
//     'location',
//     'Tài\x20chính\x20nhanh\x20gọn,\x20Sản\x20phẩm\x20trong\x20tầm\x20tay',
//     '5858RhAEhE',
//     '4ed82a550f8086dedf9131.jpg',
//     'observe',
//     'length',
//     'logo-tt-mobile.png',
//     'parentElement',
//     'fb13fa2bdffe56a00fef11.jpg',
//     'product-content.html',
//     'logo-nha-tao.png',
//     'swiper-button-next\x20product-nav-next',
//     'da0b107937acbef2e7bd66.jpg',
//     '1504b73a92ef1bb142fe17.jpg',
//     'logo-thang-tao.png',
//     'text-t86-green',
//     'then',
//     'init',
//     'substring',
//     'e8201a193fccb692efdd16.jpg',
//     'canvas',
//     'prepend',
//     '169be0ebc73e4e60172f62.jpg',
//     '147572619472483770961.jpg',
//     'unobserve',
//     '7de3256e00bb89e5d0aa32.jpg',
//     'swiper-wrapper',
//     '263272mxzjcx',
//     '6b89a17b86ae0ff056bf77.jpg',
//     'logo-andylong.png',
//     'logo-di-dong-360.png',
//     'clientX',
//     'href',
//     'swiper-pagination\x20product-pagination',
//     'All\x20components\x20loaded,\x20initializing\x20page-specific\x20scripts...',
//     'about.html',
//     '4214ab998e4c07125e5d34.jpg',
//     'alt',
//     'df4199ccbc1935476c0840.jpg',
//     '55469bc4be11374f6e0038.jpg',
//     'addEventListener',
//     '#stats-placeholder',
//     'querySelector',
//     'logo-taozin.png',
//     '225px',
//     'image2.jpg',
//     '.product-swiper',
//     'slides',
//     'charAt',
//     'innerText',
//     '8379358b125e9b00c24f84.jpg',
//     '2d66b258978d1ed3479c15.jpg',
//     'df1b2fe40931806fd920.jpg',
//     'd1238bd0ac05255b7c1482.jpg',
//     '.product-nav-next',
//     'img',
//     'swiper-button-prev\x20product-nav-prev',
//     'forEach',
//     'header.html',
//     '836bde9bf94e7010295f75.jpg',
//     '3213012mlszDd',
//     'particles-js',
//     'logo-minh-thang-store.jpg',
//     'refreshHard',
//     'font-bold',
//     'f02e6cac4979c027996839.jpg',
//     'Tài\x20chính\x20nhanh\x20gọn,\x20Sản\x20phẩm\x20trong\x20tầm\x20tay.',
//     'opacity-80',
//     'magnetic-btn',
//     'logo-alodidong.png',
//     '889d4dee6a3be365ba2a58.jpg',
//     '7741644bKEDhI',
//     'push',
//     'vi-VN',
//     'hero.html',
//     'df8fa0b085650c3b55749.jpg',
//     'split',
//     '6344acb98b6c02325b7d76.jpg',
//     'a49449e96e3ce762be2d65.jpg',
//     '45f3260101d4888ad1c581.jpg',
//     'span',
//     'appendChild',
//     'logo-le-quan.png',
//     '8bf1b20c95d91c8745c885.jpg',
//     'ec06238406518f0fd64033.jpg',
//     'partners-content.html',
//     '.product-indicator',
//     'd4df2ee10b34826adb255.jpg',
//     'logo-dai-viet.png',
//     'logo-24-alo-store.png',
//     'dbb44fc9681ce142b80d63.jpg',
//     'pathname',
//     'grab',
//     'getElementById',
//     '7pgdTza',
//     'createElement',
//     '85daa22785f20cac55e386.jpg',
//     '893c250300d68988d0c73.jpg',
//     'logo-vien-quang.svg',
//     '93b37ac35d16d4488d0768.jpg',
//     'pop',
//     'ceil',
//     '3eeefd6cd8b951e708a826.jpg',
//     '698e30fd17289e76c73973.jpg',
//     'fa4dd0bff76a7e34277b89.jpg',
//     'swiper-slide',
//     'logo-ngoc-thanh.png',
//     '292cf2aed77b5e25076a37.jpg',
//     'logo-phu-gia.png',
//     'mouseleave',
//     'static/stats-images/',
//     'logo-ha-store.png',
//     'toLocaleString',
//     'logo-thanh-luxury-mobile.png',
//     'logo-khang-huy-apple.jpg',
//     'd8ee319316469f18c65760.jpg',
//     '3bf31f0e38dbb185e8ca80.jpg',
//     '#about-placeholder',
//     'out',
//     '.product-nav-prev',
//     '#ffffff',
//     'window',
//     '288ac7f7e022697c303364.jpg',
//     'stats.html',
//     'div',
//     'all',
//     '.product-slides-container',
//     '0860971db0c8399660d969.jpg',
//     'error',
//     '#hero-slide-1\x20.hero-subtitle',
//     'magnetic-effect',
//     '#hero-placeholder',
//     '579a72a45771de2f876012.jpg',
//     '#header-placeholder',
//     'resolve',
//     'floor',
//     '#find-us-placeholder',
//     'c8ed33d316069f58c61721.jpg',
//     'left',
//     'index.html',
//     'image1.jpg',
//     'querySelectorAll',
//     'random',
//     'static/logo-partners/',
//     'd4e7d76bf2be7be022af27.jpg',
//     'footer.html',
//     'logo-sang-apple.png',
//     'ce044f3a6aefe3b1bafe1.jpg',
//     'data-counter',
//   ];
//   _0x3e50 = function () {
//     return _0x348627;
//   };
//   return _0x3e50();
// }
// (function (_0x426d93, _0x227772) {
//   const _0x2fe0df = _0x59e2,
//     _0x1359db = _0x426d93();
//   while (!![]) {
//     try {
//       const _0x215efb =
//         (parseInt(_0x2fe0df(0x244)) / 0x1) *
//           (parseInt(_0x2fe0df(0x284)) / 0x2) +
//         parseInt(_0x2fe0df(0x2be)) / 0x3 +
//         parseInt(_0x2fe0df(0x269)) / 0x4 +
//         parseInt(_0x2fe0df(0x26b)) / 0x5 +
//         -parseInt(_0x2fe0df(0x1f4)) / 0x6 +
//         (parseInt(_0x2fe0df(0x20b)) / 0x7) *
//           (parseInt(_0x2fe0df(0x29d)) / 0x8) +
//         -parseInt(_0x2fe0df(0x280)) / 0x9;
//       if (_0x215efb === _0x227772) break;
//       else _0x1359db['push'](_0x1359db['shift']());
//     } catch (_0xfe5f78) {
//       _0x1359db['push'](_0x1359db['shift']());
//     }
//   }
// })(_0x3e50, 0xa3ee4),
//   document[_0x1a0383(0x2aa)]('DOMContentLoaded', function () {
//     const _0x366644 = _0x1a0383,
//       _0x7b7bc7 = (_0x403507, _0x582dbe) => {
//         const _0x49640c = _0x59e2,
//           _0x22b8f2 = document[_0x49640c(0x2ac)](_0x403507);
//         if (_0x22b8f2)
//           return fetch(_0x582dbe)
//             [_0x49640c(0x292)]((_0x546b29) =>
//               _0x546b29['ok']
//                 ? _0x546b29['text']()
//                 : Promise[_0x49640c(0x233)]('')
//             )
//             ['then']((_0x5e3075) => {
//               const _0x5f266b = _0x49640c;
//               if (_0x5e3075) _0x22b8f2[_0x5f266b(0x256)] = _0x5e3075;
//             });
//         return Promise[_0x49640c(0x233)]();
//       },
//       _0x547edf = [
//         _0x7b7bc7(_0x366644(0x232), _0x366644(0x2bc)),
//         _0x7b7bc7(_0x366644(0x255), _0x366644(0x23e)),
//         _0x7b7bc7(_0x366644(0x230), _0x366644(0x1f7)),
//         _0x7b7bc7('#product-content-placeholder', _0x366644(0x28b)),
//         _0x7b7bc7('#partners-content-placeholder', _0x366644(0x202)),
//         _0x7b7bc7(_0x366644(0x235), 'find-us.html'),
//         _0x7b7bc7(_0x366644(0x222), _0x366644(0x2a5)),
//         _0x7b7bc7(_0x366644(0x2ab), _0x366644(0x228)),
//         _0x7b7bc7(_0x366644(0x254), _0x366644(0x25b)),
//       ];
//     Promise[_0x366644(0x22a)](_0x547edf)
//       [_0x366644(0x292)](() => {
//         const _0x53b685 = _0x366644;
//         console['log'](_0x53b685(0x2a4)), _0x21fe65();
//       })
//       [_0x366644(0x281)]((_0x33b9ae) =>
//         console[_0x366644(0x22d)](
//           'Error\x20loading\x20page\x20components:',
//           _0x33b9ae
//         )
//       );
//     function _0x1c38da() {
//       const _0x45bcd1 = _0x366644,
//         _0x5eabb1 =
//           window[_0x45bcd1(0x282)][_0x45bcd1(0x208)]
//             [_0x45bcd1(0x1f9)]('/')
//             [_0x45bcd1(0x211)]() || _0x45bcd1(0x238),
//         _0x1136b7 = document[_0x45bcd1(0x23a)](_0x45bcd1(0x270));
//       _0x1136b7[_0x45bcd1(0x2bb)]((_0x37c4b7) => {
//         const _0x540325 = _0x45bcd1,
//           _0x215958 = _0x37c4b7['getAttribute'](_0x540325(0x2a2));
//         _0x215958 === _0x5eabb1 &&
//           (_0x37c4b7[_0x540325(0x271)]['add'](
//             _0x540325(0x291),
//             _0x540325(0x2c2)
//           ),
//           _0x37c4b7['classList'][_0x540325(0x277)](_0x540325(0x24c)),
//           document[_0x540325(0x2ac)]('.header-gradient') &&
//             _0x37c4b7['classList'][_0x540325(0x277)](
//               _0x540325(0x1f0),
//               'text-white'
//             ));
//       });
//     }
//     function _0x21fe65() {
//       const _0x5466d7 = _0x366644;
//       if (document[_0x5466d7(0x2ac)](_0x5466d7(0x25d))) {
//         const _0x563b93 = new Swiper(_0x5466d7(0x25d), {
//           loop: !![],
//           autoplay: { delay: 0x1f40, disableOnInteraction: ![] },
//           pagination: { el: _0x5466d7(0x273), clickable: !![] },
//           navigation: {
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//           },
//           on: {
//             slideChange: function () {
//               const _0x3d7338 = _0x5466d7,
//                 _0x1f66dd = this[_0x3d7338(0x2b1)][this[_0x3d7338(0x26a)]],
//                 _0xff26a5 = _0x1f66dd[_0x3d7338(0x23a)](_0x3d7338(0x278));
//               _0xff26a5[_0x3d7338(0x287)] > 0x0 && AOS[_0x3d7338(0x2c1)]();
//             },
//           },
//         });
//       }
//       document['getElementById']('particles-js') &&
//         particlesJS(_0x5466d7(0x2bf), {
//           particles: {
//             number: {
//               value: 0x50,
//               density: { enable: !![], value_area: 0x320 },
//             },
//             color: { value: _0x5466d7(0x225) },
//             shape: { type: 'circle' },
//             opacity: { value: 0.5, random: ![] },
//             size: { value: 0x3, random: !![] },
//             line_linked: {
//               enable: !![],
//               distance: 0x96,
//               color: _0x5466d7(0x225),
//               opacity: 0.4,
//               width: 0x1,
//             },
//             move: {
//               enable: !![],
//               speed: 0x2,
//               direction: _0x5466d7(0x25e),
//               random: ![],
//               straight: ![],
//               out_mode: _0x5466d7(0x223),
//               bounce: ![],
//             },
//           },
//           interactivity: {
//             detect_on: _0x5466d7(0x226),
//             events: {
//               onhover: { enable: !![], mode: _0x5466d7(0x209) },
//               onclick: { enable: !![], mode: _0x5466d7(0x1f5) },
//               resize: !![],
//             },
//             modes: {
//               grab: { distance: 0x8c, line_linked: { opacity: 0x1 } },
//               push: { particles_nb: 0x4 },
//             },
//           },
//           retina_detect: !![],
//         });
//       document[_0x5466d7(0x20a)]('about-hero') &&
//         particlesJS(_0x5466d7(0x2bf), {
//           particles: {
//             number: {
//               value: 0x28,
//               density: { enable: !![], value_area: 0x320 },
//             },
//             color: { value: _0x5466d7(0x225) },
//             shape: { type: _0x5466d7(0x272) },
//             opacity: { value: 0.3, random: !![] },
//             size: { value: 0x2, random: !![] },
//             move: {
//               enable: !![],
//               speed: 0x1,
//               direction: _0x5466d7(0x25e),
//               random: !![],
//               out_mode: _0x5466d7(0x223),
//             },
//           },
//           retina_detect: !![],
//         });
//       const _0x4e8a89 = document[_0x5466d7(0x2ac)](_0x5466d7(0x22b));
//       if (_0x4e8a89) {
//         const _0x4c8efd = _0x4e8a89['querySelectorAll']('.product-slide'),
//           _0x40e3d6 = _0x4e8a89[_0x5466d7(0x261)];
//         if (_0x4c8efd[_0x5466d7(0x287)] > 0x0) {
//           _0x4e8a89[_0x5466d7(0x271)][_0x5466d7(0x250)]('product-swiper');
//           const _0x5b5151 = document[_0x5466d7(0x20c)](_0x5466d7(0x229));
//           (_0x5b5151[_0x5466d7(0x268)] = _0x5466d7(0x29c)),
//             _0x4c8efd[_0x5466d7(0x2bb)]((_0x5edf0) => {
//               const _0x489b5a = _0x5466d7;
//               (_0x5edf0['className'] = _0x489b5a(0x216)),
//                 _0x5b5151[_0x489b5a(0x1fe)](_0x5edf0);
//             }),
//             (_0x4e8a89['innerHTML'] = ''),
//             _0x4e8a89[_0x5466d7(0x1fe)](_0x5b5151);
//           const _0x53dd33 = document[_0x5466d7(0x20c)](_0x5466d7(0x229));
//           _0x53dd33['className'] = _0x5466d7(0x2a3);
//           const _0x4e6bf9 = document[_0x5466d7(0x20c)](_0x5466d7(0x229));
//           _0x4e6bf9[_0x5466d7(0x268)] = _0x5466d7(0x2ba);
//           const _0x566eec = document[_0x5466d7(0x20c)](_0x5466d7(0x229));
//           (_0x566eec[_0x5466d7(0x268)] = _0x5466d7(0x28d)),
//             _0x4e8a89[_0x5466d7(0x1fe)](_0x53dd33),
//             _0x4e8a89['parentElement'][_0x5466d7(0x1fe)](_0x4e6bf9),
//             _0x4e8a89[_0x5466d7(0x289)][_0x5466d7(0x1fe)](_0x566eec);
//           _0x40e3d6 &&
//             _0x40e3d6['querySelectorAll'](_0x5466d7(0x203))[_0x5466d7(0x287)] >
//               0x0 &&
//             _0x40e3d6[_0x5466d7(0x277)]();
//           const _0x2f17c1 = new Swiper(_0x5466d7(0x2b0), {
//             loop: !![],
//             spaceBetween: 0x1e,
//             speed: 0x3e8,
//             autoplay: { delay: 0x1b58, disableOnInteraction: ![] },
//             pagination: { el: _0x5466d7(0x26d), clickable: !![] },
//             navigation: { nextEl: _0x5466d7(0x2b8), prevEl: _0x5466d7(0x224) },
//           });
//         }
//       }
//       if (document['getElementById'](_0x5466d7(0x266))) {
//         const _0x3a40ed = [
//             _0x5466d7(0x206),
//             _0x5466d7(0x24a),
//             _0x5466d7(0x1f2),
//             _0x5466d7(0x29f),
//             'logo-centerphone.png',
//             'logo-chang-trai-ban-tao.jpg',
//             _0x5466d7(0x205),
//             _0x5466d7(0x2a0),
//             'logo-didongmy.png',
//             _0x5466d7(0x21c),
//             _0x5466d7(0x253),
//             _0x5466d7(0x252),
//             'logo-huy-hoang.jpg',
//             _0x5466d7(0x251),
//             _0x5466d7(0x21f),
//             _0x5466d7(0x262),
//             _0x5466d7(0x1ff),
//             _0x5466d7(0x246),
//             'logo-minh-hao-store.png',
//             _0x5466d7(0x2c0),
//             _0x5466d7(0x260),
//             _0x5466d7(0x217),
//             _0x5466d7(0x28c),
//             'logo-phat-thanh.png',
//             _0x5466d7(0x219),
//             _0x5466d7(0x24d),
//             'logo-renew-zone.png',
//             _0x5466d7(0x23f),
//             _0x5466d7(0x2ad),
//             _0x5466d7(0x290),
//             _0x5466d7(0x21e),
//             _0x5466d7(0x263),
//             _0x5466d7(0x288),
//             _0x5466d7(0x20f),
//             'logo-vphone.svg',
//             _0x5466d7(0x245),
//           ],
//           _0x4defce = _0x5466d7(0x23c),
//           _0x1d985a = document[_0x5466d7(0x20a)](_0x5466d7(0x266));
//         function _0x237b8f() {
//           const _0x1398a6 = _0x5466d7,
//             _0x295c83 = document[_0x1398a6(0x20c)](_0x1398a6(0x229));
//           return (
//             (_0x295c83[_0x1398a6(0x268)] =
//               'flex-shrink-0\x20flex\x20items-center\x20justify-around\x20w-full\x20space-x-4'),
//             _0x3a40ed['forEach']((_0x3786a6) => {
//               const _0x260097 = _0x1398a6,
//                 _0x2620db = document[_0x260097(0x20c)](_0x260097(0x229));
//               _0x2620db[_0x260097(0x268)] = _0x260097(0x25c);
//               const _0x2dd156 = document[_0x260097(0x20c)](_0x260097(0x2b9));
//               (_0x2dd156[_0x260097(0x27b)] = _0x4defce + _0x3786a6),
//                 (_0x2dd156[_0x260097(0x2a7)] =
//                   _0x3786a6[_0x260097(0x1f9)]('.')[0x0][_0x260097(0x24f)](
//                     /-/g,
//                     '\x20'
//                   ) + '\x20Logo'),
//                 (_0x2dd156[_0x260097(0x268)] = _0x260097(0x24e)),
//                 _0x2620db['appendChild'](_0x2dd156),
//                 _0x295c83[_0x260097(0x1fe)](_0x2620db);
//             }),
//             _0x295c83
//           );
//         }
//         _0x1d985a &&
//           (_0x1d985a[_0x5466d7(0x1fe)](_0x237b8f()),
//           _0x1d985a['appendChild'](_0x237b8f()),
//           setTimeout(() => {
//             const _0x2fbaa7 = _0x5466d7;
//             _0x1d985a['classList'][_0x2fbaa7(0x250)](_0x2fbaa7(0x27c));
//           }, 0xa));
//       }
//       if (document['querySelector'](_0x5466d7(0x26e))) {
//         const _0x22c4f9 = document[_0x5466d7(0x23a)](_0x5466d7(0x26e));
//         function _0x57a3ca(_0x5966c6) {
//           const _0xdf19df = _0x5466d7,
//             _0x8f86c2 = +_0x5966c6['getAttribute'](_0xdf19df(0x241)),
//             _0x5d403f = 0xc8,
//             _0x575b3d = () => {
//               const _0x30d3e9 = _0xdf19df,
//                 _0x484f10 = +_0x5966c6[_0x30d3e9(0x2b3)]['replace'](/\./g, ''),
//                 _0x271031 = _0x8f86c2 / _0x5d403f;
//               _0x484f10 < _0x8f86c2
//                 ? ((_0x5966c6[_0x30d3e9(0x2b3)] = Math[_0x30d3e9(0x212)](
//                     _0x484f10 + _0x271031
//                   )[_0x30d3e9(0x21d)](_0x30d3e9(0x1f6))),
//                   setTimeout(_0x575b3d, 0xf))
//                 : (_0x5966c6[_0x30d3e9(0x2b3)] = _0x8f86c2[_0x30d3e9(0x21d)](
//                     _0x30d3e9(0x1f6)
//                   ));
//             };
//           _0x575b3d();
//         }
//         const _0x318a37 = new IntersectionObserver(
//           (_0x41c247, _0x41ee69) => {
//             _0x41c247['forEach']((_0x2aa66d) => {
//               const _0x3a90e6 = _0x59e2;
//               _0x2aa66d['isIntersecting'] &&
//                 (_0x57a3ca(_0x2aa66d['target']),
//                 _0x41ee69[_0x3a90e6(0x29a)](_0x2aa66d['target']));
//             });
//           },
//           { threshold: 0.1 }
//         );
//         _0x22c4f9[_0x5466d7(0x2bb)]((_0x39df3b) => {
//           const _0x20eb0b = _0x5466d7;
//           _0x318a37[_0x20eb0b(0x286)](_0x39df3b);
//         });
//       }
//       function _0x7cacde(_0x1a26dd) {
//         const _0x58e296 = _0x5466d7;
//         for (
//           let _0x57268b = _0x1a26dd[_0x58e296(0x287)] - 0x1;
//           _0x57268b > 0x0;
//           _0x57268b--
//         ) {
//           const _0x40ada1 = Math[_0x58e296(0x234)](
//             Math[_0x58e296(0x23b)]() * (_0x57268b + 0x1)
//           );
//           [_0x1a26dd[_0x57268b], _0x1a26dd[_0x40ada1]] = [
//             _0x1a26dd[_0x40ada1],
//             _0x1a26dd[_0x57268b],
//           ];
//         }
//       }
//       function _0x730485() {
//         const _0x5d006c = _0x5466d7,
//           _0x426482 = [
//             _0x5d006c(0x275),
//             '00bedbcdfc1875462c0974.jpg',
//             _0x5d006c(0x258),
//             _0x5d006c(0x22c),
//             _0x5d006c(0x27e),
//             _0x5d006c(0x26f),
//             _0x5d006c(0x25f),
//             _0x5d006c(0x26c),
//             _0x5d006c(0x299),
//             _0x5d006c(0x264),
//             _0x5d006c(0x28f),
//             _0x5d006c(0x298),
//             '1733f94ede9b57c50e8a59.jpg',
//             '1e1a39241cf195afcce07.jpg',
//             _0x5d006c(0x227),
//             _0x5d006c(0x218),
//             _0x5d006c(0x2b5),
//             _0x5d006c(0x24b),
//             _0x5d006c(0x221),
//             '3cd5312716f29facc6e388.jpg',
//             '3e63da5dff8876d62f996.jpg',
//             '3ed4f1edd4385d6604298.jpg',
//             _0x5d006c(0x213),
//             _0x5d006c(0x2a6),
//             _0x5d006c(0x27f),
//             _0x5d006c(0x1fc),
//             _0x5d006c(0x285),
//             '54d2cdece8396167382818.jpg',
//             _0x5d006c(0x2a9),
//             _0x5d006c(0x231),
//             _0x5d006c(0x243),
//             _0x5d006c(0x1fa),
//             _0x5d006c(0x214),
//             '6aff440c63d9ea87b3c887.jpg',
//             _0x5d006c(0x29e),
//             '6c4e13c33616bf48e60735.jpg',
//             '745f67ad4078c926906979.jpg',
//             _0x5d006c(0x29b),
//             _0x5d006c(0x2bd),
//             _0x5d006c(0x2b4),
//             '844744c56110e84eb10136.jpg',
//             _0x5d006c(0x20d),
//             _0x5d006c(0x1f3),
//             _0x5d006c(0x20e),
//             _0x5d006c(0x200),
//             _0x5d006c(0x210),
//             _0x5d006c(0x265),
//             _0x5d006c(0x1fb),
//             'a4d66cef493ac064992b14.jpg',
//             'a6a5189b3d4eb410ed5f20.jpg',
//             'a7d0d92dfef877a62ee991.jpg',
//             _0x5d006c(0x27d),
//             _0x5d006c(0x249),
//             _0x5d006c(0x236),
//             _0x5d006c(0x240),
//             _0x5d006c(0x2b7),
//             'd29e80a7a5722c2c756324.jpg',
//             _0x5d006c(0x204),
//             _0x5d006c(0x23d),
//             'd6bc8b85ae50270e7e4123.jpg',
//             'd79568ab4d7ec4209d6f19.jpg',
//             _0x5d006c(0x220),
//             _0x5d006c(0x28e),
//             _0x5d006c(0x207),
//             _0x5d006c(0x2b6),
//             _0x5d006c(0x2a8),
//             _0x5d006c(0x1f8),
//             _0x5d006c(0x295),
//             _0x5d006c(0x201),
//             'ece9261401c1889fd1d092.jpg',
//             'ed1e2b9c0e498717de5829.jpg',
//             _0x5d006c(0x2c3),
//             _0x5d006c(0x215),
//             _0x5d006c(0x28a),
//             _0x5d006c(0x267),
//             _0x5d006c(0x279),
//             _0x5d006c(0x239),
//             _0x5d006c(0x2af),
//           ];
//         _0x7cacde(_0x426482);
//         const _0x1d84c0 = _0x5d006c(0x21b),
//           _0x3139f4 = document[_0x5d006c(0x23a)]('.stats-bg-column');
//         if (_0x3139f4['length'] === 0x0) return;
//         const _0x3c92e4 = [..._0x426482, ..._0x426482];
//         _0x3139f4[_0x5d006c(0x2bb)]((_0x836351, _0x3fdf09) => {
//           const _0x5a1d4b = _0x5d006c,
//             _0x5e1d5b = [
//               ..._0x3c92e4[_0x5a1d4b(0x25a)](_0x3fdf09),
//               ..._0x3c92e4[_0x5a1d4b(0x25a)](0x0, _0x3fdf09),
//             ];
//           _0x5e1d5b[_0x5a1d4b(0x2bb)]((_0x3729ef) => {
//             const _0x9b1a7c = _0x5a1d4b,
//               _0x40ebef = document['createElement'](_0x9b1a7c(0x2b9));
//             (_0x40ebef[_0x9b1a7c(0x27b)] = _0x1d84c0 + _0x3729ef),
//               (_0x40ebef[_0x9b1a7c(0x2a7)] = 'Stats\x20background\x20image'),
//               _0x836351[_0x9b1a7c(0x1fe)](_0x40ebef);
//           });
//         });
//       }
//       _0x730485();
//       const _0xa9a62 = document[_0x5466d7(0x2ac)](_0x5466d7(0x22e)),
//         _0x4a6e5a = _0x5466d7(0x283);
//       let _0x3dc96b = 0x0;
//       function _0x400e72() {
//         const _0x323c36 = _0x5466d7;
//         _0x3dc96b < _0x4a6e5a['length'] &&
//           ((_0xa9a62[_0x323c36(0x247)] = _0x4a6e5a[_0x323c36(0x294)](
//             0x0,
//             _0x3dc96b + 0x1
//           )),
//           _0x3dc96b++,
//           setTimeout(_0x400e72, 0x32));
//       }
//       _0xa9a62 && setTimeout(_0x400e72, 0x1f4);
//       function _0x5b75af() {
//         const _0x565ef3 = _0x5466d7;
//         new Swiper(_0x565ef3(0x25d), {
//           loop: !![],
//           effect: 'fade',
//           pagination: { el: _0x565ef3(0x273), clickable: !![] },
//         });
//         document[_0x565ef3(0x20a)]('particles-js') &&
//           particlesJS('particles-js', {
//             particles: {
//               number: {
//                 value: 0x3c,
//                 density: { enable: !![], value_area: 0x320 },
//               },
//               color: { value: _0x565ef3(0x225) },
//               shape: { type: _0x565ef3(0x272) },
//               opacity: { value: 0.4, random: !![] },
//               size: { value: 0x2, random: !![] },
//               move: {
//                 enable: !![],
//                 speed: 0x1,
//                 direction: 'none',
//                 random: !![],
//                 straight: ![],
//                 out_mode: 'out',
//               },
//             },
//             interactivity: {
//               detect_on: _0x565ef3(0x296),
//               events: {
//                 onhover: { enable: ![] },
//                 onclick: { enable: ![] },
//                 resize: !![],
//               },
//             },
//             retina_detect: !![],
//           });
//         const _0x418ef2 = document[_0x565ef3(0x20a)]('hero-subtitle');
//         if (_0x418ef2) {
//           const _0x160981 = _0x565ef3(0x1ef);
//           let _0x14aa21 = 0x0;
//           _0x418ef2[_0x565ef3(0x256)] = '';
//           function _0x54af21() {
//             const _0x19ccc6 = _0x565ef3;
//             _0x14aa21 < _0x160981[_0x19ccc6(0x287)] &&
//               ((_0x418ef2[_0x19ccc6(0x256)] +=
//                 _0x160981[_0x19ccc6(0x2b2)](_0x14aa21)),
//               _0x14aa21++,
//               setTimeout(_0x54af21, 0x37));
//           }
//           setTimeout(_0x54af21, 0x4b0);
//         }
//         const _0x55ad32 = document[_0x565ef3(0x20a)](_0x565ef3(0x1f1));
//         if (_0x55ad32) {
//           const _0x56ea14 = document['createElement'](_0x565ef3(0x1fd));
//           _0x56ea14[_0x565ef3(0x271)]['add'](_0x565ef3(0x22f)),
//             _0x55ad32[_0x565ef3(0x297)](_0x56ea14),
//             _0x55ad32[_0x565ef3(0x2aa)]('mouseenter', function (_0x445887) {
//               const _0x4c53d6 = _0x565ef3;
//               (_0x56ea14['style'][_0x4c53d6(0x242)] = _0x4c53d6(0x2ae)),
//                 (_0x56ea14[_0x4c53d6(0x274)]['height'] = _0x4c53d6(0x2ae));
//             }),
//             _0x55ad32['addEventListener']('mousemove', function (_0x38fc5e) {
//               const _0x5a70a4 = _0x565ef3,
//                 _0x11d29c = _0x55ad32[_0x5a70a4(0x276)](),
//                 _0x126e1c =
//                   _0x38fc5e[_0x5a70a4(0x2a1)] - _0x11d29c[_0x5a70a4(0x237)],
//                 _0x6f9b0d =
//                   _0x38fc5e[_0x5a70a4(0x27a)] - _0x11d29c[_0x5a70a4(0x259)];
//               (_0x56ea14[_0x5a70a4(0x274)][_0x5a70a4(0x237)] =
//                 _0x126e1c + 'px'),
//                 (_0x56ea14[_0x5a70a4(0x274)][_0x5a70a4(0x259)] =
//                   _0x6f9b0d + 'px');
//             }),
//             _0x55ad32['addEventListener'](
//               _0x565ef3(0x21a),
//               function (_0x5e47a7) {
//                 const _0x17a6ac = _0x565ef3;
//                 (_0x56ea14['style'][_0x17a6ac(0x242)] = _0x17a6ac(0x248)),
//                   (_0x56ea14[_0x17a6ac(0x274)][_0x17a6ac(0x257)] =
//                     _0x17a6ac(0x248));
//               }
//             );
//         }
//       }
//       AOS[_0x5466d7(0x293)]({ duration: 0x3e8, once: !![] }), _0x1c38da();
//     }
//   });
