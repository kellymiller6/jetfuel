$('#button').on('click', () => {
  createFolder()
})

const createFolder = () => {
  const folder = $('#folder-name').val();
  $.ajax({
        url: '/api/folders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ folder: folder }),
        dataType: 'json',
        success: (response) => {console.log(response)}
  })
  $('.display-area').append(`
    <section>
      <button onclick='getLinks()'>${folder}</button>
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
        success: (response) => {console.log(response)}
  })
}

const getLinks = () => {
  $.get(`/api/links/two`).then((link) => {
    $('.link-display').append(`
      <section>
        <a href=${link}>${link.title}</a>
      </section>
    `)
  })
}

//// $.get('/api/folders/one').then((message) => {$('.display-area').append(`
//   <section>
//     ${message.folder}
//   </section>
//   `)
// })
