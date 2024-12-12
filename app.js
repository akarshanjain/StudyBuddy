let user = null; // Stores the current user data
let users = JSON.parse(localStorage.getItem("users")) || []; // Mock users database
let googleCalendarEvents = [];
let todoList = JSON.parse(localStorage.getItem("todoList")) || []; // To-Do list items
let notes = [];
const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
const allNotes = JSON.parse(localStorage.getItem("notes")) || {};

if (loggedInUser && allNotes[loggedInUser.email]) {
    notes = allNotes[loggedInUser.email];
}
let currentNote = { title: "", content: "", styles: { font: "Arial", size: "16px" } };

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
        sessionStorage.setItem("loggedInUser", JSON.stringify(user)); // Save session
        document.getElementById("login-page").style.display = "none";
        document.getElementById("signup-page").style.display = "none";
        showDashboard();
    } else {
        alert("Invalid credentials");
    }
}


// Show Dashboard
function showDashboard() {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("signup-page").style.display = "none";
    document.getElementById("main-navbar").style.display = "flex"; // Show navbar
    document.getElementById("page-title-container").style.display = "flex"; // Show page title
    showPage('dashboard-page'); // Show default page after login
    renderDashboard();
    updatePageTitle("Dashboard");
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
    localStorage.setItem("currentPage", pageId); // Save the current page to localStorage
    updatePageTitle(pageId.replace('-page', '').replace(/-/g, ' '));
}


function updatePageTitle(title) {
    const pageTitle = document.getElementById("page-title");
    pageTitle.innerText = title.charAt(0).toUpperCase() + title.slice(1);
}

// Render Dashboard
function renderDashboard() {
    renderDeadlines();
    renderCalendar();
    renderTodoList();
}

// Render Upcoming Deadlines
function renderDeadlines() {
    const upcomingDeadlines = googleCalendarEvents.slice(0, 5);
    const deadlinesList = document.getElementById("upcoming-deadlines");
    deadlinesList.innerHTML = upcomingDeadlines.map(event => `
        <li class="list-group-item">
            <strong>${event.summary}</strong><br>
            ${new Date(event.start.dateTime || event.start.date).toLocaleString()}
        </li>
    `).join('') || '<li class="list-group-item">No upcoming deadlines</li>';
}

// Render Calendar
function renderCalendar() {
    const calendarDiv = document.getElementById("dashboard-calendar");
    calendarDiv.innerHTML = "<p>Google Calendar events will appear here.</p>";
}

// Render To-Do List
function renderTodoList() {
    const todoListElement = document.getElementById("todo-list");
    todoListElement.innerHTML = todoList.map((todo, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${todo.text}
            <button class="btn btn-danger btn-sm" onclick="removeTodoItem(${index})">&times;</button>
        </li>
    `).join('') || '<li class="list-group-item">No to-do items</li>';
}

// Add To-Do Item
function addTodoItem() {
    const newItemText = prompt("Enter a new to-do item:");
    if (newItemText) {
        todoList.push({ text: newItemText });
        localStorage.setItem("todoList", JSON.stringify(todoList));
        renderTodoList();
    }
}

document.getElementById("add-todo-btn").addEventListener("click", addTodoItem);

// Remove To-Do Item
function removeTodoItem(index) {
    todoList.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList();
}

// Logout User
function logoutUser() {
    sessionStorage.removeItem("loggedInUser"); // Clear sessionStorage
    localStorage.removeItem("currentPage"); // Clear the saved page
    user = null;
    document.getElementById("main-navbar").style.display = "none"; // Hide navbar
    document.getElementById("page-title-container").style.display = "none"; // Hide title
    showPage("login-page"); // Redirect to login page
}


// Show Edit Profile Page
function showEditProfile() {
    document.getElementById("dashboard-page").style.display = "none";
    document.getElementById("edit-profile-page").style.display = "block";
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedUser) {
        const nameField = document.getElementById("edit-name");
        const emailField = document.getElementById("edit-email");

        nameField.value = savedUser.name || "";
        emailField.value = savedUser.email || "";

        // Add the 'prefilled' class if fields are not empty
        nameField.classList.toggle("prefilled", !!savedUser.name);
        emailField.classList.toggle("prefilled", !!savedUser.email);
    }
    updatePageTitle("Edit Profile");
}


// Handle Profile Update
document.getElementById("edit-profile-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const newName = document.getElementById("edit-name").value;
    const newEmail = document.getElementById("edit-email").value;

    if (user) {
        // Update user data
        user.name = newName;
        user.email = newEmail;

        // Update users array
        const userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = { ...user, name: newName, email: newEmail };
        }
        localStorage.setItem("users", JSON.stringify(users)); // Save updated users
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Save logged-in user
        alert("Profile updated successfully!");
        showDashboard();
    }
});

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
        renderDeadlines();
    });
}

// Check for logged-in user on page load
document.addEventListener("DOMContentLoaded", () => {
    renderNotesList();
    const savedUser = sessionStorage.getItem("loggedInUser"); // Check sessionStorage for user
    const savedPage = localStorage.getItem("currentPage") || "dashboard-page"; // Default to dashboard-page

    if (savedUser) {
        // If a user session exists
        user = JSON.parse(savedUser); // Retrieve and assign the logged-in user
        document.getElementById("main-navbar").style.display = "flex"; // Show navbar
        document.getElementById("page-title-container").style.display = "flex"; // Show title
        showPage(savedPage); // Redirect to the last visited page
        document.getElementById("login-page").style.display = "none";
        document.getElementById("signup-page").style.display = "none";
    } else {
        // No logged-in user; redirect to login page
        document.getElementById("main-navbar").style.display = "none"; // Hide navbar
        document.getElementById("page-title-container").style.display = "none"; // Hide title
        showPage("login-page"); // Show login page
    }
});




document.getElementById("edit-name").addEventListener("input", function () {
    this.classList.remove("prefilled");
});

document.getElementById("edit-email").addEventListener("input", function () {
    this.classList.remove("prefilled");
});


function createNewNote() {
    currentNote = { title: "", content: "", styles: { font: "Arial", size: "16px" } };
    document.getElementById("notes-text").value = "";
    document.getElementById("font-select").value = "Arial";
    document.getElementById("font-size-select").value = "16px";
    document.getElementById("notes-text").style.fontFamily = "Arial";
    document.getElementById("notes-text").style.fontSize = "16px";
}

function saveNote() {
    const noteContent = document.getElementById("notes-text").value;
    if (!noteContent.trim()) {
        alert("Cannot save an empty note.");
        return;
    }
    const noteTitle = prompt("Enter a title for your note:");
    if (!noteTitle) {
        alert("Title is required to save the note.");
        return;
    }

    // Save the note with title, content, and styles
    currentNote.title = noteTitle;
    currentNote.content = noteContent;
    currentNote.styles.font = document.getElementById("font-select").value;
    currentNote.styles.size = document.getElementById("font-size-select").value;

    // Add the note to the notes array
    notes.push({ ...currentNote });

    // Update localStorage for the current user
    const allNotes = JSON.parse(localStorage.getItem("notes")) || {};
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        allNotes[loggedInUser.email] = notes;
        localStorage.setItem("notes", JSON.stringify(allNotes));
    }

    // Re-render the notes list
    renderNotesList();

    alert("Note saved successfully!");
}


function renderNotesList() {
    const notesList = document.getElementById("notes-list");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        notesList.innerHTML = '<li>No saved notes</li>';
        return;
    }

    if (notes.length === 0) {
        notesList.innerHTML = '<li>No saved notes</li>';
        return;
    }

    // Dynamically generate the list of saved notes with a delete button
    notesList.innerHTML = notes.map((note, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span onclick="loadNote(${index})" style="cursor: pointer;">${note.title}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">&times;</button>
        </li>
    `).join('');
}



function loadNote(index) {
    const note = notes[index];
    document.getElementById("notes-text").value = note.content;
    document.getElementById("font-select").value = note.styles.font;
    document.getElementById("font-size-select").value = note.styles.size;
    document.getElementById("notes-text").style.fontFamily = note.styles.font;
    document.getElementById("notes-text").style.fontSize = note.styles.size;
    currentNote = { ...note };
}

function deleteNote(index) {
    // Confirm deletion
    if (!confirm("Are you sure you want to delete this note?")) {
        return;
    }

    // Remove the note from the notes array
    notes.splice(index, 1);

    // Update localStorage for the current user
    const allNotes = JSON.parse(localStorage.getItem("notes")) || {};
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser) {
        allNotes[loggedInUser.email] = notes;
        localStorage.setItem("notes", JSON.stringify(allNotes));
    }

    // Re-render the notes list
    renderNotesList();

    alert("Note deleted successfully!");
}


function toggleBold() {
    const textBox = document.getElementById("notes-text");
    textBox.style.fontWeight = textBox.style.fontWeight === "bold" ? "normal" : "bold";
}

function toggleItalic() {
    const textBox = document.getElementById("notes-text");
    textBox.style.fontStyle = textBox.style.fontStyle === "italic" ? "normal" : "italic";
}

function toggleBulletPoints() {
    const textBox = document.getElementById("notes-text");
    const lines = textBox.value.split("\n");
    textBox.value = lines.map(line => line.startsWith("• ") ? line.slice(2) : `• ${line}`).join("\n");
}

// Apply font changes dynamically
document.getElementById("font-select").addEventListener("change", function () {
    document.getElementById("notes-text").style.fontFamily = this.value;
});

document.getElementById("font-size-select").addEventListener("change", function () {
    document.getElementById("notes-text").style.fontSize = this.value;
});
