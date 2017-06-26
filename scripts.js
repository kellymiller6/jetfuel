$('#button').on('click', () => {
  const folder = $('#folder-name').val();

  $('.display-area').append(`
    <section>
      <a href=${folder}>${folder}</a>
    </section>
  `)
})

const createFolder = (string) => {
  //fetch POST
}

const shrinkUrl = (url) => {
  let urlValue = $('#url').val()
}

const createLink = (name, url) => {
  //fetch POST
}
