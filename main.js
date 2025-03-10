const API_KEY = "ea9e3222412340b794c8f0e70e1677e0";
let articles = [];
let page = 1;
let totalPage = 1;
const PAGE_SIZE = 10;
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
);
let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    console.log("Rrr", url);
    let response = await fetch(url);
    let data = await response.json();
    if (response.status == 200) {
      console.log("result", data);
      if (data.totalResults == 0) {
        page = 0;
        totalPage = 0;
        renderPagination();
        throw new Error("검색어와 일치하는 결과가 없습니다");
      }

      articles = data.articles;
      totalPage = Math.ceil(data.totalResults / PAGE_SIZE);
      render();
      renderPagination();
    } else {
      page = 0;
      totalPage = 0;
      renderPagination();
      throw new Error(data.message);
    }
  } catch (e) {
    errorRender(e.message);
    page = 0;
    totalPage = 0;
    renderPagination();
  }
};

const getLatestNews = async() => {
  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`
  );
  await getNews();
};

const getNewsByTopic = (event) => {
  const topic = event.target.textContent.toLowerCase();

  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&&pageSize=${PAGE_SIZE}&category=${topic}&apiKey=${API_KEY}`
  );
  getNews();
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

let inputTxt = document.getElementById("search-input");

const getNewsByKeyword = async() => {
  const keyword = inputTxt.value;

  page = 1;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&&pageSize=${PAGE_SIZE}&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
  inputTxt.value =""
};

document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getNewsByKeyword();
  }
});

const render = () => {
  let resultHTML = articles
    .map((news) => {
      return `<div class="news row">
        <div class="col-lg-4">
            <img class="news-img"
                src="${news.urlToImage}" 
                onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'; this.onerror=null;" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${news.title}</a>
            <p>${news.description == null || news.description == "" ? "내용없음" : news.description.length > 200 ? news.description.substring(0, 200) + "..." : news.description}</p>
            <div>${news.source.name || "no source"}  ${moment(news.publishedAt).fromNow()}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = resultHTML;
};

const renderPagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;
  if (first >= 6) {
    paginationHTML = `<li class="page-item" onclick="pageClick(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="pageClick(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="pageClick(${i})" >${i}</a>
                       </li>`;
  }

  if (last < totalPage) {
    paginationHTML += `<li class="page-item" onclick="pageClick(${page + 1})">
                        <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="pageClick(${totalPage})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const pageClick = (pageNum) => {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
};

const errorRender = (message) => {
  document.getElementById(
    "news-board"
  ).innerHTML = `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

getLatestNews();