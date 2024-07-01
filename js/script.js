let width = document.querySelector(".bar").getBoundingClientRect().width;
let songs;
let folders;
let genre;

function setHeight() {
    const parent = document.querySelector(".left");
    const div1 = document.querySelector(".home");
    const div2 = document.querySelector(".library");
    const div3 = document.querySelector(".left-footer");
    const div4 = document.querySelector(".heading");
    const div5 = document.querySelector(".songlist");

    const parentHeight = parent.getBoundingClientRect().height;
    const div1Height = div1.getBoundingClientRect().height;
    const div3Height = div3.getBoundingClientRect().height;
    const div4Height = div4.getBoundingClientRect().height;
    const div2Height = parentHeight - div1Height - div3Height;
    const div5Height = div2Height - 1.75 * div4Height;

    div2.style.height = `${div2Height}px`;
    div5.style.height = `${div5Height}px`;
}

window.onload = setHeight();
window.onresize = setHeight();

let musicnote = document.querySelector(".songlist").getElementsByTagName("img");
let currentsong = new Audio();

async function getSongs(genre) {
    let a = await fetch(`https://api.github.com/repos/SupaStrikas1/SoundWave/contents/songs/${genre}`)
    console.log(a);
    let response = await a.text();
    let songdirectories=JSON.parse(response);
    console.log(songdirectories);
    let songs = [];
    for (let index = 0; index < songdirectories.length; index++) {
        const element = songdirectories[index];
        if (element.name.endsWith(".mp3")) {
            songs.push(element.name);
        }
    }
    console.log(songs);
    return songs;
}

function playmusic(genre, track) {
    currentsong.src = `https://raw.githubusercontent.com/SupaStrikas1/SoundWave/main/songs/${genre}/${track}`;
    currentsong.play();
    play.src = "./svg-images-logos/pause-c.svg";
    document.querySelector(".songname").innerHTML = track;
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].split("%20").join(" "));
    for (let i = 0; i < musicnote.length; i++) {
        if (i == index) {
            musicnote[i].style.visibility = "visible";
        }
        else {
            musicnote[i].style.visibility = "hidden";
        }
    }
}

function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

async function loadfolders() {
    let a = await fetch("https://api.github.com/repos/SupaStrikas1/SoundWave/contents/songs/");
    let response = await a.text();
    let directories=JSON.parse(response);
    let folders = [];
    for (let index = 0; index < directories.length; index++) {
        const element = directories[index];
        if (element.url.startsWith("https://api.github.com/repos/SupaStrikas1/SoundWave/contents/songs/")) {
            folders.push(element.name);
        }
    }
    return folders;
}


async function main() {

    folders = await loadfolders();
    console.log(folders);

    let foldercard = document.querySelector(".cardcontainer");
    for (const folder of folders) {
        foldercard.innerHTML = foldercard.innerHTML + `<div class="card">
                        <div class="play">
                            <button class="play-btn"><img src="./svg-images-logos/play.svg" alt="play"></button>
                        </div>
                        <img class="folderimg" src="" alt="">
                        <h3>${folder}</h3>
                    </div>`;
    }

    Array.from(document.querySelector(".cardcontainer").getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async element => {
            let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
            songul.innerHTML = "";
            genre = e.getElementsByTagName("h3")[0].innerText;
            songs = await getSongs(genre);
            for (const song of songs) {
                songul.innerHTML = songul.innerHTML + `<li><div>${song}</div><img src="./svg-images-logos/music.svg" alt="" style="visibility: hidden"></li>`;
            }
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
                e.addEventListener("click", element => {
                    playmusic(genre, e.getElementsByTagName("div")[0].innerHTML);
                })
            })
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
        if (percent == 100) {
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].split("%20").join(" "));
            if (index < songs.length - 1) {
                playmusic(genre, songs[index + 1]);
            }
        }
    })

    document.querySelector(".bar").addEventListener("click", e => {
        let percentseek = (e.offsetX * 100) / width;
        document.querySelector(".circle").style.left = `${percentseek}%`;
        document.querySelector(".progress").style.width = `${percentseek}%`;
        currentsong.currentTime = (percentseek * currentsong.duration) / 100;
    })

    document.querySelector(".menu").addEventListener("click", e => {
        let leftmedia = document.querySelector(".left");
        leftmedia.style.transform = "translate(400%)";
        leftmedia.style.zIndex = "1";
        leftmedia.style.transition = "all 0.5s ease-in-out";
    })

    document.querySelector("#close").addEventListener("click", e => {
        let leftmedia = document.querySelector(".left");
        leftmedia.style.transform = "translate(0%)";
        leftmedia.style.zIndex = "0";
        leftmedia.style.transition = "all 0.5s ease-in-out";
    })

    document.querySelector("#skip-pre").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].split("%20").join(" "));
        if (index > 0) {
            playmusic(genre, songs[index - 1]);
        }
    })

    document.querySelector("#skip-next").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0].split("%20").join(" "));
        if (index < songs.length - 1) {
            playmusic(genre, songs[index + 1]);
        }
    })

    document.querySelector("#volume").addEventListener("click", () => {
        let volume = document.getElementById("volume");
        if (volume.getAttribute("src") == "./svg-images-logos/volume.svg") {
            currentsong.muted = true;
            volume.setAttribute("src", "./svg-images-logos/mute.svg");
        }
        else {
            currentsong.muted = false;
            volume.setAttribute("src", "./svg-images-logos/volume.svg");
        }
    })

}

main();
