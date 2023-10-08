import { fetchImages } from './images-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  searchQuery: document.querySelector('.search-query'),
  loadMoreButton: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a', {});

let perPage = 40;
let page;
let name = refs.searchQuery.value;

refs.loadMoreButton.classList.add('visually-hidden');

function eventVerification(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';
  refs.loadMoreButton.classList.add('visually-hidden');
  page = 1;
  name = refs.searchQuery.value;

  fetchImages(name, page, perPage)
    .then(name => {
      let totalPages = Math.ceil(name.totalHits / perPage);

      if (name.hits.length > 0) {
        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        galleryСreation(name);
        lightbox.refresh();

        if (page < totalPages) {
          refs.loadMoreButton.classList.remove('visually-hidden');
        } else {
          refs.loadMoreButton.classList.add('visually-hidden');
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.gallery.innerHTML = '';
        refs.searchForm.reset();
      }
    })
    .catch(error => console.log(error));
}

refs.searchForm.addEventListener('submit', eventVerification);

function galleryСreation(name) {
  const markup = name.hits
    .map(hit => {
      return `<div class="photo-card">
        <a class="gallery__item" href="${hit.largeImageURL}">
        <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${hit.downloads}
          </p>
        </div>
      </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

refs.loadMoreButton.addEventListener('click', showLoadMoreImages, true);

function showLoadMoreImages() {
  name = refs.searchQuery.value;
  page += 1;

  fetchImages(name, page, perPage).then(name => {
    let totalPages = Math.ceil(name.totalHits / perPage);
    galleryСreation(name);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    lightbox.refresh();

    if (page >= totalPages) {
      refs.loadMoreButton.classList.add('visually-hidden');

      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
