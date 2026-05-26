require('dotenv').config();
const express = require('express');
const { BrevoClient } = require('@getbrevo/brevo');

const app = express();
app.use(express.json());

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 30,
  maxRetries: 2,
});

app.get('/email/test', async (req, res) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: 'tu_correo_de_prueba@gmail.com' }],
      subject: 'Prueba Brevo con Express',
      htmlContent: '<h1>Hola</h1><p>Este es un correo de prueba.</p>',
      replyTo: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
    });

    console.log('Brevo result:', result);
    res.json({
      success: true,
      messageId: result.messageId,
      result,
    });
  } catch (error) {
    console.error('Brevo error status:', error?.statusCode);
    console.error('Brevo error message:', error?.message);
    console.error('Brevo raw response:', error?.rawResponse);

    res.status(error?.statusCode || 500).json({
      success: false,
      statusCode: error?.statusCode || 500,
      message: error?.message || 'Error enviando email',
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});