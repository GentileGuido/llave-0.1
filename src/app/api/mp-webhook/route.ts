import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔔 MercadoPago Webhook recibido:', body);

    // Verificar que sea un evento de pago
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      
      if (paymentId) {
        // Aquí puedes procesar el pago
        console.log('💰 Pago procesado:', paymentId);
        
        // Opcional: Guardar en base de datos, enviar email, etc.
        // await processPayment(paymentId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
