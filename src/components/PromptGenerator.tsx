import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wand2, Loader2, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PromptGeneratorProps {
  briefing: string;
  onPromptGenerated: (prompt: string) => void;
  onAnalysisGenerated: (analysis: any) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  briefing,
  onPromptGenerated,
  onAnalysisGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setShowApiKeyInput(false);
  };

  const generatePrompt = async () => {
    if (!briefing.trim() || !apiKey) return;
    
    setIsGenerating(true);
    
    try {
      // Primeiro, fazemos a análise local do produto (mantemos essa funcionalidade)
      const localAnalysis = analyzeBriefing(briefing);
      onAnalysisGenerated(localAnalysis);

      // Depois, usamos a OpenAI para gerar o prompt otimizado
      const openAIPrompt = await generatePromptWithOpenAI(briefing, localAnalysis, apiKey);
      onPromptGenerated(openAIPrompt);
    } catch (error) {
      console.error('Erro ao gerar prompt:', error);
      // Fallback para geração local se a API falhar
      const localPrompt = createOptimizedPrompt(analyzeBriefing(briefing));
      onPromptGenerated(localPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePromptWithOpenAI = async (briefing: string, analysis: any, apiKey: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em marketing visual e prompts para IA generativa de imagens. Sua função é analisar briefings de produtos e criar prompts estratégicos em português brasileiro para gerar imagens de marketing de alta qualidade.

PRODUTO IDENTIFICADO:
- Categoria: ${analysis.product.category}
- Subcategoria: ${analysis.product.subcategory || 'N/A'}
- Nome: ${analysis.product.name || 'N/A'}
- Características: ${analysis.product.features.join(', ') || 'N/A'}
- Benefícios: ${analysis.product.benefits.join(', ') || 'N/A'}
- Descrição: ${analysis.product.description}

ANÁLISE DO PÚBLICO:
- Público-alvo: ${analysis.targetAudience}
- Gatilhos emocionais: ${analysis.emotions.join(', ')}
- Objetivo da campanha: ${analysis.goal}

Crie um prompt detalhado em português brasileiro que inclua:
1. Descrição clara do produto e seu contexto de uso
2. Direção visual específica baseada na categoria do produto
3. Elementos emocionais que conectem com o público-alvo
4. Especificações técnicas para qualidade profissional
5. Orientações de composição e estilo

O prompt deve ser otimizado para ferramentas como Midjourney, DALL-E, ou Stable Diffusion.`
          },
          {
            role: 'user',
            content: `Briefing do produto: ${briefing}

Por favor, gere um prompt completo em português brasileiro para criar uma imagem de marketing impactante para este produto.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro da API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const analyzeBriefing = (text: string) => {
    const words = text.toLowerCase();
    
    // FOCO PRINCIPAL: Identificar e compreender o produto
    const productInfo = analyzeProduct(text, words);
    
    // Detectar público-alvo com base no produto identificado
    let targetAudience = determineTargetAudience(words, productInfo);
    
    // Detectar emoções/gatilhos baseados no tipo de produto
    const emotions = detectEmotions(words, productInfo);
    
    // Detectar objetivo da campanha
    let goal = detectCampaignGoal(words);
    
    return {
      // Produto é agora o elemento central da análise
      product: productInfo,
      targetAudience,
      emotions: emotions.length > 0 ? emotions : ["Positividade"],
      goal,
      briefingLength: text.length,
      keyTerms: extractKeyTerms(text)
    };
  };

  const analyzeProduct = (originalText: string, lowerText: string) => {
    // Detectar categoria do produto
    let category = "Produto/Serviço";
    let subcategory = "";
    let productName = "";
    let features = [];
    let benefits = [];

    // Identificar categoria principal
    if (lowerText.includes("app") || lowerText.includes("aplicativo") || lowerText.includes("software")) {
      category = "Aplicativo/Software";
      if (lowerText.includes("meditação") || lowerText.includes("mindfulness")) subcategory = "Bem-estar";
      if (lowerText.includes("produtividade") || lowerText.includes("organização")) subcategory = "Produtividade";
      if (lowerText.includes("fitness") || lowerText.includes("exercício")) subcategory = "Fitness";
      if (lowerText.includes("educação") || lowerText.includes("aprendizado")) subcategory = "Educacional";
    } else if (lowerText.includes("curso") || lowerText.includes("educação") || lowerText.includes("treinamento")) {
      category = "Educacional";
      if (lowerText.includes("online")) subcategory = "Online";
      if (lowerText.includes("profissional")) subcategory = "Profissionalizante";
    } else if (lowerText.includes("alimento") || lowerText.includes("comida") || lowerText.includes("bebida")) {
      category = "Alimentício";
      if (lowerText.includes("natural") || lowerText.includes("orgânico")) subcategory = "Natural/Orgânico";
      if (lowerText.includes("fitness") || lowerText.includes("proteína")) subcategory = "Fitness/Suplemento";
    } else if (lowerText.includes("cosmético") || lowerText.includes("beleza") || lowerText.includes("skincare")) {
      category = "Beleza/Cosmético";
      if (lowerText.includes("natural")) subcategory = "Natural";
      if (lowerText.includes("anti-idade")) subcategory = "Anti-idade";
    } else if (lowerText.includes("roupa") || lowerText.includes("vestuário") || lowerText.includes("moda")) {
      category = "Moda/Vestuário";
    } else if (lowerText.includes("serviço") || lowerText.includes("consultoria")) {
      category = "Serviço";
    }

    // Extrair nome do produto (buscar por palavras-chave que indicam nome)
    const namePatterns = [
      /(?:aplicativo|app|produto|marca)\s+([A-Z][a-zA-Z]+)/gi,
      /([A-Z][a-zA-Z]+)(?:\s+é\s+um|\s+oferece|\s+proporciona)/gi
    ];
    
    for (const pattern of namePatterns) {
      const match = originalText.match(pattern);
      if (match) {
        productName = match[1] || "";
        break;
      }
    }

    // Extrair características/funcionalidades
    if (lowerText.includes("sessões") || lowerText.includes("minutos")) features.push("Sessões personalizadas");
    if (lowerText.includes("pausas") || lowerText.includes("trabalho")) features.push("Integração com rotina");
    if (lowerText.includes("fácil") || lowerText.includes("simples")) features.push("Facilidade de uso");
    if (lowerText.includes("rápido") || lowerText.includes("eficiente")) features.push("Resultados rápidos");

    // Extrair benefícios
    if (lowerText.includes("tranquilidade") || lowerText.includes("paz")) benefits.push("Promove tranquilidade");
    if (lowerText.includes("reduz estresse") || lowerText.includes("ansiedade")) benefits.push("Reduz estresse");
    if (lowerText.includes("melhora") || lowerText.includes("otimiza")) benefits.push("Melhora performance");
    if (lowerText.includes("economiza tempo") || lowerText.includes("praticidade")) benefits.push("Economiza tempo");

    return {
      category,
      subcategory,
      name: productName,
      features,
      benefits,
      description: extractProductDescription(originalText)
    };
  };

  const extractProductDescription = (text: string) => {
    // Extrair uma descrição concisa do produto
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
    return sentences[0] || "Produto inovador";
  };

  const determineTargetAudience = (words: string, productInfo: any) => {
    // Determinar público com base no produto E no texto
    if (productInfo.category === "Aplicativo/Software" && productInfo.subcategory === "Bem-estar") {
      if (words.includes("profissionais") || words.includes("trabalho")) return "Jovens profissionais (25-35 anos)";
    }
    
    if (words.includes("jovens") || words.includes("millennials")) return "Jovens adultos (25-35 anos)";
    if (words.includes("profissionais") || words.includes("executivos")) return "Profissionais";
    if (words.includes("família") || words.includes("pais")) return "Famílias";
    if (words.includes("idosos") || words.includes("terceira idade")) return "Terceira idade";
    
    return "Público geral";
  };

  const detectEmotions = (words: string, productInfo: any) => {
    const emotions = [];
    
    // Emoções baseadas no tipo de produto
    if (productInfo.category === "Aplicativo/Software" && productInfo.subcategory === "Bem-estar") {
      emotions.push("Tranquilidade", "Equilíbrio");
    }
    
    // Emoções do texto
    if (words.includes("tranquilidade") || words.includes("paz") || words.includes("relaxar")) emotions.push("Tranquilidade");
    if (words.includes("energia") || words.includes("motivação")) emotions.push("Energia");
    if (words.includes("confiança") || words.includes("segurança")) emotions.push("Confiança");
    if (words.includes("felicidade") || words.includes("alegria")) emotions.push("Felicidade");
    if (words.includes("praticidade") || words.includes("facilidade")) emotions.push("Praticidade");
    if (words.includes("exclusividade") || words.includes("premium")) emotions.push("Exclusividade");
    
    return [...new Set(emotions)]; // Remove duplicatas
  };

  const detectCampaignGoal = (words: string) => {
    if (words.includes("lançamento") || words.includes("novidade")) return "Lançamento";
    if (words.includes("venda") || words.includes("compra") || words.includes("conversão")) return "Conversão";
    if (words.includes("engajamento") || words.includes("interação")) return "Engajamento";
    if (words.includes("branding") || words.includes("marca")) return "Branding";
    return "Awareness";
  };

  const extractKeyTerms = (text: string) => {
    const commonWords = ['o', 'a', 'de', 'da', 'do', 'que', 'e', 'para', 'com', 'em', 'um', 'uma', 'é', 'são', 'ter', 'como', 'mais', 'seu', 'sua'];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const filtered = words.filter(word => word.length > 3 && !commonWords.includes(word));
    const frequency: { [key: string]: number } = {};
    
    filtered.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const createOptimizedPrompt = (analysis: any) => {
    // Fallback local caso a API falhe - versão simplificada em português
    return `Crie uma imagem de marketing profissional para ${analysis.product.description}.
    
PRODUTO: ${analysis.product.category}
PÚBLICO-ALVO: ${analysis.targetAudience}
OBJETIVO: ${analysis.goal}
EMOÇÕES: ${analysis.emotions.join(', ')}

Estilo visual moderno e profissional, cores vibrantes, composição equilibrada, alta qualidade, fotografia comercial.`;
  };

  if (showApiKeyInput) {
    return (
      <Card className="mt-6 p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-5 w-5 text-yellow-600" />
          <h3 className="font-medium text-yellow-800">Configuração da OpenAI</h3>
        </div>
        <p className="text-sm text-yellow-700 mb-4">
          Para gerar prompts otimizados, digite sua chave da API da OpenAI:
        </p>
        <div className="flex gap-2">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
            Salvar
          </Button>
        </div>
        <p className="text-xs text-yellow-600 mt-2">
          Sua chave será salva localmente no navegador e nunca compartilhada.
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <Button
        onClick={generatePrompt}
        disabled={!briefing.trim() || isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
            Analisando produto e gerando prompt com IA...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-3" />
            Analisar Produto e Gerar Prompt com IA
          </>
        )}
      </Button>
      
      <Button
        onClick={() => setShowApiKeyInput(true)}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        <Key className="h-3 w-3 mr-2" />
        Alterar Chave da API
      </Button>
    </div>
  );
};

export default PromptGenerator;
