let folderData = [{
  name: 'chipotle',
  links: [{id: 1, title: 'google', long_url: 'https://www.google.com', short_url:'google', clicks: 3}, {id: 2, title: 'yahoo', long_url: 'https://www.yahoo.com', short_url:'yahoo', clicks: 1}]
}, {
  name: 'qDOBA',
  links: [{id: 3, title: 'espn', long_url: 'https://www.espn.com', short_url:'espn', clicks: 5}]
}];

const createFolder = (knex, folder) => {
  return knex('folders').insert({
    name: folder.name
  }, 'id')
  .then(folderId => {
    let linksPromises = [];

    folder.links.forEach(link => {
      linksPromises.push(
        createLinks(knex, {
          title: link.title,
          long_url: link.long_url,
          short_url: link.short_url,
          clicks: link.clicks,
          folders_id: folderId[0]
        })
      );
    });
    return Promise.all(linksPromises);
  });
};

const createLinks = (knex, link) => {
  return knex('links').insert(link);
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      let folderPromises = [];

      folderData.forEach(folder => {
        folderPromises.push(createFolder(knex, folder));
      });
      // Inserts seed entries
      return Promise.all(folderPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
