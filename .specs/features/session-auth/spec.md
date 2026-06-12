# Spec de Autenticação por Sessão

**Situação:** Implementada retroativamente a partir dos commits existentes.
**Rastreabilidade:** `feat: implement session auth`, correções relacionadas ao bootstrap de administrador e `test: add api route coverage`.

## Propósito

Permitir que usuários da EDREN autentiquem com username e senha por meio de sessões server-side armazenadas no banco e representadas no navegador por cookies HTTP-only assinados.

## Requisitos

- REQ-AUTH-001: Usuários devem autenticar com `username` único e senha, não com email.
- REQ-AUTH-002: A verificação de senha deve usar hashes argon2 seguros.
- REQ-AUTH-003: A API deve criar sessões persistidas no banco após login bem-sucedido.
- REQ-AUTH-004: Cookies de sessão devem ser assinados, HTTP-only, `SameSite=Lax`, path `/` e `Secure` em produção.
- REQ-AUTH-005: `/api/auth/login` deve validar credenciais e retornar o payload do usuário atual em caso de sucesso.
- REQ-AUTH-006: `/api/auth/logout` deve remover a sessão ativa quando existir e limpar o cookie de sessão.
- REQ-AUTH-007: `/api/auth/me` deve retornar o usuário atual ou `null` quando não autenticado.
- REQ-AUTH-008: Áreas protegidas do frontend devem redirecionar usuários não autenticados para `/login`.
- REQ-AUTH-009: Administradores iniciais devem ser criados por script terminal-only de bootstrap, não por seed com senha padrão.
- REQ-AUTH-010: Testes da API devem cobrir consulta de usuário não autenticado, login inválido, login com sucesso/cookie de sessão, logout e rotas de health.

## Fora de Escopo

- Autenticação com JWT.
- Fluxo de recuperação de senha.
- Permissões customizadas por usuário.
- Aplicação completa de papéis/permissões em todos os futuros módulos do MVP.
- Autenticação multifator.

## Validação

- `npm run typecheck`
- `npm run build`
- `npm test`
- Checagens manuais de API para login/me/logout durante a implementação.

## Observações

- Checagens de permissão baseadas em perfil ainda precisam ser desenhadas e aplicadas conforme ações protegidas de negócio forem adicionadas.
- Esta spec foi adicionada depois da implementação para restaurar rastreabilidade. Mudanças futuras de auth devem atualizar esta spec antes do código quando alterarem comportamento.
