import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabaseServer";
export const prerender = false;

export const GET: APIRoute = async () => {
   try {
      const { data, error } = await supabaseAdmin
         .from("white_noise")
         .select("*");

      if (error) {
         console.error("Gagal mengambil data white_noise", error.message);
         return new Response(
            JSON.stringify({
               message: "Gagal mengambil data white_noise",
               error: error.message,
            }),
            {
               status: 500,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
      }

      return new Response(
         JSON.stringify({
            message: "Data white_noise berhasil diambil",
            white_noise: data, // ✅ Sesuaikan dengan yang diakses frontend
         }),
         {
            status: 200,
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   } catch (err: any) {
      console.error(
         "API Error untuk mengambil semua data white_noise:",
         err.message
      );
      return new Response(
         JSON.stringify({
            message: "An unexpected error occurred while fetching white_noise",
            error: err.message,
         }),
         {
            status: 500,
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   }
};
