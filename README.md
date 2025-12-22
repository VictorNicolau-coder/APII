# LISTA DE TAREFAS

<p align="center">
  <img src="https://github.com/user-attachments/assets/197eb19f-744e-4879-93b7-c5941e01372c" alt="Image">
</p>

## 📁 Estrutura do Projeto

```bash 
├── eslint.config.mjs
├── jest.config.js
├── package.json
├── package-lock.json
├── README.md
├── server.js
├── src
│   ├── app.js
│   ├── controllers
│   │   ├── tasksController.js
│   │   └── tests
│   │       └── tasksController.spec.js
│   ├── middlewares
│   │   └── tasksMiddleware.js
│   ├── models
│   │   ├── connection.js
│   │   ├── taskSchema.js
│   │   └── userSchema.js
│   ├── router.js
│   └── testeAddUser.js
└── vercel.json
```

## 🧭 Rotas da API

Todas as rotas passam pelo middleware global **`validateDay`**, que é aplicado no `app.js` e executado antes de qualquer requisição.  
Esse middleware realiza validações gerais (como controle de data, horário ou restrições de uso).

---

### 📡 Endpoints disponíveis

| Método | Rota           | Middleware(s)                                           | Descrição |
|:-------|:----------------|:--------------------------------------------------------|:-----------|
| `POST` | `/logar`        | `validateDay`                                          | Realiza o login do usuário. |
| `GET`  | `/tasks`        | `validateDay`, `authenticate`                          | Retorna todas as tarefas do usuário. |
| `GET`  | `/task/:id`     | `validateDay`, `authenticate`                          | Retorna uma tarefa específica pelo ID. |
| `POST` | `/tasks`        | `validateDay`, `authenticate`, `validateTitle`         | Cria uma nova tarefa. |
| `DELETE` | `/tasks/:id`  | `validateDay`, `authenticate`                          | Exclui uma tarefa pelo ID. |
| `PUT`  | `/tasks/:id`    | `validateDay`, `authenticate`, `validateTitle`, `validateStatus` | Atualiza uma tarefa existente. |
| `GET`  | `/pdf`          | `validateDay`, `authenticate`                          | Gera um PDF com as tarefas. |

---

### 🧩 Middlewares utilizados
- **`validateDay`** → Middleware global que é executado antes de todas as rotas.  
- **`authenticate`** → Garante que o usuário está autenticado antes de acessar a rota.  
- **`validateTitle`** → Valida se o campo `title` está presente e é válido.  
- **`validateStatus`** → Verifica se o status informado é permitido.

---

### 💡 Exemplo de requisição
```http
GET /tasks HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
```

## 📦 Dependências

Principais pacotes utilizados no projeto:

- **express** → Criação de rotas e servidor HTTP.  
- **mongoose / mongodb** → Conexão e modelagem de dados no MongoDB.  
- **mysql2** → Conexão com banco MySQL.  
- **bcrypt** → Criptografia de senhas.  
- **jsonwebtoken** → Autenticação via JWT.  
- **dotenv** → Variáveis de ambiente.  
- **pdfkit** → Geração de PDFs.  
- **nodemon** → Reinicia o servidor no modo dev.  
- **jest** → Testes automatizados.

**Dev:** eslint, @eslint/js, globals.
