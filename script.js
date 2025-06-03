// Инициализация Firebase
const firebaseConfig = {
    databaseURL: "https://sitik-1fea0-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM элементы
const postsContainer = document.getElementById('postsContainer');
const newPostBtn = document.getElementById('newPostBtn');
const postModal = document.getElementById('postModal');
const closeBtn = document.querySelector('.close');
const postForm = document.getElementById('postForm');

// Открыть/закрыть модальное окно
newPostBtn.addEventListener('click', () => postModal.style.display = 'block');
closeBtn.addEventListener('click', () => postModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === postModal) postModal.style.display = 'none';
});

// Загрузка постов
function loadPosts() {
    database.ref('posts').on('value', (snapshot) => {
        const posts = snapshot.val() || {};
        postsContainer.innerHTML = '';
        
        Object.entries(posts).forEach(([id, post]) => {
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <h3 class="post-title">${post.title}</h3>
                ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image">` : ''}
                <p class="post-text">${post.text}</p>
                ${post.fileUrl ? `<a href="${post.fileUrl}" class="post-file" download><i class="fas fa-file-download"></i> Скачать файл</a>` : ''}
            `;
            postsContainer.appendChild(postElement);
        });
    });
}

// Публикация поста
postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const post = {
        title: document.getElementById('postTitle').value,
        text: document.getElementById('postText').value,
        imageUrl: document.getElementById('postImage').value,
        fileUrl: document.getElementById('postFile').value,
        createdAt: Date.now()
    };

    database.ref('posts').push(post);
    postModal.style.display = 'none';
    postForm.reset();
});

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', loadPosts);