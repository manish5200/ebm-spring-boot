package myApp.ebm.util;

import java.util.Base64;
public class EncryptionUtil {
            
	 public static String encrypt(String plain) {
		  return Base64.getEncoder().encodeToString(plain.getBytes());
	 }
	 
	 public static String decrypt(String cipher) {
		  return new String(Base64.getDecoder().decode(cipher));
	 }
	      
}
