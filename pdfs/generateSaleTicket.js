import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";
import { NextResponse } from "next/server";

// Function to generate the sales ticket in PDF format
export async function generateSaleTicket(saleItems, totalSaleAmount) {
  const pdfDoc = await PDFDocument.create();
  const pageHeight = 595;
  const pageWidth = 842;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Build the logo URL from environment variables
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoUrl = `${domain}/${process.env.NEXT_PUBLIC_LOGO_FILE_NAME}`;

  try {
    // Fetch and embed the logo image from the URL
    const logoImageBytes = (await axios.get(logoUrl, { responseType: "arraybuffer" })).data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDimensions = logoImage.scale(0.3);

    // Draw the logo on the PDF
    page.drawImage(logoImage, {
      x: 40,
      y: pageHeight - logoDimensions.height - 40,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    // Fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Draw the sale items
    let yPositionItems = pageHeight - 220;
    saleItems.forEach((item) => {
      const itemLine = `${item.quantity}x ${item.description} - $${item.price.toFixed(2)}`;
      page.drawText(itemLine, {
        x: 50,
        y: yPositionItems,
        size: 14,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      yPositionItems -= 20;
    });

    // Draw the total sale amount
    page.drawText(`Total: $${totalSaleAmount.toFixed(2)}`, {
      x: 50,
      y: yPositionItems - 20,
      size: 16,
      font: timesRomanBoldFont,
      color: rgb(0, 0, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating the sales ticket PDF:", error.message);
    throw error;
  }
}