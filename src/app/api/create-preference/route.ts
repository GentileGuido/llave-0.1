import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, type } = await request.json();

    // Validar datos
    if (!amount || !type) {
      return NextResponse.json({ error: 'Amount and type are required' }, { status: 400 });
    }

    // Configuración de Mercado Pago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 });
    }

    // Crear preferencia
    const preference = {
      items: [
        {
          title: `Donación Llave - ${type}`,
          description: `Apoya el desarrollo de Llave con una donación de $${amount}`,
          quantity: 1,
          unit_price: amount,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'}/donation/success`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'}/donation/error`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'}/donation/pending`
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'}/api/mp-webhook`,
      external_reference: `llave_donation_${type}_${Date.now()}`,
      metadata: {
        app: 'llave',
        type: type,
        amount: amount
      }
    };

    // Llamar a la API de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      throw new Error(`MercadoPago API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      init_point: data.init_point,
      preference_id: data.id 
    });

  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json({ 
      error: 'Error creating payment preference' 
    }, { status: 500 });
  }
}
