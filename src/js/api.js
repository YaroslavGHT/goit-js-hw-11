import axios from 'axios';

const axiosPix = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
        key: '40634472-56a7999d13afd9c7f5d079b0e',
        q: 'cat',
        image_type: 'photo',
        per_page: '40',
        orientation: 'horizontal',
        safesearch: 'true',
        page: '1',
    },
});

export class searchAPI {
  async getSearch(query, page) {
    try {
      const res = await axiosPix.get('', { params: { q: query, page: page } });
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}


// export class searchAPI {
//     static async getSearch(query, page) {
//       const res = axiosPix.get('', { params: { q: query, page: page } })
//       return res.data;
//   }
// }




// export class searchAPI {
//       getSearch(query, page) {
//         return axiosPix.get('', { params: { q: query, page: page } })
//       .then(res => res.data);
//   }
// }


// const options = {
//   root: null,
//   rootMargin: '200px',
//   threshold: 1.0,
// };

// const callback = function () {
//   Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
// };

// const observer = new IntersectionObserver(callback, options);


  // observer.observe(btnNext);