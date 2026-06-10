# Deploy de Producao EDREN

Passo a passo para publicar a release `v0.1.1` em producao usando:

- Dominio: `sistema.edren.com.br`
- Nginx local: porta `8008`
- API Fastify interna: `127.0.0.1:43101`
- Frontend estatico: `/var/www/sistema-edren`
- Processo PM2: `sistema-edren-api-prod`
- Configuracao Nginx: `/etc/nginx/sites-available/sistema-edren`
- Cloudflared Tunnel apontando para o Nginx

## 1. Atualizar codigo na release

```bash
cd /root/lucas/edren/edren
git fetch --tags
git checkout v0.1.1
```

## 2. Criar `.env` de producao

```bash
nano .env
```

Conteudo:

```env
NODE_ENV=production
HOST=127.0.0.1
PORT=43101
LOG_LEVEL=info
DATABASE_URL=postgresql://USUARIO:SENHA@127.0.0.1:5432/edren_prod?schema=public
```

Substitua `USUARIO` e `SENHA` pelas credenciais reais do banco de producao.

## 3. Instalar dependencias e buildar

```bash
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
```

## 4. Publicar frontend no Nginx

```bash
mkdir -p /var/www/sistema-edren
rm -rf /var/www/sistema-edren/*
cp -r apps/web/dist/* /var/www/sistema-edren/
```

## 5. Subir API com PM2

Primeira vez:

```bash
pm2 start apps/api/dist/server.js --name sistema-edren-api-prod
pm2 save
```

Se o processo ja existir:

```bash
pm2 restart sistema-edren-api-prod
```

## 6. Criar configuracao do Nginx

```bash
nano /etc/nginx/sites-available/sistema-edren
```

Conteudo:

```nginx
server {
    listen 8008;

    server_name sistema.edren.com.br;

    root /var/www/sistema-edren;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:43101;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_http_version 1.1;
    }
}
```

Ativar configuracao:

```bash
ln -s /etc/nginx/sites-available/sistema-edren /etc/nginx/sites-enabled/sistema-edren
nginx -t
systemctl reload nginx
```

Se o link simbolico ja existir, apenas rode:

```bash
nginx -t
systemctl reload nginx
```

## 7. Configurar Cloudflared Tunnel

No tunnel, apontar:

```text
sistema.edren.com.br -> http://127.0.0.1:8008
```

Fluxo esperado:

```text
https://sistema.edren.com.br
        -> Cloudflared
http://127.0.0.1:8008
        -> Nginx
/       -> /var/www/sistema-edren
/api    -> http://127.0.0.1:43101
```

## 8. Validar na VPS

```bash
curl http://127.0.0.1:43101/api/health
curl http://127.0.0.1:43101/api/health/db
curl http://127.0.0.1:8008
curl http://127.0.0.1:8008/api/health
```

## 9. Validar pelo navegador

```text
https://sistema.edren.com.br
https://sistema.edren.com.br/api/health
https://sistema.edren.com.br/api/health/db
```

## 10. Comandos uteis

Ver logs da API:

```bash
pm2 logs sistema-edren-api-prod
```

Ver processos PM2:

```bash
pm2 status
```

Reiniciar API:

```bash
pm2 restart sistema-edren-api-prod
```

Validar Nginx:

```bash
nginx -t
```

Recarregar Nginx:

```bash
systemctl reload nginx
```
