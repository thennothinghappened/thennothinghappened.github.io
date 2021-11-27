let posts = document.getElementById("page_content");

function updatePage(page) {
    document.getElementsByTagName("title").innerHTML = `Changed Page to ${page}`;

    fetch("./posts.json").then(response => {return response.json();}).then(data => {
        posts.innerHTML = "";
    
        data[page].forEach(cpost => {
            let url = "url" in cpost ? cpost.url : undefined;
            let download = "download" in cpost ? cpost.download : undefined;
            let imagesrc = "imagesrc" in cpost ? cpost.imagesrc : undefined;
            let bgcol = "bgcol" in cpost ? cpost.bgcol : undefined;
    
            posts.innerHTML += createTemplatedPost(cpost.title, cpost.desc, imagesrc, bgcol, url, download);
        });
    })
}

function createTemplatedPost(title, desc, imagesrc, bgcol, url, download) {
    let temp = `<div class="page_post">`;
    let is_download = download != undefined ? `download` : ``;
    let is_bg = bgcol != undefined ? `style="background-color: ${bgcol}"` : "";

    // Add Link if specified
    temp += url != undefined ? `<a href="${url}" ${is_download}>` : "";

    // Add Image if specified
    temp += imagesrc != undefined ? `<img class="post_image" src="${imagesrc}" ${is_bg}>` : "";

    // Add title and description
    temp += `<h1>${title}</h1><p>${desc.replace(/(?:\r\n|\r|\n)/g, "<br>")}</p>`;

    // Add closing a tag if link
    if (url != undefined) temp += `</a>`;

    // Close div
    temp += `</div>`;

    return temp
}