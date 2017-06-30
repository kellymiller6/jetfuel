$(document).ready(() => {
  receiveFolders()
})

$('#button').on('click', () => {
  if($('#folder-name').val()){
    $('.display-area').empty()
    createFolder()
  }
})

$('.display-area').on('click', '.folder-button', function() {
  const folderId = $(this).closest('.name').attr('id')
  if($(`#${folderId}-url-title`).length < 1){
  $(this).siblings('.inputs').append(`
    <div id='${folderId}' class='link-inputs'>
      <p>Add Links:</p>
      <input id="${folderId}-url-title" type="text" placeholder="enter url title">
      <input id="url" type="text" placeholder="enter url">
      <input id="link-submit-button" type="submit" value='Submit'>
    </div>
  `)
  receiveLinks(folderId, this)
  }
})

$('.display-area').on('click', '#link-submit-button', function() {
  $('.link-display').empty()
  const folderId = $(this).closest('.name').attr('id')
  const element = $(this).parent().parent();
  createLink(folderId, element)
})

const receiveLinks = (folderId, element) => {
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    if(links.length){
    links.forEach((link) => {
      if(link.folders_id == folderId) {
        appendLinks(element, link)
      }
    })
  }else{
    $('.link-display').append(`
      <p></p>
    `)
  }
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
    .then(data => {
      if(data.length){
        loopFolders(data)
      }else{
        $('.display-area').append(`
        <p>Please enter a name for your folder</p>
        `)
      }
    })
}

const loopFolders = (folders) => {
  folders.map(folder => appendFolders(folder))
}

const appendFolders = (folder) => {
  $('.display-area').append(`
    <div class='name', id=${folder.id}>
      <button
        class='folder-button'>
          ${folder.name}
      </button>
      <div class='inputs'></div>
      <div class="link-display"></div>
      </div>
    `)
}

const createLink = (id, element) => {
  const folderId = id;
  const title = $(`#${folderId}-url-title`).val();
  const url = checkHttp($('#url').val());
  const shortUrl = shortenLink()
  $.ajax({
    url: '/api/v1/links',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ title: title, long_url: url, short_url: shortUrl, folders_id: folderId, clicks: 0 }),
    dataType: 'json',
    success: (response) => {
      receiveLinks(folderId, element)
    }
  })
}

const appendLinks = (location, link) => {
  const element = $(location).siblings('.link-display')
  element.append(`
    <div class='link-list'>
      <p>Title: ${link.title}</p>
      <p>Clicks: ${link.clicks}</p>
      <a href=${link.short_url}>www.jetfuel.com/${link.short_url}</a>
      <p>Date Created: ${link.created_at}</p>
    </div>
    `)
  }

  const shortenLink = () => {
    const urlLength = 6;
    const alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";

    for (let i = 0; i < urlLength; i++) {
      text += alpha[Math.floor(Math.random() * alpha.length)];
    }

    return text;
  }

  const checkHttp = (string) => {
    if (string.substring(0, 7) != "http://") {
      return string = "http://" + string;
    } else {
      return string;
    }
  }
