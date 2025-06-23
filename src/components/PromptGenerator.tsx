
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';

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
  const generatePrompt = async () => {
    if (!briefing.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate AI processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = analyzeBriefing(briefing);
      const prompt = createOptimizedPrompt(analysis);
      
      onAnalysisGenerated(analysis);
      onPromptGenerated(prompt);
    } catch (error) {
      console.error('Erro ao gerar prompt:', error);
    } finally {
      setIsGenerating(false);
    }
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
    const { product } = analysis;
    
    // Criar prompt focado no produto identificado
    let productFocus = "";
    if (product.name) {
      productFocus = `featuring ${product.name}, `;
    }
    
    const productDescription = product.description || `${product.category.toLowerCase()} solution`;
    const productBenefits = product.benefits.length > 0 ? product.benefits.join(", ").toLowerCase() : "enhanced user experience";
    
    // Estilo visual baseado na categoria do produto
    const styleMap = {
      "Aplicativo/Software": "modern, clean UI/UX aesthetic, tech-forward design",
      "Educacional": "professional, trustworthy, inspiring and accessible",
      "Alimentício": "fresh, appetizing, natural and vibrant",
      "Beleza/Cosmético": "elegant, sophisticated, aspirational beauty",
      "Moda/Vestuário": "stylish, trendy, fashion-forward",
      "Serviço": "professional, reliable, premium service quality"
    };

    const emotionMap = {
      "Tranquilidade": "calm, peaceful, serene atmosphere",
      "Energia": "dynamic, vibrant, energetic mood",
      "Confiança": "professional, reliable, trustworthy feel",
      "Felicidade": "joyful, bright, positive energy",
      "Praticidade": "simple, efficient, user-friendly approach",
      "Exclusividade": "premium, luxury, sophisticated elegance"
    };

    const audienceMap = {
      "Jovens profissionais (25-35 anos)": "young professionals in modern work environment",
      "Profissionais": "business professionals, corporate setting",
      "Famílias": "family-oriented, warm and inclusive atmosphere",
      "Terceira idade": "mature audience, respectful and accessible"
    };

    const style = styleMap[product.category] || "clean, professional design";
    const emotion = analysis.emotions.map(e => emotionMap[e]).join(", ") || "positive, engaging atmosphere";
    const audience = audienceMap[analysis.targetAudience] || "diverse target audience";

    return `Create a high-quality marketing image ${productFocus}showcasing ${productDescription}.

PRODUTO PRINCIPAL: ${product.category}${product.subcategory ? ` - ${product.subcategory}` : ''}
${product.features.length > 0 ? `CARACTERÍSTICAS: ${product.features.join(", ")}` : ''}
BENEFÍCIOS: ${productBenefits}

TARGET AUDIENCE: ${audience}
OBJETIVO DA CAMPANHA: ${analysis.goal}

DIREÇÃO VISUAL:
- ${style}
- ${emotion}
- Highlight the product's core value proposition: ${productBenefits}
- Showcase ${product.category.toLowerCase()} in action or context of use
- Professional photography/illustration style that conveys ${analysis.emotions.join(" and ").toLowerCase()}

COMPOSIÇÃO:
- Clean, modern layout with strong focus on the product
- Use colors and lighting that reinforce ${analysis.emotions.join(", ").toLowerCase()}
- Include visual elements that communicate ${product.benefits.join(" and ").toLowerCase()}
- Ensure the image works across digital marketing platforms
- Leave strategic space for product name and key messaging

ESPECIFICAÇÕES TÉCNICAS:
- High resolution, commercial photography quality
- Balanced lighting with professional shadows
- Sharp focus on product/service elements
- Optimized for ${analysis.goal.toLowerCase()} campaigns

Style: photorealistic, commercial marketing photography, designed to showcase ${product.category.toLowerCase()} targeting ${analysis.targetAudience.toLowerCase()}.`;
  };

  return (
    <div className="mt-6">
      <Button
        onClick={generatePrompt}
        disabled={!briefing.trim() || isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
            Analisando produto e gerando prompt...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-3" />
            Analisar Produto e Gerar Prompt
          </>
        )}
      </Button>
    </div>
  );
};

export default PromptGenerator;
