import { nanoid } from './node_modules/nanoid/nanoid.js';

const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const addCommentBtn = document.getElementById("addCommentBtn");
const commentListUl = document.getElementById("commentListUl");

let commentsList = JSON.parse(localStorage.getItem('commentsList')) || [];

const today = new Date();

document.addEventListener('DOMContentLoaded', () => {
    commentsList.length !== 0 
    ? commentsList.forEach(comment => createComment(comment))
    : console.log('empty')
})

addCommentBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const nameValue = nameInput.value.trim();

    if (!nameInput) {
        return toastr.error('Please, fill name!');
    }

    if (!commentInput) {
        return toastr.error('Please, enter your comment!');
    }
    
    const newComment = {
        id: nanoid(),
        name: nameValue,
        comment: commentInput.value,
        date: new Date().toLocaleDateString('uk-UA'),
        time: new Date().toLocaleTimeString("uk-UA"),
        answers: []
    }

    createComment(newComment)
    
    commentsList.unshift(newComment)
    localStorage.setItem("commentsList", JSON.stringify(commentsList));
    toastr.success('New comment was added successfully!');
    nameInput.value = '';
    commentInput.value = '';
})

function createComment ({ id, name, comment, date, time, answers }) {
    const li = document.createElement("li");

    li.innerHTML = `
    <div class="new-comment" id=${id}>
        <div>
            <span class="comment-name">${name}</span>
            <span class="comment-date">${date}, ${time}</span>
        </div>
        <div class="comment-text"><span>${comment}</span></div>
        <button class="answer-btn">Answer</button>
        <button class="delete-btn" id=${id}>❌</button><br>
        <textarea class="answer-textarea" style="display: none" placeholder="Enter your answer"></textarea>
        ${answers.length !== 0 
            ? `<ul class="answer-list">${answers.map(answer => `<li><span class="answer-item">${answer}</span></li>`).join("") || []}</ul>` 
            : '<ul class="answer-list" style="display:none"></ul>'
        }
    </div>
    `;

    commentListUl.appendChild(li);

    li.querySelector(".answer-btn").addEventListener("click", () => {
        addAnswer(id);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        deleteComment(id);
    });
}

function deleteComment(commentItemId) {
    commentsList = commentsList.filter(comment => comment.id !== commentItemId);
    localStorage.setItem("commentsList", JSON.stringify(commentsList));
    toastr.success('Comment was deleted successfully!');
}

function addAnswer(commentId) {
    const answerTextarea = document.getElementById(`${commentId}`).querySelector(".answer-textarea");
    answerTextarea.style.display = 'block';

    answerTextarea.addEventListener('blur', () => {
        if (answerTextarea.value.trim()) {
            saveAnswer(commentId, answerTextarea.value);
        } else {
            answerTextarea.style.display = 'none';
        }
    })
    answerTextarea.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            if (answerTextarea.value.trim()) {
                saveAnswer(commentId, answerTextarea.value);
            } else {
                answerTextarea.style.display = 'none';
            }
        }
    })

    answerTextarea.value = ''
}

function saveAnswer(commentId, newAnswer) {
    const answerTextarea = document.getElementById(`${commentId}`).querySelector(".answer-textarea");
    answerTextarea.style.display = 'none';
    answerTextarea.value = ''

    const answersToComment = document.getElementById(`${commentId}`).querySelector('.answer-list');
    answersToComment.style.display = 'inline-block';

    let li = document.createElement("li");
    li.innerHTML = `<span class="answer-item">${newAnswer}</span>`
    answersToComment.appendChild(li)

    commentsList = commentsList.map(comment => 
        comment.id === commentId
        ? {...comment, answers: [...(comment.answers || []), newAnswer]}
        : comment
    )
    localStorage.setItem("commentsList", JSON.stringify(commentsList));
}
