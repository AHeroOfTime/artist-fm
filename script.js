const app = {
  // API info
  apiRootUrl: ` http://ws.audioscrobbler.com/2.0/`,
  apiKey: `ed6f270d49a2288fb045589ebe7e5207`,

  // Element Selectors
  $searchInput: $('#search-input'),
  $form: $('form'),
  $artistContainer: $('.artist-container'),

  // Helper functions
  // this will replace any multi space with one space and also trim white space from the beginning and end of the string
  validate: function (s) {
    return s.replace(/\s\s+/g, ' ').trim();
  },
  // Main app functions
  getArtistInfo: function (artist) {
    const response = $.ajax({
      url: `${app.apiRootUrl}?method=artist.getinfo&artist=${artist}&api_key=${app.apiKey}&format=json `,
      method: 'GET',
      dataType: 'json',
      // result return an object for the artist -> has one index (.artist)
    });

    return response;
  },
  getTags: function (tags) {
    // Loop over each item in array, create an el and append it
    tags.forEach((tag) => {
      const span = `<span class='tag'>${tag.name}</span>`;
      $('.tags').append(span);
    });
  },
  displayArtistInfo: function (artistData) {
    // Used to format numbers with ,
    const numberFormatter = new Intl.NumberFormat();
    // data variables
    const artistName = artistData.name;
    const artistBioSum = artistData.bio.summary;
    const statListeners = numberFormatter.format(artistData.stats.listeners);
    const statPlayCounts = numberFormatter.format(artistData.stats.playcount);
    const artistTags = artistData.tags.tag;
    const imgSrc = 'https://source.unsplash.com/1600x900/?concert';

    const artistHtml = `
    <div class="image-container">
    <img src="${imgSrc}" alt="Random concert image from unsplah.com">
  </div>
  <div class="artist-info">
    <h1 class="artist-name">${artistName}</h1>
    <p class="bio-summary"><span class="info-title">Bio Summary:</span>${artistBioSum}</p>
    <p class="playcount"><span class="info-title">Playcount:</span>${statPlayCounts}</p>
    <p class="listeners"><span class="info-title">Listeners:</span>${statListeners}</p>
    <div class="tags">
    </div>
    </div>
    `;

    // clear html before appending new info
    app.$artistContainer.empty();
    app.$artistContainer.append(artistHtml);
    // gets tags after container is made and displays them
    app.getTags(artistTags);
  },
};

app.init = function () {
  // initialize app
};

$(function () {
  app.init();

  // Event Listener
  app.$form.on('submit', (e) => {
    e.preventDefault();

    // Get search value from input
    let artistSearchValue = app.$searchInput.val().trim();

    if (artistSearchValue) {
      // This code was a secondary option to filter
      // if(artistSearchValue)
      // trim string, then replace any spaces with a +
      // const artistSearchArray = artistSearchValue.split(' ');
      // const filteredSearch = artistSearchArray.filter((artist) => {
      //   return artist !== ' ' && artist !== '';
      // });
      // const filteredArtist = filteredSearch.join(' ');

      const filteredArtist = app.validate(artistSearchValue);

      const artistData = app.getArtistInfo(filteredArtist);
      artistData.done((res) => {
        // this returns as on obj
        const artist = res.artist;

        app.displayArtistInfo(artist);
      });
    } else {
      alert('Please enter something other than blank spaces :3');
    }
    // Empty search bar
    // I dont like alerts :(
    artistSearchValue = app.$searchInput.val('');
  });
});

// TODO:
// Info to display
// Artist name
// Bio? - returns another obj - summary only?
// Stats
// Images? (images aren't returned in data obj - need to find another way? Use unsplash to grab a random 'music' image) - Set background img? or have a small 'avatar' img?
// tags? - Add in 'pill'?
// todo Similar artists?
// todo link to last.fm page?
// todo find way to refresh image or get new image w/o reloading page
