
/* DASHBOARD NAVIGATION */

const dashboardToggle = document.getElementById("dashboardToggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

const navigationButtons = document.querySelectorAll(".nav-button");
const pageSections = document.querySelectorAll(".page-section");

dashboardToggle.addEventListener("click", function() {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
});

overlay.addEventListener("click", closeDashboard);

function closeDashboard() {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

navigationButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const selectedPage = button.getAttribute("data-page");

        pageSections.forEach(function(section) {
            section.classList.remove("active");
        });

        navigationButtons.forEach(function(navButton) {
            navButton.classList.remove("active");
        });

        document.getElementById(selectedPage).classList.add("active");
        button.classList.add("active");

        closeDashboard();
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (selectedPage === "progress") {
            updateProgress();
        }
    });
});


/* TIMETABLE */

let timetable = JSON.parse(localStorage.getItem("studyTimetable")) || {};

const studyDate = document.getElementById("studyDate");
const sessionInput = document.getElementById("sessionInput");
const sessionList = document.getElementById("sessionList");

studyDate.value = new Date().toISOString().split("T")[0];

function saveTimetable() {
    localStorage.setItem("studyTimetable", JSON.stringify(timetable));
}

function displaySessions() {
    sessionList.innerHTML = "";

    const date = studyDate.value;
    const sessions = timetable[date] || [];

    sessions.forEach(function(session, index) {
        const li = document.createElement("li");
        li.className = "session-item";

        const span = document.createElement("span");
        span.textContent = session;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "small-button";
        deleteButton.onclick = function() {
            timetable[date].splice(index, 1);
            saveTimetable();
            displaySessions();
        };

        li.appendChild(span);
        li.appendChild(deleteButton);
        sessionList.appendChild(li);
    });
}

function addSession() {
    const session = sessionInput.value.trim();
    const date = studyDate.value;

    if (session === "" || date === "") {
        alert("Please enter a session and choose a date.");
        return;
    }

    if (!timetable[date]) {
        timetable[date] = [];
    }

    timetable[date].push(session);
    saveTimetable();

    sessionInput.value = "";
    displaySessions();
}

studyDate.addEventListener("change", displaySessions);
displaySessions();


/* TASK MANAGER */

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        const li = document.createElement("li");
        li.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.style.width = "auto";
        checkbox.style.margin = "0";

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        checkbox.addEventListener("change", function() {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
            updateProgress();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "small-button";

        deleteButton.onclick = function() {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
            updateProgress();
        };

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });

    updateProgress();
}

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    taskInput.value = "";
    displayTasks();
}

displayTasks();


/* PROGRESS TRACKER */

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("remainingTasks").textContent = remaining;
    document.getElementById("progressText").textContent = percentage + "% Completed";
    document.getElementById("progressBar").style.width = percentage + "%";
}


/* STUDY TIPS */

const studyTips = [
    "Study in short sessions and take small breaks.",
    "Keep your phone away while studying.",
    "Revise what you learned before starting a new topic.",
    "Practise questions instead of only reading.",
    "Set one small and clear study goal.",
    "Try explaining a topic in your own words.",
    "Get enough sleep to support learning."
];

function showTip() {
    const randomIndex = Math.floor(Math.random() * studyTips.length);
    document.getElementById("tipText").textContent = studyTips[randomIndex];
}


/* NOTES MAKER */

let savedNotes = JSON.parse(localStorage.getItem("studyNotes")) || [];

const notesInput = document.getElementById("notesInput");
const summaryOutput = document.getElementById("summaryOutput");
const importantPoints = document.getElementById("importantPoints");

function makeSummary() {
    const text = notesInput.value.trim();

    if (text === "") {
        alert("Please write some notes first.");
        return;
    }

    const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
    const cleanSentences = sentences.map(function(sentence) {
        return sentence.trim();
    }).filter(function(sentence) {
        return sentence.length > 0;
    });

    const summary = cleanSentences.slice(0, 3).join(" ");
    summaryOutput.textContent = summary;

    importantPoints.innerHTML = "";

    cleanSentences.slice(0, 5).forEach(function(sentence) {
        const li = document.createElement("li");
        li.textContent = sentence;
        importantPoints.appendChild(li);
    });
}

function saveNote() {
    const text = notesInput.value.trim();

    if (text === "") {
        alert("Please write something before saving.");
        return;
    }

    savedNotes.push(text);
    localStorage.setItem("studyNotes", JSON.stringify(savedNotes));

    displaySavedNotes();
    alert("Notes saved successfully!");
}

function displaySavedNotes() {
    const savedNotesContainer = document.getElementById("savedNotes");
    savedNotesContainer.innerHTML = "";

    savedNotes.forEach(function(note, index) {
        const noteBox = document.createElement("div");
        noteBox.className = "saved-note";

        const noteText = document.createElement("p");
        noteText.textContent = note;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            savedNotes.splice(index, 1);
            localStorage.setItem("studyNotes", JSON.stringify(savedNotes));
            displaySavedNotes();
        };

        noteBox.appendChild(noteText);
        noteBox.appendChild(deleteButton);
        savedNotesContainer.appendChild(noteBox);
    });
}

function speakNotes() {
    const text = notesInput.value.trim();

    if (text === "") {
        alert("Please write some notes first.");
        return;
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    } else {
        alert("Text-to-speech is not supported in this browser.");
    }
}

displaySavedNotes();


/* QUIZ TAKER */

let quizQuestions = JSON.parse(localStorage.getItem("studyQuiz")) || [];
let currentQuizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;

function saveQuestions() {
    localStorage.setItem("studyQuiz", JSON.stringify(quizQuestions));
}

function displayQuestions() {
    const questionList = document.getElementById("questionList");
    questionList.innerHTML = "";

    quizQuestions.forEach(function(item, index) {
        const li = document.createElement("li");
        li.textContent = item.question;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "small-button";

        deleteButton.onclick = function() {
            quizQuestions.splice(index, 1);
            saveQuestions();
            displayQuestions();
        };

        li.appendChild(deleteButton);
        questionList.appendChild(li);
    });
}

function addQuestion() {
    const question = document.getElementById("quizQuestion").value.trim();
    const answer = document.getElementById("quizAnswer").value.trim();

    if (question === "" || answer === "") {
        alert("Please enter both question and answer.");
        return;
    }

    quizQuestions.push({
        question: question,
        answer: answer
    });

    saveQuestions();
    displayQuestions();

    document.getElementById("quizQuestion").value = "";
    document.getElementById("quizAnswer").value = "";
}

function startQuiz() {
    if (quizQuestions.length === 0) {
        alert("Please add at least one question first.");
        return;
    }

    currentQuizIndex = 0;
    quizCorrect = 0;

    document.getElementById("quizArea").style.display = "block";
    document.getElementById("quizScore").textContent = "";
    showQuizQuestion();
}

function showQuizQuestion() {
    quizAnswered = false;

    document.getElementById("currentQuestion").textContent =
        quizQuestions[currentQuizIndex].question;

    document.getElementById("userAnswer").value = "";
    document.getElementById("quizFeedback").textContent = "";

    document.getElementById("nextQuestion").style.display = "none";
    document.getElementById("userAnswer").disabled = false;
}

function checkAnswer() {
    if (quizAnswered) {
        return;
    }

    const userAnswer = document.getElementById("userAnswer").value.trim();
    const correctAnswer = quizQuestions[currentQuizIndex].answer;

    if (userAnswer === "") {
        alert("Please enter your answer.");
        return;
    }

    quizAnswered = true;

    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        quizCorrect++;
        document.getElementById("quizFeedback").textContent = "Correct answer!";
    } else {
        document.getElementById("quizFeedback").textContent =
            "Incorrect. Correct answer: " + correctAnswer;
    }

    document.getElementById("userAnswer").disabled = true;
    document.getElementById("quizScore").textContent =
        "Score: " + quizCorrect + " / " + (currentQuizIndex + 1);

    document.getElementById("nextQuestion").style.display = "inline-block";
}

function nextQuizQuestion() {
    currentQuizIndex++;

    if (currentQuizIndex < quizQuestions.length) {
        showQuizQuestion();
    } else {
        document.getElementById("currentQuestion").textContent = "Quiz Completed!";
        document.getElementById("quizFeedback").textContent =
            "You got " + quizCorrect + " out of " + quizQuestions.length + " correct.";

        document.getElementById("quizScore").textContent = "Well done!";
        document.getElementById("nextQuestion").style.display = "none";
        document.getElementById("userAnswer").style.display = "none";
    }
}

displayQuestions();


/* FLASHCARDS */

let flashcards = JSON.parse(localStorage.getItem("studyFlashcards")) || [];
let currentCardIndex = 0;
let showingFront = true;

function saveFlashcards() {
    localStorage.setItem("studyFlashcards", JSON.stringify(flashcards));
}

function addFlashcard() {
    const front = document.getElementById("cardFront").value.trim();
    const back = document.getElementById("cardBack").value.trim();

    if (front === "" || back === "") {
        alert("Please enter both sides of the flashcard.");
        return;
    }

    flashcards.push({
        front: front,
        back: back
    });

    saveFlashcards();

    document.getElementById("cardFront").value = "";
    document.getElementById("cardBack").value = "";

    currentCardIndex = flashcards.length - 1;
    showingFront = true;
    displayFlashcard();
}

function displayFlashcard() {
    const flashcardText = document.getElementById("flashcardText");
    const counter = document.getElementById("cardCounter");

    if (flashcards.length === 0) {
        flashcardText.textContent = "Your flashcards will appear here.";
        counter.textContent = "0 / 0";
        return;
    }

    const card = flashcards[currentCardIndex];

    flashcardText.textContent = showingFront ? card.front : card.back;
    counter.textContent = (currentCardIndex + 1) + " / " + flashcards.length;
}

function flipFlashcard() {
    if (flashcards.length === 0) {
        return;
    }

    showingFront = !showingFront;
    displayFlashcard();
}

function nextFlashcard() {
    if (flashcards.length === 0) {
        return;
    }

    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    showingFront = true;
    displayFlashcard();
}

function previousFlashcard() {
    if (flashcards.length === 0) {
        return;
    }

    currentCardIndex =
        (currentCardIndex - 1 + flashcards.length) % flashcards.length;

    showingFront = true;
    displayFlashcard();
}

function deleteFlashcard() {
    if (flashcards.length === 0) {
        return;
    }

    flashcards.splice(currentCardIndex, 1);

    if (currentCardIndex >= flashcards.length) {
        currentCardIndex = Math.max(0, flashcards.length - 1);
    }

    showingFront = true;
    saveFlashcards();
    displayFlashcard();
}

displayFlashcard();
