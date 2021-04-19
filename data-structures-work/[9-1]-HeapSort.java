// Name: REDACTED
// Date: April-15-2021

public class HeapSort {
   public static int SIZE;  //9 or 100
	
   public static void main(String[] args) {
      //Part 1: Given a heap, sort it. Do this part first. 
      SIZE = 9;  
      double heap[] = {-1,99,80,85,17,30,84,2,16,1};
      
      display(heap);
      sort(heap);
      display(heap);
      System.out.println(isSorted(heap));
      
      //Part 2:  Generate 100 random numbers, make a heap, sort it.
      SIZE = 100;
      heap = new double[SIZE + 1];
      heap = createRandom(heap);
      display(heap);
      makeHeap(heap, SIZE);
      display(heap); 
      sort(heap);
      display(heap);
      System.out.println(isSorted(heap));
   }
   
	//******* Part 1 ******************************************
   public static void display(double[] array) {
      System.out.print("[");
      for(int k = 1; k < array.length; k++) {
         System.out.print(array[k]);
         if (k < array.length-1) {
            System.out.print(", ");
         }
      }
      System.out.print("]");
      System.out.println("\n");	
   }
   
   public static void sort(double[] array) {

      int newIndex = 0;
      double[] sorted = new double[SIZE+1];
      sorted[0] = -1;
      while (newIndex < SIZE) {
         newIndex += 1;
         //top value is the largest. Remove it and add to the final array
         sorted[newIndex] = array[1];

         //get value at the end of the array and place it at the top
         array[1] = array[SIZE - newIndex + 1];

         //remake heap
         heapDown(array, 1, SIZE - newIndex);
      }

      //put sorted array back into regular array
      for (int a=0; a<array.length; a++) {
         array[a] = sorted[a];
      }
   }
  
   public static void swap(double[] array, int a, int b) {
      //*grumble grumble 3 line swap*
      double storage = array[a];
      array[a] = array[b];
      array[b] = storage;
   }
   
   public static void heapDown(double[] array, int k, int size) {
      //compare value at k to child (2k and 2k+1)

      //2 children exist
      if (k * 2 + 1 <= size) {
         if (array[k*2] > array[k] || array[k*2 + 1] > array[k]) {
            //if both children are larger, pick largest one
            if (array[k*2] > array[k] && array[k*2 + 1] > array[k]) {
               if (array[k*2] > array[k*2+1]) {
                  swap(array, k, k*2);
                  heapDown(array, k*2, size);
               } else {
                  swap(array, k, k*2+1);
                  heapDown(array, k*2+1, size);
               }
               return;
            }

            //if only one child is larger, recurse to that one
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

      //1 children exist
      if (k * 2 <= size) {
         if (array[k * 2] > array[k]) {
            swap(array, k, k*2);
            heapDown(array, k*2, size);
         }
         return;
      }

      //0 children exist
      //function call dies here, long live the function call
   }


   public static boolean isSorted(double[] arr) {
      //if the numbers all decrease, then it's sorted. Because it's a heap, starts at index 1
      double value = arr[1];
      for (int dex=2; dex<arr.length; dex++) {
         if (arr[dex] > value) {
            return false;
         }
         value = arr[dex];
      }
      return true;
   }
   
   //****** Part 2 *******************************************

   //Generate 100 random numbers (between 1 and 100, formatted to 2 decimal places) 
   public static double[] createRandom(double[] array) {  
      array[0] = -1;   //because it will become a heap
      for (int f=1; f<100; f++) {
         //janky but works most of the time
         array[f] = Math.floor(Math.random() * 10000) / 100;
      }
      return array;
   }
   
   //turn the random array into a heap
   public static void makeHeap(double[] array, int size) {
      double[] heap = new double[size+1];
      heap[0] = -1;
      //loop through all values in the array
      for (int v=1; v<=size; v++) {
         //shift all the values in the heap
         for (int h=v; h>0; h--) {
            swap(heap, h, h-1);
         }
         //add value to the new heap
         heap[1] = array[v];
         //heapify the thing
         heapDown(heap, 1, v);
      }

      //put back into original array
      for (int u=1; u<heap.length; u++) {
         array[u] = heap[u];
      }
   }
}

