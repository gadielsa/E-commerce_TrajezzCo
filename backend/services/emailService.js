import sgMail from '@sendgrid/mail';

// Inicializar SendGrid apenas se a API key for válida
const SENDGRID_ENABLED = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.');

if (SENDGRID_ENABLED) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configurado');
} else {
  console.warn('⚠️  SendGrid não configurado - Emails não serão enviados');
}

/**
 * Enviar email de contato
 */
export const sendContactEmail = async (name, email, subject, message) => {
  if (!SENDGRID_ENABLED) {
    console.log('⚠️  Email não enviado (SendGrid não configurado):', { name, email, subject });
    return { success: true, message: 'Email simulado (SendGrid não configurado)' };
  }
  
  try {
    // Email para o cliente confirmando recebimento
    const customerMsg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: 'Recebemos sua mensagem - TrajezzCo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Obrigado pelo contato!</h2>
          <p>Olá <strong>${name}</strong>,</p>
          <p>Recebemos sua mensagem com o assunto "<strong>${subject}</strong>" e responderemos assim que possível.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
            <p><strong>Sua mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>Nossa equipe entrará em contato em até 24 horas.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            TrajezzCo - E-commerce de Moda<br>
            São Paulo, SP - Brasil<br>
            <a href="https://trajezzco.com.br">www.trajezzco.com.br</a>
          </p>
        </div>
      `
    };

    // Email para o admin
    const adminMsg = {
      to: process.env.ADMIN_EMAIL,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: `Novo contato: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">Novo Contato Recebido</h2>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #000;">
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
               style="background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block;">
              Responder
            </a>
          </p>
        </div>
      `
    };

    // Enviar ambos os emails em paralelo
    await Promise.all([
      sgMail.send(customerMsg),
      sgMail.send(adminMsg)
    ]);

    return {
      success: true,
      message: 'Emails enviados com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error(`Erro ao enviar email: ${error.message}`);
  }
};

/**
 * Enviar email de notificação (genérico)
 */
export const sendEmail = async (to, subject, html) => {
  if (!SENDGRID_ENABLED) {
    console.log('⚠️  Email não enviado (SendGrid não configurado):', { to, subject });
    return { success: true, message: 'Email simulado (SendGrid não configurado)' };
  }
  
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject,
      html
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: 'Email enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error(`Erro ao enviar email: ${error.message}`);
  }
};

/**
 * Enviar email de confirmação de pedido
 */
export const sendOrderConfirmationEmail = async (customerEmail, customerName, orderId, total) => {
  if (!SENDGRID_ENABLED) {
    console.log('⚠️  Email de pedido não enviado (SendGrid não configurado):', { customerEmail, orderId });
    return { success: true, message: 'Email simulado (SendGrid não configurado)' };
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Pedido Confirmado!</h2>
      <p>Olá <strong>${customerName}</strong>,</p>
      <p>Seu pedido foi recebido e está sendo processado.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <p><strong>ID do Pedido:</strong> #${orderId}</p>
        <p><strong>Valor Total:</strong> R$ ${total.toFixed(2)}</p>
      </div>
      
      <p>Você receberá um email com informações de rastreamento em breve.</p>
      
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">TrajezzCo - E-commerce de Moda</p>
    </div>
  `;

  return sendEmail(customerEmail, `Pedido Confirmado - #${orderId}`, html);
};
