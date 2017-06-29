$('#button').on('click', () => {
  createFolder()
  getFolders()
})

const createFolder = () => {
  const folder = $('#folder-name').val();
  $.ajax({
        url: '/api/v1/folders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: folder }),
        dataType: 'json',
        success: (response) => {console.log(response)}
  })
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
        success: (response) => {console.log(response)}
  })
}

const getFolders = () => {
  $.get(`/api/v1/folders`).then((folders) => {
      folders.forEach((folder) => {
        $('.display-area').append(`
          <div class='name', id=${folder.id}>
            ${folder.name}
            <button
              class='folder-button'>
              Display Links
            </button>
            <div class="link-display"></div>
          </div>
          `)
      })
  })
}

function appendLinks (location, link) {
  const element = $(location).siblings('.link-display')
  element.append(`
    <div>
      <a href=${link.long_url}>${link.title}</a>
    </div>
    `)
}

$('.display-area').on('click', '.folder-button', function() {
  const folderId = $(this).closest('.name').attr('id')
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    links.forEach((link) => {
      if(link.folders_id == folderId) {
        appendLinks(this, link)
      }
    })
  })
})
