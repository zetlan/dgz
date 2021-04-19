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
   
   public HeapPriorityQueue() {
      myHeap = new ArrayList<E>();
      myHeap.add(null);
   }
   
   public boolean add(E obj) {
     myHeap.add(obj);
   }
   
   public E remove() {
      if (myHeap.size() > 1) {

      }
   }
   
   public E peek() {
      return myHeap.get(1);
   }
   
   public boolean isEmpty() {
     return myHeap.size() == 1;
   }
   
   private void heapUp(int k) {
      
   }
   
   private void swap(int a, int b) {
     E storage = myHeap.get(a);
     myHeap.set(a, myHeap.get(b));
     myHeap.set(b, storage);
   }
   
   private void heapDown(int k, int size) {
      if (k * 2 + 1 <= size) {
         if (myHeap.get(k*2) > myHeap.get(k) || myHeap.get(k*2 + 1) > myHeap.get(k)) {
            if (myHeap.get(k*2) > myHeap.get(k) && myHeap.get(k*2+1) > myHeap.get(k)) {
               if (myHeap.get(k*2) > myHeap.get(k*2+1)) {
                  swap(k, k*2);
                  heapDown(array, k*2, size);
               } else {
                  swap(array, k, k*2+1);
                  heapDown(array, k*2+1, size);
               }
               return;
            }

            if (array[k*2] > array[k]) {
               swap(array, k, k*2);
               heapDown(array, k*2, size);
               return;
            }

            if (array[k*2+1] > array[k]) {
               swap(array, k, k*2+1);
               heapDown(array, k*2+1, size);
               return;
            }
         }
      }

      if (k * 2 <= size) {
         if (array[k * 2] > array[k]) {
            swap(array, k, k*2);
            heapDown(array, k*2, size);
         }
         return;
      }
   }
   
   public String toString() {
      return myHeap.toString();
   }  
}
