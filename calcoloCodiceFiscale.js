export async function calcoloCodiceFiscale(nome,cognome,dataNascita,sesso,luogoNascita){
       let cf;

        function getCodiceCognome(cognome) {
            cognome = cognome.toUpperCase();
            const vocali = ['A', 'E', 'I', 'O', 'U'];
            const lettere = [...cognome].filter(c => /[A-Z]/.test(c));
            const consonanti = lettere.filter(c => !vocali.includes(c));
            const vocaliNelNome = lettere.filter(c => vocali.includes(c));

            let risultato = consonanti.join('');
            if (risultato.length < 3) {
                risultato += vocaliNelNome.join('');
            }
            return (risultato + 'XXX').slice(0, 3);
        }

        function getCodiceNome(nome) {
            nome = nome.toUpperCase();
            const vocali = ['A', 'E', 'I', 'O', 'U'];
            const consonanti = [...nome].filter(c => /[A-Z]/.test(c) && !vocali.includes(c));

            if (consonanti.length > 3) {
                return consonanti[0] + consonanti[2] + consonanti[3];
            } else {
                const tutte = consonanti.concat([...nome].filter(c => vocali.includes(c)));
                return (tutte.join('') + 'XXX').slice(0, 3);
            }
        }

        function getGiornoNascita(sesso, dataNascita) {
            var data = new Date(dataNascita);
            var giornoNascita = data.getDate();
            if(sesso === "F"){
                giornoNascita = data.getDate() + 40;
            } if (sesso == "M") {
                giornoNascita = String(data.getDate()).padStart(2, '0');
            }

            return giornoNascita;
        }

        function getAnnoNascita(dataNascita) {
            var data = new Date(dataNascita);
            var annoNascita = data.getFullYear().toString().substr(-2);

            return annoNascita;
        }

        function getCodiceMese(dataNascita){
            var data = new Date(dataNascita);
            var codici_mesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];
            var mese = codici_mesi[data.getMonth()];

            return mese;
        }

        const codiceComune = await getCodiceComune(luogoNascita);

       var cfProvvisorio = (getCodiceCognome(cognome) + getCodiceNome(nome) + getAnnoNascita(dataNascita) + getCodiceMese(dataNascita) +
           getGiornoNascita(sesso,dataNascita) + codiceComune).toUpperCase();

        function getCodiceControllo(cfProvvisorio){

            const mapCaratteriPari = {
                '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
                'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
                'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
                'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
            };

            const mapCaratteriDispari = {
                '0': 1,  '1': 0,  '2': 5,  '3': 7,  '4': 9,  '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
                'A': 1,  'B': 0,  'C': 5,  'D': 7,  'E': 9,  'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
                'K': 2,  'L': 4,  'M': 18, 'N': 20, 'O': 11, 'P': 3,  'Q': 6,  'R': 8,  'S': 12, 'T': 14,
                'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
            };

            let sommaPari = 0;
            let sommaDispari = 0;

            const codiciControllo = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            for (let i = 0; i < cfProvvisorio.length; i++) {
                let char = cfProvvisorio.charAt(i);
                if(i % 2 == 0){
                    sommaDispari += mapCaratteriDispari[char];
                } else{
                    sommaPari += mapCaratteriPari[char];
                }
            }

            let resto = ((sommaPari + sommaDispari) % 26) ;

            var letteraControllo = codiciControllo[resto];

            return letteraControllo;
        }

       cf = cfProvvisorio + getCodiceControllo(cfProvvisorio);

       return cf;
}

async function getCodiceComune(comuneNascita) {
       try {
           const response = await fetch(atob("aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L2doL0x1Y2FBLXBvbGlzL0ZpbGVVdGlsaXR5QHJlZnMvaGVhZHMvbWFpbi9Db211bmlDb2RpY2VGaXNjYWxlLmpzb24="));
           if (!response.ok) {
               throw new Error('Errore nel recupero del file JSON');
           }
   
           const data = await response.json();
           for (const key in data) {
               if (data[key].denominazione === comuneNascita) {
                   return data[key].codice;
               }
           }
           return " ";
       } catch (error) {
           console.error('Errore:', error);
           return " ";
       }
}