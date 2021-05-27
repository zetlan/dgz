 //Name: REDACTED
 //Date: April-19-2021
 
import java.util.*;


/* implement the API for java.util.PriorityQueue
 * test this class with HeapPriorityQueue_Driver.java.
 * test this class with LunchRoom.java.
 * add(E) and remove()  must work in O(log n) time
 */
public class HeapPriorityQueue<E extends Comparable<E>> 
{
   private ArrayList<E> myHeap;
   private int trueSize;
   
   public HeapPriorityQueue() {
      myHeap = new ArrayList<E>();
      myHeap.add(null);
      trueSize = 0;
   }
   
   public boolean add(E obj) {
     myHeap.set(obj);


     //move object up into its proper position
     heapUp(myHeap.size()-1);
     //I have no idea why this is a boolean
     return true;
   }
   
   public E remove() {
      if (myHeap.size() > 1) {
         E storage = myHeap.remove(1);

         if (myHeap.size() > 1) {
            //put last element in first position
            myHeap.add(1, myHeap.remove(myHeap.size()-1));

            //heap that friendo away
            heapDown(1, myHeap.size()-1);
         }
         return storage;
      }
      return null;
      
   }
   
   public E peek() {
      if (myHeap.size() == 1) {
         return myHeap.get(0);
      }
      return myHeap.get(1);
   }
   
   public boolean isEmpty() {
     return trueSize == 0;
   }
   
   private void heapUp(int k) {
      //if parent doesn't exist, break out
      if (k/2 < 1) {
         return;
      }

      //if parent is smaller than child, swap them
      if (myHeap.get(k/2).compareTo(myHeap.get(k)) < 0) {
         swap(k/2, k);
         //recurse
         heapUp(k/2);
      }
   }
   
   private void swap(int a, int b) {
     E storage = myHeap.get(a);
     myHeap.set(a, myHeap.get(b));
     myHeap.set(b, storage);
   }
   
   private void heapDown(int k, int size) {
      if (k * 2 + 1 <= size) {
         //ew java object syntax ew ew ew ew
         //how in the world did a language which doesn't use simple syntax half the time become the industry standard?
         //don't answer that, it was rhetorical
         if (myHeap.get(k*2).compareTo(myHeap.get(k)) > 0 || myHeap.get(k*2 + 1).compareTo(myHeap.get(k)) > 0) {
            if (myHeap.get(k*2).compareTo(myHeap.get(k)) > 0 && myHeap.get(k*2+1).compareTo(myHeap.get(k)) > 0) {
               if (myHeap.get(k*2).compareTo(myHeap.get(k*2+1)) > 0) {
                  swap(k, k*2);
                  heapDown(k*2, size);
               } else {
                  swap(k, k*2+1);
                  heapDown(k*2+1, size);
               }
               return;
            }

            if (myHeap.get(k*2).compareTo(myHeap.get(k)) > 0) {
               swap(k, k*2);
               heapDown(k*2, size);
               return;
            }

            if (myHeap.get(k*2+1).compareTo(myHeap.get(k)) > 0) {
               swap(k, k*2+1);
               heapDown(k*2+1, size);
               return;
            }
         }
      }

      if (k * 2 <= size) {
         if (myHeap.get(k*2).compareTo(myHeap.get(k)) > 0) {
            swap(k, k*2);
            heapDown(k*2, size);
         }
         return;
      }
   }
   
   public String toString() {
      return myHeap.toString();
   }  
}
