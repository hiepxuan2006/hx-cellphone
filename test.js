data = [
  { id: "a1", parentId: "" },
  { id: "a2", parentId: "a1" },
  { id: "a3", parentId: "a2" },
  { id: "b1", parentId: "" },
  { id: "b2", parentId: "b1" },
  { id: "b3", parentId: "b1" },
  { id: "c1", parentId: "b3" },
  { id: "c2", parentId: "c1" },
];
var options = {
  childKey: "id",
  parentKey: "parentId",
};
const aaa = listToTree(data, options);
// console.log(JSON.stringify(aaa));

function listToTree(list, options) {
  options = options || {};
  var childKey = options.childKey || "child";
  var parentKey = options.parentKey || "parent";
  var childrenKey = options.childrenKey || "children";
  var nodeFn =
    options.nodeFn ||
    function (node, name, children) {
      return { id: name, children: children };
    };
  var nodeCache = {};
  return list.reduce(function (tree, node) {
    node[childrenKey] = [];
    nodeCache[node[childKey]] = node;

    if (typeof node[parentKey] === "undefined" || node[parentKey] === "") {
      tree = nodeFn(node, node[childKey], node[childrenKey]);
    } else {
      parentNode = nodeCache[node[parentKey]];
      parentNode[childrenKey].push(
        nodeFn(node, node[childKey], node[childrenKey])
      );
    }
    return tree;
  }, {});
}

// function walkTree(tree, visitorFn, parent) {
//   if (visitorFn == null || typeof visitorFn !== "function") {
//     return tree;
//   }
//   visitorFn.call(tree, tree, parent);
//   if (tree.children && tree.children.length > 0) {
//     tree.children.forEach(function (child) {
//       walkTree(child, visitorFn, tree);
//     });
//   }
//   return tree;
// }

// function pruneChildren(node, parent) {
//   if (node.children.length < 1) {
//     delete node.children;
//   }
// }
