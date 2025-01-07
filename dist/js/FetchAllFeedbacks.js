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

    // Profile Toggle for Mobile
    const mobileProfile = document.getElementById('mobile-profile');
    const mobileProfileCard = document.getElementById('mobile-profile-card');
    if (mobileProfile && mobileProfileCard) {
        mobileProfile.addEventListener('click', function (event) {
            event.preventDefault();
            mobileProfileCard.classList.toggle('hidden');
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

    // Display user data in navbar if logged in
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user) {
        document.getElementById('userFullName').textContent = user.username;
        document.getElementById('userPhone').textContent = user.phone;
        document.getElementById('userRole').textContent = `Role: ${user.role}`;
        profileCard.classList.remove('hidden');

        document.getElementById('mobileUserFullName').textContent = user.username;
        document.getElementById('mobileUserPhone').textContent = user.phone;
        document.getElementById('mobileUserRole').textContent = `Role: ${user.role}`;

    }else{
        document.getElementById('userFullName').textContent = "Please, Login First! ";
        document.getElementById('userPhone').textContent = '';
        document.getElementById('userRole').textContent = '';
        document.getElementById('previous-feedback').textContent = 'SignIn';
        document.getElementById('logout-button').textContent = '';

        document.getElementById('mobileUserFullName').textContent = "Please, Login First! ";
        document.getElementById('mobileUserPhone').textContent = '';
        document.getElementById('mobileUserRole').textContent = '';
        document.getElementById('mobile-previous-feedback').textContent = '';
        document.getElementById('mobile-logout-button').textContent = '';
       }

});

// Logout function
function logout() {``
    localStorage.removeItem('user');
    sessionStorage.clear(); 
    window.location.href = '/Index.html';
}
        
        async function fetchFeedbacks() {
            try {
                const response = await fetch('https://feedback-system-backend-p8f5.onrender.com/api/feedback/get/all/feedback');
                const data = await response.json();

                const feedbackList = document.getElementById('feedback-list');
                feedbackList.innerHTML = '';  
                

                // Loop through the feedback data
                for (const feedback of data) {
                    try {
                        const courseResponse = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/course/course/by/id?id=${feedback.courseId}`);
                        const courseData = await courseResponse.json();
                        const courseName = courseData.courseName || 'Course Name Not Available';

                    
                        const userResponse = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/user/get/username/by/UserId?userId=${feedback.userId}`);
                        const userData = await userResponse.json();
                        const userName = userData.username || 'Unknown User';

                        const instructorName = feedback.instructor ? feedback.instructor : 'Unknown Instructor';

                        
                        const feedbackItem = document.createElement('div');
                        feedbackItem.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md', 'space-y-4');

                        feedbackItem.innerHTML = `
                            <div class="flex justify-between items-center">
                                <h3 class="text-xl font-semibold text-blue-600">Feedback</h3>
                                <div class="text-gray-500">Rating: ${feedback.rating}</div>
                            </div>
                            <p class="text-gray-600">Course: ${courseName}</p>
                            <p class="text-gray-600">Student: ${userName}</p>
                            <p class="text-gray-600">Instructor: ${instructorName}</p>
                            <p class="text-gray-600">${feedback.comments}</p>
                            <div class="mt-4">
                                <h4 class="text-lg font-semibold text-blue-600">Admin Response</h4>
                                <p class="text-gray-600">${feedback.feedbackResponse ? feedback.feedbackResponse.responseText : 'No response yet.'}</p>
                            </div>
                        `;

                        feedbackList.appendChild(feedbackItem);

                    } catch (error) {
                        console.error('Error fetching details for feedback:', error);
                    }
                }

            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        }

        window.onload = fetchFeedbacks;