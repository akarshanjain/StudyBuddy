<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study Buddy Digital Assistant</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <script src="https://apis.google.com/js/platform.js" async defer></script>
    <script src="https://apis.google.com/js/api.js"></script>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light" id="main-navbar" style="display: none;">
        <a class="navbar-brand" href="javascript:void(0)" onclick="showDashboard()">Study Buddy</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item"><a class="nav-link" href="javascript:void(0)" onclick="showPage('dashboard-page')">Dashboard</a></li>
                <li class="nav-item"><a class="nav-link" href="javascript:void(0)" onclick="showPage('calendar-page')">Calendar</a></li>
                <li class="nav-item"><a class="nav-link" href="javascript:void(0)" onclick="showPage('todo-list-page')">To-Do List</a></li>
                <li class="nav-item"><a class="nav-link" href="javascript:void(0)" onclick="showPage('notes-page')">Notes</a></li>
                <li class="nav-item"><a class="nav-link" href="javascript:void(0)" onclick="showPage('flashcards-page')">Flashcards</a></li>
                <!-- Profile Dropdown -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Profile</a>
                    <div class="dropdown-menu" aria-labelledby="profileDropdown">
                        <a class="dropdown-item" href="javascript:void(0)" onclick="showEditProfile()">Edit Profile</a>
                        <a class="dropdown-item" href="javascript:void(0)" onclick="logoutUser()">Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Page Title -->
    <div id="page-title-container" class="text-center my-3" style="display: none;">
        <h2 id="page-title"></h2>
    </div>

    <!-- Login Page -->
    <div id="login-page" class="loginpage">
        <h1>Welcome to Study Buddy</h1>
        <form id="login-form">
            <input type="email" id="email" placeholder="Email" required class="form-control mb-2"><br>
            <input type="password" id="password" placeholder="Password" required class="form-control mb-2"><br>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <p>Don't have an account? <a href="javascript:void(0)" onclick="toggleLoginSignUp()">Sign Up</a></p>
    </div>

    <!-- Sign-Up Page -->
    <div id="signup-page" class="loginpage" style="display: none;">
        <h1>Create a New Account</h1>
        <form id="signup-form">
            <input type="text" id="signup-name" placeholder="Full Name" required class="form-control mb-2"><br>
            <input type="email" id="signup-email" placeholder="Email" required class="form-control mb-2"><br>
            <input type="password" id="signup-password" placeholder="Password" required class="form-control mb-2"><br>
            <button type="submit" class="btn btn-primary">Sign Up</button>
        </form>
        <p>Already have an account? <a href="javascript:void(0)" onclick="toggleSignUpLogin()">Login</a></p>
    </div>

    <!-- Edit Profile Page -->
    <div id="edit-profile-page" class="page" style="display: none;">
        <form id="edit-profile-form">
            <label for="edit-name" class="form-label">Edit Username</label>
            <input type="text" id="edit-name" placeholder="Full Name" required class="form-control mb-2"><br>
            <label for="edit-email" class="form-label">Edit Email</label>
            <input type="email" id="edit-email" placeholder="Email" required class="form-control mb-2"><br>
            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    </div>

    <!-- Main Dashboard Page -->
    <div id="dashboard-page" class="page" style="display: none;">
        <div class="container-fluid">
            <div class="row">
                <!-- Upcoming Deadlines -->
                <div class="col-md-3">
                    <div class="card p-3 shadow h-100">
                        <h4>Upcoming Deadlines</h4>
                        <ul id="upcoming-deadlines" class="list-group">
                            <li class="list-group-item">No upcoming deadlines</li>
                        </ul>
                    </div>
                </div>

                <!-- Calendar Integration -->
                <div class="col-md-6">
                    <div class="card p-3 shadow h-100">
                        <h4>Calendar</h4>
                        <div id="dashboard-calendar" class="calendar">
                            <p>Google Calendar events will appear here.</p>
                        </div>
                    </div>
                </div>

                <!-- To-Do List -->
                <div class="col-md-3">
                    <div class="card p-3 shadow h-100">
                        <h4>To-Do List</h4>
                        <ul id="todo-list" class="list-group">
                            <li class="list-group-item">No to-do items</li>
                        </ul>
                        <button class="btn btn-primary mt-2 w-100" id="add-todo-btn">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Other Pages -->
    <div id="calendar-page" class="page" style="display: none;">Calendar Page</div>
    <div id="todo-list-page" class="page" style="display: none;">To-Do List Page</div>
    <div id="notes-page" class="page" style="display: none;">Notes Page</div>
    <div id="flashcards-page" class="page" style="display: none;">Flashcards Page</div>

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script src="app.js"></script>
</body>
</html>
