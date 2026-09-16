function decodeAndSubmitForm() {
    const form = document.querySelector("#form");
    form.action = atob("aHR0cHM6Ly93ZWJ0by5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuV2ViVG9DYXNlP2VuY29kaW5nPVVURi04Jm9yZ0lkPTAwRDA2MDAwMDAxYTlDOA==");
    form.submit();
}

function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const regex = /([^&=]+)=([^&]*)/g;
    let match;

    while ((match = regex.exec(queryString))) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2].replace(/\+/g, " "));
    }
    return params;
}

function fillForm() {
    const params = getQueryParams();
    for (const key in params) {
        const element = document.getElementById(key)[0];
        if (element) {
            element.value = params[key];
        }
    }
}

function UpperCase() {
    const cfInput = document.querySelector('[id="00NR2000001vzhJ"]');
    cfInput.value = cfInput.value.toUpperCase();
}

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function sendForm(event) {
    event.preventDefault();
    UpperCase();
    decodeAndSubmitForm();
}

document.querySelector("#form").addEventListener("submit", sendForm);

document.addEventListener("DOMContentLoaded", () => {
    fillForm();
});