import { generateSaleTicket } from "@/pdfs/generateSaleTicket";
import { NextResponse } from "next/server";

// GET endpoint to generate the sales ticket PDF
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const saleItemsParam = searchParams.get("saleItems");
  const totalSaleAmount = parseFloat(searchParams.get("totalSaleAmount"));

  // Validate required parameters
  if (!saleItemsParam || isNaN(totalSaleAmount)) {
    return NextResponse.json(
      { message: "Sale items and total amount are required" },
      { status: 400 }
    );
  }

  try {
    // Parse the sale items JSON
    const saleItems = JSON.parse(saleItemsParam);

    // Generate the PDF using the sale items and total sale amount
    const pdfBytes = await generateSaleTicket(saleItems, totalSaleAmount);

    // Return the PDF as an attachment
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=SalesTicket.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating sales ticket:", error);
    return NextResponse.json(
      { message: "Error generating the PDF" },
      { status: 500 }
    );
  }
}
