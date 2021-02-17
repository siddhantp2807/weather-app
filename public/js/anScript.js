



const config = {
    type: 'slider',
    perView: 3,
    focusAt: 'center',
    keyboard: true,
    perTouch: 2,
    breakpoints: {
        
        1200: {
            perView: 3,
        },
        1000: {
            perView: 2,
        },
        750: {
            perView: 1,
        }
        
    },
    rewindDuration:1600,
}
new Glide('.glide', config).mount();