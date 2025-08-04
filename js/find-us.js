// js/find-us.js

document.addEventListener('DOMContentLoaded', function () {
  console.log('Find-Us page script loaded.');

  // Function to load header and footer
  const loadComponent = (selector, url) => {
    const element = document.querySelector(selector);
    if (element) {
      fetch(url)
        .then((response) =>
          response.ok ? response.text() : Promise.resolve('')
        )
        .then((data) => {
          if (data) element.innerHTML = data;
        });
    }
  };
  loadComponent('#header-placeholder', 'header.html');
  loadComponent('#footer-placeholder', 'footer.html');
  loadComponent('#find-us-placeholder', 'find-us.html');

  // --- Logic for the Find Us Page ---
  const searchBox = document.getElementById('search-box');
  const cityFilter = document.getElementById('city-filter');
  const districtFilter = document.getElementById('district-filter');
  const partnerList = document.getElementById('partner-list');
  const loadingIndicator = document.getElementById('loading-indicator');
  let allPartners = [];

  Papa.parse('partner_utf8.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    encoding: 'UTF-8',
    transformHeader: (header) => header.trim(),
    complete: function (results) {
      // ✅ UPDATED to use the correct Vietnamese key
      allPartners = results.data.filter(
        (p) => p['Tên đối tác'] && p['Tên đối tác'].trim() !== ''
      );
      populateCityFilter(allPartners);
      renderPartners(allPartners);
      if (loadingIndicator) loadingIndicator.style.display = 'none';

      searchBox.addEventListener('keyup', applyFilters);
      cityFilter.addEventListener('change', () => {
        populateDistrictFilter(allPartners, cityFilter.value);
        applyFilters();
      });
      districtFilter.addEventListener('change', applyFilters);
    },
  });

  function populateCityFilter(partners) {
    // ✅ UPDATED to use the correct Vietnamese key: 'Thành phố'
    const cities = [
      ...new Set(partners.map((p) => p['Tỉnh thành']).filter(Boolean)),
    ].sort();
    cities.forEach((city) => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });
  }

  function populateDistrictFilter(partners, selectedCity) {
    districtFilter.innerHTML =
      '<option value="">-- Chọn Quận/Huyện --</option>';
    if (!selectedCity) return;
    // ✅ UPDATED to use the correct Vietnamese keys: 'Thành phố' and 'Quận/Huyện'
    const districts = [
      ...new Set(
        partners
          .filter((p) => p['Tỉnh thành'] === selectedCity)
          .map((p) => p['Khu vực'])
          .filter(Boolean)
      ),
    ].sort();
    districts.forEach((district) => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtFilter.appendChild(option);
    });
  }

  function renderPartners(partners) {
    partnerList.innerHTML = '';
    if (partners.length === 0) {
      partnerList.innerHTML =
        '<p class="text-center text-t86-gray col-span-full">Không tìm thấy đối tác phù hợp.</p>';
      return;
    }
    partners.forEach((partner) => {
      // ✅ UPDATED to use all correct Vietnamese keys
      const partnerCard = `
              <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 class="font-bold text-lg text-t86-blue mb-2">${partner['Tên đối tác']}</h3>
                <p class="text-t86-dark text-sm mb-1"><i class="fas fa-map-marker-alt w-5 mr-2 text-t86-gray"></i>${partner['Địa chỉ']}</p>
                <p class="text-t86-dark text-sm mb-3"><i class="fas fa-phone w-5 mr-2 text-t86-gray"></i>${partner['Số điện thoại']}</p>
                <a href="${partner['Link Google Map']}" target="_blank" rel="noopener noreferrer" class="text-t86-green hover:text-t86-green-light font-semibold text-sm">
                  Xem trên bản đồ <i class="fas fa-arrow-right ml-1"></i>
                </a>
              </div>`;
      partnerList.innerHTML += partnerCard;
    });
  }

  function applyFilters() {
    const searchTerm = searchBox.value.toLowerCase();
    const selectedCity = cityFilter.value;
    const selectedDistrict = districtFilter.value;
    let filteredPartners = allPartners;
    // ✅ UPDATED to use the correct Vietnamese keys
    if (selectedCity) {
      filteredPartners = filteredPartners.filter(
        (p) => p['Tỉnh thành'] === selectedCity
      );
    }
    if (selectedDistrict) {
      filteredPartners = filteredPartners.filter(
        (p) => p['Khu vực'] === selectedDistrict
      );
    }
    if (searchTerm) {
      filteredPartners = filteredPartners.filter(
        (p) =>
          (p['Tên đối tác'] &&
            p['Tên đối tác'].toLowerCase().includes(searchTerm)) ||
          (p['Địa chỉ'] && p['Địa chỉ'].toLowerCase().includes(searchTerm))
      );
    }
    renderPartners(filteredPartners);
  }
});
