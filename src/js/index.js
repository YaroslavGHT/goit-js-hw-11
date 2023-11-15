import { searchAPI } from './api.js';
import Notiflix from 'notiflix';

const search = new searchAPI();

const mainDiv = document.querySelector('.gallery');
const form = document.querySelector(".search-form");
const inputSearch = document.getElementsByName("searchQuery")[0];
const btnNext = document.querySelector('.load-more');
btnNext.style.visibility = "hidden";
let page = 1;


form.addEventListener("submit", searchFirstPage);


async function searchFirstPage(e) {
  e.preventDefault();
  page = 1;
  mainDiv.innerHTML = '';
  let searchValue = inputSearch.value;

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
      if (newItems.totalHits > 20) {
        btnNext.style.visibility = "visible";
      } else if (newItems.totalHits <= 20) {
        btnNext.style.visibility = "hidden";
      };
      
      btnNext.addEventListener('click', ( ) => onNextPage(searchValue, (page + 1)));
    } else {
      Notiflix.Notify.info("Sorry, No images found for your request")
    }
  } catch (error) {
    // btnNext.style.visibility = "hidden";
    console.error("Sorry, there are no images matching your search query. Please try again.", error);
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
    const maxPage = Math.ceil(newItems.totalHits / 20);
    console.log(`max${ maxPage}`);
    console.log(`cur${currentPage}`);

    if (maxPage > currentPage) {
      btnNext.style.visibility = "visible";
    } else if (currentPage >= maxPage) {
      btnNext.style.visibility = "hidden";
      Notiflix.Notify.info("Sorry, No images found for your request")
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}




// function searchFirstPage(e) {
//   e.preventDefault();
//   page = 1;
//   mainDiv.innerHTML = '';
//   let searcVal = inputSearch.value;
//   console.log(searcVal);
//   search.getSearch(searcVal, page)
//   .then(newItems => {
//     if (newItems && newItems.hits && newItems.hits.length > 0) {
//       console.log(newItems);
//       Notiflix.Notify.info(`We found ${newItems.totalHits} images`)
//       newItems.hits.forEach(item => {
//         const markup = creatGallary(item);
//         mainDiv.insertAdjacentHTML("beforeend", markup);
//       });
//       btnNext.style.visibility = "visible";
//       btnNext.addEventListener('click', ( ) => onNextPage(searcVal, (page + 1)));
//     } else {
//       Notiflix.Notify.info("Sorry, No images found for your request")
//     }
//   })
//   .catch(error => {
//     console.error("Sorry, there are no images matching your search query. Please try again.", error);
//   });
// }

// function onNextPage(searcVal, currentPage) {
 
//   search.getSearch(searcVal, currentPage)
//     .then(newItems => {

//       newItems.hits.forEach(item => {
//         const markup = creatGallary(item);
//         mainDiv.insertAdjacentHTML("beforeend", markup);
//       });
//       page = currentPage;
//       const maxPage = Math.ceil(newItems.totalHits / 3);
//       console.log(newItems.totalHits);
//       console.log(maxPage);
//       console.log(currentPage);
//       console.log(maxPage > currentPage);
//       if (maxPage > currentPage) {
//         btnNext.style.visibility = "visible";
//       } else if (currentPage >= maxPage) {
//         btnNext.style.visibility = "hidden";
//         Notiflix.Notify.info("Sorry, No images found for your request")
//       }
        
//     })
//     .catch(error => {
//       console.error('Error fetching data:', error);
//     });
// }


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


