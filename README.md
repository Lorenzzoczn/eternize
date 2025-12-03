# ✨ Eternize - Sistema de Upload e Compartilhamento

Sistema completo de upload de fotos, geração de link único e QR Code, desenvolvido com HTML, CSS e JavaScript puro (sem backend).

## 🚀 Início Rápido

1. Abra `create.html` no navegador
2. Adicione fotos e informações
3. Clique em "Finalizar e Gerar Link"
4. Compartilhe o link ou QR Code gerado

## 📁 Estrutura do Projeto

```
eternize-checkout/
├── index.html              # Página principal do site
├── create.html             # Criar nova página (NOVO)
├── view.html               # Visualizar página compartilhada (NOVO)
├── GUIA_RAPIDO.html        # Guia visual interativo (NOVO)
├── EXEMPLO_TESTE.html      # Página de testes (NOVO)
│
├── css/
│   ├── style.css           # Estilos globais
│   ├── create.css          # Estilos da criação (NOVO)
│   └── view.css            # Estilos da visualização (NOVO)
│
├── js/
│   ├── storage.js          # Gerenciamento IndexedDB (NOVO)
│   ├── gallery.js          # Sistema de galeria (NOVO)
│   ├── link-generator.js   # Geração de links e QR (NOVO)
│   ├── create.js           # Lógica da criação (NOVO)
│   └── view.js             # Lógica da visualização (NOVO)
│
└── docs/
    ├── INSTRUCOES_USO.md   # Manual completo
    ├── INTEGRACAO.md       # Guia de integração
    └── RESUMO_IMPLEMENTACAO.md  # Resumo técnico
```

## ✅ Funcionalidades Implementadas

### PASSO 3 - Upload e Galeria
- ✅ Upload múltiplo de fotos (arraste ou clique)
- ✅ Pré-visualização antes de salvar
- ✅ Armazenamento usando IndexedDB
- ✅ Galeria completa com grid responsivo
- ✅ Remover fotos individualmente
- ✅ Contador de fotos
- ✅ Funciona 100% offline

### PASSO 4 - Link Único e QR Code
- ✅ Geração de ID único
- ✅ URL compartilhável: `view.html?id=SEU_ID`
- ✅ Salvamento automático no IndexedDB
- ✅ Carregamento pelo ID da URL
- ✅ Geração de QR Code
- ✅ Download do QR Code como PNG
- ✅ Copiar link para clipboard
- ✅ Modal com link e QR Code

## 🎯 Como Usar

### Criar uma Página
```
1. Acesse create.html
2. Preencha título, descrição e data
3. Adicione fotos (arraste ou clique)
4. Clique em "Finalizar e Gerar Link"
5. Copie o link ou baixe o QR Code
```

### Compartilhar
```
1. Envie o link gerado para outras pessoas
2. Ou imprima o QR Code para escanear
3. Acesse o link para ver a página
```

## 🔧 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno e responsivo
- **JavaScript Puro** - Sem frameworks
- **IndexedDB** - Armazenamento robusto
- **QRCode.js** - Geração de QR Codes (CDN)

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile e Desktop

## 🎨 Design

- Design moderno e clean
- Animações suaves
- Totalmente responsivo
- Interface intuitiva
- Cores: Gradiente roxo (#667eea → #764ba2)

## 📖 Documentação

- **[GUIA_RAPIDO.html](GUIA_RAPIDO.html)** - Guia visual interativo
- **[INSTRUCOES_USO.md](INSTRUCOES_USO.md)** - Manual completo de uso
- **[INTEGRACAO.md](INTEGRACAO.md)** - Guia de integração técnica
- **[RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md)** - Resumo técnico

## 🧪 Testar

1. **Teste Rápido**: Abra `EXEMPLO_TESTE.html`
2. **Criar Página**: Abra `create.html`
3. **Ver Guia**: Abra `GUIA_RAPIDO.html`

## 💡 Características

### Pontos Fortes
- ✅ Sem necessidade de backend
- ✅ Funciona offline
- ✅ Sem cadastro necessário
- ✅ Interface bonita e intuitiva
- ✅ Totalmente responsivo
- ✅ Suporta imagens grandes (10MB)
- ✅ Código limpo e organizado

### Limitações
- Os dados ficam salvos localmente no navegador
- Para compartilhar entre dispositivos diferentes, seria necessário backend
- Ideal para uso em um único dispositivo

## 🔄 Fluxo de Uso

```
Usuário → create.html
    ↓
Preenche informações
    ↓
Adiciona fotos
    ↓
Clica em "Finalizar"
    ↓
Sistema gera ID único
    ↓
Salva no IndexedDB
    ↓
Gera link: view.html?id=ABC123
    ↓
Gera QR Code
    ↓
Usuário compartilha
    ↓
Outros acessam view.html?id=ABC123
    ↓
Sistema carrega dados
    ↓
Exibe galeria
```

## 🎓 Próximos Passos (Opcional)

Para transformar em sistema completo:

1. Adicionar backend (Node.js + MongoDB)
2. Upload real de imagens (Cloudinary/AWS S3)
3. Sincronização entre dispositivos
4. Sistema de autenticação
5. Painel administrativo

## 📞 Suporte

Para dúvidas:
1. Leia a documentação
2. Verifique o console (F12)
3. Teste em modo anônimo
4. Limpe o cache se necessário

## ✨ Pronto para Usar!

O sistema está **100% funcional** e pronto para uso. Basta abrir `create.html` e começar!

---

**Desenvolvido com ❤️ para o projeto Eternize**
