async function carregarForunsDaAPI() {
    try {
        const response = await fetch('https://localhost:7248/api/Forum/ListarForuns');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ocorreu um erro ao carregar os foruns:', error);
        return [];
    }
}

// Função para adicionar os itens da lista de publicações
async function ListarForuns() {
    try {
        const listaForuns = document.getElementById("lista-foruns");
        const foruns = await carregarForunsDaAPI();

        foruns.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));

        foruns.forEach(forum => {
            const itemLista = document.createElement("li");
            itemLista.className = "list-group-item";
            itemLista.id = `forum-${forum.idForum}`;
            itemLista.innerHTML = `
                <p class="data-forum">${forum.dataCadastro}</p>
                <div class="tag-forum">${forum.idTag}</div>
                <h5 class="card-title">${forum.tituloForum}</h5>
                <p class="card-text">${forum.conteudoForum}</p>
                <div class="curtidas-respostas">
                    <div class="curtidas-forum">${forum.curtidasForum} curtidas </div>
                    <div class="respostas-forum">${forum.quantidadeRespostas} respostas</div>
                </div>
                <button class="botao-curtir">Curtir</buttom>
                <button id="botao-responder" class="botao-responder">Responder</buttom>
            `;

            const botaoCurtir = itemLista.querySelector('.botao-curtir');
            botaoCurtir.addEventListener('click', () => {
                onClickCurtir(forum);
            });

            listaForuns.appendChild(itemLista);
        });
    } catch (error) {
        console.error('Ocorreu um erro ao adicionar as publicações:', error);
    }
}

// Função para enviar curtidas para a API
async function onClickCurtir(forum) {
    try {
        const response = await fetch(`https://localhost:7248/api/Forum/CurtirForum?idForum=${forum.idForum}`, {
            method: 'POST'
        });

        if (response.ok) {
            const updatedCurtidas = await response.json();

            // Atualize o elemento de curtidas na interface do usuário
            const itemLista = document.querySelector(`#forum-${forum.idForum}`);
            const curtidasElement = itemLista.querySelector('.curtidas-forum');
            curtidasElement.textContent = `${updatedCurtidas.curtidasForum} curtidas`;
        } else {
            console.error('Falha ao curtir o fórum:', response.statusText);
        }
    } catch (error) {
        console.error('Ocorreu um erro ao enviar a curtida:', error);
    }
}

// Lógica que abre o modal ao clicar no botão Adicionar interação (Para criar um novo forum)
$(function () {
    $('#adicionar-forum').on('click', function () {
        console.log("Botão adicionar fórum clicado");
        $('#modal-container').load('/src/pages/modalForum.html', function (response, status, xhr) {
            console.log("Status do carregamento do modal:", status);
            if (status == "success") {
                console.log("Modal carregado com sucesso");
                $('#modalAdicionarForum').modal('show');
            } else {
                console.error("Erro ao carregar o modal:", xhr.status, xhr.statusText, response);
            }
        });
    });
});

// Lógica que abre o modal ao clicar no botão Responder (Para criar nova resposta ao forum)
$(document).on('click', '.botao-responder', function () {
    const idForum = $(this).closest('li').attr('id').split('-')[1]; // Obter o idForum do item da lista

    console.log("Botão responder fórum clicado");
    $('#modal-container').load('/src/pages/modalRespostaForum.html', function (response, status, xhr) {
        console.log("Status do carregamento do modal:", status);
        if (status == "success") {
            console.log("Modal carregado com sucesso");
            $('#modalResponderForum').modal('show');

            // Carregar as respostas do forum no modal
            carregarRespostasForum(idForum);
        } else {
            console.error("Erro ao carregar o modal:", xhr.status, xhr.statusText, response);
        }
    });
});

// Função para buscar as respostas do forum e preencher o modal
async function carregarRespostasForum(idForum) {
    try {
        const response = await fetch(`https://localhost:7248/api/RespostaForum/ListarRespostaForum/${idForum}`);
        const respostas = await response.json();
        const listaRespostas = document.getElementById("lista-respostas");

        // Limpar a lista de respostas existente
        listaRespostas.innerHTML = '';

        // Adicionar as respostas ao modal
        respostas.forEach(resposta => {
            const itemLista = document.createElement("li");
            itemLista.className = "list-group-item";
            itemLista.innerHTML = `
                <p class="usuario-resposta"><strong>${resposta.usuarioCadastro}:</strong></p>
                <p class="conteudo-resposta">${resposta.conteudoResposta}</p>
            `;
            listaRespostas.appendChild(itemLista);
        });
    } catch (error) {
        console.error('Ocorreu um erro ao carregar as respostas do fórum:', error);
    }
}



// Chamando a função para adicionar as publicações quando a página carregar
document.addEventListener("DOMContentLoaded", ListarForuns);
