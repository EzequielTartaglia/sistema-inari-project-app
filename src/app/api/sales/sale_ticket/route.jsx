import { generateSaleTicket } from "@/pdfs/generateSaleTicket";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const saleItemsParam = searchParams.get("saleItems");
    const saleInfoParam = searchParams.get("saleInfo");
    const totalSaleAmount = parseFloat(searchParams.get("totalSaleAmount"));

    if (!saleItemsParam || !saleInfoParam || isNaN(totalSaleAmount)) {
      return NextResponse.json(
        { message: "Sale items, sale info, and total amount are required" },
        { status: 400 }
      );
    }

    let saleItems, saleInfo;
    try {
      saleItems = JSON.parse(saleItemsParam);
      saleInfo = JSON.parse(saleInfoParam);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON format in parameters" },
        { status: 400 }
      );
    }

    const pdfBytes = await generateSaleTicket(saleItems, totalSaleAmount, saleInfo);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=SalesTicket.pdf`,
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
