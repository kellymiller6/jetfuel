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
  const element = this;
  displayFolderContents(element)
  $(this).toggleClass('selected')
})

$('.display-area').on('click', '#link-submit-button', function() {
  $('.link-display').empty()
  const folderId = $(this).closest('.name').attr('id')
  const element = $(this).parent().parent();
  createLink(folderId, element)
})

$('.display-area').on('click', '#sort-most-pop', function() {
  const folderId = $(this).closest('.name').attr('id')
  const element = $(this).parents('.link-inputs').parents('.inputs');
  $('.link-display').empty();

  sortByTheMost(folderId, element)
})

$('.display-area').on('click', '#sort-least-pop', function() {
  const folderId = $(this).closest('.name').attr('id')
  const element = $(this).parents('.link-inputs').parents('.inputs');
  $('.link-display').empty();

  sortByTheLeast(folderId, element)
})

const displayFolderContents = (element) => {
  const folderId = $(element).closest('.name').attr('id');

  if($(`#${folderId}-url-title`).length < 1) {
    $(element).siblings('.inputs').append(`
      <div id='${folderId}' class='link-inputs'>
        <p class='link-text'>Add Links:</p>
        <p class='error-mess'></p>
        <input id="${folderId}-url-title" type="text" placeholder="enter url title">
        <input id="url" type="text" placeholder="enter url">
        <input id="link-submit-button" type="submit" value='Submit'>
        <div class='sort-btn-container'> <span>Sort By Popularity:</span>
          <input class='sort-btn' id="sort-most-pop" type="submit" value='Most'>
          <input class='sort-btn' id="sort-least-pop" type="submit" value='Least'>
        </div>
      </div>
    `);
  getLinks(folderId, element);
  } else {
    $(element).siblings('.inputs').toggle();
    $(element).siblings('.link-display').toggle();
  }
};

const createFolder = () => {
  const folder = $('#folder-name').val();
  $.ajax({
        url: '/api/v1/folders',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name: folder }),
        dataType: 'json',
        success: (response) => {receiveFolders(response);}
  });
};


const loopFolders = (folders) => {
  folders.map(folder => appendFolders(folder));
};

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
    `);
};

const createLink = (id, element) => {
  const folderId = id;
  const title = $(`#${folderId}-url-title`).val();
  const url = $('#url').val();
  const checkedUrl = checkHttp(url);
  if(urlValidation(checkedUrl)){
    const shortUrl = shortenLink();
    $.ajax({
      url: '/api/v1/links',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ title: title, long_url: checkedUrl, short_url: shortUrl, folders_id: folderId, clicks: 0 }),
      dataType: 'json',
      success: (response) => {
        getLinks(folderId, element);
      }
    });
  }
};

const checkHttp = (string) => {
  if (!string.match(/^[a-zA-Z]+:\/\//)){
      string = 'https://' + string;
      return string;
  } else {
    return string;
  }
};

const urlValidation = (url) => {
  const exp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gi;

  const regex = new RegExp(exp);
  if(url.match(regex)){
    $('.error-mess').remove();
    return true;
  }
  $('.error-mess').append(`
    <p>Please enter a valid URL starting with http:// or https://</p>
  `);
};

const shortenLink = () => {
  const urlLength = 6;
  const alpha = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < urlLength; i++) {
    text += alpha[Math.floor(Math.random() * alpha.length)];
  }

  return text;
};

const appendLinks = (location, link) => {
  const element = $(location).siblings('.link-display');

  element.append(`
    <div class='link-list'>
      <div class='top-line'><p class='link-text'>Title: ${link.title}</p>
      <p class='link-text clicks'>Clicks: ${link.clicks}</p></div>
      <a class='link-text' href=/click/${link.short_url}>${link.short_url}</a>
      <p class="link-text">Date Created: ${new Date(link.created_at).toLocaleString()}</p>
    </div>
    `);
};


const getLinks = (folderId, element) => {
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    if(links.length){
      loopLinks(links, folderId, element);
    }else{
      $('.link-display').append(`
        <p></p>
        `);
    }
  });
};

const loopLinks = (links, folderId, element) => {
  links.forEach((link) => {
    if(link.folders_id == folderId) {
      appendLinks(element, link);
    } else {
      const loc = $(element).siblings('.link-display');
      loc.append(
        `<p>No links to display</p>`);
    }
  });
};

const compareClicks = (a,b) => {
  if (a.clicks < b.clicks)
    return -1;
  if (a.clicks > b.clicks)
    return 1;
  return 0;
};

const sortByTheMost = (folderId, element) => {
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    if(links.length){
      const sortedLinks = links.sort(compareClicks).reverse();
      loopLinks(sortedLinks, folderId, element);
    } else{
      const message = $(this).parents('.sort-btn-container').parents('.inputs').siblings('.link-display');
      message.append(
        `<p>No links to sort.</p>`
      );
    }
  });
};

const sortByTheLeast = (folderId, element) => {
  $.get(`/api/v1/folders/${folderId}/links`).then((links) => {
    if(links.length){
      const sortedLinks = links.sort(compareClicks);
      loopLinks(sortedLinks, folderId, element);
    } else{
      const message = $(this).parents('.sort-btn-container').parents('.inputs').siblings('.link-display');
      message.append(
        `<p>No links to sort.</p>`
      );
    }
  });
};

$(document).ready(() => {
  receiveFolders();
});

$('#button').on('click', () => {
  if($('#folder-name').val()){
    $('.display-area').empty();
    createFolder();
  }
});

$('.display-area').on('click', '.folder-button', function() {
  const element = this;
  displayFolderContents(element);
});

$('.display-area').on('click', '#link-submit-button', function() {
  $('.link-display').empty();
  const folderId = $(this).closest('.name').attr('id');
  const element = $(this).parent().parent();
  createLink(folderId, element);
});

$('.display-area').on('click', '#sort-most-pop', function() {
  const folderId = $(this).closest('.name').attr('id');
  const element = $(this).parents('.link-inputs').parents('.inputs');
  $('.link-display').empty();

  sortByTheMost(folderId, element);
});

$('.display-area').on('click', '#sort-least-pop', function() {
  const folderId = $(this).closest('.name').attr('id');
  const element = $(this).parents('.link-inputs').parents('.inputs');
  $('.link-display').empty();

  sortByTheLeast(folderId, element);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>{
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('reg', registration);
      })
      .catch(error => {
        console.log('Failure');
      });
  });
}
