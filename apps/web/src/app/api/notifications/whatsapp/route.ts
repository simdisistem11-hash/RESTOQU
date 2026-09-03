import { NextResponse } from 'next/server';
import { formatRupiah } from '@/lib/printer';

export async function POST(request: Request) {
  try {
    const { phone, receipt } = await request.json();

    if (!phone || !receipt) {
      return NextResponse.json({ error: 'Nomor HP dan rincian struk wajib diisi' }, { status: 400 });
    }

    // Format WA Text Message
    const itemsList = receipt.items
      .map((i: any) => `• *${i.name}* (x${i.quantity}) - ${formatRupiah(i.totalPrice)}`)
      .join('\n');

    const waMessage = `
💐 *TERIMA KASIH ATAS KUNJUNGAN ANDA!* 💐
_${receipt.header || 'RestoQu Restaurant'}_

*STRUK PEMBAYARAN DIGITAL*
━━━━━━━━━━━━━━━━━━━━
*No. Order:* ${receipt.orderNumber}
*Waktu:* ${receipt.date}
*Meja/Lokasi:* ${receipt.servicePointName}
*Pelanggan:* ${receipt.mainCustomerName || 'Pelanggan'}

*RINCIAN PESANAN:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ${formatRupiah(receipt.subtotal)}
${receipt.serviceAmount > 0 ? `*Service:* ${formatRupiah(receipt.serviceAmount)}\n` : ''}${receipt.taxAmount > 0 ? `*Pajak:* ${formatRupiah(receipt.taxAmount)}\n` : ''}${receipt.discountAmount > 0 ? `*Diskon:* -${formatRupiah(receipt.discountAmount)}\n` : ''}*TOTAL:* *${formatRupiah(receipt.totalAmount)}*
*Metode Bayar:* ${receipt.paymentMethod}
*Bayar:* ${formatRupiah(receipt.amountPaid)}
*Kembali:* ${formatRupiah(receipt.change)}

${receipt.earnedPoints ? `🎉 *Poin Terkumpul:* +${receipt.earnedPoints} Poin Loyalty!\n` : ''}
_${receipt.footer || 'Semoga hari Anda menyenangkan!'}_
    `.trim();

    // Log the generated message
    console.log(`[WA Gateway Dispatch to ${phone}]:\n${waMessage}`);

    // Clean phone number format for WhatsApp link
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const waWebLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMessage)}`;

    return NextResponse.json({
      success: true,
      message: 'WhatsApp notification prepared',
      waWebLink,
      rawText: waMessage
    });
  } catch (error) {
    console.error('[API WA Notification Error]:', error);
    return NextResponse.json({ error: 'Gagal memproses notifikasi WhatsApp' }, { status: 500 });
  }
}
