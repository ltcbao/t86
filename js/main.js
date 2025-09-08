document.addEventListener("DOMContentLoaded", function () {
  const loadComponent = (selector, url) => {
    const element = document.querySelector(selector);
    if (element) {
      return fetch(url)
        .then((response) =>
          response.ok ? response.text() : Promise.resolve("")
        )
        .then((data) => {
          if (data) element.innerHTML = data;
        });
    }
    return Promise.resolve();
  };

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

  function highlightActiveNav() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("#header-placeholder .nav-link");
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      if (linkHref === currentPage) {
        link.classList.add("text-t86-green", "font-bold");
        link.classList.remove("text-t86-dark");
        if (document.querySelector(".header-gradient")) {
          link.classList.remove("opacity-80", "text-white");
        }
      }
    });
  }

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
          switch (item.type) {
            case "new":
              tagClass = "bg-t86-green-light text-white";
              break;
            case "partner":
              tagClass = "bg-white/20 text-white";
              break;
          }
          newsHtml += `
          <span class="mx-8">
            <span class="${tagClass} text-xs font-bold px-2 py-1 rounded-md mr-2">${item.tag}</span>
            ${item.text}
          </span>
          <span class="text-white/50 mx-4">•</span>
        `;
        });
        container.innerHTML = newsHtml + newsHtml;
      })
      .catch((error) => {
        console.error("Lỗi khi xử lý news-ticker:", error);
        container.innerHTML =
          '<span class="mx-8">Không thể tải tin tức...</span>';
      });
  }

  function initializeProductSlider() {
    const mainContainer = document.getElementById("product-content-placeholder");
    if (!mainContainer) return;

    fetch("data/products.json")
      .then((response) => response.json())
      .then((productData) => {
        let slidesHtml = "";
        
        productData.forEach((slide) => {
          const featuresHtml = slide.features
            .map((feature) => {
              const formattedFeature = feature.replace(
                /\*\*(.*?)\*\*/g,
                '<span class="font-bold mx-1 text-t86-green-light">$1</span>'
              );
              return `<li class="product-feature-item">
                    <i class="fas fa-check text-t86-green-light mr-3"></i>${formattedFeature}
                  </li>`;
            })
            .join("");

            slidesHtml += `
          <div class="swiper-slide" data-link="${slide.button.link}">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              <div class="product-content-wrapper text-center md:text-left">
                <p class="font-raleway text-lg text-t86-dark mb-1">${slide.preTitle}</p>
                <h2 class="text-4xl md:text-5xl font-bold tracking-tight leading-tight uppercase text-t86-green-light">${slide.title}</h2>
                <ul class="product-ul mt-6 space-y-3 text-md text-t86-dark/90">${featuresHtml}</ul>
                <div class="mt-8">
                  <button class="bg-t86-green text-white font-bold px-8 py-3 rounded-full hover:bg-t86-green-light hover:scale-105 ripple btn-product">
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

        mainContainer.innerHTML = `
          <div class="product-slides-container relative container mx-auto px-4">
            <div class="swiper product-swiper">
              <div class="swiper-wrapper">${slidesHtml}</div>
              <div class="swiper-pagination product-pagination"></div>
            </div>
            <div class="swiper-button-prev product-nav-prev"></div>
            <div class="swiper-button-next product-nav-next"></div>
          </div>
        `;

        const productSwiper = new Swiper(".product-swiper", {
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

        // Hàm cập nhật đường link cho nút bấm
        const updateButtonLink = (swiper) => {
          const activeSlide = swiper.slides[swiper.realIndex];
          const button = activeSlide.querySelector('.btn-product');
          const newLink = activeSlide.getAttribute('data-link');
          if (button && newLink) {
            button.onclick = () => {
              window.location.href = newLink;
            };
          }
        };

        // Cập nhật đường link ngay khi khởi tạo Swiper
        updateButtonLink(productSwiper);

        // Cập nhật đường link mỗi khi slide thay đổi
        productSwiper.on('slideChange', () => {
          updateButtonLink(productSwiper);
        });
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu sản phẩm:", error));
  }
  
  function initializeAllScripts() {
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
          hideOnClick: false,
        },
        on: {
          slideChange: function () {
            const activeSlide = this.slides[this.activeIndex];
            const aosElements = activeSlide.querySelectorAll("[data-aos]");
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
          detect_on: "window",
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

    if (document.getElementById("partner-logos-wrapper")) {
      const logoDirectory = "static/logo-partners/";
      const wrapper = document.getElementById("partner-logos-wrapper");

      function createLogoSet(logoFiles) {
        const logoSet = document.createElement("div");
        logoSet.className = "flex-shrink-0 flex items-center justify-around w-full space-x-4";
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

      fetch('data/logo-partners.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Không thể tải file logo-partners.json');
          }
          return response.json();
        })
        .then(logoFiles => {
          if (wrapper) {
            wrapper.appendChild(createLogoSet(logoFiles));
            wrapper.appendChild(createLogoSet(logoFiles));
            setTimeout(() => {
              wrapper.classList.add("marquee-content");
            }, 10);
          }
        })
        .catch(error => {
          console.error("Lỗi khi tải danh sách logo đối tác:", error);
          if (wrapper) {
            wrapper.innerHTML = '<p class="text-center text-gray-500">Không thể tải logo đối tác.</p>';
          }
        });
    }

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
      fetch('data/stats-images.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Không thể tải file stats-images.json');
          }
          return response.json();
        })
        .then(statsImageFiles => {
          columns.forEach((column) => {
            let imageListForThisColumn = [...statsImageFiles];
            shuffleArray(imageListForThisColumn);
            const fullImageList = [...imageListForThisColumn, ...imageListForThisColumn];
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

    const typingSubtitle = document.querySelector("#hero-slide-1 .hero-subtitle");
    const subtitleText = "Tài chính nhanh gọn, Sản phẩm trong tầm tay";
    let charIndex = 0;
    function typeWriter() {
      if (charIndex < subtitleText.length) {
        typingSubtitle.textContent = subtitleText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, 50);
      }
    }
    if (typingSubtitle) {
      setTimeout(typeWriter, 500);
    }
    function initializeHeroScripts() {
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
      const subtitleEl = document.getElementById("hero-subtitle");
      if (subtitleEl) {
        const text = "Tài chính nhanh gọn, Sản phẩm trong tầm tay.";
        let index = 0;
        subtitleEl.innerHTML = "";
        function typeWriter() {
          if (index < text.length) {
            subtitleEl.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 55);
          }
        }
        setTimeout(typeWriter, 1200);
      }
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
      function initializeMobileMenu() {
  const menuButton = document.getElementById("mobile-menu-button");
  const closeButton = document.getElementById("close-mobile-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && closeButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.add("is-open");
    });

    closeButton.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
    });
  }
}
initializeMobileMenu();
    initializeNewsTicker();
    initializeProductSlider();
    AOS.init({ duration: 1000, once: true });
    highlightActiveNav();
  }
});