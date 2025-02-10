import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProduct } from "@/src/controllers/platform/product/product";
import axios from "axios";

export async function generateSaleTicket(saleItems, totalSaleAmount, saleInfo) {
  try {
    const baseHeight = 400;
    const extraHeightPerItem = 20;
    let pageHeight = baseHeight + saleItems.length * extraHeightPerItem;

    const pdfDoc = await PDFDocument.create();
    const pageWidth = 226;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Tienda";
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const logoUrl = `${domain}/${process.env.NEXT_PUBLIC_LOGO_FILE_NAME}`;

    // Logo
    const logoImageBytes = (
      await axios.get(logoUrl, { responseType: "arraybuffer" })
    ).data;
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
    const brandTextWidth = boldFont.widthOfTextAtSize(brandName, 12);
    page.drawText(brandName, {
      x: (pageWidth - brandTextWidth) / 2,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Sale date
    let dateTime = "Fecha desconocida";
    if (saleInfo?.sale_date) {
      try {
        const saleDate = new Date(saleInfo.sale_date);
        if (!isNaN(saleDate)) {
          dateTime = saleDate.toLocaleString();
        }
      } catch (error) {
        console.warn("Error parsing sale_date:", error);
      }
    }

    const dateTextWidth = font.widthOfTextAtSize(dateTime, 10);
    page.drawText(dateTime, {
      x: (pageWidth - dateTextWidth) / 2,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;

    // Divisor
    page.drawText("--------------------------------", {
      x: 10,
      y: yPosition,
      size: 10,
      font,
    });
    yPosition -= 20;

    // Products (sale items)
    for (const item of saleItems) {
      const product = await getProduct(item.product_id);
      const productName = product?.name || "Producto desconocido";

      const quantityText = `${item.quantity}x ${productName}`;
      const priceText = `$${item.sale_item_total.toFixed(2)}`;

      const priceTextWidth = font.widthOfTextAtSize(priceText, 10);

      page.drawText(quantityText, {
        x: 10,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(priceText, {
        x: pageWidth - priceTextWidth - 10,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0, 0, 0),
      });

      yPosition -= 15;
    }

    if (yPosition < 50) {
      pageHeight += 50 - yPosition;
      page.setSize(pageWidth, pageHeight);
      yPosition = 50;
    }

    // Divisor
    page.drawText("--------------------------------", {
      x: 10,
      y: yPosition,
      size: 10,
      font,
    });
    yPosition -= 20;

    // Sale total
    const totalText = `TOTAL: $${totalSaleAmount.toFixed(2)}`;
    const totalTextWidth = boldFont.widthOfTextAtSize(totalText, 12);

    page.drawText(totalText, {
      x: (pageWidth - totalTextWidth) / 2,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    yPosition -= 30;

    // Footer
    const message = "Descargado por Sistema Inari";
    const textWidth = font.widthOfTextAtSize(message, 8);

    page.drawText(message, {
      x: (pageWidth - textWidth) / 2,
      y: 20,
      size: 8,
      font,
      color: rgb(0, 0, 0),
    });

    // Save PDF
    return await pdfDoc.save();
  } catch (error) {
    console.error("Error generando el ticket de venta:", error);
    throw error;
  }
}
