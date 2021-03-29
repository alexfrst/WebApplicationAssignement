let director = ""
let directorUri = ""
let crew = ""
let id = ""
let apikey = "ea545b12af073f68c4f3914d1e773de6"
let movielist = ["ah"]

document.getElementById("directorinput").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        DirectorInput()
    }
});

document.getElementById("movieinput").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        MovieInput()
    }
});

const getDirectorName = (staffInfo) => {
    crew = staffInfo.cast
    console.log(staffInfo)
    const cast = staffInfo.crew
    for(elem of cast){
        if(elem.job === "Director"){
            directorUri = elem.profile_path
            id = elem.id
            return elem.name
        }
    }
}

const getMovieInfo = async (id) => {

    const staffinfos = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}&language=en-US`)
        .then(result => {return result.json()})
        .then((data) =>{return data})

    const movieinfos = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&language=en-US`)
        .then(result => {return result.json()})
        .then((data) =>{return data})
    const poster = `https://image.tmdb.org/t/p/w500/${movieinfos.poster_path}`
    return({"poster":poster,"title":movieinfos.title,"releasedate":movieinfos.release_date, "director":getDirectorName(staffinfos), "plot":movieinfos.overview})
}

const updateRendering = async (id) => {
    let place = "1"
    const values = await getMovieInfo(id)
    if(id==181808){
        director = values.director
        place = ""
    }

    console.log(director)
    document.getElementById("title"+place).innerText = values.title
    document.getElementById("date"+place).innerText=values.releasedate
    document.getElementById("img"+place).style.display = "block"
    document.getElementById("img"+place).src =  values.poster;
    document.getElementById("plot"+place).innerText =  values.plot;
}

const HideAll = async (id) => {
    const vrai = document.getElementsByClassName("vrai")
    const faux = document.getElementsByClassName("faux")
    document.getElementById("redundancy").style.display = "none"
    vrai[id].style.display = "none"
    faux[id].style.display = "none"
}

const DirectorInput = () => {
    const value = document.getElementById("directorinput").value
    HideAll(0)
    if(value.toLowerCase() == director.toLowerCase()){
        document.getElementsByClassName("vrai")[0].style.display = "block"
        document.getElementById("tohide").style.display = "block"
        ChangeImage(directorUri)
        return null
    }else{
        for(const elem of crew){
            if(elem.name.toLowerCase() === value.toLowerCase()){
                document.getElementsByClassName("vrai")[0].style.display = "block"
                document.getElementById("tohide").style.display = "block"
                id = elem.id
                ChangeImage(elem.profile_path)
                return null
            }
        }
        document.getElementsByClassName("faux")[0].style.display = "block"
    }
}

const ChangeImage = (uri) => {
    try{
        if(uri){
            console.log(`https://image.tmdb.org/t/p/w500/${uri}`)
            document.getElementById("actor").style.display = "block"
            document.getElementById("actor").src = `https://image.tmdb.org/t/p/w500/${uri}`
        }
    }catch{
        console.log("pas d'image")
    }
}


const MovieInput = async () => {
    HideAll(1);

    const name = document.getElementById("movieinput").value
    if(movielist.includes(name)){
        document.getElementById("redundancy").style.display = "block"
        return null
    }
    console.log(movielist)
    movielist.push(name)
    const MovieResponse =await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apikey}&language=en-US`).then(response => {return response.json()}).then(response => {return response})
    console.log(MovieResponse)
    for(const elem in MovieResponse.crew){
        if(elem.job === "Director" && elem.title.toLowerCase() == elem.title.toUpperCase()){
            updateRendering(elem.id)
            document.getElementsByClassName("vrai")[1].style.display = "block"
            return null
        }
    }
    for(elem of MovieResponse.cast){
        if(elem.title.toLowerCase() == name.toLowerCase()){
            updateRendering(elem.id)
            document.getElementsByClassName("vrai")[1].style.display = "block"
            return null
        }
    }
    document.getElementsByClassName("faux")[1].style.display = "block"
}

const Reset = () =>{
    document.getElementById("actor").src = null
    document.getElementById("actor").style.display = "None"
    document.getElementById("img1").src = null
    document.getElementById("img1").style.display = "None"
    document.getElementById("date1").innerText = ""
    document.getElementById("title1").innerText = ""
    document.getElementById("plot1").innerText = ""

    HideAll(0)
    HideAll(1)
    document.getElementById("tohide").style.display = "None"
}
updateRendering(181808)
