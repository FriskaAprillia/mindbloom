import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabaseServer";
export const prerender = false;

export const GET: APIRoute = async () => {
   try {
      const { data, error } = await supabaseAdmin.from("artikel").select("*");

      if (error) {
         console.error("Gagal mengambil data artikel", error.message);
         return new Response(
            JSON.stringify({
               message: "Gagal mengambil data artikel",
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
            message: "Data artikel berhasil di ambil",
            artikel: data,
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
         "API Error untuk mengambil semua data artikel:",
         err.message
      );
      return new Response(
         JSON.stringify({
            message: "An unexpected error occurred while fetching artikel",
            error: err.message,
         }),
         {
            status: 500, // Internal Server Error
            headers: {
               "Content-Type": "application/json",
            },
         }
      );
   }
};
