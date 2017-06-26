$('#button').on('click', () => {
  const folder = $('#folder-name').val();

  $('.display-area').append(`
    <section>
      <a href=${folder}>${folder}</a>
    </section>
  `)
})
