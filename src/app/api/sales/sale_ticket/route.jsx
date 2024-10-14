import { generateSaleTicket } from "@/pdfs/generateSaleTicket";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const saleItemsParam = searchParams.get("saleItems");
  const totalSaleAmount = parseFloat(searchParams.get("totalSaleAmount"));

  if (!saleItemsParam || isNaN(totalSaleAmount)) {
    return NextResponse.json(
      { message: "Sale items and total amount are required" },
      { status: 400 }
    );
  }

  try {
    const saleItems = JSON.parse(saleItemsParam);
    console.log("Parsed Sale Items:", saleItems); 

    const pdfBytes = await generateSaleTicket(saleItems, totalSaleAmount);

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
