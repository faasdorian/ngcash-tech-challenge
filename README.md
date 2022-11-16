# ngcash-tech-challenge

## Desafio
Estruturar uma aplicação back-end, dockerizada, cujo objetivo seja possibilitar que usuários da NG consigam realizar transferências internas entre si.

#
## Pacotes utilizados
- Express (https://expressjs.com/)
- TypeORM (https://typeorm.io/#/)
- JWT (https://jwt.io/)
- Bcrypt (https://www.npmjs.com/package/bcrypt)

#
## Configurar o ambiente
```
npm install
```
Gerar private key (private-key.pem) para assinar o token JWT
```
openssl genrsa -out private-key.pem 2048
```
Gerar public key (public-key.pem) para validar o token JWT
```
openssl rsa -in private-key.pem -pubout -out public-key.pem
```
Iniciar o banco de dados local
```
  docker run --name postgres-db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -e POSTGRES_DB=db -p 5432:5432 -d postgres
```
Definir as variáveis de ambiente (.env)
```
JWT_SECRET=secret
DB_USERNAME=root
DB_PASSWORD=pass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db
```

#
## Iniciar o projeto
```
npm start
```
#
## Estrutura de dados
![Alt text](./diagram.png?raw=true "Estrutura de dados")

#
## Rotas
### Auth
- POST /auth/register
  ```
  {
    "username": "string",
    "password": "string"
  }
  ```
- POST /auth/login
  ```
  {
    "username": "string",
    "password": "string"
  }
  ```

#
## Happy Coding! :heart:
![Alt text](https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif)