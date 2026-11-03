# TaskFlow — Gerenciador de Tarefas Web

Projeto prático de desenvolvimento web: uma aplicação de gerenciamento de tarefas que funciona inteiramente no navegador, sem backend, banco de dados, API, frameworks ou bibliotecas externas.

## Tecnologias

- HTML5 — estrutura da página
- CSS3 — visual e responsividade
- JavaScript puro — funcionalidades, eventos e filtros
- `localStorage` — persistência de dados no navegador

## Como executar no VS Code

1. Extraia o arquivo ZIP.
2. Abra o **Visual Studio Code**.
3. Clique em **Arquivo > Abrir Pasta** e escolha a pasta `taskflow`.
4. Abra o arquivo `index.html` no navegador (por exemplo, clique com o botão direito no arquivo no explorador do sistema e escolha o navegador).
5. Não é necessário instalar extensões, pacotes ou iniciar um servidor.

## Funcionalidades obrigatórias

- Dashboard com contagem de tarefas totais, a fazer, em andamento e concluídas.
- Cadastro com título, descrição, prioridade (baixa, média ou alta) e prazo.
- Edição e exclusão de tarefas (com confirmação antes de excluir).
- Kanban com três colunas e mudança de status pelo seletor em cada cartão.
- Pesquisa por título e filtros simultâneos por prioridade e status.
- Botão para limpar filtros.
- Salvamento automático no `localStorage`, com carregamento ao abrir a página.
- Interface responsiva para computadores e celulares.

## Recursos adicionais

- Barra de progresso de tarefas concluídas.
- Aviso visual de prazo vencido.
- Confirmações visuais das operações.

## Organização dos arquivos

- `index.html`: elementos, formulário, painel, pesquisa e quadro Kanban.
- `style.css`: estilos e adaptação a diferentes tamanhos de tela.
- `script.js`: tarefas, eventos, indicadores, filtros e armazenamento local.

## Como testar

1. Crie uma tarefa com título, descrição, prioridade e prazo. Ela deve aparecer em **A fazer**.
2. Altere o status para **Em andamento** e depois **Concluída**; confira os indicadores.
3. Edite a tarefa e confira os dados atualizados.
4. Crie outras tarefas e teste a busca por título e os dois filtros juntos.
5. Atualize a página: as tarefas devem permanecer.
6. Exclua uma tarefa e confirme que ela desapareceu e não volta após atualizar.
7. Abra o site em uma janela estreita para conferir o layout responsivo.

**Observação:** os dados são armazenados no navegador e no dispositivo em que você usa o site. Não são sincronizados com outros navegadores ou computadores. Apagar os dados do site no navegador também remove as tarefas.

## Conceitos para apresentar ao professor

- **Array:** `tasks` guarda a lista de tarefas.
- **Objeto:** cada tarefa possui `id`, `title`, `description`, `priority`, `deadline` e `status`.
- **Funções e eventos:** o envio do formulário, os botões e os filtros chamam funções do JavaScript.
- **DOM:** `querySelector`, `createElement` e `replaceChildren` atualizam a página.
- **JSON/localStorage:** `JSON.stringify` salva os dados e `JSON.parse` recupera os dados.
- **Filtros:** `filter()` escolhe quais tarefas aparecem sem apagar a lista original.

## Integrantes

- [Preencher nome(s) do(s) integrante(s)]

## Publicação no GitHub

Crie um repositório no GitHub e envie os quatro arquivos (`index.html`, `style.css`, `script.js` e `README.md`). Confirme que o repositório pode ser visualizado pelo professor e envie o **link do repositório**, não apenas uma página publicada.
