let width=document.querySelector(".bar").getBoundingClientRect().width;

let currentsong = new Audio();
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/SoundWave/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.title.endsWith(".mp3")) {
            songs.push(element.title);
        }
    }
    return songs;
}

function playmusic(music, track) {
    currentsong.src = "/SoundWave/songs/" + track;
    currentsong.play();
    play.src = "./svg-images-logos/pause-c.svg";
    document.querySelector(".songname").innerHTML = track;
}

function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><div>${song}</div><img src="./svg-images-logos/music.svg" alt="" style="visibility: hidden"></li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let music = e.getElementsByTagName("img")[0];
            music.style.visibility = "visible";
            playmusic(music, e.getElementsByTagName("div")[0].innerHTML);
        })
    })

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "./svg-images-logos/pause-c.svg";
        }
        else {
            currentsong.pause();
            play.src = "./svg-images-logos/play-c.svg";
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentsong.currentTime)} / ${convertSecondsToMinutes(currentsong.duration)}`;
        let percent = (currentsong.currentTime * 100) / currentsong.duration;
        document.querySelector(".circle").style.left = `${percent}%`;
        document.querySelector(".progress").style.width = `${percent}%`;
    })

    document.querySelector(".bar").addEventListener("click", e => {
        let percentseek = (e.offsetX * 100) / width;
        document.querySelector(".circle").style.left = `${percentseek}%`;
        document.querySelector(".progress").style.width = `${percentseek}%`;
        currentsong.currentTime = (percentseek * currentsong.duration) / 100;
    })
}

main();