import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProduct } from "@/src/controllers/platform/product/product";
import axios from "axios";

export async function generateSaleTicket(saleItems, totalSaleAmount) {
  const pdfDoc = await PDFDocument.create();
  
  // Tamaño de ticket (80mm de ancho, largo variable)
  const pageWidth = 226; 
  const pageHeight = 400 + saleItems.length * 20; // Ajuste dinámico según cantidad de productos
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoUrl = `${domain}/${process.env.NEXT_PUBLIC_LOGO_FILE_NAME}`;
  
  try {
    // Cargar imagen del logo
    const logoImageBytes = (
      await axios.get(logoUrl, { responseType: "arraybuffer" })
    ).data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDimensions = logoImage.scale(0.2); // Reducir tamaño del logo

    page.drawImage(logoImage, {
      x: (pageWidth - logoDimensions.width) / 2, // Centrar el logo
      y: pageHeight - logoDimensions.height - 10,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    // Fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Courier);
    const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

    let yPosition = pageHeight - logoDimensions.height - 30;

    // Nombre del negocio
    page.drawText(brandName || "Tienda", {
      x: 40,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Fecha y hora de emisión del ticket
    const dateTime = new Date().toLocaleString();
    page.drawText(dateTime, {
      x: 40,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    page.drawText("--------------------------------", { x: 10, y: yPosition, size: 10, font });
    yPosition -= 20;

    // Listado de productos
    for (const item of saleItems) {
      const product = await getProduct(item.product_id);
      const itemText = `${item.quantity}x ${product.name || "Producto"}  $${item.sale_item_total.toFixed(2)}`;
      
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

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generando el ticket de venta:", error.message);
    throw error;
  }
}
