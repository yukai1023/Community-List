const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const titleFriends = document.querySelector('#title-Friends')
const genderNavbar = document.querySelector('#navbar-gender')
const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
const friendsPage = 24
const people = []
let filteredFriends = []
let males = []
let females = []

axios
  .get(INDEX_URL)
  .then((response) => {
    people.push(...response.data.results)
    renderPeopleList(getFriendsByPage(1))
    renderPaginator(people.length)
    heartSave(list)
  })
  .catch((err) => console.log(err))

function renderPeopleList (data) {
  let rawHTML = ''
  data.forEach((item) => {
    if (item.gender === 'male') {
      rawHTML += `<div class="col-sm-2 my-2 px-4 ">
      <div class="card friends-bk friends-border">
      <img src="${item.avatar}" class="card-img-top pic-border" >
      <a href="#" ><i class="far fa-heart" data-id="${item.id}"></i></a >
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
      <a href="#" ><i class="far fa-heart" data-id="${item.id}"></i></a >
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
    modalBody.innerHTML = `<p class="text-center fonts"> Gmail : ${data.email} <br> 
                          Gender : ${data.gender} <br>
                          Age : ${data.age} <br>
                          Region : ${data.region} <br>
                          Birthday : ${data.birthday} <br></p>`
    modalImg.innerHTML = `<img src="${data.avatar}"  class="img-fluid rounded mx-auto d-block " width="200">`
  })
}

dataPanel.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('#user-image')) {
    showPeopleModal(event.target.dataset.id)
  } else if (event.target.matches('.fa-heart')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

function addToFavorite (id) {
  const friends = people.find((people) => people.id === id)
  if (list.find((people) => people.id === id)) {
    const friendsIndex = list.findIndex((people) => people.id === id)
    if (friendsIndex === -1) return
    list.splice(friendsIndex, 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(list))
  } else {
    list.push(friends)
    localStorage.setItem('favoriteFriends', JSON.stringify(list))
  }
}

titleFriends.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches('#title-Friends')) {
    // ??????????????????
    location.reload()
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted (event) {
  // ??????????????????
  event.preventDefault()
  // ?????????????????????
  const keyword = searchInput.value.trim().toLowerCase()
  // ?????????????????????????????????
  // ????????????
  filteredFriends = people.filter((friend) =>
    (friend.name + ' ' + friend.surname).toLowerCase().includes(keyword)
  )
  if (filteredFriends.length === 0) {
    return alert(`????????????????????????${keyword} ????????????????????????`)
  }
  // ???????????????
  renderPaginator(filteredFriends.length) // ????????????
  // ??????????????? 1 ??????????????????
  renderPeopleList(getFriendsByPage(1)) // ????????????
  heartSave(list)
})

function getFriendsByPage (page) {
  // ????????????
  const data = filteredFriends.length ? filteredFriends : people
  const startIndex = (page - 1) * friendsPage
  // ????????????
  return data.slice(startIndex, startIndex + friendsPage)
}

function getMalesByPage (page) {
  // ????????????
  const data = males.length ? males : people
  const startIndex = (page - 1) * friendsPage
  // ????????????
  return data.slice(startIndex, startIndex + friendsPage)
}

function getFemalesByPage (page) {
  // ????????????
  const data = females.length ? females : people
  const startIndex = (page - 1) * friendsPage
  // ????????????
  return data.slice(startIndex, startIndex + friendsPage)
}

function renderPaginator (amount) {
  // ???????????????
  const numberOfPages = Math.ceil(amount / friendsPage)
  // ?????? template
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link font-weight-bold" href="#" data-page="${page}">${page}</a></li>`
  }
  // ?????? HTML
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked (event) {
  // ???????????????????????? a ???????????????
  if (event.target.tagName !== 'A') return

  // ?????? dataset ????????????????????????
  const page = Number(event.target.dataset.page)
  // ????????????
  if (males.length > 0) {
    renderPeopleList(getMalesByPage(page))
  } else if (females.length > 0) {
    renderPeopleList(getFemalesByPage(page))
  } else {
    renderPeopleList(getFriendsByPage(page))
  }
  heartSave(list)
})

genderNavbar.addEventListener('click', (event) => {
  if (event.target.matches('#male')) {
    males = people.filter((people) => people.gender === 'male')
    renderPaginator(males.length)
    renderPeopleList(getMalesByPage(1))
    females = []
    document.getElementById('gender-click').click()
  } else if (event.target.matches('#female')) {
    females = people.filter((people) => people.gender === 'female')
    renderPaginator(females.length)
    renderPeopleList(getFemalesByPage(1))
    males = []
    document.getElementById('gender-click').click()
  } else if (event.target.matches('#all')) {
    renderPaginator(people.length)
    renderPeopleList(getFriendsByPage(1))
    males = []
    females = []
    document.getElementById('gender-click').click()
  }
  heartSave(list)
})

dataPanel.addEventListener('click', function clickModal (event) {
  event.preventDefault()

  if (event.target.matches('.far')) {
    event.target.classList.add('fas')
    event.target.classList.remove('far')
  } else if (event.target.matches('.fas')) {
    event.target.classList.add('far')
    event.target.classList.remove('fas')
  }
})

function heartSave (data) {
  if (list.length === 0) return
  const heartSearch = document.querySelectorAll('.fa-heart')

  data.forEach((list) => {
    heartSearch.forEach((heart) => {
      if (Number(heart.dataset.id) === list.id) {
        heart.classList.add('fas')
        heart.classList.remove('far')
      }
    })
  })
}

function removeFromFavorite (id) {
  if (!people || !people.length) return // ???????????????????????????

  const friendsIndex = people.findIndex((people) => people.id === id)
  if (friendsIndex === -1) return

  people.splice(friendsIndex, 1)

  // ?????? local storage
  localStorage.setItem('favoriteFriends', JSON.stringify(people))

  // ????????????
}
