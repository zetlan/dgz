 // Name: REDACTED
 // Date: March-22-2021

import java.util.*;

public class Polynomial_Driver {
   public static void main(String[] args) {
      Polynomial poly = new Polynomial();    // 2x^3 + -4x + 2
      poly.makeTerm(1, -4);
      poly.makeTerm(3, 2);
      poly.makeTerm(0, 2);
      System.out.println("Map:  " + poly.getMap());
      System.out.println("String:  " + poly.toString());
      double evaluateAt = 2.0;
      System.out.println("Evaluated at "+ evaluateAt +": " +poly.evaluateAt(evaluateAt));
      
      System.out.println("-----------");
      Polynomial poly2 = new Polynomial();  // 2x^4 + x^2 + -5x + -3
      poly2.makeTerm(1, -5);
      poly2.makeTerm(4, 2);
      poly2.makeTerm(0, -3);
      poly2.makeTerm(2, 1);
      System.out.println("Map:  " + poly2.getMap()); 
      System.out.println("String:  " +poly2.toString());
      evaluateAt = -10.5;
      System.out.println("Evaluated at "+ evaluateAt +": " +poly2.evaluateAt(evaluateAt));
      
      
      System.out.println("-----------");
      System.out.println("Sum: " + poly.add(poly2));
      System.out.println("Product:  " + poly.multiply(poly2));
      
      /*  Another case:   (x+1)(x-1) -->  x^2 + -1    */
      System.out.println("===========================");
      Polynomial poly3 = new Polynomial();   // (x+1)
      poly3.makeTerm(1, 1);
      poly3.makeTerm(0, 1);
      System.out.println("Map:  " + poly3.getMap());
      System.out.println("String:  " + poly3.toString());
   //       
      Polynomial poly4 = new Polynomial();    // (x-1)
      poly4.makeTerm(1, 1);
      poly4.makeTerm(0, -1);
      System.out.println("Map:  " + poly4.getMap());
      System.out.println("String:  " + poly4.toString());
      System.out.println("Product:  " + poly4.multiply(poly3));   // x^2 + -1 
   //    
   //    /*  testing the one-arg constructor  */
      // System.out.println("==========================="); 
      // Polynomial poly5 = new Polynomial("2x^3 + 4x^2 + 6x^1 + -3");
      // System.out.println("Map:  " + poly5.getMap());  
      // System.out.println(poly5);

   }
}
interface PolynomialInterface {
   public void makeTerm(Integer exp, Integer coef);
   public Map<Integer, Integer> getMap();
   public double evaluateAt(double x);
   public Polynomial add(Polynomial other);
   public Polynomial multiply(Polynomial other);
   public String toString();
}

class Polynomial implements PolynomialInterface {
   public TreeMap<Integer, Integer> terms = new TreeMap<Integer, Integer>();
   public Polynomial() {
   }

   public void makeTerm(Integer exp, Integer coef) {
      //set term : value  pair
      this.terms.put(exp, coef);
   }

   //java is my favorite coding language because I know that every function I write does something useful (:
   public Map<Integer, Integer> getMap() {
      return this.terms;
   }

   public double evaluateAt(double x) {
      //get all powers
      double output = 0;
      double tempNumStorage;
      //loop through all held powers, multiply x that number of times, and add to output.
      for (int power : this.terms.keySet()) {
         tempNumStorage = 1;
         for (int t=0; t<power; t++) {
            tempNumStorage *= x;
         }
         //also make sure to factor in number
         output += tempNumStorage * this.terms.get(power);
      }
      return output;
   }

   public Polynomial add(Polynomial other) {
      //create new polynomial
      Polynomial mergePoly = new Polynomial();

      //create a new map
      TreeMap<Integer, Integer> mergeTerms = new TreeMap<Integer, Integer>();

      //glomph self's values and other's values together
      for (int term : this.terms.keySet()) {
         mergeTerms.put(term, this.terms.get(term));
      }

      //this one's a bit more difficult, as it has to deal with possible values being there already
      for (int term : other.terms.keySet()) {
         if (mergeTerms.get(term) == null) {
            mergeTerms.put(term, other.terms.get(term));
         } else {
            mergeTerms.put(term, other.terms.get(term) + mergeTerms.get(term));
         }
      }

      //give new polynomial those glomphed values
      for (int term : mergeTerms.keySet()) {
         mergePoly.makeTerm(term, mergeTerms.get(term));
      }

      //return the friendo
      return mergePoly;
   }

   public Polynomial multiply(Polynomial other) {
      //create new polynomial
      Polynomial multPoly = new Polynomial();

      //create a new map
      TreeMap<Integer, Integer> multTerms = new TreeMap<Integer, Integer>();

      //glomph self's values and other's values together
      for (int term : this.terms.keySet()) {
         for (int termOther : other.terms.keySet()) {
            //add exponents together, multiply values together
            if (multTerms.get(term + termOther) == null) {
               multTerms.put(term + termOther, this.terms.get(term) * other.terms.get(termOther));
            } else {
               multTerms.put(term + termOther, multTerms.get(term + termOther) + (this.terms.get(term) * other.terms.get(termOther)));
            }
         }
      }

      //glomph terms into the polynomial
      for (int term : multTerms.keySet()) {
         multPoly.makeTerm(term, multTerms.get(term));
      }
      //return the friendo
      return multPoly;
   }

   public String toString() {
      String output = "";
      //loop through all terms
      for (int term : this.terms.keySet()) {
         //don't care if the multiplier is 0
         if (this.terms.get(term) != 0) {
            if (term >= 2) {
               //x^2 and above
               if (this.terms.get(term) == 1) {
                  output = "x^"+term+" + "+output;
               } else {
                  output = this.terms.get(term)+"x^"+term+" + "+output;
               }
               
            } else if (term == 1) {
               //x
               if (this.terms.get(term) == 1) {
                  output = "x + "+output;
               } else {
                  output = this.terms.get(term)+"x + "+output;
               }
            } else {
               //1
               output = this.terms.get(term)+" + "+output;
            }
         }
      }

      //remove the extra plus, will fail if there's nothing in the polynomial but that's not really my problem ;)
      output = output.substring(0, output.length()-3);
      return output;
   }
}


/***************************************  
  ----jGRASP exec: java Polynomial_teacher
 Map:  {0=2, 1=-4, 3=2}
 String:  2x^3 + -4x + 2
 Evaluated at 2.0: 10.0
 -----------
 Map:  {0=-3, 1=-5, 2=1, 4=2}
 String:  2x^4 + x^2 + -5x + -3
 Evaluated at -10.5: 24469.875
 -----------
 Sum: 2x^4 + 2x^3 + x^2 + -9x + -1
 Product:  4x^7 + -6x^5 + -6x^4 + -10x^3 + 22x^2 + 2x + -6
 
  ----jGRASP: operation complete.
 ********************************************/