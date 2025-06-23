
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, Eye, TrendingUp, Users, Lightbulb } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: {
    targetAudience: string;
    productType: string;
    emotions: string[];
    goal: string;
    briefingLength: number;
    keyTerms: string[];
  };
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'Conversão': return TrendingUp;
      case 'Engajamento': return Heart;
      case 'Branding': return Eye;
      case 'Lançamento': return Lightbulb;
      default: return Target;
    }
  };

  const GoalIcon = getGoalIcon(analysis.goal);

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-sm border-blue-100">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-800">Análise do Briefing</h3>
      </div>
      
      <div className="grid gap-4">
        {/* Público-Alvo */}
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Público-Alvo</h4>
            <p className="text-gray-600">{analysis.targetAudience}</p>
          </div>
        </div>

        {/* Tipo de Produto */}
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-blue-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Categoria</h4>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {analysis.productType}
            </Badge>
          </div>
        </div>

        {/* Gatilhos Emocionais */}
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 text-pink-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Gatilhos Emocionais</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.emotions.map((emotion, index) => (
                <Badge key={index} variant="outline" className="border-pink-200 text-pink-700">
                  {emotion}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Objetivo */}
        <div className="flex items-start gap-3">
          <GoalIcon className="h-5 w-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Objetivo da Campanha</h4>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {analysis.goal}
            </Badge>
          </div>
        </div>

        {/* Termos-Chave */}
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Termos-Chave Identificados</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {analysis.keyTerms.map((term, index) => (
                <Badge key={index} variant="outline" className="border-yellow-200 text-yellow-700">
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnalysisDisplay;
