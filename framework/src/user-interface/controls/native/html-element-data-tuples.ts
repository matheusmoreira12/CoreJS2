const NS = "http://www.w3.org/1999/xhtml";

export const HTML_ELEMENT_DATA_TUPLES = [
    //Extracted from: https://html.spec.whatwg.org/
    //$$("a").map(a => a.href.match(/the-(\w+)-element/)).filter(m => m).map(m => m[1]).sort((n, o) => n > o ? 1 : -1).map(n => `["${n}", typeof ${document.createElement(n).constructor.name}]`).join(", ")
    ["a", NS, "HTMLAnchorElement"],
    ["abbr", NS, "HTMLElement"],
    ["address", NS, "HTMLElement"],
    ["area", NS, "HTMLAreaElement"],
    ["article", NS, "HTMLElement"],
    ["aside", NS, "HTMLElement"],
    ["audio", NS, "HTMLAudioElement"],
    ["b", NS, "HTMLElement"],
    ["base", NS, "HTMLBaseElement"],
    ["bdi", NS, "HTMLElement"],
    ["bdo", NS, "HTMLElement"],
    ["blockquote", NS, "HTMLQuoteElement"],
    ["body", NS, "HTMLBodyElement"],
    ["br", NS, "HTMLBRElement"],
    ["button", NS, "HTMLButtonElement"],
    ["canvas", NS, "HTMLCanvasElement"],
    ["caption", NS, "HTMLTableCaptionElement"],
    ["cite", NS, "HTMLElement"],
    ["code", NS, "HTMLElement"],
    ["col", NS, "HTMLTableColElement"],
    ["colgroup", NS, "HTMLTableColElement"],
    ["data", NS, "HTMLDataElement"],
    ["datalist", NS, "HTMLDataListElement"],
    ["dd", NS, "HTMLElement"],
    ["del", NS, "HTMLModElement"],
    ["details", NS, "HTMLDetailsElement"],
    ["dfn", NS, "HTMLElement"],
    ["dialog", NS, "HTMLDialogElement"],
    ["div", NS, "HTMLDivElement"],
    ["dl", NS, "HTMLDListElement"],
    ["document", NS, "HTMLUnknownElement"],
    ["dt", NS, "HTMLElement"],
    ["em", NS, "HTMLElement"],
    ["embed", NS, "HTMLEmbedElement"],
    ["fieldset", NS, "HTMLFieldSetElement"],
    ["figcaption", NS, "HTMLElement"],
    ["figure", NS, "HTMLElement"],
    ["footer", NS, "HTMLElement"],
    ["form", NS, "HTMLFormElement"],
    ["head", NS, "HTMLHeadElement"],
    ["header", NS, "HTMLElement"],
    ["hgroup", NS, "HTMLElement"],
    ["hr", NS, "HTMLHRElement"],
    ["html", NS, "HTMLHtmlElement"],
    ["i", NS, "HTMLElement"],
    ["img", NS, "HTMLImageElement"],
    ["input", NS, "HTMLInputElement"],
    ["ins", NS, "HTMLModElement"],
    ["kbd", NS, "HTMLElement"],
    ["label", NS, "HTMLLabelElement"],
    ["legend", NS, "HTMLLegendElement"],
    ["li", NS, "HTMLLIElement"],
    ["link", NS, "HTMLLinkElement"],
    ["main", NS, "HTMLElement"],
    ["map", NS, "HTMLMapElement"],
    ["mark", NS, "HTMLElement"],
    ["marquee", NS, "HTMLMarqueeElement"],
    ["menu", NS, "HTMLMenuElement"],
    ["meter", NS, "HTMLMeterElement"],
    ["nav", NS, "HTMLElement"],
    ["noscript", NS, "HTMLElement"],
    ["object", NS, "HTMLObjectElement"],
    ["ol", NS, "HTMLOListElement"],
    ["optgroup", NS, "HTMLOptGroupElement"],
    ["option", NS, "HTMLOptionElement"],
    ["output", NS, "HTMLOutputElement"],
    ["p", NS, "HTMLParagraphElement"],
    ["picture", NS, "HTMLPictureElement"],
    ["pre", NS, "HTMLPreElement"],
    ["progress", NS, "HTMLProgressElement"],
    ["q", NS, "HTMLQuoteElement"],
    ["rp", NS, "HTMLElement"],
    ["rt", NS, "HTMLElement"],
    ["ruby", NS, "HTMLElement"],
    ["s", NS, "HTMLElement"],
    ["samp", NS, "HTMLElement"],
    ["script", NS, "HTMLScriptElement"],
    ["section", NS, "HTMLElement"],
    ["select", NS, "HTMLSelectElement"],
    ["slot", NS, "HTMLSlotElement"],
    ["small", NS, "HTMLElement"],
    ["source", NS, "HTMLSourceElement"],
    ["span", NS, "HTMLSpanElement"],
    ["strong", NS, "HTMLElement"],
    ["style", NS, "HTMLStyleElement"],
    ["summary", NS, "HTMLElement"],
    ["table", NS, "HTMLTableElement"],
    ["tbody", NS, "HTMLTableSectionElement"],
    ["td", NS, "HTMLTableCellElement"],
    ["template", NS, "HTMLTemplateElement"],
    ["textarea", NS, "HTMLTextAreaElement"],
    ["tfoot", NS, "HTMLTableSectionElement"],
    ["th", NS, "HTMLTableCellElement"],
    ["thead", NS, "HTMLTableSectionElement"],
    ["time", NS, "HTMLTimeElement"],
    ["title", NS, "HTMLTitleElement"],
    ["tr", NS, "HTMLTableRowElement"],
    ["track", NS, "HTMLTrackElement"],
    ["u", NS, "HTMLElement"],
    ["ul", NS, "HTMLUListElement"],
    ["var", NS, "HTMLElement"],
    ["video", NS, "HTMLVideoElement"],
    ["wbr", NS, "HTMLElement"]
] as const;