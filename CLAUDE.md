# Site AMS Digital (digitalams.com.br) — briefing aprovado

Fonte de verdade desta refação. Se algo aqui divergir do painel antigo no Notion ("Painel de Construção — LP Institucional AMS Digital"), vale este arquivo. O painel antigo descreve a versão de LP com dois cards, que foi substituída.

## Como trabalhar
- Antes de qualquer tarefa com várias etapas, mostre um plano curto com estimativa de tokens e custo em R$ (preço oficial da API do modelo em uso, câmbio do dia) e espere o OK do Anderson. Pergunta simples se responde na hora.
- Todo texto do site passa pela skill humanizer.
- Use o Boss (chief-ai-orchestrator) para orquestrar. Ordem: Magiver, Pedrinho (CRO), R2 (copy), Lori (design), Julinha (construção), Joseph (tracking), Gigi (LGPD, antes de publicar).
- Nunca abra nem exiba arquivos `.env` ou credenciais. Segredos só no servidor, nunca no código público.
- Nada de dado real de aluno ou cliente em página pública.

## Objetivo
O site já está no ar em digitalams.com.br como landing page simples. Vamos refazer como site institucional de todos os serviços, com modelos e prova social dentro da própria página. Conversão principal: formulário e botão que abrem o WhatsApp.

## Marca
- Nome: **AMS Digital**, sem "MKT". Frase: **Estratégia, conversão e crescimento**.
- O logo atual traz "MKT DIGITAL" numa linha separada embaixo do símbolo. A Lori recorta essa linha e coloca a frase nova no mesmo estilo dourado.
- Paleta: dourado `#C9A227`, bronze `#9C7A1E`, champagne `#EFE3BE`, prata `#ACADA8`, off-white `#FAF9F6`, grafite `#17140F`, texto secundário `#5B564C`.
- Tipografia: Fraunces (títulos) e Inter (corpo). Hero em fundo escuro, resto em branco/off-white.
- Botão dourado leva texto grafite, não branco (contraste). Botão flutuante de WhatsApp no mobile.

## Stack e deploy
HTML/CSS/JS estático, sem framework, sem build. Cloudflare Pages com repositório no GitHub. Reaproveitar a arquitetura da CrisYoga: formulário vai para Google Sheets via Apps Script, com captura de UTM, depois redireciona para o WhatsApp com mensagem pré-preenchida. Cloudflare Pages aceita no máximo 25 MB por arquivo: imagens em WebP otimizado, sem vídeo pesado.

## Estrutura
1. **Home** (`/`): hero com faixa de clientes; 6 serviços em cards, cada um abre um painel na própria página (o que entrega, para quem serve, prazo médio, botão "Quero este"); galeria de modelos; clientes atendidos; como trabalhamos (4 passos); FAQ; formulário.
2. **Página do CRM** (`/crm-studios`): única página extra. Fora do menu, só abre pelo "Saiba mais" do card de CRM. Marcar `noindex` até o Anderson decidir o contrário.

Serviços da home: Sites institucionais; Landing pages de alta conversão (prontas para SEO e tráfego pago em Google, Meta e TikTok); Páginas com painel de leads; Tráfego pago; Gestão de loja no Mercado Livre; CRM para studios de Pilates e Yoga.

## Clientes citados (todos autorizados)
Orthoprime e Velox Seguros (assinaram contrato), CrisYoga e Studio Simone Santos. Falta confirmar o serviço entregue ao Orthoprime e o link, se houver. Velox: gestão de anúncios Meta.

## Modelos de páginas (sem sair da página)
Capturas em moldura de celular e notebook, ampliação na própria página, filtro: Captação simples, Funil, Com painel de leads. Não usar iframe dos sites reais (costuma ser bloqueado e deixa a página pesada). Só páginas públicas:
- crisyoga.com.br
- metodo-controle-consciente.netlify.app
- sermulher.programa4estacoes.com.br
- meditacaoutero.lovable.app
- studiosimonesantos.com.br (página que o aluno vê, não é o CRM)
- entre-lobas.lovable.app (só a página pública; o painel admin é mostrado só em apresentação ao vivo e nunca entra no site)

## Página do CRM
Tour clicável com telas fictícias (ex.: Ana Souza, Bruno Lima, Carla Dias, Diego Reis). Abas: Chamada (clicar no aluno marca presença), Alunos, Cobranças (exemplo de cobrança por Pix), Mensagens (modelo de confirmação de aula) e **Atendente IA**, marcada como Upgrade, com uma conversa de WhatsApp animada em HTML, sem API. O Atendente IA nunca aparece como parte do CRM: é produto à parte, vendido como upgrade.

**Decisão (19/11): site primeiro, tour em réplica HTML.** O site não espera o CRM ficar pronto. As telas do tour são refeitas em HTML/CSS/JS estático, no estilo visual do MVP (repositório `crm-studio-simone-santos`, só para consulta visual), com dados inventados. Sem Supabase, sem conta demo, sem login. Quando o CRM estiver finalizado, trocamos por capturas reais. Nunca usar dados do Studio Simone Santos.

Aviso: o MVP hoje tem Dashboard, Agenda, Financeiro e Cadastros (Alunos, Modalidades, Profissionais). Não tem tela de Mensagens (essa aba do tour é mock). "Chamada" provavelmente corresponde à Agenda.

## Fluxo de trabalho no Git
- Fonte única: este repositório. Branch de trabalho: `refacao-institucional`. A `main` é a LP antiga no ar: não fazer push nela até o Anderson aprovar.
- Cloudflare Pages gera prévia por branch: usar a prévia para validar antes de trocar a `main`.

## Preços no FAQ
Nunca escrever "sem mensalidade". Resposta por serviço:
- Sites e landing pages: pagamento único pelo projeto (confirmar com o Anderson se há plano de manutenção).
- Tráfego pago e gestão de loja: implantação uma vez, depois mensalidade de gestão.
- CRM e Atendente IA: assinatura mensal.
- Valores: "passamos na conversa".

## Tracking e LGPD
Eventos nomeados de forma consistente: clique no card de serviço (com o serviço), abertura do painel, "Saiba mais" do CRM, troca de aba da demo, envio do formulário, clique no WhatsApp. UTMs preservadas até o formulário. Gigi revisa formulário, texto de consentimento e política de privacidade antes de publicar.

## Critérios para dar como pronto
Mobile validado (sem rolagem horizontal), performance medida, SEO básico e Open Graph, eventos testados, formulário testado de ponta a ponta até o WhatsApp, console sem erros, domínio e SSL funcionando. "Está publicado" não é "está pronto".

## Pendências abertas
1. Capturas reais do CRM (só depois que o MVP for finalizado; por ora, tour em réplica HTML).
2. Serviço e link do Orthoprime.
3. Plano de manutenção de sites e landing pages: sim ou não.
4. Copy nova do site institucional (a copy da LP antiga serve só de referência; a frase "sem mensalidade" está proibida).
