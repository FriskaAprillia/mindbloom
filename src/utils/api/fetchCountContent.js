import { supabaseClient } from "../../lib/supabaseClient";
export const fetchArtikelCount = async () => {
  const { count, error } = await supabaseClient
    .from('artikel')
    .select('*', { count: 'exact', head: true }); // Mengambil hanya count
  if (error) throw error;
  return count || 0; // Pastikan mengembalikan 0 jika count null
};

export const fetchEdukasiCount = async () => {
  const { count, error } = await supabaseClient
    .from('edukasi')
    .select('*', { count: 'exact', head: true }); // Mengambil hanya count
  if (error) throw error;
  return count || 0; // Pastikan mengembalikan 0 jika count null
};
export const fetchWhiteNoiseCount = async () => {
  const { count, error } = await supabaseClient
    .from('white_noise')
    .select('*', { count: 'exact', head: true }); // Mengambil hanya count
  if (error) throw error;
  return count || 0; // Pastikan mengembalikan 0 jika count null
};
export const fetchUserCount = async () => {
  const { count, error } = await supabaseClient
    .from('pengguna')
    .select('*', { count: 'exact', head: true }); // Mengambil hanya count
  if (error) throw error;
  return count || 0; // Pastikan mengembalikan 0 jika count null
};