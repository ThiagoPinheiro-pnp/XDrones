# 🚁 XDRONES: Plataforma E-commerce de Drones Profissionais

## 🚀 Visão Geral do Projeto

O **XDrones** é uma solução de e-commerce completa, desenvolvida como um projeto educacional, focada na venda e gestão de drones profissionais (Agricultura, Indústria e Segurança). O projeto segue o padrão *Client-Server*, utilizando **ASP.NET Core (C#)** para o Backend API e **HTML/CSS/JavaScript puro** para o Frontend.

O foco principal do desenvolvimento foi a implementação de um sistema de autenticação robusto e uma forte camada de regras de negócio (*Business Layer*) para garantir a integridade dos dados e a segurança do usuário.

## 👥 Membros da Equipe

Este projeto foi desenvolvido por:

* **Thiago Pinheiro dos Santos**
* **Matheus da Silva Salgado Veiga**
* **Rennan Miranda Rodrigues Gonçalves dos Santos Leite**
* **João Victor de Oliveira Macedo**
* **Roniel Santana Faria**

## ⚙️ Tecnologias Utilizadas

| Camada | Tecnologia | Componentes Principais |
| :--- | :--- | :--- |
| **Backend (API)** | ASP.NET Core 7/8 (C#) | Controllers (API REST), Entity Framework Core (ORM) |
| **Banco de Dados** | **MySQL** | Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) |
| **Segurança** | **JWT (JSON Web Tokens)** | Autenticação baseada em tokens. |
| **Criptografia** | **BCrypt** | Hashing de senhas para garantir segurança e impedir visualização. |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Consumo da API via `fetch`, lógica de carrinho (LocalStorage), UI responsiva. |

## 🔒 Destaques de Segurança e Regras de Negócio

O projeto XDrones foi construído com uma ênfase particular na segurança e na validação rigorosa dos dados, utilizando uma forte Camada de Negócios (BLL - Business Logic Layer) no Backend.

### 1. Autenticação e Autorização Segura

* **Implementação de JWT (JSON Web Tokens):** Após o login, a API emite um token que é usado para autenticar todas as requisições subsequentes.
* **Criptografia BCrypt:** Todas as senhas de usuários são armazenadas no banco de dados utilizando a biblioteca BCrypt.

### 2. Camada de Negócios (Validação Rigorosa)

A validação rigorosa dos dados é aplicada antes do armazenamento, garantindo a qualidade e integridade do sistema:

* **Validação de Senhas Fortes:** O cadastro exige senhas com **no mínimo 8 caracteres**, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
* **Validação de E-mail:** Verificação de formato de e-mail válido para evitar cadastros inválidos.
* **Validação de CPF:** Verificação da validade estrutural do CPF, incluindo o cálculo do dígito verificador.

## 🗺️ Estrutura da API REST

A API expõe os seguintes *endpoints* essenciais para a gestão dos dados da plataforma:

| Módulo | Endpoint Base | Método | Descrição |
| :--- | :--- | :--- | :--- |
| **Autenticação** | `/api/Auth/register` | `POST` | Cria um novo usuário (com validações de negócio). |
| **Autenticação** | `/api/Auth/login` | `POST` | Autentica o usuário e retorna o JWT. |
| **Produtos** | `/api/Produtos` | `GET` | Lista todos os drones disponíveis na loja. |
| **Pedidos** | `/api/Pedidos` | `POST` | Finaliza uma compra, registrando o pedido no banco. **(Requer JWT)** |
| **Pedidos** | `/api/Pedidos/usuario/{id}` | `GET` | Lista os pedidos de um usuário específico. **(Requer JWT)** |

## 🛠️ Como Executar o Projeto

### Requisitos

* .NET SDK (Versão 7 ou superior)
* Servidor **MySQL** (com *connection string* configurada no `appsettings.json` do Backend).
* Node.js (Opcional, para executar o Front-end via Live Server).

### Backend (API C#)

1.  Navegue até a pasta `Backend`.
2.  **Configuração do Banco:** Certifique-se de que a *connection string* do MySQL está correta em `appsettings.json`.
3.  **Criação das Tabelas:** Rode o script SQL que recria o banco de dados e insere dados iniciais (usuários, produtos e pedidos).
4.  **Executar:**
    ```bash
    dotnet run
    ```
    O servidor será iniciado. O Swagger (documentação da API) pode ser acessado no endereço `/swagger` (ex: `https://localhost:7155/swagger`).

### Frontend (Website HTML/JS)

1.  Navegue até a pasta `FrontEnd`.
2.  Abra o arquivo `index.html` ou use uma extensão como o Live Server (VS Code).
3.  **Ajuste da API:** Verifique e ajuste as constantes `API_URL` nos arquivos JavaScript (`login.js`, `cadastro.js`, `checkout.js`, etc.) para a porta e URL corretas do seu Backend em execução.
