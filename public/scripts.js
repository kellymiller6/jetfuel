$(document).ready(() => {
  receiveFolders()
})

$('#button').on('click', () => {
  createFolder()
  createLink()
})

const createFolder = () => {
  const folderTitle = $('#folder-name').val();
  $.ajax({
        url: '/api/v1/folders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: folderTitle }),
        dataType: 'json',
        success: (response) => {appendFolders(response)}
        //call an appendFolders(response)
  })
}

//const receiveFolders = () => fetch(/api/v1/folders)//loopFolders(response)
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
    <section>
      <button onclick='getLinks()'>${folder.name}</button>
      <div class="link-display"></div>
    </section>
  `)
}


const shrinkUrl = () => {
  const urlValue = $('#url').val();
  const output = $.ajax({
        url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCiBZz-unuyj73d85Cu0mllPoe6-C7A28w',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ longUrl: urlValue }),
        dataType: 'json',
        success: (response) => {response.id}
  })
  return output.id
}

const createLink = (name, url) => {
  const urlValue = $('#url').val();
  $.ajax({
        url: '/api/links',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ link: link }),
        dataType: 'json',
        success: (response) => {appendLinks(response)}
        //success: (response) => appendLinks(response)
  })
}

//const receiveLinks = (links) == fetch call throwing response into loopLinks(response)

const loopLinks = (links) => {
  folders.map(link => appendLinks(link))
}

const appendLinks = (link) => {
  $.get(`/api/links/two`).then((link) => {
    $('.link-display').append(`
      <section>
        <a href=${link}>${link.title}</a>
      </section>
    `)
  })
}

const receiveLinks = () => {
  fetch('/api/v1/links')
    .then(response => response.json())
    .then(data => loopLinks(data))
}

//// $.get('/api/folders/one').then((message) => {$('.display-area').append(`
//   <section>
//     ${message.folder}
//   </section>
//   `)
// })
