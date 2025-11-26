const IMGBB_API_KEY = process.env.IMGBB_API_KEY
const IMGBB_BASE_URL = "https://api.imgbb.com/1"

if (!IMGBB_API_KEY) {
  console.warn(
    "IMGBB_API_KEY is not configured. Profile image uploads/deletions will fail until it is provided."
  )
}

export interface ImageUploadResult {
  imageUrl: string
  displayUrl: string
  deleteHash: string
  imageId: string
}

export async function uploadImageToImgDB(base64Image: string, name?: string) {
  if (!IMGBB_API_KEY) {
    throw new Error("Missing IMGBB_API_KEY environment variable.")
  }

  const payload = new URLSearchParams()
  payload.append("image", base64Image)
  if (name) {
    payload.append("name", name)
  }

  const response = await fetch(`${IMGBB_BASE_URL}/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: payload,
  })

  const data = await response.json()

  if (!response.ok || !data || !data.success) {
    throw new Error(
      data?.error?.message ||
        "Failed to upload image to imgDB. Check the API key and payload."
    )
  }

  const displayUrl = data.data.display_url || data.data.url

  return {
    imageUrl: displayUrl,
    displayUrl,
    deleteHash: data.data.delete_hash,
    imageId: data.data.id,
  } satisfies ImageUploadResult
}

export async function deleteImageFromImgDB(deleteHash: string) {
  if (!IMGBB_API_KEY) {
    throw new Error("Missing IMGBB_API_KEY environment variable.")
  }

  const response = await fetch(
    `${IMGBB_BASE_URL}/delete/${encodeURIComponent(deleteHash)}?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
    }
  )

  const data = await response.json()
  if (!response.ok || !data || !data.success) {
    throw new Error(
      data?.error?.message ||
        "Failed to delete image from imgDB. The delete hash may be invalid."
    )
  }

  return data
}

