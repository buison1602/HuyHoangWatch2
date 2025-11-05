import { createClient } from '@supabase/supabase-js';

export type FilterOption = {
  id: string;
  name: string;
  slug: string;
};

export type FilterData = {
  categories: FilterOption[];
  brands: FilterOption[];
  genders: FilterOption[];
  straps: FilterOption[];
  accessories: FilterOption[];
  services: FilterOption[];
};

const fallbackData: FilterData = {
  categories: [
    { id: '1', name: 'Đồng hồ cổ điển', slug: 'co-dien' },
    { id: '2', name: 'Đồng hồ thể thao', slug: 'the-thao' },
    { id: '3', name: 'Đồng hồ thông minh', slug: 'thong-minh' },
    { id: '4', name: 'Đồng hồ sang trọng', slug: 'sang-trong' },
  ],
  brands: [
    { id: '1', name: 'Seiko', slug: 'seiko' },
    { id: '2', name: 'Citizen', slug: 'citizen' },
    { id: '3', name: 'Orient', slug: 'orient' },
    { id: '4', name: 'Casio', slug: 'casio' },
    { id: '5', name: 'Tissot', slug: 'tissot' },
  ],
  genders: [
    { id: '1', name: 'Nam', slug: 'nam' },
    { id: '2', name: 'Nữ', slug: 'nu' },
    { id: '3', name: 'Cặp đôi', slug: 'cap-doi' },
  ],
  straps: [
    { id: '1', name: 'Dây da', slug: 'day-da' },
    { id: '2', name: 'Dây thép', slug: 'day-thep' },
    { id: '3', name: 'Dây vải', slug: 'day-vai' },
    { id: '4', name: 'Dây cao su', slug: 'day-cao-su' },
  ],
  accessories: [
    { id: '1', name: 'Hộp đựng đồng hồ', slug: 'hop-dong-ho' },
    { id: '2', name: 'Dây đeo thay thế', slug: 'day-thay-the' },
    { id: '3', name: 'Máy lau đồng hồ', slug: 'may-lau' },
  ],
  services: [
    { id: '1', name: 'Bảo hành', slug: 'bao-hanh' },
    { id: '2', name: 'Sửa chữa', slug: 'sua-chua' },
    { id: '3', name: 'Thay pin', slug: 'thay-pin' },
    { id: '4', name: 'Đánh bóng', slug: 'danh-bong' },
  ],
};

let supabase: ReturnType<typeof createClient> | null = null;

if (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function loadFilters(): Promise<FilterData> {
  if (!supabase) {
    return fallbackData;
  }

  try {
    const [categories, brands, genders, straps, accessories, services] =
      await Promise.all([
        supabase.from('categories').select('id, name, slug'),
        supabase.from('brands').select('id, name, slug'),
        supabase.from('genders').select('id, name, slug'),
        supabase.from('strap_types').select('id, name, slug'),
        supabase.from('accessories').select('id, name, slug'),
        supabase.from('services').select('id, name, slug'),
      ]);

    return {
      categories: categories.data || fallbackData.categories,
      brands: brands.data || fallbackData.brands,
      genders: genders.data || fallbackData.genders,
      straps: straps.data || fallbackData.straps,
      accessories: accessories.data || fallbackData.accessories,
      services: services.data || fallbackData.services,
    };
  } catch (error) {
    console.warn('Failed to load filters from Supabase, using fallback:', error);
    return fallbackData;
  }
}
