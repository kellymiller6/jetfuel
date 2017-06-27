$('#button').on('click', () => {
  const folder = $('#folder-name').val();
  const value = shrinkUrl()
  console.log(value);
  $('.display-area').append(`
    <section>
      <a href=${folder}>${folder}</a>
    </section>
  `)
})

const createFolder = (string) => {
  //fetch POST
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
  //fetch POST
}
