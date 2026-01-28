import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Careers = () => {
  const positions = [
    {
      title: 'Desenvolvedor Full Stack',
      department: 'Tecnologia',
      location: 'Remoto',
      type: 'Tempo Integral',
      description: 'Buscamos desenvolvedor full stack experiente para trabalhar no desenvolvimento e manutenção de nossa plataforma de e-commerce.'
    },
    {
      title: 'Designer UI/UX',
      department: 'Design',
      location: 'São Paulo - SP',
      type: 'Tempo Integral',
      description: 'Procuramos designer criativo para criar experiências incríveis para nossos clientes na plataforma Trajezz.'
    },
    {
      title: 'Analista de Marketing Digital',
      department: 'Marketing',
      location: 'Híbrido',
      type: 'Tempo Integral',
      description: 'Profissional com experiência em marketing digital para gerenciar campanhas e aumentar nossa presença online.'
    },
    {
      title: 'Atendente de Customer Success',
      department: 'Atendimento',
      location: 'Remoto',
      type: 'Meio Período',
      description: 'Buscamos pessoas comunicativas e empáticas para garantir a melhor experiência aos nossos clientes.'
    }
  ]

  const benefits = [
    {
      icon: '💰',
      title: 'Salário Competitivo',
      description: 'Remuneração compatível com o mercado'
    },
    {
      icon: '🏥',
      title: 'Plano de Saúde',
      description: 'Cobertura médica e odontológica'
    },
    {
      icon: '🏠',
      title: 'Trabalho Remoto',
      description: 'Flexibilidade para trabalhar de onde quiser'
    },
    {
      icon: '📚',
      title: 'Desenvolvimento',
      description: 'Investimento em cursos e capacitação'
    },
    {
      icon: '🎯',
      title: 'Bônus por Performance',
      description: 'Premiação por resultados excepcionais'
    },
    {
      icon: '🌴',
      title: 'Férias Flexíveis',
      description: 'Política de férias adaptável às suas necessidades'
    }
  ]

  return (
    <div className='min-h-screen py-10'>
      {/* Hero Section */}
      <div className='text-center mb-12'>
        <Title text1='CARREIRAS' text2='NA TRAJEZZ' />
        <p className='max-w-3xl mx-auto text-gray-600 mt-4 text-lg'>
          Junte-se à nossa equipe e faça parte da revolução no mercado de calçados online. 
          Valorizamos inovação, criatividade e paixão pelo que fazemos.
        </p>
      </div>

      {/* Values Section */}
      <div className='bg-gray-50 py-12 px-6 rounded-lg mb-16'>
        <h2 className='text-2xl font-bold text-center mb-8'>Nossos Valores</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <div className='text-center'>
            <div className='text-4xl mb-3'>🚀</div>
            <h3 className='font-semibold text-lg mb-2'>Inovação</h3>
            <p className='text-gray-600 text-sm'>Buscamos constantemente novas soluções e melhorias</p>
          </div>
          <div className='text-center'>
            <div className='text-4xl mb-3'>🤝</div>
            <h3 className='font-semibold text-lg mb-2'>Colaboração</h3>
            <p className='text-gray-600 text-sm'>Trabalhamos em equipe para alcançar objetivos comuns</p>
          </div>
          <div className='text-center'>
            <div className='text-4xl mb-3'>⭐</div>
            <h3 className='font-semibold text-lg mb-2'>Excelência</h3>
            <p className='text-gray-600 text-sm'>Comprometimento com a qualidade em tudo que fazemos</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-center mb-8'>Benefícios</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {benefits.map((benefit, index) => (
            <div key={index} className='bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow'>
              <div className='text-4xl mb-3'>{benefit.icon}</div>
              <h3 className='font-semibold text-lg mb-2'>{benefit.title}</h3>
              <p className='text-gray-600 text-sm'>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className='text-2xl font-bold text-center mb-8'>Vagas Abertas</h2>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {positions.map((position, index) => (
            <div key={index} className='bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow'>
              <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-3'>
                <div>
                  <h3 className='font-bold text-xl mb-2'>{position.title}</h3>
                  <div className='flex flex-wrap gap-2 mb-3'>
                    <span className='bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full'>
                      {position.department}
                    </span>
                    <span className='bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full'>
                      {position.location}
                    </span>
                    <span className='bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full'>
                      {position.type}
                    </span>
                  </div>
                </div>
              </div>
              <p className='text-gray-600 mb-4'>{position.description}</p>
              <button className='bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors'>
                Candidatar-se
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className='bg-gray-900 text-white text-center py-12 px-6 rounded-lg mt-16'>
        <h2 className='text-2xl font-bold mb-4'>Não encontrou a vaga ideal?</h2>
        <p className='text-gray-300 mb-6 max-w-2xl mx-auto'>
          Envie seu currículo para nosso banco de talentos e entraremos em contato quando surgir uma oportunidade que combine com seu perfil.
        </p>
        <button className='bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition-colors font-semibold'>
          Enviar Currículo
        </button>
      </div>
    </div>
  )
}

export default Careers
