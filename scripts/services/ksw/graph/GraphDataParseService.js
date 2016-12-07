"use strict";
(function () {
    angular.module("app")
        .service("GraphDataParseService", function () {
            this.getParsedData = function (dataSource) {
                dataSource.links.forEach(function (lnk) {

                    if (!dataSource.nodes[lnk.target].sourcing) {
                        dataSource.nodes[lnk.target].sourcing = [];
                    }
                    dataSource.nodes[lnk.target].sourcing.push(dataSource.nodes[lnk.source]);

                    if (!dataSource.nodes[lnk.source].targeting) {
                        dataSource.nodes[lnk.source].targeting = [];
                    }
                    dataSource.nodes[lnk.source].targeting.push(dataSource.nodes[lnk.target]);
                });
                dataSource = transferingOriginalData(dataSource);
                return createChild(dataSource);
            };

            function transferingOriginalData(dataSource) {
                dataSource._nodes = dataSource.nodes;
                dataSource.nodes = [];
                dataSource._links = dataSource.links;
                dataSource.links = [];
                return dataSource;
            }

            function createChild(serializedTreeData) {
                serializedTreeData._links.forEach(function (lnk) {
                    if (!serializedTreeData._nodes[lnk.source].children) {
                        serializedTreeData._nodes[lnk.source].children = [];
                    }
                    serializedTreeData._nodes[lnk.source].relation = lnk.label;
                    serializedTreeData._nodes[lnk.source].children
                        .push(serializedTreeData._nodes[lnk.target]);
                });

                serializedTreeData._nodes.forEach(function (nod) {
                    if (!nod.children) {
                        nod.children = null;
                    }
                });

                var dataSource = serializedTreeData._nodes[0];

                if (dataSource.children
                    && dataSource.children.length == 1
                    && dataSource.children[0].children
                    && dataSource.children[0].children.length == 1
                    && dataSource.children[0].children[0].dbId == dataSource.dbId) {
                    dataSource.children = null;
                }

               dataSource.children = sortFirstLevelChildren(dataSource);
                return dataSource;
            }

            function sortFirstLevelChildren(dataSource) {
                if (!dataSource.children)
                    return null;
                var children = dataSource.children,
                    sortedChildren = [],
                    i = 0;

                for (i = 0; i < children.length; i++) {
                    if (children[i].label == "linkTextNode"
                        && children[i].name.toLowerCase()
                        == Constants.DocumentRelationLabel.Attachment.toLowerCase()
                        && children[i].id == 0
                        && children[i].dbId == "0") {

                        sortedChildren.push(children[i]);
                        children.splice(i, 1);
                    }
                }

                for (i = 0; i < children.length; i++) {
                    if (children[i].label == "linkTextNode"
                        && children[i].name.toLowerCase()
                        == Constants.DocumentRelationLabel.CheckList.toLowerCase()
                        && children[i].id == 0
                        && children[i].dbId == "0") {

                        sortedChildren.push(children[i]);
                        children.splice(i, 1);
                    }
                }

                for (i = 0; i < children.length; i++) {
                    if (children[i].label == "linkTextNode"
                        && children[i].name.toLowerCase()
                        == Constants.DocumentRelationLabel.Post.toLowerCase()
                        && children[i].id == 0
                        && children[i].dbId == "0") {

                        sortedChildren.push(children[i]);
                        children.splice(i, 1);
                    }
                }

                sortedChildren = sortedChildren.concat(children);

                return sortedChildren;
            }
        })
})();
