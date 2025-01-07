// DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', () => {
    setupMenuToggle();
    setupProfileToggle();
    loadUserProfile();
    fetchCourses();
});

// Menu Button Toggle for Mobile
function setupMenuToggle() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
}

// Profile Toggles
function setupProfileToggle() {
    const profile = document.getElementById('profile');
    const profileCard = document.getElementById('profile-card');
    const mobileProfile = document.getElementById('mobile-profile');
    const mobileProfileCard = document.getElementById('mobile-profile-card');

    if (profile && profileCard) {
        profile.addEventListener('click', (event) => {
            event.preventDefault();
            profileCard.classList.toggle('hidden');
        });
    }

    if (mobileProfile && mobileProfileCard) {
        mobileProfile.addEventListener('click', (event) => {
            event.preventDefault();
            mobileProfileCard.classList.toggle('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        if (profile && profileCard && !profile.contains(e.target) && !profileCard.contains(e.target)) {
            profileCard.classList.add('hidden');
        }
        if (mobileProfile && mobileProfileCard && !mobileProfile.contains(e.target) && !mobileProfileCard.contains(e.target)) {
            mobileProfileCard.classList.add('hidden');
        }
    });
}

// Load User Profile
function loadUserProfile() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        // Populate user details
        updateProfileUI(user, true);
    } else {
        // Show login message
        updateProfileUI(null, false);
    }
}

function updateProfileUI(user, isLoggedIn) {
    const defaultMessage = "Please, Login First!";
    if (isLoggedIn) {
        document.getElementById('userFullName').textContent = user.username;
        document.getElementById('userPhone').textContent = user.phone;
        document.getElementById('userRole').textContent = `Role: ${user.role}`;
        document.getElementById('mobileUserFullName').textContent = user.username;
        document.getElementById('mobileUserPhone').textContent = user.phone;
        document.getElementById('mobileUserRole').textContent = `Role: ${user.role}`;
    } else {
        document.getElementById('userFullName').textContent = defaultMessage;
        document.getElementById('userPhone').textContent = '';
        document.getElementById('userRole').textContent = '';
        document.getElementById('mobileUserFullName').textContent = defaultMessage;
        document.getElementById('mobileUserPhone').textContent = '';
        document.getElementById('mobileUserRole').textContent = '';
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/Index.html';
}

// Show and Hide Loader
function showLoader() {
    const loaderElement = document.getElementById('loader');
    if (loaderElement && loaderElement.classList.contains('hidden')) {
        loaderElement.classList.remove('hidden');
    }
}

function hideLoader() {
    const loaderElement = document.getElementById('loader');
    if (loaderElement && !loaderElement.classList.contains('hidden')) {
        loaderElement.classList.add('hidden');
    }
}

// Fetch Courses
async function fetchCourses() {
    try {
        showLoader();
        const response = await fetch('https://feedback-system-backend-p8f5.onrender.com/api/course/get/all/Course');
        if (!response.ok) throw new Error("Failed to fetch courses.");
        const courses = await response.json();
        populateCourseList(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
    } finally {
        hideLoader();
    }
}

function populateCourseList(courses) {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';

    courses.forEach(course => {
        const courseItem = document.createElement('li');
        courseItem.className = 'p-4 bg-white rounded-lg shadow-md cursor-pointer transform transition duration-300 hover:shadow-lg hover:scale-105 hover:bg-blue-50';
        courseItem.dataset.courseId = course.courseId;

        courseItem.innerHTML = `
            <h3 class="font-medium text-blue-800">${course.courseName}</h3>
            <p class="text-sm text-gray-500">Instructor: ${course.instructor}</p>
        `;

        courseItem.onclick = () => showCourseDetails(course.courseName, course.description, course.instructor, course.courseId);
        courseList.appendChild(courseItem);
    });
}

let selectedCourseId = null;

function showCourseDetails(courseName, description, instructor, courseId) {
    document.getElementById('courseName').textContent = courseName;
    document.getElementById('instructor').textContent = `Instructor: ${instructor}`;
    document.getElementById('courseDescription').textContent = description;
    document.getElementById('actionButtons').classList.remove('hidden');
    selectedCourseId = courseId;
    sessionStorage.setItem('selectedCourseId', courseId);
}

function openFeedbackPage() {
    if (selectedCourseId) {
        window.location.href = `/dist/html/Feedback.html?courseId=${selectedCourseId}`;
    } else {
        alert("Please select a course to give feedback.");
    }
}

// Add New Course
function openForm() {
    document.getElementById('courseForm').classList.remove('hidden');
}

function closeForm() {
    document.getElementById('courseForm').classList.add('hidden');
}

function addCourse(event) {
    event.preventDefault();

    const courseName = document.getElementById('newCourseName').value;
    const instructor = document.getElementById('newInstructor').value;
    const description = document.getElementById('newCourseDescription').value;
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
        alert("User not logged in!");
        return;
    }

    const courseRequest = {
        courseName,
        instructor,
        description,
        userId
    };

    showLoader();
    fetch("https://feedback-system-backend-p8f5.onrender.com/api/course/create/course", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(courseRequest)
    })
        .then(response => {
            if (response.ok) {
                alert("Course added successfully!");
                closeForm();
                fetchCourses();
            } else {
                return response.json().then(data => {
                    alert(data.message || "Course already Exists!");
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to add course.");
        })
        .finally(() => {
            hideLoader();
        });
}

function openFeedbackResponsePage() {
    if (selectedCourseId) {
        window.location.href = `/dist/html/AdminConsole/RespondFeedback.html?courseId=${selectedCourseId}`;
    } else {
        alert("Please select a course to respond to feedback.");
    }
}

function showFeedbacks() {
    window.location.href = '/dist/html/AdminConsole/FetchAllFeedbacks.html';
}
