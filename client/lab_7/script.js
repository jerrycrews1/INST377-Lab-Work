/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */

async function dataHandler() {
    const endpoint =
        'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
    const request = await fetch(endpoint)
    const arrayName = await request.json()

    function findMatches(wordToMatch, arrayName) {
        return arrayName.filter((establishment) => {
            // here we need to figure out if the city or state matches what was searched
            const regex = new RegExp(wordToMatch, 'gi')
            return (
                establishment.zip.match(regex)
                // establishment.category.match(regex)
            )
        })
    }

    function displayMatches(evt) {
        const matchArray = findMatches(evt.target.elements.search.value, arrayName)
        const html = matchArray
            .map((establishment) => {
                console.log(establishment)
                const regex = new RegExp(evt.target.elements.search.value, 'gi')
                const zipCode = establishment.zip.replace(
                    regex,
                    `<mark class="hl">${evt.target.elements.search.value}</mark>`
                )
                // const establishmentCategory = establishment.category.replace(
                //     regex,
                //     `<mark class="hl">${event.target.value}</mark>`
                // )
                return `
          <li class="list-group-item">
            <p class="name">${establishment.name.toLowerCase()}</p>
            <p class="category">${zipCode}</p>
          </li>
        `
            })
            .join('')
        suggestions.innerHTML = html
    }

    const searchForm = document.querySelector('#searchForm')
    const searchInput = document.querySelector('.search')
    const suggestions = document.querySelector('.suggestions')

    searchForm.addEventListener('submit', (evt) => {
        evt.preventDefault()
        // console.log(evt)
        displayMatches(evt)
    })
}

function mapInit() {
    const mymap = L.map('mapid').setView([51.505, -0.09], 13)
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVycnljcmV3czEiLCJhIjoiY2t1cGtldHdwMnFmejJvb2Y1MDh0bnF1OCJ9.uNWyKQvywtxEFztz08bghw',
        {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken:
                'pk.eyJ1IjoiamVycnljcmV3czEiLCJhIjoiY2t1cGtldHdwMnFmejJvb2Y1MDh0bnF1OCJ9.uNWyKQvywtxEFztz08bghw',
        }
    ).addTo(mymap)
}

dataHandler()
mapInit()
