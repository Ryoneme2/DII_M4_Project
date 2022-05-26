const createCardElement = (card, selector) => {
  const recommendSection = document.querySelector(`#${selector}`);

  const sectionCard = document.createElement("section");
  sectionCard.classList.add("flex-shrink-0", "rounded", "h-auto", "md:w-[15rem]" , "w-[10rem]");
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
  // const spanStar = document.createElement("span");
  // spanStar.classList.add(
  //   "absolute",
  //   "z-10",
  //   "inline-flex",
  //   "items-center",
  //   "px-3,",
  //   "py-1",
  //   "text-xs",
  //   "font-semibold",
  //   "text-white",
  //   "bg-black",
  //   "rounded-full",
  //   "left-4",
  //   "top-4"
  // );
  // spanStar.innerHTML = `
  // ${card.rating}
  // <svg xmlns="http://www.w3.org/2000/svg"
  //     class="h-4 w-4 ml-1.5 text-yellow-300"
  //     viewBox="0 0 20 20"
  //     fill="currentColor"
  //   >
  //     <path
  //       d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  //     />
  //   </svg>`;
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
    "bg-black",
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
    "text-orange-700",
    "white-gradient",
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
  sectionCard.appendChild(cardElem);
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
    const cardInfo = {
      image: card.entry[0].images.jpg.image_url,
      title : card.entry[0].title
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
