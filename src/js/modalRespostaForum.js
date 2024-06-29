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

// Função para adicionar comportamento do botão Salvar resposta no modal
$(function() {
    $(document).off('click', '#btnSalvarResponder').on('click', '#btnSalvarResponder', async function () {
        console.log("Botão salvar resposta clicado");

        const idForum = $('#modalResponderForum').data('idForum');
        const usuarioCadastro = $('#usuarioResponderForum').val();
        const conteudoResposta = $('#conteudoResponderForum').val();

        if (!usuarioCadastro || !conteudoResposta) {
            if (!usuarioCadastro) {
                $('#usuarioResponderForumError').show();
            } else {
                $('#usuarioResponderForumError').hide();
            }

            if (!conteudoResposta) {
                $('#conteudoResponderForumError').show();
            } else {
                $('#conteudoResponderForumError').hide();
            }
            return;
        }

        const resposta = {
            idForum: idForum,
            usuarioCadastro: usuarioCadastro,
            conteudoResposta: conteudoResposta
        };

        try {
            const response = await fetch('https://localhost:7248/api/RespostaForum/AdicionarRespostaForum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resposta)
            });

            if (response.ok) {
                console.log('Resposta salva com sucesso');

                // Recarregar a lista de respostas
                await carregarRespostasForum(idForum);

                // Limpar os campos do formulário
                $('#usuarioResponderForum').val('');
                $('#conteudoResponderForum').val('');

                // Não fechar o modal automaticamente, apenas atualizar os dados
            } else {
                console.error('Erro ao salvar a resposta:', response.statusText);
            }
        } catch (error) {
            console.error('Ocorreu um erro ao salvar a resposta:', error);
        }
    });
});

// Evento acionado quando o modal é fechado
$('#modalResponderForum').on('hidden.bs.modal', function () {
    console.log('Modal fechado');
    location.reload(); // Atualiza a página quando o modal é fechado
});