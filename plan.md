# Aplicativo de Lista e Histórico de Compras

## 1. Visão geral

Desenvolver um aplicativo pessoal de lista de compras para uso compartilhado entre duas pessoas.

O aplicativo será instalado em dois ou mais dispositivos e todos deverão acessar e modificar **a mesma lista de compras**, utilizando o Supabase como backend e banco de dados.

A proposta é ser um aplicativo simples, rápido e prático para controlar:

* O que precisamos comprar.
* Quantidade desejada.
* O que já foi comprado.
* Preço pago.
* Valor total das compras.
* Histórico das compras realizadas.
* Produtos comprados anteriormente.
* Itens que podem ser adicionados à lista a qualquer momento.

O aplicativo deve funcionar inicialmente em **Android e iOS**, utilizando **React Native + TypeScript**.

---

# 2. Objetivo principal

O principal objetivo é resolver uma situação simples:

> “Lembrei que precisamos comprar alguma coisa. Quero adicionar à lista agora para não esquecer quando formos ao mercado.”

E depois:

> “Chegamos ao mercado, abrimos a lista e vamos registrando o que compramos e quanto pagamos.”

Por fim:

> “Quero conseguir consultar nossas compras anteriores para saber o que compramos, quanto pagamos e reutilizar uma lista anterior.”

O aplicativo deve priorizar **simplicidade e velocidade**, evitando funcionalidades complexas que não agreguem diretamente a esse objetivo.

---

# 3. Stack sugerida

## Frontend

* React Native
* TypeScript
* Expo, caso não exista necessidade de código nativo específico
* React Navigation
* TanStack Query
* Zustand, apenas se necessário para estado local/UI
* AsyncStorage ou MMKV para persistência local
* ESLint
* Prettier

## Backend

Supabase:

* PostgreSQL
* Supabase Auth
* Realtime
* Storage somente se futuramente houver necessidade de imagens

---

# 4. Autenticação

O aplicativo terá um sistema de login **extremamente simples**, utilizando o **Supabase Auth**.

Não haverá tela de cadastro.

As contas serão criadas/configuradas diretamente no Supabase previamente.

## Login

Tela inicial do aplicativo:

```text
┌─────────────────────────┐
│                         │
│      🛒 Nossa Listinha      │
│                         │
│  E-mail                 │
│  [___________________]  │
│                         │
│  Senha                  │
│  [___________________]  │
│                         │
│       [ Entrar ]        │
│                         │
└─────────────────────────┘
```

O usuário deverá informar:

* E-mail.
* Senha.

E clicar em:

```text
Entrar
```

---

## Não haverá cadastro

Não implementar:

* Tela de cadastro.
* Criação de conta pelo aplicativo.
* Recuperação complexa de conta no MVP.
* Login social.
* Google Login.
* Apple Login.

As contas podem ser criadas diretamente no painel do Supabase.

Exemplo:

```text
Supabase Auth

usuario1@email.com
usuario2@email.com
```

Cada pessoa instala o aplicativo no próprio celular e utiliza sua conta.

---

# 5. Compartilhamento

Apesar de existir autenticação, **não haverá sistema de grupos, casas ou membros**.

A aplicação terá uma única lista compartilhada.

Conceito:

```text
Usuário 1 ────────┐
                   │
                   ├── Lista de compras
                   │
Usuário 2 ────────┘
```

Os dois usuários autenticados terão acesso à mesma lista.

Não é necessário saber quem adicionou, editou ou comprou determinado item.

Não haverá:

* Grupos.
* Household.
* Sistema de membros.
* Convites.
* Roles.
* Permissões diferentes.
* Auditoria.

A autenticação existe principalmente para:

1. Impedir acesso público aos dados.
2. Permitir que o Supabase identifique os usuários autorizados.
3. Garantir que somente as contas previamente configuradas tenham acesso ao aplicativo.

---

# 6. Controle de acesso

O Supabase deve utilizar **Row Level Security (RLS)**.

Como existe apenas uma lista compartilhada, não é necessário criar uma estrutura complexa de relacionamento.

O objetivo é simplesmente garantir que:

```text
Usuário autorizado
        ↓
Acessa a lista
        ↓
Pode visualizar e modificar
```

Enquanto:

```text
Usuário não autorizado
        ↓
Não consegue acessar os dados
```

O desenvolvedor deve escolher a implementação mais simples possível para representar essa única lista compartilhada.

---

# 7. Tela inicial

A Home deve ser extremamente simples.

Exemplo:

```text
🛒 Lista de compras

5 itens

☐ Arroz           2 pacotes
☐ Leite           6 unidades
☐ Café            2 pacotes
☐ Sabão           2 unidades
☐ Papel higiênico 1 pacote

────────────────────

Total estimado:
R$ 87,50

[ + Adicionar item ]

[ Começar compra ]

[ Histórico ]
```

A tela inicial deve permitir acessar rapidamente:

* Lista atual.
* Adicionar item.
* Iniciar compra.
* Histórico.

---

# 8. Adicionar item

O usuário deve conseguir adicionar algo à lista rapidamente.

Exemplo:

```text
+ Adicionar item
```

Campos:

### Nome

Obrigatório.

Exemplo:

```text
Leite
```

### Quantidade

Opcional.

Exemplo:

```text
6
```

### Unidade

Opcional.

Exemplos:

* unidade
* kg
* g
* litro
* ml
* pacote
* caixa
* garrafa
* dúzia
* outro

### Categoria

Opcional.

Categorias iniciais:

* Alimentos
* Bebidas
* Limpeza
* Higiene
* Pet
* Casa
* Farmácia
* Outros

### Observação

Opcional.

Exemplo:

```text
Sem lactose
```

### Preço estimado

Opcional.

Pode ser utilizado para calcular aproximadamente quanto a próxima compra deverá custar.

---

# 9. Lista de compras

A lista deve mostrar os itens que precisam ser comprados.

Exemplo:

```text
🛒 Lista de compras

Alimentos

☐ Arroz
   2 pacotes

☐ Leite
   6 unidades

☐ Café
   2 pacotes

Limpeza

☐ Detergente
   4 unidades
```

O usuário deve conseguir:

* Marcar como comprado.
* Alterar quantidade.
* Editar item.
* Remover item.
* Alterar categoria.
* Alterar observação.
* Alterar preço estimado.

Não é necessário implementar prioridade ou sistemas complexos de ordenação neste momento.

---

# 10. Adicionar rapidamente

Essa é uma das funcionalidades mais importantes do aplicativo.

O usuário deve poder adicionar algo em poucos segundos.

Exemplo:

> “Acabou o café.”

Abrir o aplicativo:

```text
+ Café
```

Pronto.

O item entra na lista.

Não deve ser necessário preencher um formulário completo para cada produto.

---

# 11. Produtos já conhecidos

O aplicativo pode reconhecer produtos que já foram adicionados anteriormente.

Ao digitar:

```text
Lei...
```

pode sugerir:

```text
Leite
Leite sem lactose
Leite condensado
```

Ao selecionar um produto já conhecido, o aplicativo pode preencher automaticamente:

* Unidade utilizada anteriormente.
* Quantidade mais comum.
* Categoria.

O usuário poderá alterar esses dados antes de adicionar.

---

# 12. Compra em andamento

Ao começar uma compra:

```text
[ Começar compra ]
```

O aplicativo entra em um modo de compra.

Exemplo:

```text
🛒 Compra

☐ Arroz
   2 pacotes

☐ Leite
   6 unidades

☐ Café
   2 pacotes
```

Ao comprar um produto, o usuário marca como comprado.

Depois pode informar:

```text
Quantidade comprada
Preço pago
```

---

# 13. Quantidade planejada x quantidade comprada

É importante diferenciar o que estava planejado do que realmente foi comprado.

Exemplo:

Lista:

```text
Leite
Quantidade planejada: 6
```

No mercado:

```text
Leite
Quantidade comprada: 4
Preço pago: R$ 23,60
```

O histórico deve guardar o que realmente aconteceu.

---

# 14. Preço

Durante a compra, o usuário deve poder informar o preço pago.

Exemplo:

```text
Leite
6 unidades
R$ 29,40
```

O aplicativo deve calcular o total da compra automaticamente.

Exemplo:

```text
Arroz       R$ 24,90
Leite       R$ 29,40
Café        R$ 32,90

────────────────

Total:
R$ 87,20
```

---

# 15. Finalizar compra

Ao finalizar, mostrar um resumo:

```text
Finalizar compra?

3 produtos
10 unidades

Total:
R$ 87,20

[ Cancelar ]

[ Finalizar ]
```

Ao confirmar:

* Salvar a compra no histórico.
* Salvar todos os produtos comprados.
* Salvar quantidade.
* Salvar preço.
* Salvar total.
* Salvar data/hora.
* Remover da lista os itens comprados.

Itens que não foram comprados devem permanecer na lista atual.

---

# 16. Histórico

O aplicativo deve manter histórico das compras finalizadas.

Exemplo:

```text
📊 Histórico

Agosto 2026

08/08
12 itens
R$ 238,72

01/08
9 itens
R$ 184,50

Julho 2026

27/07
15 itens
R$ 312,80
```

Ao abrir uma compra:

```text
Compra — 08/08/2026

Arroz
2 pacotes
R$ 24,90

Leite
6 unidades
R$ 29,40

Café
2 unidades
R$ 32,90

────────────────

Total:
R$ 87,20
```

---

# 17. Comprar novamente

Uma funcionalidade importante é poder reutilizar uma compra anterior.

Ao abrir uma compra:

```text
[ Comprar novamente ]
```

O aplicativo adiciona os produtos à lista atual.

Exemplo:

Compra anterior:

```text
Arroz
Leite
Café
Detergente
Papel higiênico
```

Ao selecionar:

```text
Comprar novamente
```

A lista atual passa a ter:

```text
☐ Arroz
☐ Leite
☐ Café
☐ Detergente
☐ Papel higiênico
```

Caso já exista um item igual na lista, não deve criar uma duplicata desnecessária.

---

# 18. Produtos recorrentes

O aplicativo deve facilitar a adição de produtos comprados frequentemente.

Pode existir uma área simples:

```text
🔄 Comprados recentemente

Leite
Arroz
Café
Ovos
Papel higiênico
```

Ao tocar em um produto, ele é adicionado à lista.

Não é necessário implementar inteligência artificial para isso.

O histórico já fornece dados suficientes para identificar produtos recorrentes.

---

# 19. Histórico de preços

O sistema deve preservar o preço pago em cada compra.

Exemplo:

```text
Leite

Compras anteriores:

08/08 — R$ 4,90
01/08 — R$ 4,79
25/07 — R$ 4,69
```

Isso permite futuramente mostrar:

```text
Último preço:
R$ 4,90

Preço médio:
R$ 4,79
```

Não é necessário criar gráficos neste primeiro momento.

O importante é armazenar corretamente os dados.

---

# 20. Valor total

O aplicativo deve permitir consultar quanto foi gasto.

No histórico:

```text
08/08
R$ 238,72
```

Futuramente, pode existir um resumo mensal:

```text
Agosto

Total gasto:
R$ 827,42

Compras:
4
```

Essa funcionalidade pode ser considerada parte de uma segunda versão.

---

# 21. Sincronização entre dispositivos

Essa é uma parte essencial.

Exemplo:

Celular 1:

```text
+ Café
```

O celular 2 deve receber:

```text
☐ Café
```

automaticamente.

Alterações importantes devem ser sincronizadas:

* Adicionar item.
* Editar item.
* Remover item.
* Alterar quantidade.
* Marcar como comprado.
* Registrar preço.
* Finalizar compra.
* Reutilizar compra anterior.

Utilizar Supabase Realtime quando fizer sentido.

---

# 22. Funcionamento offline

O aplicativo deve tentar continuar funcionando mesmo sem conexão.

Durante uma compra, o usuário pode estar em um supermercado com conexão ruim.

Ele deve conseguir:

* Abrir a lista.
* Visualizar itens.
* Marcar itens.
* Alterar quantidade.
* Registrar preços.
* Finalizar a compra.

Quando a conexão voltar, os dados devem ser sincronizados.

Prioridade:

```text
Ação do usuário
       ↓
Atualização local imediata
       ↓
UI atualizada
       ↓
Sincronização com Supabase
```

Não deve ser necessário esperar o servidor responder para atualizar a interface.

---

# 23. Modelo de dados simplificado

Não criar uma estrutura excessivamente complexa.

## products

Representa produtos conhecidos.

```text
id
name
category
default_unit
default_quantity
notes
created_at
updated_at
```

Exemplo:

```text
name: Leite
category: Bebidas
default_unit: unidade
default_quantity: 6
```

---

## shopping_list_items

Representa os itens atualmente na lista.

```text
id
product_id
name
quantity
unit
estimated_price
category
notes
created_at
updated_at
```

O `product_id` pode ser opcional para permitir adicionar rapidamente um produto novo.

---

## shopping_sessions

Representa uma compra realizada.

```text
id
started_at
finished_at
total_amount
status
created_at
```

Status:

```text
active
completed
cancelled
```

---

## shopping_items

Representa os produtos comprados dentro de uma compra.

```text
id
shopping_session_id
product_id
name
quantity
unit
unit_price
total_price
category
notes
```

É importante manter uma cópia do nome e informações relevantes do produto no histórico.

Dessa forma, alterar um produto posteriormente não altera compras antigas.

---

# 24. Valores monetários

Evitar problemas de precisão com `float`.

Preferencialmente armazenar valores monetários como:

```text
R$ 23,90
```

ou em centavos:

```text
2390
```

O desenvolvedor deve escolher a abordagem mais adequada para PostgreSQL/Supabase, mantendo precisão monetária.

---

# 25. Datas

Armazenar timestamps no backend de maneira consistente, preferencialmente em UTC.

Converter para o horário local somente na apresentação.

---

# 26. Arquitetura sugerida do React Native

Uma estrutura possível:

```text
src/
├── app/
│   ├── navigation/
│   └── providers/
│
├── features/
│   ├── auth/
│   ├── shopping-list/
│   ├── shopping-session/
│   ├── products/
│   └── history/
│
├── components/
│   └── ui/
│
├── services/
│   ├── supabase/
│   └── sync/
│
├── stores/
│
├── hooks/
│
├── utils/
│
├── types/
│
└── schemas/
```

A estrutura pode ser modificada conforme decisão do desenvolvedor.

O objetivo é manter separação entre:

* UI.
* Regras de negócio.
* Estado.
* Persistência.
* Sincronização.

---

# 27. Estado e cache

Sugestão:

## TanStack Query

Utilizar para:

* Dados do Supabase.
* Cache.
* Queries.
* Mutations.
* Sincronização.

## Zustand

Utilizar somente se realmente necessário para:

* Estado temporário.
* Preferências.
* Estado de UI.
* Filtros.

Evitar colocar todo o banco de dados dentro do Zustand.

---

# 28. Realtime

Utilizar Supabase Realtime para atualizar a lista entre os dispositivos.

Exemplo:

```text
Celular 1
    │
    │ adiciona Café
    ↓
Supabase
    │
    │ Realtime
    ↓
Celular 2
    │
    ↓
Lista atualizada
```

Deve existir cuidado para evitar que uma alteração local seja duplicada quando o evento Realtime correspondente chegar.

---

# 29. Persistência da sessão

Após fazer login uma vez, o aplicativo deve manter a sessão do Supabase no dispositivo.

Assim, o usuário não deve precisar digitar e-mail e senha toda vez que abrir o aplicativo.

Fluxo:

```text
Primeiro acesso

E-mail
Senha
   ↓
Entrar
   ↓
Sessão salva localmente
   ↓
Home
```

Próximos acessos:

```text
Abrir aplicativo
       ↓
Sessão válida?
       ↓
     SIM
       ↓
Abrir Home
```

Caso a sessão expire ou seja removida:

```text
Abrir aplicativo
       ↓
Login
```

---

# 30. Logout

Pode existir uma opção simples de sair da conta dentro das configurações.

Exemplo:

```text
Configurações

Conta
usuario@email.com

[ Sair ]
```

Não é necessário criar uma tela de configurações complexa no MVP.

---

# 31. Segurança

O Supabase Auth será responsável pela autenticação.

O banco deve utilizar **Row Level Security (RLS)**.

O aplicativo nunca deve utilizar a `service_role key`.

Apenas a chave pública apropriada do Supabase deve ser incluída no aplicativo.

As políticas do banco devem garantir que somente usuários autenticados e autorizados tenham acesso aos dados da lista.

Como existem apenas dois usuários no projeto, a implementação pode ser simples.

Não criar estruturas complexas de grupos ou permissões.

---

# 32. MVP

O MVP deve conter somente o essencial.

## Autenticação

* [ ] Login por e-mail e senha.
* [ ] Contas criadas diretamente no Supabase.
* [ ] Sem tela de cadastro.
* [ ] Persistência da sessão.
* [ ] Logout.
* [ ] Proteção das rotas internas.
* [ ] RLS no Supabase.

## Lista

* [ ] Visualizar lista.
* [ ] Adicionar item.
* [ ] Editar item.
* [ ] Remover item.
* [ ] Quantidade.
* [ ] Unidade.
* [ ] Categoria opcional.
* [ ] Observação opcional.
* [ ] Preço estimado opcional.
* [ ] Marcar como comprado.

## Compra

* [ ] Iniciar compra.
* [ ] Visualizar itens.
* [ ] Registrar quantidade comprada.
* [ ] Registrar preço.
* [ ] Calcular total.
* [ ] Finalizar compra.
* [ ] Manter itens não comprados na lista.

## Histórico

* [ ] Lista de compras anteriores.
* [ ] Detalhes de uma compra.
* [ ] Data.
* [ ] Produtos.
* [ ] Quantidades.
* [ ] Preços.
* [ ] Total.
* [ ] Comprar novamente.

## Compartilhamento

* [ ] Mesma lista disponível nos dois dispositivos.
* [ ] Sincronização automática.
* [ ] Supabase Realtime quando apropriado.

## Offline

* [ ] Visualizar dados offline.
* [ ] Adicionar/modificar itens offline.
* [ ] Registrar compra offline.
* [ ] Sincronizar posteriormente.

---

# 33. Funcionalidades futuras

Não implementar inicialmente, mas manter a arquitetura razoavelmente preparada para:

## Estatísticas

```text
Agosto

Total:
R$ 1.287,42

Compras:
4
```

## Histórico de preços

```text
Leite

Último:
R$ 4,90

Média:
R$ 4,79
```

## Produtos favoritos

```text
⭐ Favoritos

Leite
Arroz
Café
Ovos
```

## Sugestões

```text
Você costuma comprar:

☐ Leite
☐ Arroz
☐ Café
☐ Ovos
```

## Orçamento mensal

```text
Orçamento:
R$ 1.500

Gasto:
R$ 827

Restante:
R$ 673
```

## Notificações

Lembretes de itens pendentes ou compras.

## Scanner

Futuramente, permitir adicionar produtos através de código de barras.

## Nota fiscal

Futuramente, considerar leitura de nota fiscal para facilitar o registro de preços.

---

# 34. O que NÃO faz parte do projeto neste momento

Para evitar overengineering, não implementar:

* ❌ Cadastro de usuários pelo aplicativo.
* ❌ Login social.
* ❌ Google Login.
* ❌ Apple Login.
* ❌ Recuperação complexa de conta.
* ❌ Sistema de grupos.
* ❌ Household.
* ❌ Sistema de membros.
* ❌ Convites.
* ❌ Roles.
* ❌ Permissões diferentes entre usuários.
* ❌ Identificação de quem adicionou algo.
* ❌ Auditoria.
* ❌ Sistema de prioridade.
* ❌ Ordenação avançada.
* ❌ Sistema de múltiplas listas.
* ❌ Sistema de empresas.
* ❌ IA.
* ❌ Integração com supermercados.
* ❌ Comparação automática de preços.
* ❌ Gráficos complexos.
* ❌ Orçamento obrigatório.
* ❌ Notificações obrigatórias.

Essas funcionalidades podem ser consideradas futuramente somente caso exista uma necessidade real.

---

# 35. Fluxo principal

O fluxo que deve ser extremamente bem resolvido é:

```text
              Lembrei de algo
                     ↓
              Abrir aplicativo
                     ↓
               + Adicionar
                     ↓
                  "Café"
                     ↓
                Lista salva
                     ↓
            ┌─────────────────┐
            │ Outro celular   │
            │ recebe a lista  │
            └────────┬────────┘
                     ↓
               Ir ao mercado
                     ↓
              Começar compra
                     ↓
             Marcar produtos
                     ↓
             Registrar preços
                     ↓
              Finalizar compra
                     ↓
               Salvar histórico
                     ↓
             Comprar novamente
                     ↓
              Nova lista
```

---

# 36. Fluxo de autenticação

### Primeiro acesso

```text
Abrir aplicativo
       ↓
Não existe sessão
       ↓
Tela de Login
       ↓
E-mail + senha
       ↓
Supabase Auth
       ↓
Sessão criada
       ↓
Home
```

### Próximos acessos

```text
Abrir aplicativo
       ↓
Existe sessão válida?
       ↓
      SIM
       ↓
Home
```

A autenticação deve ser praticamente invisível depois do primeiro acesso.

---

# 37. Princípio principal do produto

O aplicativo deve seguir duas regras:

> **Adicionar algo deve ser extremamente rápido.**

E:

> **Usar o aplicativo dentro do mercado deve ser extremamente simples.**

A pessoa não deve precisar pensar em categorias, configurações, usuários ou outros conceitos antes de conseguir adicionar um produto.

O objetivo é criar uma ferramenta pessoal que seja utilizada naturalmente durante o dia e durante as compras.

A complexidade deve ficar na implementação, **não na experiência do usuário**.

---

# 38. Resultado esperado

Ao final do MVP, duas pessoas devem conseguir instalar o aplicativo em seus celulares, fazer login utilizando as contas previamente criadas no Supabase e compartilhar a mesma lista.

O fluxo principal deverá funcionar assim:

```text
Celular 1                    Supabase                    Celular 2

   Login  ────────────────────→ Auth
      │                          │
      │                          │
      └────── Adiciona Café ───→│
                                 │
                                 ├──── Realtime ─────→ Lista atualizada
                                 │
                                 │
   Compra ←──────────────────────┤
      │                          │
      └────── Histórico ────────→│
```

O aplicativo deve ser pequeno, rápido e simples, mas possuir uma base técnica adequada para futuramente evoluir caso o uso real demonstre necessidade.
