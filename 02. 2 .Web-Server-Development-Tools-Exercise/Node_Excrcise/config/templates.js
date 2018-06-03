module.exports = {
    posterTemplate: (index, posterUrl) => `
        <div class="movie">
            <a href="/movies/details/${index}">
                <img class="moviePoster" src="${posterUrl}" />
            </a>
        </div>
    `,
    detailsTemplate: (posterUrl, title, year, description) => `
        <div class="content">
           <img src="${posterUrl}" />
            <h3>Title ${title}</h3>
            <h3>Year ${year}</h3>
            <p>${description}<p>
        </div>
    `,
    statusTemplate: (numberOfMovies) => `
    <div class="content">
    <h1>Total Number of Movies: ${numberOfMovies}</h1>
    </div>
`,
    errorNotification: () => `
        <div id="errBox">
            <h2 id="errMsg">Please fill all fields</h2>
        </div>
    `,
    successNotification: () => `
        <div id="succssesBox">
            <h2 id="succssesMsg">Movie Added</h2>
        </div>
    `
};