import { searchAPI } from './api.js';
import Notiflix from 'notiflix';

const search = new searchAPI();

const mainDiv = document.querySelector('.gallery');
const form = document.querySelector(".search-form");
const inputSearch = document.getElementsByName("searchQuery")[0];
const btnNext = document.querySelector('.load-more');
btnNext.style.visibility = "hidden";
let page = 1;

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

const callback = function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target === btnNext) {
        if (btnNext.style.visibility === "hidden") {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        observer.unobserve(btnNext);
      }
    }
  });
};



const observer = new IntersectionObserver(callback, options);

form.addEventListener("submit", searchFirstPage);


async function searchFirstPage(e) {
  e.preventDefault();
  page = 1;
  mainDiv.innerHTML = '';
  let searchValue = inputSearch.value;
  console.log(searchValue);

  try {
    const newItems = await search.getSearch(searchValue, page);
    console.log(newItems);

    if (newItems && newItems.hits && newItems.hits.length > 0) {
      console.log(newItems);
      Notiflix.Notify.info(`We found ${newItems.totalHits} images`)
      newItems.hits.forEach(item => {
        const markup = creatGallary(item);
        mainDiv.insertAdjacentHTML("beforeend", markup);
      });
      console.log(newItems.totalHits);
      
      if (newItems.totalHits > 40) {
        btnNext.style.visibility = "visible";
      } else if (newItems.totalHits <= 40) {

        observer.observe(btnNext);
        btnNext.style.visibility = "hidden";
      };
    
      btnNext.addEventListener('click', ( ) => onNextPage(searchValue, (page + 1)));
    } else {
      Notiflix.Notify.info("Sorry, No images found for your request")
    }
  } catch (error) {
    btnNext.style.visibility = "hidden";
    Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
    
  }
}

async function onNextPage(searchValue, currentPage) {
  try {
    const newItems = await search.getSearch(searchValue, currentPage);

    newItems.hits.forEach(item => {
      const markup = creatGallary(item);
      mainDiv.insertAdjacentHTML("beforeend", markup);
    });

    page = currentPage;
    const maxPage = Math.ceil(newItems.totalHits / 40);
    console.log(`max${ maxPage}`);
    console.log(`cur${currentPage}`);

    if (maxPage > currentPage) {
      btnNext.style.visibility = "visible";
    } else if (currentPage >= maxPage) {
      btnNext.style.visibility = "hidden";
      observer.observe(btnNext);
    }
  } catch (error) {
    Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
    console.error('Error fetching data:', error);
  }
}




function creatGallary(item) {
  const {webformatURL, largeImageURL, tags, likes, views, comments, downloads} = item;
  return `<div class="photo-card">
           <img class="images" srcset="${webformatURL}, ${largeImageURL}" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes: ${likes}</b>
              </p>
              <p class="info-item">
                <b>Views: ${views}</b>
              </p>
              <p class="info-item">
                <b>Comments: ${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads: ${downloads}</b>
              </p>
            </div>
          </div>`
          
}


