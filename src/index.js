import './css/styles.css';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;


const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


const input = document.getElementById('search-box');

input.addEventListener('input', debounce(inSearchCountries, DEBOUNCE_DELAY));


function inSearchCountries(evt) {
    evt.preventDefault();

    const inputValue = evt.target.value.trim();
    if (inputValue === '') {
        cleanDocument();;
        return;
    }

    cleanDocument();


    fetchCountries(inputValue)

        .then(data => {

            if (data.length >= 10) {
                Notify.info("Too many matches found. Please enter a more specific name.",
                    { clickToClose: true, position: "center-top", width: '320px', fontSize: '20px' });
                return;
            } else if (data.length === 1) {
                oneCountry(data);
                return;
            } else {
                listOfAllCountries(data);
            }
        }).catch(error =>
            Notify.failure("Oops, there is no country with that name",
                { position: "center-top", width: '420px', fontSize: '20px' }))
}


function listOfAllCountries(data) {
    const markupAllCountry = data.map(object => {
        const { flags, name } = object;

        return `<li class="country-row">
        <img src="${flags.svg}" alt="${name}" width="40" height="30">
        ${name}</li>`;
    }).join('')


    countryList.innerHTML = markupAllCountry;
}


function oneCountry(data) {
    data.forEach(object => {
        const { flags, name, population, capital } = object;

        let languagesArray = [];
        object.languages.forEach(el => {
            const allValueLanguages = [Object.values(el.name).join('')];
            languagesArray.push(...allValueLanguages);
        });
        const languagesInCountry = languagesArray.join(', ');

        const markupOneCountry =
            `<ul><li class="country-row"><img src="${flags.svg}" alt="${name}" width="60" height="50">
            <span class="font-country-info">${name}</span></li>           
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${languagesInCountry}</p></ul>`;

        countryInfo.insertAdjacentHTML('beforeend', markupOneCountry);
    });
}

function cleanDocument() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}