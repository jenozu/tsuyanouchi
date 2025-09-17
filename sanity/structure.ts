import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('TSUYA NO UCHI')
    .items([
      S.documentTypeListItem('product').title('Products'),
    ])
