$('#button').on('click', () => {

  // const value = shrinkUrl()
  // console.log(value);
  createFolder()
  // $('.display-area').append(`
  //   <section>
  //     <a href=${folder}>${folder}</a>
  //   </section>
  // `)
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
      <a href=${folder}>${folder}</a>
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
  //fetch POST
}

//// $.get('/api/folders/one').then((message) => {$('.display-area').append(`
//   <section>
//     ${message.folder}
//   </section>
//   `)
// })
