const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.getElementById('load-more-btn');

const apiKey = 'YOUR_PIXABAY_API_KEY'; // Вставте ваш ключ API
let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    currentQuery = form.querySelector('input[name="query"]').value.trim();
    if (!currentQuery) return;

    gallery.innerHTML = ''; // Очищаємо галерею перед новим пошуком
    currentPage = 1; // Скидаємо номер сторінки
    await fetchImages(currentQuery, currentPage);
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await fetchImages(currentQuery, currentPage);
});

async function fetchImages(query, page) {
    try {
        const response = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${apiKey}`);
        if (!response.ok) throw new Error('Помилка при отриманні даних');

        const data = await response.json();
        if (data.hits.length === 0) {
            alert('Нічого не знайдено');
            return;
        }

        renderImages(data.hits);
        scrollToNewImages();
    } catch (error) {
        console.error('Помилка:', error);
    }
}

function renderImages(images) {
    images.forEach(image => {
        const photoCard = document.createElement('li');
        photoCard.classList.add('photo-card');
        photoCard.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" />
      <div class="stats">
        <p class="stats-item"><i class="material-icons">thumb_up</i>${image.likes}</p>
        <p class="stats-item"><i class="material-icons">visibility</i>${image.views}</p>
        <p class="stats-item"><i class="material-icons">comment</i>${image.comments}</p>
        <p class="stats-item"><i class="material-icons">cloud_download</i>${image.downloads}</p>
      </div>
    `;
        gallery.appendChild(photoCard);
    });
}

function scrollToNewImages() {
    const lastImage = gallery.lastElementChild;
    if (lastImage) {
        lastImage.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    }
}
