import { groq } from 'next-sanity'

export const PRODUCTS_QUERY = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  "id": slug.current,
  title,
  price,
  "image": mainImage.asset->url,
  "gallery": gallery[].asset->url,
  sizes,
  tags,
  description,
  inStock
}`

export const PRODUCT_QUERY = groq`*[_type == "product" && slug.current == $slug][0] {
  _id,
  "id": slug.current,
  title,
  price,
  "image": mainImage.asset->url,
  "gallery": gallery[].asset->url,
  sizes,
  tags,
  description,
  inStock
}`
