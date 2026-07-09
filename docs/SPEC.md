# SPEC — Calculadora de Investimentos (v0.2)

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

### 7.2 AnalysisResult

Arquivo:

```txt
src/components/analysis-result.tsx
```

Responsabilidades:

* Exibir estado vazio quando ainda não houver análise.
* Exibir o resultado quando houver análise.
* Destacar o diagnóstico principal.
* Exibir cards principais.
* Exibir mensagem interpretativa dinâmica.
* Exibir recomendação prática.

Texto do estado vazio:

**Preencha os dados da oferta para descobrir se essa compra vale a pena.**

### 7.3 ResultCard

Arquivo:

```txt
src/components/result-card.tsx
```

Responsabilidades:

* Exibir pequenos blocos de resultado.
* Receber título, valor e descrição opcional.
* Ser reutilizável.

Exemplos de cards:

* Tempo estimado de giro.
* Retorno mensal estimado.
* Economia total estimada.
* Limite saudável de compra.

---

## 8. Tipos TypeScript

Arquivo:

```txt
src/types/simulation.ts
```

Criar os seguintes tipos:

```ts
export type RiskLevel = "healthy" | "attention" | "not_recommended";

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
  healthyLimitMonths: number;
  maxHealthyPurchaseQuantity: number;
  bankReferencePercentage: number;
  interpretation: string;
  recommendation: string;
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

## 10. Motor de análise (v0.2)

Arquivo:

```txt
src/lib/investment-analysis.ts
```

Criar uma função:

```ts
export function analyzeInvestment(input: PurchaseSimulationInput): PurchaseSimulationResult
```

Constante interna:

```ts
const BANK_REFERENCE_MONTHLY_RETURN = 0.009;
```

Essa constante representa **0,9% ao mês**.

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

3. Economia por unidade:

```txt
preço médio de compra atual - preço da oferta
```

4. Economia total estimada:

```txt
valor normal da compra - valor da compra na oferta
```

5. Economia percentual:

```txt
economia total estimada / valor normal da compra
```

6. Estoque total após a compra:

```txt
estoque atual do produto + quantidade a ser comprada
```

7. Tempo estimado de giro:

```txt
estoque total após a compra / demanda mensal atual
```

8. Retorno mensal estimado:

```txt
economia percentual / tempo estimado de giro
```

9. Limite saudável financeiro em meses:

```txt
economia percentual / 0,009
```

10. Quantidade máxima saudável:

```txt
Math.max(0, Math.floor(demanda mensal atual × limite saudável financeiro em meses - estoque atual do produto))
```

11. Comparação com aplicação bancária:

```txt
retorno mensal estimado versus 0,9% ao mês
```

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

## 20. Critérios de aceite

A aplicação será considerada pronta quando:

* A página carregar sem erro.
* O formulário aparecer corretamente na ordem especificada.
* Campos de moeda exibirem "R$" como prefixo visual.
* A validação impedir dados inválidos com mensagens em português.
* O botão "Analisar oferta" gerar um resultado.
* O resultado exibir diagnóstico principal.
* O resultado exibir os cards: Tempo estimado de giro, Retorno mensal estimado, Economia total estimada, Limite saudável de compra.
* O limite saudável de compra exibir a quantidade máxima saudável na descrição.
* O cálculo usar o valor normal da compra como base para a economia percentual.
* A aplicação funcionar no desktop.
* A aplicação funcionar no mobile.
* O projeto rodar com:

```bash
npm run dev
```

### Testes manuais obrigatórios

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

---

## 21. Fora do escopo do MVP

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

## 22. Diretriz para agentes de IA

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
