var cursor = document.querySelector("#cursor");
var cursorText = document.querySelector("#cursorText");
var elems = document.querySelectorAll(".elem");
var navElements = document.querySelectorAll("#nav a, #nav h4");
var progress = document.querySelector('#progress');
var loaderProg = document.querySelector("#loader-number")
var timeout;

function locoScroll() {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true
    });
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    ScrollTrigger.refresh();
};

locoScroll();

// Increasing and Reducing skew on movement of mouse
function cursorSkew() {
    // Defining the scaling values
    var xscale = 1;
    var yscale = 1;

    var xprev = 0;
    var yprev = 0;

    document.addEventListener("mousemove", function (dets) {
        clearTimeout(timeout);

        // Calculating the difference
        var xdiff = dets.clientX - xprev;
        var ydiff = dets.clientY - yprev;


        // Now we'll clamp the difference between 1.2 and 0.8 and 1 being normal.
        // Like say when diff is -42 (fast moving cursor) then it'll clamp to 0.8
        // Like say when diff is 42 then it'll clamp to 1.2

        // We'll use gsap clamp for this
        xscale = gsap.utils.clamp(0.8, 1.2, xdiff);
        yscale = gsap.utils.clamp(0.8, 1.2, ydiff);

        // Updating the previous values
        xprev = dets.clientX;
        yprev = dets.clientY;

        cursorAnime(xscale, yscale);

        // for the shape trouble after we stopped moving the cursor
        timeout = setTimeout(function () {
            cursor.style.left = dets.x + 'px';
            cursor.style.top = dets.y + 'px';
            cursor.style.transform = `scale(1, 1)`;
        }, 100);
    });
};

cursorSkew();

// Custom Cursor Setup
function cursorAnime(xscale, yscale) {
    document.addEventListener('mousemove', function (dets) {
        cursor.style.left = dets.x + 'px';
        cursor.style.top = dets.y + 'px';

        cursor.style.transform = `scale(${xscale}, ${yscale})`;
    });

    elems.forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {
            cursor.classList.add("scale-up");
        });
        elem.addEventListener("mouseleave", function () {
            cursor.classList.remove("scale-up");
        });
    });
};

cursorAnime();

// This is for the progress bar and the loader progress number
function loaderTimer() {
    var countProgress = 0;

    // Set an interval to update the progress bar and the loader percentage every 55ms
    var prgInt = setInterval(function () {
        // Increment the progress by a random value between 0 and 9 to simulate smoother progress
        countProgress += Math.floor(Math.random() * 10);

        // If progress reaches or exceeds 100, set it to 100 and clear the interval
        if (countProgress >= 100) {
            countProgress = 100;
            clearInterval(prgInt); // This is to stop the progress bar from going on forever
        }

        // Update the width of the progress bar
        progress.style.width = countProgress + '%';

        // Update the text content of the loader number
        loaderProg.textContent = countProgress + '%';
    }, 55);
    // setInterval(function, time in ms)
}

// Loader plus Page1 Animation
function page1Anime() {
    var tl1 = gsap.timeline();

    tl1.from("#loader h4, #progress-capsule", {
        opacity: 0,
        x: -10,
        delay: 0.5,
        duration: 1.1,
        // function call
        onStart: loaderTimer
    });

    tl1.to("#loader", {
        top: -100 + "%",
        delay: 0.5,
        duration: 1.1
    });

    tl1.from("#nav", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: Expo.easeInOut,
    });

    tl1.to(".boundingelem", {
        y: 0,
        ease: Expo.easeInOut,
        delay: -1.4,
        duration: 2.2,
    });

    tl1.from("#page1-footer", {
        y: 20,
        opacity: 0,
        delay: -1.1,
        duration: 1.5,
        ease: Expo.easeInOut
    });
}

page1Anime();

function page2Anime() {
    elems.forEach(function (elem) {
        var rotate = 0;
        var diffrot = 0;

        elem.addEventListener("mousemove", function (dets) {
            // We first need to calculate where are in the elem div
            // As dets.clientY will give value wrt screen we subtract the top of the elem with dets.clientY to get the exact value of cursor in the elem div
            var diff = dets.clientY - elem.getBoundingClientRect().top;
            // elem.getBoundingClientRect() gives us a object of details of the selected element wrt the screen
            // like top bottom

            // Basically this is to find how much cursor moved so we can rotate the img accordingly
            diffrot = dets.clientX - rotate;
            rotate = dets.clientX

            // This is to animate the animate, make it appear
            gsap.to(elem.querySelector("img"), {
                opacity: 1,
                ease: Power1,
                top: diff,
                left: dets.clientX, // Normal co-ordinates in x direction
                rotate: gsap.utils.clamp(-20, 20, diffrot * 0.5),
            }, "page2");

            gsap.to(elem.querySelector("h1"), {
                x: 40,
                opacity: 0.4,
                ease: Expo.easeInOut
            }, "page2");

            gsap.to(elem.querySelector("h4"), {
                x: -20,
                opacity: 0.4,
                ease: Expo.easeInOut
            }, "page2");

            elem.addEventListener("mouseleave", function () {
                gsap.to(elem.querySelector("img"), {
                    opacity: 0,
                    ease: Power3,
                    duration: 0.5,
                }, "page2End");

                gsap.to(elem.querySelector("h1"), {
                    x: 0,
                    opacity: 1,
                    ease: Expo.easeInOut
                }, "page2End");

                gsap.to(elem.querySelector("h4"), {
                    x: 0,
                    opacity: 1,
                    ease: Expo.easeInOut
                }, "page2End");
            });

        });
    });
}

page2Anime();

function page3Anime(){
    var tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: "#page2 .last" ,
            scroller: "#main",
            markers: false ,
            start: "top 50%", 
            end: "top 30%" ,
            scrub: 3
        }
    });

    tl3.from("#page3 img", {
        opacity: 0,
        x: -80,
        ease: Power3
    });

    tl3.from("#page3 #textabout", {
        opacity: 0 ,
        x: 40,
        ease: Power3
    });
}

page3Anime();

// var countProgress = 0;
// var prgInt = setInterval(function () {
//     if (countProgress >= 100) {
//         countProgress = 100;
//         clearInterval(prgInt);
//         // This is to stop the progress bar from going on forever
//         // if the count is 100, then clear the interval
//     }
//     countProgress++;
//     progress.style.width = countProgress + '%';
//     loaderProg.textContent = countProgress + '%';
//     // + '%' is to add the width of the progress bar
// }, 15);

