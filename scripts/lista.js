let ocorrencias = [];

function criarGrupos(container, grupos){

    Object.keys(grupos).forEach(bairro => {


        const grupo = document.createElement("div");

        grupo.className = "grupo_bairro";


        grupo.innerHTML = `
            <h3 class="titulo_lista">
                ${bairro}
            </h3>
        `;


        grupos[bairro].forEach(item => {


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


            grupo.appendChild(card);

        });


        container.appendChild(grupo);

    });

}

function carregarLista() {

    const problemas = document.getElementById("problemas");
    const solucoes = document.getElementById("solucoes");


    const problemasAgrupados = agruparPorBairro(
        ocorrencias.filter(item => item.arquetipo === "Problema")
    );

    const solucoesAgrupadas = agruparPorBairro(
        ocorrencias.filter(item => item.arquetipo === "Solução")
    );


    criarGrupos(problemas, problemasAgrupados);
    criarGrupos(solucoes, solucoesAgrupadas);

}

function agruparPorBairro(lista){

    return lista.reduce((grupos, item) => {

        const bairro = item.bairro || "Sem bairro";

        if(!grupos[bairro]){
            grupos[bairro] = [];
        }

        grupos[bairro].push(item);

        return grupos;

    }, {});

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