import { COMPANY_INFO, CURRENCY_SYMBOL } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderWithItems } from '@/types';

function buildInvoiceHtml(order: OrderWithItems): string {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td>${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${formatCurrency(item.price)}</td>
          <td style="text-align:right;">${formatCurrency(item.subtotal)}</td>
        </tr>
      `
    )
    .join('');

  const customerSection = `
    <div>
      <h3 style="margin:0 0 8px 0;">Bill To</h3>
      <div>${order.shipping_full_name || order.user?.full_name || ''}</div>
      <div>${order.shipping_address || ''}</div>
      <div>${order.shipping_phone || order.user?.phone || ''}</div>
    </div>
  `;

  const header = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1 style="margin:0;">${COMPANY_INFO.name}</h1>
        <div>${COMPANY_INFO.address}</div>
        <div>${COMPANY_INFO.email}</div>
        <div>${COMPANY_INFO.phone}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:24px; font-weight:bold;">INVOICE</div>
        <div>Order: ${order.order_number}</div>
        <div>Date: ${formatDate(order.created_at)}</div>
      </div>
    </div>
  `;

  const summary = `
    <table style="width:100%; margin-top:16px;">
      <tr>
        <td style="text-align:right;">Subtotal:</td>
        <td style="text-align:right; width:180px;">${formatCurrency(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="text-align:right;">Tax:</td>
        <td style="text-align:right;">${formatCurrency(order.tax)}</td>
      </tr>
      <tr>
        <td style="text-align:right;">Shipping:</td>
        <td style="text-align:right;">${formatCurrency(order.shipping_cost)}</td>
      </tr>
      <tr>
        <td style="text-align:right; font-weight:bold;">Total:</td>
        <td style="text-align:right; font-weight:bold;">${formatCurrency(order.total)}</td>
      </tr>
      <tr>
        <td colspan="2" style="text-align:right; font-size:12px; color:#666;">Payment: ${order.payment_method || 'N/A'} • Status: ${order.payment_status || 'N/A'}</td>
      </tr>
    </table>
  `;

  return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice ${order.order_number}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
        table { border-collapse: collapse; }
        th, td { border-bottom: 1px solid #eee; padding: 8px; }
        th { text-align: left; background: #fafafa; }
        .footer { margin-top: 24px; font-size: 12px; color: #555; }
        .logo { height: 40px; }
      </style>
    </head>
    <body>
      ${header}
      <hr style="margin:16px 0;" />
      ${customerSection}
      <h3 style="margin:16px 0 8px 0;">Order Items</h3>
      <table style="width:100%;">
        <thead>
          <tr>
            <th style="width:50%;">Item</th>
            <th style="width:15%; text-align:center;">Qty</th>
            <th style="width:15%; text-align:right;">Price</th>
            <th style="width:20%; text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      ${summary}
      <div class="footer">
        Thank you for your order! • ${COMPANY_INFO.tagline}
      </div>
      <script>
        setTimeout(() => { try { window.print(); } catch (e) {} }, 250);
      </script>
    </body>
    </html>
  `;
}

export function downloadInvoice(order: OrderWithItems) {
  const html = buildInvoiceHtml(order);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (!w) {
    // Popup blocked: fall back to direct file download
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.order_number}.html`;
    a.click();
  }
}