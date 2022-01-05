


//the tree node class used for storing world coordinate inormation. Hyperbolic space is non-abelian, so I can't just use a relative axis coordinate system. It's weird.
class WorldTreeNode {
	constructor(sideNum, hypPoints) {
		this.distance = 1e1001;
		this.hypPoints = hypPoints;

		this.sides = sideNum;
		this.children = [];
		this.children[sideNum-1] = undefined;
		this.hasChildren = false;

		this.drawnInFrame = false;
		this.color = {h: 0, s: 0, v: 0};
	}

	makeChildren() {
		this.hasChildren = true;
		//loop through all children
		for (var h=0; h<this.children.length; h++) {
			//if there's not already a node there
			if (this.children[h] == undefined) {
				var newPoints = reflectHypPoly(this.hypPoints, h, (h + 1) % this.hypPoints.length);
				
				//create a child
				
				this.children[h] = nodeCreateOfficial(newPoints, this, h);
			}
		}
	}

	updateColor() {
		this.color = {h: this.distance * 40, s: 50, v: 70};
	}

	//like makeChildren, but only does points, not objects
	propogatePoints() {
		for (var h=0; h<this.children.length; h++) {
			if (this.children[h] != undefined && this.children[h].hypPoints == undefined) {
				this.children[h].hypPoints = reflectHypPoly(this.hypPoints, h, (h + 1) % this.hypPoints.length);
			}
		}
	}
}