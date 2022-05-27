const searchBtn = document.querySelector('#search-button')
var searchPage = 1;

searchBtn.addEventListener('click', async (e) => {
  const searchInput = document.querySelector('#searchInput').value;
  const searchSection = document.querySelector(`#search-section`);

  searchSection.innerHTML = '';

  hideSection('recommend-section-main');
  hideSection('popular-section-main');
  showFlexSection('loading')

  const { data, pagination } = await fetchData(`https://api.jikan.moe/v4/anime?q=${searchInput}&sfw`)
  console.log(data);

  if(!data) {
    throw new Error('No data found')
  }

  if(data.length === 0) {
    throw new Error('No data found (data len = 0)')
  }

  data.forEach((item) => {
    const cardInfo = {
      title: item.title,
      image: item.images.jpg.image_url,
    }

    searchSection.appendChild(cardElem(cardInfo));
  })

  hideSection('loading');

})

const cardElem = (card) => {
  const cardElem = document.createElement("a");
  cardElem.href = ''
  cardElem.classList.add(
    "relative",
    "block",
    "overflow-hidden",
    "bg-center",
    "bg-no-repeat",
    "bg-cover",
    "rounded-xl",
    "h-[12rem]",
    "w-[9rem]",
    "md:h-[20rem]",
    "md:w-[15rem]",
  );
  cardElem.setAttribute(
    "style",
    `background-image: url(${card.image})`
  );
  const spanHeart = document.createElement("span");
  spanHeart.classList.add(
    "absolute",
    "z-10",
    "inline-flex",
    "w-10",
    "h-10",
    "items-center",
    'justify-center',
    "px-3,",
    "py-1",
    "text-xs",
    "font-semibold",
    "text-white",
    "bg-gray-100",
    "rounded-full",
    "right-4",
    "top-4"
  );
  spanHeart.innerHTML = `<img class="w-6 h-6" src="./public/image/icons8-heart-60.png" alt="">`;
  const cardDetail = document.createElement("div");
  cardDetail.classList.add(
    "relative",
    "p-3",
    "md:p-6",
    "pt-40",
    "text-orange-600",
    "white-gradient",
    "transition",
    "hover:opacity-60",
    "h-[12rem]",
    "md:h-[20rem]",
    "w-full",
    "bg-opacity-40"
  );
  const cardBg = document.createElement("div");
  cardBg.classList.add("absolute", "bottom-4");
  cardBg.innerHTML = `<h5 class="text-sm md:text-lg lg:text-xl xl:text-2xl font-bold">${card.title}</h5>`;

  cardDetail.appendChild(cardBg);

  // cardElem.appendChild(spanStar);
  cardElem.appendChild(spanHeart);
  cardElem.appendChild(cardDetail);
  return cardElem;
}

const createCardElement = (card, selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  
  const sectionCard = document.createElement("section");
  sectionCard.classList.add("flex-shrink-0", "rounded", "h-auto", "md:w-[15rem]" , "w-[10rem]");
  
  sectionCard.appendChild(cardElem(card));
  
  recommendSection.appendChild(sectionCard);
};

const fetchData = async (link) => {
  const response = await fetch(link);
  const data = await response.json();
  return data;
};

const showFlexSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "flex";
}

const showBlockSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "block";
}

const hideSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "none";
}


window.onload = async () => {
  hideSection('recommend-section-main');
  hideSection('popular-section-main');
  showFlexSection('loading');
  const { data : dataRecommend } = await fetchData(
    `https://api.jikan.moe/v4/recommendations/anime`
  );
  const { data : dataPopular } = await fetchData(
    `https://api.jikan.moe/v4/top/anime`
  );
  dataRecommend.slice(1, 16).forEach((card) => {
    const randomNum0to1 = Math.floor(Math.random()*2);
    const cardInfo = {
      image: card.entry[randomNum0to1].images.jpg.image_url,
      title : card.entry[randomNum0to1].title
    }
    createCardElement(cardInfo, 'recommend-section');
  });
  dataPopular.slice(1, 16).forEach((card) => {
    const cardInfo = {
      image: card.images.jpg.image_url,
      title : card.title
    }
    createCardElement(cardInfo , 'popular-section');
  });
  hideSection('loading');
  showBlockSection('recommend-section-main');
  showBlockSection('popular-section-main');

};
