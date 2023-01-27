import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const countries = inputEl.value.trim();
  if (countries === '') {
    dataOutputInfo('');
    dataOutputLi('');
    return;
  }

  fetchCountries(countries)
    .then(countries => {
      renderResult(countries);
    })
    .catch(onError);
}

function renderResult(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (countries.length < 10 && countries.length > 2) {
    dataOutputInfo('');
    let markupList = countries
      .map(country => createListCoutry(country))
      .join('');

    return dataOutputLi(markupList);
  }
  if (countries.length === 1) {
    dataOutputLi('');

    const markupInfo = countries.map(country => createMurkup(country)).join('');
    return dataOutputInfo(markupInfo);
  }
}

function createListCoutry(country) {
  const {
    name: { common },
    flags: { svg },
  } = country;
  return `
  <li class="coutry-item">
  <img src="${svg}" alt="flag" class="coutry-flag" >
  <h2 class="coutry-name">${common}</h2>
  </li>`;
}

function createMurkup(country) {
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;
  return `
  <img src="${svg}" alt="flag" class="coutry-flag" >
  <h1 class="coutry-name">${official}</h1>
  <p class="coutry-text"><b>Capital:</b> ${capital}</p>
  <p class="coutry-text"><b>Population:</b> ${population}</p>
  <p class="coutry-text"><b>Languages:</b> ${Object.values(languages).join(
    ', '
  )}</p>`;
}

function dataOutputLi(markup) {
  countryListEl.innerHTML = markup;
}

function dataOutputInfo(markup) {
  countryInfoEl.innerHTML = markup;
}

function onError() {
  dataOutputInfo('');
  dataOutputLi('');
  Notify.failure('Oops, there is no country with that name');
}
