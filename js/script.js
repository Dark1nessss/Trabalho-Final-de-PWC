console.clear();

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    gsap.timeline({
        scrollTrigger: {
            trigger: ".wrapper",
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            markers: true
        }
    })
    .to(".image-top", {
        y: "-100%",
        ease: "power1.inOut"
    })
    .to(".image-bottom", {
        scale: 2,
        ease: "power1.inOut"
    }, "<");
});
