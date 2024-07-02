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

// Função para listar os fóruns
async function ListarForuns(descricaoTag = null) {
    try {
        const listaForuns = document.getElementById("lista-foruns");
        const foruns = await carregarForunsDaAPI();

        // Limpar lista atual
        listaForuns.innerHTML = '';

        foruns.sort((a, b) => parseDateString(b.dataCadastro) - parseDateString(a.dataCadastro));

        foruns.forEach(forum => {
            if (forum.descricaoTag === descricaoTag || descricaoTag === 'Todos' || descricaoTag === null) {
                const itemLista = document.createElement("li");
                itemLista.className = "list-group-item";
                itemLista.id = `forum-${forum.idForum}`;
                itemLista.innerHTML = `
                    <p class="data-forum">${forum.dataCadastro}</p>
                    <div class="tag-forum">${forum.descricaoTag}</div>
                    <h5 class="card-title">${forum.tituloForum}</h5>
                    <p class="card-text">${forum.conteudoForum}</p>
                    <div class="curtidas-respostas">
                        <div class="curtidas-forum">${forum.curtidasForum} curtidas </div>
                        <div class="respostas-forum">${forum.quantidadeRespostas} respostas</div>
                    </div>
                    <button class="botao-curtir">Curtir</button>
                    <button class="botao-responder">Responder</button>
                `;

                const botaoCurtir = itemLista.querySelector('.botao-curtir');
                botaoCurtir.addEventListener('click', () => {
                    onClickCurtir(forum);
                });

                listaForuns.appendChild(itemLista);
            }
        });

        if (listaForuns.innerHTML === '') {
            listaForuns.innerHTML = `<p class="sem-resultados-filtro">Sem foruns para o filtro selecionado. Por favor, selecione outro filtro.</p>`
        }
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

        $('#modal-container').load('/src/pages/modalForum.html', function (response, status, xhr) {

            if (status == "success") {
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

    $('#modal-container').load('/src/pages/modalRespostaForum.html', function (response, status, xhr) {

        if (status == "success") {
            $('#modalResponderForum').modal('show');

            // Armazenar o idForum no modal
            $('#modalResponderForum').data('idForum', idForum);

            // Carregar as respostas do forum no modal
            carregarRespostasForum(idForum);
        } else {
            console.error("Erro ao carregar o modal:", xhr.status, xhr.statusText, response);
        }
    });
});

// Função para corrigir formato da data padrão PT-BR
function parseDateString(dateString) {
    const [day, month, yearAndTime] = dateString.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hour, minute, second] = time.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
}

// Carrega a tela e reenvia para funcao caso tenha click no filtro de tag
document.addEventListener("DOMContentLoaded", () => {
    ListarForuns();
    const tags = document.querySelectorAll('.nav-link');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const descricaoTag = tag.dataset.tag; // Captura a descrição da tag
            ListarForuns(descricaoTag);
        });
    });
});