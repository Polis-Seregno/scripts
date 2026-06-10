//Modulo Contatto
const form = document.querySelector("#form");

function decodeAndSubmitForm() {
    form.action = atob("aHR0cHM6Ly93ZWJ0by5zYWxlc2ZvcmNlLmNvbS9zZXJ2bGV0L3NlcnZsZXQuV2ViVG9DYXNlP2VuY29kaW5nPVVURi04Jm9yZ0lkPTAwRDA2MDAwMDAxYTlDOA==");
    return true;
}

function UpperCase() {
    // Iniziale Nome Maiuscola
    const name = document.querySelector("#name");
    name.value = name.value.split(' ').map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function showFields() {
    let topic = document.querySelector('[id="00NR2000009GySr"]');
    let sportfield = document.querySelector("#sport-anno");
    let cffield = document.querySelector("#cfatletadiv");

    topic.addEventListener("change", () => {
        if (topic.value === "Nuove Iscrizioni" || topic.value === "Open Day") {
            sportfield.innerHTML = `
                <div class="col-md-6">
                    <label for="00NR2000009GyW5">Sport<span class="colored">*</span></label>
                    <select id="00NR2000009GyW5" name="00NR2000009GyW5" required class="form-select" type="select">
                        <option value="">--Seleziona--</option>
                        <option value="PVO">Pallavolo</option>
                        <option value="CA7;CAL">Calcio</option>
                        <option value="PCA">Pallacanestro</option>
                    </select><br>
                </div>
                <div class="col-md-6">
                    <label for="00NR2000009I5k1">Anno Riferimento<span class="colored">*</span></label>
                    <input id="00NR2000009I5k1" name="00NR2000009I5k1" size="20" type="text" class="form-control" maxlength="4" minlength="4" pattern="[0-9]{4}" oninput="this.value = this.value.replace(/[^0-9]/g, '')"/><br>
                </div>`;
            cffield.innerHTML = "";
        } else if (topic.value === "Segreteria") {
            cffield.innerHTML = `
                <div class="col-md-12">
                    <label for="00NR2000001vzhJ">Codice Fiscale ATLETA<span class="colored">*</span></label>
                    <input type="text" name="00NR2000001vzhJ" id="00NR2000001vzhJ" placeholder="Codice fiscale ATLETA" required class="form-control" maxlength="16" pattern="^[A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z]\\d{3}[A-Za-z]$"><br>
                </div>`;
            sportfield.innerHTML = "";
        } else {
            sportfield.innerHTML = "";
            cffield.innerHTML = "";
        }
    });
}

function sendForm(e) {
    e.preventDefault();
    UpperCase();
    decodeAndSubmitForm();
    form.submit();
}

form.addEventListener("submit", sendForm);

document.addEventListener('DOMContentLoaded', showFields);
