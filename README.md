# ngcash-tech-challenge

## Desafio
Estruturar uma aplicação back-end, dockerizada, cujo objetivo seja possibilitar que usuários da NG consigam realizar transferências internas entre si.

## Pacotes utilizados
- Express (https://expressjs.com/)
- TypeORM (https://typeorm.io/#/)
- JWT (https://jwt.io/)
- Bcrypt (https://www.npmjs.com/package/bcrypt)

## Configurar o ambiente
```
npm install
```
Gerar private key (private-key.pem) para assinar o token JWT
```
openssl genrsa -out private-key.pem 2048
```
Iniciar o banco de dados local
```
  docker run --name postgres-db -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -e POSTGRES_DB=db -p 5432:5432 -d postgres
```
Definir as variáveis de ambiente (.env)
```
JWT_SECRET=secret
DB_USERNAME=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=db
```

## Iniciar o projeto
```
npm start
```

## Estrutura de dados
![Alt text](./diagram.png?raw=true "Estrutura de dados")


## Rotas
### Auth
- POST /auth/register
  ```
  {
    "username": "ngfirstuser",
    "password": "S3cretPassw0rd"
  }
  ```
- POST /auth/login
  ```
  {
    "username": "ngfirstuser",
    "password": "S3cretPassw0rd"
  }
  ```

### Account
- GET /account/:accountId/balance
- POST /account/:accountId/transfer
  ```
  {
    "creditedUsername": "ngseconduser",
    "value": 77.7
  }
  ```
- GET /account/:accountId/transactions<br>
  Optional query params:
    - limit: number
    - offset: number
    - createdAt: string (YYYY-MM-DD)
    - type: string (debit, credit)



## Happy Coding! :heart:
![Alt text](https://media.giphy.com/media/Od0QRnzwRBYmDU3eEO/giphy.gif)