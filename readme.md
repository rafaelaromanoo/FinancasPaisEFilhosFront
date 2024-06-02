# Para iniciar o desenvolvimento precisei das seguintes etapas:
- Tive que instalar o node.
- Após concluir a instalação abri o projeto no VisualStudio e com o atalho control + ' (aspas simples) abri o terminal.
- Executei o comando "node -v" para saber se o node foi instalado corretamente.
- Executei o comando npm init -y onde foram inseridas as configurações no meu arquivo package.json
- Executei o comando npm install bootstrap@5.3.3
- Executei o comando npm install live-server --save-dev
- E por fim para executar o projeto executei o comando: npm start

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
