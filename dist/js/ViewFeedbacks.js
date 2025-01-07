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
        document.getElementById('previous-feedback').textContent = 'SignIn';
        document.getElementById('logout-button').textContent = '';

        document.getElementById('mobileUserFullName').textContent = "Please, Login First!";
        document.getElementById('mobileUserPhone').textContent = '';
        document.getElementById('mobileUserRole').textContent = '';
        document.getElementById('mobile-previous-feedback').textContent = '';
        document.getElementById('mobile-logout-button').textContent = '';
    }
});

// Logout function
function logout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/dist/html/Index.html';
}

async function getFeedback() {
    try {
        const userId = sessionStorage.getItem('userId');  
        if (!userId) {
            console.error('User ID not found in session storage');
            return;
        }

        const response = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/feedback/get/feedback/by/student/id?userId=${userId}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data.length > 0) {
            const feedbackList = document.getElementById('feedback-list');
            feedbackList.innerHTML = ''; // Clear existing feedbacks

            // Instead of Promise.all, we loop through the data using a normal for loop
            for (let i = 0; i < data.length; i++) {
                const feedback = data[i];
                const courseName = await getCourseName(feedback.courseId);  // Wait for course name
                const feedbackItem = createFeedbackItem(feedback, courseName);
                feedbackList.appendChild(feedbackItem);
            }
        } else {
            const feedbackList = document.getElementById('feedback-list');
            feedbackList.innerHTML = '<p class="text-center text-lg text-gray-600">No feedback found for this user.</p>';
        }
    } catch (error) {
        console.error('Error fetching feedback:', error);
    }
}

async function getCourseName(courseId) {
    try {
        const response = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/course/course/by/id?id=${courseId}`);
        const courseData = await response.json();
        return courseData.courseName || "Course Name Not Available";
    } catch (error) {
        console.error('Error fetching course:', error);
        return "Course Name Not Available";
    }
}

function createFeedbackItem(feedback, courseName) {
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('bg-white', 'shadow-lg', 'rounded-xl', 'overflow-hidden', 'border', 'border-gray-300', 'hover:shadow-2xl', 'transition-shadow', 'duration-300', 'ease-in-out');
    
    const instructorName = feedback.instructor || "Instructor Name";
    const rating = feedback.rating || 0;
    const comments = feedback.comments || "No comments provided.";
    const adminResponse = feedback.feedbackResponse ? feedback.feedbackResponse.responseText : "No response from admin yet.";
    
    let ratingColorClass = "text-yellow-500";
    if (rating >= 4) ratingColorClass = "text-green-500";
    if (rating <= 2) ratingColorClass = "text-red-500";

    feedbackContainer.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800">Feedback for ${instructorName}</h2>
                    <p class="text-lg text-gray-600">Course: ${courseName}</p>
                </div>
                <div class="text-sm ${ratingColorClass}">
                    Rating: ${'⭐'.repeat(rating)}
                </div>
            </div>

            <p class="text-gray-700 mb-4">${comments}</p>

            <!-- Admin Response Section -->
            <div class="border-t border-gray-200 pt-6 mt-6">
                <div class="flex items-center space-x-2">
                    <h3 class="text-lg font-semibold text-gray-800">Admin Response</h3>
                </div>
                <p class="text-gray-700 mt-2">${adminResponse}</p>
            </div>
        </div>
    `;

    return feedbackContainer;
}

getFeedback();
