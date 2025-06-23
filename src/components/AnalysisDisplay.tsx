
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, Eye, TrendingUp, Users, Lightbulb, Package, Star } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: {
    product: {
      category: string;
      subcategory: string;
      name: string;
      features: string[];
      benefits: string[];
      description: string;
    };
    targetAudience: string;
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
        <Package className="h-6 w-6 text-blue-500" />
        <h3 className="text-xl font-semibold text-gray-800">Análise do Produto</h3>
      </div>
      
      <div className="grid gap-4">
        {/* Informações do Produto - DESTAQUE PRINCIPAL */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3 mb-3">
            <Package className="h-6 w-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg">Produto Identificado</h4>
              <div className="mt-2 space-y-2">
                <div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm">
                    {analysis.product.category}
                    {analysis.product.subcategory && ` - ${analysis.product.subcategory}`}
                  </Badge>
                </div>
                {analysis.product.name && (
                  <p className="text-gray-700"><span className="font-medium">Nome:</span> {analysis.product.name}</p>
                )}
                <p className="text-gray-700"><span className="font-medium">Descrição:</span> {analysis.product.description}</p>
              </div>
            </div>
          </div>
          
          {/* Características do Produto */}
          {analysis.product.features.length > 0 && (
            <div className="mt-3">
              <h5 className="font-medium text-gray-800 mb-2">Características:</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.product.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Benefícios do Produto */}
          {analysis.product.benefits.length > 0 && (
            <div className="mt-3">
              <h5 className="font-medium text-gray-800 mb-2">Benefícios:</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.product.benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="border-green-300 text-green-700 bg-green-50">
                    <Star className="h-3 w-3 mr-1" />
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Público-Alvo */}
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-purple-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-800">Público-Alvo</h4>
            <p className="text-gray-600">{analysis.targetAudience}</p>
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
