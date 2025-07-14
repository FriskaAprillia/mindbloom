// supabaseLogin.js
import { supabaseClient } from "../../lib/supabaseClient";

const loginUser = async (email, password) => {
 try {
 const { data, error } = await supabaseClient.auth.signInWithPassword({
 email,
 password,
 });

 if (error) {
 throw error;
 }


 return data;
 } catch (error) {
 console.error(error);
 throw error;
 }
};

export default loginUser;