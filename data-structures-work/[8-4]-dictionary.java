// Name: REDACTED
// Date: March-15-2021

import java.io.*;
import java.util.*;

public class Dictionary {
   public static void main(String[] args) {
      Scanner infile = null;
      try {
         infile = new Scanner(new File("spanglish.txt"));
         System.setOut(new PrintStream(new FileOutputStream("dictionaryOutput.txt")));
      } catch(Exception e) {}
      
      Map<String, Set<String>> eng2spn = makeDictionary(infile);
      System.out.println("ENGLISH TO SPANISH");
      display(eng2spn);
   
      Map<String, Set<String>> spn2eng = reverse(eng2spn);
      System.out.println("SPANISH TO ENGLISH");
      display(spn2eng);
   }
   
   public static Map<String, Set<String>> makeDictionary(Scanner infile) {
      //create necessary things
      Map<String, Set<String>> toSpanishOutput = new TreeMap<String, Set<String>>();
      String targetKey = "";
      //go through all words
      //assume the number of words is fine
      while (infile.hasNext()) {
         String word = infile.next();
         if (word != "") {
            add(toSpanishOutput, word, infile.next());
         }
      }
      return toSpanishOutput;
   }
   
   public static void add(Map<String, Set<String>> dictionary, String word, String translation) { 
      //if it's a new word
      if (dictionary.get(word) == null) {
         dictionary.put(word, new TreeSet<String>());
      }

      //add to value listing
      dictionary.get(word).add(translation);
   }
   
   public static void display(Map<String, Set<String>> m) {
      //get list of all keys
      Set<String> wordSet = m.keySet();

      //loop through all keys
      for (String word : wordSet) {
         //loop through all values
         Set<String> transSet = m.get(word);
         String crunched = "";
         boolean first = true;
         for (String lily : transSet) {
            if (first) {
               crunched += lily;
               first = false;
            } else {
               crunched += ", " + lily;
            }
            
         }

         //output key + value pair
         System.out.println(word+" ["+crunched+"]");
      }
   }
   
   public static Map<String, Set<String>> reverse(Map<String, Set<String>> dictionary) {
      //dictionary to return 
      Map<String, Set<String>> returnTranslation = new TreeMap<String, Set<String>>();
      //get list of all keys
      Set<String> wordSet = dictionary.keySet();

      //loop through all keys
      for (String word : wordSet) {
         //loop through all values
         Set<String> transSet = dictionary.get(word);
         for (String tiffany : transSet) {
             //add value, key pair
             add(returnTranslation, tiffany, word);
         }
      }
      return returnTranslation;
   }
}


   /********************
	INPUT:
   	holiday
		fiesta
		holiday
		vacaciones
		party
		fiesta
		celebration
		fiesta
     <etc.>
  *********************************** 
	OUTPUT:
		ENGLISH TO SPANISH
			banana [banana]
			celebration [fiesta]
			computer [computadora, ordenador]
			double [doblar, doble, duplicar]
			father [padre]
			feast [fiesta]
			good [bueno]
			hand [mano]
			hello [hola]
			holiday [fiesta, vacaciones]
			party [fiesta]
			plaza [plaza]
			priest [padre]
			program [programa, programar]
			sleep [dormir]
			son [hijo]
			sun [sol]
			vacation [vacaciones]

		SPANISH TO ENGLISH
			banana [banana]
			bueno [good]
			computadora [computer]
			doblar [double]
			doble [double]
			dormir [sleep]
			duplicar [double]
			fiesta [celebration, feast, holiday, party]
			hijo [son]
			hola [hello]
			mano [hand]
			ordenador [computer]
			padre [father, priest]
			plaza [plaza]
			programa [program]
			programar [program]
			sol [sun]
			vacaciones [holiday, vacation]

**********************/