# Blogs API!

#### Essa aplicação fornece uma interface e um banco de dados para a produção de conteúdos em um ambiente de blog.
---

## Tecnologias

Esse projeto foi uma oportunidade de consolidar habilidades em:

- **Node.js** com Express
- **Sequelize** ORM
- HTTP Status
- Testes unitários com **Mocha**, **Chai** e **Sinon**
  
---
## Rodando a aplicação

  1. Inicie instalando as dependências
`npm install`


2. Para o uso com Docker, rode os serviços com `docker-compose up -d --build`
   - E então instale as dependências

3. Configure as variáveis de ambiente, especialmente a porta para utilização do banco de dados

---

## Diagrama Entidade Relacionamento

![Diagrama do banco de dados](/utils/der.png)

---
## Rotas

A aplicação dá suporte para as rotas 
[`/user`](/src/routes/userRouter.js), 
[`/categories`](/src/routes/categoryRouter.js) e 
[`/post`](src/routes/postRouter.js)



![Imagem com as rotas](/utils/methods.png)
