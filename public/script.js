songs = ["Eastside", "Better Now", "hot girl bummer", "if I were u", "LETS GO", "Ransom", "Graduation", "Money Made Me Do It", "Your New Boyfriend", "Candy Paint", "you were good to me", "LOT OF ME", "Circles", "Shape of You", "Shivers", "fuck, i'm lonely", "Haru Haru", "Money Trees", "God's Plan", "Summer Of Love", "Graveyard", "Riptide", "Beautiful", "Anyone", "There's Nothing Holdin' Me Back", "Jocelyn Flores", "all the kids are depressed", "STAY", "WoW", "One Right Now", "THATS WHAT I WANT", "Diamonds", "3:15", "I Like Me Better", "me & ur ghost", "Paradise", "Payphone", "queen of broken hearts", "Starboy", "Beautiful Mistakes", "Lucky You", "cheers", "Go Dumb", "Without Me", "Be Kind", "Godzilla", "Paris in the Rain", "Takeaway", 'm.A.A.d city', 'Star', 'Caruso', 'Jetski', 'ABNB', 'Roblox', 'Wishing Well', 'Hate The Other Side', 'ALWAYS DO', 'Mine', 'P.I.M.P', 'Why'];
artAlbum = ["Eastside", "beerbongs & bentleys", "everything means nothing", "everything means nothing", "DRIP TAPE GUIDANCE CUT", "We Love You Tecca", "Graduation", "Stoney", "Your New Boyfriend", "beerbongs & bentleys", "brent", "We Love You Tecca 2", "hollywood's bleeding", "divide", "Shivers", "how i'm feeling", "Stand Up", "good kid, m.A.A.d city", "Scorpion", "Summer Of Love", "Maniac", "Pluto Tapes Volume 2", "COSMIC", "Justice", "Illuminate", "17", "glisten", "STAY", "Hollywood's Bleeding", "One Right Now", "MONTERO", "Diamonds", "COSMIC", "I met you when I was 18", "everything means nothing", "Soul Searching", "Overexposed", "everything means nothing", "Starboy", "JORDI", "Kamikaze", "cheers", "Go Dumb", "Maniac", "Be Kind", "Music To Be Murdered By", "I met you when I was 18", "World War Joy"];
art = document.getElementById("art");
slider = document.getElementById("musicslider");
title = document.getElementById("title");
volume = document.getElementById("volumeslider");
selector = document.getElementById("selectorpanel");
queue = 0;
howls = [];
baitaudio = document.getElementsByTagName("audio")[0];

for (i=0;i<songs.length;i++) {
  player = new Howl({
    src: ['tracks/'+songs[i]+".mp3"],
    volume: 1,
    autoplay: false,
    preload: false,
    onend: function() {
      if (queue < howls.length-1) {
        queue++;
      } else {
        queue = 0;
      }
      howls[queue].load();
    },
    onload: function() {
      howls[queue].play();
      baitaudio.play();
      slider.max = howls[queue]._duration;
      title.innerHTML = "Now Playing: "+songs[queue];
      art.src = "./art/"+artAlbum[queue]+".jpg";
      if ( 'mediaSession' in navigator ) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: songs[queue],
          artist: artAlbum[queue],
      		album: artAlbum[queue],
      		artwork: [
      { src: './art/'+artAlbum[queue]+'.jpg', sizes: '96x96', type: 'image/png' },
			{ src: './art/'+artAlbum[queue]+'.jpg', sizes: '128x128', type: 'image/png' },
			 { src: './art/'+artAlbum[queue]+'.jpg', sizes: '192x192', type: 'image/png' },
			 { src: './art/'+artAlbum[queue]+'.jpg', sizes: '256x256', type: 'image/png' },
			 { src: './art/'+artAlbum[queue]+'.jpg', sizes: '384x384', type: 'image/png' },
			 { src: './art/'+artAlbum[queue]+'.jpg', sizes: '512x512', type: 'image/png' }
          ]
        });
      }
    }
  });
  howls.push(player);
  selector.innerHTML+="<span onclick='selectsong()' class='songselector'>"+songs[i]+"</span><br>";
}
howls[0].load();

navigator.mediaSession.setActionHandler('pause', () => {
    baitaudio.pause();
    howls[queue].pause();
    title.innerHTML = "Paused: "+songs[queue];
});
navigator.mediaSession.setActionHandler('play', () => {
    baitaudio.play();
    howls[queue].play();
    title.innerHTML = "Now Playing: "+songs[queue];
});
navigator.mediaSession.setActionHandler('seekbackward', () => {
    skip("backward");
});
navigator.mediaSession.setActionHandler('seekforward', () => {
  skip("forward");
});
navigator.mediaSession.setActionHandler('previoustrack', () => {
  skip("backward");
});
navigator.mediaSession.setActionHandler('nexttrack', () => {
  skip("forward");
});

function updateTime() {
  howls[queue].seek(slider.value);
}

setInterval(function() {
  slider.value = howls[queue].seek();
}, 1000);

function skip(id) {
  howls[queue].unload();
  if (id == "backward") {
    if (queue > 0) {
      queue--;
    } else {
      queue = howls.length-1;
    }
  } else {
    if (queue < howls.length-1) {
      queue++;
    } else {
      queue = 0;
    }
  }
  howls[queue].load();
}

function checkkey(event) {
  if (event.keyCode == "32") {
    if (howls[queue].playing()) {
      baitaudio.pause();
      howls[queue].pause();
      title.innerHTML = "Paused: "+songs[queue];
    } else {
      baitaudio.play();
      howls[queue].play();
      title.innerHTML = "Now Playing: "+songs[queue];
    }
  }
  if (event.keyCode == "39") {
    skip("forward");
  }
  if (event.keyCode == "37") {
    skip("backward");
  }
}

function updateVolume() {
  Howler.volume(volume.value/100);
}

function togglevolumedisplay() {
  if (volume.style.display == "none") {
    volume.style.display = "block";
    document.getElementById("volumeicon").style.opacity = 1;
  } else {
    volume.style.display = "none";
    document.getElementById("volumeicon").style.opacity = 0.5;
  }
}

function revealselector() {
  if (selector.offsetLeft != 0) {
    document.getElementById("selectortoggle").innerHTML = "&lt";
    $("#selectorpanel").animate({
      left: 0+"vw" 
    }, 1000);
    $("#selectortoggle").animate({
      left: 50+"vw" 
    }, 1000);
  } else {
    document.getElementById("selectortoggle").innerHTML = "&gt";
    $("#selectorpanel").animate({
      left: -50+"vw" 
    }, 1000);
    $("#selectortoggle").animate({
      left: 0+"vw" 
    }, 1000);
  }
}

function selectsong() {
  var x = document.querySelectorAll(".songselector");
  for (i=0;i<x.length;i++) {
    if (event.target == x[i]) {
      howls[queue].unload();
      queue = i;
      howls[queue].load();
    }
  }
}
