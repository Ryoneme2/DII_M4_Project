const searchBtn = document.querySelector("#search-button");
const nextPageSearch = document.querySelector("#nextPageSearch");
const prevPageSearch = document.querySelector("#prevPageSearch");
var searchPage = 1;
var maxPage;

var tempLink = "";

const menuNav = Array.from(document.querySelectorAll(".menu-nav")).map(
  (item) => {
    item.addEventListener("click", async (e) => {
      const title = item.innerHTML.trim().toLowerCase();
      tempLink = `https://api.jikan.moe/v4/${title}?sfw`;
      const data = await fetchData(tempLink);

      searchOnLoad(data);

      console.log(data);

      showBlockSection("search-section-main");
    });
  }
);

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
    console.log(item);
    const cardInfo = {
      id: item.mal_id,
      title: item.title,
      image: item.images.jpg.image_url,
      type: item.type,
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
  // console.log(card.type);
  const realType = validateType(card.type);
  const cardElem = document.createElement("div");
  cardElem.setAttribute(
    "ondblclick",
    `createModalContent(${card.id}, "${card.type}")`
  );
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
    "hover:cursor-pointer"
  );
  cardElem.setAttribute("style", `background-image: url(${card.image})`);
  const spanHeart = document.createElement("span");
  spanHeart.setAttribute("ondblclick", `addToFav(${card.id},"${realType}")`);
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
  // console.log(card);

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

  if(response.status === 404) {
    console.warn(`page not found`);
    return;
  }

  if(response.status !== 200) return

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

const fetchNewData = async () => {
  document.getElementsByTagName("body")[0].style.overflow = "auto";

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
      image: card.entry[randomNum0to1].images.webp.image_url,
      title: card.entry[randomNum0to1].title,
      type: "Movie",
    };
    createCardElement(cardInfo, "recommend-section");
  });
  dataPopular.slice(1, 16).forEach((card) => {
    const cardInfo = {
      id: card.mal_id,
      image: card.images.webp.image_url,
      title: card.title,
      type: "Movie",
    };
    createCardElement(cardInfo, "popular-section");
  });
  showBlockSection("recommend-section-main");
  showBlockSection("popular-section-main");
};

window.onload = async () => {
  await fetchNewData();
};

const closeModal = async () => {
  hideSection("modal-bg");
  hideSection("modal-detail");
  hideSection("modal-detailInner");
  hideSection("modal-close");

  await fetchNewData();
};

const validateType = (type) => {
  const enumAnimeType = ["TV", "OVA", "Movie", "Special", "ONA", "Music"];
  const enumMangaType = [
    "Manga",
    "Novel",
    "One-shot",
    "Doujinshi",
    "Manhua",
    "Manhwa",
    "OEL",
  ];

  let realType;

  if (enumAnimeType.some((_type) => _type === type)) {
    realType = "anime";
  } else if (enumMangaType.some((_type) => _type === type)) {
    realType = "manga";
  }

  return realType;
};

const createModalContent = async (id, type) => {
  showBlockSection("modal-bg");
  showBlockSection("modal-detail");
  showBlockSection("modal-detailInner");
  showBlockSection("modal-close");

  document.getElementsByTagName("body")[0].style.overflow = "hidden";

  const modalDetail = document.querySelector("#modal-detailInner");
  const modalDetailOuter = document.querySelector("#modal-detail");
  modalDetail.innerHTML = "";

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const realType = validateType(type);

  console.log({ realType, type });

  const dataFullDetail = await fetchData(
    `https://api.jikan.moe/v4/${realType}/${id}/full`
  );

  const dataDetail = {
    title: dataFullDetail.data.title,
    linkUrl: dataFullDetail.data.url,
    image: dataFullDetail.data.images.webp.large_image_url,
    score: dataFullDetail.data.score,
    synopsis: dataFullDetail.data.synopsis,
    genres: dataFullDetail.data.genres, // array
    relations: shuffle(
      dataFullDetail.data.relations.map((elem) => {
        return elem.entry.map((item) => {
          return item.mal_id;
        });
      })
    ), // array
  };
  console.log(dataDetail);

  const genreElement = dataDetail.genres.map((item) => {
    const elem = document.createElement("strong");
    elem.classList.add(
      "border",
      "border-yellow-500",
      "text-yellow-500",
      "bg-yellow-100",
      "uppercase",
      "px-5",
      "py-1.5",
      "rounded-full",
      "text-[10px]",
      "tracking-wide",
      "mr-2"
    );
    elem.innerHTML = item.name;

    console.log(elem);

    return elem;
  });

  console.log(genreElement[0].outerHTML);

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("container", "mx-auto");

  const infoContent = document.createElement("div");
  infoContent.classList.add(
    "flex",
    "flex-col",
    "lg:flex-row",
    "justify-center",
    "items-start"
  );
  infoContent.innerHTML = `
  <div class="w-[30rem]">
    <img
      class="w-auto h-[33rem]"
      src="${dataDetail.image}"
    />
  </div>
  <div>
  <h2 class="text-[3rem] w-[40rem] font-normal">${dataDetail.title}</h2>
  <strong
    class="border border-yellow-500 text-yellow-500 bg-yellow-100 uppercase px-5 py-1.5 rounded-full text-[10px] tracking-wide"
  >
    Anime
  </strong>
  <strong
    class="border border-yellow-500 text-yellow-500 bg-yellow-100 uppercase px-5 py-1.5 rounded-full text-[10px] tracking-wide mx-2"
  >
    ${dataDetail.score} / 10
  </strong>
  <h3 class="text-[1.5rem] font-normal mt-5">Genre</h3>
  <div class="mt-2">
    ${genreElement.map((item) => {
      return item.outerHTML;
    })}
  </div>
  <div class="mt-5">
    <button
      onclick="addToFav(${dataDetail.id}, '${realType}')"
      class="inline-block p-[2px] rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-orange-600 hover:text-white active:text-opacity-75 focus:outline-none focus:ring transition"
    >
      <span
        class="block px-8 py-3 text-sm font-medium bg-white rounded-full hover:bg-transparent"
      >
        Add to Favorite
      </span>
    </a>
  </div>
</div>`;

  const vidContent = document.createElement("div");

  if (realType === "anime") {
    console.log("do");
    const ytID = dataFullDetail.data.trailer.youtube_id;
    // const vidContent = document.createElement("div");
    vidContent.classList.add("flex", "justify-center", "items-start", "mt-10");
    vidContent.innerHTML = `
    <div>
    <div>
      <h3 class="my-4 text-2xl font-semibold">-- Trailer --</h3>
    </div>
    <div>
      <iframe
        class="aspect-video w-[45rem]"
        src="https://www.youtube.com/embed/${ytID}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    </div>
  `;
  }

  const synopsisContent = document.createElement("div");
  synopsisContent.classList.add("mt-10");
  synopsisContent.innerHTML = `
  <div>
    <h3 class="my-4 text-center text-2xl font-semibold">
      -- Synopsis --
    </h3>
  </div>
  <div>
    <p class="text-gray-700 indent-6">
      ${dataDetail.synopsis}
    </p>
  </div>
  `;

  const relateContent = document.createElement("div");
  relateContent.classList.add(
    "flex",
    "flex-col",
    "justify-around",
    "items-center",
    "mt-10"
  );
  const relateTitle = document.createElement("div");
  relateTitle.innerHTML = `
    <h3 class="my-4 text-center text-2xl font-semibold">
      -- Relations --
    </h3>
  `;
  relateContent.appendChild(relateTitle);
  const relateGrid = document.createElement("div");
  relateGrid.classList.add("grid", "grid-cols-1", "sm:grid-cols-3", "gap-6");
  await dataDetail.relations.forEach((item) => {
    setTimeout(async () => {
      // console.log({ item });
      const data = await fetchData(
        `https://api.jikan.moe/v4/anime/${item[0]}/full`
      );


      const validateData = {
        id: data.data.mal_id,
        title: data.data.title,
        image: data.data.images.jpg.image_url,
        type: data.data.type,
      };

      relateGrid.appendChild(cardElem(validateData));
    }, 1000);
  });

  relateContent.appendChild(relateGrid);
  modalContainer.appendChild(infoContent);
  realType === "anime" ? modalContainer.appendChild(vidContent) : null;
  modalContainer.appendChild(synopsisContent);
  modalContainer.appendChild(relateContent);
  modalDetail.appendChild(modalContainer);
  modalDetailOuter.appendChild(modalDetail);
};

const postFetchData = async (data) => {
  const response = await fetch(
    "https://se104-project-backend.du.r.appspot.com/movies",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }
  );

  return response;
};

const closeAlert = () => {
  hideSection("alert-done")
  hideSection("alert-error")
}

const closeAlertBtn = Array.from(document.querySelectorAll('.close-alert'))
closeAlertBtn.map(item => {
  item.addEventListener('click', closeAlert)
})

// ?@param data => { ok, error }
const showModal = (data) => {
  if (data.toLowerCase() === "ok"){
    showFlexSection("alert-done");
  } else if (data.toLowerCase() === "error"){
    showFlexSection("alert-error");
  } else{
    throw Error("param func showModal error");
  }
}

const addToFav = async (id, type) => {
  const conf = confirm("Add to favorite?");
  if (!conf) return;

  const stdId = "642110319";
  const movieData = await fetchData(
    `https://api.jikan.moe/v4/${type}/${id}/full`
  );
  const data = {
    id: stdId,
    movie: {
      url: movieData.data.url,
      image_url: movieData.data.images.webp.image_url,
      title: movieData.data.title,
      synopsis: movieData.data.synopsis,
      type: movieData.data.type,
      episodes: movieData.data.episodes,
      score: movieData.data.score,
      rated: movieData.data.rating,
    },
  };

  const res = await postFetchData(data);
  console.log(res);

  if(!res.ok) {
    showModal("error");
  }
  showModal("ok");

  await fetchNewData();

  // event.stopPropagation();
};
