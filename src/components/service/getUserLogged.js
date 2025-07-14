// getUserLogged.js
import { supabaseClient } from "../../lib/supabaseClient";

const getUserLogged = async () => {
   try {
      const { data, error: sessionError } = await supabaseClient.auth.getSession();
      const session = data.session;

      if (!session) {
         return null;
      }
    //  console.log("EMAIL:", session.user.email);


      const { data: pengguna, error } = await supabaseClient
         .from("pengguna")
         .select("*")
         .eq("emailpengguna", session.user.email);

      if (error) {
         throw error;
      }

      //console.log("HASIL PENGGUNA:", pengguna);


      return pengguna[0];
   } catch (error) {
      console.error(error);
      throw error;
   }
};

const logoutUser = async () => {
   try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      console.log("Berhasil logout!");
   } catch (error) {
      console.error("Gagal logout:", error);
      throw error;
   }
};


export { getUserLogged, logoutUser };
