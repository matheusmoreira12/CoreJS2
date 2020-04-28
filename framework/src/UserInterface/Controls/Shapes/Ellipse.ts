import { Blender } from "../../../Standard/Blender/index.js";
import { DependencyObject } from "../../DependencyObjects/index.js";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index.js";
import { Shape } from "./index.js";
import { DOMControl } from "../DOMControl.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Ellipse extends Shape {
   constructor(name: string) {
       super(name);

       const PART_ellipse = new DOMControl("ellipse", SVG_NS);
       PART_ellipse.attributes.setMany({
           cx: "50%",
           cy: "50%",
           rx: "50%",
           ry: "50%"
       });
       this.__PART_canvas.children.add(PART_ellipse);
       this.__PART_ellipse = PART_ellipse;

       new PropertyAttributeBinding(Blender.get(DependencyObject, this), Shape.fillProperty, <Element>this.__PART_ellipse.domElement, "fill", null, { direction: BindingDirection.ToTarget });
   }

   protected __PART_ellipse!: DOMControl;
}