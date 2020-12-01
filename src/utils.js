export function textNodesUnder(el, dom) {
  var n,
    a = [],
    walk = el.createTreeWalker(
      el,
      dom.window.NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Logic to determine whether to accept, reject or skip node
          // In this case, only accept nodes that have content
          // other than whitespace
          console.log(node.parentNode.tagName);
          if (node.parentNode.tagName!=='style') {
            return dom.window.NodeFilter.FILTER_ACCEPT
          }
        }
      },
      false
    );
  while ((n = walk.nextNode())) {
    a.push(n);
  }
  return a;
}
