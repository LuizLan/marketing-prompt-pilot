
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
    // Análise simulada do briefing
    const words = text.toLowerCase();
    
    // Detectar público-alvo
    let targetAudience = "Público geral";
    if (words.includes("jovens") || words.includes("millennials")) targetAudience = "Jovens adultos (25-35 anos)";
    if (words.includes("profissionais") || words.includes("executivos")) targetAudience = "Profissionais";
    if (words.includes("família") || words.includes("pais")) targetAudience = "Famílias";
    if (words.includes("idosos") || words.includes("terceira idade")) targetAudience = "Terceira idade";
    
    // Detectar produto/serviço
    let productType = "Produto/Serviço";
    if (words.includes("app") || words.includes("aplicativo")) productType = "Aplicativo";
    if (words.includes("curso") || words.includes("educação")) productType = "Educacional";
    if (words.includes("alimento") || words.includes("comida")) productType = "Alimentício";
    if (words.includes("beleza") || words.includes("cosmético")) productType = "Beleza/Cosmético";
    if (words.includes("tecnologia") || words.includes("tech")) productType = "Tecnologia";
    
    // Detectar emoções/gatilhos
    const emotions = [];
    if (words.includes("tranquilidade") || words.includes("paz") || words.includes("relaxar")) emotions.push("Tranquilidade");
    if (words.includes("energia") || words.includes("motivação")) emotions.push("Energia");
    if (words.includes("confiança") || words.includes("segurança")) emotions.push("Confiança");
    if (words.includes("felicidade") || words.includes("alegria")) emotions.push("Felicidade");
    if (words.includes("praticidade") || words.includes("facilidade")) emotions.push("Praticidade");
    if (words.includes("exclusividade") || words.includes("premium")) emotions.push("Exclusividade");
    
    // Detectar objetivo
    let goal = "Awareness";
    if (words.includes("venda") || words.includes("compra")) goal = "Conversão";
    if (words.includes("engajamento") || words.includes("interação")) goal = "Engajamento";
    if (words.includes("lançamento") || words.includes("novidade")) goal = "Lançamento";
    if (words.includes("branding") || words.includes("marca")) goal = "Branding";
    
    return {
      targetAudience,
      productType,
      emotions: emotions.length > 0 ? emotions : ["Positividade"],
      goal,
      briefingLength: text.length,
      keyTerms: extractKeyTerms(text)
    };
  };

  const extractKeyTerms = (text: string) => {
    const commonWords = ['o', 'a', 'de', 'da', 'do', 'que', 'e', 'para', 'com', 'em', 'um', 'uma', 'é', 'são', 'ter', 'como', 'mais', 'seu', 'sua'];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const filtered = words.filter(word => word.length > 3 && !commonWords.includes(word));
    const frequency = {};
    
    filtered.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const createOptimizedPrompt = (analysis: any) => {
    const styleMap = {
      "Aplicativo": "modern, clean UI/UX design, mobile-first",
      "Educacional": "professional, trustworthy, inspiring",
      "Alimentício": "appetizing, natural, fresh",
      "Beleza/Cosmético": "elegant, sophisticated, aspirational",
      "Tecnologia": "innovative, cutting-edge, futuristic"
    };

    const emotionMap = {
      "Tranquilidade": "calm, peaceful, serene atmosphere",
      "Energia": "dynamic, vibrant, energetic",
      "Confiança": "professional, reliable, trustworthy",
      "Felicidade": "joyful, bright, positive",
      "Praticidade": "simple, efficient, user-friendly",
      "Exclusividade": "premium, luxury, sophisticated"
    };

    const audienceMap = {
      "Jovens adultos (25-35 anos)": "young professionals, modern lifestyle",
      "Profissionais": "business environment, corporate setting",
      "Famílias": "family-oriented, warm, inclusive",
      "Terceira idade": "mature, respectful, accessible"
    };

    const style = styleMap[analysis.productType] || "clean, professional";
    const emotion = analysis.emotions.map(e => emotionMap[e]).join(", ") || "positive, engaging";
    const audience = audienceMap[analysis.targetAudience] || "diverse audience";

    return `Create a high-quality marketing image that showcases ${analysis.productType.toLowerCase()}. 

TARGET AUDIENCE: ${audience}
EMOTIONAL DIRECTION: ${emotion}
VISUAL STYLE: ${style}

COMPOSITION:
- Clean, modern composition with strong visual hierarchy
- Use warm, inviting colors that convey ${analysis.emotions.join(" and ").toLowerCase()}
- Include subtle branding elements without overwhelming the message
- Ensure the image works across digital platforms (social media, web, mobile)

TECHNICAL SPECS:
- High resolution, professional photography or illustration style
- Balanced lighting with soft shadows
- Sharp focus on key product/service elements
- Leave space for text overlay if needed

MOOD: ${emotion}, appealing to ${analysis.targetAudience.toLowerCase()}, designed to drive ${analysis.goal.toLowerCase()}.

Style: photorealistic, commercial photography, marketing campaign quality`;
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
            Analisando e gerando prompt...
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5 mr-3" />
            Gerar Prompt Otimizado
          </>
        )}
      </Button>
    </div>
  );
};

export default PromptGenerator;
