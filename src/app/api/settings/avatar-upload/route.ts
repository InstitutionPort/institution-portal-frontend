import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'
import { NextRequest } from 'next/server'
import { genApiResponse } from '@/utils/gen-api-response'
import { checkTokenIsValid } from '@/utils/authtoken'
import { avatarUrl } from '@/lib/validation/common-validation'

// Required to avoid body stream getting consumed
export const config = {
  api: {
    bodyParser: false
  }
}

// Helper to parse multipart/form-data
function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
      uploadDir: '/tmp', // or use process.cwd() + '/uploads' or /public/uploads
    })

    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}
const ACCESS_SECRET = process.env.ACCESS_SECRET


export async function POST(req: NextRequest) {
  try {
    // (Optional) check auth
    const user = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }
    // we are using formidable to parse the multipart/form-data structure that the avatar was sent as.
    // after that store in db and send the url of the image back
    // const { files } = await parseForm(req)

    // const avatarFile = files.avatar
    // if (!avatarFile) {
    //   return genApiResponse({
    //     code: "NO_FILE",
    //     message: "No file uploaded.",
    //     status: 400
    //   })
    // }

    // Optional: move file somewhere permanent, or upload to S3
    // For example, read it into a Buffer or store it:
    // const fileBuffer = await fs.readFile(avatarFile.filepath)

    // Respond with success (you would return the image URL after upload)
    return genApiResponse({
      code: "AVATAR_UPDATED",
      message: "Avatar uploaded successfully.",
      status: 200,
      data: {
        //a dummy url, send the newly generated url instead
        avatarUrl: 'https://yt3.ggpht.com/yti/ANjgQV85IR8hKpPTwno1vJWzzuJq3mHeBo3CkVJBL4gAC-I_Ioo=s88-c-k-c0x00ffffff-no-rj'
      }
    })

  } catch (err: any) {
    return genApiResponse({
      code: "UPLOAD_FAILED",
      message: "Something went wrong during upload.",
      status: 500
    })
  }
}
