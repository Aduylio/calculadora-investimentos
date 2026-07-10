# SPEC — Calculadora de Viabilidade de Compras (v0.6)

## 1. Nome do projeto

**Calculadora de Investimentos**

## 2. Objetivo

Criar uma aplicação simples, rápida e funcional para ajudar donos de farmácia a analisarem se uma oferta de fornecedor vale a pena.

A aplicação deve responder de forma objetiva:

**Essa compra vale mais do que deixar o dinheiro aplicado no banco?**

A ferramenta deve ajudar o usuário a decidir entre:

* Comprar.
* Comprar menos.
* Negociar preço ou prazo.
* Não comprar nessa condição.

## 3. Princípios do produto

### 3.1 Simplicidade

A aplicação deve ser simples e funcional, parecida com a experiência visual do site da Experiência Socfarm: direta, limpa e sem excesso de elementos.

Evitar:

* Visual de planilha.
* Muitos gráficos.
* Tabelas complexas.
* Excesso de números.
* Campos desnecessários.
* Linguagem financeira difícil.

### 3.2 Consulta em menos de 1 minuto

O usuário deve conseguir analisar uma oferta rapidamente.

A ferramenta deve ser útil em uma situação real de compra, por exemplo, quando o dono da farmácia está conversando com um fornecedor pelo WhatsApp e precisa decidir rápido se aquela oferta vale a pena.

### 3.3 Decisão antes de detalhe

O resultado deve mostrar primeiro a decisão principal.

Exemplo:

**Compra com atenção**

Depois, abaixo, a justificativa:

**Acima de 3 meses de estoque, o retorno estimado cai para 0,5% ao mês, enquanto uma aplicação segura no banco rende próximo de 0,9% ao mês.**

### 3.4 Configuração interna

O usuário não deve informar taxa mínima, meta mínima ou rendimento esperado.

A aplicação deve usar uma configuração interna:

**Rendimento bancário de referência: 0,9% ao mês**

Esse valor poderá ser alterado futuramente no código, mas não aparecerá como campo para o usuário no MVP.

---

## 4. Stack técnica

O projeto deve usar:

* Next.js com App Router.
* TypeScript.
* Tailwind CSS.
* React Hook Form.
* Zod.
* @hookform/resolvers.
* lucide-react.

Não usar neste MVP:

* Banco de dados.
* Login.
* Autenticação.
* Histórico de simulações.
* Exportação em PDF.
* Integração com ERP.
* Shadcn/UI.
* Bibliotecas externas de gráficos.
* Componentes visuais complexos.
* Bibliotecas de máscara.

---

## 5. Estrutura do projeto

O projeto usa pasta `src`.

A estrutura esperada é:

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css

  components/
    offer-form.tsx
    analysis-result.tsx
    result-card.tsx

  lib/
    investment-analysis.ts

  schemas/
    offer-schema.ts

  types/
    simulation.ts

docs/
  SPEC.md
```

---

## 6. Página principal

Arquivo:

```txt
src/app/page.tsx
```

Responsabilidades:

* Renderizar o layout principal.
* Controlar o estado do resultado da análise.
* Exibir o formulário.
* Exibir o resultado.
* Não conter regra de cálculo complexa.
* Chamar a função `analyzeInvestment`.

A página pode ser um componente client-side usando:

```tsx
"use client";
```

---

## 7. Componentes

### 7.1 OfferForm

Arquivo:

```txt
src/components/offer-form.tsx
```

Responsabilidades:

* Exibir o formulário da simulação.
* Usar React Hook Form.
* Usar validação com Zod.
* Enviar os dados válidos para a página principal.
* Manter o formulário simples, rápido e objetivo.

Campos (nesta ordem):

1. Preço médio de compra atual (obrigatório, moeda).
2. Preço da oferta (obrigatório, moeda).
3. Quantidade a ser comprada (obrigatório).
4. Demanda mensal atual (obrigatório).
5. Estoque atual do produto (obrigatório).
6. Prazo de pagamento (opcional).
7. Validade (opcional).

Campos de moeda devem mostrar "R$" como prefixo visual.

Botão principal:

**Analisar oferta**

### 7.2 AnalysisResult (v0.6)

Arquivo:

```txt
src/components/analysis-result.tsx
```

Responsabilidades:

* Exibir estado vazio quando ainda não houver análise.
* Exibir o resultado quando houver análise com máxima clareza e mínimo de ruído visual.
* Diagnóstico principal com título e subtexto dinâmico.
* 3 indicadores principais em cards.
* Bloco "Limites da quantidade analisada" com 3 critérios e estados visuais.
* Bloco de alertas com no máximo 2 itens práticos.
* Disclaimer discreto no rodapé.

Estrutura de exibição (nesta ordem):

1. Diagnóstico principal (result-status).
2. 3 cards de indicadores.
3. Bloco de limites da quantidade analisada.
4. Bloco de alertas (máximo 2).
5. Disclaimer.

Remover completamente (v0.5 → v0.6):

* Bloco "Resumo da análise" (azul).
* Lista longa de "Pontos de atenção".
* Card "Cobertura máxima dentro dos critérios".

Texto do estado vazio:

**Preencha os dados da oferta para descobrir se essa compra vale a pena.**

### 7.3 ResultCard

Arquivo:

```txt
src/components/result-card.tsx
```

Responsabilidades:

* Exibir cards compactos de indicador.
* Receber título, valor e descrição opcional.
* Ser reutilizável.

Cards principais (v0.6):

* Cobertura total após a compra.
* Retorno mensal estimado.
* Economia total estimada.

### 7.4 CriterionCard

Componente inline dentro de `analysis-result.tsx`.

Responsabilidades:

* Exibir um critério do bloco "Limites da quantidade analisada".
* Receber: título, valor (unidades), descrição curta, status.
* Status com ícone e texto: Dentro do limite, Próximo do limite, Acima do limite, Não informado.
* Receber flag `isMostRestrictive` para destaque visual do critério mais restritivo.

---

## 8. Tipos TypeScript

Arquivo:

```txt
src/types/simulation.ts
```

Criar os seguintes tipos:

```ts
export type RiskLevel = "healthy" | "attention" | "not_recommended";

export type CashFlowAlertLevel = "none" | "comfortable" | "attention" | "high_attention";

export type LimitingFactor = "financial" | "validity" | "cash_flow";

export type PurchaseSimulationInput = {
  averagePurchasePrice: number;
  offerPrice: number;
  offerQuantity: number;
  paymentTermDays?: number;
  monthlyDemand: number;
  currentStock: number;
  expirationMonths?: number;
};

export type PurchaseSimulationResult = {
  riskLevel: RiskLevel;
  diagnosis: string;
  normalPurchaseValue: number;
  offerPurchaseValue: number;
  totalSavings: number;
  savingsPercentage: number;
  estimatedTurnoverMonths: number;
  monthlyReturnPercentage: number;
  financialLimitMonths: number;
  validityLimitMonths?: number;
  cashFlowLimitMonths?: number;
  finalHealthyLimitMonths: number;
  limitingFactor: LimitingFactor;
  validitySafetyMarginMonths?: number;
  maxHealthyPurchaseQuantity: number;
  bankReferencePercentage: number;
  interpretation: string;
  recommendation: string;
  paymentTermMonths?: number;
  cashGapMonths?: number;
  unitsSoldUntilPayment?: number;
  remainingStockAtPayment?: number;
  soldPercentageUntilPayment?: number;
  cashFlowAlertLevel?: CashFlowAlertLevel;
  cashFlowMessage?: string;
};
```

---

## 9. Schema de validação

Arquivo:

```txt
src/schemas/offer-schema.ts
```

Usar Zod para validar os campos.

Regras:

* Preço médio de compra atual: obrigatório, maior que zero.
* Preço da oferta: obrigatório, maior que zero.
* Preço da oferta deve ser menor que o preço médio de compra atual.
* Quantidade a ser comprada: obrigatório, maior que zero.
* Demanda mensal atual: obrigatório, maior que zero.
* Estoque atual do produto: obrigatório, zero ou maior.
* Prazo de pagamento: opcional. Se preenchido, deve ser zero ou maior.
* Validade: opcional. Se preenchida, deve ser maior que zero.

Mensagens devem estar em português.

Exemplos:

* "Informe um valor maior que zero."
* "A demanda mensal precisa ser maior que zero."
* "O preço da oferta precisa ser menor que o preço médio de compra."

---

## 10. Motor de análise (v0.5)

Arquivo:

```txt
src/lib/investment-analysis.ts
```

Criar uma função:

```ts
export function analyzeInvestment(input: PurchaseSimulationInput): PurchaseSimulationResult
```

Constantes internas:

```ts
const BANK_REFERENCE_MONTHLY_RETURN = 0.009;
const MIN_SOLD_PERCENTAGE_UNTIL_PAYMENT = 0.5;
```

`BANK_REFERENCE_MONTHLY_RETURN` representa **0,9% ao mês**.

`MIN_SOLD_PERCENTAGE_UNTIL_PAYMENT` representa o percentual mínimo de mercadoria que deve ser vendida até o vencimento do boleto (50%).

### 10.1 Conceito da v0.2

A economia percentual deve ser calculada sobre o **valor normal da compra**, e não sobre o valor pago na oferta.

Isso corrige a distorção da v0.1, onde a economia percentual era calculada sobre o valor investido (preço da oferta × quantidade), que fazia o percentual parecer maior do que realmente era.

Exemplo:

* Preço médio de compra: R$ 10,00
* Preço da oferta: R$ 8,00
* Quantidade: 100 unidades
* Valor normal da compra: R$ 1.000,00
* Valor da compra na oferta: R$ 800,00
* Economia real: R$ 200,00
* Economia percentual real: 20% (e não 25% como na v0.1)

### 10.2 Regras de cálculo (v0.2)

1. Valor normal da compra:

```txt
preço médio de compra atual × quantidade a ser comprada
```

2. Valor da compra na oferta:

```txt
preço da oferta × quantidade a ser comprada
```

3. Economia total estimada:

```txt
valor normal da compra - valor da compra na oferta
```

4. Economia percentual:

```txt
economia total estimada / valor normal da compra
```

5. Estoque total após a compra:

```txt
estoque atual do produto + quantidade a ser comprada
```

6. Tempo estimado de giro:

```txt
estoque total após a compra / demanda mensal atual
```

7. Retorno mensal estimado:

```txt
economia percentual / tempo estimado de giro
```

8. Limite saudável financeiro em meses:

```txt
economia percentual / 0,009
```

9. Quantidade máxima saudável:

```txt
Math.max(0, Math.floor(demanda mensal atual × limite saudável financeiro em meses - estoque atual do produto))
```

10. Comparação com aplicação bancária:

```txt
retorno mensal estimado versus 0,9% ao mês
```

### 10.3 Análise de fluxo de caixa (v0.3)

Quando o usuário informar o prazo de pagamento, a aplicação deve analisar se o boleto vence antes de o estoque girar completamente.

Essa análise **não substitui** o diagnóstico principal da compra. Ela aparece como um alerta complementar abaixo dos cards de resultado.

#### 10.3.1 Cálculos de fluxo de caixa

1. Prazo de pagamento em meses:

```txt
prazo de pagamento em dias / 30
```

2. Diferença entre giro e prazo (cash gap):

```txt
tempo estimado de giro - prazo de pagamento em meses
```

3. Unidades vendidas até o vencimento do boleto:

```txt
demanda mensal atual × prazo de pagamento em meses
```

4. Estoque restante no vencimento:

```txt
Math.max(0, estoque total após a compra - unidades vendidas até o pagamento)
```

5. Percentual do estoque vendido até o pagamento:

```txt
Math.min(1, unidades vendidas até o pagamento / estoque total após a compra)
```

#### 10.3.2 Classificação do alerta de caixa

* Se prazo de pagamento não informado: `cashFlowAlertLevel = "none"`
* Se prazo em meses >= tempo estimado de giro: `cashFlowAlertLevel = "comfortable"`
* Se prazo em meses < tempo estimado de giro (mas >= 40%): `cashFlowAlertLevel = "attention"`
* Se prazo em meses < 40% do tempo estimado de giro: `cashFlowAlertLevel = "high_attention"`

#### 10.3.3 Mensagens de fluxo de caixa

**Confortável:**
"O prazo de pagamento cobre o tempo estimado de giro. Com a demanda atual, o estoque tende a ser vendido antes do vencimento do boleto."

**Atenção:**
"O boleto vence em {dias} dias, mas o estoque deve levar cerca de {meses} meses para girar. Até o vencimento, a previsão é vender cerca de {unidades} unidades. Ainda restarão aproximadamente {restante} unidades em estoque. Garanta que a farmácia tenha caixa para pagar o fornecedor sem depender exclusivamente dessa venda."

**Atenção forte:**
"O prazo de pagamento é muito menor que o tempo estimado de giro. Mesmo com boa economia, essa compra pode apertar o caixa se a farmácia não tiver capital disponível."

### 10.4 Análise multicritério do limite saudável (v0.5)

O cálculo de "Limite saudável de compra" utiliza três limites independentes. O limite final é o menor dos limites aplicáveis.

#### 10.4.1 Limite financeiro por rentabilidade

```txt
financialLimitMonths = savingsPercentage / BANK_REFERENCE_MONTHLY_RETURN
```

#### 10.4.2 Limite por validade

Aplicar apenas quando `expirationMonths` estiver preenchido.

Margem de segurança:

```txt
validitySafetyMarginMonths = clamp(expirationMonths * 0.20, 2, 4)
```

Onde `clamp` significa mínimo de 2 meses e máximo de 4 meses.

Limite:

```txt
validityLimitMonths = Math.max(0, expirationMonths - validitySafetyMarginMonths)
```

Se `expirationMonths` não estiver preenchido: `validityLimitMonths` deve ser `undefined`.

#### 10.4.3 Limite por fluxo de caixa

Aplicar apenas quando `paymentTermDays` estiver preenchido.

```txt
paymentTermMonths = paymentTermDays / 30
cashFlowLimitMonths = paymentTermMonths / MIN_SOLD_PERCENTAGE_UNTIL_PAYMENT
```

Se `paymentTermDays` não estiver preenchido: `cashFlowLimitMonths` deve ser `undefined`.

#### 10.4.4 Limite final multicritério

Criar lista apenas com limites aplicáveis e calcular:

```txt
finalHealthyLimitMonths = Math.min(...applicableLimits)
```

Identificar o fator limitante:

* `limitingFactor`: `"financial"` | `"validity"` | `"cash_flow"`

Em caso de empate, prioridade: validade > fluxo de caixa > rentabilidade.

#### 10.4.5 Quantidade máxima multicritério

```txt
maxHealthyPurchaseQuantity = Math.max(0, Math.floor(monthlyDemand * finalHealthyLimitMonths - currentStock))
```

A quantidade representa quantidade adicional de compra, não estoque total.

---

## 11. Classificação

### Compra saudável

Classificar como **Compra saudável** quando:

* O retorno mensal estimado for maior que 0,9% ao mês.

Texto:

**Compra saudável**

### Compra com atenção

Classificar como **Compra com atenção** quando:

* O retorno mensal estimado estiver próximo de 0,9% ao mês (acima de ~0,8%).
* O tempo de giro estiver alto.
* A validade estiver relativamente apertada (próximo do vencimento).
* A compra ainda pode fazer sentido, mas exige cuidado.

Texto:

**Compra com atenção**

### Compra não recomendada

Classificar como **Compra não recomendada** quando:

* O retorno mensal estimado for menor que 0,9% ao mês.
* O estoque projetado ficar alto demais.
* O produto correr risco de vencer antes do giro.
* O dinheiro ficar menos eficiente no estoque do que em uma aplicação segura.

Texto:

**Compra não recomendada**

---

## 12. Mensagens interpretativas

A aplicação deve sempre retornar uma frase simples e prática.

A mensagem deve ser dinâmica, incluindo valores calculados como economia percentual, tempo de giro e retorno mensal.

### Exemplo de compra saudável

**Essa oferta gera uma economia de 20% em relação ao preço médio de compra. Como o estoque gira em cerca de 2 meses, o retorno estimado é de aproximadamente 10% ao mês, acima da aplicação segura de referência de 0,9% ao mês.**

### Exemplo de compra com atenção (validade apertada)

**Essa oferta exige cuidado. O tempo estimado de giro de X meses está próximo da validade do produto. O retorno estimado de X% ao mês está abaixo da referência de 0,9% ao mês.**

### Exemplo de compra com atenção (retorno próximo)

**Essa oferta gera uma economia de X% em relação ao preço médio de compra, mas o retorno estimado de X% ao mês está próximo da aplicação segura de referência de 0,9% ao mês. Avalie com cuidado.**

### Exemplo de compra não recomendada

**Nessa quantidade, o retorno estimado fica em 0,67% ao mês, abaixo da aplicação segura de referência de 0,9% ao mês. Pode fazer mais sentido reduzir a quantidade ou manter o dinheiro aplicado.**

---

## 13. Recomendação prática

A aplicação deve retornar uma recomendação final.

Possíveis recomendações:

* **Comprar nessa quantidade.**
* **Comprar menos unidades.**
* **Negociar um preço menor.**
* **Negociar um prazo maior.**
* **Evitar a compra nessa condição.**

A recomendação deve ser objetiva e escrita em linguagem simples.

---

## 14. Layout

### 14.1 Desktop

Usar duas colunas:

Coluna esquerda:

* Formulário.

Coluna direita:

* Resultado da análise.

### 14.2 Mobile

Usar coluna única:

1. Título.
2. Subtítulo.
3. Formulário.
4. Resultado.

### 14.3 Aparência

Visual simples:

* Fundo claro.
* Cards brancos.
* Bordas suaves.
* Botão principal vermelho.
* Textos objetivos.
* Poucos elementos decorativos.
* Sem gráficos.
* Sem tabela extensa.

A aplicação deve priorizar usabilidade, não estética avançada.

---

## 15. Textos fixos da interface

Título:

**Calculadora de Investimentos**

Subtítulo:

**Descubra se essa compra vale mais do que deixar o dinheiro no banco.**

Título do formulário:

**Dados da oferta**

Título secundário do formulário:

**Informe os principais dados da compra para analisar se essa oferta vale a pena.**

Botão:

**Analisar oferta**

Texto vazio do resultado:

**Preencha os dados da oferta para descobrir se essa compra vale a pena.**

Texto sobre banco:

**Referência usada: aplicação segura rendendo próximo de 0,9% ao mês.**

---

## 16. UX do formulário

O formulário deve ser rápido de preencher.

Regras de usabilidade:

* Usar labels claras.
* Usar placeholders simples.
* Não usar textos longos embaixo de cada campo.
* Não dividir em muitas etapas.
* Não exigir cadastro.
* Não abrir modal.
* Não usar wizard.
* Mostrar erros de validação próximos aos campos.
* Manter o botão de análise bem visível.
* Campos de moeda devem mostrar "R$" como prefixo visual.
* Campos opcionais preenchidos devem mostrar o sufixo "dias" ou "meses".

---

## 17. Campos, labels e placeholders

### Preço médio de compra atual

Label:

**Preço médio de compra atual**

Placeholder:

**Ex: 10,50**

Prefixo visual "R$".

### Preço da oferta

Label:

**Preço da oferta**

Placeholder:

**Ex: 8,90**

Prefixo visual "R$".

### Quantidade a ser comprada

Label:

**Quantidade a ser comprada**

Placeholder:

**Ex: 100**

### Demanda mensal atual

Label:

**Demanda mensal atual**

Placeholder:

**Ex: 50**

### Estoque atual do produto

Label:

**Estoque atual do produto**

Placeholder:

**Ex: 20**

### Prazo de pagamento

Label:

**Prazo de pagamento**

Placeholder:

**Ex: 30**

Campo opcional. Se preenchido, mostrar "dias" ao lado.

### Validade

Label:

**Validade**

Placeholder:

**Ex: 12**

Campo opcional. Se preenchido, mostrar "meses" ao lado.

---

## 18. Formatação de valores

Valores monetários devem ser exibidos em Real brasileiro.

Exemplo:

```txt
R$ 850,00
```

Percentuais devem ser exibidos com no máximo duas casas decimais.

Exemplo:

```txt
1,35% ao mês
```

Meses devem ser exibidos com no máximo uma casa decimal.

Exemplo:

```txt
3,2 meses
```

Quantidades inteiras devem usar separador de milhar no formato brasileiro.

Exemplo:

```txt
1.110 unidades
```

---

## 19. Tratamento de campos de moeda

Campos de moeda (Preço médio de compra atual, Preço da oferta):

* Mostrar "R$" como prefixo visual dentro do campo.
* Aceitar digitação com vírgula ou ponto como separador decimal.
* Aceitar valores como "10,50", "10.50" ou "R$ 10,50".
* Converter corretamente para número antes da validação e do cálculo.
* Não usar biblioteca externa de máscara.

---

## 20. Critérios de aceite (v0.6)

A aplicação será considerada pronta quando:

* A página carregar sem erro.
* O formulário aparecer corretamente na ordem especificada.
* Campos de moeda exibirem "R$" como prefixo visual.
* A validação impedir dados inválidos com mensagens em português.
* O botão "Analisar oferta" gerar um resultado.
* O resultado exibir diagnóstico principal com título e subtexto dinâmico.
* O resultado exibir no máximo 3 cards de indicadores.
* O resultado exibir bloco "Limites da quantidade analisada" com 3 critérios.
* Cada critério exibir: nome, quantidade em unidades, descrição curta, status.
* Cada critério comparar a quantidade informada com o limite daquele critério.
* O critério mais restritivo receber destaque visual discreto.
* O resultado exibir no máximo 2 alertas práticos.
* Nenhum alerta redundante (não repetir a mesma conclusão).
* Bloco "Resumo da análise" removido.
* Lista longa de "Pontos de atenção" removida.
* O cálculo usar o valor normal da compra como base para a economia percentual.
* Disclaimer exibido no rodapé.
* A aplicação funcionar no desktop.
* A aplicação funcionar no mobile.

### Testes manuais obrigatórios (v0.2)

#### Teste 1
Preço médio 10, oferta 8, quantidade 100, demanda 50, estoque 0.
Esperado: Economia R$ 200,00 | 20% | 2 meses | 10% a.m. | Limite 22,2 meses

#### Teste 2
Preço médio 10, oferta 8, quantidade 1500, demanda 50, estoque 0.
Esperado: 20% | 30 meses | 0,67% a.m. | Compra não recomendada

#### Teste 3
Preço médio 10, oferta 9,80, quantidade 300, demanda 50, estoque 0.
Esperado: 2% | 6 meses | 0,33% a.m. | Compra não recomendada

#### Teste 4
Preço médio 10, oferta 10, quantidade 100, demanda 50, estoque 0.
Esperado: Erro de validação

### Testes manuais obrigatórios (v0.3)

#### Teste 5 (fluxo de caixa — atenção)
Preço médio 10, oferta 8, quantidade 100, demanda 50, estoque 0, prazo 45 dias.
Esperado: Giro 2 meses, prazo 1,5 mês, alerta de caixa "atenção"

#### Teste 6 (fluxo de caixa — confortável)
Preço médio 10, oferta 8, quantidade 100, demanda 50, estoque 0, prazo 90 dias.
Esperado: Giro 2 meses, prazo 3 meses, alerta de caixa "confortável"

#### Teste 7 (fluxo de caixa — atenção forte)
Preço médio 10, oferta 8, quantidade 650, demanda 50, estoque 0, prazo 45 dias.
Esperado: Giro 13 meses, prazo 1,5 mês, alerta de caixa "high_attention"

### Testes manuais obrigatórios (v0.5 — análise multicritério)

#### Teste 8 (referência multicritério — fluxo de caixa limitante)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 0, prazo 60 dias, validade 20 meses.
Esperado:
- Limite financeiro: 22,2 meses
- Limite validade: 16 meses
- Limite caixa: 4 meses
- Limite final: 4 meses
- Máximo: 100 unidades
- Fator: fluxo de caixa

#### Teste 9 (validade limitante)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 0, prazo vazio, validade 20 meses.
Esperado:
- Limite financeiro: 22,2 meses
- Limite validade: 16 meses
- Limite caixa: não aplicável
- Limite final: 16 meses
- Máximo: 400 unidades
- Fator: validade

#### Teste 10 (rentabilidade limitante)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 0, prazo vazio, validade vazia.
Esperado:
- Limite financeiro: 22,2 meses
- Limite final: 22,2 meses
- Máximo aproximado: 555 unidades
- Fator: rentabilidade

#### Teste 11 (rentabilidade limitante com prazo e validade)
Preço médio 10, oferta 9,80, quantidade 100, demanda 25, estoque 0, prazo 180 dias, validade 24 meses.
Esperado:
- Economia percentual: 2%
- Limite financeiro: aproximadamente 2,2 meses
- Limite validade: 20 meses
- Limite caixa: 12 meses
- Limite final: aproximadamente 2,2 meses
- Fator: rentabilidade

#### Teste 12 (estoque atual reduzindo quantidade máxima)
Mesmo cenário do teste 8, mas estoque atual 20.
Esperado:
- Limite final: 4 meses
- Estoque total permitido: 100 unidades
- Quantidade adicional máxima: 80 unidades

### Resultados dos testes (v0.5)

Todos os testes foram executados com sucesso:

| Teste | Limite financeiro | Limite validade | Limite caixa | Limite final | Máximo | Fator |
|-------|------------------|-----------------|--------------|--------------|--------|-------|
| 8 | 22,2 meses | 16,0 meses | 4,0 meses | 4,0 meses | 100 unid. | cash_flow |
| 9 | 22,2 meses | 16,0 meses | — | 16,0 meses | 400 unid. | validity |
| 10 | 22,2 meses | — | — | 22,2 meses | 555 unid. | financial |
| 11 | 2,2 meses | 20,0 meses | 12,0 meses | 2,2 meses | — | financial |
| 12 | 22,2 meses | 16,0 meses | 4,0 meses | 4,0 meses | 80 unid. | cash_flow |

### Testes manuais obrigatórios (v0.6 — simplificação visual)

#### Teste 13 (referência v0.6 — boleto limitante)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 20, prazo 60, validade 24.
Esperado:
- diagnóstico: "Oferta rentável, mas a quantidade exige atenção"
- cobertura total: 4,8 meses
- retorno mensal: 4,17%
- economia: R$ 200,00
- critério rentabilidade: 555 unidades, dentro do limite
- critério validade: 400 unidades, dentro do limite
- critério boleto: 80 unidades, 20 unidades acima do limite
- boleto é o mais restritivo
- no máximo 2 alertas

#### Teste 14 (quantidade dentro do limite)
Mesmo cenário, quantidade 80.
Esperado:
- boleto: dentro do limite
- nenhum alerta de quantidade acima
- diagnóstico saudável ou conforme a regra atual

#### Teste 15 (sem prazo de pagamento)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 20, validade 24.
Esperado:
- critério boleto: "Não informado"
- não limita a análise
- nenhum alerta de caixa

#### Teste 16 (sem validade)
Preço médio 10, oferta 8, quantidade 100, demanda 25, estoque 20, prazo 60.
Esperado:
- critério validade: "Não informado"
- não limita a análise

#### Teste 17 (rentabilidade limitante)
Preço médio 10, oferta 9,80, quantidade 100, demanda 25, estoque 0, prazo 180, validade 24.
Esperado:
- critério mais restritivo: rentabilidade
- alerta relacionado à baixa atratividade

---

## 21. Design system (v0.4)

### 21.1 Variáveis globais (globals.css)

A aplicação utilza variáveis CSS definidas em `:root` para garantir consistência visual.

```css
:root {
  --page-bg: #f8fafc;
  --surface: #ffffff;

  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  --border: #dfe5ec;
  --border-soft: #e9edf2;

  --brand-orange: #ffb000;
  --brand-orange-hover: #f59e0b;
  --brand-orange-soft: #fff7df;

  --success: #16a34a;
  --success-dark: #087a2f;
  --success-bg: #f0fdf4;
  --success-border: #4ade80;

  --info: #1677ff;
  --info-bg: #f3f8ff;
  --info-border: #bfdbfe;

  --warning: #d97706;
  --warning-bg: #fffbeb;
  --warning-border: #f6d365;

  --purple: #9333ea;
  --purple-bg: #f6edff;

  --shadow-card: 0 2px 4px rgba(15,23,42,0.03), 0 10px 30px rgba(15,23,42,0.05);

  --radius-panel: 14px;
  --radius-card: 12px;
  --radius-input: 8px;
}
```

### 21.2 Fonte

A aplicação utiliza a fonte **Inter** (via `next/font/google`).

### 21.3 Tipografia

* Títulos de painel: 18px, peso 700.
* Labels de campo: 13px, peso 500.
* Valores de indicador: 22px, peso 700.
* Texto de descrição: 14px, peso 400.
* Texto auxiliar: 12px.
* Disclaimer: 12px, cor `var(--text-muted)`.

---

## 22. Layout (v0.4)

### 22.1 Estrutura geral

* Largura máxima: 1440px.
* Padding: 24px.
* Layout principal: CSS Grid com duas colunas (40% formulário, 60% análise).

### 22.2 Cabeçalho

* Logo Farmstok à esquerda (ou texto identificatório quando imagem não disponível).
* Divisor vertical.
* Título: "Calculadora de Viabilidade de Compras".
* Subtítulo: "Analise se a oferta faz sentido para o caixa, giro e rentabilidade da farmácia."
* Sem menu, avatar, notificações ou navegação adicional.

### 22.3 Painéis

* Background: `var(--surface)`.
* Border: 1px solid `var(--border)`.
* Border-radius: `var(--radius-panel)`.
* Box-shadow: `var(--shadow-card)`.
* Padding: 24px.
* Cabeçalho com ícone circular (52×52px) e título + descrição.

### 22.4 Formulário

* Grade de duas colunas (`column-gap: 42px`, `row-gap: 28px`).
* Campo "Produto" ocupa largura completa.
* Campos com labels, ícones de informação (tooltip), prefixos/sufixos visuais.
* Altura dos inputs: 56px.
* Botões: "Limpar dados" (secundário) e "Analisar investimento" (primário, laranja).
* Ação de limpar solicita confirmação quando há dados.

### 22.5 Indicadores

* Grade 2×2 com cards coloridos.
* Cada card tem ícone, título, valor principal e descrição opcional.

### 22.6 Alerta principal (ResultStatus)

* Muda cor e ícone conforme o risco: verde (saudável), amarelo (atenção), vermelho (fora dos parâmetros).
* Inclui título e descrição dinâmica.

---

## 23. Responsividade (v0.4)

### Desktop (>1050px)

* Duas colunas: formulário à esquerda, análise à direita.

### Tablet (≤1050px)

* Uma coluna.
* Scroll suave até o painel de análise ao analisar (mobile).

### Mobile (≤700px)

* Cabeçalho compacto (padding 12px 18px, gap 16px).
* Logo menor (42px).
* Divisor oculto.
* Título: 21px.
* Formulário em uma coluna.
* Indicadores em uma coluna.
* Botões em uma coluna.
* Painéis com padding 18px.

Ordem no mobile:

1. Cabeçalho.
2. Painel de dados.
3. Botões.
4. Painel de análise.
5. Diagnóstico principal.
6. Indicadores (3 cards).
7. Limites da quantidade analisada (1 coluna).
8. Alertas (máximo 2).
9. Aviso legal.

---

## 24. Acessibilidade (v0.4)

* Todo input associado a label via `htmlFor`/`id`.
* `aria-label` nos botões de tooltip.
* `aria-hidden="true"` em ícones decorativos.
* `aria-live="polite"` no container de resultado.
* `aria-invalid` nos campos com erro.
* `aria-describedby` apontando para mensagem de erro.
* Tooltip acessível por foco (hover e focus-visible).
* Foco visível nos botões (`focus-visible` com outline).
* Contraste adequado entre texto e fundo.
* Navegação por teclado completa.
* Setas visuais de inputs numéricos removidas via CSS.
* Estados comunicados por texto e ícone, não apenas por cor.

---

## 25. Formatação brasileira (v0.4)

Todos os resultados utilizam `Intl.NumberFormat` com locale `pt-BR`:

* Moeda: `R$ 200,00`
* Meses: `5,0 meses`
* Percentual: `4,00%`
* Quantidade: `1.110 unidades`

Nunca exibir formatos como `5.0 meses` ou `4.00%` (formato americano).

---

## 26. Atenções condicionais (v0.6)

A lista longa de "Pontos de atenção" foi removida na v0.6.

Em substituição, a aplicação exibe no máximo 2 alertas práticos consolidados, priorizando:

1. Quantidade acima do limite de validade.
2. Quantidade acima do limite de fluxo de caixa.
3. Quantidade acima do limite de rentabilidade.
4. Risco de vencer antes do giro.
5. Estoque restante no vencimento do boleto.
6. Retorno mensal abaixo de 0,9%.

Cada alerta deve ser claro, direto e evitar repetir informações já presentes no diagnóstico ou nos cards.

---

## 27. Resumo da análise (v0.4 → removido na v0.6)

Este bloco foi removido na versão 0.6 para simplificar a coluna de análise.

A informação que estava neste bloco foi consolidada no subtexto do diagnóstico principal.

---

## 28. Aviso legal (v0.4)

Exibido no rodapé do painel de análise com ícone Info:

"Os cálculos são estimativas com base nas informações fornecidas e não substituem a análise completa do seu cenário financeiro."

---

## 29. Fora do escopo do MVP

Não implementar agora:

* Login.
* Cadastro de farmácias.
* Histórico de simulações.
* Banco de dados.
* Supabase.
* Dashboard.
* Exportação em PDF.
* Gráficos.
* Comparação entre múltiplas ofertas.
* Integração com planilhas.
* Integração com ERP.
* Configuração editável da taxa bancária pelo usuário.
* Bibliotecas de máscara para campos.

---

## 30. Diretriz para agentes de IA

Ao implementar esta SPEC:

* Não alterar o escopo sem necessidade.
* Não instalar bibliotecas novas sem autorização.
* Não criar componentes desnecessários.
* Não criar telas extras.
* Não criar banco de dados.
* Não transformar a aplicação em dashboard.
* Não usar gráficos.
* Não usar linguagem excessivamente técnica na interface.
* Manter a aplicação simples, objetiva e rápida.

O foco é:

**Formulário simples + análise clara + recomendação prática.**

---

## 31. Diagnóstico principal (v0.6)

O diagnóstico é o primeiro elemento da análise. Deve ser coerente com a análise multicritério.

### 31.1 Títulos possíveis

1. **0 critérios ultrapassados:**
   "Oferta dentro dos parâmetros analisados"

2. **1 critério ultrapassado:**
   "Oferta exige atenção"

3. **2 ou mais critérios ultrapassados:**
   "Não vale a pena nessa quantidade"

### 31.2 Regras de seleção

A classificação é baseada na **quantidade de critérios aplicáveis ultrapassados** pela quantidade informada:

* 0 critérios ultrapassados: "Oferta dentro dos parâmetros analisados"
* 1 critério ultrapassado: "Oferta exige atenção"
* 2 ou mais critérios ultrapassados: "Não vale a pena nessa quantidade"

Critérios considerados:

* Rentabilidade (sempre aplicável).
* Validade (apenas se `expirationMonths` informado).
* Fluxo de caixa (apenas se `paymentTermDays` informado).

### 31.3 Subtexto dinâmico

O subtexto é gerado automaticamente com base nos critérios ultrapassados.

**0 critérios ultrapassados:**
"Todos os critérios estão dentro dos limites."

**1 critério ultrapassado:**
"A quantidade informada ultrapassa o limite definido {critério}. Reduzir a quantidade pode ser uma opção."

Exemplo com validade:
"A quantidade informada ultrapassa o limite definido pela validade. Reduzir a quantidade pode ser uma opção."

**2 ou mais critérios ultrapassados:**
"A quantidade informada ultrapassa os limites definidos {critérios}. Reduzir a quantidade é necessário para que a oferta volte a ficar dentro dos parâmetros analisados."

Exemplos:

* Rentabilidade e fluxo de caixa:
  "A quantidade informada ultrapassa os limites definidos pela rentabilidade e pelo fluxo de caixa."

* Rentabilidade, validade e fluxo de caixa:
  "A quantidade informada ultrapassa os limites definidos pela rentabilidade, pela validade e pelo fluxo de caixa."

* Validade e fluxo de caixa:
  "A quantidade informada ultrapassa os limites definidos pela validade e pelo fluxo de caixa."

### 31.4 Preposições corretas

Usar sempre:

* "pela rentabilidade"
* "pela validade"
* "pelo fluxo de caixa"

Nunca usar:

* "por a rentabilidade"
* "por a validade"
* "por o fluxo de caixa"

### 31.5 Restrições de linguagem

Nunca usar:

* Compre
* Pode comprar
* Comprar nessa quantidade
* Aproveite a oferta

---

## 32. Indicadores principais (v0.6)

Manter apenas 3 cards principais:

### 32.1 Cobertura total após a compra

Valor:

```txt
(estoque atual + quantidade a ser comprada) / demanda mensal
```

Descrição:

"Considerando o estoque atual e a nova quantidade."

### 32.2 Retorno mensal estimado

Valor: `monthlyReturnPercentage` formatado como percentual.

### 32.3 Economia total estimada

Valor: `totalSavings` formatado como moeda.

---

## 33. Bloco de limites da quantidade analisada (v0.6)

Título do bloco:

**Limites da quantidade analisada**

Criar um bloco com 3 colunas no desktop e 1 coluna no mobile.

### 33.1 Critério 1: Quantidade até o retorno ficar abaixo do banco

Título:

**Quantidade até o retorno ficar abaixo do banco**

Valor:

```txt
Math.max(0, Math.floor(monthlyDemand * financialLimitMonths - currentStock))
```

Descrição curta:

"Acima desse ponto, o retorno mensal fica abaixo da referência de 0,9%."

### 33.2 Critério 2: Quantidade até uma validade segura

Título:

**Quantidade até uma validade segura**

Valor:

```txt
Math.max(0, Math.floor(monthlyDemand * validityLimitMonths - currentStock))
```

Se `validityLimitMonths` não estiver preenchido:

Valor: "Não informado"

Descrição:

"Preencha a validade para incluir este critério."

Descrição curta (quando preenchido):

"Considera a margem de segurança definida antes do vencimento."

### 33.3 Critério 3: Quantidade até o vencimento do boleto

Título:

**Quantidade até o vencimento do boleto**

Valor:

```txt
Math.max(0, Math.floor(monthlyDemand * cashFlowLimitMonths - currentStock))
```

Se `cashFlowLimitMonths` não estiver preenchido:

Valor: "Não informado"

Descrição:

"Preencha o prazo para incluir este critério."

Descrição curta (quando preenchido):

"Considera o volume que pode ser sustentado dentro do prazo informado."

### 33.4 Estados de cada critério

Comparar `purchaseQuantity` com o limite do critério:

1. **Dentro do limite:**
   Se `purchaseQuantity <= criterionLimit`
   Texto: "Dentro do limite"
   Ícone: Check (verde)

2. **Próximo do limite:**
   Se `purchaseQuantity` estiver entre 90% e 100% do limite (inclusive 100%)
   Texto: "Próximo do limite"
   Ícone: TriangleAlert (amarelo)

3. **Acima do limite:**
   Se `purchaseQuantity > criterionLimit`
   Texto: "{X} unidades acima do limite"
   Onde X = `purchaseQuantity - criterionLimit`
   Ícone: X (vermelho)

### 33.5 Destaque do critério mais restritivo

O critério com o menor limite (entre os aplicáveis) recebe destaque visual discreto.

Em vez de "fator limitante", usar:

"Este foi o critério mais restritivo da análise."

---

## 34. Alertas práticos (v0.6)

Criar apenas um bloco de alertas com no máximo 2 itens.

### 34.1 Título dinâmico

Depende do conteúdo dos alertas:

* "Atenção ao caixa" (se houver alerta de fluxo de caixa).
* "Atenção à validade" (se houver alerta de validade).
* "Atenção à rentabilidade" (se houver alerta de rentabilidade).
* "Pontos de atenção" (se nenhum dos anteriores se aplicar).

### 34.2 Prioridade dos alertas

Selecionar os dois alertas mais relevantes nesta ordem:

1. Quantidade acima do limite de validade.
2. Quantidade acima do limite de fluxo de caixa.
3. Quantidade acima do limite de rentabilidade.
4. Risco de vencer antes do giro.
5. Estoque restante no vencimento do boleto.
6. Retorno mensal abaixo de 0,9%.

Evitar duas mensagens que digam essencialmente a mesma coisa.

### 34.3 Exemplo de mensagem

Cenário: quantidade 100, limite do boleto 80, estoque atual 20.

"A quantidade informada foi de 100 unidades, 20 acima do limite definido pelo prazo de pagamento."

"No vencimento do boleto, a previsão é ainda haver aproximadamente 70 unidades em estoque."

---

## 35. Formatação do bloco de limites (v0.6)

### Desktop

Três colunas internas com `gap: 14px`.

### Mobile (≤700px)

Uma coluna.

Cada critério deve mostrar:

* Nome direto.
* Quantidade em unidades (ou "Não informado").
* Status com ícone e texto.
* Descrição curta.
* Se for o mais restritivo: destaque com borda e texto explicativo.
