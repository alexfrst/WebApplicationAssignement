const createElement = (url,name,date) =>{
    return `<div class="item">
                <img src="${url}">
                <div>
                    <h1>${date}</h1>
                    ${name}
                </div>
            </div>`
}

const getImages = async () => {
        return fetch(`/data`).then(function(result) {
            console.log(result)
            return result.json();
        })

}

const populatePage = async () => {
    const imagesData = await getImages()
    console.log(imagesData)
    for(const elem of imagesData){
        document.getElementById("insert").innerHTML += createElement(elem.path, elem.user,elem.date)
    }

}

populatePage()

