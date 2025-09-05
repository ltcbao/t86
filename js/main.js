document.addEventListener("DOMContentLoaded", function () {
  // --- Function to load HTML components ---
  // --- Function to load HTML components ---
  // A robust function to load HTML components. It will not fail if a placeholder is missing.
  const loadComponent = (selector, url) => {
    const element = document.querySelector(selector);
    if (element) {
      return fetch(url)
        .then((response) =>
          response.ok ? response.text() : Promise.resolve("")
        ) // Silently fail on 404
        .then((data) => {
          if (data) element.innerHTML = data;
        });
    }
    return Promise.resolve(); // Silently resolve if placeholder doesn't exist
  };

  // List of all possible components to load across the site
  const componentsToLoad = [
    loadComponent("#header-placeholder", "header.html"),
    loadComponent("#footer-placeholder", "footer.html"),
    loadComponent("#hero-placeholder", "hero.html"),
    loadComponent("#product-content-placeholder", "product-content.html"),
    loadComponent("#partners-content-placeholder", "partners-content.html"),
    loadComponent("#find-us-placeholder", "find-us.html"),
    loadComponent("#about-placeholder", "about.html"),
    loadComponent("#stats-placeholder", "stats.html"),
    loadComponent("#news-ticker-placeholder", "news-ticker.html"),
  ];

  Promise.all(componentsToLoad)
    .then(() => {
      console.log(
        "All components loaded, initializing page-specific scripts..."
      );
      initializeAllScripts();
    })
    .catch((error) => console.error("Error loading page components:", error));
  /**
   * ✅ NEW: This function highlights the active navigation link.
   */
  function highlightActiveNav() {
    // Get the current page filename, defaulting to 'index.html' for the root path
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll("#header-placeholder .nav-link");

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");

      // This is a precise check: does the link's href exactly match the current page?
      if (linkHref === currentPage) {
        link.classList.add("text-t86-green", "font-bold");
        link.classList.remove("text-t86-dark");
        // Special handling for the header with a gradient background
        if (document.querySelector(".header-gradient")) {
          link.classList.remove("opacity-80", "text-white");
        }
      }
    });
  }

  // Hàm để tải và hiển thị tin tức từ file JSON
  function initializeNewsTicker() {
    const container = document.getElementById("news-ticker-content");
    if (!container) return;

    fetch("data/news-ticker.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể tải file news-ticker.json");
        }
        return response.json();
      })
      .then((newsItems) => {
        let newsHtml = "";

        newsItems.forEach((item) => {
          let tagClass = "";
          // Chọn class CSS dựa trên 'type' từ JSON
          switch (item.type) {
            case "new":
              tagClass = "bg-t86-green-light text-white";
              break;
            case "partner":
              tagClass = "bg-white/20 text-white";
              break;
          }

          // Tạo chuỗi HTML cho mỗi tin tức
          newsHtml += `
          <span class="mx-8">
            <span class="${tagClass} text-xs font-bold px-2 py-1 rounded-md mr-2">${item.tag}</span>
            ${item.text}
          </span>
          <span class="text-white/50 mx-4">•</span>
        `;
        });

        // Nhân đôi nội dung để tạo hiệu ứng marquee chạy vô tận
        container.innerHTML = newsHtml + newsHtml;
      })
      .catch((error) => {
        console.error("Lỗi khi xử lý news-ticker:", error);
        container.innerHTML =
          '<span class="mx-8">Không thể tải tin tức...</span>';
      });
  }

  // function initializeProductSlider() {
  //   const container = document.querySelector(".product-slides-container");
  //   if (!container) return;

  //   fetch("data/products.json")
  //     .then((response) => response.json())
  //     .then((productData) => {
  //       let slidesHtml = "";
  //       productData.forEach((slide) => {
  //         // Tạo danh sách các tính năng, thay thế **text** bằng thẻ span in đậm
  //         const featuresHtml = slide.features
  //           .map((feature) => {
  //             const formattedFeature = feature.replace(
  //               /\*\*(.*?)\*\*/g,
  //               '<span class="font-bold mx-1 text-t86-green-light">$1</span>'
  //             );
  //             return `<li class="flex items-center justify-center md:justify-start">
  //                   <i class="fas fa-check text-t86-green-light mr-3"></i>${formattedFeature}
  //                 </li>`;
  //           })
  //           .join("");

  //         // Dựng cấu trúc HTML cho một slide
  //         slidesHtml += `
  //         <div class="swiper-slide">
  //           <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
  //             <div class="product-content-wrapper text-center md:text-left">
  //               <p class="font-raleway text-lg text-t86-dark mb-1">${slide.preTitle}</p>
  //               <h2 class="text-4xl md:text-5xl font-bold tracking-tight leading-tight uppercase text-t86-green-light">${slide.title}</h2>
  //               <ul class="mt-6 space-y-3 text-md text-t86-dark/90">${featuresHtml}</ul>
  //               <div class="mt-8">
  //                 <button onclick="location.href='${slide.button.link}'" class="bg-t86-green text-white font-bold px-8 py-3 rounded-full hover:bg-t86-green-light hover:scale-105 ripple btn-product">
  //                   ${slide.button.text}
  //                 </button>
  //               </div>
  //             </div>
  //             <div class="product-content-wrapper">
  //               <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  //                 <div class="product-image-container">
  //                   <img src="${slide.imageSrc}" class="object-contain pulse-animation" alt="${slide.title}" />
  //                 </div>
  //                 <div>
  //                   ${slide.visualsHtml}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       `;
  //       });

  //       // Chèn các slide và các nút điều khiển vào container
  //       container.innerHTML = `
  //       <div class="swiper product-swiper">
  //         <div class="swiper-wrapper">${slidesHtml}</div>
  //         <div class="swiper-pagination product-pagination"></div>
  //       </div>
  //       <div class="swiper-button-prev product-nav-prev"></div>
  //       <div class="swiper-button-next product-nav-next"></div>
  //     `;

  //       // Khởi tạo Swiper SAU KHI đã dựng xong HTML
  //       new Swiper(".product-swiper", {
  //         loop: true,
  //         effect: "fade",
  //         fadeEffect: { crossFade: true },
  //         speed: 800,
  //         autoplay: { delay: 7000, disableOnInteraction: false },
  //         pagination: { el: ".product-pagination", clickable: true },
  //         navigation: {
  //           nextEl: ".product-nav-next",
  //           prevEl: ".product-nav-prev",
  //         },
  //       });
  //     })
  //     .catch((error) => console.error("Lỗi khi tải dữ liệu sản phẩm:", error));
  // }
  function initializeProductSlider() {
    const container = document.querySelector(".product-slides-container");
    if (!container) return;

    fetch("data/products.json")
        .then((response) => response.json())
        .then((productData) => {
            let slidesHtml = "";
            
            // Vòng lặp này sẽ tự động chạy qua TẤT CẢ các sản phẩm trong file JSON
            productData.forEach((slide) => {
                const featuresHtml = slide.features
                    .map((feature) => {
                        const formattedFeature = feature.replace(
                            /\*\*(.*?)\*\*/g,
                            '<span class="font-bold mx-1 text-t86-green-light">$1</span>'
                        );
                        return `<li class="flex items-center justify-center md:justify-start">
                              <i class="fas fa-check text-t86-green-light mr-3"></i>${formattedFeature}
                            </li>`;
                    })
                    .join("");

                slidesHtml += `
                <div class="swiper-slide">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                        <div class="product-content-wrapper text-center md:text-left">
                            <p class="font-raleway text-lg text-t86-dark mb-1">${slide.preTitle}</p>
                            <h2 class="text-4xl md:text-5xl font-bold tracking-tight leading-tight uppercase text-t86-green-light">${slide.title}</h2>
                            <ul class="mt-6 space-y-3 text-md text-t86-dark/90">${featuresHtml}</ul>
                            <div class="mt-8">
                                <button onclick="location.href='${slide.button.link}'" class="bg-t86-green text-white font-bold px-8 py-3 rounded-full hover:bg-t86-green-light hover:scale-105 ripple btn-product">
                                    ${slide.button.text}
                                </button>
                            </div>
                        </div>
                        <div class="product-content-wrapper flex flex-col items-center justify-center">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div class="product-image-container">
                                    <img src="${slide.imageSrc}" class="object-contain pulse-animation" alt="${slide.title}" />
                                </div>
                                <div>
                                    ${slide.visualsHtml}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });

            container.innerHTML = `
            <div class="container mx-auto px-4">
              <div class="swiper product-swiper">
                <div class="swiper-wrapper">${slidesHtml}</div>
                <div class="swiper-pagination product-pagination"></div>
              </div>
            </div>
            <div class="swiper-button-prev product-nav-prev"></div>
            <div class="swiper-button-next product-nav-next"></div>
            `;

            new Swiper(".product-swiper", {
                loop: true,
                effect: "fade",
                fadeEffect: { crossFade: true },
                speed: 800,
                autoplay: { delay: 7000, disableOnInteraction: false },
                pagination: { el: ".product-pagination", clickable: true },
                navigation: {
                    nextEl: ".product-nav-next",
                    prevEl: ".product-nav-prev",
                },
            });
        })
        .catch((error) => console.error("Lỗi khi tải dữ liệu sản phẩm:", error));
}
  function initializeAllScripts() {
    // --- Swiper Initialization for Hero ---
    if (document.querySelector(".hero-swiper")) {
      const swiper = new Swiper(".hero-swiper", {
        loop: true,
        autoplay: {
          delay: 8000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          hideOnClick: false, // Thêm dòng này để ngăn ẩn nút khi click
        },
        // --- THÊM PHẦN NÀY ĐỂ KÍCH HOẠT LẠI ANIMATION ---
        on: {
          slideChange: function () {
            // Lấy slide đang hoạt động
            const activeSlide = this.slides[this.activeIndex];

            // Tìm các phần tử AOS trong slide đó
            const aosElements = activeSlide.querySelectorAll("[data-aos]");

            // Nếu có, làm mới AOS để kích hoạt lại animation
            if (aosElements.length > 0) {
              AOS.refreshHard();
            }
          },
        },
      });
    }

    if (document.getElementById("particles-js")) {
      particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          // ✅ THIS IS THE FIX
          detect_on: "window", // Changed to 'window' to detect mouse over all content
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
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

    if (document.getElementById("about-hero")) {
      particlesJS("particles-js", {
        // Particle.js config for inner pages
        particles: {
          number: { value: 40, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            out_mode: "out",
          },
        },
        retina_detect: true,
      });
    }
    // --- START: Swiper Initialization for Products (Replaces custom slider) ---
    const productContainer = document.querySelector(
      ".product-slides-container"
    );
    if (productContainer) {
      // 1. Lấy tất cả các slide và các nút điều hướng cũ
      const slides = productContainer.querySelectorAll(".product-slide");
      const oldIndicators = productContainer.nextElementSibling; // Lấy container của các nút indicators

      if (slides.length > 0) {
        // 2. Thêm class 'swiper' vào container chính
        productContainer.classList.add("product-swiper");

        // 3. Tạo một div 'swiper-wrapper' mới
        const swiperWrapper = document.createElement("div");
        swiperWrapper.className = "swiper-wrapper";

        // 4. Chuyển tất cả các slide vào trong wrapper và thêm class 'swiper-slide'
        slides.forEach((slide) => {
          slide.className = "swiper-slide"; // Ghi đè class cũ để loại bỏ 'active'
          swiperWrapper.appendChild(slide);
        });

        // 5. Xóa các slide cũ khỏi container và thêm wrapper mới vào
        productContainer.innerHTML = "";
        productContainer.appendChild(swiperWrapper);

        // 6. Tạo và thêm các element cho pagination và navigation
        const pagination = document.createElement("div");
        pagination.className = "swiper-pagination product-pagination"; // Thêm class để có thể style riêng

        const navPrev = document.createElement("div");
        navPrev.className = "swiper-button-prev product-nav-prev";

        const navNext = document.createElement("div");
        navNext.className = "swiper-button-next product-nav-next";

        productContainer.appendChild(pagination); // Pagination vẫn ở trong
        productContainer.appendChild(navPrev); // Đưa nút ra ngoài
        productContainer.appendChild(navNext); // Đưa nút ra ngoài
        // 7. Xóa các nút indicators cũ đi
        if (
          oldIndicators &&
          oldIndicators.querySelectorAll(".product-indicator").length > 0
        ) {
          oldIndicators.remove();
        }

        // 8. Khởi tạo Swiper
        const productSwiper = new Swiper(".product-swiper", {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 50,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: ".swiper-pagination.product-swiper-pagination",
            clickable: true,
          },
          navigation: {
            // Sử dụng các class của nút mà bạn đã tạo ở trên
            nextEl: ".product-nav-next", // Đảm bảo khớp với className ở trên
            prevEl: ".product-nav-prev", // Đảm bảo khớp với className ở trên
          },
          speed: 800, // Tăng nhẹ tốc độ chuyển cảnh (miligiây)
          effect: "fade",
          fadeEffect: {
            crossFade: true, // Hiệu ứng mờ dần chồng lên nhau, rất mượt
          },
        });
      }
    }

    // --- Partner Logos Marquee ---
    if (document.getElementById("partner-logos-wrapper")) {
      const logoFiles = [
        "logo-24-alo-store.png",
        "logo-2nam-store.png",
        "logo-alodidong.png",
        "logo-andylong.png",
        "logo-centerphone.png",
        "logo-chang-trai-ban-tao.jpg",
        "logo-dai-viet.png",
        "logo-di-dong-360.png",
        "logo-didongmy.png",
        "logo-ha-store.png",
        "logo-hi-tao-thom.png",
        "logo-hoang-kien.webp",
        "logo-huy-hoang.jpg",
        "logo-hvh76-store.png",
        "logo-khang-huy-apple.jpg",
        "logo-ldl-phone.png",
        "logo-le-quan.png",
        "logo-lock-mall.png",
        "logo-minh-hao-store.png",
        "logo-minh-thang-store.jpg",
        "logo-mobile-world.png",
        "logo-ngoc-thanh.png",
        "logo-nha-tao.png",
        "logo-phat-thanh.png",
        "logo-phu-gia.png",
        "logo-phu-vuong-mobile.png",
        "logo-renew-zone.png",
        "logo-sang-apple.png",
        "logo-taozin.png",
        "logo-thang-tao.png",
        "logo-thanh-luxury-mobile.png",
        "logo-the-gioi-tao.png",
        "logo-tt-mobile.png",
        "logo-vien-quang.svg",
        "logo-vphone.svg",
        "logo-zen-store.png",
      ];
      const logoDirectory = "static/logo-partners/";
      const wrapper = document.getElementById("partner-logos-wrapper");
      function createLogoSet() {
        const logoSet = document.createElement("div");
        logoSet.className =
          "flex-shrink-0 flex items-center justify-around w-full space-x-4";
        logoFiles.forEach((file) => {
          const logoContainer = document.createElement("div");
          logoContainer.className = "partner-logo-container";
          const img = document.createElement("img");
          img.src = logoDirectory + file;
          img.alt = file.split(".")[0].replace(/-/g, " ") + " Logo";
          img.className = "partner-logo-img";
          logoContainer.appendChild(img);
          logoSet.appendChild(logoContainer);
        });
        return logoSet;
      }
      if (wrapper) {
        wrapper.appendChild(createLogoSet());
        wrapper.appendChild(createLogoSet());
        setTimeout(() => {
          wrapper.classList.add("marquee-content");
        }, 10);
      }
    }

    // --- Counter Animation ---
    if (document.querySelector("[data-counter]")) {
      const counters = document.querySelectorAll("[data-counter]");
      function animateCounter(counter) {
        const target = +counter.getAttribute("data-counter");
        const speed = 700;
        const updateCount = () => {
          const count = +counter.innerText.replace(/\./g, "");
          const increment = target / speed;
          if (count < target) {
            counter.innerText = Math.ceil(count + increment).toLocaleString(
              "vi-VN"
            );
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target.toLocaleString("vi-VN");
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
        { threshold: 0.5 }
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
  const imageDirectory = "static/stats-images/";
  const columns = document.querySelectorAll(".stats-bg-column");

  if (columns.length === 0) return;

  // Lấy danh sách hình ảnh từ file JSON
  fetch('data/stats-images.json')
    .then(response => {
      // Kiểm tra nếu có lỗi khi tải file
      if (!response.ok) {
        throw new Error('Không thể tải file stats-images.json');
      }
      return response.json();
    })
    .then(statsImageFiles => {
      // Bắt đầu xử lý hình ảnh khi dữ liệu đã được tải
      columns.forEach((column) => {
        // Tạo một bản sao của danh sách ảnh để xáo trộn
        let imageListForThisColumn = [...statsImageFiles];

        // Xáo trộn danh sách ảnh
        shuffleArray(imageListForThisColumn);

        // Nhân đôi danh sách đã xáo trộn để tạo hiệu ứng lặp vô hạn
        const fullImageList = [
          ...imageListForThisColumn,
          ...imageListForThisColumn,
        ];

        // Xóa nội dung cũ của cột và thêm các ảnh mới
        column.innerHTML = "";
        fullImageList.forEach((fileName) => {
          const img = document.createElement("img");
          img.src = imageDirectory + fileName;
          img.alt = "Stats background image";
          column.appendChild(img);
        });
      });
    })
    .catch(error => {
      console.error("Lỗi khi tải danh sách hình ảnh:", error);
    });
}
    populateStatsBackground();

    const typingSubtitle = document.querySelector(
      "#hero-slide-1 .hero-subtitle"
    );
    const subtitleText = "Tài chính nhanh gọn, Sản phẩm trong tầm tay";
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
      new Swiper(".hero-swiper", {
        loop: true,
        effect: "fade",
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });

      // 2. Particle.js Initialization
      if (document.getElementById("particles-js")) {
        particlesJS("particles-js", {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 2, random: true },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "canvas",
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
      const subtitleEl = document.getElementById("hero-subtitle");
      if (subtitleEl) {
        const text = "Tài chính nhanh gọn, Sản phẩm trong tầm tay.";
        let index = 0;
        subtitleEl.innerHTML = ""; // Clear initial text

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
      const magneticBtn = document.getElementById("magnetic-btn");
      if (magneticBtn) {
        const effectEl = document.createElement("span");
        effectEl.classList.add("magnetic-effect");
        magneticBtn.prepend(effectEl);

        magneticBtn.addEventListener("mouseenter", function (e) {
          effectEl.style.width = "225px";
          effectEl.style.height = "225px";
        });

        magneticBtn.addEventListener("mousemove", function (e) {
          const rect = magneticBtn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          effectEl.style.left = `${x}px`;
          effectEl.style.top = `${y}px`;
        });

        magneticBtn.addEventListener("mouseleave", function (e) {
          effectEl.style.width = "0px";
          effectEl.style.height = "0px";
        });
      }
    }
    // GỌI HÀM NEWS TICKER ===
    initializeNewsTicker();
    initializeProductSlider();
    // --- Initialize AOS ---
    AOS.init({ duration: 1000, once: true });
    highlightActiveNav(); // Highlight the nav link after the header is loaded

    // --- LOGIC CHO MOBILE MENU ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMobileMenuButton = document.getElementById('close-mobile-menu');

if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.classList.add('overflow-hidden'); // Ngăn cuộn trang khi menu mở
    });
    closeMobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
    });
    // Đóng menu khi click vào một link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    });
}
  }
  
});
