//Name: J1-30
//Date: March-18-2021

interface BSTinterface {
   public int size();
   public boolean contains(String obj);
   public void add(String obj);
   //public void addBalanced(String obj);
   //public boolean remove(String obj);
   public String min();
   public String max();
   public String toString();
}
 
/*******************
 Represents a binary search tree holding Strings. 
Implements (most of) BSTinterface, above. 
The recursive methods all have a public method calling a private helper method. 
Copy the display() method from TreeLab. 
**********************/
class BST implements BSTinterface{
   private TreeNode root;
   private int size;
   public BST() {
      root = null;
      size = 0;
   }
   public int size() {
      return this.size;  
   }
   public TreeNode getRoot() {
      return this.root;
   }
   /***************************************
   @param s -- one string to be inserted
   ****************************************/
   public void add(String s) {
      if (size == 0) {
         //null avoidance maneuvers
         root = new TreeNode(s);
      } else {
         add(root, s);
      }
      size += 1;
      
   }
   private void add(TreeNode t, String s) {      
      //compare the string to the stored value
      //if less or equal, move left
      if (s.compareTo((String)t.getValue()) <= 0) {
         //if the left node doesn't exist, create it
         if (t.getLeft() == null) {
            t.setLeft(new TreeNode(s));
         } else {
            //if it does exist, recurse
            add(t.getLeft(), s);
         }
      } else {
         //same thing but for greater on the right
         if (t.getRight() == null) {
            t.setRight(new TreeNode(s));
         } else {
            add(t.getRight(), s);
         }
      }
   }
   
   public String display() {
      return display(root, 0);
   }
   private String display(TreeNode t, int level) {
      String toRet = "";
      if(t == null)
         return "";
      toRet += display(t.getRight(), level + 1); //recurse right
      for(int k = 0; k < level; k++)
         toRet += "\t";
      toRet += t.getValue() + "\n";
      toRet += display(t.getLeft(), level + 1); //recurse left
      return toRet;
   }
   
   public boolean contains(String obj) {
     return contains(root, obj);
   }
   private boolean contains(TreeNode t, String x) {
      if (t == null) {
         return false;
      }
      return (contains(t.getLeft(), x) || t.getValue().equals(x) || contains(t.getRight(), x));
   }
   
   public String min() {
      return min(root);
   }
   private String min(TreeNode t) {
      if (t == null) {
         //large valued character
         return "~";
      }
      String minLeft = min(t.getLeft());
      String minRight = min(t.getRight());
      //returning the minimum value obtained
      if (minLeft.compareTo(minRight) < 0 && minLeft.compareTo((String)t.getValue()) < 0) {
         return minLeft;
      }

      if (minRight.compareTo(minLeft) < 0 && minRight.compareTo((String)t.getValue()) < 0) {
         return minRight;
      }

      return (String)t.getValue();
      
   }
   
   public String max() {
      return max(this.root);
   }
   private String max(TreeNode t) {
      if (t == null) {
         //small valued character
         return " ";
      }
      String maxLeft = max(t.getLeft());
      String maxRight = max(t.getRight());
      //returning the minimum value obtained
      if (maxLeft.compareTo(maxRight) > 0 && maxLeft.compareTo((String)t.getValue()) > 0) {
         return maxLeft;
      }

      if (maxRight.compareTo(maxLeft) > 0 && maxRight.compareTo((String)t.getValue()) > 0) {
         return maxRight;
      }

      return (String)t.getValue();
   }
   
   public String toString() {
      return toString(this.root);
   }
   private String toString(TreeNode t) {//in order, with recursion
      if (t == null) {
         return "";
      }
      return toString(t.getLeft()) + t.getValue() + " " + toString(t.getRight());
   }
}
