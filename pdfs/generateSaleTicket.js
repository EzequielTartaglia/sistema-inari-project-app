import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProduct } from "@/src/controllers/platform/product/product";
import axios from "axios";

export async function generateSaleTicket(saleItems, totalSaleAmount, saleInfo) {
  try {
    const pdfDoc = await PDFDocument.create();
    
    // Size
    const pageWidth = 226; 
    const pageHeight = 400 + saleItems.length * 20;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Tienda";
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const logoUrl = `${domain}/${process.env.NEXT_PUBLIC_LOGO_FILE_NAME}`;
    
    // Logo
    const logoImageBytes = (await axios.get(logoUrl, { responseType: "arraybuffer" })).data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDimensions = logoImage.scale(0.2);

    page.drawImage(logoImage, {
      x: (pageWidth - logoDimensions.width) / 2,
      y: pageHeight - logoDimensions.height - 10,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    // Fonts
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

    let yPosition = pageHeight - logoDimensions.height - 30;

    // Brand name
    page.drawText(brandName, {
      x: 40,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    let dateTime = "Fecha desconocida";
    if (saleInfo && saleInfo.sale_date) {
      try {
        const saleDate = new Date(saleInfo.sale_date);
        if (!isNaN(saleDate)) {
          dateTime = saleDate.toLocaleString(); 
        }
      } catch (error) {
        console.warn("Error parsing sale_date:", error);
      }
    }

    page.drawText(dateTime, {
      x: 40,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    page.drawText("--------------------------------", { x: 10, y: yPosition, size: 10, font });
    yPosition -= 20;

    // 🔄 Dibujar productos
    for (const item of saleItems) {
      const product = await getProduct(item.product_id);
      const productName = product?.name || "Producto desconocido";
      const itemText = `${item.quantity}x ${productName}  $${item.sale_item_total.toFixed(2)}`;

      page.drawText(itemText, {
        x: 10,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= 15;
    }

    page.drawText("--------------------------------", { x: 10, y: yPosition, size: 10, font });
    yPosition -= 20;

    // Total de la venta
    page.drawText(`TOTAL: $${totalSaleAmount.toFixed(2)}`, {
      x: 10,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Mensaje de descarga del sistema
    page.drawText("Descargado por Sistema Inari", {
      x: 10,
      y: 20,
      size: 8,
      font,
      color: rgb(0, 0, 0),
    });

    // Guardar PDF y devolverlo
    return await pdfDoc.save();
  } catch (error) {
    console.error("Error generando el ticket de venta:", error);
    throw error;
  }
}
