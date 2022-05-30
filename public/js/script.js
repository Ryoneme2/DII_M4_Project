const searchBtn = document.querySelector("#search-button");
const nextPageSearch = document.querySelector("#nextPageSearch");
const prevPageSearch = document.querySelector("#prevPageSearch");
var searchPage = 1;
var maxPage;

// const modalBG = document.querySelector("#modal-bg");
// const modalCloseBtn = document.querySelector("#modal-close");
// const modalDetail = document.querySelector("#modal-detail");


var tempLink = "";

const onClickNextPage = async () => {
  console.log({ searchPage });

  searchPage = parseInt(searchPage) + 1;
  console.log(searchPage);
  if (parseInt(searchPage) >= parseInt(maxPage)) {
    searchPage = maxPage;
  }
  console.log(`${tempLink}&page=${searchPage}`);
  const data = await fetchData(`${tempLink}&page=${searchPage}`);
  console.log(data);

  searchOnLoad(data);

  hideSection("loading");
};

const onClickPrevPage = async () => {
  searchPage = parseInt(searchPage) - 1;
  if (parseInt(searchPage) <= 1) {
    searchPage = 1;
  }
  const data = await fetchData(`${tempLink}&page=${searchPage}`);

  searchOnLoad(data);

  hideSection("loading");
};

const searchOnLoad = (data) => {
  const searchSection = document.querySelector(`#search-section`);
  const paginationElem = document.querySelector(`#pagination`);

  searchSection.innerHTML = "";

  paginationElem.innerHTML = `
  ${data.pagination.current_page}
  <span class="mx-0.25">/</span>
  ${data.pagination.last_visible_page}
  `;

  searchPage = data.pagination.current_page;
  maxPage = data.pagination.last_visible_page;

  if (!data.data) {
    throw new Error("No data found");
  }

  if (data.data.length === 0) {
    searchSection.innerHTML = "<b> No Data </b>";
    hideSection("pagination");
  }

  data.data.forEach((item) => {
    const cardInfo = {
      title: item.title,
      image: item.images.jpg.image_url,
    };

    searchSection.appendChild(cardElem(cardInfo));
  });
  showBlockSection("search-section-main");
};

nextPageSearch.addEventListener("click", async () => {
  await onClickNextPage();
});
prevPageSearch.addEventListener("click", async () => {
  await onClickPrevPage();
});

searchBtn.addEventListener("click", async (e) => {
  const searchInput = document.querySelector("#searchInput").value;
  const searchTitle = document.querySelector(`#SeachTitle`);

  tempLink = `https://api.jikan.moe/v4/anime?q=${searchInput}&sfw`;

  const data = await fetchData(
    `https://api.jikan.moe/v4/anime?q=${searchInput}&sfw`
  );

  searchOnLoad(data);

  console.log(data);

  showBlockSection("search-section-main");
  searchTitle.innerHTML = `<span class="font-semibold">Result for <span class="uppercase text-orange-500 text-[1.4rem]">"${searchInput}"</span></span>`;
});

const cardElem = (card) => {
  console.log(card);
  const cardElem = document.createElement("a");
  cardElem.href = "";
  cardElem.setAttribute("onclick", `createModalContent(${card.id})`)
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
    "md:w-[15rem]"
  );
  cardElem.setAttribute("style", `background-image: url(${card.image})`);
  const spanHeart = document.createElement("span");
  spanHeart.classList.add(
    "absolute",
    "z-10",
    "inline-flex",
    "w-10",
    "h-10",
    "items-center",
    "justify-center",
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
};

const createCardElement = (card, selector) => {
  const recommendSection = document.querySelector(`#${selector}`);

  const sectionCard = document.createElement("section");
  sectionCard.classList.add(
    "flex-shrink-0",
    "rounded",
    "h-auto",
    "md:w-[15rem]",
    "w-[10rem]"
  );

  sectionCard.appendChild(cardElem(card));

  recommendSection.appendChild(sectionCard);
};

const fetchData = async (link) => {
  hideSection("recommend-section-main");
  hideSection("popular-section-main");
  hideSection("search-section-main");
  showFlexSection("loading");

  const response = await fetch(link);
  const data = await response.json();

  hideSection("loading");
  return data;
};

const showFlexSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "flex";
};

const showBlockSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "block";
};

const hideSection = (selector) => {
  const recommendSection = document.querySelector(`#${selector}`);
  recommendSection.style.display = "none";
};

window.onload = async () => {
  const { data: dataRecommend } = await fetchData(
    `https://api.jikan.moe/v4/recommendations/anime`
  );
  const { data: dataPopular } = await fetchData(
    `https://api.jikan.moe/v4/top/anime`
  );
  dataRecommend.slice(1, 16).forEach((card) => {
    const randomNum0to1 = Math.floor(Math.random() * 2);
    const cardInfo = {
      id: card.entry[randomNum0to1].mal_id,
      image: card.entry[randomNum0to1].images.jpg.image_url,
      title: card.entry[randomNum0to1].title,
    };
    createCardElement(cardInfo, "recommend-section");
  });
  dataPopular.slice(1, 16).forEach((card) => {
    const cardInfo = {
      id: card.mal_id,
      image: card.images.jpg.image_url,
      title: card.title,
    };
    createCardElement(cardInfo, "popular-section");
  });
  showBlockSection("recommend-section-main");
  showBlockSection("popular-section-main");
};

const createModalContent = (id) => {

  showBlockSection("modal-bg");
  showBlockSection("modal-detail");
  showBlockSection("modal-close");
  showFlexSection("loading-modal")

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  const dataFullDetail = fetchData(`https://api.jikan.moe/v4/anime/${id}/full`);

  const dataDetail  = {
    title: dataFullDetail.data.title,
    linkUrl : dataFullDetail.data.url,
    image : dataFullDetail.data.images.jpg.large_image_url,
    trailerLink : dataFullDetail.data.trailer.url,
    trailerLinkEmbed : dataFullDetail.data.trailer.embed_url,
    score : dataFullDetail.data.score,
    synopsis : dataFullDetail.data.synopsis,
    genres : dataFullDetail.data.genres, // array
    relations : shuffle(
      dataFullDetail.data.relations.map((elem) => {
        return elem.entry.map((item) => {
          return item.mal_id
        })
      })
    ), // array
  }

  const infoContent = document.createElement("div");
  infoContent.classList.add("flex", "justify-center", "items-start");
  infoContent.innerHTML = `
  <div class="w-[30rem]">
    <img
      class="w-auto h-[33rem]"
      src="https://cdn.myanimelist.net/images/anime/4/19644l.jpg"
    />
  </div>
  <div>
    <!-- TODO : CONTENT Info -->
    <h2 class="text-[3rem] font-normal">Name</h2>
    <strong
      class="border border-yellow-500 text-yellow-500 bg-yellow-100 uppercase px-5 py-1.5 rounded-full text-[10px] tracking-wide"
    >
      Anime
    </strong>
  </div>`;
};
