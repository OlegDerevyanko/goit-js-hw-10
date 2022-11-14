const url = "https://restcountries.com/v2/name/";
const field = "?fields=name,capital,population,flags,languages";

export const fetchCountries = inputValue => {
    return fetch(`${ url }${ inputValue }${ field }`)
        .then(response => {
            return response.json();
        }).catch(error => {
            console.log(error);
        })
}