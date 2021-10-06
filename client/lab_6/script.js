/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */

async function windowActions() {
    const endpoint =
        'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
    const request = await fetch(endpoint)
    const arrayName = await request.json()

    function findMatches(wordToMatch, arrayName) {
        return arrayName.filter((establishment) => {
            // here we need to figure out if the city or state matches what was searched
            const regex = new RegExp(wordToMatch, 'gi')
            return (
                establishment.name.match(regex) ||
                establishment.category.match(regex)
            )
        })
    }

    function displayMatches(event) {
        const matchArray = findMatches(event.target.value, arrayName)
        const html = matchArray.map((establishment) => {
            const regex = new RegExp(event.target.value, 'gi')
            const establishmentName = establishment.name.replace(
                regex,
                `<mark class="hl">${event.target.value}</mark>`
            )
            const establishmentCategory = establishment.category.replace(
                regex,
                `<mark class="hl">${event.target.value}</mark>`
            )
            return `
          <li class="list-group-item">
            <p class="name">${establishmentName.toLowerCase()}</p>
            <p class="category">${establishmentCategory}</p>
          </li>
        `
        })
        .join('')
        suggestions.innerHTML = html
    }

    const searchInput = document.querySelector('.search')
    const suggestions = document.querySelector('.suggestions')

    searchInput.addEventListener('input', (evt) => {
        displayMatches(evt)
    })
    // searchInput.addEventListener('keyup', (evt) => {
    //     displayMatches(evt)
    // })
}

window.onload = windowActions
