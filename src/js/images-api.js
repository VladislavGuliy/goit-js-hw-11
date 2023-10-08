import axios from 'axios';
import Notiflix from 'notiflix';

const KEY = '39284886-c296049749e036fccaa02ea1d';
const parameters = {
  imagetype: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
};

axios.defaults.baseURL = 'https://pixabay.com/api/';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure(`${error.message}. Please try again later.`);
    return Promise.reject(error);
  }
);

export async function fetchImages(name, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${name}&image_type=${parameters.imagetype}
    &orientation=${parameters.orientation}&safesearch=${parameters.safesearch}&page=${page}&per_page=${perPage}`
  );
  return response.data;
}