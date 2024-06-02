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
    const listaForuns = document.getElementById("lista-foruns");

    try {
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
            <div class="curtidas-forum">${forum.curtidasForum} curtidas&nbsp;&nbsp;&nbsp;${forum.respostasForum} respostas</div>
            <buttom class="botao-curtir">Curtir</buttom>
            <buttom class="botao-responder">Responder</buttom>
            `;

            const botaoCurtir = itemLista.querySelector('.botao-curtir');
            botaoCurtir.addEventListener('click', () => {
                onClickCurtir(forum);
            });
    
            const botaoResponder = itemLista.querySelector('.botao-responder');
            botaoResponder.addEventListener('click', () => {
                onClickResponder(forum);
            });

            listaForuns.appendChild(itemLista);
        });
    } catch (error) {
        console.error('Ocorreu um erro ao adicionar as publicações:', error);
    }
}

// Chamando a função para adicionar as publicações quando a página carregar
document.addEventListener("DOMContentLoaded", ListarForuns);
