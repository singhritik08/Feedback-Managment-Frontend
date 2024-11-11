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
    console.log(user);

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
    window.location.href = '/dist/html/Index.html';
}

fetchCourses();
// Fetch courses when the page loads
async function fetchCourses() {
    try {
        const response = await fetch('https://feedback-system-backend-8kgm.onrender.com/api/course/get/all/Course');
        const courses = await response.json();
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
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

let selectedCourseId = null;

function showCourseDetails(courseName, description, instructor, courseId) {
    document.getElementById('courseName').textContent = courseName;
    document.getElementById('instructor').textContent = `Instructor: ${instructor}`;
    document.getElementById('courseDescription').textContent = description;
    document.getElementById('actionButtons').classList.remove('hidden');
    selectedCourseId = courseId;
    sessionStorage.setItem('selectedCourseId', courseId);
    sessionStorage.setItem('courseName',courseName);
}

function openFeedbackPage() {
    if (selectedCourseId) {
        window.location.href = `/dist/html/Feedback.html?courseId=${selectedCourseId}`;
    } else {
        alert("Please select a course to give feedback.");
    }
}


function openForm() {
    document.getElementById("courseForm").classList.remove("hidden");
}

function closeForm() {
    document.getElementById("courseForm").classList.add("hidden");
}


function addCourse(event) {
event.preventDefault();

// Get the values from the form fields
const courseName = document.getElementById("newCourseName").value;
const instructor = document.getElementById("newInstructor").value;
const description = document.getElementById("newCourseDescription").value;

// Retrieve userId from sessionStorage
const userId = sessionStorage.getItem('userId');

if (!userId) {
    alert("User not logged in!");
    return;
}




// For Admin Page to add Course
const courseRequest = {
    courseName: courseName,
    instructor: instructor,
    description: description,
    userId: userId
};

fetch("https://feedback-system-backend-8kgm.onrender.com/api/course/create/course", {
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
            alert(data.message || "An error occurred.");
        });
    }
})
.catch(error => {
    console.error("Error:", error);
    alert("Failed to add course.");
});
}
function openFeedbackResponsePage() {
    if (selectedCourseId) {
        sessionStorage.setItem('selectedCourseId',selectedCourseId);
        window.location.href = `/dist/html/AdminConsole/RespondFeedback.html?courseId=${selectedCourseId}`;
    } else {
        alert("Please select a course to give feedback.");
    }
}

function showFeedbacks() {``
    window.location.href = '/dist/html/AdminConsole/FetchAllFeedbacks.html';
}
