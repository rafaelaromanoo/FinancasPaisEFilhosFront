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

// Função para enviar a requisição de curtida para a API
async function onClickCurtir(publicacao) {
    try {
        const response = await fetch(`https://localhost:7248/api/Publicacao/CurtirPublicacao?idPublicacao=${publicacao.idPublicacao}`, {
            method: 'POST'
        });

        if (response.ok) {
            // Supondo que a API retorne a contagem atualizada de curtidas
            const updatedCurtidas = await response.json();

            // Atualize o elemento de curtidas na interface do usuário
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

// Função para adicionar os itens da lista de publicações
async function listarPublicacoes() {
    const listaPublicacoes = document.getElementById("lista-publicacoes");

    try {
        const publicacoes = await carregarPublicacoesDaAPI();

        publicacoes.forEach(publicacao => {
            const itemLista = document.createElement("li");
            itemLista.className = "list-group-item";
            itemLista.id = `publicacao-${publicacao.idPublicacao}`;
            itemLista.innerHTML = `
                <p class="data-publicacao">${publicacao.dataCadastro}</p>
                <div class="tag-publicacao">${publicacao.idTag}</div>
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
        });
    } catch (error) {
        console.error('Ocorreu um erro ao adicionar as publicações:', error);
    }
}

// Chamando a função para adicionar as publicações quando a página carregar
document.addEventListener("DOMContentLoaded", listarPublicacoes);
