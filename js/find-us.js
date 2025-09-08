document.addEventListener('DOMContentLoaded', function () {
  // Hàm để tải các thành phần HTML (header, footer) một cách an toàn
  const loadComponent = (selector, url, callback) => {
    const element = document.querySelector(selector);
    if (element) {
      fetch(url)
        .then(response => response.ok ? response.text() : Promise.resolve(''))
        .then(data => {
          if (data) element.innerHTML = data;
          if (callback) callback();
        });
    }
  };
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
  // Hàm mới để đọc dữ liệu đối tác từ file JSON
  async function loadPartnersData() {
    try {
      // Đường dẫn tới file JSON bạn đã tạo
      const response = await fetch('data/partners.json');

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }

      const partners = await response.json();
      return partners;
    } catch (error) {
      console.error("Không thể tải dữ liệu đối tác:", error);
      return []; // Trả về một mảng rỗng nếu có lỗi
    }
  }

  // Hàm làm nổi bật liên kết điều hướng đang hoạt động
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'find-us.html';
    const navLinks = document.querySelectorAll('#header-placeholder .nav-link');

    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('font-bold');
        link.classList.remove('opacity-80');
        // Thêm các lớp màu sắc nếu cần
        if (link.classList.contains('text-white')) {
          link.classList.add('text-t86-green-accent'); // Ví dụ: đổi màu cho link active
        }
      }
    });
  }

  // Tải Header và Footer, sau đó thực thi hàm highlight
  // Tải Header và Footer, sau đó thực thi các hàm cần thiết
  loadComponent('#header-placeholder', 'header.html', () => {
    highlightActiveNav();
    // ==========================================================
    // BƯỚC 2: GỌI HÀM MENU NGAY SAU KHI HEADER ĐƯỢC TẢI
    // ==========================================================
    initializeMobileMenu(); 
  });
  loadComponent('#footer-placeholder', 'footer.html');

  // --- Logic riêng cho trang Find Us ---
  const searchBox = document.getElementById('search-box');
  const cityFilter = document.getElementById('city-filter');
  const districtFilter = document.getElementById('district-filter');
  const partnerList = document.getElementById('partner-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  const resetButton = document.getElementById('reset-button');

  let allPartners = [];

  // Kiểm tra xem các phần tử có tồn tại trước khi thêm sự kiện
  if (searchBox && cityFilter && partnerList) {
    // Thay thế logic Papa.parse bằng hàm tải JSON
    loadPartnersData().then(partners => {
      allPartners = partners;
      populateCityFilter(allPartners);
      renderPartners([]); // Hiển thị danh sách rỗng ban đầu

      if (loadingIndicator) loadingIndicator.style.display = 'none';

      searchBox.addEventListener('keyup', applyFilters);
      cityFilter.addEventListener('change', () => {
        populateDistrictFilter(allPartners, cityFilter.value);
        applyFilters();
      });
      if (districtFilter) districtFilter.addEventListener('change', applyFilters);
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          searchBox.value = '';
          cityFilter.selectedIndex = 0;
          cityFilter.dispatchEvent(new Event('change')); // Kích hoạt để xóa bộ lọc quận/huyện
        });
      }
    });
  }


  function populateCityFilter(partners) {
    const cities = [...new Set(partners.map(p => p['Tỉnh thành']).filter(Boolean))].sort();
    // Xóa các lựa chọn cũ trừ cái đầu tiên
    while (cityFilter.options.length > 1) {
        cityFilter.remove(1);
    }
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
  }

  function populateDistrictFilter(partners, selectedCity) {
    if (!districtFilter) return;
    districtFilter.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
    if (!selectedCity) return;
    
    const districts = [...new Set(
        partners
            .filter(p => p['Tỉnh thành'] === selectedCity)
            .map(p => p['Khu vực'])
            .filter(Boolean)
    )].sort();

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        districtFilter.appendChild(option);
    });
  }

  function renderPartners(partners) {
    partnerList.innerHTML = '';
    
    const searchTerm = searchBox.value;
    const selectedCity = cityFilter.value;

    if (partners.length === 0) {
      // Chỉ hiển thị "Không tìm thấy" nếu người dùng đã bắt đầu tìm kiếm
      if (searchTerm || selectedCity) {
        partnerList.innerHTML = '<p class="text-center text-t86-blue col-span-full">Không tìm thấy đối tác phù hợp.</p>';
      } else {
        partnerList.innerHTML = '<p class="text-center text-gray-500 col-span-full">Vui lòng chọn Tỉnh/Thành phố hoặc nhập từ khóa để tìm kiếm đối tác.</p>';
      }
      return;
    }

    partners.forEach(partner => {
      let mapLinkHtml = ''; // Mặc định là chuỗi rỗng
    // Chỉ tạo thẻ <a> nếu cột 'Link Google Map' có dữ liệu
    if (partner['Link Google Map'] && partner['Link Google Map'].trim() !== '') {
      mapLinkHtml = `
        <a href="${partner['Link Google Map']}" target="_blank" rel="noopener noreferrer" class="text-t86-green-light hover:text-t86-green font-semibold text-sm transition-colors duration-300">
          Xem trên bản đồ <i class="fas fa-map-marker-alt ml-1"></i>
        </a>
      `;
    }

    // Giữ nguyên logic tạo logo
    const logoHtml = partner['Logo'] ? `
      <div class="flex-shrink-0 w-24 h-24 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-300">
        <img src="${partner['Logo']}" alt="Logo của ${partner['Tên đối tác']}" class="max-w-full max-h-full object-contain p-2">
      </div>
    ` : '';

    // Bước 2: Dựng thẻ đối tác và chèn biến mapLinkHtml vào
    const partnerCard = `
      <div class="group bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-x-6">
        <div class="flex-grow">
          <h3 class="font-bold text-lg text-t86-blue mb-2 group-hover:text-t86-green-light transition-colors duration-300">${partner['Tên đối tác']}</h3>
          <p class="text-t86-dark text-sm mb-1"><i class="fas fa-map-marker-alt w-5 mr-2 text-t86-gray"></i>${partner['Địa chỉ']}</p>
          <p class="text-t86-dark text-sm mb-3"><i class="fas fa-phone w-5 mr-2 text-t86-gray"></i>${partner['Số điện thoại']}</p>
          ${mapLinkHtml}
        </div>
        ${logoHtml}
      </div>`;
    
      partnerList.innerHTML += partnerCard;
    });
  }

  function applyFilters() {
    const searchTerm = searchBox.value.toLowerCase().trim();
    const selectedCity = cityFilter.value;
    const selectedDistrict = districtFilter ? districtFilter.value : '';

    let filteredPartners = allPartners;

    // Lọc theo thành phố trước, vì đây là bộ lọc chính
    if (selectedCity) {
      filteredPartners = filteredPartners.filter(p => p['Tỉnh thành'] === selectedCity);
    }
    
    // Lọc theo quận/huyện
    if (selectedDistrict) {
      filteredPartners = filteredPartners.filter(p => p['Khu vực'] === selectedDistrict);
    }
    
    // Lọc theo từ khóa tìm kiếm trên kết quả đã lọc
    if (searchTerm) {
      filteredPartners = filteredPartners.filter(p =>
        (p['Tên đối tác'] && p['Tên đối tác'].toLowerCase().includes(searchTerm)) ||
        (p['Địa chỉ'] && p['Địa chỉ'].toLowerCase().includes(searchTerm))
      );
    }
    
    renderPartners(filteredPartners);
  }
});