# Para iniciar o desenvolvimento precisei das seguintes etapas:
- Tive que instalar o node.
- Após concluir a instalação abri o projeto no VisualStudio e com o atalho control + ' (aspas simples) abri o terminal.
- Executei o comando "node -v" para saber se o node foi instalado corretamente.
- Executei o comando npm init -y onde foram inseridas as configurações no meu arquivo package.json
- Executei o comando npm install bootstrap@5.3.3
- Executei o comando npm install live-server --save-dev
- E por fim para executar o projeto executei o comando: npm start

Observação: Para quem for baixar o projeto, os arquivos do node já estão presentes. Então só será necessário instalar no node.js no seu computador e em seguida executar o comando no console do Visual Code:
``` npm install ```
``` npm start ```

### Para comparação meu arquivo package.json ficou da seguinte forma:
```
{
  "dependencies": {
    "bootstrap": "^5.3.3"
  },
  "name": "financaspaisefilhos",
  "version": "1.0.0",
  "main": "index.js",
  "devDependencies": {
    "live-server": "^1.2.2"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "live-server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}

```

# Para iniciar o banco de dados precisei das seguintes etapas:
- Tive que instalar o SQL Management Studio.
- Tive que instalar o SQL Express Edition.
  - Na instalação do SQL Express, é preciso escolher a opção __"Baixar Mídia"__
  - Em seguida, escolher a opção LocalDB
- Para verificar se a instalação foi feita com sucesso, executar o seguinte comando no cmd.
  ``` sqllocaldb i ```
  - Se a instalação foi feita com sucesso, o retorno será: "MSSQLLocalDB"
  - Em seguida, é preciso criar a base de dados com o comando:
  ``` sqllocaldb create FinancasPeFDb ```

## Testando a criação da instância do banco de dados SQL.
Ao abrir o SQL Management Studio, usar as opções para se conectar na base criada.
- Tipo do servidor: Mecanismo de Banco de Dados
- Nome do servidor: (localdb)\FinancasPeFDb
- Autenticação: Autenticação do Windows

### Após a conexão funcionar, é preciso criar a base:
- Clicar com o botão direito na pasta "Banco de Dados"
- Escolher a opção "Novo Banco de Dados"
- Escrever "FinancasPeFDb" e clicar no OK
- Clicar com o botão direito no banco de dados criado na guia "Pesquisador de Objetos"
- Escolher a opção "Nova consulta"

### Abaixo os scripts para criação das tabelas no banco de dados.
```
CREATE TABLE Tag (
    IdTag int NOT NULL PRIMARY KEY,
    Descricao varchar(60)
);

CREATE TABLE Publicacao (
    IdPublicacao int NOT NULL PRIMARY KEY,
    UsuarioCadastro varchar(60) NOT NULL,
    DataCadastro datetime NOT NULL,
    IdTag int NOT NULL,
    TituloPublicacao varchar(80) NOT NULL,
    ConteudoPublicacao varchar(MAX),
    CurtidasPublicacao int,
    CONSTRAINT FK_Publicacao_Tag FOREIGN KEY (IdTag) REFERENCES Tag(IdTag)
);

CREATE TABLE Forum (
    IdForum int NOT NULL PRIMARY KEY,
    UsuarioCadastro varchar(60) NOT NULL,
    DataCadastro datetime NOT NULL,
    IdTag int NOT NULL,
    TituloForum varchar(80) NOT NULL,
    ConteudoForum varchar(MAX),
    CurtidasForum int,
    CONSTRAINT FK_Forum_Tag FOREIGN KEY (IdTag) REFERENCES Tag(IdTag)
);

CREATE TABLE RespostaForum (
    IdRespostaForum int NOT NULL PRIMARY KEY,
    IdForum int NOT NULL,
    UsuarioCadastro varchar(60) NOT NULL,
    ConteudoResposta varchar(MAX) NOT NULL,
    CurtidasRespostaForum int,
    CONSTRAINT FK_RespostaForum_Forum FOREIGN KEY (IdForum) REFERENCES Forum(IdForum)
);

CREATE TABLE UsuarioNewslatter (
    idUsuarioNewslatter INT PRIMARY KEY,
    emailUsuario VARCHAR(60),
    situacao TINYINT,
    dataCadastro DATETIME,
);

INSERT INTO Tag (IdTag,Descricao)
VALUES (1, 'Descricao teste')
```

# Para iniciar o backend
- É preciso fazer clone do outro projeto que também está no meu repositório no Visual Studio 17.20.
[FinancasPeFApi](https://github.com/rafaelaromanoo/FinancasPeFApi)
- É preciso instalar o pacote .NET 8