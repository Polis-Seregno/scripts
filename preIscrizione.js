//Pre Iscrizione
function decodeAndSubmitForm() {
       const form = document.getElementById("form");
       form.action = atob("aHR0cHM6Ly93ZWJ0by5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuV2ViVG9MZWFkP2VuY29kaW5nPVVURi04Jm9yZ0lkPTAwRDA2MDAwMDAxYTlDOA==");
       return true;
}

function getQueryParams() {
       let params = {};
       let queryString = window.location.search.substring(1);
       let regex = /([^&=]+)=([^&]*)/g;
       let match;

       while (match = regex.exec(queryString)) {
           params[decodeURIComponent(match[1])] = decodeURIComponent(match[2].replace(/\+/g, " "));
       }
       return params;
}

function fillForm() {
       let params = getQueryParams();
       for (let key in params) {
           let element = document.getElementsByName(key)[0];
           if (element) {
               element.value = params[key];
           }
       }
}

function UpperCase(){
   //Codice fiscale atleta UpperCase
    const cfInput = document.querySelector('[id="00NR2000002BNL7"]');
    cfInput.value = cfInput.value.toUpperCase();

   //Iniziale Nome Maiuscola
    const name = document.querySelector("#first_name");
    name.value = name.value.split(' ').map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

   //Iniziale Cognome Maiuscola
    const surname = document.querySelector("#last_name");
    surname.value = surname.value.split(' ').map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function openFromEmail(){

    const campi = ["last_name", "00NR2000002BNL7","first_name"];

    if (document.querySelector('#openemail').value === "true") {
        campi.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.readOnly = true;
                el.classList.add("readonly-style");
            }
        });
    }
}

function checkEmailsMatch() {
    const email = document.querySelector("#email");
    const confirmEmail = document.querySelector("#confirmEmail");
    const message = document.querySelector("#errorMessage");
    const confirmBtn = document.querySelector("#confirmbtn");
    const noConfirmBtn = document.querySelector("#noconfirmbtn");

    if (email.value.toLowerCase() === confirmEmail.value.toLowerCase()) {
        message.innerHTML = "";
        confirmBtn.disabled = false;
        noConfirmBtn.disabled = false;
        return true;
    } else {
        message.innerHTML = "<span id=\"colored\">Le email inserite non coincidono!</span>";
        confirmBtn.disabled = true;
        noConfirmBtn.disabled = true;
        return false;
    }
}
const emailInput = document.querySelector("#email");
emailInput.addEventListener("change", checkEmailsMatch);
/*emailInput.addEventListener("input", checkEmailsMatch);*/

const confirmEmailInput = document.querySelector("#confirmEmail");
confirmEmailInput.addEventListener("change", checkEmailsMatch);
/*confirmEmailInputaddEventListener("input", checkEmailsMatch);*/

const confirmBtn = document.querySelector("#confirmbtn");
const noConfirmBtn = document.querySelector("#noconfirmbtn");

confirmBtn.addEventListener('click', function() {
    document.querySelector('[id="00NR2000008wjBR"]').value = "Confirmed";
    sendForm();
});

noConfirmBtn.addEventListener('click', function() {
    document.querySelector('[id="00NR2000008wjBR"]').value = "Refused";
    sendForm();
});

function sendForm() {
    UpperCase();
    const emailsMatch = checkEmailsMatch();

    if (emailsMatch) {
        decodeAndSubmitForm();
        document.querySelector("#form").submit();
    }
}

document.addEventListener('DOMContentLoaded', function() {
  fillForm();
  openFromEmail();
});
