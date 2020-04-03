import { Blender } from "../../../Standard/Blender/index.js";
import { DependencyObject } from "../../DependencyObjects/index.js";
import { PropertyAttributeBinding, BindingDirection } from "../../Bindings/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";
import { Control, ControlManager } from "../index.js";
import { Shape } from "./index.js";

const SVG_NS = "http://www.w3.org/2000/svg";

export class Ellipse extends Shape {
   constructor(qualifiedName: string, namespaceURI: string | null) {
       super(qualifiedName, namespaceURI);

       const PART_ellipse = VisualTreeElement.create("ellipse", SVG_NS);
       PART_ellipse.attributes.setMany({
           cx: "50%",
           cy: "50%",
           rx: "50%",
           ry: "50%"
       });
       this.__PART_canvas.children.add(PART_ellipse);
       this.__PART_ellipse = PART_ellipse;

       Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Control.foregroundProperty, <Element>this.__PART_ellipse.domElement, "fill", null, { direction: BindingDirection.ToTarget }));
   }

   protected __PART_ellipse!: VisualTreeElement;
}
ControlManager.register(Ellipse, "core:Ellipse", "core");