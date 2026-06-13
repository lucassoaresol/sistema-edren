# Spec de Políticas de Autorização Modular

**Situação:** Planejada.
**Rastreabilidade:** Roadmap `Modular Authorization Policies`; concerns sobre permissões por contexto, navegação plana e `requireAdmin`; base para estoque, vendas, recebíveis e Confecção/Criação.

## Propósito

Criar uma política simples e reutilizável de autorização por contexto e ação, usando os perfis existentes, sem introduzir permissões customizadas por usuário no MVP.

## Problema Atual

- A API já possui `requireAuth` e `requireAdmin`, mas ainda não expressa contexto operacional e ação de negócio.
- Catálogo e configurações usam mensagens administrativas específicas, mas futuras rotas de estoque, vendas, recebíveis e Confecção precisarão regras mais claras.
- O frontend ainda exibe navegação plana e não tem uma fonte central para decidir acesso por perfil/contexto.

## Requisitos

- REQ-AUTHZ-001: Definir contextos operacionais iniciais do MVP, como `config`, `catalog`, `stock`, `sales`, `receivables`, `reports` e `creation` quando aplicável.
- REQ-AUTHZ-002: Definir ações simples por contexto, como `read`, `create`, `update`, `delete`, `adjust`, `cancel`, `receivePayment` e `viewCost` conforme necessidade real.
- REQ-AUTHZ-003: Implementar helper/política de backend que avalie perfil existente (`ADMIN`, `MANAGER`, `SELLER_OPERATOR`) contra contexto e ação.
- REQ-AUTHZ-004: Preservar `requireAuth` e compatibilidade com `requireAdmin` ou migrar incrementalmente sem quebrar contratos atuais.
- REQ-AUTHZ-005: Manter permissões customizadas por usuário fora do MVP.
- REQ-AUTHZ-006: Preparar uma fonte reutilizável para o frontend filtrar navegação e ações, sem depender apenas de esconder botões.
- REQ-AUTHZ-007: Mensagens de erro devem continuar claras e coerentes para a UI.

## Fora de Escopo

- Criar tela de gestão de permissões.
- Criar permissões customizadas por usuário.
- Implementar gestão completa de usuários.
- Reescrever todos os módulos em uma única mudança.

## Critérios de Aceite

- Há uma matriz simples e documentada de permissões por perfil/contexto/ação.
- Novas rotas podem expressar autorização por intenção de negócio, não apenas por `ADMIN` hardcoded.
- Rotas existentes podem migrar incrementalmente sem alterar contrato HTTP.
- Frontend tem caminho claro para consultar ou reutilizar a política de navegação/ação.

## Validação

- `npm run typecheck`
- `npm test`
- `npm run build`
- Testes de API para ao menos um contexto migrado.
- Checagem manual de navegação e ações principais por perfil quando o frontend for integrado.
