'use server'

import {createSupabaseServerClient} from '@/utils/supabase/server'
import {revalidatePath} from 'next/cache'
import puppeteer from 'puppeteer'

export async function modifyStatus(formData) {
    const supabase = await createSupabaseServerClient()

    const order_id = formData.get('order_id')
    const status = formData.get('status')
    const tracking_id = formData.get('tracking_id')

    if (!order_id || !status) throw new Error('order_id și status sunt obligatorii')

    // Obține comanda + user o singură dată (necesar pentru PDF)
    const {data: order, error: fetchError} = await supabase
        .from('orders')
        .select('*, user:users(*), address:addresses(city, address, country)')
        .eq('id', order_id)
        .maybeSingle()

    if (fetchError) {
        console.log("fetchError", fetchError)
    }
    if (!order) throw new Error('Comanda nu a fost găsită')

    // Pregătește toate câmpurile pentru update
    const fullUpdate = {
        status,
    }

    if (tracking_id) {
        fullUpdate.tracking_id = tracking_id
    }

    if (status.toLowerCase() === 'on delivery') {
        const filePath = `user_${order.user.id}/invoice-${order.id}.pdf`
        const folderPath = `user_${order.user.id}`

        const {data: existingFiles, error: listError} = await supabase.storage
            .from('invoices')
            .list(folderPath, {search: `invoice-${order.id}.pdf`})

        if (listError) throw listError

        const {data: products, error: productsError} = await supabase
            .from('order_products')
            .select('product:products(name), quantity, product_price')
            .eq('order_id', order_id)

        if (productsError) throw productsError

        if (!existingFiles || existingFiles.length === 0) {
            const pdfBuffer = await generateInvoicePdf(order, products)

            const {error: uploadError} = await supabase.storage
                .from('invoices')
                .upload(filePath, pdfBuffer, {
                    contentType: 'application/pdf',
                    upsert: false,
                })

            if (uploadError) throw uploadError
        }

        fullUpdate.invoice_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invoices/${filePath}`
        fullUpdate.is_invoice_generated = true
    }

    const {error: updateError} = await supabase
        .from('orders')
        .update(fullUpdate)
        .eq('id', order.id)

    if (updateError) {
        console.log("update error", updateError)
    }

    revalidatePath('/admin/orders', 'layout')
}

export async function generateInvoicePdf(order, products) {
    const html = `
      <html lang="en">
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 40px; }
            .header { display: flex; justify-content: space-between; }
            .box { width: 48%; line-height: 16px;}
            table { width: 100%; border-collapse: collapse; margin-top: 50px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f5f5f5; }
            tfoot td { font-weight: bold; }
            .footer { margin-top: 40px; font-style: italic; text-align: center; font-size: 11px; color: #444; }
          </style>
        </head>
        <body>
          <h1>Factură pentru comanda #${order.id}</h1>
    
          <div class="header">
            <div class="box">
              <strong>Emitent:</strong><br/>
              SC Platforma SRL<br/>
              Str. Exemplu nr. 123<br/>
              București, România<br/>
              CUI: RO12345678<br/>
              Nr. Reg. Com: J40/1234/2024<br/>
              IBAN: RO49AAAA1B31007593840000<br/>
              Banca: Banca Exemplu
            </div>
            <div class="box">
              <strong>Client:</strong><br/>
              ${order.user.full_name || ''}<br/>
              Email: ${order.user.email || ''}<br/>
              Telefon: ${order.user.phone || ''}<br/> <br/>
              <strong>Adresa de facturare</strong><br/>
              ${order.address?.address || ''}, ${order.address?.city || ''}, ${order.address?.country || ''}
            </div>
          </div>
    
          <table>
            <thead>
              <tr>
                <th>Produs</th>
                <th>Cantitate</th>
                <th>Preț unitar</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>${p.product.name}</td>
                  <td>${p.quantity}</td>
                  <td>${p.product_price.toFixed(2)} RON</td>
                  <td>${(p.quantity * p.product_price).toFixed(2)} RON</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align:right">Total de plată:</td>
                <td>${order.total_price.toFixed(2)} RON</td>
              </tr>
            </tfoot>
          </table>
    
          <div class="footer">
            Vă mulțumim pentru încredere!<br/>
            Această factură a fost generată automat și nu necesită semnătură sau ștampilă.
          </div>
        </body>
      </html>
    `

    const browser = await puppeteer.launch({args: ['--no-sandbox']})
    const page = await browser.newPage()
    await page.setContent(html, {waitUntil: 'networkidle0'})
    const pdfBuffer = await page.pdf({format: 'A4', printBackground: true})
    await browser.close()

    return pdfBuffer
}