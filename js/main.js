document.addEventListener('DOMContentLoaded', function () {
  // --- START: Tải Header & Footer ---
  const loadComponent = (selector, url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${url}`);
        return response.text();
      })
      .then((data) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = data;
      })
      .catch((error) => console.error(error));
  };

  loadComponent('#header-placeholder', 'header.html');
  loadComponent('#footer-placeholder', 'footer.html');
  // --- END: Tải Header & Footer ---

  // --- START: Hiệu ứng gõ chữ ---
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const textToType = 'Tài chính nhanh gọn, sản phẩm trong tầm tay.';
    let charIndex = 0;
    typingElement.innerHTML = ''; // Clear initial text

    function type() {
      if (charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(type, 80);
      }
    }
    type();
  }
  // --- END: Hiệu ứng gõ chữ ---

  // --- START: Hiệu ứng đếm số (ĐÃ THÊM) ---
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const speed = 200;

    const animateCounter = (counter) => {
      const target = +counter.getAttribute('data-counter');
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
    };

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // Kích hoạt sớm hơn, khi 10% hiện ra
      }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }
  // --- END: Hiệu ứng đếm số ---

  // --- START: Swiper Initialization (ĐÃ CẬP NHẬT) ---
  const swiper = new Swiper('.hero-swiper', {
    loop: true,
    effect: 'fade',
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
    // THÊM SỰ KIỆN ĐỂ KHẮC PHỤC LỖI
    on: {
      // Khởi tạo hiệu ứng lần đầu tiên
      init: function () {
        initParticles();
      },
      // Khởi tạo lại hiệu ứng mỗi khi chuyển slide xong
      transitionEnd: function () {
        // Chỉ chạy lại hiệu ứng nếu slide hiện tại là slide đầu tiên
        if (this.realIndex === 0) {
          initParticles();
        }
      },
    },
  });
  // --- END: Swiper Initialization ---

  // --- START: Product Slider ---
  const productSlidesContainer = document.querySelector(
    '.product-slides-container'
  );
  if (productSlidesContainer) {
    const slides = productSlidesContainer.querySelectorAll('.product-slide');
    const indicators = document.querySelectorAll('.product-indicator');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;
      slides.forEach((slide) => slide.classList.remove('active'));
      indicators.forEach((indicator) => indicator.classList.remove('active'));
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      if (indicators.length > 0)
        indicators[currentSlide].classList.add('active');
    }

    function startSlideShow() {
      clearInterval(slideInterval);
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 7000);
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function () {
        showSlide(index);
        startSlideShow();
      });
    });

    if (slides.length > 0) {
      showSlide(0);
      startSlideShow();
    }
  }
  // --- END: Product Slider ---

  // --- START: Tự động tải logo đối tác ---
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
  // --- END: Tự động tải logo đối tác ---
});
// --- START: Particles.js Logic ---
// Đóng gói logic vào một hàm để có thể gọi lại
function initParticles() {
  const particlesContainer = document.getElementById('particles-js-slide1');
  if (particlesContainer && typeof particlesJS !== 'undefined') {
    particlesJS('particles-js-slide1', {
      particles: {
        number: { value: 100 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 1, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: false },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          out_mode: 'out',
        },
      },
      retina_detect: true,
    });
  }
}
// --- END: Particles.js Logic ---
// --- START: Hiệu ứng nền cho phần Stats ---
function populateStatsBackground() {
  // QUAN TRỌNG: Hãy thay thế danh sách này bằng tên các tệp ảnh của bạn
  const statsImageFiles = ['image1.jpg', 'image2.jpg'];

  const imageDirectory = 'static/stats-images/'; // Đặt ảnh của bạn trong thư mục này
  const columns = document.querySelectorAll('.stats-bg-column');
  if (columns.length === 0) return;

  // Nhân đôi danh sách ảnh để đảm bảo lấp đầy và lặp lại mượt mà
  const fullImageList = [
    ...statsImageFiles,
    ...statsImageFiles,
    ...statsImageFiles,
  ];

  columns.forEach((column, colIndex) => {
    // Xoay vòng danh sách ảnh cho mỗi cột để tạo sự đa dạng
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
// --- END: Hiệu ứng nền cho phần Stats ---
// --- AOS Initialization ---
AOS.init({
  duration: 1000,
  once: true,
});
