// Name: 
// Date: March-26-2021

import java.util.*;

public class HashingAWidget
{
   public static void main(String[] args)
   {
      Set<Widget> tSet = new TreeSet<Widget>();
      Set<Widget> hSet = new HashSet<Widget>();
      	
      Widget a = new Widget(2,3);   //same or different?
      Widget b = new Widget(2,3);
      Widget c = new Widget(2,3);
      // c = b;
         
      tSet.add(a); 
      tSet.add(b);
      tSet.add(c);
       
      hSet.add(a); 
      hSet.add(b);
      hSet.add(c); 
         
      System.out.println(a.hashCode()+ " "+b.hashCode() + " " + c.hashCode());
         
      System.out.println("TreeSet:  " + tSet);
      System.out.println("HashSet:  " + hSet);
   }
}

/** 
 *  Modify the Widget class so that it hashes on its
 *  values, not on its address.   Be sure that compareTo(),
 *  equals(Object) and hashCode() agree with each other.
 */
class Widget implements Comparable<Widget> {
   private int myCubits, myHands;
   
   public Widget() {
      myCubits = myHands = 0;
   }
   
   public Widget(int x) {
      myCubits = x;
      myHands = 0;
   }
   
   public Widget(int x, int y) {
      myCubits = x;
      myHands = y;
   }
   
   public Widget(Widget arg) {
      myCubits = arg.getCubits();
      myHands = arg.getHands();
   }
   
   public int getCubits() {
      return myCubits;
   }
   
   public int getHands() {
      return myHands;
   }
  
   public void setCubits(int x) {
      myCubits = x;
   }
   
   public void setHands(int x) {
      myHands = x;
   }
   
   //other methods
   public int compareTo(Widget other) {
      // Widget w = (Widget)other;       no need to cast
      if(myCubits < other.getCubits())
         return -1;
      if(myCubits > other.myCubits)
         return 1;
      if(myHands < other.myHands) {
         return -1;
      }
      if (myHands > other.getHands()) {
         return 1;
      }
      return 0;
   }
   
   public boolean equals(Widget other) {
      return compareTo(other) == 0;
   }
   public String toString() {
      return myCubits + " cubits " + myHands + " hands";
   }  
   
  	/* 2 new methods for this lab */
   public boolean equals(Object arg) {
      return (this.hashCode() == arg.hashCode());
   }
   
   public int hashCode() {
      return (int)(Integer.valueOf(this.myCubits).hashCode() * Integer.valueOf(this.myHands).hashCode());
   }
   
}