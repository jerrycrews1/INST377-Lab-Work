// Get the items we will be working with
const prevButton = document.querySelector('.prev-button')
const nextButton = document.querySelector('.next-button')
const photos = document.querySelectorAll('.photo-grid-item')
let currentPosition = 0 // start at the beginning

const previous = () => {
    // go to previous image
    let nextImageIndex =
        currentPosition !== 0 ? currentPosition - 1 : photos.length - 1
    changeImage(nextImageIndex)
    currentPosition = nextImageIndex
}

const next = () => {
    // go to next image
    let nextImageIndex =
        currentPosition !== photos.length - 1 ? currentPosition + 1 : 0
    changeImage(nextImageIndex)
    currentPosition = nextImageIndex
}

// Add event listeners to the buttons
prevButton.addEventListener('click', previous)
nextButton.addEventListener('click', next)

const changeImage = (nextActiveIndex) => {
    // handles changing the image
    // change class of current item
    photos[currentPosition].classList.remove('active-item')
    photos[currentPosition].classList.add('hidden-item')

    // change class of next item
    photos[nextActiveIndex].classList.add('active-item')
    photos[nextActiveIndex].classList.remove('hidden-item')
}
