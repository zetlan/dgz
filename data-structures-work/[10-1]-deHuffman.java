// Name: [REDACTED]
//Date: May-2-2021
import java.util.*;
import java.io.*;
public class deHuffman {
   public static void main(String[] args) throws IOException
   {
      Scanner keyboard = new Scanner(System.in);
      System.out.print("\nWhat binary message (middle part)? ");
      String middlePart = keyboard.next();
      Scanner sc = new Scanner(new File("message."+middlePart+".txt")); 
      String binaryCode = sc.next();
      Scanner huffLines = new Scanner(new File("scheme."+middlePart+".txt")); 
      	
      TreeNode root = huffmanTree(huffLines);
      String message = dehuff(binaryCode, root);
      System.out.println(message);
      	
      sc.close();
      huffLines.close();
   }
   public static TreeNode huffmanTree(Scanner huffLines) {
      //create base node
      TreeNode base = new TreeNode(null);

      //loop through lines of the coding
      while (huffLines.hasNext()) {
         String line = huffLines.nextLine();
         //first character is the storage character
         char storeChr = line.charAt(0);
         TreeNode ref = base;
         for (int c=1; c<line.length(); c++) {
            char controlChr = line.charAt(c);
            //0 is left, 1 is right
            if (controlChr == '0') {
               //if there's already a node to the left, move to it. If not, create node
               if (ref.getLeft() == null) {
                  ref.setLeft(new TreeNode(null));
               }
               ref = ref.getLeft();
            } else {
               //same thing but mirror mode
               if (ref.getRight() == null) {
                  ref.setRight(new TreeNode(null));
               }
               ref = ref.getRight();
            }
         }
         //set the value of the reference to the encoding character
         ref.setValue(storeChr);
      }
      return base;
   }
   public static String dehuff(String text, TreeNode root) {
      String finalStr = "";
      TreeNode ref = root;
      for (int chr=0; chr<text.length(); chr++) {
         //go to the next level in the tree
         if (text.charAt(chr) == '0') {
            ref = ref.getLeft();
         } else {
            ref = ref.getRight();
         }

         //if there's a value, append and reset
         if (ref.getValue() != null) {
            finalStr += ref.getValue();
            ref = root;
         }
      }
      return finalStr;
   }
}






 /* TreeNode class for the AP Exams */
class TreeNode
{
   private Object value; 
   private TreeNode left, right;
   
   public TreeNode(Object initValue)
   { 
      value = initValue; 
      left = null; 
      right = null; 
   }
   
   public TreeNode(Object initValue, TreeNode initLeft, TreeNode initRight)
   { 
      value = initValue; 
      left = initLeft; 
      right = initRight; 
   }
   
   public Object getValue()
   { 
      return value; 
   }
   
   public TreeNode getLeft() 
   { 
      return left; 
   }
   
   public TreeNode getRight() 
   { 
      return right; 
   }
   
   public void setValue(Object theNewValue) 
   { 
      value = theNewValue; 
   }
   
   public void setLeft(TreeNode theNewLeft) 
   { 
      left = theNewLeft;
   }
   
   public void setRight(TreeNode theNewRight)
   { 
      right = theNewRight;
   }
}
