// supabaseRegis.js
import { supabaseClient } from "../../lib/supabaseClient";

const registerUser = async (email, password, username) => {
   try {
      const { data, error } = await supabaseClient.auth.signUp({
         email,
         password,
         options: {
            data: {
               username,
            },
         },
      });

      if (error) {
         throw error;
      }

      // Simpan data pengguna pada tabel pengguna
      const idpengguna = data.user.id; // ambil 5 karakter pertama dari id pengguna
      const { error: errorInsert } = await supabaseClient
         .from("pengguna")
         .insert([
            {
               idpengguna,
               namapengguna: username,
               emailpengguna: email,
               katasandipengguna: "",
               role: "user",
            },
         ]);

      if (errorInsert) {
         throw errorInsert;
      }

      return data;
   } catch (error) {
      console.error(error);
      throw error;
   }
};

export default registerUser;
