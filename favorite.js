const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const people = JSON.parse(localStorage.getItem('favoriteFriends'))
const dataPanel = document.querySelector('#data-panel')
const friendsPAGE = 24
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const titleFriends = document.querySelector('#title-Friends')
const genderNavbar = document.querySelector('#navbar-gender')
let filteredFriends = []
let males = []
let females = []

function renderPeopleList (data) {
  let rawHTML = ''
  data.forEach((item) => {
    if (item.gender === 'male') {
      rawHTML += `<div class="col-sm-2 my-2 px-4 ">
      <div class="card friends-bk friends-border">
      <img src="${item.avatar}" class="card-img-top pic-border" >
      <a href="#" ><i class="fas fa-heart" data-id="${item.id}"></i></a >
      <button class="btn" data-toggle="modal" data-target="#user-modal">
        </button>
        <div class="container card-body text-center ">
          <i class="fas fa-mars "></i>
         <a href="#" ><h5 class="card-title fonts "data-target="#people-modal" id="user-image" data-toggle="modal" data-id="${item.id}" id="user-image"  alt="people-picture" >${item.name}  ${item.surname}</h5></a >
        </div>
      </div>
  </div>`
    } else if (item.gender === 'female') {
      rawHTML += `<div class="col-sm-2 my-2 px-4 ">
      <div class="card friends-bk friends-border">
      <img src="${item.avatar}" class="card-img-top pic-border">
      <a href="#" ><i class="fas fa-heart" data-id="${item.id}"></i></a >
      <button class="btn" data-toggle="modal" data-target="#user-modal">
        </button>
        <div class="container card-body text-center ">
          <i class="fas fa-venus"></i>
          <a href="#" ><h5 class="card-title fonts "data-target="#people-modal" id="user-image" data-toggle="modal" data-id="${item.id} "  alt="people-picture" >${item.name}  ${item.surname}</h5></a >
        </div>
      </div>
  </div>`
    }
  })
  dataPanel.innerHTML = rawHTML
}

function showPeopleModal (id) {
  const modalTitle = document.querySelector('#people-modal-title')
  const modalBody = document.querySelector('#people-modal-body')
  const modalImg = document.querySelector('#people-modal-img')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = data.name + ' ' + data.surname
    modalBody.innerHTML = `<p class="text-center fonts" > Gmail : ${data.email} <br> 
                          Gender : ${data.gender} <br>
                          Age : ${data.age} <br>
                          Region : ${data.region} <br>
                          Birthday : ${data.birthday} <br></p>`
    modalImg.innerHTML = `<img src="${data.avatar}" " class="img-fluid rounded mx-auto d-block" width="200">`
  })
}

dataPanel.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('#user-image')) {
    showPeopleModal(event.target.dataset.id)
  } else if (event.target.matches('.fa-heart')) {
    event.preventDefault()
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

titleFriends.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('#title-Friends')) {
    // 重新整理頁面
    location.reload()
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted (event) {
  // 取消預設事件
  event.preventDefault()
  // 取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  // 錯誤處理：輸入無效字串
  // 條件篩選
  filteredFriends = people.filter((friend) =>
    friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword)
  )
  if (filteredFriends.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`)
  }
  // 預設顯示第 1 頁的搜尋結果
  renderPeopleList(getFriendsByPage(1)) // 修改這裡
})

function getFriendsByPage (page) {
  // 新增這裡
  const data = filteredFriends.length ? filteredFriends : people
  const startIndex = (page - 1) * friendsPAGE
  // 修改這裡
  return data.slice(startIndex, startIndex + friendsPAGE)
}

function getMalesByPage (page) {
  // 新增這裡
  const data = males.length ? males : people
  const startIndex = (page - 1) * friendsPAGE
  // 修改這裡
  return data.slice(startIndex, startIndex + friendsPAGE)
}

function getFemalesByPage (page) {
  // 新增這裡
  const data = females.length ? females : people
  const startIndex = (page - 1) * friendsPAGE
  // 修改這裡
  return data.slice(startIndex, startIndex + friendsPAGE)
}

function renderPaginator (amount) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amount / friendsPAGE)
  // 製作 template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link font-weight-bold" href="#" data-page="${page}">${page}</a></li>`
  }
  // 放回 HTML
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked (event) {
  // 如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  event.preventDefault()
  // 透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  // 更新畫面
  if (males.length > 0) {
    renderPeopleList(getMalesByPage(page))
  } else if (females.length > 0) {
    renderPeopleList(getFemalesByPage(page))
  } else {
    renderPeopleList(getFriendsByPage(page))
  }
})

genderNavbar.addEventListener('click', (event) => {
  event.preventDefault()
  if (event.target.matches('#male')) {
    males = people.filter((people) => people.gender === 'male')
    renderPeopleList(getMalesByPage(1))
    if (!males.length) {
      renderNothing()
    }
    females = 0
    document.getElementById('gender-click').click()
  } else if (event.target.matches('#female')) {
    females = people.filter((people) => people.gender === 'female')
    renderPeopleList(getFemalesByPage(1))
    if (!females.length) {
      renderNothing()
    }
    males = 0
    document.getElementById('gender-click').click()
  } else if (event.target.matches('#all')) {
    renderPaginator(people.length)
    renderPeopleList(getFriendsByPage(1))
    males = 0
    females = 0
    if (!people.length) {
      renderNothing()
    }
    document.getElementById('gender-click').click()
  }
})

function removeFromFavorite (id) {
  if (!people || !people.length) return // 防止是空陣列的狀況

  const friendsIndex = people.findIndex((people) => people.id === id)
  if (friendsIndex === -1) return

  people.splice(friendsIndex, 1)

  // 存回 local storage
  localStorage.setItem('favoriteFriends', JSON.stringify(people))

  // 更新頁面
  if (males.length >= 0) {
    males = people.filter((people) => people.gender === 'male')
    renderPeopleList(getMalesByPage(1))
    if (males.length === 0) {
      renderNothing()
    }
  } else if (females.length > 0) {
    females = people.filter((people) => people.gender === 'female')
    renderPeopleList(getFemalesByPage(1))
    if (females.length === 0) {
      renderNothing()
    }
  } else if (people.length > 0) {
    renderPeopleList(getFriendsByPage(1))
    males = 0
    females = 0
  } else {
    renderNothing()
  }
}

function renderNothing () {
  const rawHTML = `<div class="col-sm-2 my-5 container">
      <div class="card friends-border">
        <div class="card-body text-center ">
        <a class="nav-link fonts"  id="all">Nothing</a>
        </div>
      </div>
  </div>`

  dataPanel.innerHTML = rawHTML
}

function start () {
  renderPeopleList(getFriendsByPage(1))
  males = 0
  females = 0
  if (!people.length) {
    renderNothing()
  }
}

start()
