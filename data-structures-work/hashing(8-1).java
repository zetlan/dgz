 // Name: J1-30
 // Date: March-15-2021

/* 
   Assignment:  This hashing program results in collisions.
   You are to implement three different collision schemes: linear 
   probing, rehashing, and chaining.  Then implement a search 
   algorithm that is appropriate for each collision scheme.
 */
import java.util.*;
import javax.swing.*;
public class Hashing {
   public static void main(String[] args) {
      int arrayLength = Integer.parseInt(JOptionPane.showInputDialog(
                         "Hashing!\n"+
                         "Enter the size of the array:  "));//20
       
      int numItems = Integer.parseInt(JOptionPane.showInputDialog(
                         "Add n items:  "));               //15
     
      int scheme = Integer.parseInt(JOptionPane.showInputDialog(
           "The Load Factor is " + (double)numItems/arrayLength +
           "\nWhich collision scheme?\n"+
           "1. Linear Probing\n" +
           "2. Rehashing\n"+
           "3. Chaining"));
      Hashtable table = null;
      switch( scheme ) {
         case 1:   
            table = new HashtableLinearProbe(arrayLength);
            break;
         case 2: 
            table = new HashtableRehash(arrayLength);
            break;
         case 3:  
            table = new HashtableChaining(arrayLength);
            break;
         default:  System.exit(0);
      }
      for(int i = 0; i < numItems; i++)
         table.add("Item" + i);
      int itemNumber = Integer.parseInt(JOptionPane.showInputDialog(
                       "Search for item: 0 to "+(numItems-1)));
      while( itemNumber != -1 ) {
         String key = "Item" + itemNumber;
         int index = table.indexOf(key); 
         if(index >= 0) {
            System.out.println(key + " found  at index " + index);
         } else {
            System.out.println(key + " not found!");
            itemNumber = Integer.parseInt(JOptionPane.showInputDialog("Search for item: 0 to "+(numItems-1)));
         }
         System.exit(0);
      } 
   }
}

/*********************************************/
interface Hashtable {
   void add(Object obj);
   int indexOf(Object obj);
}
/***************************************************/ 

class HashtableLinearProbe implements Hashtable {
   private Object[] array;
  
   public HashtableLinearProbe(int size) {
      array = new Object[size];
   }
   
   public void add(Object obj) {
      int code = obj.hashCode();
      int index = Math.abs(code % array.length);
      if(this.array[index] == null) {
         //insert it
         this.array[index] = obj;
         System.out.println(obj + "\t" + code + "\t" + index);
      } else {
         System.out.println(obj + "\t" + code + "\tCollision at "+ index);
         index = linearProbe(index);
         array[index] = obj;
         System.out.println(obj + "\t" + code + "\t" + index);
      }
   }  
   
   //searching in a straight line through the array
   public int linearProbe(int index) {
      int tolerance = this.array.length+1;
      while (this.array[index] != null && tolerance > 0) {
         index = (index + 1) % this.array.length;
         tolerance -= 1;
      }

      if (tolerance < 0) {
         System.out.println("ERROR: Hash table full! O-O ! Cannot find a valid spot, something likely broke somewhere!");
      }
      
      return index;
   }
   
   public int indexOf(Object obj) {
      System.out.println("entering function");
      int index = Math.abs(obj.hashCode() % this.array.length);
      System.out.println("Starting values: "+obj+" "+obj.hashCode()+" "+index);
      while(this.array[index] != null) {
         System.out.println("index "+index+"isn't null (:");
         if(this.array[index].equals(obj)) {
            //found the object
            return index;
         }
         System.out.println("value: "+this.array[index]+" comparing: "+obj);
         //if not found, searching through in a linear fashion, with a linear sort of style, y'know?
         index = (index + 1) % this.array.length; 
         System.out.println("Looking at index " + index);
      }
      //not found
      //I hope whatever uses this function is equipped for a -1 value
      return -1;
   }
}

/*****************************************************/
class HashtableRehash implements Hashtable {
   private Object[] array;
   private int constant;  
   
   public HashtableRehash(int size) {
      this.array = new Object[size];
      //calculate constant from size
      this.constant = getNextPrime(1);
      while (this.array.length % this.constant == 0) {
         this.constant = getNextPrime(this.constant);
      }

      //if the constant is greater than the length, it has failed and 1 should be used
      if (this.constant > this.array.length) {
         this.constant = 1;
      }
   }
   
   public void add(Object obj)
   {
      int code = obj.hashCode();
      int index = Math.abs(code % array.length);
      if(this.array[index] == null) {
         //insert it
         this.array[index] = obj;
         System.out.println(obj + "\t" + code + "\t" + index);
      }
      else {
         System.out.println(obj + "\t" + code + "\tCollision at "+ index);
         index = rehash(index);
         array[index] = obj;
         System.out.println(obj + "\t" + code + "\t" + index);
      }
   }

   public int getNextPrime(int currentPrime) {
      //starting from the current prime, increase number
      //yes this is a while true loop, it's ok there's bound to be another prime somewhere, I'll return out of it
      int currentTesting = currentPrime;
      while (true) {
         currentTesting += 1;
         //test if it's a prime
         if (isPrime(currentTesting)) {
            return currentTesting;
         }
      }
   }

   //returns true if the number is prime, false if not
   public boolean isPrime(int num) {
      //proper heuristic is square root but I am dumb and do not know how to do it, so I'll divide by 2 and add 1. It's inefficient, but works every time
      int limit = (int)(num / 2) + 1;
      int extraFactors = 0;
      for (int a=2; a<limit; a++) {
         //if it's divisible by a number other than itself or 1,it's problematic
         if (a != num && num % a == 0) {
            return false;
         }
      }
      //if still here..
      return true;
   }
   
   public int rehash(int index) {
      return (index + this.constant) % this.array.length;
   }
   
   public int indexOf(Object obj) {
      int index = Math.abs(obj.hashCode() % array.length);
      while(array[index] != null) {
         if(this.array[index].equals(obj)) {
            return index;
         } else {
            //rehash index and try again
            index = rehash(index);
            System.out.println("Looking at index " + index);
         }
      }
      //not found
      return -1;
   }
}

/********************************************************/
class HashtableChaining implements Hashtable {
   private LinkedList[] array;
   
   public HashtableChaining(int size) {
      //create base array then add linked lists
      this.array = new LinkedList[size];

      for (int uu=0; uu<this.array.length; uu++) {
         this.array[uu] = new LinkedList();
      }
   }

   public void add(Object obj)  {
      int code = obj.hashCode();
      int index = Math.abs(code % array.length);
      array[index].addFirst(obj);
      System.out.println(obj + "\t" + code + " " + " at " +index + ": "+ array[index]);
   }

   public int indexOf(Object obj) {
      int index = Math.abs(obj.hashCode() % array.length);
      int linkIndex = 0;
      if(!this.array[index].isEmpty()) {
         //search all items in the linked list
         while (this.array[index].get(linkIndex) != null) {
            if (this.array[index].get(linkIndex).equals(obj)) {
               //if found it, return
               return index;
            }
            //incrementing linkIndex
            linkIndex += 1;
         }
         linkIndex = 0;
         //increment index
         index += 1;
      }
      //not found
      return -1;
   }
}  