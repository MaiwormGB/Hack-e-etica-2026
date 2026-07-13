const limites = L.latLngBounds(
    [-22.65, -43.40], // sudoeste
    [-22.35, -43.00]  // nordeste
);

let ocorrencias = JSON.parse(localStorage.getItem("ocorrencias")) || [];

const mapa = L.map("map", {
    maxBounds: limites,
    maxBoundsViscosity: 1.0,
    minZoom: 14,
    maxZoom: 18
}).setView([-22.51, -43.18], 13);

const iconeProblema = L.icon({
    iconUrl: "acervo/report-svgrepo-com.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const iconeSolucao = L.icon({
    iconUrl: "acervo/lamp-light-svgrepo-com.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

function carregarOcorrencias(){

    ocorrencias.forEach(item => {

        const icone = item.arquetipo === "Problema"
            ? iconeProblema
            : iconeSolucao;


        const marcador = L.marker(
            [item.latitude, item.longitude],
            {
                icon: icone
            }
        ).addTo(mapa);


        marcador.on("popupopen", function(){

            mapa.flyTo(
                marcador.getLatLng(),
                16
            );

        });


        marcador.bindPopup(`
            <div class="popup-card">

                <h3>${item.titulo}</h3>

                <strong>${item.arquetipo}</strong>

                <p>${item.tipo}</p>

                <p>${item.detalhamento}</p>

                <p>
                    Importância:
                    ${"★".repeat(item.importancia || 0)}
                </p>

            </div>
        `);

    });

}

let posicaoSelecionada = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

const formProblema = {

    "titulo":"Problema",
    "Cateogorias": [
        "Má coleta de lixo",
        "Risco de desabamento",
        "Risco de alagamento",
        "Infraestrutura publica danificada",
        "Criminalidade",
        "Outro"]

}

const formSolucao = {

    "titulo":"Soluçao",
    "Cateogorias": [
        "Area segura",
        "Comercio local",
        "Escola",
        "Lazer",
        "Saude",
        "Outro"]

}

let val = 1;

function mudarForm(){

    if (val === 2){

        val = 1;

    }else{

        val = 2;

    }

    console.log(val)    

    abrirForm()

}

function abrirForm(){

    importancia = 0;

    document.querySelectorAll(".estrelas span")
    .forEach(e => {
    e.classList.remove("ativa");
    });

    const formulario = document.getElementById("formulario");
    const formTitulo = document.getElementById("form_titulo");
    const iconeBtn = document.getElementById("icone_btn");
    const formInput = document.getElementById("form_input");
    const formTipos = document.getElementById("form_tipos");

    formTipos.innerHTML = "";

    if (val === 1){

        document.documentElement.style.setProperty(
            "--cor-form-1",
            "#7a3935"
        );

        document.documentElement.style.setProperty(
            "--cor-form-2",
            "#502927"
        );

        formTitulo.textContent = formProblema.titulo;
        iconeBtn.src = "acervo/lamp-light-svgrepo-com.svg";
        formInput.placeholder = formProblema.titulo;

        formProblema.Cateogorias.forEach(tipo => {
            
            const opcao = document.createElement("option");

            opcao.value = tipo;
            opcao.textContent = tipo;

            formTipos.appendChild(opcao);

        });

    }else if (val === 2){

        document.documentElement.style.setProperty(
            "--cor-form-1",
            "#35757a"
        );

        document.documentElement.style.setProperty(
            "--cor-form-2",
            "#274d50"
        );

        formTitulo.textContent = formSolucao.titulo;
        iconeBtn.src = "acervo/report-svgrepo-com.svg";
        formInput.placeholder = formSolucao.titulo;

        formSolucao.Cateogorias.forEach(tipo => {
            
            const opcao = document.createElement("option");

            opcao.value = tipo;
            opcao.textContent = tipo;

            formTipos.appendChild(opcao);

        });


    }

    formulario.style.display = "flex";


}

function salvar(){

    const novoForm = {

        "titulo":"",
        "arquetipo":"",
        "tipo":"",
        "detalhamento":"",
        "latitude": 0,
        "longitude": 0,
        "importancia":0

    }

    const formTitulo = document.getElementById("form_titulo").textContent
    const formInput = document.getElementById("form_input").value;
    const formTipos = document.getElementById("form_tipos").value;
    const formDetalhamento = document.getElementById("detalhamento").value;

    novoForm.titulo = formInput;
    novoForm.arquetipo = formTitulo
    novoForm.tipo = formTipos;
    novoForm.detalhamento = formDetalhamento;
    novoForm.latitude = posicaoSelecionada.lat;
    novoForm.longitude = posicaoSelecionada.lng;
    novoForm.importancia = importancia;

    const icone = val === 1
        ? iconeProblema
        : iconeSolucao;

    const marcador = L.marker(posicaoSelecionada, {
        icon: icone
    }).addTo(mapa);

    marcador.on("popupopen", function(){

    mapa.flyTo(
        marcador.getLatLng(),
        16
    );

    });

    marcador.bindPopup(`
        <div class="popup-card">

            <h3>${novoForm.titulo}</h3>



            <span class="popup-tipo">
                ${novoForm.arquetipo}
            </span>

            <p>
                ${novoForm.tipo}
            </p>

            <p>
                ${novoForm.detalhamento}
            </p>

            <p>
                Importância:
                ${"★".repeat(novoForm.importancia)}
            </p>

    </div>
`);



    ocorrencias.push(novoForm);

    localStorage.setItem(
    "ocorrencias",
    JSON.stringify(ocorrencias)
);

    
    console.log(ocorrencias);

    document.getElementById("form_input").value = "";
    document.getElementById("form_tipos").selectedIndex = 0;
    document.getElementById("detalhamento").value = "";

    document.getElementById("formulario").style.display = "none";

}

mapa.on("click", function(e){

    posicaoSelecionada = e.latlng;

    abrirForm();    

});


 let  val2 = 1;

function mostrarPesquisa(){

    console.log(val2);

    const pesquisa = document.getElementById("pesquisa");
    const buscar = document.getElementById("buscar");

    if (val2 === 2){

        pesquisa.style.display = "none"
        buscar.style.display = "none"
        val2 = 1;

    }else{

        pesquisa.style.display = "block"
        buscar.style.display = "block"
        val2 = 2;

    }



}


async function buscarLocal(){

    const nome = document.getElementById("pesquisa").value;

    const resposta = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${nome}, Petrópolis, RJ`
    );


    const dados = await resposta.json();


    if(dados.length === 0){

        alert("Local não encontrado");
        return;

    }


    const latitude = dados[0].lat;
    const longitude = dados[0].lon;


    mapa.flyTo(
        [latitude, longitude],
        16,
        {
            duration: 1.5
        }
    );


}

let importancia = 0;

const estrelas = document.querySelectorAll(".estrelas span");

estrelas.forEach(estrela => {

    estrela.addEventListener("click", function(){

        importancia = Number(this.dataset.valor);

        estrelas.forEach(e => {
            e.classList.remove("ativa");
        });

        for(let i = 0; i < importancia; i++){

            estrelas[i].classList.add("ativa");

        }

    });

});

carregarOcorrencias();

function sairForm(){

    const formulario = document.getElementById("formulario");
    formulario.style.display = "none";

}



