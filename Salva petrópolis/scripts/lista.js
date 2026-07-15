let ocorrencias = [];

function carregarLista() {

    const problemas = document.getElementById("problemas");
    const solucoes = document.getElementById("solucoes");

    ocorrencias.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h4>${item.titulo}</h4>

            <strong>${item.tipo}</strong>

            <p>${item.detalhamento}</p>

            <p>${"★".repeat(item.importancia)}</p>
        `;

        card.addEventListener("click", () => {

        const foco = document.querySelector(".foco");

        foco.innerHTML = `
        <h2>${item.titulo}</h2>

        <h3>${item.arquetipo}</h3>

        <h4>${item.tipo}</h4>

        <p>${item.detalhamento}</p>

        <p>${"★".repeat(item.importancia)}</p>
        `;

    });

        if(item.arquetipo === "Problema"){
            problemas.appendChild(card);
        }else{
            solucoes.appendChild(card);
        }

    });

}

async function carregarDados() {

    const resposta = await fetch("../dados/marcadores.json");
    const dadosJson = await resposta.json();

    const dadosSalvos = JSON.parse(
        localStorage.getItem("ocorrencias")
    ) || [];

    ocorrencias = [
        ...dadosJson,
        ...dadosSalvos
    ];

    carregarLista();
}

carregarDados();


function mudarLista(){

    window.location.href = "../index.html";

}