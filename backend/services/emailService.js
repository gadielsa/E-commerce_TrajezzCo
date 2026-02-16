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
    const contactFromEmail = process.env.SENDGRID_FROM_EMAIL_CONTACT || process.env.SENDGRID_FROM_EMAIL;

    const adminMsg = {
      to: process.env.CONTACT_RECEIVER_EMAIL,
      from: {
        email: contactFromEmail,
        name: process.env.SENDGRID_FROM_NAME
      },
      replyTo: {
        email: email,
        name: name
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
          
          <p style="margin-top: 20px;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" 
               style="background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px; display: inline-block; font-weight: bold;">
              Responder
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            TrajezzCo - E-commerce de Moda<br>
            Mensagem recebida pelo formulário de contato do site
          </p>
        </div>
      `
    };

    await sgMail.send(adminMsg);

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
    const notificationsFromEmail = process.env.SENDGRID_FROM_EMAIL_NOTIFICATIONS || process.env.SENDGRID_FROM_EMAIL;

    const msg = {
      to,
      from: {
        email: notificationsFromEmail,
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
