
import React, { useState } from 'react';
import { Sparkles, Copy, Wand2, Target, Heart, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PromptGenerator from '@/components/PromptGenerator';
import AnalysisDisplay from '@/components/AnalysisDisplay';

const Index = () => {
  const [briefing, setBriefing] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleCopyPrompt = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        toast({
          title: "Prompt copiado!",
          description: "O prompt foi copiado para sua área de transferência.",
        });
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o prompt.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                PromptCraft
              </h1>
              <p className="text-sm text-gray-600">Transforme ideias em prompts poderosos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Crie Prompts de{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Marketing Visual
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nossa IA analisa seu briefing e gera prompts estratégicos para criar imagens que 
            conectam com seu público e impulsionam o engajamento.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-8 w-8 text-purple-500" />
              <h3 className="font-semibold text-gray-800">Análise de Público</h3>
            </div>
            <p className="text-gray-600">Identifica e compreende seu público-alvo para direcionar a mensagem visual.</p>
          </Card>
          
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-8 w-8 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Gatilhos Emocionais</h3>
            </div>
            <p className="text-gray-600">Captura e integra elementos emocionais que geram conexão e engajamento.</p>
          </Card>
          
          <Card className="p-6 bg-white/60 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="h-8 w-8 text-pink-500" />
              <h3 className="font-semibold text-gray-800">Direção Visual</h3>
            </div>
            <p className="text-gray-600">Define estilo, composição e elementos visuais estratégicos para sua campanha.</p>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8 bg-white/70 backdrop-blur-sm border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <Wand2 className="h-6 w-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-800">Seu Briefing de Produto</h3>
            </div>
            
            <Textarea
              placeholder="Cole aqui seu briefing completo do produto...

Exemplo: 'Estamos lançando um novo aplicativo de meditação voltado para jovens profissionais de 25-35 anos que sofrem com estresse e ansiedade no trabalho. O produto oferece sessões de 5-15 minutos que podem ser feitas durante pausas. Queremos transmitir tranquilidade, modernidade e praticidade. O objetivo é mostrar como é fácil encontrar momentos de paz mesmo na correria do dia a dia.'"
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
            
            <PromptGenerator
              briefing={briefing}
              onPromptGenerated={setGeneratedPrompt}
              onAnalysisGenerated={setAnalysis}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </Card>

          {/* Output Section */}
          <div className="space-y-6">
            {analysis && (
              <AnalysisDisplay analysis={analysis} />
            )}
            
            {generatedPrompt && (
              <Card className="p-8 bg-white/70 backdrop-blur-sm border-green-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-green-500" />
                    Prompt Otimizado
                  </h3>
                  <Button
                    onClick={handleCopyPrompt}
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {generatedPrompt}
                  </p>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>✨ Prompt pronto para usar em qualquer ferramenta de IA generativa!</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500">
          <p>Criado para transformar ideias em visuais impactantes ✨</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
