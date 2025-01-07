document.addEventListener('DOMContentLoaded', function () {
    initializeNavbar();
    displayCourseFeedbacks();
});

function initializeNavbar() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    const profile = document.getElementById('profile');
    const profileCard = document.getElementById('profile-card');
    if (profile && profileCard) {
        profile.addEventListener('click', event => {
            event.preventDefault();
            profileCard.classList.toggle('hidden');
        });
    }

    const mobileProfile = document.getElementById('mobile-profile');
    const mobileProfileCard = document.getElementById('mobile-profile-card');
    if (mobileProfile && mobileProfileCard) {
        mobileProfile.addEventListener('click', event => {
            event.preventDefault();
            mobileProfileCard.classList.toggle('hidden');
        });
    }

    window.addEventListener('click', e => {
        if (profile && profileCard && !profile.contains(e.target) && !profileCard.contains(e.target)) {
            profileCard.classList.add('hidden');
        }
        if (mobileProfile && mobileProfileCard && !mobileProfile.contains(e.target) && !mobileProfileCard.contains(e.target)) {
            mobileProfileCard.classList.add('hidden');
        }
    });

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (user) {
        updateUserProfile(user);
    } else {
        displayLoginPrompt();
    }
}

  //loader
  function showLoader() {
    const loaderElement = document.getElementById("loader");
    if (loaderElement && loaderElement.classList.contains("hidden")) {
        console.log("Showing loader");
        loaderElement.classList.remove("hidden");
    } else {
        console.log("Loader is already visible");
    }
  }
  
  function hideLoader() {
    const loaderElement = document.getElementById("loader");
    if (loaderElement && !loaderElement.classList.contains("hidden")) {
        console.log("Hiding loader");
        loaderElement.classList.add("hidden");
    } else {
        console.log("Loader is already hidden");
      }
  }

function updateUserProfile(user) {
    document.getElementById('userFullName').textContent = user.username;
    document.getElementById('userPhone').textContent = user.phone;
    document.getElementById('userRole').textContent = `Role: ${user.role}`;
    document.getElementById('mobileUserFullName').textContent = user.username;
    document.getElementById('mobileUserPhone').textContent = user.phone;
    document.getElementById('mobileUserRole').textContent = `Role: ${user.role}`;
}

function displayLoginPrompt() {
    document.getElementById('userFullName').textContent = "Please, Login First!";
    document.getElementById('previous-feedback').textContent = 'SignIn';
    document.getElementById('logout-button').textContent = '';
    document.getElementById('mobileUserFullName').textContent = "Please, Login First!";
}

function displayCourseFeedbacks() {
    const courseId = sessionStorage.getItem('selectedCourseId');
    const courseName = sessionStorage.getItem('courseName');

    if (!courseId) {
        alert('Course ID not found. Please go back to the course page.');
        return;
    }

    if (courseName) {
        document.getElementById('courseName').textContent = `Course Name: ${courseName}`;
    }
    showLoader();
    fetch(`https://feedback-system-backend-p8f5.onrender.com/api/feedback/get/feedback/by/courseId?courseId=${courseId}`)
        .then(response => response.json())
        .then(data => populateFeedbackList(data))
        .catch(error => console.error('Error fetching feedbacks:', error))
        .finally(() => {
            hideLoader();
        });
}

function populateFeedbackList(feedbacks) {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';

    if (feedbacks && feedbacks.length > 0) {
        feedbacks.forEach(feedback => createFeedbackItem(feedback, feedbackList));
    } else {
        feedbackList.innerHTML = '<p class="text-gray-600">No feedbacks available for this course.</p>';
    }
}

async function createFeedbackItem(feedback, feedbackList) {
    const feedbackItem = document.createElement('div');
    feedbackItem.classList = 'bg-white p-6 rounded-lg shadow-md space-y-4';

    const username = await fetchUsername(feedback.userId);
    
    const hasResponded = await checkIfResponded(feedback.feedbackId);

    feedbackItem.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <h3 class="text-lg font-bold text-gray-700">${username}</h3>
                <p class="text-gray-600">${feedback.comments}</p>
            </div>
        </div>
        <div class="mt-4">
            <textarea id="response-${feedback.feedbackId}" class="w-full p-2 border border-gray-300 rounded" placeholder="Write your response here..." ${hasResponded ? 'disabled' : ''}></textarea>
            <button id="submit-response-btn-${feedback.feedbackId}" onclick="submitResponse('${feedback.feedbackId}', '${feedback.userId}')" 
                class="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600" ${hasResponded ? 'disabled' : ''}>
                ${hasResponded ? 'Responded' : 'Submit Response'}
                <div class="loader hidden h-10" id="loader"></div> 
            </button>
        </div>
    `;

    feedbackList.appendChild(feedbackItem);
}

async function fetchUsername(userId) {
    try {
        showLoader();
        const response = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/user/get/username/by/UserId?userId=${userId}`);
        const data = await response.json();
        return data.username || "Unknown User";
    } catch (error) {
        console.error('Error fetching username:', error);
        return "Unknown User";
    }finally{
        hideLoader();
    }
}

function submitResponse(feedbackId, adminId) {
    const responseText = document.getElementById(`response-${feedbackId}`).value.trim();

    if (!responseText) {
        alert("Please enter a response before submitting.");
        return;
    }
    showLoader();
    const url = 'https://feedback-system-backend-p8f5.onrender.com/api/feedback/respond/to/feedback';
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, feedbackId, responseText: responseText }),
    })

    .then(response => {
        if (response.ok) {
            console.log({
                adminId: adminId,
                feedbackId: feedbackId,
                responseText: responseText
            });
            alert('Response submitted successfully!');
            const responseButton = document.getElementById(`submit-response-btn-${feedbackId}`);
            
            if (responseButton) {
                responseButton.textContent = 'Responded';
                responseButton.disabled = true;
                responseButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                responseButton.classList.add('bg-gray-400');
            } else {
                console.error(`Button with ID submit-response-btn-${feedbackId} not found.`);
            }
        } else {
            alert('Failed to submit response.');
        }
    })
    .catch(error => {
        console.error('Error submitting response:', error);
        alert('An error occurred. Please try again.');
    })
    .finally(() => {
        hideLoader();
    });
}
async function checkIfResponded(feedbackId) {
    try {
        showLoader();
        const response = await fetch(`https://feedback-system-backend-p8f5.onrender.com/api/feedback/get/if/responded?feedbackId=${feedbackId}`);
        const data = await response.json();
        return data.responded; 
    } catch (error) {
        console.error('Error checking if responded:', error);
        return false;
    } finally{
        hideLoader();
    }
}



function logout() {
    sessionStorage.clear();
    window.location.href = '/Index.html';
}
