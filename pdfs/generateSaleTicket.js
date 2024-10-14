import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getProduct } from "@/src/models/platform/product/product";
import axios from "axios";

export async function generateSaleTicket(saleItems, totalSaleAmount) {
  const pdfDoc = await PDFDocument.create();
  const pageHeight = 595;
  const pageWidth = 842;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoUrl = `${domain}/${process.env.NEXT_PUBLIC_LOGO_FILE_NAME}`;

  try {
    const logoImageBytes = (
      await axios.get(logoUrl, { responseType: "arraybuffer" })
    ).data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDimensions = logoImage.scale(0.3);

    page.drawImage(logoImage, {
      x: 40,
      y: pageHeight - logoDimensions.height - 40,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );

    let yPositionItems = pageHeight - 220;

    for (const item of saleItems) {
      const product = await getProduct(item.product_id);
      const itemLine = `${item.quantity}x ${
        product.name || "Producto no encontrado"
      } - $ ${item.sale_item_total.toFixed(2)}`;

      page.drawText(itemLine, {
        x: 50,
        y: yPositionItems,
        size: 14,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPositionItems -= 20;
    }

    page.drawText(`Total: $${totalSaleAmount.toFixed(2)}`, {
      x: 50,
      y: yPositionItems - 20,
      size: 16,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating the sales ticket PDF:", error.message);
    throw error;
  }
}
