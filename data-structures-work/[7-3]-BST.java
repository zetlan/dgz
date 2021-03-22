//Name: REDACTED
//Date: March-22-2021

interface BSTinterface {
   public int size();
   public boolean contains(String obj);
   public void add(String obj);
   public void addBalanced(String obj);
   public void remove(String obj);
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

   public void addBalanced(String value) {
      if (size == 0) {
         root = new TreeNode(value);
      } else {
         add(root, value);
      }
      size++;
      //I have no idea what these other two arguments are supposed to do so I just deleted them
      //root = balanceTree(null, root, true);
      root = balanceTree(root);
   }

   //I have no idea what these other two
   public TreeNode balanceTree(TreeNode node) {
      if (node == null) {
         return null;
      }

      //first balance children
      node.setLeft(balanceTree(node.getLeft()));
      node.setRight(balanceTree(node.getRight()));

      //determining if self should balance. Self will balance if they're "critically unbalanced" (have an imbalance of -2 or 2)
      boolean shouldBalance = (java.lang.Math.abs(getBalance(node)) == 2);

      if (!shouldBalance) {
         //if shouldn't balance, don't care
         return node;
      }

      //determine type of balance
      if (getBalance(node) == -2) {
         //left-right, turn it in to left-left
         if (getBalance(node.getLeft()) == 1) {
            //this is wacky organizational magic just trust me
            TreeNode l = node.getLeft();
            TreeNode r = l.getRight();

            l.setRight(r.getLeft());
            r.setLeft(l);
            node.setLeft(r);
         }

         //left-left balance via right rotation
         TreeNode l = node.getLeft();
         TreeNode t = node;

         node = l;
         t.setLeft(l.getRight());
         l.setRight(t);
      } else {
         //right-left, turn it in to right-right
         if (getBalance(node.getRight()) == -1) {
            TreeNode r = node.getRight();
            TreeNode l = r.getLeft();
            r.setLeft(l.getRight());
            l.setRight(r);
            node.setRight(l);
         }
         TreeNode r = node.getRight();
         TreeNode t = node;

         node = r;
         t.setRight(r.getLeft());
         r.setLeft(t);
      }

      return node;
   }

   public int getBalance(TreeNode node) {
      return depth(node.getRight()) - depth(node.getLeft());
   }

   public int depth(TreeNode node) {
      //for empty tree, return -1
      if (node == null) {
         return -1;
      }

      //for a regular tree do the cool search thing I guess
      return java.lang.Math.max(depth(node.getLeft()), depth(node.getRight())) + 1;
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

      if (minLeft.compareTo((String)t.getValue()) >= 0 && minRight.compareTo((String)t.getValue()) >= 0) {
         return (String)t.getValue();
      }
      System.out.println("help!!");
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

   public void remove(String target) {
      root = remove(root, target);
      size--;
   }
   private TreeNode remove(TreeNode current, String target) {
      //if self is null, return null
      if (current == null) {
         return null;
      }

      //if current isn't the target, recurse and then return self
      if (target.compareTo((String)current.getValue()) != 0) {
         current.setLeft(remove(current.getLeft(), target));
         current.setRight(remove(current.getRight(), target));
         return current;
      }

      //if current is the target

      //if self has two children take the min value of the right subtree and replace self with it
      if ((current.getLeft() != null && current.getRight() != null)) {
         String newVal = min(current.getRight());
         //remove value from the tree
         current.setRight(remove(current.getRight(), newVal));
         current.setValue(newVal);
         return current;
      }

      //if self has one / no children, return the right value. (will be null if no children)
      if (current.getLeft() != null) {
         return current.getLeft();
      }
      return current.getRight();
   }
}