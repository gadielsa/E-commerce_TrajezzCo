import { sendContactEmail } from '../services/emailService.js';

/**
 * Enviar mensagem de contato
 * POST /api/contact
 */
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validar campos obrigatórios
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email, assunto e mensagem são obrigatórios'
      });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email inválido'
      });
    }

    // Validar tamanho da mensagem
    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem muito longa (máximo 5000 caracteres)'
      });
    }

    // Enviar email
    await sendContactEmail(name, email, subject, message);

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso para a nossa equipe! Agradecemos pelo feedback.'
    });
  } catch (error) {
    console.error('Erro ao processar contato:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem. Tente novamente mais tarde.'
    });
  }
};

/**
 * Verificar status do serviço de email
 * GET /api/contact/status
 */
export const checkEmailStatus = async (req, res) => {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const hasApiKey = !!process.env.SENDGRID_API_KEY;
    const hasDefaultFromEmail = !!process.env.SENDGRID_FROM_EMAIL;
    const hasContactFromEmail = !!process.env.SENDGRID_FROM_EMAIL_CONTACT || hasDefaultFromEmail;
    const hasContactEmail = !!process.env.CONTACT_RECEIVER_EMAIL;

    if (!hasApiKey || !hasContactFromEmail || !hasContactEmail) {
      return res.status(400).json({
        success: false,
        message: 'Serviço de email não está totalmente configurado',
        details: {
          apiKey: hasApiKey,
          fromEmail: hasContactFromEmail,
          contactEmail: hasContactEmail
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Serviço de email está configurado e pronto',
      service: 'SendGrid'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar status do serviço de email'
    });
  }
};
