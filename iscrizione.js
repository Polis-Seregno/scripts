import { calcoloCodiceFiscale } from './calcoloCodiceFiscale.js';

function decodeAndSubmitForm() {
    const form = document.querySelector("#form");
    form.action = atob("aHR0cHM6Ly93ZWJ0by5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuV2ViVG9MZWFkP2VuY29kaW5nPVVURi04Jm9yZ0lkPTAwRDA2MDAwMDAxYTlDOA==");
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
        let value = params[key];

        const element = document.getElementsByName(key)[0];
        if (!element) continue;

        if (key === "datanascita" && value.includes("/")) {
            const [day, month, year] = value.split("/");
            value = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }

        element.value = value;
    }
}

function UpperCase() {
    const cfInput = document.querySelector("#codfisc");
    cfInput.value = cfInput.value.toUpperCase();

    const cinumber = document.querySelector('[id="00NR2000002J3x7"]');
    cinumber.value = cinumber.value.toUpperCase();

    const name = document.querySelector("#first_name");
    name.value = capitalizeWords(name.value);

    const surname = document.querySelector("#last_name");
    surname.value = capitalizeWords(surname.value);

    const parentA = document.querySelector('[id="00NR2000009cmHl"]');
    if (parentA && parentA.value.trim() !== "") {
        parentA.value = capitalizeWords(parentA.value);
    }

    const parentB = document.querySelector('[id="00NR2000009cmJN"]');
    if (parentB && parentB.value.trim() !== "") {
        parentB.value = capitalizeWords(parentB.value);
    }

    const email = document.querySelector("#email");
    email.value = email.value.toLowerCase();

}

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

async function fetchComuniData() {
    const url = atob("aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL1BvbGlzLVNlcmVnbm8vSlNPTnNAcmVmcy9oZWFkcy9tYWluL2NvbXVuaUlULmpzb24=");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Errore nel recupero del file JSON");
    return await response.json();
}

async function fetchComuniCF() {
    const url = atob("aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL1BvbGlzLVNlcmVnbm8vSlNPTnNAcmVmcy9oZWFkcy9tYWluL2NvbXVuaUNGLmpzb24=");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Errore nel recupero del file JSON");
    return await response.json();
}

async function populateListComuniCF() {
    try {
        const data = await fetchComuniCF();
        const datalist = document.querySelector("#listacomunicf");
        const codiciAggiunti = new Set();

        for (const comune of Object.values(data)) {
            if (!codiciAggiunti.has(comune.codice)) {
                codiciAggiunti.add(comune.codice);
                const option = document.createElement('option');
                option.value = comune.denominazione;
                datalist.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Errore:', error);
    }
}

async function populateListComuni() {
    try {
        const data = await fetchComuniData();
        const datalist = document.querySelector("#listacomuni");
        const codiciAggiunti = new Set();

        for (const comune of Object.values(data)) {
            if (!codiciAggiunti.has(comune.codice)) {
                codiciAggiunti.add(comune.codice);
                const option = document.createElement('option');
                option.value = comune.denominazione;
                datalist.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Errore:', error);
    }
}

async function populateListProvincie() {
    try {
        const data = await fetchComuniData();
        const datalist = document.querySelector('#listaprovincie');
        const sigleSet = new Set(Object.values(data).map(comune => comune.sigla_provincia));

        Array.from(sigleSet).sort().forEach(sigla => {
            const option = document.createElement('option');
            option.value = sigla;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error('Errore:', error);
    }
}

function openFromEmail() {

    const campi = ["first_name", "last_name", "datanascita", "birthplace", "selectsesso", "codfisc", "00NR2000001zEBx", "00NR2000009cmHl", "00NR200000EN50X", "calcolacf"];

    if (document.querySelector('#openemail').value === "true") {
        campi.forEach(id => {
            const el = document.getElementById(id);

            if (!el) return;

            const tag = el.type;

            if (tag === "select" || tag === "button" || el.type === "button" || el.type === "submit" || el.type === "reset") {
                el.disabled = true;
            } else {
                el.readOnly = true;
            }

            el.classList.add("readonly-style");
        });
    }
}

async function calcolaCodiceFiscaleHandler() {
    const inputcf = document.querySelector("#codfisc");
    inputcf.value = "";
    const nome = document.querySelector("#first_name").value.toUpperCase();
    const cognome = document.querySelector("#last_name").value.toUpperCase();
    const luogoNascita = document.querySelector("#birthplace").value;
    const dataNascita = document.querySelector("#datanascita").value;
    const sesso = document.querySelector("#selectsesso").value;

    if (nome && cognome && luogoNascita && sesso && dataNascita) {
        let cf = await calcoloCodiceFiscale(nome, cognome, dataNascita, sesso, luogoNascita);
        if (cf.includes("undefined")) {
            inputcf.value = "Comune errato!";
            inputcf.style.color = "red";
        } else {
            inputcf.value = cf;
            inputcf.style.color = "black";
        }
    } else {
        inputcf.value = "Errore, uno o più dati mancanti";
        inputcf.style.color = "red";
    }
}

document.querySelector("#calcolacf").addEventListener("click", calcolaCodiceFiscaleHandler);

document.querySelector("#city").addEventListener("change", async function () {
    const comuneNome = this.value;
    const capfield = document.querySelector("#zip");
    const provinciafield = document.querySelector("#state");
    try {
        const data = await fetchComuniData();
        for (const comune of Object.values(data)) {
            if (comune.denominazione === comuneNome) {
                capfield.value = comune.cap;
                provinciafield.value = comune.sigla_provincia;
                break;
            }
        }
    } catch (error) {
        console.error('Errore:', error);
    }
});

document.querySelector('#datanascita').addEventListener('change', function () {
    const dataNascita = this.value;
    const divgenitore = document.querySelector("#dati_genitore");

    if (!isMaggiorenne(dataNascita)) {
        divgenitore.innerHTML = `
            <hr>
            <h2 id="sectionheader">Dati dei Genitori</h2>
            <span>È necessario inserire almeno il nome di uno dei due genitori<span><br>
                <div class="row">
                       <div class="col-md-6">
                              <label for="00NR2000009cmHl">Nome e cognome genitore A o rappresentante legale<span id="colored">*</span></label>
                              <input id="00NR2000009cmHl" maxlength="255" name="00NR2000009cmHl" size="20" type="text" required class="form-control"><br>
                       </div>
                       <div class="col-md-6">
                              <label for="00NR2000009cmJN">Nome e cognome genitore B o rappresentante legale</label>
                              <input id="00NR2000009cmJN" maxlength="255" name="00NR2000009cmJN" size="20" type="text" class="form-control"><br>
                       </div>
                </div>`;
    } else {
        divgenitore.innerHTML = "";
    }
});

function isMaggiorenne(birthDate) {
    const oggi = new Date();
    const nascita = new Date(birthDate);
    let age = oggi.getFullYear() - nascita.getFullYear();
    const monthDiff = oggi.getMonth() - nascita.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && oggi.getDate() < nascita.getDate())) {
        age--;
    }
    return age >= 18;
}

function dateFormatter(idInputDate, idCampoHidden) {
    const inputDate = document.querySelector(idInputDate);
    const campoHidden = document.querySelector(idCampoHidden);
    if (!inputDate || !campoHidden) return;

    const date = new Date(inputDate.value);
    const month = date.getMonth()+1;
    if (!date) return;

    const dataFormattata = date.getDate().toString() + "/" + month.toString() + "/" + date.getFullYear().toString();

    campoHidden.value = dataFormattata;
    console.log(dataFormattata)
}


function checkEmailsMatch() {
    const email = document.querySelector("#email");
    const confirmEmail = document.querySelector("#confirmEmail");
    const message = document.querySelector("#errorMessage");
    const submitBtn = document.querySelector("#invia");

    const match = email.value.toLowerCase() === confirmEmail.value.toLowerCase();
    message.innerHTML = match ? "" : "<span id=\"colored\">Le email inserite non coincidono!</span>";
    submitBtn.disabled = !match;
    return match;
}

document.querySelector("#email").addEventListener("input", checkEmailsMatch);
document.querySelector("#confirmEmail").addEventListener("input", checkEmailsMatch);

function sendForm(event) {
    event.preventDefault();
    UpperCase();

    dateFormatter("#datanascita",'[id="00NR2000002BNrN"]');
    dateFormatter("#docexpdate",'[id="00NR2000002J41x"]');

    if (checkEmailsMatch()) {
        decodeAndSubmitForm();
    }
}

document.querySelector("#form").addEventListener("submit", sendForm);

document.addEventListener("DOMContentLoaded", () => {
    fillForm();
    openFromEmail();
    populateListComuniCF();
    populateListComuni();
    populateListProvincie();
});
