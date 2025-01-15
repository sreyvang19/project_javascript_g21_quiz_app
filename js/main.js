document.addEventListener('DOMContentLoaded', function () {
    const startButtons = document.querySelectorAll('.btn-primary');
    const button = document.getElementById('button');

    startButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            redirectToCategoryPage(category);
        });
    });

    if (button) {
        button.addEventListener('click', () => {
            window.location.href = 'pages/category.html';
        });
    }
});

function redirectToCategoryPage(category) {
    const categoryUrls = {
        general: 'general.html',
        animals: 'animals.html',
        country: 'country.html',
        food: 'food.html',
        history: 'history.html',
        music: 'music.html',
        sport: 'sport.html',
        books: 'books.html'
    };

    if (categoryUrls[category]) {
        window.location.href = categoryUrls[category];
        return; // Stop further execution
    } else {
        console.error(`Category ${category} is not supported`);
    }
}
