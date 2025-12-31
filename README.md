# NotesApp

Uma aplicação de gerenciamento de notas moderna, rápida e elegante, construída com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Gestão de Notas**: Crie, edite, salve, arquive e exclua notas com facilidade.
- **Sistema de Tags**: Organize suas notas com tags coloridas e filtre-as instantaneamente.
- **Busca Global**: Encontre qualquer nota por título ou conteúdo através da barra de busca.
- **Internacionalização (i18n)**: Suporte completo para Inglês (EN) e Português (PT).
- **Roteamento Inteligente**: Estado totalmente sincronizado com a URL (filtros, busca e nota ativa).
- **Design Premium**: Interface baseada em "Neubrutalism", com foco em legibilidade e UX fluida.
- **Persistência Local**: Suas notas e tags são salvas automaticamente no `localStorage`.

## 🛠️ Tecnologias

- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS 4.0**
- **React Router 7**
- **Lucide React** (Ícones)
- **clsx & tailwind-merge** (Utilidades de CSS)

## 📦 Instalação

1. Clone o repositório ou baixe os arquivos.
2. No diretório do projeto, instale as dependências:
   ```bash
   npm install
   ```

## 💻 Desenvolvimento

Para rodar o projeto localmente:
```bash
npm run dev
```

## 🏗️ Build

Para gerar a versão de produção:
```bash
npm run build
```

## 📄 Estrutura do Projeto

- `src/components`: Componentes reutilizáveis da interface.
- `src/context`: Gerenciamento de estado global (Notas, Idioma).
- `src/types`: Definições de tipos TypeScript.
- `src/utils`: Funções utilitárias.
- `src/hooks`: Hooks customizados.
