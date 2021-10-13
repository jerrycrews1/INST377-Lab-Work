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
    let markerGroup

    function findMatches(wordToMatch, arrayName) {
        const regex = new RegExp(wordToMatch, 'gi')
        const smallArray = arrayName.reduce((acc, cur) => {
            const isAlreadyIncluded = acc.find(
                (item) => item.establishment_id === cur.establishment_id
            )
            if (
                !isAlreadyIncluded &&
                cur.geocoded_column_1 &&
                cur.zip.match(regex)
            ) {
                acc.push(cur)
                return acc
            }
            return acc
        }, [])
        return smallArray.slice(0, 5)
    }

    function displayMatches(evt) {
        const matchArray = findMatches(
            evt.target.elements.search.value,
            arrayName
        )
        const html = matchArray
            .map((establishment) => {
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
        if (matchArray.length > 0) {
            const firstItem = matchArray[0]
            mymap.setView(
                [
                    firstItem.geocoded_column_1.coordinates[1],
                    firstItem.geocoded_column_1.coordinates[0],
                ],
                13
            )
            const markers = []
            matchArray.forEach((establishment) => {
                const lat = establishment.geocoded_column_1.coordinates[1]
                const lon = establishment.geocoded_column_1.coordinates[0]
                console.log(lat, lon)
                const marker = L.marker([lat, lon]).addTo(mymap)
                markers.push(marker)
            })
            markerGroup = L.layerGroup(markers).addTo(mymap)
        }
    }

    const searchForm = document.querySelector('#searchForm')
    const searchInput = document.querySelector('.search')
    const suggestions = document.querySelector('.suggestions')

    searchInput.addEventListener('input', (evt) => {
        if (evt.target.value === '') {
            suggestions.innerHTML = ''
            console.log('no input')
            markerGroup.clearLayers()
        }
    })

    searchForm.addEventListener('submit', (evt) => {
        evt.preventDefault()
        // console.log(evt)
        displayMatches(evt)
    })
}

function mapInit() {
    const mymap = L.map('mapid').setView([38.83, -76.85], 13)
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
    return mymap
}

dataHandler()
const mymap = mapInit()
