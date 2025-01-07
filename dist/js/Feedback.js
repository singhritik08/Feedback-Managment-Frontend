document.addEventListener('DOMContentLoaded', function () {
    // Menu Button Toggle for Mobile
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Profile Toggle for Desktop
    const profile = document.getElementById('profile');
    const profileCard = document.getElementById('profile-card');
    if (profile && profileCard) {
        profile.addEventListener('click', function (event) {
            event.preventDefault();
            profileCard.classList.toggle('hidden');
        });
    }

    // Close profile card if clicked outside
    window.addEventListener('click', function (e) {
        if (profile && profileCard && !profile.contains(e.target) && !profileCard.contains(e.target)) {
            profileCard.classList.add('hidden');
        }
        if (mobileProfile && mobileProfileCard && !mobileProfile.contains(e.target) && !mobileProfileCard.contains(e.target)) {
            mobileProfileCard.classList.add('hidden');
        }
    });

    // Profile Toggle for Mobile
    const mobileProfile = document.getElementById('mobile-profile');
    const mobileProfileCard = document.getElementById('mobile-profile-card');
    if (mobileProfile && mobileProfileCard) {
        mobileProfile.addEventListener('click', function (event) {
            event.preventDefault();
            mobileProfileCard.classList.toggle('hidden');
        });
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);

    if (user) {
        document.getElementById('userFullName').textContent = user.username;
        document.getElementById('userPhone').textContent = user.phone;
        document.getElementById('userRole').textContent = `Role: ${user.role}`;
        profileCard.classList.remove('hidden');

        document.getElementById('mobileUserFullName').textContent = user.username;
        document.getElementById('mobileUserPhone').textContent = user.phone;
        document.getElementById('mobileUserRole').textContent = `Role: ${user.role}`;
    } else {
        document.getElementById('userFullName').textContent = "Please, Login First!";
        document.getElementById('userPhone').textContent = '';
        document.getElementById('userRole').textContent = '';
        document.getElementById('logout-button').textContent = '';

        document.getElementById('mobileUserFullName').textContent = "Please, Login First!";
        document.getElementById('mobileUserPhone').textContent = '';
        document.getElementById('mobileUserRole').textContent = '';
        document.getElementById('mobile-logout-button').textContent = '';
    }

    const courseId = sessionStorage.getItem('selectedCourseId'); // Use sessionStorage key properly
    // console.log(courseId);

    // Fetch course details from the API
    fetch(`https://feedback-system-backend-p8f5.onrender.com/api/course/course/by/id?id=${courseId}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                const courseSelect = document.getElementById('courseSelect');
                const instructorName = document.getElementById('instructorName');
                const courseName = data.courseName;
                const instructor = data.instructor;

                courseSelect.value = courseName;
                instructorName.value = instructor;
            }
        })
        .catch(error => {
            console.error('Error fetching course data:', error);
        });

    // Submit Feedback Form
    const feedbackForm = document.querySelector('form');
    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent form submission

        const courseId = sessionStorage.getItem('selectedCourseId');
        const instructor = document.getElementById('instructorName').value;
        const rating = document.getElementById('rating').value;
        const comments = document.getElementById('comments').value;

        const userId = sessionStorage.getItem('userId');

        const feedbackData = {
            userId,            
            courseId,          
            instructor,
            rating,
            comments
        };

        // Call API to submit feedback
        fetch('https://feedback-system-backend-p8f5.onrender.com/api/feedback/submit/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        })
        .then(async response => {
            if (!response.ok){
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error('Server error');
            }
            return response.json();
        })
        .then(data => {
            alert('Feedback submitted successfully!');
            window.location.href = '/dist/html/Course.html';
        })
        .catch(error => {
            console.error('Error submitting feedback:', error);
            alert('Please fill in all fields. (Included rating)');
        });
    });
});

function logout() {
    localStorage.removeItem('user');
    sessionStorage.clear(); 
    window.location.href = '/Index.html';
}

function setRating(value) {
    document.getElementById('rating').value = value;
    document.getElementById('ratingText').textContent = 'Rating: ' + value + ' stars';
}
