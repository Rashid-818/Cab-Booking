 
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });

        // Indian Cities Data
        const cities = [
            {name: 'Mumbai', state: 'Maharashtra', img:'ProCab/images/mumbai.jpg'},
            {name: 'Delhi', state: 'Delhi NCR', img: 'ProCab/images/delhi.jpg'},
            {name: 'Bangalore', state: 'Karnataka', img: 'ProCab/images/banglore.jpg'},
            {name: 'Chennai', state: 'Tamil Nadu', img: 'ProCab/images/chennai.jpg'},
            {name: 'Hyderabad', state: 'Telangana', img: 'ProCab/images/hyderabad.jpg'},
            {name: 'Kolkata', state: 'West Bengal', img: 'ProCab/images/kolkata.jpg'},
            {name: 'Pune', state: 'Maharashtra', img: 'ProCab/images/pune.jpg'},
            {name: 'Jaipur', state: 'Rajasthan', img: 'ProCab/images/jaipur.jpg'},
            {name: 'Ahmedabad', state: 'Gujarat', img: 'ProCab/images/ahmedabad.jpg'},
            {name: 'Goa', state: 'Goa', img: 'ProCab/images/goa.jpg'},
            {name: 'Lucknow', state: 'Uttar Pradesh', img: 'ProCab/images/lucknow.jpg'},
            {name: 'Chandigarh', state: 'Punjab', img: 'ProCab/images/chandigarh.jpg'}
        ];

        let currentBooking = null;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            populateCities();
            createCitiesGrid();
            setMinDate();
            initNavbar();
            initOTP();
            initScrollEvents();
        });

        // Populate city dropdowns
        function populateCities() {
            const pickup = document.getElementById('pickupCity');
            const drop = document.getElementById('dropCity');
            
            cities.forEach(city => {
                pickup.innerHTML += `<option value="${city.name}">${city.name}, ${city.state}</option>`;
                drop.innerHTML += `<option value="${city.name}">${city.name}, ${city.state}</option>`;
            });
        }

        // Create cities grid
        function createCitiesGrid() {
            const grid = document.getElementById('citiesGrid');
            cities.slice(0, 12).forEach((city, index) => {
                grid.innerHTML += `
                    <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="${index * 50}">
                        <div class="city-card h-100 overflow-hidden" onclick="quickSelect('${city.name}')">
                            <img src="${city.img}" class="city-img w-100" alt="${city.name}">
                            <div class="city-overlay p-4 text-white">
                                <h5 class="fw-bold mb-2">${city.name}</h5>
                                <p class="mb-1">${city.state}</p>
                                <small>Quick Book</small>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Booking Form Handler
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnText = document.getElementById('btnText');
            const spinner = document.getElementById('loadingSpinner');
            
            // Show loading
            btnText.style.display = 'none';
            spinner.classList.remove('d-none');
            
            setTimeout(() => {
                // Hide loading
                spinner.classList.add('d-none');
                btnText.style.display = 'inline';
                
                // Create booking data
                currentBooking = {
                    pickup: document.getElementById('pickupCity').value,
                    drop: document.getElementById('dropCity').value,
                    date: document.getElementById('journeyDate').value,
                    time: document.getElementById('journeyTime').value,
                    cab: document.getElementById('cabType').value,
                    id: 'BOOK' + Date.now().toString().slice(-7),
                    distance: Math.floor(Math.random() * 150) + 50,
                    fare: 0
                };
                
                // Calculate fare
                const rates = {hatchback: 10, sedan: 13, suv: 18};
                currentBooking.fare = (currentBooking.distance * rates[currentBooking.cab]).toFixed(0);
                
                // Show booking modal
                showBookingModal();
                
            }, 1500);
        });

        // Show Booking Modal
        function showBookingModal() {
            const summary = document.getElementById('bookingSummary');
            summary.innerHTML = `
                <div class="row g-3 text-center">
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3">
                            <h6 class="fw-bold mb-2">${currentBooking.pickup}</h6>
                            <small class="text-success"><i class="fas fa-map-pin me-1"></i>Pickup</small>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3">
                            <h6 class="fw-bold mb-2">${currentBooking.drop}</h6>
                            <small class="text-danger"><i class="fas fa-flag-checkered me-1"></i>Dropoff</small>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="p-4 bg-light rounded-3">
                            <div class="row text-start">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-1">Booking ID: ${currentBooking.id}</h6>
                                    <p class="mb-1"><strong>${currentBooking.cab.toUpperCase()}</strong></p>
                                    <p class="mb-1">${currentBooking.distance} km | ${currentBooking.date}</p>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <h3 class="text-primary fw-bold">₹${currentBooking.fare}</h3>
                                    <small class="text-muted">Total Amount</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            new bootstrap.Modal(document.getElementById('bookingModal')).show();
        }

        // OTP Functionality
        function initOTP() {
            const inputs = document.querySelectorAll('.otp-input');
            
            inputs.forEach((input, index) => {
                input.addEventListener('input', function(e) {
                    if (this.value.length === 1 && index < 5) {
                        inputs[index + 1].focus();
                    }
                });
                
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && !this.value && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
                
                input.addEventListener('paste', function(e) {
                    e.preventDefault();
                    const paste = (e.clipboardData || window.clipboardData).getData('text');
                    const values = paste.split('').map((d, i) => i < 6 ? d : '').slice(0, 6);
                    
                    inputs.forEach((input, i) => {
                        input.value = values[i];
                        if (values[i] && i < 5) inputs[i + 1].focus();
                    });
                });
            });
        }

        function verifyBooking() {
            const otpInputs = document.querySelectorAll('.otp-input');
            const otp = Array.from(otpInputs).map(i => i.value).join('');
            
            if (otp.length === 6) {
                // Success animation
                document.getElementById('verifyBtn').innerHTML = '<i class="fas fa-check me-2"></i>Booking Verified!';
                document.getElementById('verifyBtn').classList.add('disabled');
                
                setTimeout(() => {
                    alert(`✅ Booking Confirmed!\n\nBooking ID: ${currentBooking.id}\nAmount: ₹${currentBooking.fare}\n\nDriver details SMSed to your phone. Safe travels! 🚗`);
                    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
                    document.getElementById('bookingForm').reset();
                    setMinDate();
                }, 1500);
            } else {
                alert('Please enter complete 6-digit OTP');
            }
        }

        function resendOTP() {
            alert('OTP resent to +91 98XXX XXXXXX');
        }

        // Utility Functions
        function setMinDate() {
            document.getElementById('journeyDate').min = new Date().toISOString().split('T')[0];
        }

        function quickSelect(city) {
            document.getElementById('pickupCity').value = city;
            document.querySelector('.search-card').scrollIntoView({behavior: 'smooth'});
        }

        function selectCabType(type) {
            document.getElementById('cabType').value = type;
            document.querySelector('.search-card').scrollIntoView({behavior: 'smooth'});
        }

        function openBookingModal() {
            document.querySelector('.search-card').scrollIntoView({behavior: 'smooth'});
        }

        function scrollToTop() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        function initNavbar() {
            window.addEventListener('scroll', () => {
                const navbar = document.querySelector('.navbar-custom');
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }

        function initScrollEvents() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        }
    