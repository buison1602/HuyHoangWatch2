import { createClient } from "@/lib/supabase/client"

const BUCKET_NAME = "product-images"

/**
 * Upload an image file to Supabase Storage
 * @param file - The image file to upload
 * @param productId - The product ID to organize files
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split(".").pop()
  const filename = `${productId}/${timestamp}-${random}.${extension}`

  // Upload file to storage
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

  return publicUrlData.publicUrl
}

/**
 * Delete an image from Supabase Storage
 * @param imagePath - The path of the image to delete
 */
export async function deleteProductImage(imagePath: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([imagePath])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}
