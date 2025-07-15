import { countries } from "@/data/countries"
import { genApiResponse } from "@/utils/gen-api-response"
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "@/utils/types"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
  try {

    return genApiResponse({
      code: "FETCHED",
      message: "Nations Data Fetched Successfully.",
      data: { nations: countries },
      status: 200,
    })



  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }

}