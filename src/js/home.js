async function carregarPublicacoesDaAPI() {
    try {
        const response = await fetch('https://localhost:7248/api/Publicacao/ListarPublicacoes');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ocorreu um erro ao carregar as publicações:', error);
        return [];
    }
}

// Função para listar as publicações
async function ListarPublicacoes(descricaoTag = null) {
    try {
        const listaPublicacoes = document.getElementById("lista-publicacoes");
        const publicacoes = await carregarPublicacoesDaAPI();

        // Limpar lista atual
        listaPublicacoes.innerHTML = '';

        publicacoes.sort((a, b) => parseDateString(b.dataCadastro) - parseDateString(a.dataCadastro));

        publicacoes.forEach(publicacao => {
            if (publicacao.descricaoTag === descricaoTag || descricaoTag === 'Todos' || descricaoTag === null ) {
                const itemLista = document.createElement("li");
                itemLista.className = "list-group-item";
                itemLista.id = `publicacao-${publicacao.idPublicacao}`;
                itemLista.innerHTML = `
                <p class="data-publicacao">${publicacao.dataCadastro}</p>
                <div class="tag-publicacao">${publicacao.descricaoTag}</div>
                <h5 class="card-title">${publicacao.tituloPublicacao}</h5>
                <p class="card-text">${publicacao.conteudoPublicacao}</p>
                <div class="curtidas-publicacao">${publicacao.curtidasPublicacao} curtidas</div>
                <button class="botao-curtir">Curtir</button>
            `;

                const botaoCurtir = itemLista.querySelector('.botao-curtir');
                botaoCurtir.addEventListener('click', () => {
                    onClickCurtir(publicacao);
                });

                listaPublicacoes.appendChild(itemLista);
            }
        });

        if (listaPublicacoes.innerHTML === '') {
            listaPublicacoes.innerHTML = `<p class="sem-resultados-filtro">Sem publicações para o filtro selecionado. Por favor, selecione outro filtro.</p>`
        }
    } catch (error) {
        console.error('Ocorreu um erro ao adicionar as publicações:', error);
    }
}

// Função para enviar curtidas para a API
async function onClickCurtir(publicacao) {
    try {
        const response = await fetch(`https://localhost:7248/api/Publicacao/CurtirPublicacao?idPublicacao=${publicacao.idPublicacao}`, {
            method: 'POST'
        });

        if (response.ok) {
            const updatedCurtidas = await response.json();

            // Atualiza o elemento de curtidas na interface do usuário
            const itemLista = document.querySelector(`#publicacao-${publicacao.idPublicacao}`);
            const curtidasElement = itemLista.querySelector('.curtidas-publicacao');
            curtidasElement.textContent = `${updatedCurtidas.curtidasPublicacao} curtidas`;
        } else {
            console.error('Falha ao curtir a publicação:', response.statusText);
        }
    } catch (error) {
        console.error('Ocorreu um erro ao enviar a curtida:', error);
    }
}

// Função para corrigir formato da data padrão PT-BR
function parseDateString(dateString) {
    const [day, month, yearAndTime] = dateString.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hour, minute, second] = time.split(':');
    return new Date(year, month - 1, day, hour, minute, second);
}

// Carrega a tela e reenvia para funcao caso tenha click no filtro de tag
document.addEventListener("DOMContentLoaded", () => {
    ListarPublicacoes();
    const tags = document.querySelectorAll('.nav-link');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const descricaoTag = tag.dataset.tag; // Captura a descrição da tag
            ListarPublicacoes(descricaoTag);
        });
    });
});
