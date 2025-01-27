// Arrays to store questions
let allQuestions = [];
let userQuestions = [];
let currentQuestionId = null; // To keep track of the question being answered

// Toggle sections based on selected question type
document.getElementById('questionType').addEventListener('change', function () {
    const typeSection = document.getElementById('typeQuestionSection');
    const uploadSection = document.getElementById('uploadQuestionSection');

    if (this.value === 'type') {
        typeSection.classList.remove('d-none');
        uploadSection.classList.add('d-none');
    } else if (this.value === 'upload') {
        typeSection.classList.add('d-none');
        uploadSection.classList.remove('d-none');
    } else {
        typeSection.classList.add('d-none');
        uploadSection.classList.add('d-none');
    }
});

// Handle form submission
document.getElementById('askQuestionForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const questionType = document.getElementById('questionType').value;
    let questionText = '';

    if (questionType === 'type') {
        questionText = document.getElementById('typedQuestion').value;
    } else if (questionType === 'upload') {
        questionText = 'Document uploaded'; // Placeholder text for uploaded document
    }

    const newQuestion = {
        id: Date.now(), // Unique identifier for each question
        text: questionText,
        type: questionType,
        answered: false,
        answer: ''
    };

    // Add to both allQuestions and userQuestions arrays
    allQuestions.push(newQuestion);
    userQuestions.push(newQuestion);

    // Clear the form
    document.getElementById('askQuestionForm').reset();
    document.getElementById('typeQuestionSection').classList.add('d-none');
    document.getElementById('uploadQuestionSection').classList.add('d-none');

    // Update user questions display
    displayUserQuestions();
});

// Display user's questions
function displayUserQuestions() {
    const container = document.getElementById('userQuestionsContainer');
    container.innerHTML = ''; // Clear existing content

    userQuestions.forEach(question => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <p>${question.text}</p>
            <span class="${question.answered ? 'answered' : 'not-answered'}">
                ${question.answered ? 'Answered' : 'Not Answered'}
            </span>
        `;
        container.appendChild(questionItem);
    });
}

// Toggle display of all questions
document.getElementById('displayAllBtn').addEventListener('click', function () {
    const section = document.getElementById('allQuestionsSection');
    if (section.classList.contains('d-none')) {
        section.classList.remove('d-none');
        displayAllQuestions();
    } else {
        section.classList.add('d-none');
    }
});

// Display all questions
function displayAllQuestions() {
    const container = document.getElementById('allQuestionsContainer');
    container.innerHTML = ''; // Clear existing content

    allQuestions.forEach(question => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.innerHTML = `
            <p>${question.text}</p>
            <span class="${question.answered ? 'answered' : 'not-answered'}">
                ${question.answered ? 'Answered' : 'Not Answered'}
            </span>
            ${!question.answered ? '<button class="btn btn-answer" data-id="' + question.id + '">Answer</button>' : ''}
        `;
        container.appendChild(questionItem);
    });

    // Add event listeners to all answer buttons
    const answerButtons = document.querySelectorAll('.btn-answer');
    answerButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentQuestionId = parseInt(this.getAttribute('data-id'), 10);
            const modal = new bootstrap.Modal(document.getElementById('answerModal'));
            modal.show();
        });
    });
}

// Handle answer submission in the modal
document.getElementById('submitAnswerBtn').addEventListener('click', function () {
    const answerType = document.getElementById('answerType').value;
    let answerText = '';

    if (answerType === 'type') {
        answerText = document.getElementById('typedAnswer').value;
    } else if (answerType === 'upload') {
        answerText = 'Document uploaded'; // Placeholder text for uploaded document
    }

    if (currentQuestionId !== null) {
        const questionIndex = allQuestions.findIndex(q => q.id === currentQuestionId);
        if (questionIndex !== -1) {
            allQuestions[questionIndex].answered = true;
            allQuestions[questionIndex].answer = answerText;

            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('answerModal'));
            modal.hide();

            // Clear modal fields
            document.getElementById('answerType').value = '';
            document.getElementById('typeAnswerSection').classList.add('d-none');
            document.getElementById('uploadAnswerSection').classList.add('d-none');

            // Refresh display of all questions
            displayAllQuestions();
        }
    }
});

// Toggle answer sections in the modal
document.getElementById('answerType').addEventListener('change', function () {
    const typeSection = document.getElementById('typeAnswerSection');
    const uploadSection = document.getElementById('uploadAnswerSection');

    if (this.value === 'type') {
        typeSection.classList.remove('d-none');
        uploadSection.classList.add('d-none');
    } else if (this.value === 'upload') {
        typeSection.classList.add('d-none');
        uploadSection.classList.remove('d-none');
    } else {
        typeSection.classList.add('d-none');
        uploadSection.classList.add('d-none');
    }
});
