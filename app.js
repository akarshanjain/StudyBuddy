let user = null; // Stores the current user data
let tasks = []; // Sample tasks data
let flashcards = []; // Sample flashcards data

// Simulate a login function
function loginUser(email, password) {
    // For now, we mock the login by setting a user
    if (email === "test@uci.edu" && password === "password123") {
        user = { name: "John Doe", email: "test@uci.edu" };
        showDashboard();
    } else {
        alert("Invalid credentials");
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById("login-page").style.display = "none";
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
}

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    loginUser(email, password);
});

// Toggle between login and sign-up (for now, just hides/shows the login form)
function toggleLoginSignUp() {
    alert("Sign Up functionality not implemented yet.");
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
