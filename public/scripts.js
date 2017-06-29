$(document).ready(() => {
  receiveFolders()
})

$('#button').on('click', () => {
  $('.display-area').empty()
  createFolder()
  // appendFolders()
})

//creates input fields when click displaylinks
$('.display-area').on('click', '.folder-button', function() {
  const folderId = $(this).closest('.name').attr('id')
  $(this).siblings('.inputs').append(`
    <input id="url-title" type="text" placeholder="enter url title">
    <input id="url" type="text" placeholder="enter url">
    <input id="link-submit-button" onclick="createLink(${folderId})" type="submit" value='Submit'>
  `)
  receiveLinks(folderId, this)
})

// $('.display-area').on('click', '#link-submit-button', function() {
//   appendLinks(this, link)
// })


const receiveLinks = (folderId, element) => {
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    links.forEach((link) => {
      if(link.folders_id == folderId) {
        appendLinks(element, link)
      }
    })
  })
}


const createFolder = () => {
  const folder = $('#folder-name').val();
  $.ajax({
        url: '/api/v1/folders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: folder }),
        dataType: 'json',
        success: (response) => {receiveFolders(response)}
  })
}

const receiveFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(data => loopFolders(data))
}

const loopFolders = (folders) => {
  folders.map(folder => appendFolders(folder))
}

const appendFolders = (folder) => {
  console.log(folder);
  $('.display-area').append(`
    <div class='name', id=${folder.id}>${folder.name}
      <button
        class='folder-button'>
          Display Links
      </button>
      <div class='inputs'></div>
      <div class="link-display"></div>
      </div>
    `)
}

const createLink = (id) => {
  const title = $('#url-title').val();
  const url = $('#url').val();
  const folderId = id;
  $.ajax({
    url: '/api/v1/links',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ title: title, long_url: url, short_url: url, folders_id: folderId }),
    dataType: 'json',
    success: (response) => {appendLinks(this, response)}
  })
}

const appendLinks = (location, link) => {
  const element = $(location).siblings('.link-display')
  element.append(`
    <div>
      <a href=${link.long_url}>${link.title}</a>
    </div>
    `)
  }






// const shrinkUrl = () => {
//   const urlValue = $('#url').val();
//   const output = $.ajax({
//         url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCiBZz-unuyj73d85Cu0mllPoe6-C7A28w',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({ longUrl: urlValue }),
//         dataType: 'json',
//         success: (response) => {response.id}
//   })
//   return output.id
// }
