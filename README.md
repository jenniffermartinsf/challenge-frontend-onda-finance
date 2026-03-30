# Onda Finance Challenge

Webapp para o teste técnico com foco em clareza, UX limpa, consistência visual, validação correta e fluxo funcionando de ponta a ponta.

## Stack

- React 19 + Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui
- Vitest + Testing Library
- ESLint + Prettier

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm run test`
- `npm run test:run`

## Decisões técnicas

- O app usa uma mock API baseada em adapter do Axios para manter o consumo parecido com um backend real sem acoplar a UI a `fetch` solto.
- O estado de autenticação fica em Zustand com persistência em `sessionStorage`, evitando armazenar senha e reduzindo exposição desnecessária.
- O dashboard usa React Query para cache e invalidação automática após a transferência.
- A transferência usa RHF + Zod para validação em camadas: cliente e servidor mock.
- O layout prioriza responsividade mobile-first, contraste consistente, semântica correta e navegação por teclado.

## Fluxo implementado

- Login mock com credenciais já preenchidas para facilitar avaliação.
- Dashboard com saldo, entradas, saídas e histórico recente.
- Transferência com validação e atualização do dashboard sem refresh manual.
- Teste cobrindo o fluxo principal de login + transferência + invalidação.

## Segurança

- Nenhum uso de `any`.
- Nenhum uso de `dangerouslySetInnerHTML`.
- Senha nunca é persistida no store.
- Inputs sensíveis são validados com Zod antes de chegar à camada mock.
- A transferência bloqueia saldo insuficiente e impede envio para a própria conta autenticada.
- ESLint inclui verificação type-aware e regras de acessibilidade.

## Melhorias futuras

- Adicionar testes de acessibilidade automatizados com `axe`.
- Evoluir a mock API para um backend real.
- Criar componentes adicionais do design system para formulários complexos.
- Cobrir cenários de erro e loading com testes mais granulares.
