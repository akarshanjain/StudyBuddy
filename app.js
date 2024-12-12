let user = null; // Stores the current user data
let users = JSON.parse(localStorage.getItem("users")) || []; // Mock users database
let tasks = []; // Sample tasks data
let flashcards = []; // Sample flashcards data
// Initialize notes for the current user
let notes = JSON.parse(localStorage.getItem("notes")) || {};
let googleCalendarEvents = [];

// Toggle between Login and Sign-Up pages
function toggleLoginSignUp() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("signup-page").style.display = "block";
}

function toggleSignUpLogin() {
    document.getElementById("signup-page").style.display = "none";
    document.getElementById("login-page").style.display = "block";
}

// Handle sign-up form submission
document.getElementById("signup-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    // Check if the email is already registered
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert("Email is already registered. Please log in.");
        toggleSignUpLogin(); // Redirect to login page
        return;
    }

    // Save the new user
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully! Please log in.");
    toggleSignUpLogin(); // Redirect to login page
});

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    loginUser(email, password);
});

// Simulate a login function
function loginUser(email, password) {
    const userData = users.find(user => user.email === email && user.password === password);
    if (userData) {
        user = userData;
        showDashboard();
    } else {
        alert("Invalid credentials");
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("signup-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "block";

    // Display user name
    document.getElementById("user-name").innerText = user.name;

    // Populate upcoming deadlines (mock data)
    const deadlinesList = document.getElementById("deadlines-list");
    deadlinesList.innerHTML = `
        <li>Math Assignment - Due: 2024-11-20</li>
        <li>Physics Exam - Due: 2024-11-25</li>
    `;

    // Populate tasks (mock data)
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = tasks.map(task => `<li>${task}</li>`).join("");

    // Populate flashcards (mock data)
    const flashcardsList = document.getElementById("flashcards-list");
    flashcardsList.innerHTML = flashcards
        .map(flashcard => `<li>${flashcard.question} - ${flashcard.answer}</li>`)
        .join("");
}

// Save today's study focus
function saveFocus() {
    const focusText = document.getElementById("study-focus-text").value;
    alert(`Focus saved: ${focusText}`);
}

// Add a task to the to-do list
function addTask() {
    const taskText = document.getElementById("new-task").value;
    if (taskText) {
        tasks.push(taskText);
        document.getElementById("new-task").value = ""; // Clear input
        showDashboard(); // Re-render dashboard to show updated tasks
    }
}

// Show flashcard form (basic version)
function showFlashcardForm() {
    const flashcardText = prompt("Enter flashcard question and answer, separated by a comma:");
    if (flashcardText) {
        const [question, answer] = flashcardText.split(",");
        flashcards.push({ question: question.trim(), answer: answer.trim() });
        alert("Flashcard saved!");
        showDashboard(); // Re-render dashboard to show updated flashcards
    }
}

// Update the rich text editor's font
document.getElementById("font-selector").addEventListener("change", function () {
    const font = this.value;
    document.getElementById("rich-editor").style.fontFamily = font;
});

// Update the rich text editor's font size
document.getElementById("font-size-selector").addEventListener("change", function () {
    const fontSize = this.value;
    document.getElementById("rich-editor").style.fontSize = fontSize;
});

// Toggle bold text
function toggleBold() {
    document.execCommand("bold");
}

// Toggle italic text
function toggleItalic() {
    document.execCommand("italic");
}

// Toggle bullets
function toggleBulletList() {
    document.execCommand("insertUnorderedList");
}

// Save the formatted note
function saveFormattedNote() {
    const editorContent = document.getElementById("rich-editor").innerHTML;
    if (!notes[user.email]) {
        notes[user.email] = [];
    }
    notes[user.email].push(editorContent); // Save the formatted note
    localStorage.setItem("notes", JSON.stringify(notes)); // Save to localStorage
    showNotesSection(); // Refresh notes list
    document.getElementById("rich-editor").innerHTML = ""; // Clear the editor
}

// Render the notes list
function showNotesSection() {
    const notesList = document.getElementById("notes-list");
    notesList.innerHTML = notes[user.email]
        ? notes[user.email]
              .map((note, index) => `
                <li>
                    <div>${note}</div>
                    <button onclick="deleteNote(${index})">Delete</button>
                </li>
              `)
              .join("")
        : "No notes yet.";
}

// Delete a note
function deleteNote(index) {
    notes[user.email].splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotesSection();
}

// Google Calendar API initialization
function initializeGoogleCalendar() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            clientId: "153359750619-bp3fg1877mjpg7rafo9dprmt66epehe0.apps.googleusercontent.com",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: "https://www.googleapis.com/auth/calendar.readonly"
        }).then(() => {
            // Check if the user is already signed in
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                fetchGoogleCalendarEvents();
            }
        });
    });
}

// Fetch Google Calendar events
function fetchGoogleCalendarEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then((response) => {
        googleCalendarEvents = response.result.items;
        displayCalendarEvents();
    });
}

// Display calendar events
function displayCalendarEvents() {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = googleCalendarEvents.map(event => `
        <div class="calendar-event">
            <strong>${event.summary}</strong>
            <p>Date: ${new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
        </div>
    `).join('') || 'No upcoming events';
}

// Add a login with Google button in login page
function handleGoogleSignIn() {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        fetchGoogleCalendarEvents();
    });
}