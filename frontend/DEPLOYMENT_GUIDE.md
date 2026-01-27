# 🚀 Guia de Deploy - Trajezz E-Commerce

## Opções de Deploy

### 1. **Vercel** (Recomendado)

#### Vantagens:
- ✅ Deploy automático via Git
- ✅ Subdomínios grátis
- ✅ SSL automático
- ✅ Analytics integrado
- ✅ Muito rápido

#### Passos:

1. **Criar conta em Vercel**
   - Ir para https://vercel.com
   - Sign up com GitHub

2. **Conectar Repositório**
   ```bash
   vercel
   ```

3. **Configurar**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

4. **Deploy**
   ```bash
   vercel --prod
   ```

#### Monitorar:
- Dashboard: https://vercel.com/dashboard
- Logs em tempo real
- Performance analytics

---

### 2. **Netlify**

#### Vantagens:
- ✅ Interface amigável
- ✅ Builds automáticas
- ✅ Serverless functions
- ✅ A/B testing integrado

#### Passos:

1. **Fazer Build Local**
   ```bash
   npm run build
   ```

2. **Fazer Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Ou via Interface**
   - Ir para https://netlify.com
   - Drag and drop pasta `dist`

---

### 3. **GitHub Pages**

#### Vantagens:
- ✅ Gratuito
- ✅ Integrado com GitHub
- ✅ Sem limite de tráfego

#### Desvantagens:
- ❌ Sem HTTPS em domínio custom
- ❌ Sem serverless functions

#### Passos:

1. **Configurar `vite.config.js`**
   ```javascript
   export default {
     base: '/E-commerce_TrajezzCo/',
   }
   ```

2. **Fazer Build**
   ```bash
   npm run build
   ```

3. **Push para branch `gh-pages`**
   ```bash
   npm install gh-pages --save-dev
   ```

4. **Adicionar ao `package.json`**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

---

### 4. **AWS / DigitalOcean** (Advanced)

#### Para Infraestrutura Própria

**AWS S3 + CloudFront:**
```bash
# Instalar AWS CLI
aws configure

# Fazer upload para S3
aws s3 sync dist/ s3://seu-bucket-name

# Invalidar cache CloudFront
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

**DigitalOcean App Platform:**
- Conectar repositório GitHub
- Auto-deploy ao fazer push

---

## Pré-Deploy Checklist

### Antes de Fazer Deploy:

```bash
# 1. Limpar dependências
npm ci

# 2. Rodar linter
npm run lint

# 3. Fazer build local
npm run build

# 4. Verificar build
npm run preview

# 5. Testar funcionalidades
# - Carrinho
# - Checkout
# - Formulários
# - Responsividade

# 6. Verificar performance
# Lighthouse Score > 90
```

---

## Configurações Importantes

### 1. **Environment Variables**

Criar `.env.production` na raiz do projeto:

```env
# Production Environment
VITE_API_URL=https://api.trajezz.com
VITE_API_KEY=sua_chave_api_producao
VITE_APP_NAME=Trajezz
```

### 2. **SEO Meta Tags**

Adicionar em `index.html`:

```html
<meta name="description" content="Compre os melhores sneakers do mercado na Trajezz">
<meta name="keywords" content="sneakers, tênis, Nike, Adidas, Jordan">
<meta name="author" content="Trajezz">
<meta property="og:title" content="Trajezz - E-Commerce de Sneakers">
<meta property="og:description" content="Os melhores sneakers em um só lugar">
<meta property="og:image" content="https://trajezz.com/og-image.jpg">
```

### 3. **Analytics**

Google Analytics:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 4. **robots.txt**

Criar `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://trajezz.com/sitemap.xml
```

### 5. **sitemap.xml**

Criar `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://trajezz.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://trajezz.com/collection</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trajezz.com/about</loc>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

## Pós-Deploy

### 1. **Verificações Iniciais**

- [ ] Acessar site em produção
- [ ] Testar todas as páginas
- [ ] Verificar links
- [ ] Testar formulários
- [ ] Testar carrinho
- [ ] Testar checkout
- [ ] Verificar mobile responsiveness
- [ ] Testar em diferentes navegadores

### 2. **Performance**

```bash
# Usar Lighthouse
# Score: > 90
# Mobile: > 85

# Core Web Vitals:
# LCP: < 2.5s
# FID: < 100ms
# CLS: < 0.1
```

### 3. **Monitoramento**

Configurar alertas para:
- Uptime (Pingdom, Uptime Robot)
- Erros (Sentry)
- Performance (New Relic, DataDog)
- Traffic (Google Analytics)

### 4. **Segurança**

- [ ] HTTPS certificado
- [ ] CSP headers
- [ ] Security headers
- [ ] Backup automático
- [ ] Rate limiting

---

## Troubleshooting

### Problema: Build falha
```bash
# Limpar cache
rm -rf node_modules
npm install
npm run build
```

### Problema: Site lento
```bash
# Analisar bundle
npm install -D vite-plugin-visualizer

# Verificar Lighthouse
# Otimizar imagens
# Ativar gzip
```

### Problema: Funcionalidade não funciona
1. Verificar console (DevTools)
2. Verificar Network tab
3. Verificar environment variables
4. Verificar logs do servidor

---

## Domínio Custom

### Registrar Domínio

1. **Registradores Populares**:
   - Namecheap.com
   - GoDaddy.com
   - RegistroBR.com (Brasil)

2. **Apontar para Vercel**:
   - Ir para Project Settings
   - Domains
   - Adicionar domínio custom
   - Seguir instruções DNS

3. **Verificar DNS**:
   ```bash
   nslookup trajezz.com
   ```

---

## SSL/HTTPS

- ✅ Vercel: Automático (Let's Encrypt)
- ✅ Netlify: Automático
- ✅ AWS: Via ACM
- ✅ DigitalOcean: Let's Encrypt automático

---

## Backup e Recovery

### Estratégia de Backup:

1. **Git Repository** - Source code
2. **Database** - Backend data (quando implementar)
3. **Assets** - Imagens, CDN
4. **Config** - Environment variables

```bash
# Backup local
git clone seu-repo backup-$(date +%Y%m%d)

# Backup em cloud
aws s3 sync backup s3://seu-bucket/backup
```

---

## Escalabilidade

### Se tráfego aumentar:

1. **Frontend**:
   - CDN globais (CloudFlare, Cloudfront)
   - Compressão gzip
   - Cache estratégico

2. **Backend** (quando implementar):
   - Load balancing
   - Database replication
   - Cache (Redis)
   - Message queues

---

## Cost Estimation

| Serviço | Preço | Observação |
|---------|-------|-----------|
| **Vercel** | Free | Até 10GB bandwidth/mês |
| **Netlify** | Free | Até 100GB bandwidth/mês |
| **GitHub Pages** | Free | Ilimitado |
| **Domínio** | $10-15/ano | Registrador |
| **Email Custom** | $5-10/mês | Google Workspace |
| **Analytics** | Free | Google Analytics |
| **Monitoring** | Free | Uptime Robot (5 monitors) |

---

## Comandos Úteis

```bash
# Development
npm run dev                  # Rodar localmente
npm run build              # Build production
npm run preview            # Preview do build

# Deployment
vercel                      # Deploy Vercel
netlify deploy             # Deploy Netlify
npm run deploy             # GitHub Pages

# Maintenance
npm outdated               # Verificar atualizações
npm update                 # Atualizar pacotes
npm audit                  # Verificar vulnerabilidades
npm audit fix              # Corrigir vulnerabilidades
```

---

## Resources Úteis

- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Vite: https://vitejs.dev/guide/static-deploy.html
- Google Analytics: https://analytics.google.com
- Let's Encrypt: https://letsencrypt.org

---

**Última Atualização**: 27/01/2025  
**Status**: Ready for Production ✅
