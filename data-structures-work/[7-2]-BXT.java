// Name: REDACTED
// Date: March-18-2021
/*  Represents a binary expression tree.
 *  The BXT builds itself from postorder expressions. It can
 *  evaluate and print itself.  Also prints inorder and postorder strings. 
 */
 
import java.util.*;

public class BXT {
   private TreeNode root;
   private String operators = "+-*/";
   
   public BXT() {
      root = null;
   }
   public TreeNode getRoot() {
      return this.root;
   }

   public void buildTree(String str) {
     	String[] terms = str.split(" ");
      
      Stack<TreeNode> preList = new Stack<TreeNode>();
      for (String term : terms) {
         TreeNode toAdd = new TreeNode(term);
         
         //if it's an operator, pop the last two items off the stack and make them self's children
         if (isOperator(term)) {   
            toAdd.setRight(preList.pop());
            toAdd.setLeft(preList.pop());
         }
         
         //add it to the stack.
         preList.push(toAdd);
      }
      
      //afterwords, there should only be one item in the stack, containing all the others. This is the finished tree.
      this.root = preList.pop();
   }
   
   public double evaluateTree() {
      return evaluateNode(root);
   }
   
   private double evaluateNode(TreeNode t) {
      //if an operand, return self. If an operator, return that stuff.
      if (isOperator((String)t.getValue())) {
         return computeTerm((String)t.getValue(), evaluateNode(t.getLeft()), evaluateNode(t.getRight()));
      }
      return Double.parseDouble((String)t.getValue());
   }
   
   private double computeTerm(String s, double a, double b) {
      switch(s) {
         case "+":
            return a + b;
         case "-":
            return a - b;
         case "*":
            return a * b;
         case "/":
            return a / b;
      }
      return -2147483648;
   }
   
   private boolean isOperator(String s) {
      return (this.operators.indexOf(s) > -1);
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
    
   public String inorderTraverse() {
      return inorderTraverse(root);
   }
   
   private  String inorderTraverse(TreeNode t) {
      if (t != null) {
         return inorderTraverse(t.getLeft()) + t.getValue() + " " + inorderTraverse(t.getRight());
      }
      return "";
   }
   
   public String preorderTraverse() {
      return preorderTraverse(root);
   }
   
   private String preorderTraverse(TreeNode root) {
      if (root != null) {
         return root.getValue() + " " + preorderTraverse(root.getLeft()) + preorderTraverse(root.getRight());
      }
      return "";
   }
   
  /* extension */
   // public String inorderTraverseWithParentheses()
   // {
      // return inorderTraverseWithParentheses(root);
   // }
//    
   // private String inorderTraverseWithParentheses(TreeNode t)
   // {
      // return "";
   // }
}