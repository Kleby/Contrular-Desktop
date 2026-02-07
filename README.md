# Constrular – Sistema Desktop

Sistema desktop corporativo desenvolvido para a **Constrular**, voltado para
operações internas de consulta e controle, com conexão direta ao **SQL Server**
e suporte a leitura de grandes volumes de dados utilizando **streams**.

A aplicação foi projetada para funcionar de forma estável em ambientes legados,
mantendo compatibilidade com máquinas que ainda utilizam **Windows 7**.

---

## 🎯 Objetivo do projeto

- Centralizar rotinas internas da Constrular
- Realizar consultas eficientes no SQL Server
- Trabalhar com grandes volumes de dados sem sobrecarregar a memória
- Garantir isolamento entre interface e banco de dados
- Manter compatibilidade com o parque de máquinas existente

---

## 🪟 Compatibilidade

Este projeto utiliza **Electron 20.x** de forma intencional.

Essa versão foi escolhida para garantir compatibilidade com:
- Windows 7
- Ambientes corporativos legados
- Máquinas com limitações de atualização do sistema operacional

> Electron 20.x é a última versão estável compatível com Windows 7.

---

## 📦 Tecnologias utilizadas

- Electron `20.x`
- Node.js
- SQL Server
- Biblioteca `mssql`
- Comunicação segura via IPC
- Streams para processamento de dados

---

## 🗂 Estrutura do projeto

CONSTRULAR_LEVAR_RECEBER/
│
├─ backend/
│ ├─ db/ # Conexão e pool do SQL Server
│ ├─ repositories/ # Acesso direto aos dados
│ │ ├─ levarReceber.repository.js
│ │ └─ salesStore.repository.js
│ └─ services/ # Regras de negócio
│
├─ electron/
│ ├─ configs/
│ │ └─ window.config.js # Configuração das janelas
│ │
│ ├─ ipc/ # Comunicação IPC
│ │ ├─ index.js
│ │ ├─ levarReceber.ipc.js
│ │ └─ salesStore.ipc.js
│ │
│ ├─ window/
│ │ ├─ createWindow.js
│ │ └─ WindowManager.class.js
│ │
│ ├─ db.js # Inicialização do banco no Electron
│ ├─ main.js # Processo principal
│ └─ preload.js # Ponte segura entre UI e backend
│
├─ interface/
│ ├─ index.html # Interface principal
│ ├─ css/
│ │ └─ style.css
│ ├─ js/
│ └─ app.js
│
├─ package.json
├─ package-lock.json
├─ webpack.config.js
└─ README.md


---

## 🔌 Banco de dados

A aplicação utiliza **SQL Server** com **pool de conexões** para garantir
desempenho e estabilidade.

### Organização da camada de dados

- **Repository**
  - Contém apenas consultas SQL
  - Pode operar em modo tradicional ou com stream
- **Service**
  - Centraliza regras de negócio
  - Orquestra o fluxo de dados
- **Electron (Main)**
  - Controla o IPC
  - Encaminha os dados para a interface

---

## 🔄 Streams de dados

Consultas que retornam grandes volumes utilizam **streaming**, permitindo:

- Processamento linha a linha
- Menor consumo de memória
- Envio progressivo dos dados para a interface
- Melhor desempenho em relatórios e listagens extensas

Os dados são enviados ao frontend em **chunks via IPC**.

---

## 🔐 Segurança

- O **Renderer não acessa o banco de dados**
- Nenhuma credencial é exposta na interface
- Toda comunicação ocorre via `preload` usando `contextBridge`
- O acesso ao SQL Server fica isolado no backend

---

## 🚀 Execução do projeto

Instale as dependências:

```bash
npm install
```

Execute a aplicação:
```bash
npm start
```

🧠 Arquitetura adotada

- Electron puro (sem Express)
- Comunicação baseada em IPC
- Separação clara de responsabilidades
- Código modular e escalável
- Preparado para evolução futura sem quebrar compatibilidade